/*
 * Filter Collection
 * A collection of filters be used for proverb selection
 * Add to ProverbData filter
 *
 * Description:
 * Create a filter callback function using one of the following generator functions.
 * Add to filterBank (via ContentManager API)
 *
 * Code for Christ, Jan 4, 2020
 */

import {IVerseSignature, IFilter} from './Interfaces';
import Indexer from './Indexer'

export const Filters : {[name:string] : (input1?: any, input2?: any) => [string, IFilter]} = {
    /*
        Example:
        FilterName :
            FilterGenerator(someInput)
                Returns:
                [
                    UniqueFilterID: string,
                    Filter
                ]
     */

    BySpan : (start:IVerseSignature, end:IVerseSignature) => {
        const filter : IFilter = (verse : IVerseSignature) => {
            return Indexer.IsVerseBetween(verse, start, end);
        };
        return [
            "Span",
            filter]
    },

    /*
    The following nearly works but should be reformatted to return a callback that takes a verse signature
    ByChapter : (chapter : number) => {
        const filter : IFilter = (proverb : IProverb) => (chapter === proverb.Chapter);
        return [
            "Chapter",
            filter]
    },

    ByContent : (text : string) => {
        const filter : IFilter = (proverb) => {
            return proverb.Content.toLowerCase()
                .includes(text.toLowerCase());
        };
        return [
            "Content",
            filter];
    },

    BySaved : () => ["Saved", (proverb) => proverb.Saved]

    */
};
