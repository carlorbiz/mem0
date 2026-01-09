# MTMOT Unified MCP Server

An MCP (Model Context Protocol) server that provides unified access to Carla's AI Automation Ecosystem (AAE):

- **Notion** - Full CRUD operations on pages, blocks, and databases
- **Google Drive** - Full CRUD operations on files and folders
- **Knowledge Lake** - Semantic search, conversation ingestion, entity management
- **AAE Dashboard** - Fetch metrics and snapshots

## Architecture

```
ChatGPT (Dev seat) / Claude Code / Manus / Any MCP Client
            |
            |  MCP protocol (stdio)
            v
    MTMOT Unified MCP Server
     +-- Notion tools (10 tools)
     |   +-- search_notion, get_notion_page, get_notion_block_children
     |   +-- query_notion_database
     |   +-- create_notion_page, update_notion_page
     |   +-- append_notion_blocks, update_notion_block, delete_notion_block
     +-- Google Drive tools (12 tools)
     |   +-- search_drive, get_drive_file, read_drive_file_content
     |   +-- list_drive_folder
     |   +-- create_drive_folder, create_drive_file, update_drive_file
     |   +-- rename_drive_file, move_drive_file, copy_drive_file
     |   +-- delete_drive_file
     +-- Knowledge Lake tools (10 tools)
     |   +-- search_knowledge_lake (unified: Notion + Drive + semantic)
     |   +-- kl_search_semantic, kl_add_knowledge, kl_get_context
     |   +-- kl_ingest_conversation, kl_list_conversations
     |   +-- kl_list_entities, kl_list_relationships
     |   +-- kl_aurelia_query, kl_health_check
     +-- AAE Dashboard tools (1 tool)
         +-- get_aae_dashboard_snapshot
```

## Prerequisites

- Node.js 20+
- A Notion integration with API key (with **read AND write** permissions)
- A Google Cloud service account with Drive API access (**Editor** role)
- Knowledge Lake API running on Railway (optional but recommended)
  - **Production URL:** `https://knowledge-lake-api-production.up.railway.app`
  - ⚠️ **DO NOT USE:** `mem0-production-api.up.railway.app` (old/incorrect)

## Setup

1. **Clone and install dependencies:**
   ```bash
   cd mtmot-unified-mcp
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```

4. **Test run:**
   ```bash
   npm start
   ```

## Available Tools (33 total)

### Notion Tools (10)

**Read Operations:**
- `search_notion` - Search Notion for pages/blocks
- `get_notion_page` - Fetch a page by ID
- `get_notion_block_children` - Get child blocks of a page/block
- `query_notion_database` - Query a database with filters

**Write Operations:**
- `create_notion_page` - Create a new page in a database or under a parent page
- `update_notion_page` - Update page properties, icon, cover, or archive
- `append_notion_blocks` - Add blocks (paragraphs, headings, lists, code) to a page
- `update_notion_block` - Update block content
- `delete_notion_block` - Delete/archive a block

### Google Drive Tools (12)

**Read Operations:**
- `search_drive` - Search for files
- `get_drive_file` - Get file metadata
- `read_drive_file_content` - Read text content of a file
- `list_drive_folder` - List files in a folder

**Write Operations:**
- `create_drive_folder` - Create a new folder
- `create_drive_file` - Create a new text file (md, json, txt, etc.)
- `update_drive_file` - Update file content
- `rename_drive_file` - Rename a file or folder
- `move_drive_file` - Move to a different folder
- `copy_drive_file` - Create a copy
- `delete_drive_file` - Move to trash or permanently delete

### Knowledge Lake Tools (10)

> **Production API:** `https://knowledge-lake-api-production.up.railway.app`
> **API Version:** 2.1.0_database_persistence
> **Health Check:** `GET /health`

**Unified Search:**
- `search_knowledge_lake` - Search across Notion + Drive + semantic memory

**Memory/Knowledge:**
- `kl_search_semantic` - Vector/semantic search (mem0)
- `kl_add_knowledge` - Add new knowledge to the lake
- `kl_get_context` - Get context for a topic

**Conversations:**
- `kl_ingest_conversation` - Ingest a conversation with entities and relationships
- `kl_list_conversations` - List stored conversations

**Knowledge Graph:**
- `kl_list_entities` - List entities in the graph
- `kl_list_relationships` - List relationships between entities

**Aurelia:**
- `kl_aurelia_query` - Intelligent query combining semantic + entity search

**System:**
- `kl_health_check` - Check API status

### AAE Dashboard Tools (1)
- `get_aae_dashboard_snapshot` - Fetch dashboard metrics

## Connecting to ChatGPT Dev Mode

In the ChatGPT Dev console, configure the MCP server:

```json
{
  "command": "node",
  "args": ["C:/Users/carlo/Development/mem0-sync/mem0/mtmot-unified-mcp/dist/server.js"],
  "env": {
    "NOTION_API_KEY": "secret_...",
    "NOTION_KL_DATABASE_ID": "...",
    "GOOGLE_PROJECT_ID": "...",
    "GOOGLE_CLIENT_EMAIL": "...",
    "GOOGLE_PRIVATE_KEY": "...",
    "DRIVE_KL_FOLDER_ID": "...",
    "KNOWLEDGE_LAKE_URL": "https://knowledge-lake-api-production.up.railway.app",
    "KNOWLEDGE_LAKE_API_KEY": "..."
  }
}
```

## Connecting to Claude Code (VS Code)

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "mtmot-unified-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/Users/carlo/Development/mem0-sync/mem0/mtmot-unified-mcp/dist/server.js"],
      "env": {
        "NOTION_API_KEY": "${env:NOTION_API_KEY}",
        "NOTION_KL_DATABASE_ID": "${env:NOTION_KL_DATABASE_ID}",
        "GOOGLE_PROJECT_ID": "${env:GOOGLE_PROJECT_ID}",
        "GOOGLE_CLIENT_EMAIL": "${env:GOOGLE_CLIENT_EMAIL}",
        "GOOGLE_PRIVATE_KEY": "${env:GOOGLE_PRIVATE_KEY}",
        "DRIVE_KL_FOLDER_ID": "${env:DRIVE_KL_FOLDER_ID}",
        "KNOWLEDGE_LAKE_URL": "${env:KNOWLEDGE_LAKE_URL}",
        "KNOWLEDGE_LAKE_API_KEY": "${env:KNOWLEDGE_LAKE_API_KEY}"
      }
    }
  }
}
```

## Development

```bash
# Run in development mode (no build needed)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Example Usage

### Ingest a Conversation

```json
{
  "tool": "kl_ingest_conversation",
  "arguments": {
    "agent": "Claude",
    "date": "2024-12-03",
    "topic": "MCP Server Development",
    "content": "Discussed building a unified MCP server for MTMOT ecosystem...",
    "entities": [
      {"name": "MCP", "entityType": "Technology", "confidence": 0.95},
      {"name": "Notion", "entityType": "Technology", "confidence": 0.9}
    ],
    "relationships": [
      {"from": "MCP", "to": "Notion", "relationshipType": "integrates_with"}
    ]
  }
}
```

### Create a Drive File

```json
{
  "tool": "create_drive_file",
  "arguments": {
    "name": "meeting-notes-2024-12-03.md",
    "content": "# Meeting Notes\n\n## Attendees\n- Carla\n- Claude\n\n## Discussion\n...",
    "description": "Notes from MCP planning meeting"
  }
}
```

### Create a Notion Page

```json
{
  "tool": "create_notion_page",
  "arguments": {
    "parentType": "database_id",
    "parentId": "your-database-id",
    "properties": {
      "Name": {"title": [{"text": {"content": "New Project"}}]},
      "Status": {"select": {"name": "In Progress"}}
    },
    "children": [
      {"type": "heading_1", "content": "Overview"},
      {"type": "paragraph", "content": "This project aims to..."}
    ],
    "icon": "🚀"
  }
}
```

## License

MIT
