/* Parsing the Json */
import data from '../data/Proverbs.json';
import {IProverb} from './ProverbInterface';

export default class ProverbData {
    verses : Array<IProverb>;
  /*  oneLineIDs : Array<number>; */

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

        /*this.oneLineIDs = this.verses.map((proverb: IProverb) => {
            let oneLine: boolean = true;
            const verse : string = proverb.Content;
            if (verse[0] == verse[0].toUpperCase())
            {

            }

        });*/
    }

    // Getters
    GetAll()
    {
        return this.verses;
    }

    //Get




}