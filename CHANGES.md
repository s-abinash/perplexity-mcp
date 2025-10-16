# Changes Made: Migrated from Chat API to Search API

## Summary
The MCP server has been completely rewritten to use the **Perplexity Search API** instead of the Chat Completions API. This is now a proper search server that returns ranked web search results, not an LLM chat interface.

## Key Differences

### Before (Chat/LLM API)
- Endpoint: `https://api.perplexity.ai/chat/completions`
- Used Sonar models (e.g., `llama-3.1-sonar-small-128k-online`)
- Parameters: `model`, `messages`, `temperature`, `return_citations`, `return_images`
- Returned: AI-generated answers with citations

### After (Search API)
- Endpoint: `https://api.perplexity.ai/search`
- No model selection (uses Perplexity's search index)
- Parameters: `query`, `max_results`, `max_tokens_per_page`, `country`, `search_domain_filter`
- Returns: Ranked search results with titles, URLs, snippets, dates

## Changes Made

### 1. `/src/index.ts` - Complete Rewrite
- Changed API endpoint from `/chat/completions` to `/search`
- Removed all Sonar model parameters (`model`, `temperature`, `return_citations`, `return_images`)
- Added Search API parameters:
  - `query`: String or array of strings (multi-query support)
  - `max_results`: 1-20 results (default: 10)
  - `max_tokens_per_page`: Content extraction depth (default: 1024)
  - `country`: ISO country code for regional search
  - `search_domain_filter`: Array of domains (max 20)
- Updated response formatting to display search results with:
  - Title
  - URL
  - Snippet
  - Publication date
  - Last updated date
- Added multi-query support handling
- Added `formatSearchResult()` helper function

### 2. `/README.md` - Documentation Update
- Updated description to clarify this is for the Search API
- Removed references to LLM/chat functionality
- Added new features list:
  - Ranked search results
  - Regional search
  - Domain filtering
  - Multi-query support
- Updated parameters documentation
- Added usage examples:
  - Basic search
  - Regional search
  - Domain-filtered search
  - Multi-query search
- Updated response format examples
- Corrected API documentation links

### 3. `/package.json`
- Updated description to: "MCP server for Perplexity Search API - Get ranked web search results from Perplexity's continuously refreshed index"

## What This Server Does Now

✅ **Correct Usage**: Perplexity Search API
- Returns ranked web search results from Perplexity's index
- Similar to Google/Bing search results
- No AI-generated answers, just search results
- Supports filtering by country and domain
- Can process multiple queries at once

❌ **What It's NOT**: Perplexity Chat/LLM API
- Not using Sonar models for chat
- Not generating AI answers
- Not a conversational interface
- Not using the chat completions endpoint

## API Reference
- Official Documentation: https://www.perplexity.ai/hub/blog/introducing-the-perplexity-search-api
- API Docs: https://docs.perplexity.ai/guides/search-quickstart
