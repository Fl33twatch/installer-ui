import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const JobSelect: React.FC = () => {
  const history = useHistory();

  function logout() {
    localStorage.removeItem("fw_auth");
    history.replace("/login");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Job</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>What are we doing today?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <IonButton routerLink="/register-unit" fill="solid">New install</IonButton>
                <IonButton routerLink="/lookup" color="medium" fill="outline">Existing install</IonButton>
                <IonButton color="danger" fill="clear" onClick={logout}>Logout</IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobSelect;
