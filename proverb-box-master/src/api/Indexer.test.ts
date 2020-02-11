
import Indexer from "./Indexer"
import * as I from "./Interfaces"

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
            types: ["Statement"]
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
        });
    });
});