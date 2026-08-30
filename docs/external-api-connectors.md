# External API connectors

An external API connector should expose domain operations, not a generic HTTP proxy.

## Connector contract

Each connector declares:

- fixed HTTPS origin
- allowed HTTP methods per operation
- path template
- input schema
- output schema
- required OAuth/API scope
- timeout
- maximum response bytes
- redirect policy
- credential reference

## SSRF posture

The safest design is to never accept a destination origin from the model.

If multi-origin behavior is required, use a server-maintained allowlist and validate the final resolved destination after every redirect. Reject loopback, link-local, private, metadata-service, and internal-only destinations unless the connector is explicitly designed for them.

## Credentials

Store credentials outside MCP-visible state. The MCP surface may report non-secret metadata such as whether a connector is configured and which scopes are granted.

Do not place a long-lived API key in tool arguments, tool results, logs, URL query strings, or model-readable resources.
