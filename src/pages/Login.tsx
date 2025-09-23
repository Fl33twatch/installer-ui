import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput,
  IonButton, IonNote, IonSpinner
} from "@ionic/react";
import { useHistory } from "react-router-dom";

// Simple mocked login. Replace later with real API.
const mockLogin = async (username: string, pin: string) => {
  await new Promise(r => setTimeout(r, 400));
  // Very simple rule: both non-empty, and pin 4+ chars
  if (username.trim() && pin.trim().length >= 4) {
    // store lightweight session flag
    localStorage.setItem("fw_auth", JSON.stringify({ user: username, ts: Date.now() }));
    return { ok: true };
  }
  throw new Error("Invalid credentials");
};

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (loading) return;
    try {
      setLoading(true);
      await mockLogin(username, pin);
      history.replace("/job");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Installer Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Sign in</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={onSubmit}>
                <IonItem>
                  <IonLabel position="stacked">Technician ID</IonLabel>
                  <IonInput
                    value={username}
                    onIonInput={(e) => setUsername(String(e.detail.value || ""))}
                    placeholder="e.g., wayne"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">PIN</IonLabel>
                  <IonInput
                    value={pin}
                    type="password"
                    onIonInput={(e) => setPin(String(e.detail.value || ""))}
                    placeholder="4+ digits"
                    inputmode="numeric"
                    required
                  />
                </IonItem>
                {err && (
                  <IonItem>
                    <IonNote color="danger">{err}</IonNote>
                  </IonItem>
                )}
                <IonItem lines="none" style={{ marginTop: 12 }}>
                  <IonButton type="submit" expand="block">
                    {loading ? <IonSpinner name="dots" /> : "Login"}
                  </IonButton>
                </IonItem>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
