# n8n Compatibility Check

## 🚨 Important: Self-Hosted vs Cloud

The workflows in this directory were created for **self-hosted n8n** (like your Railway deployment), NOT n8n Cloud.

---

## ✅ Check Your n8n Version

**Before importing workflows:**

```bash
# If running on Railway, check via API
curl http://localhost:5678/rest/active-workflows

# Or check in n8n UI
# Settings → About n8n → Version
```

**Required minimum version:** n8n v1.0.0+
**Recommended version:** n8n v1.19.0+

---

## 🔍 Node Compatibility

### Nodes Used in Workflows

| Node Type | typeVersion | Compatibility | Notes |
|-----------|-------------|---------------|-------|
| `manualTrigger` | 1 | ✅ All versions | Standard trigger |
| `scheduleTrigger` | 1 | ✅ All versions | Cron-based scheduling |
| `notion` | 2 | ⚠️ v0.196.0+ | Requires Notion integration |
| `googleSheets` | 4 | ⚠️ v1.0.0+ | May need v3 for older |
| `code` | 2 | ✅ v0.188.0+ | JavaScript execution |
| `httpRequest` | 4 | ⚠️ v1.0.0+ | May need v3 for older |
| `splitInBatches` | 3 | ✅ v0.199.0+ | Batch processing |
| `if` | 2 | ✅ v0.188.0+ | Conditional routing |

### Potential Issues

**🔴 If your n8n version is < 1.0.0:**
- Google Sheets node might be v3 instead of v4
- HTTP Request node might be v3 instead of v4
- Need to downgrade typeVersions

**🟡 If your n8n version is < 0.196.0:**
- Notion node v2 might not be available
- Use Notion v1 instead

---

## 🔧 How to Check Compatibility

### Method 1: Import Test (Safest)

1. Import just workflow 01 (database discovery)
2. Try to open it
3. If nodes show errors → incompatible
4. If nodes load fine → compatible

### Method 2: Check Available Nodes

1. n8n → Create new workflow
2. Click "+" to add node
3. Search for "Notion" → check version number
4. Search for "Google Sheets" → check version number

---

## 🛠️ Fixing Incompatibilities

### If Google Sheets v4 not available:

Change in workflow JSON:
```json
// OLD (v4):
"type": "n8n-nodes-base.googleSheets",
"typeVersion": 4

// NEW (v3):
"type": "n8n-nodes-base.googleSheets",
"typeVersion": 3
```

### If HTTP Request v4 not available:

```json
// OLD (v4):
"type": "n8n-nodes-base.httpRequest",
"typeVersion": 4

// NEW (v3):
"type": "n8n-nodes-base.httpRequest",
"typeVersion": 3
```

### If Notion v2 not available:

```json
// OLD (v2):
"type": "n8n-nodes-base.notion",
"typeVersion": 2

// NEW (v1):
"type": "n8n-nodes-base.notion",
"typeVersion": 1
```

---

## 🚀 Railway-Specific Considerations

### 1. Check n8n Version in Railway

Your Railway deployment should show the n8n version in logs:
```bash
# Check Railway logs
railway logs

# Look for line like:
# "n8n ready on 0.0.0.0:5678"
# "Version: 1.19.0"
```

### 2. Environment Variables

Make sure Railway has:
- `N8N_HOST` (your Railway domain)
- `N8N_PORT` (default 5678)
- `N8N_PROTOCOL` (https)
- `WEBHOOK_URL` (your Railway app URL)

### 3. Node Availability

Self-hosted n8n should have all nodes, but verify:
- n8n UI → Settings → Nodes
- Check if "Notion" and "Google Sheets" are listed

---

## 📋 Pre-Import Checklist

Before importing workflows:

- [ ] n8n version is v1.0.0 or higher
- [ ] Notion node is available in n8n
- [ ] Google Sheets node is available in n8n
- [ ] HTTP Request node is available in n8n
- [ ] Code node is available (should be default)
- [ ] You have Notion API credential configured
- [ ] You have Google Sheets credential configured
- [ ] Railway deployment is accessible at your domain

---

## 🔴 Known Issues

### Issue: "Unknown node type"

**Cause:** Node doesn't exist in your n8n version

**Fix:**
1. Check n8n version
2. Update n8n if too old
3. Or replace node with compatible version

### Issue: "Invalid credentials"

**Cause:** Credential type changed between versions

**Fix:**
1. Re-create credential in n8n UI
2. Update workflow to use new credential

### Issue: "Node version not supported"

**Cause:** typeVersion too new for your n8n

**Fix:**
1. Manually edit JSON before import
2. Reduce typeVersion number
3. Test node still works

---

## ✅ Verification Steps

After importing workflow:

1. **Open workflow** → All nodes load without errors?
2. **Check credentials** → Dropdown shows your credentials?
3. **Execute workflow** → Test execution works?
4. **Check executions** → No "node not found" errors?

If all ✅ → Compatible!

---

## 🆘 Emergency Downgrade

If workflows don't work at all, here's a minimal compatible version:

**Create manually in n8n UI instead of importing JSON:**

1. Add Manual Trigger
2. Add Notion node → Query Database
3. Add Code node → Transform data
4. Add Google Sheets node → Append rows

This guarantees compatibility because you're using whatever versions your n8n instance has.

---

## 📞 Need Help?

**Check your n8n version first:**
```bash
curl http://localhost:5678/healthz
# Or check Railway logs
```

**Then report:**
- n8n version: `X.X.X`
- Node causing issue: `notion`, `googleSheets`, etc.
- Error message: `[paste error]`

I can create compatible versions for your specific n8n version.
