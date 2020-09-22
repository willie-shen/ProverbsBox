import {
    IonCard
} from '@ionic/react';
import React from 'react';
import {ISaying} from "../api/Interfaces";

// Styles
import "./Proverb.scss"

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