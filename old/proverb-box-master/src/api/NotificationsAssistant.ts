import { Plugins } from '@capacitor/core';
//import { LocalNotifications} from "@ionic-native/local-notifications"


import {IVerse} from "./Interfaces"

//import shuffle from 'shuffle.ts'

import * as _ from "underscore"
//https://stackoverflow.com/questions/37569537/how-to-use-underscore-js-library-in-angular-2/37569719
const { LocalNotifications } = Plugins;
const { Storage } = Plugins;

export default class NotificationsAssistant{

	MAX_NOTIFICATIONS:number = 2;//64;
	id:any = 0

	frequency:any = 0

	start:any = -1
	end:any = -1

	verses:Array<IVerse> = []

	//list of verses

	BakeNotification(frequency:Number, start:Number, end:Number, listOfVerses:Array<IVerse>){

		Plugins.LocalNotifications.addListener('localNotificationReceived', (notification) =>{
			console.log("received a Local Notification")
		})

		//start and end in military time in HHMM format from 0000 to 2359
		this.SetFrequency(frequency)
		this.SetNotificationHourRange(start,end)
		this.SetNotificationContent(listOfVerses)

		this.NotificationSetter()

	}

	SetFrequency(frequency:Number){
		//this.frequency = frequency

		Storage.set({
			key: "frequency",
			value: JSON.stringify(frequency)
		})
	}

	SetNotificationHourRange(start:Number, end:Number){
		//this.start = start
		//this.end = end

		Storage.set({
			key: "start",
			value: JSON.stringify(start)
		})
		Storage.set({
			key: "end",
			value: JSON.stringify(end)
		})

	}

	SetNotificationContent(listOfVerses:Array<IVerse>){
		//this.verses = listOfVerses

		Storage.set({
			key: "verses",
			value: JSON.stringify(listOfVerses)
		})
	}


	async GetFrequency(){

		var frequency =  await Storage.get({ key: 'frequency' })
		if(frequency.value!=null){

			 frequency = await JSON.parse(frequency.value)
			 //console.log(frequency)
		}

		return frequency
	}

	async GetStart(){

		var start =  await Storage.get({ key: 'start' })
		if(start.value!=null){

			 start = await JSON.parse(start.value)
			 //console.log(frequency)
		}

		return start
	}

	async GetEnd(){

		var end =  await Storage.get({ key: 'end' })
		if(end.value!=null){

			 end = await JSON.parse(end.value)
			 //console.log(frequency)
		}

		return end
	}

	async GetContent(){
		var content = await Storage.get({key:'verses'})

		var v = [];

		//console.log(typeof this.verses)
		if(content.value!=null){
			v = await JSON.parse(content.value)
			
			//console.log(typeof v)
		}

		

		
		return v
	}

	async loadParams(){
		this.frequency = await this.GetFrequency()
		this.start = await this.GetStart()
		this.end = await this.GetEnd()
		this.verses = await this.GetContent()

		//console.log(this.verses)
		//console.log(this.start)
	}

	async ClearNotifications(){

		const pending = await Plugins.LocalNotifications.getPending()
		Plugins.LocalNotifications.cancel(pending) //clear all the pending notifications
		
	}



	async NotificationSetter(){

		//Plugins.LocalNotifications.requestPermissions()

		//clear any pending notification
		this.ClearNotifications()
	
		//Get the information from the storage
		this.loadParams()

		var dateToday = new Date()

		console.log(dateToday)

		//Get today's date
		//want to set today's time to 00H00M00S
		dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate()) 
	

		console.log(dateToday)

	
		var indexes:Array<number> = []

		for(var i = 0; i<this.verses.length; ++i){
			indexes.push(i)
		}

		//shuffle the listOfVerses
		var listOfVerses = this.verses
		_.shuffle(indexes) //need to fix the shuffle; it's not shuffling

		console.log(indexes)

		var currIndex = 0
		
		//convert end and start to millisecond
		//https://stackoverflow.com/questions/18928117/how-to-do-integer-division-in-javascript-getting-division-answer-in-int-not-flo/19296059
		var endHour:number = Math.floor(this.end/100)
		var endMinute:number = this.end%100
		
		var startHour:number = Math.floor(this.start/100)
		var startMinute:number = this.start%100
		

		var endMillisecond = (endHour*60*60*1000) + (endMinute*60*1000) //+ (dateToday.getTimezoneOffset() * 60 * 1000 ) 
		var startMillisecond = (startHour*60*60*1000) + (startMinute*60*1000) //+ (dateToday.getTimezoneOffset() * 60 * 1000 ) 


		var interval = (endMillisecond - startMillisecond)/this.frequency


		var notifications:any = []

		
		console.log(new Date(dateToday.getTime() + (endHour*60*60*1000) + (endMinute*60*1000) ))
		console.log(new Date(dateToday.getTime() + (startHour*60*60*1000) + (startMinute*60*1000) ))
		
		let notificationCount = 0;
		let day = 0;
		while(notificationCount < this.MAX_NOTIFICATIONS) {
			var time = startMillisecond

			while(time <= endMillisecond){

				var randomVerse = listOfVerses[indexes[currIndex]] //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
				//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
				
				//https://www.tutorialspoint.com/typescript/typescript_string_concat.htm
				var title = "Proverbs " + randomVerse.Chapter + ":" + randomVerse.VerseNumber
				var body = randomVerse.Content

				

				//Each day has 24 hours
				//Each hour has 60 minute
				//Each minute = 60 seconds
				//1 second = 1000 milliseconds

				//https://www.w3schools.com/js/js_dates.asp
				/*notifications.push({
					title:title,
					text:body,
					id:this.id,
					trigger:{at: new Date(dateToday.getTime() + (day*24*60*60*1000) + time )} //https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time
				}) //https://www.w3schools.com/js/js_date_methods.asp
				*/
				LocalNotifications.schedule({
				notifications:[
					{
						title:title,
						body:body,
						id:new Date(dateToday.getTime() + (day*24*60*60*1000) + time ).getTime(),
						schedule:{at: new Date(dateToday.getTime() + (day*24*60*60*1000) + time )}
					}
				]
				});
				notificationCount++;
				if (notificationCount >= this.MAX_NOTIFICATIONS) { break; }
	 

				console.log(new Date(dateToday.getTime() + (day*24*60*60*1000) + time )) //need to convert our time to Local Time
				//increase time
				time += interval


				//increment id
				this.id++

				currIndex++

				if(currIndex == listOfVerses.length){
					currIndex = 0
					//shuffle(listOfVerses)
					_.shuffle(indexes)
				}

			}
			day++
		}


		//await LocalNotifications.schedule(notifications)

		//console.log("The Notifications")

		//console.log(LocalNotifications.getAll())

		//console.log(await Plugins.LocalNotifications.areEnabled())
		console.log(LocalNotifications.getPending())
	}

	
	//https://capacitor.ionicframework.com/docs/apis/local-notifications

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	getRandomInt(max:number) {
  		return Math.floor(Math.random() * Math.floor(max));
	}
}
