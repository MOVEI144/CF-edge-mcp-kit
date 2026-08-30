# Security invariants

These are architectural constraints, not implementation suggestions.

## Separate principals

Four principals exist in a typical deployment:

- **human** — authenticated with a passkey
- **MCP client** — authorized by OAuth
- **device** — authenticated by a per-device asymmetric key
- **external service** — accessed using a connector-specific credential

A request is authorized only when the required principal bindings agree. A valid OAuth token alone is not proof that a specific PC should execute an operation.

## Exact operation commitment

An approval commitment should cover at least:

```text
subject
OAuth client id
resource/audience
device id
tool name
tool version
canonical arguments
risk class
idempotency key
issued-at
expiry
nonce
```

Hash the canonical representation and approve the digest. Recompute before dispatch and again before local execution if the envelope crosses independently trusted components.

## Fail closed on ambiguity

If the system cannot prove whether an effectful action executed, its state is `uncertain`. Do not convert network ambiguity into a second execution.

A retry may be safe only when the operation is demonstrably read-only or the downstream service provides an authoritative idempotency mechanism bound to the same logical action.

## Device is an authority boundary

The cloud can request an action. The device decides whether it is allowed locally.

A device policy decision can be:

- `deny`: never execute
- `ask`: require a local or cryptographically bound approval
- `allow`: execute if every other check passes

The most restrictive matching rule wins.

## Narrow MCP tools

MCP tool design is part of the security model. Prefer domain operations such as `project.status` or `github.issue.create` rather than `shell.run` or `http.fetch`.

If a deployment truly requires a general-purpose primitive, isolate it behind an explicitly stronger policy/confinement profile instead of making it the base layer.

## Bounded network access

External API connectors must not transform model input into an arbitrary destination URL. Bind connector origins in code/trusted configuration and treat redirects as a new authorization decision.

## Secret non-disclosure

Credential management can expose `set`, `replace`, `revoke`, `test`, and metadata such as `configured=true`. It should not expose `get secret`.
