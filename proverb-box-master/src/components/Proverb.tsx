import { 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon
} from '@ionic/react';

//import {IProverb} from './'
import React from 'react';
import CSS from 'csstype'

import { heartEmpty } from 'ionicons/icons';

import data from '../data/Proverbs.json';

type IProverb = {
  Content : string,
  Chapter : number,
  Verse : number,
  Saved : boolean,
  ID : number
}

var ID = 1;

const words = (data);
//https://aboutreact.com/react-native-global-scope-variables/
export let verses = words['verses'].map((word) => {
  //console.log(word.text)
  let verse: IProverb = {
  Content : word.text,
  Chapter : word.chapter,
  Verse : word.verse,
  Saved : false,
  ID : ID++

 }

 return verse;
}
 );


type ProverbProp ={
  Proverb: IProverb,
  Save?:any,
  Unsave?:any
}

type ProverbState = {

}

class Proverb extends React.Component<ProverbProp, ProverbState> {

  constructor(props: ProverbProp) {
    super(props);
    //this.props.Proverb = verses[0]
  }

  // Member functions?

  // Life 
  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {

    return (
        <IonCard>
          <IonGrid>
            <IonRow>
              <h1>
                {this.props.Proverb.Content}
              </h1>
            </IonRow>

            <IonRow>
              <IonCol>
                <h1>
                  Proverbs {this.props.Proverb.Chapter}:{this.props.Proverb.Verse}
                </h1>
              </IonCol>

              <IonCol>
                <IonButton>
                  <IonIcon slot = "start" icon = {heartEmpty} />
                </IonButton>
              </IonCol>

            </IonRow>
          </IonGrid>


        </IonCard>
      );
    }

}

export {Proverb};