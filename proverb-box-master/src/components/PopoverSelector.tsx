/*
 *  The high level popover for navigation: (for use in Library.tsx)
 *  Controlled by props.context (Library Context)
 *  -> Changed with props.setContext (Library Context).
 *
 */

import {
    IonContent,
    IonLabel,
    IonPopover,
    IonSegment,
    IonSegmentButton
} from "@ionic/react";
import React from "react";
import ContentManager from "../api/ContentManager";
import DefaultConfig from "../pages/DefaultDisplayConfig";
import {ILibraryContext} from "../api/Interfaces";
import {StatementPopoverContent} from "./StatementPopoverContent";
import {SayingPopoverContent} from "./SayingPopoverContent";
import {AllPopoverContent} from "./AllPopoverContent";
import update from 'immutability-helper';


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

    /* Set the selection box based on mode */
    if (props.context.Mode == "statement") {
        popoverContent = (<StatementPopoverContent contentManager={props.contentManager}
                                  context={props.context}
                                  setContext={props.setContext}
                                  isOpen={props.isOpen}
                                  event={props.event}
                                  onDismiss={props.onDismiss}
                                  />);
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
                                    let mode = e.detail.value;
                                    props.contentManager.CacheFilters(props.context.Mode);
                                    props.setContext(update(props.context, {
                                        Mode: { $set: mode }
                                    }));
                                    props.contentManager.RestoreFilters(mode);
                                    props.contentManager.ApplyFilter("ByType", mode);

                                    if (mode == "all")
                                    {
                                        props.contentManager.ApplyFilter("ByChapter", props.context.Chapter[mode]);
                                    }

                                    props.onUpdate();
                                    console.log("Switched modes!: filter ",  e.detail.value);
                                }
                            }
                        }>
                            <IonSegmentButton value="statement">
                                <IonLabel>Statements</IonLabel>
                            </IonSegmentButton>
                            {/* <IonSegmentButton value="saying">
                                <IonLabel>Sayings</IonLabel>
                            </IonSegmentButton> */}
                            <IonSegmentButton value="all">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>

                    {/* Flexible content, configured above */}
                    { popoverContent }
                </div> {/* End #filter-container */}
            </IonContent>
        </IonPopover>
    );
};

export {PopoverSelector};