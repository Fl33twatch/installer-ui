import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const ExistingInstallActions: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<any>();
  const job = state?.job ?? null;
  const unit = state?.unit ?? null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/install/existing/lookup" /></IonButtons>
          <IonTitle>{unit ? `Unit ${unit.id}` : "Unit"} – Select Action</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="grid gap-4">
          <IonCard button onClick={() => history.push("/install/existing/features", { job, unit })}>
            <IonCardHeader><IonCardTitle>Added Features</IonCardTitle></IonCardHeader>
            <IonCardContent>Attach/enable new features (e.g., engine disable).</IonCardContent>
          </IonCard>

          <IonCard button onClick={() => history.push("/install/existing/retest", { job, unit })}>
            <IonCardHeader><IonCardTitle>Re-test Unit</IonCardTitle></IonCardHeader>
            <IonCardContent>Run diagnostics and validation tests.</IonCardContent>
          </IonCard>

          <IonCard button onClick={() => history.push("/install/existing/edit", { job, unit })}>
            <IonCardHeader><IonCardTitle>Change Unit Details</IonCardTitle></IonCardHeader>
            <IonCardContent>Update configuration or registration details.</IonCardContent>
          </IonCard>
        </div>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExistingInstallActions;
