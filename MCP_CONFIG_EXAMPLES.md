# MCP Configuration Examples

This file contains various configuration examples for setting up the Perplexity Search API MCP server with different MCP clients.

## Finding Your Node Path

Some systems require the full path to the `node` executable instead of just `node`.

**To find your node path:**

**On macOS/Linux:**
```bash
which node
```
Example output: `/usr/local/bin/node` or `/home/username/.nvm/versions/node/v20.0.0/bin/node`

**On Windows:**
```cmd
where node
```
Example output: `C:\Program Files\nodejs\node.exe`

---

## Configuration Examples

### Basic Configuration (works on most systems)

**macOS/Linux:**
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

**Windows:**
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

---

### With Full Node Path (if basic config doesn't work)

**macOS/Linux with Homebrew Node:**
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "/usr/local/bin/node",
      "args": ["/absolute/path/to/perplexity-mcp/dist/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**macOS/Linux with NVM:**
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "/home/username/.nvm/versions/node/v20.0.0/bin/node",
      "args": ["/absolute/path/to/perplexity-mcp/dist/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Windows with Node Installer:**
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\path\\to\\perplexity-mcp\\dist\\index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

## Claude Desktop Configuration Locations

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

---

## Troubleshooting

### "command not found: node"
This means your system can't find the `node` executable. Use the full path to node instead of just `node`.

### "PERPLEXITY_API_KEY environment variable is required"
Make sure you've set the API key in the `env` section of your configuration.

### Server not starting
1. Verify the path to `dist/index.js` is correct and absolute
2. Try using the full path to the `node` executable
3. Make sure the project has been built (`npm run build`)
4. Check that Node.js v18 or higher is installed (`node --version`)
