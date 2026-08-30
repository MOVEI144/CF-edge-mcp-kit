# ChatGPT integration checklist

For a remote MCP server intended for ChatGPT:

1. Serve the MCP endpoint over HTTPS.
2. Return the appropriate OAuth challenge for unauthenticated requests.
3. Publish protected-resource metadata for the exact MCP resource URL.
4. Publish authorization-server metadata.
5. Use authorization code + PKCE for public clients.
6. Keep client registration compatibility explicit; prefer modern metadata-based registration when possible.
7. Give every tool a precise name, description, input schema, output schema, and behavior annotations.
8. Treat published tool metadata as a compatibility surface. Prefer additive changes and version destructive semantic changes.
9. Do not assume a newer server tool list instantly replaces a separately reviewed/published client-side snapshot.
