import {
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
} from '@ionic/react';
import React from 'react';

// Styles
import "./Proverb.scss"

// Icons
import { heart, heartOutline } from 'ionicons/icons';
import {IProverb} from './ProverbInterface'

type SayingProp ={
    Proverb: IProverb,
    Save?:any,
    Unsave?:any
}

type SayingState = {

}

class Saying extends React.Component<SayingProp, SayingState> {
    render() {
        return (
            <IonCard class={"saying"}>

            </IonCard>
        );
    }
}

export {Saying};