# Workflow Version Guide

## 📦 Two Versions Available

Each workflow comes in TWO versions:

### 1️⃣ Standard Version (Recommended for n8n 1.0+)
- Filename: `01-workflow-name.json`
- Uses: Modern node versions (typeVersion 2-4)
- Features: Full functionality, newer APIs
- **Use if:** Your n8n is version 1.0.0 or higher

### 2️⃣ SAFE Version (Maximum Compatibility)
- Filename: `01-workflow-name-SAFE.json`
- Uses: Older node versions (typeVersion 1-2)
- Features: Core functionality only
- **Use if:** Compatibility issues or n8n < 1.0.0

---

## 🔍 Which Version Should You Use?

### Quick Test Method

1. **Try Standard Version First**
   - Import workflow 01 (database discovery)
   - If it opens without errors → Use Standard versions
   - If you see node errors → Use SAFE versions

2. **Check Your n8n Version**
   ```bash
   # Check in Railway logs or n8n UI
   # Settings → About n8n → Version
   ```

| Your n8n Version | Use This Version |
|------------------|------------------|
| v1.19.0+ | ✅ Standard (best) |
| v1.0.0 - v1.18.x | ✅ Standard (should work) |
| v0.200.0 - v0.999.x | ⚠️ Try Standard, use SAFE if errors |
| v0.180.0 - v0.199.x | 🔴 SAFE only |
| < v0.180.0 | 🔴 Upgrade n8n first |

---

## 📋 Workflow Versions Available

| Workflow | Standard | SAFE | Notes |
|----------|----------|------|-------|
| 01 - Database Discovery | ✅ | ⏳ Coming | Low complexity |
| 02 - Notion → Drive Sync | ✅ | ✅ | **Use SAFE for Railway** |
| 03 - Notion → Knowledge Lake | ✅ | ⏳ Coming | Medium complexity |
| 04 - Auto-Create Sheets | ✅ | ⏳ Coming | High complexity |

**Priority:** SAFE version of workflow 02 is most important (created ✅)

---

## 🔄 Differences Between Versions

### Standard Version Features:
- `code` node (typeVersion 2) - Modern JavaScript
- `googleSheets` node (typeVersion 4) - Latest API
- `httpRequest` node (typeVersion 4) - Enhanced features
- `notion` node (typeVersion 2) - Full property support
- Advanced error handling
- Batch processing optimizations

### SAFE Version Features:
- `function` node (typeVersion 1) - Basic JavaScript
- `googleSheets` node (typeVersion 2) - Stable API
- `httpRequest` node (typeVersion 2) - Core features
- `notion` node (typeVersion 1) - Essential properties only
- Simple error handling
- Basic processing

**What you lose in SAFE:** Some advanced features, newer property types
**What you keep in SAFE:** All core sync functionality works

---

## 🚀 Railway Deployment Recommendation

For **Railway deployments**, we recommend:

### Start with SAFE Version

**Why?**
1. Railway n8n version may vary
2. SAFE version works with broader range
3. Easier to troubleshoot
4. Core functionality is identical

### Migration Path

```
Phase 1: Deploy SAFE version
         ↓ (Verify it works)

Phase 2: Check n8n version
         ↓ (If v1.0+, proceed)

Phase 3: Upgrade to Standard version
         ✓ (Get newer features)
```

---

## ✅ Testing Workflow Compatibility

### Test Import (2 minutes)

1. **Import SAFE version of workflow 02**
   - n8n → Workflows → Import from file
   - Select: `02-notion-to-drive-sync-workflow-SAFE.json`

2. **Check for Errors**
   - ✅ All nodes green → Compatible!
   - 🔴 Red "unknown node" → Incompatible
   - ⚠️ Yellow warnings → May work, test carefully

3. **Test Execute**
   - Configure ONE database
   - Click "Execute Workflow"
   - Check execution log

If SAFE version works → You're good to go!
If SAFE version fails → Report to CC with error details

---

## 🔧 Switching Between Versions

### From SAFE → Standard

**When:** After verifying n8n is v1.0+

1. Export your configured SAFE workflow (to save settings)
2. Note all your credential IDs
3. Import Standard version
4. Re-apply configurations from step 1
5. Test execution
6. Delete SAFE workflow if Standard works

### From Standard → SAFE

**When:** Experiencing node compatibility issues

1. Export Standard workflow (backup)
2. Import SAFE version
3. Re-configure (may need adjustments)
4. Test execution
5. Use SAFE going forward

---

## 🐛 Troubleshooting by Version

### "Unknown node type" Error

**Standard Version:**
- Your n8n version is too old
- **Fix:** Use SAFE version instead

**SAFE Version:**
- n8n installation is missing core nodes
- **Fix:** Reinstall n8n or check plugins

### "Invalid parameter" Error

**Standard Version:**
- Node parameter changed between versions
- **Fix:** Try SAFE version (uses older parameters)

**SAFE Version:**
- Core parameter issue (rare)
- **Fix:** Report to CC - may need custom fix

### Execution Hangs

**Both Versions:**
- Usually not version-related
- Check: Notion API limits, Google Sheets quotas
- **Fix:** Reduce batch size, increase timeout

---

## 📊 Feature Comparison Matrix

| Feature | Standard | SAFE |
|---------|----------|------|
| Basic Notion sync | ✅ | ✅ |
| All Notion property types | ✅ | ⚠️ Common types only |
| Google Sheets append | ✅ | ✅ |
| Google Sheets auto-columns | ✅ | ❌ Manual config |
| Knowledge Lake logging | ✅ | ✅ |
| Batch processing | ✅ | ⚠️ Limited |
| Error retry logic | ✅ | ⚠️ Basic |
| Multiple databases | ✅ | ⚠️ One at a time |
| Schedule trigger | ✅ | ✅ |
| Webhook trigger | ✅ | ⚠️ Not in all SAFE |

---

## 🎯 Recommendation Summary

### For Railway Deployment (Your Case)

**Start here:**
1. Use `check-n8n-compatibility.sh` to check your version
2. Import `02-notion-to-drive-sync-workflow-SAFE.json`
3. Test with ONE database
4. If works → Proceed with SAFE versions
5. If fails → Report n8n version to CC

**Later upgrade:**
- Once confirmed working
- Check n8n version in Railway
- If v1.0+, optionally migrate to Standard

---

## 📞 Getting Help

**If SAFE version doesn't work:**

1. Run compatibility checker:
   ```bash
   bash check-n8n-compatibility.sh
   ```

2. Report to CC:
   - n8n version: `X.X.X`
   - Error message: `[paste here]`
   - Which workflow: `02-SAFE`
   - Deployment: `Railway`

3. CC can create **custom version** for your specific n8n version

---

## ⚡ Quick Decision Tree

```
Do you know your n8n version?
├─ YES → Is it 1.0.0+?
│  ├─ YES → Use Standard ✅
│  └─ NO → Use SAFE ⚠️
│
└─ NO → Run compatibility checker
   ├─ Version detected → Follow above
   └─ Cannot detect → Use SAFE (safer choice) ⚠️
```

---

**Last Updated:** 2026-01-09
**Status:** SAFE version of workflow 02 available ✅
