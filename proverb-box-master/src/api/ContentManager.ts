import Indexer from "./Indexer"
import TranslationMap from "./TranslationMap"
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
     *  RefineSearch(): Array<IComponentModel>
     *  GetModel()
     *  ApplyFilter(filter: IFilter)
     *  RemoveFilter(filterName: string)
     */

    filters: Array<IFilter>;
    searchExp: string;
    translator: TranslationMap;
    translatorLoading: boolean;
    componentModels: Array<IComponentModel>;

    constructor() {
        this.filters = [];
        this.searchExp = "";
        this.translator = new TranslationMap();
        this.translatorLoading = false;
        this.componentModels = [];
    }

    async LoadTranslation(translationName: string) {
        this.translatorLoading = true;
        this.translator.LoadTranslation(translationName);

        let translationPromise = new Promise((resolve, reject) => {
            this.translator.AddOnLoadedCallback(()=>{
                this.translatorLoading = false;
                this.RefreshModels();
                resolve();
            });
        });

        return translationPromise;
    }

    RefineSearch(): Array<IComponentModel> {
        if (this.searchExp === "")
        {
            return this.componentModels;
        }

        let ore: Array<IComponentModel | undefined> = this.componentModels.map((m: IComponentModel) => {

            // Saying search (all in or all out)
            if (m.Type === "Saying") {
                const model = m.Model as ISaying;
                const keepSaying = model.Verses.map(verse => {
                    Indexer.SearchVerseClear(verse);
                    Indexer.SearchVerseHighlight(verse, this.searchExp);
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
                if (Indexer.SearchVerseHighlight(model.Verse, this.searchExp)) {
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
                    return Indexer.SearchVerseHighlight(v, this.searchExp);
                });

                if (refinedVerses.length == 0) {
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

        const refinedModel = ore.filter(m => !!m);
        return refinedModel as Array<IComponentModel>;
    }

    GetModel() {
        // generate model
        const model: IModel = {
            ComponentModels: this.componentModels,
            FilterNames: this.filters.map(f => f.name),
            Translation: this.translator.GetTranslationName()
        };

        // return
        return model;
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
                verses[0].Content = verses[0].Content.split(".")[1].trimLeft();
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
                    Ref: "" + "Proverbs " + verses[0].Chapter + verses[0].VerseNumber
                }
            }

            // Statement
            else if (bundle[0].Type === "Statement") {
                const statement = verses[0];
                model = {
                    Verse: statement,
                    Saved: false,  // ADD MEMORY COMPONENT
                    ID: Indexer.GetVerseID(statement.Chapter, statement.VerseNumber)
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
    }

    UpdateSearch(text: string) {

    }

    Bookmark(verse: IVerseSignature) {

    }

    // Automatically updates old copy of a filter
    ApplyFilter(filter: IFilter) {

        // check if filter is present
        /*let notPresent = this.filters.every(f => {
            return f.name !== filter.name;
        });*/

        // ---- For efficiency ----
        // add option: refine search pool if filter not replaced.

        // remove old version
        this.RemoveFilter(filter.name);

        // add filter
        this.filters.push(filter);

        // refresh models
        this.RefreshModels();
    }

    // Remove a filter by filter name
    RemoveFilter(filterName: string) {
        this.filters = this.filters.filter(f => {
            return f.name !== filterName;
        });

        // For efficiency, add option: remove search pool

        // refresh models
        this.RefreshModels();
    }

}