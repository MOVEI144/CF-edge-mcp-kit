# Operation lifecycle

A network call is not an execution receipt. Model the states explicitly.

```text
created -> admitted -> queued -> dispatched -> completed
                               \-> uncertain
created/admitted/queued -> expired
any pre-execution state -> rejected
```

## Admission

Before durable admission, bind:

- authority tuple
- device
- tool version
- canonical arguments digest
- idempotency key
- expiry
- risk class

Reserve the idempotency key durably before an effectful action can execute.

## Dispatch

`dispatched` means the operation crossed the boundary where the remote side may have acted. If the connection drops after this point and no authoritative completion receipt exists, the correct state is `uncertain`.

## Reconnect

- `queued`: may dispatch when the device reconnects.
- `dispatched`: do not silently dispatch again.
- `completed`: replay the stored result, not the side effect.
- `uncertain`: require reconciliation or explicit operator action.

## Downstream idempotency

If a connector calls an API that supports idempotency keys, derive or store a downstream key from the same operation identity. Do not create a new key on retry.
