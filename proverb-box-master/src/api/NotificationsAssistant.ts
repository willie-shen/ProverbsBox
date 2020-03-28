import { Plugins } from '@capacitor/core';

import {IVerse} from "./Interfaces"
/*
Plugins.LocalNotifications.schedule({
    notifications:[{
      title:'title',
      body:'text',
      id:1,
      schedule: { at: new Date(Date.now() + 10) }
    }]
*/

export default class NotificationsAssistant{



	frequency:Number = 0

	start:Number = -1
	end:Number = -1

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

	BakeNotifications(){
		//Start scheduling the notifications

		// end - start / frequency = interval

		// from start to end
			//set a notification at time
			//time += interval

			//add to notifications array
	}
	async ClearNotifications(){

		const pending = await Plugins.LocalNotifications.getPending()
		Plugins.LocalNotifications.cancel(pending)
		
	}
	//https://capacitor.ionicframework.com/docs/apis/local-notifications
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