# Perplexity MCP Server

A Model Context Protocol (MCP) server that provides integration with Perplexity AI's Search API. This server allows AI assistants and other MCP clients to perform web searches using Perplexity's advanced search capabilities.

## Features

- 🔍 Web search using Perplexity AI's search API
- 📚 Returns comprehensive answers with citations
- 🖼️ Optional image results
- 🎯 Multiple model options (small, large, huge)
- ⚙️ Configurable temperature and other parameters

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

- `query` (required): The search query
- `model` (optional): The Perplexity model to use
  - `llama-3.1-sonar-small-128k-online` (default)
  - `llama-3.1-sonar-large-128k-online`
  - `llama-3.1-sonar-huge-128k-online`
- `return_citations` (optional, default: `true`): Whether to return citations
- `return_images` (optional, default: `false`): Whether to return images
- `temperature` (optional, default: `0.2`): Temperature for response generation (0-2)

### Example

When using with an MCP client like Claude:

```
User: Can you search for "latest developments in quantum computing"?

Claude: I'll search for that information using Perplexity.
[Uses perplexity_search tool with query="latest developments in quantum computing"]
```

The server will return a formatted response with:
- The main answer/summary
- Citations (if enabled)
- Related images (if enabled)

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