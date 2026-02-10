import { routeAgentRequest, type Schedule } from "agents";
import { getSchedulePrompt } from "agents/schedule";

import { AIChatAgent } from "@cloudflare/ai-chat";
import {
  generateId,
  streamText,
  type StreamTextOnFinishCallback,
  stepCountIs,
  createUIMessageStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  type ToolSet
} from "ai";

import { createWorkersAI } from "workers-ai-provider";

import { processToolCalls, cleanupMessages } from "./utils";
import { tools, executions } from "./tools";

/**
 * Chat Agent implementation that handles real-time AI chat interactions
 */
export class Chat extends AIChatAgent<Env> {
  /**
   * Handles incoming chat messages and manages the response stream
   */
  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: { abortSignal?: AbortSignal }
  ) {
    // Collect all tools, including MCP tools
    const lastUserText =
  [...this.messages]
    .reverse()
    .find((m) => m.role === "user")
    ?.parts?.find((p) => p.type === "text")
    // @ts-ignore
    ?.text ?? "";

const wantsScheduling = /(schedule|remind|reminder|task|todo|calendar|appointment)/i.test(
  String(lastUserText)
);

// Only enable tools when the user actually asks for scheduling
const allTools = wantsScheduling
  ? { ...tools, ...this.mcp.getAITools() }
  : {};

    // Workers AI model (Llama 3.3) via the AI SDK provider
    const workersai = createWorkersAI({ binding: this.env.AI });
    const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Clean up incomplete tool calls to prevent API errors
        const cleanedMessages = cleanupMessages(this.messages);

        // Process any pending tool calls from previous messages
        // This handles human-in-the-loop confirmations for tools
        const processedMessages = await processToolCalls({
          messages: cleanedMessages,
          dataStream: writer,
          tools: allTools,
          executions
        });

        // Build the system prompt dynamically
const scheduleBlock = wantsScheduling
  ? `\n\n${getSchedulePrompt({ date: new Date() })}\n\nIf the user asks to schedule a task, use the schedule tool.\n`
  : "";

const systemPrompt = `You are a helpful assistant.
Only use tools when the user explicitly asks for scheduling or tasks.

${scheduleBlock}`;

        const result = streamText({
          system: systemPrompt,
          messages: await convertToModelMessages(processedMessages),
          model,
          tools: allTools,
          // Type boundary: streamText expects specific tool types, but base class uses ToolSet
          // This is safe because our tools satisfy ToolSet interface
          onFinish: onFinish as unknown as StreamTextOnFinishCallback<
            typeof allTools
          >,
          stopWhen: stepCountIs(10),
          abortSignal: options?.abortSignal
        });

        writer.merge(result.toUIMessageStream());
      }
    });

    return createUIMessageStreamResponse({ stream });
  }

  async executeTask(description: string, _task: Schedule<string>) {
    await this.saveMessages([
      ...this.messages,
      {
        id: generateId(),
        role: "user",
        parts: [
          {
            type: "text",
            text: `Running scheduled task: ${description}`
          }
        ],
        metadata: {
          createdAt: new Date()
        }
      }
    ]);
  }
}

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    // The starter UI calls this endpoint during startup.
    if (url.pathname === "/check-open-ai-key") {
      return Response.json({
        success: true,
        provider: "workers-ai"
      });
    }

    // 1) Try agent routes first
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) return agentResponse;

    // 2) Serve static assets (the chat UI) from /public
    // Wrangler "assets" provides env.ASSETS.fetch(...)
    const assets = (env as any).ASSETS;
    if (assets?.fetch) {
      // Try the exact asset path
      let res = await assets.fetch(request);

      // SPA fallback: if asset not found and browser expects HTML, serve index.html
      if (
        res.status === 404 &&
        request.headers.get("accept")?.includes("text/html")
      ) {
        const indexUrl = new URL(request.url);
        indexUrl.pathname = "/index.html";
        res = await assets.fetch(new Request(indexUrl.toString(), request));
      }

      return res;
    }

    // If for some reason ASSETS isn't bound, return 404
    return new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;

