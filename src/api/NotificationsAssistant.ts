import { Plugins } from '@capacitor/core';
import {IVerse} from "./Interfaces"

const { LocalNotifications } = Plugins;
const { Storage } = Plugins;

export default class NotificationsAssistant{

	MAX_NOTIFICATIONS:number = 2;//64;
	id:number = 0
	frequency:number = 0
	start:number = -1
	end:number = -1

	//list of verses
	verses:Array<IVerse> = []

	BakeNotification(frequency:Number, start:Number, end:Number, listOfVerses:Array<IVerse>){

		
		//start and end in military time in HHMM format from 0000 to 2359
		this.SetFrequency(frequency)
		this.SetNotificationHourRange(start,end)
		this.SetNotificationContent(listOfVerses)
		this.NotificationSetter()
	}

	SetFrequency(frequency:Number){
		Storage.set({
			key: "frequency",
			value: frequency.toString()
		})
	}

	SetNotificationHourRange(start:Number, end:Number){
		Storage.set({
			key: "start",
			value: start.toString()
		})
		Storage.set({
			key: "end",
			value: end.toString()
		})
	}

	SetNotificationContent(listOfVerses:Array<IVerse>){
		Storage.set({
			key: "verses",
			value: JSON.stringify(listOfVerses)
		})
	}

	async GetFrequency() : Promise<number>{
		var frequencyStore = await Storage.get({ key: 'frequency' })
		var frequency:number = 0;
		if(frequencyStore.value!=null){
			frequency = parseInt(frequencyStore.value)
		}

		return frequency
	}

	async GetStart() : Promise<number>{
		var startStore = await Storage.get({ key: 'start' })
		var start:number = 0;
		if(startStore.value!=null){
			start = parseInt(startStore.value)
		}

		return start
	}

	async GetEnd() : Promise<number>{
		var endStore =  await Storage.get({ key: 'end' });
		var end:number = 0;
		if(endStore.value!=null){
			end = parseInt(endStore.value)
		}

		return end
	}

	async GetContent() : Promise<Array<IVerse>>{
		var content = await Storage.get({key:'verses'});
		var v = []
		if(content.value!=null){
			v = await JSON.parse(content.value)
		}
		return v
	}

	async LoadParams(){
		this.frequency = await this.GetFrequency()
		this.start = await this.GetStart()
		this.end = await this.GetEnd()
		this.verses = await this.GetContent()
	}

	async ClearNotifications(){

		const pending = await Plugins.LocalNotifications.getPending()
		if(pending.notifications.length != 0){
			Plugins.LocalNotifications.cancel(pending)
		}
		 //clear all the pending notifications
		this.frequency = 0
		this.start = 0
		this.end = 0
		this.verses = []		
	}

	async NotificationSetter(){

		//Plugins.LocalNotifications.requestPermissions()

		//Clear pending notifications
		await this.ClearNotifications()
	
		//Get the information from the storage
		await this.LoadParams()

		// ensure that notifications have been set
		if (this.verses.length === 0) {
			return
		}

		//Get today's date
		//want to set today's time to 00H00M00S
		var dateToday = new Date()
		dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate()) 

		
		//convert end and start to millisecond
		var endHour:number = Math.floor(this.end/100)
		var endMinute:number = this.end%100
		
		var startHour:number = Math.floor(this.start/100)
		var startMinute:number = this.start%100
		
		var endMillisecond = (endHour*60*60*1000) + (endMinute*60*1000)
		var startMillisecond = (startHour*60*60*1000) + (startMinute*60*1000)

		var interval = (endMillisecond - startMillisecond)/this.frequency
		
		let scheduledCount = 0;
		let day = 0;
		while(scheduledCount < this.MAX_NOTIFICATIONS){
			var time = startMillisecond

			for(let f=0; f < this.frequency; ++f){

				// retrieve random verse content
				var randomVerse = this.verses[this.getRandomIndex(this.verses.length)]
				var verseTitle = "Proverbs " + randomVerse.Chapter + ":" + randomVerse.VerseNumber
				var verseContent = randomVerse.Content

				//Each day has 24 hours
				//Each hour has 60 minute
				//Each minute = 60 seconds
				//1 second = 1000 milliseconds 
				LocalNotifications.schedule({
					notifications:[
						{
							title:verseTitle,
							body:verseContent,
							id:(day*24*60*60*1000) + time,
							schedule:{at: new Date(dateToday.getTime() + (day*24*60*60*1000) + time )}
						}
					]
				});
				scheduledCount++;
				if (scheduledCount >= this.MAX_NOTIFICATIONS) { break; }
	 
				console.log(new Date(dateToday.getTime() + (day*24*60*60*1000) + time )) //need to convert our time to Local Time

				//increase time
				time += interval

				//increment id
				this.id++
			}
			day++
		}

		console.log(LocalNotifications.getPending())
	}

	getRandomIndex(length:number) {
  		return Math.floor(Math.random() * Math.floor(length));
	}
}
