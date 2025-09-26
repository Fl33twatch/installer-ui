const WIALON_API_URL =
  process.env.WIALON_API_URL || "https://hst-api.wialon.com/wialon/ajax.html";
const WIALON_API_KEY = process.env.WIALON_API_KEY || "";

/**
 * Stubbed diagnostics. Replace with real Wialon calls when ready.
 * @param {string} imei
 * @param {string} phone
 * @returns {Promise<{ok:boolean, passed:boolean, reasons:string[]}>}
 */
async function runDiagnostics(imei, phone) {
  // If no API key yet, pretend diagnostics pass
  if (!WIALON_API_KEY) {
    return { ok: true, passed: true, reasons: [] };
  }

  try {
    // TODO: Real flow (example only):
    // 1) Login with token
    // 2) Find unit by IMEI/phone
    // 3) Check last telemetry and business rules
    // 4) Build reasons array if failing
    return { ok: true, passed: true, reasons: [] };
  } catch (e) {
    console.error("Wialon diagnostics error:", e);
    return { ok: true, passed: false, reasons: ["Diagnostics service error"] };
  }
}

module.exports = { runDiagnostics };
