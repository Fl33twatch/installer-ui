import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonBackButton
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const InstallType: React.FC = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const job = location.state?.job ?? null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/jobs" /></IonButtons>
          <IonTitle>Choose Install Type {job ? `– ${job.name ?? job.id}` : ""}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="grid gap-4">
          <IonButton expand="block" onClick={() => history.push("/install/new", { job })}>
            New Install
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={() => history.push("/install/existing/lookup", { job })}>
            Existing Install
          </IonButton>
        </div>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InstallType;
