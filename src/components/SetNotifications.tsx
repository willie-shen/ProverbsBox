/* THE MODAL THAT POPS UP

<IonAlert
                    isOpen={isNotificationsAlertShown}
                    onDidDismiss={(dismiss:any) => {
                        setIsNotificationsAlertShown(false)
                    }}
                    header={'Set Notifications'}
                    inputs={[
                        {
                            label: 'From',
                            name: 'startTime',
                            type: ''
                        },
                        {
                            label: 'From',
                            name: 'startTime',
                            type: 'time'
                        },
                        {
                            label: 'To',
                            name: 'endTime',
                            type: 'time',
                        },
                        {
                            label: 'Per day',
                            name: 'frequency',
                            type: 'number',
                            placeholder: 'Per Day'
                        },
                    ]}
                    buttons={[
                        {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        },
                        {
                        text: 'Ok',
                        handler: (dismiss:any) => {
                            createFolder(dismiss["folderName"]);
                        }
                        }
                    ]}
                />
                */

import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import ContentManager from "../api/ContentManager";
import NotificationsAssistant from "../api/NotificationsAssistant";
import StorageAssistant from "../api/StorageAssistant";
import { NotificationSettings } from "../pages/Bookmarked";
import NotificationsButton from "./NotificationsButton";

type IProps = {
  isModalShown: boolean,
  setIsModalShown: (isModalShown: boolean) => void;
  setNotificationSettings: (ns: NotificationSettings) => void; 
  contentManager: ContentManager;
}

const SetNotifications: React.FC<IProps> = (props: IProps) => {

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [frequency, setFrequency] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [valid, setValid] = useState(false);

  const setNotifications = () => {

    // date
    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);

    // military time
    const fromMil = fromDate.getHours() * 100 + fromDate.getMinutes();
    const toMil = toDate.getHours() * 100 + toDate.getMinutes();
    const frequencyNum = parseInt(frequency);

    // Setting notificationSettings for Bookmarked.tsx
    const newSettings : NotificationSettings = {fromTime : fromMil, toTime : toMil, frequency : frequencyNum}
    props.setNotificationSettings(newSettings)

    // get noitification verses
    StorageAssistant.getFolders()
    .then(async folders =>
      // promise.all removes the nested promises
      Promise.all(
        // filter folders with notification
        folders.filter(folder => folder.notificationsOn)
        .map(folder => StorageAssistant.getFolderVerseIds(folder))
      )
    )
    .then(verseSignatures => {
      // set notifications
      const verses = verseSignatures.flat().map((v) => props.contentManager.GetVerse(v));
      const na = new NotificationsAssistant();
      console.log("Setting notification for verses: ", verses);
      na.BakeNotification(frequencyNum, fromMil, toMil, verses); 
    });


  }

  // onclick of Modal > Set Notifications, sets new times + closes the modal
  const setNotificationsAndClose = () => {
    setNotifications();
    props.setIsModalShown(false)
    console.log(props.isModalShown) //?why doesnt this change? 
  }

  // effects hook used for validation
  useEffect(() => {
    console.log("from time: ", fromTime);
    console.log("to time: ", toTime);
    console.log("frequency: ", frequency);

    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);

    // to date should be after from date
    if (fromDate && toDate) {
      if (fromDate.getHours() > toDate.getHours()
      || (fromDate.getHours() === toDate.getHours() && fromDate.getMinutes() >= toDate.getMinutes())) {
        setErrorMessage("Please choose a valid time range");
        return;
      }
    }

    setErrorMessage("");
    if (fromDate && toDate && frequency) {
      setValid(true);
    }
    
  }, [fromTime, toTime, frequency]);

  const notificationsButtonStyle : React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1.5em",
    opacity: (valid) ? "1" : "0.45"
  };

  const errorStyle : React.CSSProperties = {
    opacity: "0.65",
    display: (errorMessage === "") ? "none" : "block",
    fontSize: "0.5em",
    marginTop: "0.5em"
  }

  return (
  <IonModal
    isOpen={props.isModalShown}
    cssClass='my-custom-class'
    swipeToClose={true}
    onDidDismiss={() => props.setIsModalShown(false)}>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Set Notifications
        </IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => {props.setIsModalShown(false)}}>Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItemDivider>Time</IonItemDivider>
        <IonItem>
          <IonLabel>From</IonLabel>
          <IonDatetime displayFormat="h:mm A" minuteValues="0,15,30,45" value={fromTime} onIonChange={e => setFromTime(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel>To</IonLabel>
          <IonDatetime displayFormat="h:mm A" minuteValues="0,15,30,45" value={toTime} onIonChange={e => setToTime(e.detail.value!)}/>
        </IonItem>
        <IonItemDivider>Frequency</IonItemDivider>
        <IonItem>
          <IonLabel>Per Day</IonLabel>
          <IonInput value={frequency} min={"1"} onIonChange={e => setFrequency(e.detail.value!)}></IonInput>
        </IonItem>
      </IonList>
      <div style={notificationsButtonStyle}>
        <NotificationsButton onClick={setNotificationsAndClose} active={valid}></NotificationsButton>
        <p style={errorStyle}>{errorMessage}</p>
      </div>
    </IonContent>
  </IonModal>
  );
}

export default SetNotifications;