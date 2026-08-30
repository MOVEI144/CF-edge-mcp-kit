import fs from "node:fs/promises";
const required = ["README.md","LICENSE","SECURITY.md","docs/security-invariants.md","packages/core/src/operation.ts","packages/core/src/policy.ts","packages/core/src/replay.ts","packages/core/src/connector.ts"];
for (const file of required) await fs.access(file);
const forbiddenPatterns = [/AKIA[0-9A-Z]{16}/g,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,/gh[pousr]_[A-Za-z0-9_]{20,}/g];
const entries = await fs.readdir(".", { recursive: true, withFileTypes: true });
for (const entry of entries) { if (!entry.isFile()) continue; const full = `${entry.parentPath}/${entry.name}`; if (full.includes("/.git/") || full.includes("/node_modules/")) continue; let text; try { text = await fs.readFile(full, "utf8"); } catch { continue; } for (const pattern of forbiddenPatterns) { pattern.lastIndex = 0; if (pattern.test(text)) throw new Error(`possible secret in ${full}`); } }
console.log("repository verification passed");
