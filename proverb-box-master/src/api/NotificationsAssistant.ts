import { Plugins } from '@capacitor/core';

import {IVerse} from "./Interfaces"

import shuffle from 'shuffle.ts'

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


			/*
Plugins.LocalNotifications.schedule({
    notifications:[{
      title:'title', Proverbs Chapter:Verse
      body:'text', Actual Proverbs
      id:1,
      schedule: { at: new Date(Date.now() + 10) }
    }]
*/		

		//shuffle the listOfVerses
		var listOfVerses = this.verses
		shuffle(listOfVerses)

		var currIndex = 0
		
		var interval = (this.end - this.start)/this.frequency

		var time = this.start
		var notifications:any = []

		var dateToday = new Date()
		dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDay()) //want to set today's time to 0000
		for(var day=0; day<60; ++day){
			while(time <= this.end){

			var randomVerse = listOfVerses[currIndex] //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
			//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
			
			//https://www.tutorialspoint.com/typescript/typescript_string_concat.htm
			var title = "Proverbs " + randomVerse.Chapter + ":" + randomVerse.VerseNumber
			var body = randomVerse.Content

			var hour = time/100
			var minute = time%100

			//Each day has 24 hours
			//Each hour has 60 minute
			//Each minute = 60 seconds
			//1 second = 1000 milliseconds

			//https://www.w3schools.com/js/js_dates.asp
			var dayMillisecond = (day*24*60*60*100) + (hour*60*60*1000) + (minute*60*1000)
		 	//need to add the computed milliseconds to today's millsecond starting from 0000
			notifications.append({
				title:title,
				body:body,
				id:this.id,
				schedule:{at: new Date(dateToday.getTime() + dayMillisecond)}
			}) //https://www.w3schools.com/js/js_date_methods.asp

			//increase time
			time += interval

			//need to check the time if it's past 59 or 24 for 

			hour = time/100
			minute = time%100
			if(hour >=24){ //if it is past hour 24
				hour = hour-24 //wrap it back (0 for 24, 1 for 25, etc)
			}

			if(minute >= 60){ //if it is greater than 60 min, then it's greater than 1 hour
				minute = minute-60
				hour++
			}

			time = (hour)*100 + minute


			//increment id
			this.id++

			currIndex++

			if(currIndex == listOfVerses.length){
				currIndex = 0
				shuffle(listOfVerses)
			}

		}
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
