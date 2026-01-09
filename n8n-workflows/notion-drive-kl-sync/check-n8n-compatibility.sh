#!/bin/bash

# n8n Compatibility Checker
# Checks your Railway n8n instance for compatibility with workflows

echo "🔍 Checking n8n Compatibility..."
echo ""

# Configuration
N8N_URL="${N8N_URL:-http://localhost:5678}"

echo "📡 Checking n8n instance at: $N8N_URL"
echo ""

# Check if n8n is accessible
echo "1️⃣ Testing n8n accessibility..."
if curl -s "$N8N_URL/healthz" > /dev/null 2>&1; then
    echo "   ✅ n8n is accessible"
else
    echo "   ❌ Cannot reach n8n at $N8N_URL"
    echo "   💡 Tip: Make sure n8n is running and URL is correct"
    exit 1
fi

echo ""

# Try to get version info
echo "2️⃣ Checking n8n version..."
VERSION_INFO=$(curl -s "$N8N_URL/rest/settings" 2>/dev/null | grep -o '"version":"[^"]*"' | cut -d'"' -f4)

if [ -n "$VERSION_INFO" ]; then
    echo "   ✅ n8n version: $VERSION_INFO"

    # Parse version
    MAJOR=$(echo "$VERSION_INFO" | cut -d'.' -f1)
    MINOR=$(echo "$VERSION_INFO" | cut -d'.' -f2)

    if [ "$MAJOR" -ge 1 ]; then
        echo "   ✅ Version is 1.0.0+, workflows should be compatible"
    else
        echo "   ⚠️  Version is < 1.0.0, may need workflow adjustments"
        echo "   💡 Recommended: Upgrade to n8n 1.0.0 or higher"
    fi
else
    echo "   ⚠️  Could not determine version (API might require auth)"
    echo "   💡 Check manually: n8n UI → Settings → About n8n"
fi

echo ""

# Check available nodes (this requires auth, so we'll provide manual instructions)
echo "3️⃣ Node Availability Check"
echo "   ℹ️  Manual check required (needs n8n authentication)"
echo ""
echo "   To verify nodes are available:"
echo "   1. Open n8n UI: $N8N_URL"
echo "   2. Create new workflow"
echo "   3. Click '+' to add node"
echo "   4. Search for these nodes:"
echo ""
echo "      Required Nodes:"
echo "      - ✓ Notion (should see version 1 or 2)"
echo "      - ✓ Google Sheets (should see version 3 or 4)"
echo "      - ✓ HTTP Request (should see version 3 or 4)"
echo "      - ✓ Code (should see version 1 or 2)"
echo "      - ✓ Schedule Trigger (should see version 1)"
echo ""

# Check Railway-specific configuration
echo "4️⃣ Railway Configuration Check"
echo ""

if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "   ✅ Running on Railway"
    echo "   Environment: $RAILWAY_ENVIRONMENT"
else
    echo "   ℹ️  Not detected as Railway environment"
    echo "   This is OK if running locally"
fi

echo ""

# Check essential environment variables
echo "5️⃣ Environment Variables Check"
echo ""

if [ -n "$N8N_HOST" ]; then
    echo "   ✅ N8N_HOST: $N8N_HOST"
else
    echo "   ⚠️  N8N_HOST not set"
fi

if [ -n "$WEBHOOK_URL" ]; then
    echo "   ✅ WEBHOOK_URL: $WEBHOOK_URL"
else
    echo "   ⚠️  WEBHOOK_URL not set (needed for webhooks)"
fi

echo ""

# Summary
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Next Steps:"
echo ""
echo "1. If all checks passed → Import workflows directly"
echo "2. If version < 1.0.0 → Use 'safe' workflow versions (see COMPATIBILITY-CHECK.md)"
echo "3. If nodes missing → Check n8n installation/plugins"
echo "4. If Railway setup → Ensure environment variables are set"
echo ""
echo "📚 Documentation:"
echo "   - COMPATIBILITY-CHECK.md (detailed compatibility guide)"
echo "   - IMPLEMENTATION-GUIDE.md (setup instructions)"
echo "   - QUICK-REFERENCE.md (daily operations)"
echo ""
echo "🆘 Need help?"
echo "   Report your n8n version and any errors to CC"
echo ""
