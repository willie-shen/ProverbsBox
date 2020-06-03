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
    heartCallback: () => void,
    scrollStamp: number
};

type StatementState = {
    holdingTimer: any, // A delay event
    touchState: string, // 'n' - none, 't' - tap, 'h' - hold
    scrollStamp: number
}

class Statement extends React.Component<StatementProps, StatementState> {

    constructor(props: StatementProps) {
        super(props);

        // init state
        this.state = {
            holdingTimer: undefined,
            touchState: 'n',
            scrollStamp: 0
        };
    }

    componentDidUpdate(prevProps: StatementProps) {
        
        // if touching
        if (this.state.touchState !== 'n') {

            // detect scroll
            if (this.props.scrollStamp !== prevProps.scrollStamp) {
                console.log("Scroll Detected: ", this.props.scrollStamp);
                
                // clear timed model open
                clearTimeout(this.state.holdingTimer);
                this.setState({
                    holdingTimer: null,
                    touchState: 'n',
                    scrollStamp: this.props.scrollStamp
                });
            }
        }
    }

    /* config */
    tapDuration = 250;
    longPressDuration = 500;

    /* folder model open */
    openModel = () => {
        console.log("Opening model");
        this.gestureEnd();
    }

    gestureStart = () => {
        this.touchStart();
    }

    gestureEnd = () => {
        if (this.state.touchState !== 'n') { // Copy paste code from scroll
            // clear timed model open
            clearTimeout(this.state.holdingTimer);
            this.setState({
                holdingTimer: null,
                touchState: 'n'
            });
        }
    }

    /* To be called by gestureStart */
    touchStart = () => {
        let timeout = setTimeout( this.holdStart,  this.tapDuration);
        this.setState({
            holdingTimer: timeout,
            touchState: 't'
        });
    }

    holdStart = () => {
        let timeout = setTimeout( this.openModel,  this.longPressDuration);
        this.setState({
            holdingTimer: timeout,
            touchState: 'h'
        });
    }

    saveTapped = () => {

    }      

    render() {
        return (
            <span
                className={"statement"}
                onTouchStart={this.gestureStart}
                onTouchEnd={this.gestureEnd}
                onMouseDown={this.gestureStart}
                onMouseUp={this.gestureEnd}                
            >
                <div className={"statement-view" + ((this.state.touchState === 'h') ? " shrinking" : "")}
                    onDrag={()=>{console.log("Dragging");}}
                    onScroll={()=>{console.log("scrolling");}}
                >
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