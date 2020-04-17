import {
    IonButton,
    IonContent, IonItem,
    IonLabel,
    IonList,
    IonPopover, IonRadio,
    IonRadioGroup,
    IonSegment,
    IonSegmentButton
} from "@ionic/react";
import React, {useState} from "react";
import ContentManager from "../api/ContentManager";
import Statements from "../indexing/Statements.json"
import DefaultConfig from "../pages/DefaultDisplayConfig";
import {ILibraryContext} from "../api/Interfaces";
import ProverbsStructure from "../indexing/ProverbsStructure.json"
import update from 'immutability-helper'

type IPopProps = {
    contentManager: ContentManager,
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
    onUpdate: () => void,
};

const AllPopoverContent = (props : IPopProps) => {

    // config
    const defaultChapter : {[selector:string]: number} = DefaultConfig.chapter;
    const [typeDisplay, setTypeDisplay] = useState<string>("statement");
    const [browseMode, setBrowseMode] = useState<string>("descriptor");

    return (
        <>
            <div id={"select-mode-container"}>
                <h3 id={"mode-text"}>Chapter Select</h3>
                <IonButton id={"mode-button"} size="small" color="dark">Select by Descriptor</IonButton>
            </div>
            <div id={"top-shadow"}/>
            <div className={"selection-box"} onTouchStart={(e)=> e.preventDefault()}>
                { console.log("all chapters", props.context.Chapter["all"]) }
                <IonRadioGroup value={props.context.Chapter["all"].toString()} onIonChange={e => {
                    //props.contentManager.RemoveFilter("BySpan");
                    //props.contentManager.RemoveFilter("ByChapter");
                    props.contentManager.ApplyFilter("ByType", "all");

                    props.contentManager.ApplyFilter("ByChapter", parseInt(e.detail.value));
                    props.onUpdate();
                    props.setContext({
                        Mode: "all",
                        Chapter: update(props.context.Chapter, {
                            "all": {$set: e.detail.value}
                        }),
                        BrowseMode: browseMode
                    });
                }}>
                {Object.keys(ProverbsStructure.Verses).map(chapter => {
                        return (
                            <IonItem key={chapter}>
                                <IonLabel className={"chapter-select"}><span
                                    className={"text"}>Chapter {chapter}</span>
                                </IonLabel>
                                <IonRadio
                                    slot="start"
                                    value={chapter.toString()}
                                />
                            </IonItem>
                        );
                    })
                }
                </IonRadioGroup>
            </div> {/*End .selection-box*/}
        </>
    );
};

export {AllPopoverContent};