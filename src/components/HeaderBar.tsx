import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { home, settings } from "ionicons/icons";
import { useHistory } from "react-router-dom";

type HeaderBarProps = {
  title: string;
  /** Hide the back button (e.g. on Login/Job Select) */
  hideBack?: boolean;
  /** Hide the home button */
  hideHome?: boolean;
  /** Hide the config (gear) button */
  hideConfig?: boolean;
  /** Optional right-side extra content */
  right?: React.ReactNode;
};

/**
 * Consistent app header with:
 *  - Back (falls back to /job-select if no history)
 *  - Home (Job Select)
 *  - Config (gear)
 */
const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  hideBack,
  hideHome,
  hideConfig,
  right,
}) => {
  const history = useHistory();

  const goHome = () => history.replace("/job-select");
  const goConfig = () => history.push("/config");

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {!hideBack && (
            <IonBackButton defaultHref="/job-select" text="Back" />
          )}
          {!hideHome && (
            <IonButton onClick={goHome} aria-label="Home">
              <IonIcon icon={home} slot="icon-only" />
            </IonButton>
          )}
        </IonButtons>

        <IonTitle>{title}</IonTitle>

        <IonButtons slot="end">
          {right}
          {!hideConfig && (
            <IonButton onClick={goConfig} aria-label="Config">
              <IonIcon icon={settings} slot="icon-only" />
            </IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderBar;
