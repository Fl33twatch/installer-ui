// src/config.ts
// Central config for toggling mocks vs real API

// ✅ Flip this to `false` when wiring up real backend
export const USE_MOCKS = true;

// ✅ Base URL for API (ignored if USE_MOCKS is true)
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000";

// ✅ Optional: debug flag for console logging
export const DEBUG = true;
