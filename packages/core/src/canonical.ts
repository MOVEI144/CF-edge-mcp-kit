const encoder = new TextEncoder();
export function canonicalJson(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") { if (!Number.isFinite(value)) throw new TypeError("non-finite numbers are not canonicalizable"); return JSON.stringify(value); }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") { const object = value as Record<string, unknown>; const keys = Object.keys(object).sort(); return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(",")}}`; }
  throw new TypeError(`unsupported canonical JSON type: ${typeof value}`);
}
export async function sha256Hex(value: string | Uint8Array): Promise<string> { const bytes = typeof value === "string" ? encoder.encode(value) : value; const digest = await crypto.subtle.digest("SHA-256", bytes); return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join(""); }
