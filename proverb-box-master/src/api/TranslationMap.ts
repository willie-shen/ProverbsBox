/*
 * Provides assistance with general book of proverbs structure.
 * Translation independent
 * Code for Christ, 1/23/2020
 */

import {IBookData} from "./Interfaces"
import TranslationConfig from './TranslationConfig'
import Indexer from './Indexer'

export default class TranslationMap
{
    private book : IBookData;
    private translationName: string;
    private onLoadedCallbacks: Array<(success: boolean)=>void>;

    constructor()
    {
        this.book = [];
        this.translationName = "NONE";
        this.onLoadedCallbacks = [];
    }

    GetTranslationName()
    {
        return this.translationName;
    }

    IsLoading()
    {
        return this.translationName === "LOADING";
    }

    /*
        Add a callback which will trigger on the completion of load translation.
        Call in the same stack frame as IsLoading(); No Race conditions will occur due to JS.
     */
    AddOnLoadedCallback(callback: (success: boolean)=>void)
    {
        this.onLoadedCallbacks.push(callback);
        console.log("Added callback");
    }

    /*
        Loads a translation of the book of proverbs
     */
    LoadTranslation(TranslationName: string)
    {
        // Cache check
        if (this.translationName === TranslationName)
        {
            // Push to asynch callback queue (for homogeneity)
            setTimeout(()=>{
                this.TriggerCallbacks();
                }, 0);
            return;
        }

        // Init
        this.translationName = "LOADING";

        // Get matching loader
        const loaderData = Object.entries(TranslationConfig).filter((trans) => {
            return (trans[0] === TranslationName);
        })[0][1];

        // Load
        const loaderInstance = new loaderData.Loader();
        loaderInstance.Load(loaderData.Data).then((book: IBookData) => {
            this.book = book;
            this.translationName = TranslationName;
            this.TriggerCallbacks();
        });
    }

    private TriggerCallbacks() {
        // Callback hook
        // add all callbacks to a callbackQueue
        const callbackQueue = this.onLoadedCallbacks;
        callbackQueue.forEach((c) => {
            // Push callbacks to async queue. this will allow for handling nested Loads and callbacks.
            setTimeout(()=> {
                c(true);
            }, 0);
        });

        // Erase Callbacks
        console.log("erasing length", this.onLoadedCallbacks.length);
        this.onLoadedCallbacks = [];
    }

    /*
        Usage: After LoadTranslation is called and a success is fired, call Get Content.
        Alternatively, check if IsLoading() and if so, then add a callback

        Note: If the following function turns out to be too slow, convert VerseID to contiguous,
        then verse lookup is an O(1) operation
     */
    GetContent(VerseID: number)
    {
        if (this.translationName === "NONE") {
            throw Error("Translation version has not been set");
        }
        else if (this.translationName === "LOADING") {
            throw Error("Translation version is still loading. Try use a callback using AddOnLoadedCallback()");
        }
        const {VerseNumber, Chapter} = Indexer.GetVerse(VerseID);
        return this.book.filter(verse => {
            return verse.VerseNumber == VerseNumber && verse.Chapter == Chapter;
        })[0];
    }
}
