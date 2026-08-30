/**
 * Reference OAuth composition. Authentication/consent remains application code.
 * The important boundary: WebAuthn authenticates the human; OAuth authorizes
 * the MCP client. Do not replace the MCP bearer token with a browser session.
 */
import { OAuthProvider } from "@cloudflare/workers-oauth-provider";

export function createOAuthProvider(options: {
  apiHandler: ExportedHandler;
  defaultHandler: ExportedHandler;
  resource: string;
  issuer: string;
}) {
  return new OAuthProvider({
    apiRoute: "/mcp",
    apiHandler: options.apiHandler,
    defaultHandler: options.defaultHandler,
    authorizeEndpoint: "/authorize",
    tokenEndpoint: "/oauth/token",
    clientRegistrationEndpoint: "/oauth/register",
    clientIdMetadataDocumentEnabled: true,
    scopesSupported: ["mcp:read", "mcp:write", "mcp:device", "offline_access"],
    resourceMetadata: {
      resource: options.resource,
      authorization_servers: [options.issuer],
      scopes_supported: ["mcp:read", "mcp:write", "mcp:device"],
      bearer_methods_supported: ["header"],
      resource_name: "MCP Edge Kit reference resource",
    },
  });
}
