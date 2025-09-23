import React from "react";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

type Props = { to?: string; label?: string };

const HomeButton: React.FC<Props> = ({ to = "/jobs", label = "Home" }) => {
  const history = useHistory();
  return (
    <IonButton expand="block" onClick={() => history.push(to)}>
      {label}
    </IonButton>
  );
};

export default HomeButton;
