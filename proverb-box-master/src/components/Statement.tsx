import {
    IonIcon
} from '@ionic/react';
import React from 'react';
import {IStatement} from "../api/Interfaces";

// Styles
import "./Proverb.scss"
import "./Views.css"

// Icons
import {heartCircle, heartCircleOutline} from 'ionicons/icons';

type StatementProps = {
    model: IStatement
    heartCallback: () => void
};

type StatementState = {
}

class Statement extends React.Component<StatementProps, StatementState> {
    render() {
        return (
            <div className={"statement-view"}>
                <h3 className={"verse-content"}>{this.props.model.Verse.Content}</h3>
                <div className={"bar"}/>
                <div className={"info-bar"}>
                    <p className={"verse-name"}>Proverbs {this.props.model.Verse.Chapter}:{this.props.model.Verse.VerseNumber}</p>
                    <IonIcon onClick={this.props.heartCallback} className={"save-icon"} icon={this.props.model.Saved ? heartCircle : heartCircleOutline}></IonIcon>
                </div>
            </div>
        );
    }
}

export {Statement};