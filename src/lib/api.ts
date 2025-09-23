// src/lib/api.ts
import { USE_MOCKS, API_BASE, DEBUG } from "../config";

// ---- Session handling ----
type Session = { sid: string; refresh: string; expiresAt?: number };

const SESSION_KEY = "fw_session";
const USER_KEY = "user"; // kept for simple guard

export function getSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}
export function setSession(s: Session) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
export function clearSession() { localStorage.removeItem(SESSION_KEY); }
export function isAuthed() { return !!localStorage.getItem(USER_KEY); } // simple check used by guards

// ---- Mock mode ----
function useMocks() {
  const override = localStorage.getItem("fw_mock"); // "1" or "0"
  if (override === "1") return true;
  if (override === "0") return false;
  return USE_MOCKS;
}

// ---- Refresh queue ----
let refreshing = false;
let waiting: Array<() => void> = [];

// ---- Low-level fetch with auto-SID and refresh ----
async function fetchJson(path: string, init: RequestInit = {}, absolute = false): Promise<any> {
  if (useMocks()) {
    return mockFetch(path, init);
  }

  const base = API_BASE || window.location.origin;
  const url = absolute ? path : `${base}${path}`;
  const sess = getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (sess?.sid) headers["Authorization"] = `Bearer ${sess.sid}`;

  const doFetch = async (): Promise<Response> => {
    return fetch(url, { ...init, headers });
  };

  let res = await doFetch();

  // If unauthorized, try refresh once
  if (res.status === 401 && sess?.refresh) {
    await refreshSidOnce(sess.refresh);
    const sess2 = getSession();
    const headers2 = { ...headers };
    if (sess2?.sid) headers2["Authorization"] = `Bearer ${sess2.sid}`;
    res = await fetch(url, { ...init, headers: headers2 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

async function refreshSidOnce(refreshToken: string) {
  // queue concurrent refresh
  if (refreshing) {
    await new Promise<void>((resolve) => waiting.push(resolve));
    return;
  }
  refreshing = true;
  try {
    const base = API_BASE || window.location.origin;
    const res = await fetch(`${base}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json(); // { sid, refresh, expiresAt? }
    setSession(data);
  } catch (e) {
    clearSession();
    localStorage.removeItem(USER_KEY);
    throw e;
  } finally {
    refreshing = false;
    waiting.splice(0).forEach(fn => fn());
  }
}

// ---- Public API helpers ----
export const api = {
  get: (path: string) => fetchJson(path),
  post: (path: string, body?: any) => fetchJson(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: (path: string, body?: any) => fetchJson(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  // auth (mocked)
  async login(username: string, password: string) {
    if (useMocks()) {
      await delay(400);
      if (username === "installer" && password === "password") {
        // mock tokens
        setSession({ sid: "mock_sid_token", refresh: "mock_refresh_token" });
        localStorage.setItem(USER_KEY, JSON.stringify({ username }));
        if (DEBUG) console.log("[MOCK] login ok");
        return { username };
      }
      throw new Error("Invalid credentials");
    }
    const data = await fetchJson("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    // Expect data: { sid, refresh, user: {...}, expiresAt? }
    if (data.sid && data.refresh) setSession({ sid: data.sid, refresh: data.refresh, expiresAt: data.expiresAt });
    localStorage.setItem(USER_KEY, JSON.stringify(data.user ?? { username }));
    return data.user ?? { username };
  },
  logout() {
    clearSession();
    localStorage.removeItem(USER_KEY);
  },
};

// ---- Mocks for current endpoints ----
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const MOCK = {
  accounts: [
    { id: "acc_fw", name: "Fleet Watch Pty Ltd" },
    { id: "acc_demo", name: "Demo Logistics" },
  ],
  units: [
    { unitId: "unit_abc123", name: "Truck 1", account: "Fleet Watch Pty Ltd", accountId: "acc_fw", imei: "123456789012345", phone: "+61412345678", engineDisabled: false, status: "online" as const },
    { unitId: "unit_def456", name: "Prime Mover A", account: "Demo Logistics", accountId: "acc_demo", imei: "490154203237518", phone: "+882285112824723", engineDisabled: true, status: "sleeping" as const },
  ]
};

async function mockFetch(path: string, init: RequestInit): Promise<any> {
  if (DEBUG) console.log("[MOCK fetch]", path, init);
  await delay(250);

  // GET /api/accounts
  if (path === "/api/accounts") {
    return clone(MOCK.accounts);
  }

  // GET /api/units/validate?unitName&rego&imei&phone
  if (path.startsWith("/api/units/validate")) {
    const url = new URL("http://x" + path); // fake base to read params
    const name = url.searchParams.get("unitName")?.toLowerCase() || "";
    const rego = url.searchParams.get("rego")?.toLowerCase() || "";
    const imei = url.searchParams.get("imei") || "";
    const phone = (url.searchParams.get("phone") || "").replace(/\s+/g, "");

    const unitNames = MOCK.units.map(u => u.name.toLowerCase());
    const regos = ["ABC-123", "XYZ-999"].map(s => s.toLowerCase()); // sample
    const imeis = MOCK.units.map(u => u.imei);
    const phones = MOCK.units.map(u => u.phone.replace(/\s+/g, ""));

    return {
      nameTaken: name && unitNames.includes(name),
      regoTaken: rego && regos.includes(rego),
      imeiTaken: imei && imeis.includes(imei),
      phoneTaken: phone && phones.includes(phone),
    };
  }

  // POST /api/units
  if (path === "/api/units" && init.method === "POST") {
    const body = safeJson(init.body);
    const unitId = "unit_" + Math.random().toString(36).slice(2, 8);
    const accountName = MOCK.accounts.find(a => a.id === body.accountId)?.name || "Unknown";
    const newUnit = {
      unitId,
      name: body.unitName,
      account: accountName,
      accountId: body.accountId,
      imei: body.imei,
      phone: body.phone,
      engineDisabled: false,
      status: "online" as const,
    };
    MOCK.units.push(newUnit);
    return { unitId };
  }

  // GET /api/units/lookup?imei&phone
  if (path.startsWith("/api/units/lookup")) {
    const url = new URL("http://x" + path);
    const imei = url.searchParams.get("imei")?.trim();
    const phone = url.searchParams.get("phone")?.replace(/\s+/g, "");
    return MOCK.units.filter(u => (imei && u.imei === imei) || (phone && u.phone.replace(/\s+/g, "") === phone));
  }

  // GET /api/units/:id
  const matchGet = path.match(/^\/api\/units\/([^\/]+)$/);
  if (matchGet && (!init.method || init.method === "GET")) {
    const id = decodeURIComponent(matchGet[1]);
    const u = MOCK.units.find(x => x.unitId === id);
    if (!u) throw new Error("Unit not found");
    return clone(u);
  }

  // PATCH /api/units/:id
  const matchPatch = path.match(/^\/api\/units\/([^\/]+)$/);
  if (matchPatch && init.method === "PATCH") {
    const id = decodeURIComponent(matchPatch[1]);
    const body = safeJson(init.body);
    const idx = MOCK.units.findIndex(x => x.unitId === id);
    if (idx < 0) throw new Error("Unit not found");
    MOCK.units[idx] = { ...MOCK.units[idx], ...body };
    return clone(MOCK.units[idx]);
  }

  // POST /api/units/:id/engine
  const matchEngine = path.match(/^\/api\/units\/([^\/]+)\/engine$/);
  if (matchEngine && init.method === "POST") {
    const id = decodeURIComponent(matchEngine[1]);
    const body = safeJson(init.body);
    const u = MOCK.units.find(x => x.unitId === id);
    if (!u) throw new Error("Unit not found");
    u.engineDisabled = !!body.disable;
    return clone(u);
  }

  // GET /api/units/:id/status
  const matchStatus = path.match(/^\/api\/units\/([^\/]+)\/status$/);
  if (matchStatus && (!init.method || init.method === "GET")) {
    const id = decodeURIComponent(matchStatus[1]);
    const u = MOCK.units.find(x => x.unitId === id);
    if (!u) throw new Error("Unit not found");
    return { status: u.status || "offline" };
  }

  throw new Error(`No mock handler for ${path}`);
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }
function safeJson(body: any) { try { return JSON.parse(body); } catch { return {}; } }
