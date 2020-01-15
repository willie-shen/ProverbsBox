/*
 * Filter Bank
 * A collection of filters be used for proverb selection
 * Add to ProverbData filter
 * Code for Christ, Jan 4, 2020
 */

import {IProverb, IFilter} from './ProverbInterface';

export const Filters : {[name:string] : (input?: any) => [string, IFilter]} = {
    /*
        Example:
        FilterName :
            FilterGenerator(someInput)
                Returns:
                [
                    UniqueFilterID,
                    Filter
                ]
     */

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
};
