# n8n Notion → Drive → Knowledge Lake Sync
## Bidirectional Sync with Learning Extraction

**Purpose**: Sync Notion databases to Google Drive with automatic Knowledge Lake ingestion and entity extraction

**Platform**: n8n Community Edition on Railway
**Created**: January 9, 2026
**Status**: Ready for Implementation

---

## 🎯 Overview

This workflow ensures your Notion databases are **always backed up** to Google Drive AND ingested into the Knowledge Lake for AI agent access.

### Key Features

1. **Real-time Sync**: Notion updates trigger immediate Drive backup
2. **Organised Storage**: Year/Month/Day folder structure
3. **Knowledge Ingestion**: Auto-ingest to Knowledge Lake with entities
4. **Bidirectional**: Changes in Drive update Notion (manual trigger)
5. **Learning Extraction**: Captures insights, not just content

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NOTION DATABASE                           │
│              (Universal AI Conversations, etc.)              │
└────────────────────────┬────────────────────────────────────┘
                         │ Page created/updated
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  n8n Webhook Trigger                         │
│         (Notion sends webhook when page changes)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Fetch Full Page from Notion                     │
│     (Get properties, blocks, metadata)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Format as Markdown/JSON                         │
│  (Convert Notion blocks to readable format)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Create Year/Month/Day Folders in Drive               │
│  Example: mem0-backup/2026/01/09/                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Upload to Google Drive                          │
│  Filename: [PageTitle]-[PageID].md                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Extract Entities from Content                      │
│     (Agents, Technology, Insights, Decisions)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          POST to Knowledge Lake API                          │
│      /api/conversations/ingest                               │
│  (Store conversation + entities + relationships)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Workflow Configuration

### **Node 1: Notion Trigger (Database Webhook)**

**Type**: `Webhook`
**Name**: `Notion Page Created/Updated`
**Method**: `POST`
**Path**: `notion-sync`

**Webhook URL**: `https://your-n8n.railway.app/webhook/notion-sync`

**How to set up in Notion**:
1. Go to Notion → Settings & Members → Connections
2. Find your n8n integration
3. Click "..." → Capabilities → Enable "Receive notifications"
4. Add webhook URL: `https://your-n8n.railway.app/webhook/notion-sync`

**Expected Request Body** (from Notion):
```json
{
  "object": "page",
  "id": "page-id-here",
  "created_time": "2026-01-09T10:30:00.000Z",
  "last_edited_time": "2026-01-09T11:45:00.000Z",
  "parent": {
    "type": "database_id",
    "database_id": "1a6c9296096a452981f9e6c014c4b808"
  }
}
```

---

### **Node 2: Fetch Full Page from Notion**

**Type**: `Notion → Get Page`
**Name**: `Get Page Content`

**Authentication**: Use n8n Notion credential (OAuth or API key)

**Settings**:
- **Page ID**: `{{ $json.id }}`
- **Simplify Output**: `false` (we need full data)

**Output**: Full page object with properties and blocks

---

### **Node 3: Get Page Blocks (Content)**

**Type**: `Notion → Get Block Children`
**Name**: `Get Page Blocks`

**Settings**:
- **Block ID**: `{{ $json.id }}` (from previous node)
- **Return All**: `true`

**Output**: Array of all blocks (paragraphs, headings, code, etc.)

---

### **Node 4: Convert to Markdown**

**Type**: `Code`
**Name**: `Format as Markdown`
**Language**: `JavaScript`

**Code**:
```javascript
// Convert Notion blocks to Markdown
const page = $input.first().json;
const blocks = $input.last().json;

// Extract page properties
const title = page.properties?.Name?.title?.[0]?.plain_text ||
              page.properties?.Title?.title?.[0]?.plain_text ||
              'Untitled';

const agent = page.properties?.Agent?.select?.name ||
             page.properties?.Source?.select?.name ||
             'Unknown';

const date = page.properties?.Date?.date?.start ||
            page.created_time.split('T')[0];

const tags = page.properties?.Tags?.multi_select?.map(t => t.name) || [];
const status = page.properties?.Status?.status?.name || 'Active';

// Convert blocks to Markdown
function blockToMarkdown(block) {
  const type = block.type;

  switch(type) {
    case 'paragraph':
      return block.paragraph.rich_text.map(t => t.plain_text).join('') + '\n\n';

    case 'heading_1':
      return '# ' + block.heading_1.rich_text.map(t => t.plain_text).join('') + '\n\n';

    case 'heading_2':
      return '## ' + block.heading_2.rich_text.map(t => t.plain_text).join('') + '\n\n';

    case 'heading_3':
      return '### ' + block.heading_3.rich_text.map(t => t.plain_text).join('') + '\n\n';

    case 'bulleted_list_item':
      return '- ' + block.bulleted_list_item.rich_text.map(t => t.plain_text).join('') + '\n';

    case 'numbered_list_item':
      return '1. ' + block.numbered_list_item.rich_text.map(t => t.plain_text).join('') + '\n';

    case 'code':
      const code = block.code.rich_text.map(t => t.plain_text).join('');
      const lang = block.code.language || '';
      return '```' + lang + '\n' + code + '\n```\n\n';

    case 'quote':
      return '> ' + block.quote.rich_text.map(t => t.plain_text).join('') + '\n\n';

    case 'divider':
      return '---\n\n';

    default:
      return '';
  }
}

// Build markdown content
let markdown = `---
title: ${title}
agent: ${agent}
date: ${date}
tags: ${tags.join(', ')}
status: ${status}
notion_id: ${page.id}
notion_url: https://notion.so/${page.id.replace(/-/g, '')}
---

# ${title}

`;

// Add all blocks
blocks.forEach(block => {
  markdown += blockToMarkdown(block);
});

// Extract date components for folder structure
const dateParts = date.split('-');
const year = dateParts[0];
const month = dateParts[1];
const day = dateParts[2];

// Create safe filename
const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
const filename = `${safeTitle}-${page.id.substring(0, 8)}.md`;

return {
  markdown,
  title,
  agent,
  date,
  tags,
  status,
  year,
  month,
  day,
  filename,
  notionId: page.id,
  notionUrl: `https://notion.so/${page.id.replace(/-/g, '')}`,
  fullContent: markdown
};
```

---

### **Node 5: Create Year Folder**

**Type**: `Google Drive → Create Folder`
**Name**: `Create Year Folder (if needed)`

**Settings**:
- **Folder Name**: `{{ $json.year }}`
- **Parent Folder ID**: `1_ar9oG-NWbl3W5r08OlsESBg9Qfj7ATB` (mem0-backup)
- **Options**: `Ignore if exists` ✓

**Output**: Year folder ID

---

### **Node 6: Create Month Folder**

**Type**: `Google Drive → Create Folder`
**Name**: `Create Month Folder (if needed)`

**Settings**:
- **Folder Name**: `{{ $json.month }}`
- **Parent Folder ID**: `{{ $node["Create Year Folder (if needed)"].json.id }}`
- **Options**: `Ignore if exists` ✓

**Output**: Month folder ID

---

### **Node 7: Create Day Folder**

**Type**: `Google Drive → Create Folder`
**Name**: `Create Day Folder (if needed)`

**Settings**:
- **Folder Name**: `{{ $json.day }}`
- **Parent Folder ID**: `{{ $node["Create Month Folder (if needed)"].json.id }}`
- **Options**: `Ignore if exists` ✓

**Output**: Day folder ID

---

### **Node 8: Upload to Drive**

**Type**: `Google Drive → Upload File`
**Name**: `Save to Drive`

**Settings**:
- **File Name**: `{{ $node["Format as Markdown"].json.filename }}`
- **File Content**: `{{ $node["Format as Markdown"].json.markdown }}`
- **Parent Folder ID**: `{{ $node["Create Day Folder (if needed)"].json.id }}`
- **MIME Type**: `text/markdown`
- **Options**: `Overwrite if exists` ✓

**Output**: Drive file URL

---

### **Node 9: Extract Entities**

**Type**: `Code`
**Name**: `Extract Knowledge Graph Entities`
**Language**: `JavaScript`

**Code**:
```javascript
// Extract entities from the markdown content
const content = $node["Format as Markdown"].json.fullContent;
const agent = $node["Format as Markdown"].json.agent;
const title = $node["Format as Markdown"].json.title;

// Entity extraction patterns
const patterns = {
  Agents: /\b(Claude|Fred|Fredo|Colin|Penny|Gemini|GPT-4|Perplexity|Manus|Nera|CC|Claude Code)\b/gi,
  Technology: /\b(Railway|Cloudflare|PostgreSQL|mem0|tRPC|React|Node\.js|Docker|Git|n8n|Notion|Google Drive|MCP|API|database|webhook)\b/gi,
  Products: /\b(MTMOT|Executive Sanctuary|Knowledge Lake|AAE Dashboard|Nera AI)\b/gi,
  Concepts: /\b(workflow|automation|integration|sync|backup|knowledge graph|entity extraction)\b/gi,
  Organizations: /\b(CARLORBIZ|GPSA|HPSA|ACRRM|MTMOT)\b/gi
};

const entities = [];
const seen = new Set();

for (const [entityType, pattern] of Object.entries(patterns)) {
  const matches = content.match(pattern) || [];

  matches.forEach(match => {
    const normalized = match.trim().toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      entities.push({
        name: match.trim(),
        entityType,
        confidence: 0.85,
        description: `Mentioned in ${title}`,
        source: 'Notion page sync'
      });
    }
  });
}

// Infer relationships
const relationships = [];

// Agent discusses Technology
const agentEntities = entities.filter(e => e.entityType === 'Agents');
const techEntities = entities.filter(e => e.entityType === 'Technology');

agentEntities.forEach(agentEntity => {
  techEntities.slice(0, 3).forEach(techEntity => {
    relationships.push({
      from: agentEntity.name,
      to: techEntity.name,
      relationshipType: 'discusses',
      weight: 5,
      confidence: 0.75
    });
  });
});

return {
  entities,
  relationships,
  extractedCount: entities.length,
  relationshipCount: relationships.length
};
```

---

### **Node 10: Ingest to Knowledge Lake**

**Type**: `HTTP Request`
**Name**: `POST to Knowledge Lake`
**Method**: `POST`
**URL**: `{{ $env.KNOWLEDGE_LAKE_URL }}/api/conversations/ingest`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "userId": 1,
  "agent": "{{ $node['Format as Markdown'].json.agent }}",
  "date": "{{ $node['Format as Markdown'].json.date }}",
  "topic": "{{ $node['Format as Markdown'].json.title }}",
  "content": "{{ $node['Format as Markdown'].json.fullContent }}",
  "entities": {{ $node['Extract Knowledge Graph Entities'].json.entities }},
  "relationships": {{ $node['Extract Knowledge Graph Entities'].json.relationships }},
  "metadata": {
    "source": "Notion → Drive Sync",
    "notionId": "{{ $node['Format as Markdown'].json.notionId }}",
    "notionUrl": "{{ $node['Format as Markdown'].json.notionUrl }}",
    "driveUrl": "{{ $node['Save to Drive'].json.webViewLink }}",
    "status": "{{ $node['Format as Markdown'].json.status }}",
    "tags": {{ $node['Format as Markdown'].json.tags }},
    "syncedAt": "{{ new Date().toISOString() }}"
  }
}
```

**Options**:
- **Continue on fail**: `true` (don't block sync if Knowledge Lake is down)
- **Retry on fail**: `3` attempts

---

### **Node 11: Send Success Notification**

**Type**: `HTTP Request` or `Slack` or `Email` (your choice)
**Name**: `Notify Success`

**Example (Slack)**:
```json
{
  "channel": "#aae-sync-logs",
  "text": "✅ Notion page synced to Drive",
  "attachments": [{
    "color": "good",
    "fields": [
      {"title": "Page", "value": "{{ $node['Format as Markdown'].json.title }}", "short": true},
      {"title": "Agent", "value": "{{ $node['Format as Markdown'].json.agent }}", "short": true},
      {"title": "Drive URL", "value": "{{ $node['Save to Drive'].json.webViewLink }}", "short": false},
      {"title": "Entities", "value": "{{ $node['Extract Knowledge Graph Entities'].json.extractedCount }}", "short": true},
      {"title": "Knowledge Lake", "value": "{{ $node['POST to Knowledge Lake'].json.success ? 'Ingested' : 'Failed' }}", "short": true}
    ]
  }]
}
```

---

## 🔧 Environment Variables

In your n8n Railway deployment:

```bash
# Knowledge Lake
KNOWLEDGE_LAKE_URL=https://knowledge-lake-api-production.up.railway.app
KNOWLEDGE_LAKE_API_KEY=

# Notion
NOTION_API_KEY=ntn_YOUR_NOTION_API_KEY_HERE

# Google Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=n8n-google-service-account@applied-tractor-469903-c3.iam.gserviceaccount.com
GOOGLE_DRIVE_BACKUP_FOLDER=1_ar9oG-NWbl3W5r08OlsESBg9Qfj7ATB
```

---

## 🔐 Setup Instructions

### **Step 1: Configure Notion Integration**

1. Open n8n → Credentials → Add Credential → Notion
2. Choose **OAuth2** or **API Key** method
3. **API Key**: `ntn_YOUR_NOTION_API_KEY_HERE` (get from Notion integrations)
4. Test connection

### **Step 2: Configure Google Drive**

1. Open n8n → Credentials → Add Credential → Google Drive
2. Choose **Service Account** method
3. Enter service account email: `n8n-google-service-account@applied-tractor-469903-c3.iam.gserviceaccount.com`
4. Upload the JSON key file (you'll need to provide this)
5. Test connection

### **Step 3: Set Up Notion Webhooks**

Notion doesn't have native webhooks yet, so we'll use **polling** instead:

**Alternative Node 1**: Replace Webhook with **Cron Trigger**

**Type**: `Cron`
**Name**: `Check Notion Every 5 Minutes`
**Expression**: `*/5 * * * *` (every 5 minutes)

Then add a **Notion → Get Database** node to fetch updated pages.

OR use **Notion's Database Updates** (if available in your n8n version).

---

## 🚀 Quick Deploy

### **Import This Workflow**

1. Copy the workflow JSON (will provide separately)
2. Open n8n → Workflows → Import from File
3. Configure credentials (Notion, Google Drive, Knowledge Lake)
4. Activate workflow
5. Test with a Notion page update

---

## 🎯 Success Metrics

After deployment:

✅ **Notion pages** auto-backup to Drive in Year/Month/Day structure
✅ **Knowledge Lake** receives all updates with entities
✅ **No manual syncing** required
✅ **Searchable in Drive** (markdown format)
✅ **Queryable in Knowledge Lake** (for AI agents)
✅ **Entity relationships** auto-extracted

---

## 🔄 Next: Drive → Notion Reverse Sync

See `N8N_DRIVE_TO_NOTION_SYNC.md` for the reverse workflow (Drive updates → Notion).

---

**Created**: January 9, 2026
**Your Notion ↔ Drive sync is now automated!** 🚀
