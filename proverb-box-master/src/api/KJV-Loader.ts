/*
 * Provides assistance with general book of proverbs structure.
 * Translation independent
 * Code for Christ, 1/23/2020
 */

import {IBookData} from "./Interfaces"

export default class KJVLoader {
    async Load(TranslationDataPath: string) {
        console.log("start load");
        return new Promise<IBookData>((resolve, reject) => {
            console.log("start fetch");
            fetch(TranslationDataPath)
                .then((res) => res.json())
                .then((data) => {
                    console.log("data ", data);
                    const book : IBookData = data.verses.map((verse :any) => {
                        return {
                            Content: verse.text,
                            Chapter: verse.chapter,
                            VerseNumber: verse.verse
                        };
                    });
                    resolve(book);
                })
                .catch((error) => {
                    console.log("Error: failed to load translation asset: ", TranslationDataPath);
                    reject([]);
                });
        });
    }
}