import {
    IonAlert,
    IonButton, IonItem, IonLabel, IonListHeader, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonSpinner
} from "@ionic/react";
import React, {useState} from "react";
import ContentManager from "../api/ContentManager"
import "./TranslationToggle.css"
import TranslationConfig from "../api/TranslationConfig"

type ITranslationToggleProps = {
    contentManager: ContentManager
};

const TranslationToggle = (props : ITranslationToggleProps) => {

    const [version, setVersion] = useState<string>(props.contentManager.GetTranslationName());
    const [loading, setLoading] = useState<boolean>(version === "LOADING");

    if (version === "LOADING")
    {
        props.contentManager.OnLoadTranslation(()=>{
            setLoading(false);
            setVersion(props.contentManager.GetTranslationName());
        });
    }

    const [selectOpen, setSelectOpen] = useState<boolean>(false);

    return (
        <div className={"translation-toggle-container"}>
            <IonButton expand={"block"} class="translation-toggle" onClick={()=>{
                setSelectOpen(true);
            }}>
                {
                    loading ? (
                            <IonSpinner color="light" name="dots" />
                        )
                        :
                        (
                            <p className={"version-tag"}>{version.substr(0, 4).toUpperCase()}</p>
                        )
                }

            </IonButton>

            <IonAlert
                isOpen={selectOpen}
                onDidDismiss={() => setSelectOpen(false)}
                inputs={
                    Object.entries(TranslationConfig).map(([key, translation]) => {
                        return {
                            name: key,
                            type: "radio",
                            label: translation.Label,
                            value: key,
                            checked: (props.contentManager.GetTranslationName() === key)
                        }
                    })
                }
                buttons={
                    [{
                        text: "Select Translation",
                        handler: (data : string)=>{
                            setLoading(true);
                            props.contentManager.LoadTranslation(data).then(()=>{
                                setVersion(data);
                                setLoading(false);
                            })
                        }

                    }]
                }
            />
        </div>
    );
};

export {TranslationToggle};
