# Agent instructions

This repository is security-sensitive. Preserve these invariants when editing code:

1. `deny > ask > allow`; no caller can override a local deny.
2. Approval must commit to the exact operation digest.
3. Idempotency keys are scoped to an authority tuple; a reused key with different content is an error.
4. Never auto-replay an effectful operation after delivery becomes uncertain.
5. Never introduce model-controlled arbitrary URLs into external API tools.
6. Never return stored credentials through an MCP tool.
7. Never make the device agent listen on a public interface as the default connectivity model.
8. Do not merge human passkey identity, OAuth client identity, and device identity into one bearer secret.
9. Schema descriptions are part of the model-facing safety boundary; keep them precise.
10. Add tests before relaxing any validation.

Prefer explicit typed operations over general-purpose primitives.
