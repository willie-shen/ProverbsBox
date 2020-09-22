import {IBookData} from "../api/Interfaces"

export default class LexhamLoader {
    async Load(TranslationDataPath: string) {
        return new Promise<IBookData>(resolve => {
            fetch(TranslationDataPath)
                .then((res) => res.json())
                .then((data) => {
                    const book : IBookData = Object.entries(data.passages).map((lexham:[string, any]) => {
                        if (typeof lexham[1] !== "string") {
                            throw Error();
                        }
                        let string: string = "";
                        console.log("Content: "+ lexham[1].toString() + "\nChapter: " + parseInt(lexham[0].split(":")[0]) + "\nVerseNumber: " + parseInt(lexham[0].split(":")[1]));
                        return {
                            Content: lexham[1].toString(),
                            Chapter: parseInt(lexham[0].split(":")[0]),
                            VerseNumber: parseInt(lexham[0].split(":")[1])
                        };
                    });
                    resolve(book);
                })
                .catch((error) => {
                    console.log("Error: failed to load translation asset.");
                    resolve([]);
                });
        });
    }
}