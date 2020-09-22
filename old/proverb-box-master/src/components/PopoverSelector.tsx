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
import DefaultConfig from "../pages/DefaultDisplayConfig";
import {ILibraryContext} from "../api/Interfaces";
import {StatementPopoverContent} from "./StatementPopoverContent";
import {AllPopoverContent} from "./AllPopoverContent";
import update from 'immutability-helper';


type IPopProps = {
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
};

const PopoverSelector = (props : IPopProps) => {
    // config
    const defaultChapter : {[selector:string]: number} = DefaultConfig.chapter;
    let popoverContent : any;

    /* Set the selection box based on mode */
    if (props.context.Mode == "statement") {
        popoverContent = (<StatementPopoverContent context={props.context} setContext={props.setContext} />);
    }
    else if (props.context.Mode == "all") {
        popoverContent = (<AllPopoverContent context={props.context} setContext={props.setContext}/>);
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
                                    props.setContext(update(props.context, {
                                        Mode: { $set: e.detail.value }
                                    }));
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