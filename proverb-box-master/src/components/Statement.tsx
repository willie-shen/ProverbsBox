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
                <h3>Statement Mock text</h3>
                <p>{this.props.model.Verse.Content}</p>
                <p>Chapter: {this.props.model.Verse.Chapter}</p>
                <p>Verse: {this.props.model.Verse.VerseNumber}</p>
            </IonCard>
        );
    }
}

export {Statement};