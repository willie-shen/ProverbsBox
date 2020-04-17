import React, {useState} from 'react';
import {
    IonFabButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonPage,
    IonTitle,
    IonContent,
    IonFab,
    IonGrid, IonCol, IonRow, useIonViewWillEnter, useIonViewDidLeave
} from '@ionic/react';
import ContentManager from "../api/ContentManager";
import {Statement} from "../components/Statement"
import {IStatement} from "../api/Interfaces";

type IDiscoverProps = {
    contentManager: ContentManager
}

const SelectRandom = (pool: Array<IStatement>) => {
    return pool[Math.floor(Math.random() * pool.length)];
};

const Discover: React.FC<IDiscoverProps> = (props: IDiscoverProps) => {

    const [ allStatements, setAllStatements ] = useState<Array<IStatement>>([]);
    const [ selectedStatements, setSelectedStatements ] = useState<Array<IStatement>>([]);
    const [ head, setHead ] = useState<number>(0);


    // life cycle
    useIonViewWillEnter(() => {
        props.contentManager.RestoreFilters("discover");
        props.contentManager.ApplyFilter("ByType", "statement");
        setAllStatements(props.contentManager.GetModel().ComponentModels.map(comp => {
            return (comp.Model as IStatement);
        }));

        // populate
        setSelectedStatements(selectedStatements.concat(SelectRandom(allStatements)));
    });

    useIonViewDidLeave(() => {
        props.contentManager.CacheFilters("discover");
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Discover</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent/>
            <IonGrid>
                <IonCol>
                    <IonRow>
                        <IonIcon name="arrow-back"/>
                    </IonRow>
                    {
                        <Statement model={selectedStatements[head]} heartCallback={()=>{}}/>
                    }
                    <IonRow>
                        <IonIcon name="arrow-back"/>
                    </IonRow>
                </IonCol>
            </IonGrid>
            <IonContent/>
        </IonPage>
    );
};

export default Discover;
