# Worker reference

This directory is a composition blueprint rather than a turnkey deployment.

Recommended modules:

```text
src/index.ts          routing and security middleware
src/auth-passkey.ts   WebAuthn registration/authentication + session
src/oauth.ts          OAuth provider wiring + consent transaction
src/mcp.ts            tool registry and authorization
src/device-room.ts    per-device Durable Object WebSocket broker
src/store.ts          D1 persistence
```

## Suggested bindings

```text
DB              D1
DEVICE_ROOM     Durable Object namespace
OAUTH_KV        KV required by workers-oauth-provider
SESSION_SECRET  Worker secret
BOOTSTRAP_HASH  Worker secret for one-time owner bootstrap
```

For Client ID Metadata Documents, use Cloudflare's strict-public-fetch compatibility behavior required by the OAuth provider so metadata retrieval is not a generic SSRF path.

## Route order

1. security headers / host checks
2. OAuth discovery and protected-resource metadata
3. passkey/session endpoints
4. `/authorize` consent flow
5. protected `/mcp`
6. authenticated device WebSocket upgrade route

Do not put the device WebSocket route behind the human browser session. Devices have their own identity.
