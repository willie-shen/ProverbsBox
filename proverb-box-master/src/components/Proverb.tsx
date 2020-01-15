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

// Styles
import "./Proverb.scss"

// Icons
import { heartEmpty } from 'ionicons/icons';

import data from '../data/Proverbs.json';
import {IProverb} from './ProverbInterface'

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
        <IonCard id={"proverb"}>
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

              <IonCol id = {"buttons"}>
                <IonButton>
                  <IonIcon icon = {heartEmpty} />
                </IonButton>
              </IonCol>

            </IonRow>
          </IonGrid>


        </IonCard>
      );
    }

}

export {Proverb};