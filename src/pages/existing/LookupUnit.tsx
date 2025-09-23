import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSearchbar, IonList, IonItem, IonLabel, IonNote, IonButton
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";

const mockUnits = [
  { id: "U-1001", vin: "1HGBH41JXMN109186", rego: "123ABC", name: "Isuzu FRR" },
  { id: "U-1002", vin: "JH4KA8260MC000000", rego: "456DEF", name: "Hino 500" },
  { id: "U-1003", vin: "WDBUF56X48B000000", rego: "789GHI", name: "Kenworth T410" },
];

const LookupUnit: React.FC = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const job = location.state?.job ?? null;

  const [query, setQuery] = useState("");
  const filtered = mockUnits.filter(u => {
    const q = query.toLowerCase();
    return [u.id, u.vin, u.rego, u.name].some(v => v.toLowerCase().includes(q));
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/install-type" /></IonButtons>
          <IonTitle>Lookup Existing Unit {job ? `– ${job.name ?? job.id}` : ""}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar value={query} onIonInput={(e) => setQuery(e.detail.value ?? "")} placeholder="Search by serial, VIN, rego, name" />
        <IonList>
          {filtered.map(u => (
            <IonItem key={u.id} button detail onClick={() => history.push("/install/existing/actions", { job, unit: u })}>
              <IonLabel><h2>{u.name}</h2><p>ID: {u.id} · VIN: {u.vin}</p></IonLabel>
              <IonNote slot="end">{u.rego}</IonNote>
            </IonItem>
          ))}
          {filtered.length === 0 && (<IonItem><IonLabel>No matches. Try a different search.</IonLabel></IonItem>)}
        </IonList>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LookupUnit;
