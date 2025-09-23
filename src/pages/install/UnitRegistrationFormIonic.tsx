import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonIcon,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { camera, images, trash } from "ionicons/icons";
import HomeButton from "../../components/HomeButton";

type Photo = {
  file: File;
  url: string; // object URL for preview
};

const UnitRegistrationFormIonic: React.FC = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const job = location.state?.job ?? null;

  // Core identity
  const [serial, setSerial] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vin, setVin] = useState("");

  // Comms + identifiers
  const [imei, setImei] = useState("");
  const [phone, setPhone] = useState("");
  const [rego, setRego] = useState("");

  // Status / metrics
  const [odo, setOdo] = useState<string>("");

  // Notes
  const [notes, setNotes] = useState("");

  // Photos
  const [photosBefore, setPhotosBefore] = useState<Photo[]>([]);
  const [photosAfter, setPhotosAfter] = useState<Photo[]>([]);

  const addPhotos = (listSetter: React.Dispatch<React.SetStateAction<Photo[]>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;
      const mapped = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
      listSetter((prev) => [...prev, ...mapped]);
      // clear the input value so the same file can be selected again if needed
      e.target.value = "";
    };

  const removePhoto = (index: number, listSetter: React.Dispatch<React.SetStateAction<Photo[]>>) => {
    listSetter((prev) => {
      const next = [...prev];
      // revoke object URL to avoid memory leaks
      URL.revokeObjectURL(next[index].url);
      next.splice(index, 1);
      return next;
    });
  };

  const handleTestUnit = () => {
    // Stub: plug your real diagnostic/test logic here (API/Capacitor BLE/etc.)
    alert("Running unit tests… (stub)\n• Power: OK\n• GPS: Acquiring\n• Cellular: Connected");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation — expand as needed
    if (!serial || !vehicle || !imei || !phone || !rego) {
      alert("Please complete Serial, Vehicle, IMEI, Phone/SIM, and Rego.");
      return;
    }

    // Build payload (convert photos to FormData in real integration)
    const payload = {
      job,
      serial,
      vehicle,
      vin,
      imei,
      phone,
      rego,
      odo: odo ? Number(odo) : undefined,
      notes,
      photosBeforeCount: photosBefore.length,
      photosAfterCount: photosAfter.length,
    };

    // TODO: send to your API (use fetch/axios; use FormData for files)
    console.log("Create Unit payload:", payload);
    alert("Unit created (stub). Check console for payload.");

    history.push("/jobs");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/install-type" />
          </IonButtons>
          <IonTitle>New Install {job ? `– ${job.name ?? job.id}` : ""}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/jobs")}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Unit Details</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Unit Serial *</IonLabel>
                  <IonInput
                    value={serial}
                    onIonChange={(e) => setSerial(e.detail.value ?? "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Vehicle / Asset *</IonLabel>
                  <IonInput
                    value={vehicle}
                    onIonChange={(e) => setVehicle(e.detail.value ?? "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">VIN</IonLabel>
                  <IonInput
                    value={vin}
                    onIonChange={(e) => setVin(e.detail.value ?? "")}
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Identifiers & Comms</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">IMEI *</IonLabel>
                  <IonInput
                    inputmode="numeric"
                    value={imei}
                    onIonChange={(e) => setImei(e.detail.value ?? "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Phone / SIM *</IonLabel>
                  <IonInput
                    inputmode="tel"
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value ?? "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Rego *</IonLabel>
                  <IonInput
                    value={rego}
                    onIonChange={(e) => setRego(e.detail.value ?? "")}
                    required
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Status</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Odometer (km)</IonLabel>
                  <IonInput
                    inputmode="numeric"
                    value={odo}
                    onIonChange={(e) => setOdo(e.detail.value ?? "")}
                    placeholder="e.g. 125430"
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Photos (Before)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-between">
                  <IonCol size="12" sizeMd="6">
                    <input
                      id="before-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={addPhotos(setPhotosBefore)}
                      style={{ display: "none" }}
                    />
                    <IonButton
                      onClick={() => document.getElementById("before-photos")?.click()}
                    >
                      <IonIcon slot="start" icon={camera} />
                      Add Photos
                    </IonButton>
                  </IonCol>
                  <IonCol size="12">
                    {photosBefore.length === 0 && (
                      <IonText color="medium">No photos added.</IonText>
                    )}
                    <div className="grid" style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", marginTop: 8 }}>
                      {photosBefore.map((p, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img src={p.url} alt={`before-${idx}`} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} />
                          <IonChip
                            outline
                            color="danger"
                            onClick={() => removePhoto(idx, setPhotosBefore)}
                            style={{ position: "absolute", top: 6, right: 6, cursor: "pointer" }}
                          >
                            <IonIcon icon={trash} />
                          </IonChip>
                        </div>
                      ))}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Photos (After)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-between">
                  <IonCol size="12" sizeMd="6">
                    <input
                      id="after-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={addPhotos(setPhotosAfter)}
                      style={{ display: "none" }}
                    />
                    <IonButton
                      fill="outline"
                      onClick={() => document.getElementById("after-photos")?.click()}
                    >
                      <IonIcon slot="start" icon={images} />
                      Add Photos
                    </IonButton>
                  </IonCol>
                  <IonCol size="12">
                    {photosAfter.length === 0 && (
                      <IonText color="medium">No photos added.</IonText>
                    )}
                    <div className="grid" style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", marginTop: 8 }}>
                      {photosAfter.map((p, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img src={p.url} alt={`after-${idx}`} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} />
                          <IonChip
                            outline
                            color="danger"
                            onClick={() => removePhoto(idx, setPhotosAfter)}
                            style={{ position: "absolute", top: 6, right: 6, cursor: "pointer" }}
                          >
                            <IonIcon icon={trash} />
                          </IonChip>
                        </div>
                      ))}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Notes</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Installer Notes</IonLabel>
                <IonTextarea
                  value={notes}
                  onIonChange={(e) => setNotes(e.detail.value ?? "")}
                  rows={4}
                  placeholder="Mounting location, wiring notes, anything unusual…"
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonButton expand="block" color="medium" onClick={handleTestUnit}>
                  Test Unit
                </IonButton>
              </IonCol>
              <IonCol size="12" sizeMd="6">
                <IonButton type="submit" expand="block" color="primary">
                  Create Unit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>

        {/* Persistent Home button at the very bottom */}
        <div className="ion-padding-top">
          <HomeButton />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UnitRegistrationFormIonic;
