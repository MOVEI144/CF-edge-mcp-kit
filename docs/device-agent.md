# Device agent

The recommended connectivity model is an outbound WebSocket from the PC to Cloudflare.

## Why outbound-only

- no router port forwarding
- no UPnP
- no public HTTP listener on the workstation
- works behind ordinary NAT
- easier endpoint allowlisting

This is not equivalent to trusting every cloud request. The agent still verifies identity, operation bindings, expiry, and local policy.

## Device identity

Generate a unique asymmetric key during enrollment. Store the private key with OS-appropriate permissions. Register only the public key in the cloud.

A reconnect handshake should include a server nonce/challenge and a device signature over the canonical handshake payload so captured handshakes cannot be replayed.

## Local policy

Keep policy evaluation on the device. Suggested rule fields:

```text
principal/client selector
tool selector
workspace/resource selector
action = deny | ask | allow
expiry / temporary grant
```

Choose the most restrictive matching action. Default to deny when no rule matches.
