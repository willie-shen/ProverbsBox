import React, {useState} from 'react';
import {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonPage,
    IonTitle,
    IonContent,
    IonGrid, IonCol, IonRow, withIonLifeCycle
} from '@ionic/react';
import ContentManager from "../api/ContentManager";
import {Statement} from "../components/Statement"
import {IStatement} from "../api/Interfaces";
import update from "immutability-helper";

type IDiscoverProps = {
    contentManager: ContentManager
}

type IDiscoverState = {
    allStatements: Array<IStatement>,
    selectedStatements: Array<IStatement>,
    head: number
}

const SelectRandom = (pool: Array<IStatement>) => {
    console.log("Pool is: ", pool);
    console.log("select: ", pool[Math.floor(Math.random() * pool.length)]);
    return pool[Math.floor(Math.random() * pool.length)];
};

class Discover extends React.Component<IDiscoverProps, IDiscoverState> {

    constructor(props : IDiscoverProps) {
        super(props);
        this.state = {
            allStatements: [],
            selectedStatements: [],
            head: -1
        };
    }

    // life cycle
    ionViewWillEnter() {
        if (this.props.contentManager.IsTranslatationReady()) {
            if (this.state.allStatements.length == 0) {

                this.props.contentManager.ClearFiltersNoRefresh();
                this.props.contentManager.ApplyFilter("ByType", "statement");

                this.setState({
                    allStatements: this.props.contentManager.GetModel().ComponentModels.map(comp => {
                        return (comp.Model as IStatement);
                    })
                });
            }

            this.setState(cur => {
                return {
                    selectedStatements: update(cur.selectedStatements, { $push: [SelectRandom(this.state.allStatements)] }),
                    head: (cur.head) + 1
                }
            });
        }
    };

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Discover</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent/>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonIcon name="arrow-back" style={{color: 'black'}}/>
                        </IonCol>

                        {
                            (this.state.selectedStatements.length > 0)
                                ? <Statement model={this.state.selectedStatements[this.state.head]} heartCallback={() => {
                                }}/>
                                : <></>
                        }
                        <IonCol>
                            <IonIcon name="arrow-back"/>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonContent/>
            </IonPage>
        )
    }
};

export default withIonLifeCycle(Discover);
