# Architecture

## Cloud plane

The Worker owns protocol termination, OAuth metadata, passkey-backed user sessions, consent, MCP routing, and durable operation state.

Use a Durable Object per connected device when you need a single live coordination point and hibernatable WebSockets. Durable Object identity should be derived from a server-side device identifier, not from arbitrary user-controlled room names.

Use D1 or another durable store for identities, grants, device records, operation journal rows, and audit metadata. Do not make Worker isolate memory authoritative.

## Device plane

The device agent:

1. loads or creates its device key
2. establishes an outbound TLS WebSocket
3. authenticates the connection
4. receives an operation envelope
5. verifies device/expiry/digest/idempotency binding
6. evaluates local policy
7. journals admission before effectful execution
8. runs a typed handler
9. journals completion
10. returns a result receipt

## API plane

An external connector is a separate backend from the device path. Its credential is scoped to that service and should not be reusable as an MCP bearer token or device credential.

## Authority flow

```text
MCP token valid?
  └─ no -> reject
  └─ yes
      scope allows tool?
        └─ no -> reject
        └─ yes
            target belongs to subject/tenant?
              └─ no -> reject
              └─ yes
                  risk requires step-up?
                    └─ yes -> verify passkey-bound commitment
                    └─ no/verified
                        dispatch envelope
                           ↓
                    local policy
                      ├─ deny -> reject
                      ├─ ask  -> require local/bound approval
                      └─ allow -> handler
```
