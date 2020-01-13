/* Parsing the Json */
import data from '../data/Proverbs.json';

type IProverb = {
    Content ?: string,
    Chapter ?: number,
    Verse ?: number,
    Saved ?: boolean,
    ID ?: number
}

export default class ProverbData {
    verses : Array<IProverb>;

    constructor()
    {
        let ID = 1;
        this.verses = (data)['verses'].map((word) => {
            //console.log(word.text)
            let verse: IProverb = {
                Content : word.text,
                Chapter : word.chapter,
                Verse : word.verse,
                Saved : false,
                ID : ID++
            }
            return verse;
        });
    }

    // Getters
    GetAll()
    {
        return this.verses;
    }




}