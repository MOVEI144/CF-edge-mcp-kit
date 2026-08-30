# Device-agent reference

The reference agent uses an outbound WebSocket only. It is intentionally not a general remote shell.

A production implementation should add:

- persistent device key storage with OS permissions
- enrollment and rotation
- reconnect backoff with jitter
- durable local operation journal
- local policy files / UI
- bounded typed handlers
- structured audit logs with redaction
- service management for Linux/macOS/Windows

`src/agent.ts` demonstrates the message boundary. The example handler supports only `device.system_info`.
