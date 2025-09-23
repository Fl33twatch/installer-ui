import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  useIonToast,
} from "@ionic/react";
import { useConfig } from "../config/ConfigProvider";
import TopBar from "../components/TopBar";

const ConfigPage: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [apiBaseUrl, setApiBaseUrl] = useState(config.apiBaseUrl);
  const [organisation, setOrganisation] = useState(config.organisation);
  const [present] = useIonToast();

  const onSave = () => {
    setConfig({ apiBaseUrl, organisation });
    present({ message: "Saved", duration: 1200, position: "top" });
  };

  return (
    <IonPage>
      <TopBar title="Config" backHref="/login" homeHref="/jobs" />
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">API Base URL</IonLabel>
          <IonInput
            value={apiBaseUrl}
            onIonChange={(e) => setApiBaseUrl(e.detail.value ?? "")}
            placeholder="https://api.example.com"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Organisation</IonLabel>
          <IonInput
            value={organisation}
            onIonChange={(e) => setOrganisation(e.detail.value ?? "")}
          />
        </IonItem>

        <div className="ion-padding-top">
          <IonButton expand="block" onClick={onSave}>
            Save
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ConfigPage;
