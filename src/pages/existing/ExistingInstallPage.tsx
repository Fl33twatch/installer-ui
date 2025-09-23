import React, { useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";

const ExistingInstallPage: React.FC = () => {
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
            <IonBackButton defaultHref={`/install-type?job=${jobId}`} />
          </IonButtons>
          <IonTitle>Existing Install — Job {jobId}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>
              <IonIcon slot="icon-only" icon={homeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel>Engine Disable</IonLabel>
            <IonToggle />
          </IonItem>
          <IonItem>
            <IonLabel>Immobiliser Armed</IonLabel>
            <IonToggle />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={() => history.push(`/lookup?job=${jobId}&mode=existing`)}
        >
          Re-test / Lookup Unit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ExistingInstallPage;
