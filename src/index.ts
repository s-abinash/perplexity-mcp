#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

// Validate environment variable
const API_KEY = process.env.PERPLEXITY_API_KEY;
if (!API_KEY) {
  console.error("Error: PERPLEXITY_API_KEY environment variable is required");
  process.exit(1);
}

// Define the search parameters schema
const SearchParamsSchema = z.object({
  query: z.string().describe("The search query to send to Perplexity"),
  model: z
    .string()
    .optional()
    .default("llama-3.1-sonar-small-128k-online")
    .describe("The Perplexity model to use for search"),
  return_citations: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to return citations"),
  return_images: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether to return images"),
  temperature: z
    .number()
    .min(0)
    .max(2)
    .optional()
    .default(0.2)
    .describe("Temperature for response generation (0-2)"),
});

// Define available tools
const SEARCH_TOOL: Tool = {
  name: "perplexity_search",
  description:
    "Search the web using Perplexity AI's search API. Returns comprehensive answers with citations and sources.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query to send to Perplexity",
      },
      model: {
        type: "string",
        description: "The Perplexity model to use for search",
        default: "llama-3.1-sonar-small-128k-online",
        enum: [
          "llama-3.1-sonar-small-128k-online",
          "llama-3.1-sonar-large-128k-online",
          "llama-3.1-sonar-huge-128k-online",
        ],
      },
      return_citations: {
        type: "boolean",
        description: "Whether to return citations",
        default: true,
      },
      return_images: {
        type: "boolean",
        description: "Whether to return images",
        default: false,
      },
      temperature: {
        type: "number",
        description: "Temperature for response generation (0-2)",
        default: 0.2,
        minimum: 0,
        maximum: 2,
      },
    },
    required: ["query"],
  },
};

// Create server instance
const server = new Server(
  {
    name: "perplexity-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [SEARCH_TOOL],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "perplexity_search") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  // Validate and parse arguments
  const params = SearchParamsSchema.parse(request.params.arguments);

  try {
    // Call Perplexity API
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: params.model,
        messages: [
          {
            role: "user",
            content: params.query,
          },
        ],
        temperature: params.temperature,
        return_citations: params.return_citations,
        return_images: params.return_images,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const answer = data.choices[0]?.message?.content || "No answer received";

    // Format the response
    let formattedResponse = `# Search Result\n\n${answer}\n`;

    // Add citations if available
    if (data.citations && data.citations.length > 0) {
      formattedResponse += "\n\n## Citations\n";
      data.citations.forEach((citation: string, index: number) => {
        formattedResponse += `${index + 1}. ${citation}\n`;
      });
    }

    // Add images if available
    if (data.images && data.images.length > 0) {
      formattedResponse += "\n\n## Images\n";
      data.images.forEach((image: string, index: number) => {
        formattedResponse += `${index + 1}. ${image}\n`;
      });
    }

    return {
      content: [
        {
          type: "text",
          text: formattedResponse,
        },
      ],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Unknown error occurred";
      throw new Error(`Perplexity API error: ${errorMessage}`);
    }
    throw error;
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Perplexity MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
