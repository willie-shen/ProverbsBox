/*
 * Indexer Test Script
 * Playground for testing API.
 * Code for Christ 1/23/2020
 */

import Indexer from "./Indexer"

export default function TestScript1() {
    console.log("TestScript 1 Running");
    /* Test Code Here */

    const indexer = new Indexer();
    console.log("All Verses");
    const verses = indexer.PermuteVerses();
    console.log("Verse Count: " + verses.length);
    console.log("verses");
    console.log(verses);

}


