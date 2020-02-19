import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


export class StorageAssistant{

	storedIDs:Array<Number> = [];

	constructor(){
		
		
		//this.storedIDs = this.loadFile()
		//.then(()=>{console.log(this.storedIDs)});
		
		//this.loadFile().then(_=>console.log("Outside the then function")).then(_=>console.log(this.storedIDs)) //https://medium.com/better-programming/a-common-misconception-about-async-await-in-javascript-33de224bd5f
		
		
		//console.log(typeof(this.storedIDs))
		//console.log(typeof(stuff))

		/*Storage.set({
			key: "index",
			value: JSON.stringify("Hello World")
		})*/
		// this.storedIDs = stuff

	}

	async loadFile(){
		//not executing in order
		console.log("asdf")

		const  data  =  await Storage.get({ key: 'index' });
		if(data.value!=null){

			 this.storedIDs = await JSON.parse(data.value)
		}

		console.log("done")
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
/*<<<<<<< HEAD
		//console.log(JSON.stringify(this.storedIDs))
=======
		console.log(JSON.stringify(this.storedIDs));
>>>>>>> 628de24cba75ffa95d99f0ab1c0c2cbf0e7a2df2
*/
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
<<<<<<< HEAD
		//console.log(VerseID)
		console.log(this.storedIDs)
		return this.storedIDs.indexOf(VerseID) != -1;
=======


		return this.storedIDs.indexOf(VerseID) !== -1;
>>>>>>> 628de24cba75ffa95d99f0ab1c0c2cbf0e7a2df2
	}
	
}

