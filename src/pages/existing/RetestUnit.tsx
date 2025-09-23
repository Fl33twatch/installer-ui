// ==============================================================
 // RetestUnit.tsx
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const RetestUnit: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation() as any;
  const job = state?.job ?? null;
  const unit = state?.unit ?? null;
  const [present] = useIonToast();

  type Result = "unknown" | "pass" | "fail";
  const [power, setPower] = useState<Result>("unknown");
  const [ign, setIgn] = useState<Result>("unknown");
  const [gps, setGps] = useState<Result>("unknown");
  const [cell, setCell] = useState<Result>("unknown");

  const runTest = async () => {
    // TODO: call your diagnostics API
    setPower("pass");
    setIgn("pass");
    setGps("fail");
    setCell("pass");
    await present({ message: "Diagnostics complete", duration: 1500, color: "primary" });
  };

  const badge = (r: Result) => (
    r === "pass" ? <IonBadge color="success">PASS</IonBadge>
    : r === "fail" ? <IonBadge color="danger">FAIL</IonBadge>
    : <IonBadge color="medium">UNKNOWN</IonBadge>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/install/existing/actions" />
          </IonButtons>
          <IonTitle>Re-test – {unit?.id ?? "Unit"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Live Checks</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Power</IonLabel>
                {badge(power)}
              </IonItem>
              <IonItem>
                <IonLabel>Ignition</IonLabel>
                {badge(ign)}
              </IonItem>
              <IonItem>
                <IonLabel>GPS</IonLabel>
                {badge(gps)}
              </IonItem>
              <IonItem>
                <IonLabel>Cellular</IonLabel>
                {badge(cell)}
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" onClick={runTest}>
          Run Test
        </IonButton>
        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RetestUnit;
