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

    filters: Array<IFilter>;
    translator: TranslationMap;
    translatorLoading: boolean;

    constructor() {
        this.filters = [];
        this.translator = new TranslationMap();
        this.translatorLoading = false;
    }

    async LoadTranslation(translationName: string) {
        this.translatorLoading = true;
        this.translator.AddOnLoadedCallback(()=>{this.translatorLoading = false;});
        await this.translator.LoadTranslation(translationName);
    }

    GetModel() {
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
            // get unique group name
            let groupName;
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

            if (!bundle[0].Type) {
                throw Error("Type must be defined for VerseSignature when creating models");
            }

            let type: string = bundle[0].Type;
            let model: IStatement | IArticle | ISaying | ITitle | undefined = undefined;

            // Statement
            if (bundle[0].Type === "Statement") {
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

            // Title
            else if (bundle[0].Type === "Title") {
                model = {
                    Text: verses[0].Content,
                    Ref: "" + "Proverbs " + verses[0].Chapter + verses[0].VerseNumber
                }
            }

            if (!model) {
                throw Error("model not set (undefined)");
            }

            return {
                Type: type,
                Model: model
            };
        });

        // generate model
        const model: IModel = {
            ComponentModels: componentModels,
            FilterNames: this.filters.map(f => f.name),
            Translation: this.translator.GetTranslationName()
        };

        // return
        return model;
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
    }

    // Remove a filter by filter name
    RemoveFilter(filterName: string) {
        this.filters = this.filters.filter(f => {
            return f.name !== filterName;
        });

        // For efficiency, add option: remove search pool
    }

}