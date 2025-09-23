// src/components/UnitRegistrationFormIonic.tsx
import React, { useMemo, useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
} from "@ionic/react";

type FormValues = {
  unitName: string;
  imei: string;
  phone: string;
  deviceType?: string;
  plate?: string;
  notes?: string;
};

interface Props {
  /** Called when the user presses “Create Unit” */
  onSubmit: (values: FormValues) => void;
  /** Optional loading flag to disable the button */
  submitting?: boolean;
  /** Optional error message to show under the form */
  errorText?: string;
  /** Optional initial values (useful if you navigate back to this page) */
  initial?: Partial<FormValues>;
}

/** Reasonable default options you can tweak any time */
const DEVICE_TYPES = [
  "Teltonika FMB920",
  "Teltonika FMB120",
  "Ruptela FM-Eco4",
  "Queclink GL300",
  "Meitrack T366",
];

const UnitRegistrationFormIonic: React.FC<Props> = ({
  onSubmit,
  submitting = false,
  errorText,
  initial = {},
}) => {
  // ---- local state (simple & dependency-free) ------------------------------
  const [unitName, setUnitName] = useState(initial.unitName ?? "");
  const [imei, setImei] = useState(initial.imei ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [deviceType, setDeviceType] = useState(initial.deviceType ?? "");
  const [plate, setPlate] = useState(initial.plate ?? "");
  const [notes, setNotes] = useState(initial.notes ?? "");

  // very light required-field check; expand if you like
  const canSubmit = useMemo(() => {
    return unitName.trim() !== "" && imei.trim() !== "" && phone.trim() !== "";
  }, [unitName, imei, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    onSubmit({
      unitName: unitName.trim(),
      imei: imei.trim(),
      phone: phone.trim(),
      deviceType: deviceType || undefined,
      plate: plate.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  // ---- render --------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Register New Unit</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Unit Name*</IonLabel>
            <IonInput
              value={unitName}
              onIonChange={(e) => setUnitName(e.detail.value ?? "")}
              placeholder="e.g. Toyota Hilux"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">IMEI*</IonLabel>
            <IonInput
              inputmode="numeric"
              value={imei}
              onIonChange={(e) => setImei(e.detail.value ?? "")}
              placeholder="15-digit IMEI"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Phone (SIM)*</IonLabel>
            <IonInput
              inputmode="tel"
              value={phone}
              onIonChange={(e) => setPhone(e.detail.value ?? "")}
              placeholder="+614xxxxxxxx"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Device Type</IonLabel>
            <IonSelect
              value={deviceType}
              onIonChange={(e) => setDeviceType(String(e.detail.value ?? ""))}
              interface="popover"
              placeholder="Select device (optional)"
            >
              {DEVICE_TYPES.map((d) => (
                <IonSelectOption key={d} value={d}>
                  {d}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Number Plate</IonLabel>
            <IonInput
              value={plate}
              onIonChange={(e) => setPlate(e.detail.value ?? "")}
              placeholder="Optional"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Notes</IonLabel>
            <IonTextarea
              rows={3}
              value={notes}
              onIonChange={(e) => setNotes(e.detail.value ?? "")}
              placeholder="Optional"
            />
          </IonItem>

          {!canSubmit && (
            <IonText color="medium">
              <p style={{ marginTop: 12 }}>
                Fields marked with * are required.
              </p>
            </IonText>
          )}

          {errorText && (
            <IonText color="danger">
              <p style={{ marginTop: 12 }}>{errorText}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={!canSubmit || submitting}
            style={{ marginTop: 16 }}
          >
            {submitting ? "Creating…" : "Create Unit"}
          </IonButton>
        </IonCardContent>
      </IonCard>
    </form>
  );
};

export default UnitRegistrationFormIonic;
