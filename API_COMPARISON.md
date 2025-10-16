# API Comparison: What Changed

## Old Implementation (WRONG) ❌
### Used: Perplexity Chat Completions API (Grounded LLM)
```typescript
// Endpoint
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

// Request
{
  "model": "llama-3.1-sonar-small-128k-online",
  "messages": [
    {
      "role": "user",
      "content": "What is AI?"
    }
  ],
  "temperature": 0.2,
  "return_citations": true,
  "return_images": false
}

// Response
{
  "choices": [
    {
      "message": {
        "content": "AI is artificial intelligence..." // Generated answer
      }
    }
  ],
  "citations": ["https://...", "https://..."]
}
```
**This is an LLM that generates answers using web search**

---

## New Implementation (CORRECT) ✅
### Uses: Perplexity Search API
```typescript
// Endpoint
const PERPLEXITY_API_URL = "https://api.perplexity.ai/search";

// Request
{
  "query": "What is AI?",
  "max_results": 5,
  "max_tokens_per_page": 1024,
  "country": "US",
  "search_domain_filter": ["wikipedia.org", "britannica.com"]
}

// Response
{
  "results": [
    {
      "title": "Artificial Intelligence - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
      "snippet": "Artificial intelligence (AI) is intelligence demonstrated by machines...",
      "date": "2024-01-15",
      "last_updated": "2024-12-20"
    },
    {
      "title": "What is AI? | Britannica",
      "url": "https://www.britannica.com/technology/artificial-intelligence",
      "snippet": "Artificial intelligence, the ability of a computer...",
      "date": "2023-08-10",
      "last_updated": "2024-11-05"
    }
    // ... more results
  ],
  "id": "search-123-456"
}
```
**This is a web search engine that returns ranked results**

---

## Key Differences

| Feature | Chat API (Old) | Search API (New) |
|---------|---------------|------------------|
| **Purpose** | Generate AI answers | Get search results |
| **Endpoint** | `/chat/completions` | `/search` |
| **Returns** | Generated text | Ranked URLs with snippets |
| **Model** | Sonar models | N/A (search index) |
| **Temperature** | Yes | No |
| **Citations** | As part of answer | N/A (results are sources) |
| **Max Results** | N/A | 1-20 |
| **Domain Filter** | No | Yes (up to 20) |
| **Country Filter** | No | Yes (ISO codes) |
| **Multi-query** | No | Yes (up to 5) |

## Analogy

- **Chat API** = Perplexity AI (the chatbot that answers questions)
- **Search API** = Google Search (returns a list of web pages)

**We are now implementing the Search API (like Google), not the Chat API (like ChatGPT).**
