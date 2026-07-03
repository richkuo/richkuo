---
title: MiniMax Web Search MCP Server Setup for OpenClaw
description: Step-by-step guide to setting up MiniMax's web search MCP server with mcporter for real-time search in OpenClaw agents.
pubDate: 2026-03-10
tags: ["mcp", "minimax", "web-search", "setup"]
icon: tabler:world-search
ogImage: /og/minimax-websearch-mcp-setup.png
howTo:
  name: Set up the MiniMax web search MCP server for OpenClaw
  tool:
    - uv / uvx
    - mcporter
    - bun
  supply:
    - MiniMax API key
  steps:
    - name: Install uv
      text: >-
        Install Astral's uv/uvx Python package runner with
        `curl -LsSf https://astral.sh/uv/install.sh | sh`, then confirm it is on
        your PATH with `which uvx`.
    - name: Install mcporter
      text: >-
        Install the mcporter MCP CLI with bun (`bun install -g mcporter`) and
        verify it with `mcporter --help`.
    - name: Register the MiniMax MCP server
      text: >-
        Add the server with `mcporter config add minimax-coding-plan-mcp`,
        running it via `uvx minimax-coding-plan-mcp` and passing your
        MINIMAX_API_KEY and MINIMAX_API_HOST=https://api.minimax.io as env vars.
    - name: Verify the server is registered
      text: >-
        Run `mcporter list minimax-coding-plan-mcp --schema` to confirm the
        server and its web_search tool are available.
    - name: Test a search
      text: >-
        Run `mcporter call minimax-coding-plan-mcp.web_search query="openclaw ai agent"`;
        a working setup returns JSON with an organic results array.
    - name: Document it in the agent's TOOLS.md
      text: >-
        Add the web_search command and its optional parameters to the agent's
        workspace TOOLS.md so the agent knows when and how to search.
faq:
  - question: Where is the mcporter config stored?
    answer: >-
      In each OpenClaw agent workspace at `config/mcporter.json`, which holds
      every MCP server's command, args, description, and env — including
      MINIMAX_API_KEY and MINIMAX_API_HOST.
  - question: How do I filter MiniMax web search results by date or country?
    answer: >-
      Pass optional parameters to web_search: freshness (day, week, month, or
      year), date_after and date_before (YYYY-MM-DD), country (2-letter code),
      language (ISO 639-1), and count.
  - question: Why does web_search say the MINIMAX_API_KEY environment variable is required?
    answer: >-
      The server was registered without the key. Re-run `mcporter config add`
      with `--env MINIMAX_API_KEY="..."` (and
      `--env MINIMAX_API_HOST="https://api.minimax.io"`); it updates the existing
      entry.
---

# MiniMax Web Search MCP Server Setup for OpenClaw

## Prerequisites

1. **MiniMax API key** — Get from https://platform.minimax.io/
2. **uv/uvx installed** — Python package runner from Astral
3. **bun installed** — Fast JavaScript runtime

---

## Step 1: Install uv (if not already installed)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Verify:
```bash
which uvx
# Should output: /root/.local/bin/uvx (or similar)
```

---

## Step 2: Install mcporter (MCP CLI tool)

```bash
bun install -g mcporter
```

Verify:
```bash
mcporter --help
```

---

## Step 3: Add MiniMax MCP server to mcporter config

```bash
mcporter config add minimax-coding-plan-mcp \
  --command uvx \
  --arg minimax-coding-plan-mcp \
  --env MINIMAX_API_KEY="YOUR_MINIMAX_API_KEY_HERE" \
  --env MINIMAX_API_HOST="https://api.minimax.io" \
  --description "MiniMax Coding Plan MCP Server for web search"
```

Replace `YOUR_MINIMAX_API_KEY_HERE` with your actual MiniMax API key.

---

## Step 4: Verify the MCP server works

```bash
mcporter list minimax-coding-plan-mcp --schema
```

Should show:
```
minimax-coding-plan-mcp - MiniMax Coding Plan MCP Server for web search

  /**
   * You MUST use this tool whenever you need to search for real-time...
   */
```

---

## Step 5: Test a search

```bash
mcporter call minimax-coding-plan-mcp.web_search query="openclaw ai agent"
```

Should return JSON with `organic` results array.

---

## Step 6: Add to agent's TOOLS.md

Add this to your agent's workspace `TOOLS.md` so it knows to use web search:

```markdown
## Web Search (MiniMax via MCP)

Use MiniMax web search for real-time information, current events, or anything requiring up-to-date data.

**Command:**
\`\`\`bash
mcporter call minimax-coding-plan-mcp.web_search query="your search"
\`\`\`

**Parameters (optional):**
- `count` — number of results
- `freshness` — `day`, `week`, `month`, `year`
- `date_after` — YYYY-MM-DD format
- `date_before` — YYYY-MM-DD format
- `country` — 2-letter code (e.g., "US")
- `language` — ISO 639-1 code (e.g., "en")

**When to use:**
- Current events, news, recent developments
- Product comparisons, reviews, pricing
- Looking up documentation or APIs
- Research tasks requiring fresh data

**Return format:**
Each result includes:
- `title` — Page title
- `link` — Full URL
- `snippet` — Brief excerpt
- `date` — Publication date (when available)
```

---

## Config File Location

The mcporter config is stored at:
```
<workspace>/config/mcporter.json
```

Example contents:
```json
{
  "mcpServers": {
    "minimax-coding-plan-mcp": {
      "command": "uvx",
      "args": ["minimax-coding-plan-mcp"],
      "description": "MiniMax Coding Plan MCP Server for web search",
      "env": {
        "MINIMAX_API_KEY": "sk-cp-xxx...",
        "MINIMAX_API_HOST": "https://api.minimax.io"
      }
    }
  },
  "imports": []
}
```

---

## Quick One-Liner Setup

For a fresh OpenClaw agent workspace:

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install mcporter
bun install -g mcporter

# Add MiniMax MCP server (replace API key)
mcporter config add minimax-coding-plan-mcp \
  --command uvx \
  --arg minimax-coding-plan-mcp \
  --env MINIMAX_API_KEY="YOUR_KEY" \
  --env MINIMAX_API_HOST="https://api.minimax.io"

# Test
mcporter call minimax-coding-plan-mcp.web_search query="test"
```

---

## Example Usage

```bash
# Basic search
mcporter call minimax-coding-plan-mcp.web_search query="ai personal assistants"

# With date filter (last week)
mcporter call minimax-coding-plan-mcp.web_search query="openai news" freshness="week"

# With country filter
mcporter call minimax-coding-plan-mcp.web_search query="weather" country="US"
```

---

## Troubleshooting

**Error: MINIMAX_API_KEY environment variable is required**
- Make sure you passed `--env MINIMAX_API_KEY="..."` when adding the server
- Or re-add with: `mcporter config add ...` (it will update existing)

**Error: MINIMAX_API_HOST environment variable is required**
- Make sure you passed `--env MINIMAX_API_HOST="https://api.minimax.io"`

**No results returned**
- Check your API key is valid at https://platform.minimax.io/
- Try a simpler query
- Check for rate limiting
