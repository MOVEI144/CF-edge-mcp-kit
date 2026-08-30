# mcp-edge-kit

A reference architecture for building remote MCP servers on Cloudflare that can safely reach local PCs and external APIs.

The goal is narrow: make the hard parts reusable so the next MCP project does not rebuild authentication, device routing, approval binding, retry semantics, and connector security from scratch.

## What this gives you

- Remote MCP endpoint on Cloudflare Workers.
- OAuth 2.1 authorization for MCP clients such as ChatGPT.
- Passkey/WebAuthn login and step-up approval for humans.
- A PC-side agent that makes an **outbound** WebSocket connection. No router port forwarding or public listener on the PC.
- Device identity with an asymmetric key per machine.
- Operation digests and idempotency keys so approval is bound to the exact action.
- Fail-closed reconnect behavior: an effectful operation that may already have executed is not silently replayed.
- A local policy layer where `deny` wins over cloud-side authorization.
- A connector pattern for external APIs that avoids arbitrary-URL tools and keeps credentials out of MCP results.

This repository is not a remote shell product. It is a set of reference boundaries and tested primitives for building one specific MCP integration safely.

## Architecture

```text
                         Browser
                           │
                      passkey / consent
                           │
                           ▼
ChatGPT ── OAuth 2.1 ──> Cloudflare Worker ──> external API connector
                           │
                           │ operation envelope
                           ▼
                    Device Durable Object
                           ▲
                           │ outbound WSS only
                           │
                       PC agent
                           │
                    local policy gate
                           │
                      typed handler
```

The cloud is an authorization and routing layer. The device remains the final authority over local execution.

## Security invariants

1. Human authentication, MCP client authorization, device identity, and external-API credentials are separate identities.
2. Passkey approval is bound to a digest of the exact operation, not merely to a tool name or a generic session.
3. A device never needs an inbound Internet port.
4. The cloud cannot override a local `deny` decision.
5. An operation that was dispatched before a disconnect enters an `uncertain` state unless there is authoritative completion evidence.
6. Effectful operations are never automatically replayed from `uncertain`.
7. Tool schemas are narrow. Do not expose an unrestricted command line, arbitrary URL fetcher, arbitrary environment map, or filesystem root as a convenience primitive.
8. External API connectors use fixed origins, bounded redirects (prefer none), least-privilege credentials, response-size limits, and explicit schemas.
9. Secrets are write-only from the MCP surface and are never returned in logs or tool results.
10. Every authorization decision binds user, OAuth client, device, tool version, arguments, expiry, and idempotency key.

See [docs/security-invariants.md](docs/security-invariants.md).

## Repository layout

```text
apps/worker/          Cloudflare integration blueprint
apps/device-agent/    zero-inbound-port device-agent blueprint
packages/core/        tested reusable security primitives
examples/connectors/  fixed-origin external API connector examples
docs/                 architecture and protocol guidance
deploy/systemd/       example Linux service unit
```

## Core primitives

The core package intentionally has no runtime dependencies and can be exercised with Node 22:

```bash
npm test
```

It includes:

- canonical JSON encoding
- SHA-256 operation commitments
- approval commitments
- idempotency/replay classification
- reconnect decisions
- policy precedence
- fixed-origin connector validation

## Cloudflare stack

For a production Worker, the recommended composition is:

- Cloudflare Workers
- Durable Objects for per-device live routing
- D1 for durable identities, grants, operation journal, and audit metadata
- `@cloudflare/workers-oauth-provider` for OAuth 2.1 resource/server plumbing
- `@modelcontextprotocol/server` with Cloudflare Agents' MCP handler
- `@simplewebauthn/server` for passkey ceremonies

Keep the passkey layer application-specific. OAuth is the authorization protocol used by the MCP client; WebAuthn authenticates the human who is granting or approving that access.

See [apps/worker/README.md](apps/worker/README.md) and [docs/oauth-passkeys.md](docs/oauth-passkeys.md).

## Local device pattern

The device agent creates a long-lived outbound WebSocket to a per-device Durable Object. It authenticates using a device key and accepts only signed, bounded operation envelopes.

On reconnect:

| Last durable state | Safe behavior |
| --- | --- |
| queued, never dispatched | may dispatch |
| dispatched, no completion receipt | mark `uncertain` |
| completed | return the recorded result |
| expired | refuse |
| same idempotency key, different digest | refuse |

See [docs/operation-lifecycle.md](docs/operation-lifecycle.md).

## External APIs

Avoid tools shaped like this:

```text
fetch(url, method, headers, body)
```

Prefer connectors shaped like this:

```text
github.issue.create(owner, repo, title, body)
```

The origin, method, path template, accepted fields, OAuth scope, timeout, and output shape belong to the connector implementation, not to model-controlled input.

See [docs/external-api-connectors.md](docs/external-api-connectors.md).

## Creating a connector

```bash
npm run create:connector -- my-service
```

The generator creates a fixed-origin connector skeleton under `examples/connectors/`.

## Relationship to OwnMesh

This project was extracted from lessons learned while hardening OwnMesh, including passkey-bound approvals, OAuth resource binding, outbound-only device connectivity, local policy enforcement, operation journals, and reconnect safety.

It is intentionally smaller and product-neutral. OwnMesh business logic, deployment secrets, device inventory, user data, and general-purpose remote-control surface are not part of this repository.

## Status

`0.x`: reference architecture. Security boundaries are deliberate, but deployments still need their own threat model, tenant model, key rotation, audit retention, rate limits, recovery flow, and independent review.

## License

Apache-2.0.
