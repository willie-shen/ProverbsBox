import {
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
} from '@ionic/react';
import React from 'react';
import {ISaying} from "../api/Interfaces";

// Styles
import "./Proverb.scss"

// Icons
import { heart, heartOutline } from 'ionicons/icons';
import {IProverb} from './ProverbInterface'

type SayingProp ={
    model: ISaying
}

type SayingState = {

}

class Saying extends React.Component<SayingProp, SayingState> {
    render() {
        return (
            <IonCard class={"saying"}>
                <h1>Saying</h1>
            </IonCard>
        );
    }
}

export {Saying};