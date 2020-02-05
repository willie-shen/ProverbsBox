import {IProverb} from "../components/ProverbInterface";

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


export class StorageAssistant{

	storedIDs:Array<Number> ;

	constructor(){
		this.storedIDs = [];

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


	}
	isBookmarked(VerseID:Number) : boolean{


		return this.storedIDs.indexOf(VerseID) != -1;
	}

}

