import React from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel
} from "@ionic/react";
import { logInOutline, searchOutline, settingsOutline } from "ionicons/icons";

const AppMenu: React.FC = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Installer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/login" routerDirection="root">
              <IonIcon slot="start" icon={logInOutline} />
              <IonLabel>Login</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/lookup" routerDirection="root">
              <IonIcon slot="start" icon={searchOutline} />
              <IonLabel>Lookup</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/config" routerDirection="root">
              <IonIcon slot="start" icon={settingsOutline} />
              <IonLabel>Config</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
