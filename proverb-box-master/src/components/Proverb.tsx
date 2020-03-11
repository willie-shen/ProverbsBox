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

type ProverbProp ={
  Proverb: IProverb,
  Save?:any,
  Unsave?:any
}

type ProverbState = {

}

class Proverb extends React.Component<ProverbProp, ProverbState> {
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

              { this.props.Proverb.Saved
                  ? (<IonButton>
                      <IonIcon icon = {heart}></IonIcon>
                    </IonButton>)
                  : (<IonButton>
                      <IonIcon icon = {heartOutline}></IonIcon>
                    </IonButton>)
                }

                
              </IonCol>

            </IonRow>
          </IonGrid>


        </IonCard>
      );
    }
}

export {Proverb};