import Indexer from "./Indexer"
import TranslationMap from "./TranslationMap"
import {FilterGenerators} from "./FilterCollection"
import {IVerseSignature, IFilter} from "./Interfaces"

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
        let signatures = Indexer.PermuteVerses();
        this.filters.forEach(f => {
            signatures = signatures.filter(f.callback);
        });
        let unbundled = signatures.map(s => {

        })
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