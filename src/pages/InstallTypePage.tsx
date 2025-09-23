import React, { useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";

const InstallTypePage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const jobId = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("job") ?? "";
  }, [location.search]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/jobs" />
          </IonButtons>
          <IonTitle>Choose Install Type</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>
              <IonIcon slot="icon-only" icon={homeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          onClick={() => history.push(`/install/new?job=${jobId}`)}
        >
          New Install
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          className="ion-margin-top"
          onClick={() => history.push(`/existing?job=${jobId}`)}
        >
          Existing Install
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default InstallTypePage;
