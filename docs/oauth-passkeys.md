# OAuth and passkeys

OAuth and WebAuthn solve different problems and should remain separate.

## MCP client authorization

A remote MCP client should use OAuth 2.1 authorization code flow with PKCE S256. Publish OAuth protected-resource metadata for the canonical MCP resource and authorization-server metadata for the issuer.

Bind issued access/refresh tokens to the canonical MCP resource/audience and validate scope again at tool invocation.

For modern MCP clients, prefer pre-registered clients or Client ID Metadata Documents where supported. Keep Dynamic Client Registration only as an explicit compatibility path when needed.

## Human authentication

The authorization endpoint needs an authenticated human before consent. A passkey flow should use:

- a fresh random challenge
- expected RP ID and origin checks
- user verification required
- one-time challenge consumption
- bounded challenge TTL
- secure, host-only session cookies
- CSRF protection for state-changing HTML forms

## Step-up approval

Do not interpret a recent login as approval for a dangerous operation.

For high-risk actions, build a commitment to the exact operation and require a fresh passkey assertion against that commitment or a server-side challenge bound to it. Expire the proof quickly and consume it once.

## Consent transaction

Never trust a serialized OAuth authorization request submitted back by a browser without revalidation. Store a server-side consent transaction and refer to it with an opaque identifier/nonce.
