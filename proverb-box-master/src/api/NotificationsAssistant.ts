import { Plugins } from '@capacitor/core';

import {IVerse} from "./Interfaces"


export default class NotificationsAssistant{


	id:any = 0

	frequency:any = 0

	start:any = -1
	end:any = -1

	verses:Array<IVerse> = []

	//list of verses

	SetFrequency(frequency:Number){
		this.frequency = frequency
	}

	SetNotificationHourRange(start:Number, end:Number){
		this.start = start
		this.end = end

	}

	SetNotificationContent(listOfVerses:Array<IVerse>){
		this.verses = listOfVerses
	}


	/*
export type IVerse = {
    Content : string,
    Chapter : number,
    VerseNumber : number,
    Commentary ?: string,
    SearchHighlights?: Array<ITextRange>
};
	*/
	async BakeNotifications(){
		//Start scheduling the notifications

		// end - start / frequency = interval

		// from start to end
			//set a notification at time
			//time += interval

			//add to notifications array

			/*
Plugins.LocalNotifications.schedule({
    notifications:[{
      title:'title', Proverbs Chapter:Verse
      body:'text', Actual Proverbs
      id:1,
      schedule: { at: new Date(Date.now() + 10) }
    }]
*/
		
		var interval = (this.end - this.start)/this.frequency

		var time = this.start
		var notifications:any = []
		while(time <= this.end){

			var randomVerse = this.verses[this.getRandomInt(this.verses.length)] //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
			//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
			
			//https://www.tutorialspoint.com/typescript/typescript_string_concat.htm
			var title = "Proverbs " + randomVerse.Chapter + ":" + randomVerse.VerseNumber
			var body = randomVerse.Content
		 	
			notifications.append({
				title:title,
				body:body,
				id:this.id,
				schedule:{at: new Date(time)}
			})

			//increase time
			time += interval
			//increment id
			this.id++

		}

		

		//interval:Number = (this.end - this.start)

		await Plugins.LocalNotifications.schedule({notifications:notifications})


	}
	async ClearNotifications(){

		const pending = await Plugins.LocalNotifications.getPending()
		Plugins.LocalNotifications.cancel(pending)
		
	}
	//https://capacitor.ionicframework.com/docs/apis/local-notifications

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	getRandomInt(max:number) {
  		return Math.floor(Math.random() * Math.floor(max));
	}
}
/*

	
	API
		
		What is it going to be notified
	
			Verse Title

			Verse Content

		Setters
			
			
			Only notify within time range

				Military time
		SetNotificationContent(list)
			Param description: list of IVerse

			

*/