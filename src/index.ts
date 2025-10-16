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

const PERPLEXITY_API_URL = "https://api.perplexity.ai/search";

// Validate environment variable
const API_KEY = process.env.PERPLEXITY_API_KEY;
if (!API_KEY) {
  console.error("Error: PERPLEXITY_API_KEY environment variable is required");
  process.exit(1);
}

// Define the search parameters schema
const SearchParamsSchema = z.object({
  query: z
    .union([z.string(), z.array(z.string())])
    .describe("The search query or array of queries (up to 5) to send to Perplexity"),
  max_results: z
    .number()
    .min(1)
    .max(20)
    .optional()
    .default(10)
    .describe("Maximum number of results to return (1-20)"),
  max_tokens_per_page: z
    .number()
    .optional()
    .default(1024)
    .describe("Maximum tokens to extract from each page (default: 1024)"),
  country: z
    .string()
    .optional()
    .describe("ISO 3166-1 alpha-2 country code for regional search (e.g., 'US', 'GB', 'DE')"),
  search_domain_filter: z
    .array(z.string())
    .max(20)
    .optional()
    .describe("List of domains to filter search results (max 20)"),
});

// Define available tools
const SEARCH_TOOL: Tool = {
  name: "perplexity_search",
  description:
    "Search the web using Perplexity AI's Search API. Returns ranked web search results with titles, URLs, snippets, and publication dates from Perplexity's continuously refreshed index.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        description: "The search query or array of queries (up to 5) to send to Perplexity",
        oneOf: [
          {
            type: "string",
            description: "Single search query",
          },
          {
            type: "array",
            items: { type: "string" },
            maxItems: 5,
            description: "Multiple search queries for batch processing (up to 5)",
          },
        ],
      },
      max_results: {
        type: "number",
        description: "Maximum number of results to return (1-20)",
        default: 10,
        minimum: 1,
        maximum: 20,
      },
      max_tokens_per_page: {
        type: "number",
        description: "Maximum tokens to extract from each page (default: 1024). Higher values provide more comprehensive content.",
        default: 1024,
      },
      country: {
        type: "string",
        description: "ISO 3166-1 alpha-2 country code for regional search (e.g., 'US', 'GB', 'DE', 'JP')",
      },
      search_domain_filter: {
        type: "array",
        items: { type: "string" },
        maxItems: 20,
        description: "List of domains to filter search results (max 20 domains)",
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
    // Build request payload
    const payload: Record<string, unknown> = {
      query: params.query,
      max_results: params.max_results,
      max_tokens_per_page: params.max_tokens_per_page,
    };

    // Add optional parameters
    if (params.country) {
      payload.country = params.country;
    }
    if (params.search_domain_filter && params.search_domain_filter.length > 0) {
      payload.search_domain_filter = params.search_domain_filter;
    }

    // Call Perplexity Search API
    const response = await axios.post(PERPLEXITY_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    const isMultiQuery = Array.isArray(params.query);

    // Format the response
    let formattedResponse = "";

    if (isMultiQuery) {
      // Handle multiple queries
      const queries = params.query as string[];
      formattedResponse = "# Multi-Query Search Results\n\n";
      
      if (Array.isArray(data.results) && data.results.length > 0) {
        queries.forEach((query, queryIndex) => {
          formattedResponse += `## Query ${queryIndex + 1}: "${query}"\n\n`;
          const queryResults = data.results[queryIndex];
          
          if (Array.isArray(queryResults) && queryResults.length > 0) {
            queryResults.forEach((result: any, index: number) => {
              formattedResponse += formatSearchResult(result, index + 1);
            });
          } else {
            formattedResponse += "No results found.\n\n";
          }
          formattedResponse += "---\n\n";
        });
      }
    } else {
      // Handle single query
      formattedResponse = `# Search Results for: "${params.query}"\n\n`;
      
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        data.results.forEach((result: any, index: number) => {
          formattedResponse += formatSearchResult(result, index + 1);
        });
      } else {
        formattedResponse += "No results found.\n";
      }
    }

    // Add search ID
    if (data.id) {
      formattedResponse += `\n*Search ID: ${data.id}*\n`;
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
      throw new Error(`Perplexity Search API error: ${errorMessage}`);
    }
    throw error;
  }
});

// Helper function to format a single search result
function formatSearchResult(result: any, index: number): string {
  let formatted = `### ${index}. ${result.title}\n\n`;
  formatted += `**URL:** ${result.url}\n\n`;
  
  if (result.snippet) {
    formatted += `**Snippet:**\n${result.snippet}\n\n`;
  }
  
  if (result.date) {
    formatted += `**Published:** ${result.date}\n`;
  }
  
  if (result.last_updated) {
    formatted += `**Last Updated:** ${result.last_updated}\n`;
  }
  
  formatted += "\n---\n\n";
  return formatted;
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Perplexity Search API MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
