import React from "react";
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
  IonButton,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";

type CreatedUnit = {
  id: string;
  imei?: string;
  phone?: string;
  registration?: string;
  make?: string;
  model?: string;
};

type LocState = { unit?: CreatedUnit };

const RegisterUnitConfirm: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<LocState>();
  const unit = state?.unit;

  const goToUnit = () => {
    if (unit?.id) history.replace(`/unit/${unit.id}`);
    else history.replace("/jobs");
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/jobs" />
          </IonButtons>
          <IonTitle>Unit Created</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <p>Nice! The unit has been created successfully.</p>

        {unit && (
          <IonList inset>
            <IonItem>
              <IonLabel>
                <h3>Unit ID</h3>
                <p>{unit.id}</p>
              </IonLabel>
            </IonItem>
            {unit.imei && (
              <IonItem>
                <IonLabel>
                  <h3>IMEI</h3>
                  <p>{unit.imei}</p>
                </IonLabel>
              </IonItem>
            )}
            {unit.registration && (
              <IonItem>
                <IonLabel>
                  <h3>Registration</h3>
                  <p>{unit.registration}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        <IonButton expand="block" onClick={goToUnit} className="ion-margin-top">
          {unit?.id ? "Open Unit" : "Back to Jobs"}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RegisterUnitConfirm;
