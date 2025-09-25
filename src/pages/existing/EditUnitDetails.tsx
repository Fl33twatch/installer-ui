// ==============================================================
// src/pages/existing/EditUnitDetails.tsx
// Adds validation + toasts + Home button
// ==============================================================

import React, { useState } from "react";
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
  IonInput,
  IonButton,
  IonText,
  useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import HomeButton from "../../components/HomeButton";
import { isNonEmpty, isRego } from "../../utils/validators";
import { showToast } from "../../utils/toast";

type Unit = {
  id: string;
  name?: string;
  rego?: string;
  vin?: string;
  phone?: string;
};

const EditUnitDetails: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<any>();
  const unit: Unit | undefined = state?.unit;

  const [present] = useIonToast();

  // Form state (prefill from unit if provided)
  const [name, setName] = useState(unit?.name ?? "");
  const [rego, setRego] = useState(unit?.rego ?? "");
  const [vin, setVin] = useState(unit?.vin ?? "");
  const [phone, setPhone] = useState(unit?.phone ?? "");

  const [errors, setErrors] = useState<{ name?: string; rego?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!isNonEmpty(name)) next.name = "Display name is required";
    if (!isNonEmpty(rego) || !isRego(rego)) next.rego = "Enter a valid rego (3–8 chars, letters/digits)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      await showToast(present, "Fix validation errors", "danger");
      return;
    }

    // TODO: Replace with real API call
    const payload = {
      id: unit?.id,
      name: name.trim(),
      rego: rego.trim().toUpperCase(),
      vin: vin.trim(),
      phone: phone.trim(),
    };
    console.log("EditUnitDetails payload:", payload);

    await showToast(present, "Unit details saved");
    history.push("/install/existing/actions", { unit: { ...(unit ?? {}), ...payload } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/install/existing/actions" />
          </IonButtons>
          <IonTitle>Edit Unit Details – {unit?.id ?? "Unit"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={save} noValidate>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Display Name *</IonLabel>
              <IonInput
                value={name}
                onIonChange={(e) => setName(e.detail.value ?? "")}
                required
              />
            </IonItem>
            {errors.name && (
              <IonText color="danger" className="ion-padding-start">
                {errors.name}
              </IonText>
            )}

            <IonItem>
              <IonLabel position="stacked">Rego *</IonLabel>
              <IonInput
                value={rego}
                onIonChange={(e) => setRego(e.detail.value ?? "")}
                required
              />
            </IonItem>
            {errors.rego && (
              <IonText color="danger" className="ion-padding-start">
                {errors.rego}
              </IonText>
            )}

            <IonItem>
              <IonLabel position="stacked">VIN</IonLabel>
              <IonInput value={vin} onIonChange={(e) => setVin(e.detail.value ?? "")} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Phone / SIM</IonLabel>
              <IonInput value={phone} onIonChange={(e) => setPhone(e.detail.value ?? "")} />
            </IonItem>
          </IonList>

          <div className="ion-padding-top">
            <IonButton type="submit" expand="block">
              Save
            </IonButton>
          </div>
        </form>

        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditUnitDetails;
