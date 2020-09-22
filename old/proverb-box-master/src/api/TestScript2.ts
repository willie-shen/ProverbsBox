/*
 * Playground for testing API. (Deprecated, USE JEST test suite, run: terminal> npm test)
 * Code for Christ 1/23/2020

 Willie Shen
 */
 import NotificationAssistant from '../api/NotificationsAssistant'


export default function TestScript() {

    console.log("Run tests")
    var na = new NotificationAssistant()


        var verses = [{Chapter:1, VerseNumber:10, Content:"My son, if sinful men entice you, do not give in to them"},
        {Chapter:1, VerseNumber:15, Content: "my son, do not go along with them, do not set foot on their paths;"}
        ]

        na.BakeNotification(10, 2017, 2022, verses);
}


