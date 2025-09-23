// src/pages/install/UnitRegistrationFormIonic.tsx
import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonNote,
  IonGrid, IonRow, IonCol, IonIcon, useIonToast
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { camera, refresh, trash } from "ionicons/icons";
import { showToast } from "../../utils/toast";
import { takePhotoAsFile } from "../../utils/camera";

type PhotoState = { file: File | null; url: string | null };

const UnitRegistrationFormIonic: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<any>();
  const jobName = state?.job?.name ?? state?.jobName ?? "Installation Job";
  const [present] = useIonToast();

  const [serial, setSerial] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vin, setVin] = useState("");
  const [imei, setImei] = useState("");
  const [phone, setPhone] = useState("");
  const [rego, setRego] = useState("");
  const [odo, setOdo] = useState("");
  const [notes, setNotes] = useState("");

  const [imeiPhoto, setImeiPhoto] = useState<PhotoState>({ file: null, url: null });
  const [odoPhoto, setOdoPhoto] = useState<PhotoState>({ file: null, url: null });
  const [regoPhoto, setRegoPhoto] = useState<PhotoState>({ file: null, url: null });

  const snap = async (setter: React.Dispatch<React.SetStateAction<PhotoState>>, label: string) => {
    try {
      const { file, url } = await takePhotoAsFile(label);
      setter(prev => { if (prev.url) URL.revokeObjectURL(prev.url); return { file, url }; });
    } catch {}
  };
  const clear = (setter: React.Dispatch<React.SetStateAction<PhotoState>>, current: PhotoState) => {
    if (current.url) URL.revokeObjectURL(current.url);
    setter({ file: null, url: null });
  };

  const allValid =
    serial.trim() && vehicle.trim() && imei.trim() && phone.trim() && rego.trim() && odo.trim() &&
    imeiPhoto.file && odoPhoto.file && regoPhoto.file;

  const submit = async () => {
    if (!allValid) {
      await showToast(present, "Fill all fields and capture IMEI, ODO and REGO/VIN photos.", "danger");
      return;
    }
    const form = new FormData();
    form.append("serial", serial.trim());
    form.append("vehicle", vehicle.trim());
    form.append("vin", vin.trim());
    form.append("imei", imei.trim());
    form.append("phone", phone.trim());
    form.append("rego", rego.trim().toUpperCase());
    form.append("odo", odo.trim());
    form.append("notes", notes);
    if (imeiPhoto.file) form.append("photo_imei", imeiPhoto.file, imeiPhoto.file.name);
    if (odoPhoto.file) form.append("photo_odo", odoPhoto.file, odoPhoto.file.name);
    if (regoPhoto.file) form.append("photo_rego", regoPhoto.file, regoPhoto.file.name);

    try {
      // TODO: real API call
      await new Promise(r => setTimeout(r, 800));
      await showToast(present, "Unit created", "success");
      history.push("/jobs");
    } catch (e) {
      await showToast(present, "Failed to create unit", "danger");
    }
  };

  const PhotoBlock: React.FC<{
    title: string; hint?: string; state: PhotoState;
    onTake: () => void; onClear: () => void; required?: boolean;
  }> = ({ title, hint, state, onTake, onClear, required = true }) => (
    <IonItem lines="full">
      <IonLabel position="stacked">
        {title} {required && <IonNote color="danger">*</IonNote>}
        {hint && <div style={{ fontSize: 12, opacity: 0.8 }}>{hint}</div>}
      </IonLabel>
      <IonGrid className="ion-no-padding" style={{ width: "100%" }}>
        <IonRow className="ion-align-items-center">
          <IonCol size="6">
            {state.url ? (
              <div style={{ width: "100%", height: 120, borderRadius: 8, overflow: "hidden", background: "#f1f3f5" }}>
                <img src={state.url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <IonButton expand="block" onClick={onTake}><IonIcon icon={camera} slot="start" />Take Photo</IonButton>
            )}
          </IonCol>
          <IonCol size="6" className="ion-text-right">
            <IonButton fill="outline" onClick={onTake}><IonIcon icon={refresh} slot="start" />Retake</IonButton>
            <IonButton color="danger" fill="clear" onClick={onClear} disabled={!state.file}>
              <IonIcon icon={trash} slot="icon-only" />
            </IonButton>
          </IonCol>
        </IonRow>
        {!state.file && required && (
          <IonRow><IonCol><IonNote color="danger">Required</IonNote></IonCol></IonRow>
        )}
      </IonGrid>
    </IonItem>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/install-type" /></IonButtons>
          <IonTitle>New Install – {jobName}</IonTitle>
          <IonButtons slot="end"><IonButton onClick={() => history.push("/jobs")}>Home</IonButton></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem><IonLabel position="stacked">Unit Serial <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={serial} onIonChange={e => setSerial(e.detail.value ?? "")} /></IonItem>
          <IonItem><IonLabel position="stacked">Vehicle / Asset <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={vehicle} onIonChange={e => setVehicle(e.detail.value ?? "")} /></IonItem>
          <IonItem><IonLabel position="stacked">VIN</IonLabel>
            <IonInput value={vin} onIonChange={e => setVin(e.detail.value ?? "")} /></IonItem>
          <IonItem><IonLabel position="stacked">IMEI <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={imei} onIonChange={e => setImei(e.detail.value ?? "")} inputmode="numeric" /></IonItem>
          <IonItem><IonLabel position="stacked">Phone / SIM <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={phone} onIonChange={e => setPhone(e.detail.value ?? "")} inputmode="tel" /></IonItem>
          <IonItem><IonLabel position="stacked">Rego <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={rego} onIonChange={e => setRego(e.detail.value ?? "")} /></IonItem>
          <IonItem><IonLabel position="stacked">Odometer (km) <IonNote color="danger">*</IonNote></IonLabel>
            <IonInput value={odo} onIonChange={e => setOdo(e.detail.value ?? "")} inputmode="numeric" /></IonItem>
          <IonItem><IonLabel position="stacked">Installer Notes</IonLabel>
            <IonTextarea value={notes} onIonChange={e => setNotes(e.detail.value ?? "")} rows={4} /></IonItem>

          <PhotoBlock title="Photo: IMEI" hint="Module label showing IMEI"
            state={imeiPhoto} onTake={() => snap(setImeiPhoto, "imei")} onClear={() => clear(setImeiPhoto, imeiPhoto)} />
          <PhotoBlock title="Photo: Odometer" hint="Dashboard odometer reading"
            state={odoPhoto} onTake={() => snap(setOdoPhoto, "odo")} onClear={() => clear(setOdoPhoto, odoPhoto)} />
          <PhotoBlock title="Photo: Rego / VIN" hint="Number plate, rego sticker, or VIN plate"
            state={regoPhoto} onTake={() => snap(setRegoPhoto, "rego")} onClear={() => clear(setRegoPhoto, regoPhoto)} />
        </IonList>

        <div className="ion-padding">
          <IonButton expand="block" onClick={submit} disabled={!allValid}>Create Unit</IonButton>
          <IonButton expand="block" color="medium" onClick={() => history.push("/jobs")}>Home</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UnitRegistrationFormIonic;
