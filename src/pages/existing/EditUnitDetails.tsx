import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonInput, IonButton
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const EditUnitDetails: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<any>();
  const unit = state?.unit;

  const [name, setName] = useState(unit?.name ?? "");
  const [rego, setRego] = useState(unit?.rego ?? "");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save changes via API
    alert(`Saved changes for ${unit?.id ?? "Unit"}`);
    history.push("/install/existing/actions", { unit });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/install/existing/actions" /></IonButtons>
          <IonTitle>Edit Unit Details – {unit?.id ?? "Unit"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={save}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Display Name</IonLabel>
              <IonInput value={name} onIonChange={(e) => setName(e.detail.value ?? "")} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Rego</IonLabel>
              <IonInput value={rego} onIonChange={(e) => setRego(e.detail.value ?? "")} />
            </IonItem>
          </IonList>
          <div className="ion-padding-top">
            <IonButton type="submit" expand="block">Save</IonButton>
          </div>
        </form>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditUnitDetails;
