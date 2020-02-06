/*
 * Provides assistance with general book of proverbs structure.
 * Translation independent
 * Code for Christ, 1/23/2020
 */

import {IVerseSignature} from "./Interfaces"
import structure from "../indexing/ProverbsStructure.json"
import sayingsStructure from '../indexing/Sayings.json'
import statementStructure from '../indexing/Statements.json'

/*
{
    "_comment": "Sayings outline",
    "Sections": [
        {
            "Title": "Thirty Sayings of the Wise",
            "Sayings": {
                "1": {
                    "Start": {
                        "Ch": 22,
                        "Vs": 17
                    },
                    "End": {
                        "Ch": 22,
                        "Vs": 21
                    }
                }
            }
        }
    ]
}
*/
/*
Range": [
{
    "Title": "Proverbs of Solomon",
    "Intro": {
    "Ch": 25, "Vs": 1, "Part": true
},
    "Start": {
    "Ch": 10,
        "Vs": 1
},
    "End": {
    "Ch": 22,
        "Vs": 16
}
},
{
    "Title": "More Proverbs of Solomon",
    "Intro": {"Ch": 25, "Vs": 1, "Part": false},
    "Start": {
    "Ch": 25,
        "Vs": 1
},
    "End": {
    "Ch": 29,
        "Vs": 27
}
}
]
*/

type ISayingIndex = {
    Ch: number,
    Vs: number
}

type ISayingRange = {
    Start: ISayingIndex,
    End: ISayingIndex
}

type IStatementRange = {
    Title: string,
    Intro: {
        Ch: number,
        Vs: number,
        Part: boolean
    }
    Start: ISayingIndex,
    End: ISayingIndex
}

type IStatementStructure = Array<IStatementRange>

type ISayings = Record<string, ISayingRange>

type ISayingSection= {
    Title: string
    Sayings: ISayings
}

type ISayingSections = Array<ISayingSection>


export default class Indexer {

    static GetVerseID(Chapter: number, Verse: number) {
        return Chapter * 1000 + Verse;
    }

    static GetVerse(VerseID: number) {
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

    static GetVerseType(VerseID: number) {
        const verse = this.GetVerse(VerseID);

        const isSaying = () => {
            for (const section of sayingsStructure.Sections)
            {
                for (const sayingRange of Object.values(section.Sayings))
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
                    if (inRange) return ["Saying"];
                }
            }

            // not found in records
            return [];
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
                            return ["Intro", "Statement"];
                        }
                        else
                        {
                            return ["Intro"];
                        }
                    }
                }
            }
            return [];
        };

        // return values
        const sayingRes = isSaying();
        if (sayingRes !== []) {return sayingRes;}
        const statementRes = isStatement();
        if (statementRes) {return statementRes;}
        return ["Article"];
    }
}