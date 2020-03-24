import Indexer from "./Indexer"
import TranslationMap from "./TranslationMap"
import StorageAssistant from "./StorageAssistant"
import {FilterGenerators} from "./FilterCollection"
import {
    IVerseSignature,
    IVerse,
    IFilter,
    IStatement,
    IArticle,
    ISaying,
    ITitle,
    IModel,
    IComponentModel
} from "./Interfaces"

export default class ContentManager {

    /*
     * Methods Summary
     *  (async) LoadTranslation(translationName: string)
     *  GetModel()
     *  UpdateSearch(text: string)
     *  Bookmark(verse: IVerseSignature)
     *  RemoveBookmark(verse: IVerseSignature)
     *  ApplyFilter(filter: IFilter)
     *  RemoveFilter(filterName: string)
     */

    private storageAssistant: StorageAssistant;
    private filters: Array<IFilter>;
    private searchPattern: string;
    private translator: TranslationMap;
    private translatorLoading: boolean;
    private componentModels: Array<IComponentModel>;
    private refinedModels: Array<IComponentModel>;

    constructor() {
        this.storageAssistant = new StorageAssistant();
        this.filters = [];
        this.searchPattern = "";
        this.translator = new TranslationMap();
        this.translatorLoading = false;
        this.componentModels = [];
        this.refinedModels = [];
    }

    async LoadTranslation(translationName: string) {
        this.translatorLoading = true;
        this.translator.LoadTranslation(translationName);

        let translationPromise = new Promise((resolve, reject) => {
            this.translator.AddOnLoadedCallback(()=>{
                this.translatorLoading = false;
                this.RefreshModels();
                this.RefineSearch();
                resolve();
            });
        });

        return translationPromise;
    }

    OnLoadTranslation(func: () => void) {
        this.translator.AddOnLoadedCallback(func);
    }

    GetTranslationName() {
        return this.translator.GetTranslationName();
    }

    GetModel() {
        // sentinel
        if (this.translator.GetTranslationName() === "NONE" || this.translator.GetTranslationName() === "LOADING")
        {
            return {
                ComponentModels: [],
                FilterNames: [],
                Translation: "NONE",
            }
        }

        // generate model
        const model: IModel = {
            ComponentModels: this.refinedModels,
            FilterNames: this.filters.map(f => f.name),
            Translation: this.translator.GetTranslationName()
        };

        // return
        return model;
    }

    UpdateSearch(text: string) {
        this.searchPattern = text;
        this.RefineSearch();
    }

    Bookmark(verse: IVerseSignature) {
        const verseID = Indexer.GetVerseID(verse.Chapter, verse.VerseNumber);
        this.storageAssistant.BookmarkVerse(verseID);
        this.ToggleSaved(verse, true);
    }

    private ToggleSaved(verse:IVerseSignature, toggleSaved:boolean) {
        [this.componentModels, this.refinedModels].forEach(models => {
            const target = models.filter(m => {
                if (m.Type === "Saying") {
                    const v = (m.Model as ISaying).Verses[0];
                    return v.VerseNumber === verse.VerseNumber
                        && v.Chapter === verse.Chapter;
                }
                else if (m.Type === "Statement") {
                    const v = (m.Model as IStatement).Verse;
                    return v.Chapter === verse.Chapter
                        && v.VerseNumber === verse.VerseNumber;
                }
                return false;
            })[0];
            (target.Model as (IStatement | ISaying)).Saved = toggleSaved;
        });
    }

    RemoveBookmark(verse: IVerseSignature) {

    }

    // Automatically updates old copy of a filter
    ApplyFilter(filterName: string, ...filterParams: any) {

        // check if filter is present
        /*let notPresent = this.filters.every(f => {
            return f.name !== filter.name;
        });*/

        // verify filter
        if (!(filterName in FilterGenerators)) {
            throw Error("Filter: " + filterName + ", is not found. Please add a filter generator to ./api/FilterCollection.ts");
        }

        // get generator
        let filterGenerator = FilterGenerators[filterName];

        // verify params
        if (filterParams.length !== filterGenerator.length) {
            throw Error("Filter Generator for: " + filterName + ", takes " + filterGenerator.length + " params. See ./api/FilterCollection.ts");
        }

        // run generator
        let filter = filterGenerator(...filterParams);
        filter.name = filterName;

        // ---- For efficiency ----
        // add option: refine search pool if filter not replaced.

        // remove old version
        this.RemoveFilter(filter.name);

        // add filter
        this.filters.push(filter);

        // refresh models
        if (this.translator.IsReady()) {
            this.RefreshModels();
        }
    }

    // Remove a filter by filter name
    RemoveFilter(filterName: string) {
        this.filters = this.filters.filter(f => {
            return f.name !== filterName;
        });

        // For efficiency, add option: remove search pool

        // refresh models
        // sentinel
        if (this.translator.IsReady()) {
            this.RefreshModels();
        }
    }

    private UpdateBookmarkModelCache(verseID: number, isBookmarked: boolean) {

        // update cached models
        const batch = [this.componentModels, this.refinedModels];
        batch.forEach(models => {
            models.forEach(m => {
                if (m.Type === "Statement") {
                    const model = m.Model as IStatement;
                    if (Indexer.GetVerseID(model.Verse.Chapter, model.Verse.VerseNumber) === verseID) {
                        model.Saved = isBookmarked;
                    }
                }
                else if (m.Type === "Sayings") {
                    const model = m.Model as ISaying;
                    if (Indexer.GetVerseID(model.Verses[0].Chapter, model.Verses[0].VerseNumber) === verseID) {
                        model.Saved = isBookmarked;
                    }
                }
                else if (m.Type === "Article") {
                    // Potentially add highlight/notes
                }
            })
        });
    }

    private RefreshModels() {

        // filter verses
        let signatures = Indexer.PermuteVerses();
        this.filters.forEach(f => {
            signatures = signatures.filter(f.callback);
        });

        // load verse metadata
        signatures.forEach(s => {
            Indexer.LoadVerseMetadata(s);
        });

        // bundle verses
        let bundles = signatures.reduce<{[groupName: string]: Array<IVerseSignature>;}>((acc, cur) => {

            let groupName;
            // deal with titles (Too difficult for now)
            /*
            if (cur.TitlePrefix){
                // Title & Statement
                groupName = "title-" + cur.GroupID;
                acc[groupName] = [];
                acc[groupName].push({
                    Chapter: cur.Chapter,
                    VerseNumber: cur.VerseNumber,
                    GroupID: cur.GroupID,
                    Type: "Title"
                    TitlePrefix?: boolean
                });
                model = {
                    Text: verses[0].Content.split(".")[0] + ".",
                    Ref: "" + "Proverbs " + verses[0].Chapter + verses[0].VerseNumber
                };

                // update bundle
                verses[0].Content = verses[0].Content.split(".")[1].trimLeft();
                bundle[0].Type.shift()
            }
            */

            // get unique group name
            if (cur.Type) {
                groupName = cur.Type;
            }
            else {
                throw Error("verse must have type to be bundled");
            }
            if (cur.GroupID) {
                groupName += "-";
                groupName += cur.GroupID;
            }

            // init group
            if (!(groupName in acc)) {
                acc[groupName] = [];
            }

            // add to group
            acc[groupName].push(cur);

            // return result
            return acc;
        }, {});

        // map bundles to models
        const componentModels: Array<IComponentModel> = Object.values(bundles).map(bundle => {
            const verses: Array<IVerse> = bundle.map(v => {
                return this.translator.GetContent(Indexer.GetVerseID(v.Chapter, v.VerseNumber));
            });

            // Discard titles :( [fix later] (not turned into title component models)
            if (bundle[0].TitlePrefix) {
                bundle[0].TitlePrefix = verses[0].Content.split(".")[0] + ".";
                try {
                    verses[0].Content = verses[0].Content.split(".")[1].trimLeft();
                }
                catch {
                    throw Error("Verse " + verses[0].Chapter + " : " + verses[0].VerseNumber
                        + " only has one sentence, expected a title and a(n) " + bundle[0].Type);
                }
            }

            if (!bundle[0].Type) {
                throw Error("Type must be defined for VerseSignature when creating models");
            }

            let type: string = bundle[0].Type;
            let model: IStatement | IArticle | ISaying | ITitle | undefined = undefined;

            // Title
            if (bundle[0].Type === "Title") {
                model = {
                    Text: verses[0].Content,
                    Ref: "Proverbs " + verses[0].Chapter + verses[0].VerseNumber
                }
            }

            // Statement
            else if (bundle[0].Type === "Statement") {
                const statement = verses[0];
                const verseID = Indexer.GetVerseID(statement.Chapter, statement.VerseNumber);
                model = {
                    Verse: statement,
                    Saved: this.storageAssistant.isBookmarked(verseID),
                    ID: verseID
                };
            }

            // Saying
            else if (bundle[0].Type === "Saying") {
                if (!bundle[0].GroupID) {
                    throw Error("GroupID must be defined for Sayings when creating model");
                }
                model = {
                    Verses: verses,
                    Saved: false,  // ADD MEMORY COMPONENT
                    ID: bundle[0].GroupID
                };
            }

            // Article
            else if (bundle[0].Type === "Article") {
                if (!bundle[0].GroupID) {
                    throw Error("GroupID must be defined for Article when creating model");
                }
                model = {
                    Verses: verses,
                    ID: bundle[0].GroupID
                };
            }

            if (!model) {
                console.log("bundle failure: ", bundle);
                throw Error("model not set (undefined)");
            }

            return {
                Type: type,
                Model: model
            };
        });
        this.componentModels = componentModels;
        this.RefineSearch();
    }

    private RefineSearch(): void {
        if (this.searchPattern === "")
        {
            this.refinedModels = this.componentModels;
            return;
        }

        let ore: Array<IComponentModel | undefined> = this.componentModels.map((m: IComponentModel) => {

            // Saying search (all in or all out)
            if (m.Type === "Saying") {
                const model = m.Model as ISaying;
                const keepSaying = model.Verses.map(verse => { // replace with for loop?
                    Indexer.SearchVerseClear(verse);
                    Indexer.SearchVerseHighlight(verse, this.searchPattern);
                    return verse;
                })
                    .some(isHighlighted => isHighlighted);

                // original m is altered to contain highlighted features.
                if (keepSaying) {
                    return m;
                }

                else {
                    return undefined;
                }
            }

            // Statement search (in or out)
            else if (m.Type === "Statement") {
                const model = m.Model as IStatement;
                Indexer.SearchVerseClear(model.Verse);
                if (Indexer.SearchVerseHighlight(model.Verse, this.searchPattern)) {
                    return m;
                }
                else {
                    return undefined;
                }
            }

            // Article search (filter by verse)
            else if (m.Type === "Article") {
                const model = m.Model as IArticle;
                const refinedVerses = model.Verses.filter(v => {
                    return Indexer.SearchVerseHighlight(v, this.searchPattern);
                });

                if (refinedVerses.length === 0) {
                    return undefined;
                }
                else {
                    const refinedArticle = {
                        Type: "Article",
                        Model: {
                            Verses: refinedVerses,
                            ID: model.ID
                        }
                    };
                    return refinedArticle;
                }
            }

            // Don't alter titles
            else if (m.Type === "Title") {
                return m;
            }

            // Failure
            else {
                return undefined;
            }
        });

        // remove dross
        const refinedModel = ore.filter(m => !!m);

        // cache models
        this.refinedModels = refinedModel as Array<IComponentModel>;
        return;
    }
}
