/*
 * Provides assistance with general book of proverbs structure.
 * Translation independent
 * Code for Christ, 1/23/2020
 */

import {IVerseSignature, IVerseMeta, IVerse} from "./Interfaces"
import structure from "../indexing/ProverbsStructure.json"
import sayingsStructure_Any from '../indexing/Sayings.json'
import statementStructure_Any from '../indexing/Statements.json'

type ISayingIndex = {
    Ch: number,
    Vs: number
};

type ISayingRange = {
    Start: ISayingIndex,
    End: ISayingIndex
};

type IStatementRange = {
    Title: string,
    Intro: {
        Ch: number,
        Vs: number,
        Part: boolean
    }
    Start: ISayingIndex,
    End: ISayingIndex
};

type IStatementRanges = Array<IStatementRange>;

type IStatementStructure = {
    _comment: string,
    Range: IStatementRanges
};

type ISayings = Record<string, ISayingRange>;

type ISayingSection= {
    Title: string
    Sayings: ISayings
};

type ISayingSections = Array<ISayingSection>;
type ISayingStructure = {
    _comment: string,
    Sections: ISayingSections
};

export default class Indexer {

    static GetVerseID(Chapter: number, Verse: number) {
        return Chapter * 1000 + Verse;
    }

    static GetVerseSignature(VerseID: number) {
        let verse : IVerseSignature = {
            Chapter: Math.floor(VerseID/1000),
            VerseNumber: VerseID % 1000
        };
        return verse;
    }

    static PermuteVerses() {
        /* accumulate chapter verses */
        let verses : Array<IVerseSignature> = Object.entries(structure.Verses).reduce(
            (v : Array<IVerseSignature>, args : [string, number]) => {
                const [chapter, verseNumber] = args;

                /* chapter verses */
                let chapterVerses:Array<IVerseSignature> = [];
                for (let i = 0; i < verseNumber; ++i) {
                    const verse: IVerseSignature = {
                        Chapter: parseInt(chapter),
                        VerseNumber: i + 1
                    };
                    v.push(verse);
                }
                return v;
            }
        , []);
        return verses;
    }

    static IsVerseBetween(verse: IVerseSignature, start: IVerseSignature, end: IVerseSignature)
    {
        // chapter bounds
        if (verse.Chapter < start.Chapter || verse.Chapter > end.Chapter)
        {
            return false;
        }

        // verse bounds
        if (verse.Chapter == start.Chapter && verse.VerseNumber < start.VerseNumber
            || verse.Chapter == end.Chapter && verse.VerseNumber > end.VerseNumber)
        {
            return false;
        }

        // in bounds
        return true;
    }

    static GetVerseType(VerseID: number): IVerseMeta {
        const sayingsStructure: ISayingStructure = sayingsStructure_Any;
        const statementStructure: IStatementStructure = statementStructure_Any;
        const verse = this.GetVerseSignature(VerseID);

        const isSaying = () => {

            for (const [secID, section] of Object.entries(sayingsStructure.Sections))
            {
                for (const [sayID, sayingRange] of Object.entries(section.Sayings))
                {
                    // check in range
                    const start: IVerseSignature = {
                        Chapter: sayingRange.Start.Ch,
                        VerseNumber: sayingRange.Start.Vs
                    };
                    const end: IVerseSignature = {
                        Chapter: sayingRange.End.Ch,
                        VerseNumber: sayingRange.End.Vs
                    };
                    const inRange: boolean = this.IsVerseBetween(verse, start, end);

                    // found range
                    if (inRange) {
                        const gID: number = parseInt(secID + 1) * 1000 + parseInt(sayID);
                        return {
                            found: true,
                            types: ["Saying"],
                            group: gID
                        }
                    }
                }
            }

            // not found in records
            return {
                found: false
            };
        };

        const isStatement = () => {
            for (const range of statementStructure.Range) {
                // check in range
                const start: IVerseSignature = {
                    Chapter: range.Start.Ch,
                    VerseNumber: range.Start.Vs
                };
                const end: IVerseSignature = {
                    Chapter: range.End.Ch,
                    VerseNumber: range.End.Vs
                };
                const inRange: boolean = this.IsVerseBetween(verse, start, end);
                // found
                if (inRange) {
                    if (verse.Chapter === range.Intro.Ch
                        && verse.VerseNumber === range.Intro.Vs)
                    {
                        // part
                        if (range.Intro.Part)
                        {
                            return {
                                found: true,
                                types: ["Intro","Statement"]
                            };
                        }
                        else
                        {
                            return {
                                found: true,
                                types: ["Intro"],
                                group: VerseID
                            };
                        }
                    }
                    return {
                        found: true,
                        types: ["Statement"],
                        group: VerseID
                    };
                }
            }
            return {
                found: false
            };
        };

        // return values
        const sayingRes = isSaying();
        if (sayingRes.found) {return sayingRes;}

        const statementRes = isStatement();
        if (statementRes.found) {return statementRes;}
        return {
            found: true,
            types: ["Article"],
            group: 1, // FOR NOW: all articles are bundled.
        };
    }

    static LoadVerseMetadata(verse: IVerseSignature) {
        const meta = this.GetVerseType(this.GetVerseID(verse.Chapter, verse.VerseNumber));
        if (meta.types) {
            verse.Type = meta.types[0];
        }
        if (meta.group) {
            verse.GroupID = meta.group
        }
    }

    static SearchVerseHighlight(verse: IVerse, pattern: string): boolean {
        const regex = new RegExp(pattern, "gi");
        let result: RegExpExecArray | null;
        let test = false;

        while ((result = regex.exec(verse.Content)) !== null) {
            test = true;
            if (!verse.SearchHighlights)
            {
                verse.SearchHighlights = [];
            }

            // Push highlights
            verse.SearchHighlights.push({
                iStart: result.index,
                iEnd: result.index + result[0].length
            });
        }

        return test;
    }

    static SearchVerseClear(verse: IVerse) {
        verse.SearchHighlights = undefined;
    }
}