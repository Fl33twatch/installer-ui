// ==============================================================
// src/utils/diagnostics.ts
// Detailed diagnostics with reasons per check
// ==============================================================

export type DiagnosticResult = "pass" | "fail";

export type TestReport = {
  power: DiagnosticResult;
  ign: DiagnosticResult;
  gps: DiagnosticResult;
  cell: DiagnosticResult;
};

export type TestReason = {
  power?: string;
  ign?: string;
  gps?: string;
  cell?: string;
};

export type DetailedTestResult = {
  report: TestReport;
  reasons: TestReason; // messages only for failing checks
};

/**
 * Run diagnostics against a unit (IMEI/phone). Replace the stub with your real backend call.
 */
export async function testUnitDetailed(params: {
  imei: string;
  phone: string;
}): Promise<DetailedTestResult> {
  // TODO: Replace stub with real API call, e.g.:
  // const res = await fetch(`${apiBaseUrl}/diagnostics/run`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(params)
  // });
  // if (!res.ok) throw new Error("Diagnostics failed");
  // const data = await res.json() as DetailedTestResult;
  // return data;

  // ----- Demo stub (deterministic-ish) -----
  await new Promise((r) => setTimeout(r, 900));
  const last = parseInt(params.imei.replace(/\D/g, "").slice(-1) || "0", 10);

  const report: TestReport = {
    power: "pass",
    ign: last % 7 === 0 ? "fail" : "pass",
    gps: last % 5 === 0 ? "fail" : "pass",
    cell: "pass",
  };

  const reasons: TestReason = {};
  if (report.ign === "fail") reasons.ign = "No ignition edge detected in last 2 minutes.";
  if (report.gps === "fail") reasons.gps = "No GPS fix (HDOP > 10) at test time.";

  return { report, reasons };
}
