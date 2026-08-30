import { buildConnectorUrl, validateConnectorDefinition } from "../../packages/core/src/connector.ts";

const definition = { name: "github", origin: "https://api.github.com", allowedMethods: ["GET"], maxResponseBytes: 1_000_000, timeoutMs: 10_000 };
validateConnectorDefinition(definition);

export async function getRepository({ owner, repo, token, fetchImpl = fetch }) {
  if (!/^[A-Za-z0-9_.-]{1,100}$/.test(owner)) throw new Error("invalid owner");
  if (!/^[A-Za-z0-9_.-]{1,100}$/.test(repo)) throw new Error("invalid repo");
  const url = buildConnectorUrl(definition, `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), definition.timeoutMs);
  try {
    const response = await fetchImpl(url, { method: "GET", redirect: "error", signal: controller.signal, headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "User-Agent": "mcp-edge-kit-reference" } });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > definition.maxResponseBytes) throw new Error("response too large");
    return JSON.parse(text);
  } finally { clearTimeout(timeout); }
}
