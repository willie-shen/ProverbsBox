import {IBookData} from "./Interfaces"

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
                        return {
                            Content: lexham[0].toString(),
                            Chapter: parseInt(lexham[1].split(":")[0]),
                            VerseNumber: parseInt(lexham[1].split(":")[1])
                        };
                    });
                    resolve(book);
                })
                .catch((error) => {
                    // console.log("Error: failed to load translation asset.");
                    resolve([]);
                });
        });
    }
}