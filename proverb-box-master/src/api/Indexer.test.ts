
import Indexer from "./Indexer"
import * as I from "./Interfaces"
import TranslationMap from "./TranslationMap"
import data from "../../public/assets/translations/KJV-Proverbs.json";

describe("Indexer", () => {
    it("gets ID correctly", () => {
        expect(Indexer.GetVerseID(1, 2)).toBe(1002);
        expect(Indexer.GetVerseID(21, 23)).toBe(21023);
        expect(Indexer.GetVerseID(8, 30)).toBe(8030);
    });

    it("gets verse", () => {
        let verse: I.IVerseSignature;
        verse = Indexer.GetVerseSignature(1002);
        expect(verse).toEqual({
            Chapter: 1,
            VerseNumber: 2
        });
        verse = Indexer.GetVerseSignature(22031);
        expect(verse).toEqual({
            Chapter: 22,
            VerseNumber: 31
        });
        verse = Indexer.GetVerseSignature(102351);
        expect(verse).toEqual({
            Chapter: 102,
            VerseNumber: 351
        });
    });

    it("permutes verses", () => {
        const verses : Array<I.IVerseSignature> = Indexer.PermuteVerses();
        expect(verses.length).toBe(915);
        expect(verses[1].VerseNumber).toBe(2);
        expect(verses[1].Chapter).toBe(1);
        expect(verses[914].VerseNumber).toBe(31);
        expect(verses[914].Chapter).toBe(31);
        /* More exhaustive tests can be written here. */
    });
});

describe("InBetween", () => {

    it("passes trivial cases", () => {
        expect(Indexer.IsVerseBetween(
            {
                Chapter: 3,
                VerseNumber: 7
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(true);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 1,
                VerseNumber: 5
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(false);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 7,
                VerseNumber: 1
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(false);
    });

    it("edge inclusivity", () => {

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(true);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 6,
                VerseNumber: 5
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(true);
    });

    it("boundary chapter", () => {

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 2,
                VerseNumber: 3
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(false);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 2,
                VerseNumber: 5
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(true);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 6,
                VerseNumber: 6
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(false);

        expect(Indexer.IsVerseBetween(
            {
                Chapter: 6,
                VerseNumber: 4
            },
            {
                Chapter: 2,
                VerseNumber: 4
            },
            {
                Chapter: 6,
                VerseNumber: 5
            })).toBe(true);
    });

}); // end of describe()

describe("indexer.GetVerseType()", () => {
    it("statements", () => {
        expect(Indexer.GetVerseType(Indexer.GetVerseID(25, 3))).toEqual({
            found: true,
            types: ["Statement"],
            group: 25003
        });
    });

    it("sayings", () => {
        expect(Indexer.GetVerseType(Indexer.GetVerseID(22, 18))).toEqual({
            found: true,
            types: ["Saying"],
            group: 1001
        });
        expect(Indexer.GetVerseType(Indexer.GetVerseID(22, 17))).toEqual({
            found: true,
            types: ["Saying"],
            group: 1001
        });
    });
    /* Add more sayings tests */

    it ("articles", ()=> {
        expect(Indexer.GetVerseType(Indexer.GetVerseID(8, 1))).toEqual({
            found: true,
            types: ["Article"],
            group: 1
        });
    });
});

describe("indexer SearchVerseHighlight() ~~ regex", () => {
    let tm: TranslationMap;

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(data));
        tm = new TranslationMap();
    });

    it("searches single", (done) => {
        const verseID = Indexer.GetVerseID(11, 4);
        tm.LoadTranslation("KJV");
        tm.AddOnLoadedCallback(success => {
            expect(tm.GetTranslationName()).toBe("KJV");
            const verse = tm.GetContent(verseID);
            expect(verse).toBeTruthy();
            /*ess delivereth from death.*/
            Indexer.SearchVerseHighlight(verse, "es");
            expect(verse.SearchHighlights).toBeTruthy();
            if (!verse.SearchHighlights) {
                throw Error();
            }
            expect(verse.SearchHighlights.length).toBe(2);
            expect(verse.SearchHighlights).toEqual([
                {
                    iStart: 4,
                    iEnd: 6
                },
                {
                    iStart: 53,
                    iEnd: 55
                },
            ]);
            done();
        });
    });

    it("case insensitive", (done) => {
        const verseID = Indexer.GetVerseID(11, 4);
        tm.LoadTranslation("KJV");
        tm.AddOnLoadedCallback(success => {
            expect(tm.GetTranslationName()).toBe("KJV");
            const verse = tm.GetContent(verseID);
            expect(verse).toBeTruthy();
            /*Riches profit not in the day of wrath: but righteousness delivereth from death.*/
            Indexer.SearchVerseHighlight(verse, "RI");
            expect(verse.SearchHighlights).toBeTruthy();
            if (!verse.SearchHighlights) {throw Error();}
            expect(verse.SearchHighlights.length).toBe(2);
            expect(verse.SearchHighlights).toEqual([
                {
                    iStart: 0,
                    iEnd: 2
                },
                {
                    iStart: 43,
                    iEnd: 45
                }
            ]);
            done();
        });
    });

});