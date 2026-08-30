# Security policy

## Scope

This repository defines security-sensitive reference patterns. A vulnerability includes any flaw that can bypass an invariant documented in `docs/security-invariants.md`, including authentication, authorization, operation binding, retry behavior, local policy, device identity, or connector isolation.

## Reporting

Please do not publish exploit details in a public issue before maintainers have had a reasonable opportunity to evaluate them. Use GitHub's private vulnerability reporting feature when enabled for the repository.

Do not include live access tokens, private keys, passkey credential material, cookies, customer data, or production hostnames in reports.

## Expected deployment posture

- TLS only.
- Passkey user verification required.
- OAuth public clients use PKCE S256.
- MCP tokens are audience/resource bound.
- Device keys are unique per installation.
- Device agent establishes outbound-only connectivity.
- Local policy is fail-closed.
- Effectful uncertain operations are not replayed automatically.
- Connector origins are fixed in code or trusted configuration, never model-controlled.
- Secrets are stored with platform secret facilities or encrypted at rest.

## Non-goals

This repository does not claim to provide OS sandboxing, malware containment, endpoint detection, or safe arbitrary shell access. If a deployment adds general-purpose command execution, it must add an independent confinement and policy design.
