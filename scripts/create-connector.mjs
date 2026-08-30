import fs from "node:fs/promises";
import path from "node:path";
const raw = process.argv[2] ?? "";
if (!/^[a-z][a-z0-9-]{1,62}$/.test(raw)) { console.error("usage: npm run create:connector -- <lowercase-name>"); process.exit(2); }
const target = path.join("examples", "connectors", `${raw}.mjs`);
try { await fs.access(target); console.error(`${target} already exists`); process.exit(1); } catch {}
const symbol = raw.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const content = `import { buildConnectorUrl, validateConnectorDefinition } from "../../packages/core/src/connector.ts";\n\nconst definition = {\n  name: ${JSON.stringify(raw)},\n  origin: "https://api.example.com", // CHANGE ME: fixed trusted origin\n  allowedMethods: ["GET"],\n  maxResponseBytes: 1_000_000,\n  timeoutMs: 10_000,\n};\n\nvalidateConnectorDefinition(definition);\n\nexport async function ${symbol}Example({ id, credential, fetchImpl = fetch }) {\n  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) throw new Error("invalid id");\n  const url = buildConnectorUrl(definition, \\`/v1/items/\\${encodeURIComponent(id)}\\`);\n  const response = await fetchImpl(url, {\n    method: "GET",\n    redirect: "error",\n    headers: { Authorization: \\`Bearer \\${credential}\\` },\n  });\n  if (!response.ok) throw new Error(\\`API returned \\${response.status}\\`);\n  return response.json();\n}\n`;
await fs.writeFile(target, content, { flag: "wx" });
console.log(`created ${target}`);
