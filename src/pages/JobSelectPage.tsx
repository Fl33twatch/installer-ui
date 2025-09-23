import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButtons, IonButton
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import HomeButton from "../components/HomeButton";

const jobs = [
  { id: "job1", name: "Installation Job 1" },
  { id: "job2", name: "Installation Job 2" },
  { id: "job3", name: "Installation Job 3" },
];

const JobSelectPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Job</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {jobs.map((job) => (
            <IonItem
              key={job.id}
              button
              detail
              onClick={() => history.push("/install-type", { job })}
            >
              <IonLabel>{job.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobSelectPage;
