import React, { useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import UnitRegistrationFormIonic from "../components/UnitRegistrationFormIonic";

type UnitFormValues = {
  name: string;
  imei: string;
  phone: string;
  deviceType?: string;
  numberPlate?: string;
  notes?: string;
};


const RegisterUnit: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const jobId = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("job") ?? "";
  }, [location.search]);

  const handleSubmit = async (values: UnitFormValues) => {
    // TODO: Call your backend to create the unit, then navigate to details/lookup/etc.
    // For now we’ll go to Lookup in “new” mode so you can test the flow
    history.replace(`/lookup?job=${jobId}&mode=new`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/install-type?job=${jobId}`} />
          </IonButtons>
          <IonTitle>New Install</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>
              <IonIcon slot="icon-only" icon={homeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Register New Unit</IonCardTitle>
          </IonCardHeader>
          <UnitRegistrationFormIonic onSubmit={handleSubmit} />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterUnit;
