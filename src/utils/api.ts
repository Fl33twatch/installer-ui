// ==============================================================
// src/utils/api.ts
// Minimal API facade to create unit, log test outcome, notify admin
// ==============================================================
export const BASE_URL = "https://installer-gw-3ahhep7p.ts.gateway.dev";

export type CreateUnitResponse = { unitId: string };

export async function createUnit(payload: FormData): Promise<CreateUnitResponse> {
  // TODO: Replace with your backend endpoint
  // const res = await fetch(`${apiBaseUrl}/units`, { method: "POST", body: payload });
  // if (!res.ok) throw new Error("Failed to create unit");
  // return (await res.json()) as CreateUnitResponse;

  // Demo stub:
  await new Promise((r) => setTimeout(r, 600));
  return { unitId: `unit_${Date.now()}` };
}

export async function logTestOutcome(args: {
  unitId: string;
  report: {
    power: "pass" | "fail";
    ign: "pass" | "fail";
    gps: "pass" | "fail";
    cell: "pass" | "fail";
  };
  reasons: Record<string, string | undefined>;
}) {
  // TODO: POST to your logging endpoint
  // await fetch(`${apiBaseUrl}/units/${args.unitId}/test-log`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });

  // Demo stub:
  await new Promise((r) => setTimeout(r, 200));
}

export async function notifyAdmin(args: {
  unitId: string;
  jobId?: string;
  jobName?: string;
  summary: string;
  details: Record<string, string | undefined>;
}) {
  // TODO: Hit your notifications service (email, Slack, etc.)
  // await fetch(`${apiBaseUrl}/notify/admin`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });

  // Demo stub:
  await new Promise((r) => setTimeout(r, 200));
}
