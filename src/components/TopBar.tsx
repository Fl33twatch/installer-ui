import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { home } from "ionicons/icons";

type Props = {
  title: string;
  /** Where the Back button goes if there’s no history */
  backHref?: string;
  /** Where the Home button goes */
  homeHref?: string;
};

const TopBar: React.FC<Props> = ({ title, backHref = "/login", homeHref = "/jobs" }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref={backHref} />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton routerLink={homeHref} routerDirection="root">
            <IonIcon slot="icon-only" icon={home} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default TopBar;
