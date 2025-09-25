const WIALON_API_URL = process.env.WIALON_API_URL || "https://hst-api.wialon.com/wialon/ajax.html";
const WIALON_API_KEY = process.env.WIALON_API_KEY || "";

type DiagResult = { ok: boolean; passed: boolean; reasons: string[] };

export async function runDiagnostics(imei: string, phone: string): Promise<DiagResult> {
  // TODO: Implement real Wialon checks:
  // 1) Log in with token
  // 2) Find unit by IMEI/phone
  // 3) Check last telemetry (GPS signal, movement, ignition, external power)
  // 4) Decide pass/fail + reasons
  // Stub for now:
  if (!WIALON_API_KEY) {
    return { ok: true, passed: true, reasons: [] };
  }
  // Example skeleton to show shape; replace with real calls:
  try {
    // const session = await fetch(`${WIALON_API_URL}?svc=token/login&params=...`);
    // ... actual calls, parse JSON, build reasons[]
    return { ok: true, passed: true, reasons: [] };
  } catch (e) {
    console.error("Wialon diagnostics error:", e);
    return { ok: true, passed: false, reasons: ["Diagnostics service error"] };
  }
}
