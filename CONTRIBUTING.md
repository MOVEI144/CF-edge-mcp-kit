# Contributing

Contributions are welcome when they preserve the project's security invariants and keep the reference architecture small.

Before opening a pull request:

1. Run `npm test`.
2. Explain any change to authentication, authorization, operation state, retries, device identity, or connector networking in security terms.
3. Add a regression test for every security-sensitive behavior change.
4. Do not add general-purpose shell, arbitrary URL fetch, unrestricted filesystem roots, secret-reading tools, or silent auto-approval defaults.
5. Do not weaken a local deny because a cloud-side actor has broader scopes.

Large features should begin with an ADR under `docs/adr/` describing authority, failure modes, replay behavior, and migration compatibility.
