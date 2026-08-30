/**
 * Composition sketch for the model-facing tool registry.
 * Keep authorization separate from the handler implementation so the same
 * checks apply regardless of MCP protocol adapter/version.
 */
import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

export function createMcpServer(deps: {
  invokeDeviceTool(input: { deviceId: string; tool: string; args: unknown }): Promise<unknown>;
}) {
  const server = new McpServer({ name: "mcp-edge-kit-reference", version: "0.1.0" });

  server.registerTool(
    "device.system_info",
    {
      title: "Device system information",
      description: "Read bounded operating-system and runtime metadata from an enrolled device. Does not execute a shell command.",
      inputSchema: z.object({
        deviceId: z.string().min(1).max(128).describe("Enrolled device identifier"),
      }),
      outputSchema: z.object({
        platform: z.string(),
        arch: z.string(),
        hostname: z.string(),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ deviceId }) => {
      const output = await deps.invokeDeviceTool({ deviceId, tool: "device.system_info", args: {} });
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output as { platform: string; arch: string; hostname: string },
      };
    },
  );

  return server;
}
