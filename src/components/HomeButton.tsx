// src/components/HomeButton.tsx
import React from "react";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const HomeButton: React.FC<{ label?: string }> = ({ label = "Home" }) => {
  const history = useHistory();
  return (
    <IonButton onClick={() => history.push("/jobs")}>{label}</IonButton>
  );
};

export default HomeButton;
