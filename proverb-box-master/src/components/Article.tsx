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

type ArticleProp ={
    Proverb: IProverb,
    Save?:any,
    Unsave?:any
}

type ArticleState = {

}

class Article extends React.Component<ArticleProp, ArticleState> {
    render() {
        return (
            <IonCard class={"article"}>

            </IonCard>
        );
    }
}

export {Article};