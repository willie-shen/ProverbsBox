import NotificationsAssistant from '../api/NotificationsAssistant'
import {IVerse} from "./Interfaces"


	
	

	it("Should get 10", (done)=>{
		var na = new NotificationsAssistant()
		na.SetFrequency(10)


		na.GetFrequency().then((freq)=>{
			
			//console.log(freq)
			expect(freq).toBe(10)
			done();
		})


	})

	it("Start from 5-10 should be 5", (done)=>{
		var na = new NotificationsAssistant()
		na.SetFrequency(10)
		na.SetNotificationHourRange(500, 1000)

		na.GetStart().then((start)=>{
			expect(start).toBe(500)
			done()
		})
	})


	it("End from 5-10 should be 1000", (done)=>{
		var na = new NotificationsAssistant()
		na.SetFrequency(10)
		na.SetNotificationHourRange(500, 1000)

		na.GetEnd().then((end)=>{
			expect(end).toBe(1000)
			done()
		})
	})

	it("Get Content", (done)=>{
		var na = new NotificationsAssistant()
		na.SetFrequency(10)
		na.SetNotificationHourRange(500, 1000)

		var verses = [{Chapter:1, VerseNumber:10, Content:"My son, if sinful men entice you, do not give in to them"},
		{Chapter:1, VerseNumber:15, Content: "my son, do not go along with them, do not set foot on their paths;"}
		]

		na.BakeNotification(2880, 1024, 2359, verses);
		/*
export type IVerse = {
    Content : string,
    Chapter : number,
    VerseNumber : number,
    Commentary ?: string,
    SearchHighlights?: Array<ITextRange>
};
		*/


		na.SetNotificationContent(verses)
		na.GetContent().then((stuff)=>{
			

			expect(JSON.stringify(stuff[0])).toBe(JSON.stringify({Chapter:1, VerseNumber:10, Content:"My son, if sinful men entice you, do not give in to them"}))
			expect(JSON.stringify(stuff)).toBe(JSON.stringify(verses))
			done()
		})
	})

	it("test", (done)=>{
		var na = new NotificationsAssistant()
		na.SetFrequency(10)
		na.SetNotificationHourRange(500, 1000)

		var verses = [{Chapter:1, VerseNumber:10, Content:"My son, if sinful men entice you, do not give in to them"},
		{Chapter:1, VerseNumber:15, Content: "my son, do not go along with them, do not set foot on their paths;"}
		]
		/*
export type IVerse = {
    Content : string,
    Chapter : number,
    VerseNumber : number,
    Commentary ?: string,
    SearchHighlights?: Array<ITextRange>
};
		*/


		na.SetNotificationContent(verses)
		na.loadParams();
	})
	
	

	
