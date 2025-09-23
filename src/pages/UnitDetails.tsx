import React from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";

type Params = { id: string };

const UnitDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const unit = {
    id,
    imei: id.match(/^\d+$/) ? id : "863071060000000",
    phone: "+61400000000",
    status: "Active",
  };

  return (
    <IonPage>
      <TopBar title="Unit Details" backHref="/lookup" homeHref="/jobs" />
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>Device ID</h2>
              <p>{unit.id}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>IMEI</h2>
              <p>{unit.imei}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Phone</h2>
              <p>{unit.phone}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Status</h2>
              <p>{unit.status}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UnitDetails;
