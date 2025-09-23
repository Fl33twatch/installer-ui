// ==============================================================
// src/utils/validators.ts
// Simple validators used across forms
// ==============================================================

export function isNonEmpty(v?: string | null): boolean {
  return !!(v && v.trim().length > 0);
}

export function isIMEI(v?: string | null): boolean {
  if (!v) return false;
  const digits = v.replace(/\D/g, "");
  // Typical IMEI is 15 digits (allow 14–16 to be lenient)
  return digits.length >= 14 && digits.length <= 16;
}

export function isPhone(v?: string | null): boolean {
  if (!v) return false;
  const cleaned = v.replace(/\s+/g, "");
  // Very permissive: allow +, digits, hyphens, parentheses
  return /^[+()\-\d]{6,20}$/.test(cleaned);
}

export function isRego(v?: string | null): boolean {
  if (!v) return false;
  // Basic AU-ish rego: letters/digits, 3–8 chars
  return /^[A-Z0-9-]{3,8}$/i.test(v.trim());
}

export function isOdometer(v?: string | null): boolean {
  if (!v) return true; // optional
  const num = Number(v);
  return Number.isFinite(num) && num >= 0 && num < 3000000;
}
