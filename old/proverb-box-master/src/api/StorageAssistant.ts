import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


export default class StorageAssistant{

	storedIDs:Array<Number> = [];

	async loadFile(){
		//not executing in order
		//console.log("asdf")

		const  data  =  await Storage.get({ key: 'index' });
		if(data.value!=null){

			 this.storedIDs = await JSON.parse(data.value)
		}

		//console.log("done")
		//this.storedIDs = JSON.parse(data.value);
		/*data.then((d)=>{
			 //https://ionicframework.com/docs/building/storage
			 alert("Print!")
			 if(d.value != null){
			 	this.storedIDs = JSON.parse(d.value)
			 	//https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string

			 }

			 //return this.storedIDs;
			//this.storedIDs = {};
			this.storedIDs = []
		});*/


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

		this.storedIDs.push(VerseID);
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

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

	removeBookmark(VerseID:Number){
		if(!this.isBookmarked(VerseID)){
			return; //if it is not in the list
		}

		//https://www.tutorialspoint.com/typescript/typescript_array_splice.htm

		//get the index of the verse
		var index = this.storedIDs.indexOf(VerseID);

		this.storedIDs.splice(index, 1);

		Storage.set({
			key: "index",
			value: JSON.stringify(this.storedIDs)
		})

	}
	isBookmarked(VerseID:Number) : boolean{


		return this.storedIDs.indexOf(VerseID) !== -1;

	}


	
}

