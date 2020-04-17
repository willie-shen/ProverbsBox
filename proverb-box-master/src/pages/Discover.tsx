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
import update from "immutability-helper";

type IDiscoverProps = {
    contentManager: ContentManager
}

const SelectRandom = (pool: Array<IStatement>) => {
    console.log("Pool is: ", pool);
    console.log("select: ", pool[Math.floor(Math.random() * pool.length)]);
    return pool[Math.floor(Math.random() * pool.length)];
};

const Discover: React.FC<IDiscoverProps> = (props: IDiscoverProps) => {

    const [ allStatements, setAllStatements ] = useState<Array<IStatement>>([]);
    const [ selectedStatements, setSelectedStatements ] = useState<Array<IStatement>>([]);
    const [ head, setHead ] = useState<number>(-1);

    // life cycle
    useIonViewWillEnter(() => {
        props.contentManager.RestoreFilters("discover");
        props.contentManager.ApplyFilter("ByType", "statement");

        props.contentManager.OnLoadTranslation(() => {
            let allStatements_local = props.contentManager.GetModel().ComponentModels.map(comp => {
                return (comp.Model as IStatement);
            });
            setAllStatements(allStatements_local);

            // populate
            setHead((prev) => {return ++prev});
            setSelectedStatements(update(selectedStatements, { $push: [SelectRandom(allStatements_local)] }));
        });
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
                    {console.log(selectedStatements)}
                    {
                        (selectedStatements.length > 0)
                        ? <Statement model={selectedStatements[head]} heartCallback={()=>{}}/>
                        : <></>
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
