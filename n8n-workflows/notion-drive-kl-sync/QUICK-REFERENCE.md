# Quick Reference: Notion-Drive-KL Sync

## 🎯 One-Line Summary
**n8n keeps Notion, Google Drive, and Knowledge Lake synchronized so your AI agents can access data from whichever platform they can connect to.**

---

## 📁 Files in This Directory

| File | Purpose | When to Use |
|------|---------|-------------|
| `README.md` | Complete documentation | Understanding the system |
| `IMPLEMENTATION-GUIDE.md` | Step-by-step setup | First-time setup |
| `QUICK-REFERENCE.md` | This file | Daily operations |
| `database-sync-config.json` | Database mappings | Adding new databases |
| `01-database-discovery-workflow.json` | Find Notion databases | Initial discovery |
| `02-notion-to-drive-sync-workflow.json` | Sync to Google Sheets | Main sync workflow |
| `03-notion-to-knowledge-lake-workflow.json` | Sync to Knowledge Lake | Semantic search |
| `04-auto-create-sheets-workflow.json` | Auto-create sheets | Bulk setup |

---

## ⚡ Quick Commands

### Check Knowledge Lake Status
```bash
curl https://knowledge-lake-api-production.up.railway.app/health | python -m json.tool
```

### Search for Recent Syncs
```bash
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Notion Sync", "limit": 10}' | python -m json.tool
```

### Manual Trigger Sync (via n8n webhook)
```bash
# If you setup webhook triggers
curl -X POST http://localhost:5678/webhook/notion-drive-sync
curl -X POST http://localhost:5678/webhook/notion-kl-sync
```

---

## 🔧 Common Tasks

### Add a New Database to Sync

1. **Get Database ID**
   - Open Notion database → Share → Copy link
   - Extract ID: `notion.so/DATABASE_ID?v=...`
   - OR run workflow 01 to auto-discover

2. **Create Google Sheet**
   - Option A: Run workflow 04 (auto-create)
   - Option B: Manual create in "AAE Notion Sync" folder

3. **Update Config**
   - Edit `database-sync-config.json`
   - Add entry with database ID and sheet ID

4. **Update Workflow 02**
   - Edit "Get Database List from Config" node
   - Add new database to array
   - Save and activate

### Change Sync Frequency

Edit the Schedule Trigger node in workflow:
```javascript
// Every 2 hours
"cronExpression": "0 */2 * * *"

// Every 6 hours
"cronExpression": "0 */6 * * *"

// Daily at 2am
"cronExpression": "0 2 * * *"

// Every 30 minutes
"cronExpression": "*/30 * * * *"
```

### Manually Trigger Sync

1. Open n8n (http://localhost:5678)
2. Find workflow (02 or 03)
3. Click "Execute Workflow"
4. Wait for completion
5. Check results in Google Sheets or Knowledge Lake

### Pause Sync for Maintenance

1. Open n8n
2. Find active workflow
3. Toggle switch to "Inactive"
4. Workflow stops running on schedule
5. Re-activate when ready

---

## 🚨 Troubleshooting Quick Fixes

### Sync Stopped Working

```bash
# 1. Check n8n is running
curl http://localhost:5678/healthz

# 2. Check Knowledge Lake is up
curl https://knowledge-lake-api-production.up.railway.app/health

# 3. Check last n8n execution
# → Open n8n UI → Executions tab → Look for errors

# 4. Re-activate workflow
# → Open workflow → Toggle "Active" off and on
```

### Google Sheets Not Updating

1. Check n8n execution log for errors
2. Verify Google Sheets credential hasn't expired
3. Check Notion database is shared with integration
4. Manually trigger workflow to test
5. Check property mappings match Notion schema

### Knowledge Lake 404

```bash
# Verify correct URL
curl https://knowledge-lake-api-production.up.railway.app/health

# NOT this (old/wrong):
# curl https://mem0-production-api.up.railway.app/health

# Check Railway deployment status
# → Open Railway dashboard → Check build logs
```

---

## 📊 What Each Agent Should Use

| Agent | Platform | Tool/Access Method |
|-------|----------|-------------------|
| **Claude (GUI)** | Notion | MCP (direct access) |
| **CC (Claude Code)** | All 3 | mtmot-unified-mcp |
| **Fred (ChatGPT)** | Google Sheets | Native integration |
| **Manus** | Google Sheets | Simpler than Notion API |
| **Gemini** | Knowledge Lake | Semantic search via API |
| **Grok** | Knowledge Lake | API queries |
| **Penny** | Google Sheets | Easiest access |

**Key:** They all see the same data because n8n keeps it synchronized.

---

## 🔄 Sync Schedule

| Workflow | Frequency | What It Does |
|----------|-----------|--------------|
| Workflow 02 | Every 4 hours | Notion → Google Sheets |
| Workflow 03 | Every 6 hours | Notion → Knowledge Lake |

**Next sync times:**
- Calculate: Current hour + 4 (for workflow 02)
- Calculate: Current hour + 6 (for workflow 03)

---

## 📈 Health Check Routine

**Daily (2 minutes):**
```bash
# 1. Check last sync time
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Notion Sync", "limit": 1}' | python -m json.tool

# 2. Spot check a Google Sheet (manual)
# → Open any synced sheet → Check last row timestamp

# 3. Check n8n execution history (manual)
# → Open n8n → Executions → Look for recent successes
```

**Weekly (5 minutes):**
- Review sync stats from Knowledge Lake
- Check for any failed executions in n8n
- Verify all databases still syncing correctly
- Review Google Drive storage usage

---

## 🎯 Success Indicators

✅ **Green:** All good
- Google Sheets update every 4 hours
- Knowledge Lake shows recent "Notion Sync" entries
- n8n executions succeed consistently
- No manual intervention needed

⚠️ **Yellow:** Attention needed
- Occasional failed execution (1-2 per week)
- Sync delayed but catches up
- Minor property mapping warnings
- Action: Monitor, fix if persists

🔴 **Red:** Immediate action required
- Sync hasn't run in 24+ hours
- All executions failing
- Knowledge Lake returning 404/500
- Google Sheets completely empty
- Action: Check troubleshooting section

---

## 📞 Emergency Contacts

**If everything breaks:**

1. **Check n8n logs first**
   - n8n UI → Executions → Latest failed execution
   - Copy error message

2. **Check service health**
   ```bash
   curl http://localhost:5678/healthz  # n8n
   curl https://knowledge-lake-api-production.up.railway.app/health  # KL
   ```

3. **Ask CC for help**
   - "CC, the n8n sync is failing with error: [paste error]"
   - CC has full context and can diagnose

4. **Manual fallback**
   - Export Notion database as CSV
   - Import to Google Sheet manually
   - Resume automated sync once fixed

---

## 🔐 Credentials Quick Reference

**Notion API**
- Type: Integration API Key
- Format: `secret_...`
- Location: n8n Credentials → Notion API

**Google Sheets**
- Type: Service Account OAuth2
- Format: JSON key file
- Location: n8n Credentials → Google Sheets OAuth2 API

**Knowledge Lake**
- Type: HTTP Header Auth
- Header: `Authorization`
- Value: `Bearer YOUR_API_KEY`
- Location: n8n Credentials → HTTP Header Auth

---

## 📝 Maintenance Checklist

### Weekly
- [ ] Check sync success rate in n8n
- [ ] Verify Google Sheets are current
- [ ] Query Knowledge Lake for recent entries
- [ ] Review any error logs

### Monthly
- [ ] Audit active databases (remove unused)
- [ ] Check Google Drive storage usage
- [ ] Review Knowledge Lake stats (`/api/stats`)
- [ ] Update `database-sync-config.json` if schema changed

### Quarterly
- [ ] Review which agents use which platforms
- [ ] Optimize sync frequency based on usage
- [ ] Archive old sync logs
- [ ] Update n8n to latest version
- [ ] Rotate API keys if needed

---

## 💡 Pro Tips

1. **Start small** - Sync 2-3 databases first, add more later
2. **Test manually** before enabling schedule
3. **Check logs immediately** after enabling a new database
4. **Use workflow 04** to auto-create sheets (saves time!)
5. **Keep `database-sync-config.json` updated** (source of truth)
6. **Tag Knowledge Lake entries** with metadata for better search
7. **Monitor Google Sheets quota** (10 million cells limit per account)

---

## 📚 Related Documentation

- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) - Full setup guide
- [README.md](./README.md) - Complete system documentation
- [database-sync-config.json](./database-sync-config.json) - Database configuration
- [mtmot-unified-mcp/README.md](../../mtmot-unified-mcp/README.md) - MCP server docs
- [CLAUDE.md](../../CLAUDE.md) - CC context and protocols

---

**Last Updated:** 2026-01-09
**Version:** 1.0.0
**Status:** Ready for deployment
