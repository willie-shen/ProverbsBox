import {
    IonIcon
} from '@ionic/react';
import React from 'react';
import { IStatement } from "../api/Interfaces";
import { Transition } from "react-transition-group";

// Styles
import "./Proverb.scss"
import "./Views.css"

// Icons
import {heartCircle, heartCircleOutline} from 'ionicons/icons';

type StatementProps = {
    model: IStatement,
    heartCallback: () => void
};

type StatementState = {
    holdingTimer: any, // A delay event
    touchState: string // 'n' - none, 't' - tap, 'h' - hold
}

class Statement extends React.Component<StatementProps, StatementState> {

    constructor(props: StatementProps) {
        super(props);

        // init state
        this.state = {
            holdingTimer: undefined,
            touchState: 'n'
        };
    }

    /* config */
    longPressDuration = 1000;

    /* folder model open */
    openModel = () => {
        console.log("Opening model");
        this.holdEnd();
    }

    touchStart = () => {
        
    }

    holdStart = () => {
        let timeout = setTimeout( this.openModel,  this.longPressDuration);
        this.setState({holdingTimer: timeout});
    }

    holdEnd = () => {
        if (this.state.holdingTimer) {
            // clear timed model open
            clearTimeout(this.state.holdingTimer);
            this.setState({holdingTimer: null});
        }
    }

    saveTapped = () => {

    }

    render() {
        return (
            <span
                className={"statement"}
                onTouchStart={this.holdStart}
                onTouchEnd={this.holdEnd}
                onMouseDown={this.holdStart}
                onMouseUp={this.holdEnd}                
            >
                <div className={"statement-view" + ((this.state.holdingTimer) ? " shrinking" : "")}>
                    <h3 className={"verse-content"}>{this.props.model.Verse.Content}</h3>
                    <div className={"bar"}/>
                    <div className={"info-bar"}>
                        <p className={"verse-name"}>Proverbs {this.props.model.Verse.Chapter}:{this.props.model.Verse.VerseNumber}</p>
                        <IonIcon 
                            onTouchStart={(e)=>{e.stopPropagation()}}
                            onMouseDown={(e)=>{e.stopPropagation()}}
                            onClick={this.props.heartCallback} className={"save-icon"} icon={this.props.model.Saved ? heartCircle : heartCircleOutline}></IonIcon>
                    </div>
                </div>
            </span>
        );
    }
}

export {Statement};