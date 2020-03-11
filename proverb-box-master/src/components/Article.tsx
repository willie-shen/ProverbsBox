import {
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
} from '@ionic/react';
import React from 'react';
import {IArticle} from "../api/Interfaces";

// Styles
import "./Proverb.scss"

// Icons
import { heart, heartOutline } from 'ionicons/icons';
import {IProverb} from './ProverbInterface'

type ArticleProp ={
    model: IArticle
}

type ArticleState = {

}

class Article extends React.Component<ArticleProp, ArticleState> {
    render() {
        return (
            <IonCard class={"article"}>
                <p>Article</p>
            </IonCard>
        );
    }
}

export {Article};