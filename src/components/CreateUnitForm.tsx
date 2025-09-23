import React, { useEffect, useState } from "react";
import HomeButton from "../../components/HomeButton";

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:8080";

type CreateUnitPayload = {
  name: string;
  imei?: string;
  phone?: string;
  odometerKm?: number;
  engineHours?: number;
  hwTypeId: number;
};

export default function CreateUnitForm() {
  const [jwt, setJwt] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<string>("Not logged in");

  const [name, setName] = useState<string>(() => `fw_installer_${Math.floor(Date.now()/1000)}`);
  const [imei, setImei] = useState<string>("863719068681981");
  const [phone, setPhone] = useState<string>("+61408155315");
  const [odometerKm, setOdometerKm] = useState<string>("1000");
  const [engineHours, setEngineHours] = useState<string>("10");
  const [hwTypeId, setHwTypeId] = useState<string>("600001805");

  const [busy, setBusy] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  async function doLogin() {
    try {
      setLoginStatus("Logging in…");
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@fleetwatch.com.au",
          password: "admin123",
        }),
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json?.error || "Login failed");
      setJwt(json.token);
      setLoginStatus("Logged in ✓");
    } catch (err: any) {
      setLoginStatus("Login error: " + err.message);
    }
  }

  useEffect(() => {
    doLogin();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult("");
    setBusy(true);
    try {
      if (!jwt) throw new Error("No JWT yet. Click Login and try again.");

      const payload: CreateUnitPayload = {
        name: name.trim(),
        imei: imei.trim() || undefined,
        phone: phone.trim() || undefined,
        odometerKm: odometerKm === "" ? undefined : Number(odometerKm),
        engineHours: engineHours === "" ? undefined : Number(engineHours),
        hwTypeId: Number(hwTypeId),
      };

      const res = await fetch(`${API_BASE}/api/wialon/create_unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        throw new Error(json?.error || "Create failed");
      }
      setResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResult("Error: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Inter, system-ui, Arial" }}>
      <div style={{ width: 560, maxWidth: "100%", padding: 20, borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,.08)", background: "#fff" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Create Wialon Unit</h1>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
          API: <code>{API_BASE}</code> · Auth: {loginStatus}{" "}
          <button type="button" onClick={doLogin} style={{ marginLeft: 8, fontSize: 12, padding: "4px 8px" }}>
            Login
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Rego / Unit Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required
                   placeholder="ABC123 / Truck 7"
                   style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>IMEI (Unique ID)</span>
              <input value={imei} onChange={(e) => setImei(e.target.value)}
                     placeholder="8637…"
                     style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Phone Number (+E.164)</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                     placeholder="+614…"
                     style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Odometer (km)</span>
              <input type="number" inputMode="numeric" value={odometerKm}
                     onChange={(e) => setOdometerKm(e.target.value)}
                     placeholder="e.g. 1000"
                     style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Engine Hours (hours)</span>
              <input type="number" inputMode="numeric" value={engineHours}
                     onChange={(e) => setEngineHours(e.target.value)}
                     placeholder="e.g. 10"
                     style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Hardware Type ID</span>
            <input type="number" inputMode="numeric" value={hwTypeId}
                   onChange={(e) => setHwTypeId(e.target.value)}
                   placeholder="600001805"
                   style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
          </label>
<HomeButton />
          <button type="submit" disabled={busy || !jwt}
                  style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Creating…" : "Create Unit"}
          </button>
        </form>

        <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 16, fontSize: 12, maxHeight: 260, overflow: "auto" }}>
{result || "Response will appear here…"}
        </pre>
      </div>
    </div>
  );
}
