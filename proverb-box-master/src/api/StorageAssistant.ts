import {IProverb} from "../components/ProverbInterface";

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


export class StorageAssistant{

	storedIDs:Array<Number> ;

	constructor(){
		this.storedIDs = [];

		const  value  =  Storage.get({ key: 'index' });

		console.log(value)
		/*Storage.set({
			key: "index",
			value: JSON.stringify("Hello World")
		})*/
	}

	BookmarkVerse(VerseID:Number){

		//maybe call isBookmarked to see if it exists
			//exit out the function if it is bookmarked


		//else 
			//"add the ID to the list"
		if (this.isBookmarked(VerseID)){
			return;
		}

		//https://www.tutorialsteacher.com/typescript/typescript-array

		this.storedIDs.push(VerseID)
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		console.log(JSON.stringify(this.storedIDs))

		Storage.set({
			key: "index",
			value: JSON.stringify(this.storedIDs)
		})
		/*
async setObject() {
  await Storage.set({
    key: 'user',
    value: JSON.stringify({
      id: 1,
      name: 'Max'
    })
  });
}
		*/


	}
	isBookmarked(VerseID:Number) : boolean{


		return this.storedIDs.indexOf(VerseID) != -1;
	}

}

