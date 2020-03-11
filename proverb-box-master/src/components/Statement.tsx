import {
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
} from '@ionic/react';
import React from 'react';
import {IStatement} from "../api/Interfaces";

// Styles
import "./Proverb.scss"

// Icons
import { heart, heartOutline } from 'ionicons/icons';
import {IProverb} from './ProverbInterface'

type StatementProp ={
    model: IStatement
}

type StatementState = {
}

class Statement extends React.Component<StatementProp, StatementState> {
    render() {
        return (
            <IonCard class={"saying"}>
                <p>Statement</p>
            </IonCard>
        );
    }
}

export {Statement};