import React, {useState, useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewDidEnter, 
  useIonViewWillEnter
} from '@ionic/react';

import {
  libraryOutline,
  bookmarkOutline,
  shuffleOutline
} from 'ionicons/icons';

import Library from './pages/Library';
import Bookmarked from './pages/Bookmarked';
import Discover from './pages/Discover';
import Details from './pages/Details';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './fonts/font-config.css';

import ContentManager from "./api/ContentManager"

// notifications
import { Plugins, AppState } from '@capacitor/core';
import NotificationsAssistant from "./api/NotificationsAssistant"



// init content manager
let cm = new ContentManager();

const App: React.FC = () => {


  // capacitor notifications setup
  useIonViewWillEnter(() => {
    // refresh notifications on app enter
   
  });

  useEffect( () => {

    //console.log("Annyeonghaseyo")

    let notificationAssistant = new NotificationsAssistant();

    var remain:Boolean;
    var starting:Number;
    var ending:Number;

    notificationAssistant.NoNotificationsRemaining().then((remaining) => {
      if(!remaining){
        console.log("There are notifications that are already scheduled");
      }else{
        console.log("There are notifications that aren't scheduled")
      }
      remain = remaining;
    } ).then(()=>
      notificationAssistant.GetStart()
    ).then((start)=>{
      starting = start
    }).then(()=>notificationAssistant.GetEnd()).then((end)=>{
      ending = end
    }).then(()=>{

      var dateToday = new Date()

      var hour = dateToday.getHours()
      var minutes = dateToday.getMinutes()

      var militaryTime:Number = hour*100 + minutes

      if(remain && (militaryTime < starting && militaryTime < ending)){
        notificationAssistant.NotificationSetter();
      }

    })
  })

   console.log("Starting app")
   //Seems to not be called during startup
   //https://stackoverflow.com/questions/50623279/js-event-handler-async-function/50623441
   Plugins.App.addListener("appStateChange", async (state: AppState) => {
      if (state.isActive) {
        // call the notification setup
        console.log("App is now active")

         let notificationAssistant = new NotificationsAssistant();

         var remaining = await notificationAssistant.NoNotificationsRemaining()
         console.log(remaining)
         if(!remaining){
           console.log("There are notifications that are already scheduled");
           return;
         }else{

           //check to see time 
           var dateToday = new Date()

           var hour = dateToday.getHours()
           var minutes = dateToday.getMinutes()

           var militaryTime:Number = hour*100 + minutes

           var start = await notificationAssistant.GetStart()
           var end = await notificationAssistant.GetEnd()

            //probably only do it for the end
           if(militaryTime >= start || militaryTime >= end){
             console.log("Time has already passed")
             return
           }
         }
        /*
        Idea for the implementation

        We need to check if there are any remaining notifications, either those that have not been received
        Or those that have not been scheduled (if we take that route of allowing unlimited notifications)

        If there are still scheduled notifications that have not been received, return out of the function (do nothing)
        If there are notifications that need to be scheduled but are not yet scheduled, schedule any of them as long as the time has not been passed
        
        If no notifications, check to see if the start and end time has passed already
          -If it has, do nothing
          -If it has not passed, call the notification setter
        */
        
        notificationAssistant.NotificationSetter();
      }
    });

   /*
    Plugins.LocalNotifications.addListener('localNotificationReceived', (notification) =>{
      console.log("received a Local Notification")
    })
  */
  //Looks like this notification callback function would not work unless we are in the foreground
 
  // root of the proverbs box app
  return (
    <>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/library" component={() => <Library contentManager={cm}/>} exact={true}/>
              <Route path="/bookmarked" component={Bookmarked} exact={true}/>
              <Route path="/bookmarked/details" component={Details}/>
              <Route path="/discover" component={() => <Discover contentManager={cm}/>} exact={true}/>
              <Route path="/" render={() => <Redirect to="/library"/>} exact={true}/>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="library" href="/library">
                <IonIcon icon={libraryOutline}/>
                <IonLabel>Library</IonLabel>
              </IonTabButton>
              <IonTabButton tab="bookmarked" href="/bookmarked">
                <IonIcon icon={bookmarkOutline}/>
                <IonLabel>Bookmarked</IonLabel>
              </IonTabButton>
              <IonTabButton tab="discover" href="/discover">
                <IonIcon icon={shuffleOutline}/>
                <IonLabel>Discover</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </>
  );
}

export default App;