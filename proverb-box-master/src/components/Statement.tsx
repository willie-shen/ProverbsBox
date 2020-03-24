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
import "./Views.css"

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
            <div className={"statement-view"}>
                <h3 className={"verse-content"}>{this.props.model.Verse.Content}</h3>
                <div className={"bar"}/>
                <div className={"info-bar"}>
                    <p className={"verse-name"}>Proverbs {this.props.model.Verse.Chapter}:{this.props.model.Verse.VerseNumber}</p>
                    <IonIcon className={"save-icon"} icon={heartOutline}></IonIcon>
                </div>
            </div>
        );
    }
}

export {Statement};