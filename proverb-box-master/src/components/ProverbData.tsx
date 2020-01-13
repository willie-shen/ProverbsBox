/* Parsing the Json */
import data from '../data/Proverbs.json';
import {IProverb} from './ProverbInterface';

export default class ProverbData {
    private verses : Array<IProverb>;
    private oneLiners : Array<IProverb>;

    constructor()
    {
        let ID = 0;
        this.verses = (data)['verses'].map((word) => {
            let verse: IProverb = {
                Content : word.text,
                Chapter : word.chapter,
                Verse : word.verse,
                Saved : false,
                ID : ID++
            };
            return verse;
        });

        this.oneLiners = this.verses.filter((proverb: IProverb) => {
            let oneLine: boolean = true;
            let text : string = "";
            if (typeof(proverb.Content) === "string")
            {
                let text : string = proverb.Content;

                if (text[0] != (text[0]).toUpperCase())
                {
                    oneLine = false;
                }

                if (text.slice(-1) != '.' && text.slice(-1) != '?') {
                    oneLine = false;
                }

                return oneLine;
            }

            // filter undefined text
            return false;
        });
    }

    // Getters
    GetAll()
    {
        return this.verses;
    }

    GetOneLiners()
    {
        return this.oneLiners
    }

    // Setters

    // Memory
    Save(id : number)
    {

    }

    Unsave(id : number)
    {

    }
}