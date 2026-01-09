# Notion ↔ Google Drive ↔ Knowledge Lake Sync

## ⚠️ IMPORTANT: Read This First

**For Railway/Self-Hosted n8n users:**

1. **Check compatibility FIRST** - See [COMPATIBILITY-CHECK.md](./COMPATIBILITY-CHECK.md)
2. **Use SAFE versions** - Workflows ending in `-SAFE.json` work with older n8n versions
3. **Run compatibility checker** - `bash check-n8n-compatibility.sh`
4. **Read version guide** - [VERSION-GUIDE.md](./VERSION-GUIDE.md) explains Standard vs SAFE

**Quick compatibility test:**
```bash
# Check if n8n is accessible
curl http://localhost:5678/healthz

# Run full compatibility check
bash check-n8n-compatibility.sh
```

---

## 🎯 Purpose

This n8n workflow system solves the **multi-platform access problem** for your AI Council. Instead of each LLM needing direct connections to Notion, Google Drive, and Knowledge Lake, n8n acts as the orchestration hub that keeps all three platforms synchronized.

### The Problem
- Not all LLMs can connect to Notion (API limitations)
- Not all LLMs can connect to Google Drive (OAuth complexity)
- Even Manus struggles with Knowledge Lake access
- Managing credentials across multiple agents is painful

### The Solution
```
┌─────────────────────────────────────────────────────────────┐
│                n8n Synchronization Hub                       │
│                                                               │
│  Notion (Human Interface) → n8n → Google Drive (Sheet Access)│
│                              ↓                                │
│                    Knowledge Lake (AI Memory)                │
└─────────────────────────────────────────────────────────────┘
```

**Result:** Your LLMs can access data from whichever platform they can connect to, and it's always in sync.

---

## 📦 What's Included

### Workflows

| Workflow | Purpose | Frequency | SAFE Version |
|----------|---------|-----------|--------------|
| `01-database-discovery.json` | Find all Notion databases and catalog them | Manual/On-demand | ⏳ Not needed (simple) |
| `02-notion-to-drive-sync.json` | Sync Notion databases to Google Sheets | Every 4 hours | ✅ Available |
| `02-notion-to-drive-sync-SAFE.json` | Same as above, max compatibility | Every 4 hours | **Recommended for Railway** |
| `03-notion-to-knowledge-lake.json` | Ingest Notion pages into Knowledge Lake | Every 6 hours | ⏳ Coming soon |
| `04-auto-create-sheets.json` | Auto-create Google Sheets from Notion | Manual/On-demand | ⏳ Coming soon |

### Configuration & Documentation

| File | Purpose |
|------|---------|
| `database-sync-config.json` | Configuration for all database mappings |
| `COMPATIBILITY-CHECK.md` | Detailed compatibility guide for self-hosted n8n |
| `VERSION-GUIDE.md` | Explains Standard vs SAFE workflow versions |
| `check-n8n-compatibility.sh` | Script to check your n8n compatibility |
| `IMPLEMENTATION-GUIDE.md` | Step-by-step setup instructions |
| `QUICK-REFERENCE.md` | Daily operations cheat sheet |
| `README.md` | This file - complete system documentation |

---

## 🚀 Quick Start

### Prerequisites

1. **n8n instance running** (http://localhost:5678)
2. **Notion integration** with API key (read + write permissions)
3. **Google Cloud service account** with Drive API access
4. **Knowledge Lake API** accessible at production URL

### Step 1: Configure Credentials in n8n

#### Notion Credential
1. n8n → Credentials → Add Credential → Notion API
2. Name: "Notion API"
3. API Key: `secret_your_notion_integration_token`
4. Save

#### Google Sheets Credential
1. n8n → Credentials → Add Credential → Google Sheets OAuth2 API
2. Name: "Google Sheets"
3. Upload service account JSON OR configure OAuth2
4. Grant permissions to service account email
5. Save

#### Knowledge Lake Credential
1. n8n → Credentials → Add Credential → HTTP Header Auth
2. Name: "Knowledge Lake Auth"
3. Header Name: `Authorization`
4. Header Value: `Bearer YOUR_API_KEY`
5. Save

### Step 2: Discover Your Notion Databases

1. Import `01-database-discovery-workflow.json` into n8n
2. Create a Google Sheet called "AAE Database Inventory"
3. Update workflow with the Sheet ID
4. Execute workflow
5. Review the inventory in your sheet

### Step 3: Configure Database Mappings

Edit `database-sync-config.json`:

```json
{
  "name": "Master AI System",
  "notion_database_id": "24f9440556f78033a2e0e8f4eee6f341",
  "google_sheet_id": "YOUR_GOOGLE_SHEET_ID_HERE",
  "google_sheet_name": "Master AI System",
  "sync_frequency": "every_4_hours",
  "sync_to_knowledge_lake": true
}
```

**To find your Notion database IDs:**
- Run workflow 01 (it will extract them automatically), OR
- Open Notion database → Share → Copy link → Extract ID from URL

**To create Google Sheets:**
- Manually create sheets in Google Drive, OR
- Use the auto-creation workflow (coming in Phase 2)

### Step 4: Import and Configure Sync Workflows

#### Workflow 02: Notion → Google Drive

1. Import `02-notion-to-drive-sync-workflow.json`
2. Update the "Get Database List from Config" node:
   ```javascript
   {
     "databaseId": "24f9440556f78033a2e0e8f4eee6f341",
     "databaseName": "Master AI System",
     "sheetId": "YOUR_GOOGLE_SHEET_ID",
     "sheetName": "Sheet1"
   }
   ```
3. **For multiple databases:** Add multiple items to the config array
4. Test manually before enabling schedule
5. Activate workflow

#### Workflow 03: Notion → Knowledge Lake

1. Import `03-notion-to-knowledge-lake-workflow.json`
2. Update Knowledge Lake URL if needed (default is production)
3. Test with limit=10 first
4. Increase limit to 100 after testing
5. Activate workflow

### Step 5: Test the Sync

```bash
# Test Notion → Drive sync
curl -X POST http://localhost:5678/webhook/test-notion-drive

# Test Notion → Knowledge Lake sync
curl -X POST http://localhost:5678/webhook/test-notion-kl

# Verify Knowledge Lake received data
curl -X GET https://knowledge-lake-api-production.up.railway.app/health
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "notion-sync", "limit": 5}'
```

---

## 🔧 Configuration Reference

### Database Sync Config

```json
{
  "name": "Database Display Name",
  "notion_database_id": "32-character-hex-string",
  "google_sheet_id": "Google Sheet spreadsheet ID",
  "google_sheet_name": "Sheet tab name",
  "sync_frequency": "every_4_hours | every_6_hours | daily | manual_only",
  "sync_to_knowledge_lake": true | false,
  "property_mapping": {
    "Notion Property Name": "property_type"
  }
}
```

### Supported Property Types

| Notion Type | Google Sheets Format | Knowledge Lake |
|-------------|---------------------|----------------|
| `title` | Text | ✅ Indexed |
| `rich_text` | Text | ✅ Indexed |
| `select` | Text (option name) | ✅ Entity |
| `multi_select` | Comma-separated | ✅ Entities |
| `date` | ISO date string | ✅ Metadata |
| `checkbox` | TRUE/FALSE | ✅ Metadata |
| `number` | Number | ✅ Metadata |
| `url` | URL | ✅ Link |
| `email` | Email | ✅ Metadata |
| `phone_number` | Phone | ✅ Metadata |
| `relation` | Comma-sep IDs | ✅ Relationships |
| `people` | Comma-sep names | ✅ Entities |
| `status` | Status name | ✅ Metadata |

---

## 🎨 Customization

### Change Sync Frequency

Edit the Schedule Trigger node:
```json
{
  "cronExpression": "0 */4 * * *"  // Every 4 hours
}
```

Common patterns:
- Every 2 hours: `0 */2 * * *`
- Every 6 hours: `0 */6 * * *`
- Daily at 2am: `0 2 * * *`
- Every 30 min: `*/30 * * * *`

### Add More Databases

In workflow 02, expand the config array:
```javascript
const configs = [
  {
    databaseId: "db-id-1",
    sheetId: "sheet-id-1",
    sheetName: "Sheet1"
  },
  {
    databaseId: "db-id-2",
    sheetId: "sheet-id-2",
    sheetName: "Sheet1"
  }
];
```

### Exclude Sensitive Properties

For databases with secrets:
```json
{
  "name": "Secrets",
  "sanitize_before_sync": true,
  "excluded_properties": ["API Key", "Password", "Token"]
}
```

The sync will skip these properties entirely.

---

## 🔍 Monitoring & Troubleshooting

### Check Sync Status in Knowledge Lake

```bash
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Notion Sync", "limit": 10}' | python -m json.tool
```

Look for entries with:
- `agent: "n8n-sync"`
- `topic: "Notion Sync: [Database Name]"`
- Check `sync_time` to verify recency

### Common Issues

**Issue: "Database not found"**
- Verify Notion integration has access to the database
- Check database ID is correct (no hyphens in middle)
- Ensure API key has read permissions

**Issue: "Google Sheets quota exceeded"**
- Reduce sync frequency
- Sync fewer databases at once
- Check Google Cloud Console quotas

**Issue: "Knowledge Lake 404"**
- Verify URL: `https://knowledge-lake-api-production.up.railway.app`
- NOT: `mem0-production-api.up.railway.app` (old/wrong)
- Check Railway build logs for deployment issues

**Issue: "Data not syncing"**
- Check n8n execution log for errors
- Verify credentials haven't expired
- Test each workflow manually
- Check property mapping matches Notion schema

---

## 📊 What Gets Synced

### Notion → Google Drive
- ✅ All database rows (pages)
- ✅ All properties (except excluded ones)
- ✅ Notion page URL (for reference)
- ✅ Created/edited timestamps
- ❌ Page content (blocks) - use workflow 03 for this
- ❌ Comments
- ❌ File attachments

### Notion → Knowledge Lake
- ✅ Page title
- ✅ Full page content (all blocks as text)
- ✅ Extracted entities (keywords, people, concepts)
- ✅ Metadata (URL, timestamps, source)
- ✅ Relationships (basic, from relations property)
- ❌ Images (not indexed, only referenced)
- ❌ Embedded files

---

## 🚦 Access Patterns for Your AI Council

Now that sync is enabled:

| Agent | Best Platform | Why |
|-------|---------------|-----|
| **Claude (GUI)** | Notion via MCP | Direct access, best UX |
| **Fred (ChatGPT)** | Google Sheets | Native integration |
| **Manus** | Google Sheets | Simpler than Notion API |
| **Gemini** | Knowledge Lake | Semantic search works well |
| **CC (Claude Code)** | All 3 via mtmot-unified-mcp | Full access |
| **Grok** | Knowledge Lake | Can query via API |

**Key Insight:** Each agent uses the platform that works best for them, but they all see the same data thanks to n8n sync.

---

## 🔄 Next Steps

### Phase 2: Bidirectional Sync
- Google Sheets → Notion (update existing pages)
- Conflict resolution (last-write-wins vs merge)
- Change detection (only sync modified rows)

### Phase 3: Real-time Sync
- Notion webhooks → instant sync
- Google Drive file watchers
- Live collaboration support

### Phase 4: Auto-Sheet Creation
- Workflow to auto-create Google Sheets from Notion schema
- Template sheets with formulas and formatting
- Bulk setup for all databases

### Phase 5: Advanced Knowledge Lake Integration
- Extract more sophisticated entities (using LLM)
- Build relationship graph from cross-references
- Enable semantic queries across all synced data

---

## 📝 Maintenance

### Weekly Tasks
- [ ] Check sync logs in Knowledge Lake
- [ ] Verify Google Sheets are updating
- [ ] Review n8n execution history for errors

### Monthly Tasks
- [ ] Update `database-sync-config.json` if schema changed
- [ ] Review and clean up old/unused databases
- [ ] Check API quotas (Notion, Google, Railway)

### Quarterly Tasks
- [ ] Audit which LLMs are using which platforms
- [ ] Optimize sync frequency based on usage
- [ ] Archive old data from Knowledge Lake

---

## 🆘 Support

**If sync breaks:**
1. Check n8n execution log
2. Verify credentials are valid
3. Check Knowledge Lake `/health` endpoint
4. Review recent Notion schema changes
5. Ask CC to check logs and diagnose

**If data is inconsistent:**
1. Manually trigger full re-sync (workflow 02)
2. Clear Google Sheets and re-populate
3. Check Knowledge Lake for duplicate entries
4. Verify property mappings are correct

---

## 📜 License

Part of Carla's AI Automation Ecosystem (AAE)
