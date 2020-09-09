import {IonItem, IonLabel, IonList, IonRadio} from "@ionic/react";
import React from "react";
import {ITextRange} from "../api/Interfaces";

type IRange = {
    "Title": string,
    "Intro": {
        "Ch": number, "Vs": number, "Part": boolean
    },
    "Start": {
        "Ch": number,
        "Vs": number
    },
    "End": {
        "Ch": 22,
        "Vs": 16
    }
}

type IProps = {
    r: IRange;
}

const StatementPopoverContent = (props : IProps) => {

    return (
    <IonList>
        {
            // get chapter numbers
            Array.from({length: props.r.End.Ch - props.r.Start.Ch + 1}, (x, i) => {
                return i + props.r.Start.Ch;
            }).map(chapter => (   // map to components
                <IonItem key={chapter}>
                    <IonLabel className={"chapter-select"}><span
                        className={"text"}>Chapter {chapter}</span>
                    </IonLabel>
                    <IonRadio
                        slot="start"
                        value={chapter.toString()}
                        onChange={() => {
                            /*props.contentManager.ApplyFilter("BySpan",
                                {
                                    Chapter: r.Start.Ch,
                                    VerseNumber: r.Start.Vs
                                },
                                {
                                    Chapter: r.End.Ch,
                                    VerseNumber: r.End.Vs
                                }
                            )*/
                        }}
                    />
                </IonItem>
            ))
        }
    </IonList>
    )
};