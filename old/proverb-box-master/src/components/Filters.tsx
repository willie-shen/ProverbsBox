/*
 * Filter Bank
 * A collection of filters be used for proverb selection
 * Add to ProverbData filter
 * Code for Christ, Jan 4, 2020
 */

import {IProverb, IFilter} from './ProverbInterface';

export interface IVerse {
    Chapter: number,
    Verse: number,
}

export const Filters : {[name:string] : (input1?: any, input2?: any) => [string, IFilter]} = {
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

    BySpan : (start:IVerse, end:IVerse) => {
        const filter : IFilter = (proverb : IProverb) => {
            // chapter bounds
            if (proverb.Chapter < start.Chapter || proverb.Chapter > end.Chapter)
            {
                return false;
            }

            // verse bounds
            if ( (proverb.Chapter === start.Chapter && proverb.Verse < start.Verse)
                || (proverb.Chapter === end.Chapter && proverb.Verse > end.Verse))
            {
                return false;
            }

            return true;
        };
        return [
            "Span",
            filter]
    },

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
