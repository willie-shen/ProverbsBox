import { IonButton } from "@ionic/react";
import React from "react";
import "./NotificationsButton.css"

type IProps = {
  onClick: () => void,
  active?: boolean
}

const NotificationsButton: React.FC<IProps> = (props: IProps) => {
  return (
    <div className={`button-holder`}>
        <IonButton
        disabled={(props.active === undefined) ? false : !props.active}
        shape={"round"}
        class={"set-notification-button"}
        onClick={props.onClick}>Set Notifications</IonButton>  
    </div>
  );
}

export default NotificationsButton;