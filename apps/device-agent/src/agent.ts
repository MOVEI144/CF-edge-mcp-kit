import os from "node:os";
import { assertFresh, operationDigest, type OperationEnvelope } from "../../../packages/core/src/index.ts";

export type AgentMessage = {
  type: "operation";
  digest: string;
  envelope: OperationEnvelope;
};

async function handleOperation(message: AgentMessage): Promise<unknown> {
  assertFresh(message.envelope);
  const actualDigest = await operationDigest(message.envelope);
  if (actualDigest !== message.digest) throw new Error("operation digest mismatch");

  if (message.envelope.tool.name === "device.system_info") {
    return { platform: os.platform(), arch: os.arch(), hostname: os.hostname() };
  }

  throw new Error("tool is not implemented by this agent");
}

export async function runAgent(url: string): Promise<void> {
  if (!url.startsWith("wss://")) throw new Error("device agent requires wss://");
  const socket = new WebSocket(url);

  socket.addEventListener("message", async (event) => {
    try {
      const message = JSON.parse(String(event.data)) as AgentMessage;
      if (message.type !== "operation") throw new Error("unsupported message type");
      const result = await handleOperation(message);
      socket.send(JSON.stringify({ type: "result", operationId: message.envelope.operationId, result }));
    } catch (error) {
      socket.send(JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "unknown error" }));
    }
  });

  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", () => reject(new Error("device WebSocket failed")), { once: true });
  });
}
