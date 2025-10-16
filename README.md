# Perplexity Search API MCP Server

A Model Context Protocol (MCP) server that provides integration with Perplexity AI's Search API. This server allows AI assistants and other MCP clients to perform web searches using Perplexity's continuously refreshed index and get ranked search results.

## Features

- 🔍 Web search using Perplexity AI's Search API (not chat/LLM)
- � Returns ranked search results with titles, URLs, and snippets
- 📅 Publication dates and last updated timestamps
- 🌍 Regional search with country filtering
- 🎯 Domain filtering to limit results to specific websites
- 🔄 Multi-query support (up to 5 queries in one request)
- ⚙️ Configurable result count and content extraction depth

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Perplexity API key (get one from [Perplexity AI](https://www.perplexity.ai/))

## Installation

1. Clone this repository:
```bash
git clone https://github.com/s-abinash/perplexity-mcp.git
cd perplexity-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### Setting up your API Key

You need to set the `PERPLEXITY_API_KEY` environment variable with your Perplexity API key.

**Option 1: Export in your shell**
```bash
export PERPLEXITY_API_KEY=your_api_key_here
```

**Option 2: Use a .env file (for development)**
Create a `.env` file in the project root:
```
PERPLEXITY_API_KEY=your_api_key_here
```

### MCP Client Configuration

To use this server with an MCP client like Claude Desktop, add the following to your MCP configuration file:

**For Claude Desktop on macOS** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "node",
      "args": ["/absolute/path/to/perplexity-mcp/dist/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**For Claude Desktop on Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "node",
      "args": ["C:\\path\\to\\perplexity-mcp\\dist\\index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Usage

The server provides one tool: `perplexity_search`

### Parameters

- `query` (required): String or array of strings (up to 5) - The search query/queries
- `max_results` (optional, default: 10): Number of results to return (1-20)
- `max_tokens_per_page` (optional, default: 1024): Maximum tokens to extract from each page
- `country` (optional): ISO 3166-1 alpha-2 country code for regional search (e.g., "US", "GB", "DE", "JP")
- `search_domain_filter` (optional): Array of domains to filter results (max 20)

### Examples

**Basic Search:**
```json
{
  "query": "latest AI developments 2024",
  "max_results": 5
}
```

**Regional Search:**
```json
{
  "query": "government policies on renewable energy",
  "country": "US",
  "max_results": 10
}
```

**Domain-Filtered Search:**
```json
{
  "query": "climate change research",
  "search_domain_filter": ["science.org", "nature.com", "cell.com"],
  "max_results": 10
}
```

**Multi-Query Search:**
```json
{
  "query": [
    "artificial intelligence trends 2024",
    "machine learning breakthroughs",
    "AI applications in healthcare"
  ],
  "max_results": 5
}
```

### Response Format

The server returns formatted search results with:
- Result number and title
- URL
- Snippet (preview of the page content)
- Publication date (when available)
- Last updated date (when available)

**Single Query Response Example:**
```
# Search Results for: "latest AI developments 2024"

### 1. 2024: A year of extraordinary progress in AI
**URL:** https://blog.google/technology/ai/2024-progress/
**Snippet:** In 2024, we released the first models in our Gemini 2.0...
**Published:** 2025-01-23
**Last Updated:** 2025-09-25

---

### 2. The 2025 AI Index Report
**URL:** https://hai.stanford.edu/ai-index/2025
**Snippet:** Read the translation. In 2023, researchers introduced...
**Published:** 2024-09-10

---
```

**Multi-Query Response Example:**
```
# Multi-Query Search Results

## Query 1: "artificial intelligence trends 2024"
[Results for query 1...]

---

## Query 2: "machine learning breakthroughs"
[Results for query 2...]

---
```

## Example Usage with MCP Client

When using with an MCP client like Claude:

```
User: Can you search for "latest developments in quantum computing" and limit to academic sources?

Claude: I'll search for that using Perplexity's Search API.
[Uses perplexity_search tool with:
  query="latest developments in quantum computing"
  search_domain_filter=["arxiv.org", "science.org", "nature.com"]
  max_results=10
]
```

The server will return ranked search results from Perplexity's continuously refreshed index with titles, URLs, snippets, and publication dates.

## Development

Run the server in development mode:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

## API Reference

For more information about the Perplexity API, see:
- [Perplexity Search API Documentation](https://docs.perplexity.ai/guides/search-quickstart)
- [Perplexity API Reference](https://docs.perplexity.ai/api-reference/)

## Troubleshooting

### "PERPLEXITY_API_KEY environment variable is required"
Make sure you've set the `PERPLEXITY_API_KEY` environment variable before starting the server.

### "Unknown tool: perplexity_search"
Ensure your MCP client has properly connected to the server and can see the available tools.

### API Rate Limits
Be aware of Perplexity API rate limits. Check your API plan for details.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.