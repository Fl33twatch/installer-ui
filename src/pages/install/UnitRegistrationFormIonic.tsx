// ==============================================================
// src/pages/install/UnitRegistrationFormIonic.tsx
// Create-first flow, then diagnostics; logs failures and notifies admin
// ==============================================================

import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonNote,
  IonGrid, IonRow, IonCol, IonIcon, IonBadge, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  useIonToast, IonSpinner, IonText
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { camera, refresh, trash, checkmarkCircle, closeCircle, warning } from "ionicons/icons";
import { showToast } from "../../utils/toast";
import { takePhotoAsFile } from "../../utils/camera";
import { testUnitDetailed } from "../../utils/diagnostics";
import { createUnit, logTestOutcome, notifyAdmin } from "../../utils/api";
import { compressImageFile } from "../../utils/image";
type PhotoState = { file: File | null; url: string | null };
type Result = "pass" | "fail" | "unknown";

const UnitRegistrationFormIonic: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<any>();
  const jobName = state?.job?.name ?? state?.jobName ?? "Installation Job";
  const jobId = state?.job?.id;

  const [present] = useIonToast();

  // ----- Form fields -----
  const [serial, setSerial] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vin, setVin] = useState("");
  const [imei, setImei] = useState("");
  const [phone, setPhone] = useState("");
  const [rego, setRego] = useState("");
  const [odo, setOdo] = useState("");
  const [notes, setNotes] = useState("");

  // ----- Photos -----
  const [imeiPhoto, setImeiPhoto] = useState<PhotoState>({ file: null, url: null });
  const [odoPhoto, setOdoPhoto] = useState<PhotoState>({ file: null, url: null });
  const [regoPhoto, setRegoPhoto] = useState<PhotoState>({ file: null, url: null });

  // ----- Diagnostics state -----
  const [testing, setTesting] = useState(false);
  const [report, setReport] = useState<{ power: Result; ign: Result; gps: Result; cell: Result }>({
    power: "unknown",
    ign: "unknown",
    gps: "unknown",
    cell: "unknown",
  });
  const [reasons, setReasons] = useState<Record<string, string | undefined>>({});

  // ----- Submit state -----
  const [submitting, setSubmitting] = useState(false);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false); // block job completion if test fails

  const snap = async (setter: React.Dispatch<React.SetStateAction<PhotoState>>, label: string) => {
  try {
    // 1) Take photo via Capacitor
    const { file } = await takePhotoAsFile(label);

    // 2) Compress
    const { file: smallFile, url } = await compressImageFile(file, { maxDim: 1600, quality: 0.8 });

    // 3) Store compressed file + preview
    setter((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);
      return { file: smallFile, url };
    });
  } catch {
    // user cancelled / permission denied
  }
};
  const clear = (setter: React.Dispatch<React.SetStateAction<PhotoState>>, current: PhotoState) => {
    if (current.url) URL.revokeObjectURL(current.url);
    setter({ file: null, url: null });
  };

  const allFieldsValid =
    serial.trim() && vehicle.trim() && imei.trim() && phone.trim() && rego.trim() && odo.trim() &&
    imeiPhoto.file && odoPhoto.file && regoPhoto.file;

  const Badge: React.FC<{ value: Result }> = ({ value }) =>
    value === "pass" ? (
      <IonBadge color="success"><IonIcon icon={checkmarkCircle} className="ion-margin-end" />PASS</IonBadge>
    ) : value === "fail" ? (
      <IonBadge color="danger"><IonIcon icon={closeCircle} className="ion-margin-end" />FAIL</IonBadge>
    ) : (
      <IonBadge color="medium">UNKNOWN</IonBadge>
    );

  const createThenTest = async () => {
    // 1) Create the unit first
    setSubmitting(true);
    try {
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

      const { unitId } = await createUnit(form);
      setUnitId(unitId);
      await showToast(present, "Unit created", "success");
    } catch (e) {
      setSubmitting(false);
      await showToast(present, "Failed to create unit", "danger");
      return;
    }

    // 2) Then run diagnostics
    setTesting(true);
    try {
      const { report, reasons } = await testUnitDetailed({ imei: imei.trim(), phone: phone.trim() });
      setReport({
        power: report.power,
        ign: report.ign,
        gps: report.gps,
        cell: report.cell,
      });
      setReasons(reasons);

      const anyFail = Object.values(report).includes("fail");
      if (anyFail) {
        setBlocked(true);
        await showToast(present, "Diagnostics found issues. Admin has been notified.", "warning");

        // 3) Log and notify admin
        if (unitId) {
          await logTestOutcome({ unitId, report, reasons });
          const summary = [
            report.power === "fail" && "Power",
            report.ign === "fail" && "Ignition",
            report.gps === "fail" && "GPS",
            report.cell === "fail" && "Cellular",
          ]
            .filter(Boolean)
            .join(", ");

          await notifyAdmin({
            unitId,
            jobId,
            jobName,
            summary: `Unit ${unitId} diagnostics failed: ${summary}`,
            details: reasons,
          });
        }
      } else {
        setBlocked(false);
        await showToast(present, "All checks passed", "success");
      }
    } catch (e) {
      setBlocked(true);
      await showToast(present, "Diagnostics could not run. Admin notified.", "danger");
      if (unitId) {
        await logTestOutcome({
          unitId,
          report: { power: "fail", ign: "fail", gps: "fail", cell: "fail" },
          reasons: { power: "Diagnostics error", ign: "Diagnostics error", gps: "Diagnostics error", cell: "Diagnostics error" },
        });
        await notifyAdmin({
          unitId,
          jobId,
          jobName,
          summary: `Unit ${unitId} diagnostics failed to run`,
          details: { error: "Diagnostics service not reachable" },
        });
      }
    } finally {
      setTesting(false);
      setSubmitting(false);
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
        {/* Block banner if job cannot be completed */}
        {blocked && (
          <IonCard color="warning" className="ion-margin-bottom">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={warning} className="ion-margin-end" />
                Job blocked — diagnostics failed
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              We’ve logged the failure and notified an admin to review. You can leave notes and return later.
            </IonCardContent>
          </IonCard>
        )}

        <IonList>
          {/* Core fields */}
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

          {/* Required photos */}
          <PhotoBlock title="Photo: IMEI"  hint="Module label showing IMEI"
            state={imeiPhoto} onTake={() => snap(setImeiPhoto, "imei")} onClear={() => clear(setImeiPhoto, imeiPhoto)} />
          <PhotoBlock title="Photo: Odometer" hint="Dashboard odometer reading"
            state={odoPhoto} onTake={() => snap(setOdoPhoto, "odo")} onClear={() => clear(setOdoPhoto, odoPhoto)} />
          <PhotoBlock title="Photo: Rego / VIN" hint="Number plate, rego sticker, or VIN plate"
            state={regoPhoto} onTake={() => snap(setRegoPhoto, "rego")} onClear={() => clear(setRegoPhoto, regoPhoto)} />
        </IonList>

        {/* After-create diagnostics section */}
        <IonCard className="ion-margin-top">
          <IonCardHeader><IonCardTitle>Diagnostics Status</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Power</IonLabel>
                <Badge value={report.power} />
                {reasons.power && <IonText color="medium" className="ion-margin-start">{reasons.power}</IonText>}
              </IonItem>
              <IonItem>
                <IonLabel>Ignition</IonLabel>
                <Badge value={report.ign} />
                {reasons.ign && <IonText color="medium" className="ion-margin-start">{reasons.ign}</IonText>}
              </IonItem>
              <IonItem>
                <IonLabel>GPS</IonLabel>
                <Badge value={report.gps} />
                {reasons.gps && <IonText color="medium" className="ion-margin-start">{reasons.gps}</IonText>}
              </IonItem>
              <IonItem>
                <IonLabel>Cellular</IonLabel>
                <Badge value={report.cell} />
                {reasons.cell && <IonText color="medium" className="ion-margin-start">{reasons.cell}</IonText>}
              </IonItem>
            </IonList>

            <div className="ion-margin-top">
              <IonButton
                expand="block"
                color="medium"
                onClick={async () => {
                  // Allow manual re-test
                  const prevBlocked = blocked;
                  setTesting(true);
                  try {
                    const { report, reasons } = await testUnitDetailed({ imei: imei.trim(), phone: phone.trim() });
                    setReport({
                      power: report.power,
                      ign: report.ign,
                      gps: report.gps,
                      cell: report.cell,
                    });
                    setReasons(reasons);
                    const anyFail = Object.values(report).includes("fail");
                    setBlocked(anyFail);
                    await showToast(present, anyFail ? "Diagnostics found issues" : "All checks passed");
                    if (anyFail && unitId) {
                      await logTestOutcome({ unitId, report, reasons });
                      await notifyAdmin({
                        unitId,
                        jobId,
                        jobName,
                        summary: `Unit ${unitId} diagnostics failed (manual re-test)`,
                        details: reasons,
                      });
                    }
                    // If it was blocked and now passed, inform:
                    if (prevBlocked && !anyFail) {
                      await showToast(present, "Issues resolved. You can proceed.", "success");
                    }
                  } finally {
                    setTesting(false);
                  }
                }}
                disabled={testing || submitting || !unitId /* can only re-test after creation */}
              >
                {testing && <IonSpinner name="dots" className="ion-margin-end" />}
                Re-test Unit
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Actions */}
        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={createThenTest}
            disabled={!allFieldsValid || submitting || testing}
          >
            {(submitting || testing) && <IonSpinner name="dots" className="ion-margin-end" />}
            Create Unit then Test
          </IonButton>

          <IonButton
            expand="block"
            color={blocked ? "medium" : "success"}
            onClick={() => history.push("/jobs")}
            disabled={testing || submitting}
          >
            {blocked ? "Return to Jobs (Pending Admin Review)" : "Home"}
          </IonButton>
        </div>

        {/* Unit ID hint */}
        {unitId && (
          <div className="ion-text-center ion-padding-top">
            <IonText color="medium">Created Unit ID: <strong>{unitId}</strong></IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UnitRegistrationFormIonic;
