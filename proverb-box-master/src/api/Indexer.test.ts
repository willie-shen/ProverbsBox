
/*
 * Indexer Test Script
 * Playground for testing API.
 * Code for Christ 1/23/2020
 */

import Indexer from "./Indexer"
import * as I from "./Interfaces"

it("gets ID correctly", () => {
    expect(Indexer.GetVerseID(1, 2)).toBe(1002);
    expect(Indexer.GetVerseID(21, 23)).toBe(21023);
    expect(Indexer.GetVerseID(8, 30)).toBe(8030);
});

it("gets verse", () => {
    let verse: I.IVerseSignature;
    verse = Indexer.GetVerse(1002);
    expect(verse).toEqual({
        Chapter: 1,
        VerseNumber: 2
    });
    verse = Indexer.GetVerse(22031);
    expect(verse).toEqual({
        Chapter: 22,
        VerseNumber: 31
    });
    verse = Indexer.GetVerse(102351);
    expect(verse).toEqual({
        Chapter: 102,
        VerseNumber: 351
    });
});

it("permutes verses", () => {
    const verses : Array<I.IVerseSignature> = Indexer.PermuteVerses();
    expect(verses.length).toBe(915);

    /* More exhaustive tests can be written here. */
});