/*
 * Playground for testing API.
 * Code for Christ 1/23/2020

 Willie Shen
 */
 import {StorageAssistant} from '../api/StorageAssistant'

export default function TestScript() {
    console.log("TestScript 2 Running");
    /* Test Code Here */

    var storage = new StorageAssistant()
    storage.loadFile().then(_=> console.log(storage.isBookmarked(3)))

    //storage.BookmarkVerse(1)
    //storage.BookmarkVerse(3)
    //storage.BookmarkVerse(2)
    //storage.BookmarkVerse(2)
   

    //console.log(storage)

    //var storage1 =  new StorageAssistant()
    //storage1.loadFile()
    //console.log(storage1)
    //console.log(storage1.isBookmarked(3))

    //https://stackoverflow.com/questions/43431550/async-await-class-constructor/43433773
}


