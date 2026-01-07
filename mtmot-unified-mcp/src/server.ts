#!/usr/bin/env node
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { logger } from "./logger.js";
import { notionTools } from "./tools/notionTools.js";
import { driveTools } from "./tools/driveTools.js";
import { knowledgeLakeTools } from "./tools/knowledgeLakeTools.js";
import { aaeTools } from "./tools/aaeTools.js";
import { standardsTools } from "./tools/standardsTools.js";

// Combine all tools
const allTools = [
  ...notionTools,
  ...driveTools,
  ...knowledgeLakeTools,
  ...aaeTools,
  ...standardsTools,
];

// Create tool lookup map
const toolHandlers = new Map<string, (input: unknown) => Promise<unknown>>();
for (const tool of allTools) {
  toolHandlers.set(tool.name, tool.handler as (input: unknown) => Promise<unknown>);
}

async function main() {
  const server = new Server(
    {
      name: "mtmot-unified-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Handle call tool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await handler(args);
      return result as { content: Array<{ type: "text"; text: string }> };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info("[mtmot-mcp] Server started on stdio.");
  logger.info("[mtmot-mcp] Available tools:", allTools.map((t) => t.name).join(", "));
}

main().catch((err) => {
  logger.error("[mtmot-mcp] Fatal error:", err);
  process.exit(1);
});
