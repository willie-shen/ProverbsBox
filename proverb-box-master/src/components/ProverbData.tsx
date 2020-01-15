/* Parsing the Json */
import data from '../data/Proverbs.json';
import {IProverb, IFilter, IFilterMap} from './ProverbInterface';
import {Filters} from './Filters';

export default class ProverbData {
    private verses : Array<IProverb>;
    private oneLiners : Array<IProverb>;
    private filterBank : IFilterMap = {};

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

    // Toggle Filters
    AddFilter(name : string, filter : IFilter)
    {
        this.filterBank[name] = filter;
    }

    RemoveFilter(name : string)
    {
        delete this.filterBank[name];
    }

    ClearFilters()
    {
        this.filterBank = {};
    }

    RunFilters(collection:Array<IProverb>) : Array<IProverb>
    {
        Object.entries(this.filterBank).forEach(([_, filter]) => {
            collection = collection.filter(filter);
        });

        return collection;
    }

    // Getters
    GetAll() : Array<IProverb>
    {
        return this.verses;
    }

    GetAllOneLiners() : Array<IProverb>
    {
        return this.oneLiners;
    }

    GetFilteredOneLiners() : Array<IProverb>
    {
        return this.RunFilters(this.oneLiners);
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