// ==============================================================
 // AddedFeatures.tsx
// ==============================================================

import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonTextarea,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const AddedFeatures: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation() as any;
  const job = state?.job ?? null;
  const unit = state?.unit ?? null;
  const [present] = useIonToast();

  // Feature toggles
  const [immobiliser, setImmobiliser] = useState(false);
  const [doorSense, setDoorSense] = useState(false);
  const [panic, setPanic] = useState(false);
  const [tempProbe, setTempProbe] = useState(false);
  const [driverID, setDriverID] = useState(false);
  const [camera, setCamera] = useState(false);
  const [buzzer, setBuzzer] = useState(false);
  const [notes, setNotes] = useState("");

  const save = async () => {
    const payload = {
      job,
      unit,
      features: { immobiliser, doorSense, panic, tempProbe, driverID, camera, buzzer },
      notes,
    };
    console.log("Save features payload:", payload);
    await present({ message: "Features saved", duration: 1500, color: "success" });
    history.push("/install/existing/actions", { job, unit });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/install/existing/actions" />
          </IonButtons>
          <IonTitle>Added Features – {unit?.id ?? "Unit"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Hardware / Options</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Immobiliser</IonLabel>
                <IonToggle checked={immobiliser} onIonChange={e => setImmobiliser(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Door Sense</IonLabel>
                <IonToggle checked={doorSense} onIonChange={e => setDoorSense(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Panic Button</IonLabel>
                <IonToggle checked={panic} onIonChange={e => setPanic(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Temperature Probe</IonLabel>
                <IonToggle checked={tempProbe} onIonChange={e => setTempProbe(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Driver ID (iButton/RFID)</IonLabel>
                <IonToggle checked={driverID} onIonChange={e => setDriverID(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Camera</IonLabel>
                <IonToggle checked={camera} onIonChange={e => setCamera(!!e.detail.checked)} />
              </IonItem>
              <IonItem>
                <IonLabel>Buzzer</IonLabel>
                <IonToggle checked={buzzer} onIonChange={e => setBuzzer(!!e.detail.checked)} />
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Notes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Feature notes</IonLabel>
              <IonTextarea
                value={notes}
                onIonChange={e => setNotes(e.detail.value ?? "")}
                rows={4}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" onClick={save} color="primary">
          Save
        </IonButton>
        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddedFeatures;
