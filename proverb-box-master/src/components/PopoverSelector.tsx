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
import {StatementPopoverContent} from "./StatementPopoverContent";
import {SayingPopoverContent} from "./SayingPopoverContent";
import {AllPopoverContent} from "./AllPopoverContent";


type IPopProps = {
    contentManager: ContentManager,
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
    onUpdate: () => void
};

const PopoverSelector = (props : IPopProps) => {
    // config
    const defaultChapter : {[selector:string]: number} = DefaultConfig.chapter;
    let popoverContent : any;
    if (props.context.Mode == "statement") {
        popoverContent = (<StatementPopoverContent contentManager={props.contentManager}
                                  context={props.context}
                                  setContext={props.setContext}
                                  isOpen={props.isOpen}
                                  event={props.event}
                                  onDismiss={props.onDismiss}
                                  onUpdate={props.onUpdate}/>);
    }
    else if (props.context.Mode == "saying") {
        popoverContent = (<SayingPopoverContent contentManager={props.contentManager}
                                                   context={props.context}
                                                   setContext={props.setContext}
                                                   isOpen={props.isOpen}
                                                   event={props.event}
                                                   onDismiss={props.onDismiss}
                                                   onUpdate={props.onUpdate}/>);
    }
    else if (props.context.Mode == "all") {
        popoverContent = (<AllPopoverContent contentManager={props.contentManager}
                                                context={props.context}
                                                setContext={props.setContext}
                                                isOpen={props.isOpen}
                                                event={props.event}
                                                onDismiss={props.onDismiss}
                                                onUpdate={props.onUpdate}/>);
    }
    else {
        throw("unrecognized context mode.")
    }

    return (
        <IonPopover id={"popover-filter"} event={props.event as Event} isOpen={props.isOpen}
                    onDidDismiss={e => {
                        props.onDismiss();
                    }}>
            <IonContent scrollY={false}>
                <div id={"filter-container"}>
                    <div>
                        <IonSegment value={props.context.Mode} onIonChange={
                            e => {
                                if (e.detail.value !== undefined) {
                                    // update to deep copy
                                    const n_ctx: ILibraryContext = {
                                        Mode: e.detail.value,
                                        Chapter:props.context.Chapter
                                    };
                                    props.setContext(n_ctx);
                                    console.log(e.detail.value);
                                    props.contentManager.ApplyFilter("ByType", props.context.Mode);
                                    props.onUpdate();
                                }
                            }
                        }>
                            <IonSegmentButton value="statement">
                                <IonLabel>Statements</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="saying">
                                <IonLabel>Sayings</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="all">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>

                    { popoverContent }
                </div> {/* End #filter-container */}
            </IonContent>
        </IonPopover>
    );
};

export {PopoverSelector};