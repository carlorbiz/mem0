# Nera Shortcut Suggestion System
## Enhancement to AI Agent Router

**Purpose**: Add intelligent shortcut suggestions to the AI Agent Router so Nera recommends the EXACT tool/workflow to execute

**Platform**: n8n enhancement to existing AI Agent Router workflow
**Created**: January 9, 2026
**Status**: Design Complete - Ready for Implementation

---

## 🎯 Overview

**The Problem**: Your AI Agent Router selects Fred/Claude/Colin/Penny but doesn't tell you WHICH shortcut to use.

**The Solution**: Add a "Shortcut Suggestion Engine" that:
1. Analyzes the user's query
2. Matches it to the FRED Persona routing table
3. Suggests the specific shortcut/tool
4. Waits for human approval
5. Executes via the appropriate MCP connection

---

## 📊 FRED Persona Routing Table (Shortcut Registry)

This is your master routing table that Nera uses to suggest shortcuts:

| Category | Task Type | Persona | LLM | Shortcut ID | MCP Connection | Example Prompt |
|----------|-----------|---------|-----|-------------|----------------|----------------|
| **Marketing Copy** | Landing Page Hero | Fred | ChatGPT | `fred-landing-hero` | ai-orchestration | "Write hero section for [product]" |
| **Marketing Copy** | Email Sequence | Fred | ChatGPT | `fred-email-sequence` | ai-orchestration | "Create 5-email nurture sequence" |
| **Marketing Copy** | Social Media Post | Fred | ChatGPT | `fred-social-post` | ai-orchestration | "Write LinkedIn post about [topic]" |
| **Content Strategy** | Course Outline | Fred | ChatGPT | `fred-course-outline` | ai-orchestration | "Design 12-module course on [topic]" |
| **Content Strategy** | Blog Post | Fred | ChatGPT | `fred-blog-post` | ai-orchestration | "Write 1500-word blog on [topic]" |
| **Technical Implementation** | Code Review | Fredo | Google AI Studio | `fredo-code-review` | ai-orchestration | "Review this code for issues" |
| **Technical Implementation** | Bug Fix | Fredo | Google AI Studio | `fredo-bug-fix` | ai-orchestration | "Debug this error: [error]" |
| **Technical Implementation** | API Integration | Fredo | Google AI Studio | `fredo-api-integration` | ai-orchestration | "Integrate [API] with [system]" |
| **Architecture & Planning** | System Design | Claude | Anthropic API | `claude-system-design` | Direct API | "Design architecture for [project]" |
| **Architecture & Planning** | Decision Making | Claude | Anthropic API | `claude-decision` | Direct API | "Should we use X or Y for [purpose]?" |
| **Architecture & Planning** | Strategic Planning | Claude | Anthropic API | `claude-strategy` | Direct API | "Plan roadmap for [project]" |
| **Business Strategy** | ROI Analysis | Colin | OpenAI API | `colin-roi-analysis` | Direct API | "Calculate ROI for [investment]" |
| **Business Strategy** | Pricing Strategy | Colin | OpenAI API | `colin-pricing` | Direct API | "Suggest pricing for [product]" |
| **Business Strategy** | Market Analysis | Colin | OpenAI API | `colin-market-analysis` | Direct API | "Analyze market for [industry]" |
| **Research** | Latest Tech Trends | Penny | Perplexity API | `penny-tech-research` | Direct API | "What's new in [technology]?" |
| **Research** | Competitive Analysis | Penny | Perplexity API | `penny-competitor` | Direct API | "Research competitors for [product]" |
| **Research** | Fact-Checking | Penny | Perplexity API | `penny-fact-check` | Direct API | "Verify: [claim]" |
| **Workflow Automation** | Email Pipeline | Manus | manus-mcp | `manus-email-pipeline` | manus-mcp | "Set up automated email for [trigger]" |
| **Workflow Automation** | Batch Processing | Manus | manus-mcp | `manus-batch-process` | manus-mcp | "Process these files: [files]" |
| **Development** | File Operations | CC | Built-in | `cc-file-ops` | Built-in | "Create/edit files in codebase" |
| **Development** | Git Operations | CC | Built-in | `cc-git-ops` | Built-in | "Commit, push, create PR" |
| **Development** | Deployment | CC | Built-in | `cc-deploy` | Built-in | "Deploy to Railway/Cloudflare" |

---

## 🔧 Enhanced AI Agent Router Flow

### **NEW: Node 4a - Shortcut Matcher**

Insert this AFTER "Determine Agent & Complexity" and BEFORE "Route to Agent"

**Type**: `Code`
**Name**: `Match to Shortcut`
**Language**: `JavaScript`

**Code**:
```javascript
// Match user query to specific shortcut
const message = $input.item.json.userMessage.toLowerCase();
const selectedAgent = $node['Determine Agent & Complexity'].json.selectedAgent;
const context = $input.item.json.relevantKnowledge || [];

// Shortcut registry (master routing table)
const shortcuts = {
  // Fred (ChatGPT) shortcuts
  'fred-landing-hero': {
    persona: 'Fred',
    llm: 'ChatGPT',
    category: 'Marketing Copy',
    task: 'Landing Page Hero',
    keywords: ['landing page', 'hero section', 'above the fold', 'headline', 'cta'],
    prompt_template: 'You are Fred, an expert copywriter. Write a compelling hero section for {{product}}. Include: 1) Headline, 2) Subheadline, 3) CTA button text. Target audience: {{audience}}. Tone: {{tone}}.',
    context_required: ['product', 'audience', 'tone'],
    mcp_connection: 'ai-orchestration',
    estimated_time: '2-3 minutes'
  },
  'fred-email-sequence': {
    persona: 'Fred',
    llm: 'ChatGPT',
    category: 'Marketing Copy',
    task: 'Email Sequence',
    keywords: ['email', 'sequence', 'nurture', 'drip campaign', 'autoresponder'],
    prompt_template: 'You are Fred, an email marketing expert. Create a {{num_emails}}-email nurture sequence for {{product}}. Goal: {{goal}}. Each email should: 1) Subject line, 2) Body (250 words), 3) CTA.',
    context_required: ['product', 'goal', 'num_emails'],
    mcp_connection: 'ai-orchestration',
    estimated_time: '5-7 minutes'
  },
  'fred-course-outline': {
    persona: 'Fred',
    llm: 'ChatGPT',
    category: 'Content Strategy',
    task: 'Course Outline',
    keywords: ['course', 'curriculum', 'modules', 'lessons', 'training'],
    prompt_template: 'You are Fred, a course designer. Create a {{num_modules}}-module course outline for "{{course_topic}}". For each module: 1) Title, 2) Learning objectives (3), 3) Key topics covered (5), 4) Estimated time.',
    context_required: ['course_topic', 'num_modules', 'audience'],
    mcp_connection: 'ai-orchestration',
    estimated_time: '5-8 minutes'
  },

  // Fredo (Google AI Studio) shortcuts
  'fredo-code-review': {
    persona: 'Fredo',
    llm: 'Google AI Studio',
    category: 'Technical Implementation',
    task: 'Code Review',
    keywords: ['code review', 'review code', 'check code', 'code quality'],
    prompt_template: 'You are Fredo, a senior developer. Review this code for: 1) Bugs, 2) Security issues, 3) Performance optimizations, 4) Best practices. Code: {{code}}',
    context_required: ['code', 'language'],
    mcp_connection: 'ai-orchestration',
    estimated_time: '3-5 minutes'
  },
  'fredo-bug-fix': {
    persona: 'Fredo',
    llm: 'Google AI Studio',
    category: 'Technical Implementation',
    task: 'Bug Fix',
    keywords: ['bug', 'error', 'debug', 'fix', 'not working', 'issue'],
    prompt_template: 'You are Fredo, a debugging specialist. Fix this bug: {{error_message}}. Code: {{code}}. Expected behavior: {{expected}}. Provide: 1) Root cause, 2) Fixed code, 3) Explanation.',
    context_required: ['error_message', 'code', 'expected'],
    mcp_connection: 'ai-orchestration',
    estimated_time: '5-10 minutes'
  },

  // Claude (Anthropic) shortcuts
  'claude-system-design': {
    persona: 'Claude',
    llm: 'Anthropic API',
    category: 'Architecture & Planning',
    task: 'System Design',
    keywords: ['architecture', 'system design', 'design system', 'how should i build', 'structure'],
    prompt_template: 'You are Claude, a systems architect. Design the architecture for: {{project}}. Requirements: {{requirements}}. Provide: 1) High-level architecture diagram (in text), 2) Component breakdown, 3) Data flow, 4) Technology recommendations, 5) Deployment strategy.',
    context_required: ['project', 'requirements', 'constraints'],
    mcp_connection: 'anthropic-api',
    estimated_time: '10-15 minutes'
  },
  'claude-decision': {
    persona: 'Claude',
    llm: 'Anthropic API',
    category: 'Architecture & Planning',
    task: 'Strategic Decision',
    keywords: ['should i', 'decision', 'choose', 'versus', 'vs', 'which is better'],
    prompt_template: 'You are Claude, a strategic advisor. Help decide: {{decision}}. Context: {{context}}. Evaluate: 1) Option A vs Option B, 2) Pros/Cons of each, 3) Risk analysis, 4) Recommendation with reasoning.',
    context_required: ['decision', 'context', 'constraints'],
    mcp_connection: 'anthropic-api',
    estimated_time: '5-8 minutes'
  },

  // Colin (OpenAI) shortcuts
  'colin-roi-analysis': {
    persona: 'Colin',
    llm: 'OpenAI API',
    category: 'Business Strategy',
    task: 'ROI Analysis',
    keywords: ['roi', 'return on investment', 'profitability', 'business case', 'cost benefit'],
    prompt_template: 'You are Colin, a business analyst. Calculate ROI for: {{investment}}. Investment: {{cost}}. Expected outcomes: {{outcomes}}. Timeline: {{timeline}}. Provide: 1) ROI calculation, 2) Break-even analysis, 3) Risk factors, 4) Recommendation.',
    context_required: ['investment', 'cost', 'outcomes', 'timeline'],
    mcp_connection: 'openai-api',
    estimated_time: '5-7 minutes'
  },

  // Penny (Perplexity) shortcuts
  'penny-tech-research': {
    persona: 'Penny',
    llm: 'Perplexity API',
    category: 'Research',
    task: 'Tech Research',
    keywords: ['research', 'latest', 'what is', 'how does', 'trends', 'new in'],
    prompt_template: 'You are Penny, a research specialist. Research: {{topic}}. Focus on: {{focus}}. Provide: 1) Latest developments (2025-2026), 2) Key players/tools, 3) Best practices, 4) Citations.',
    context_required: ['topic', 'focus'],
    mcp_connection: 'perplexity-api',
    estimated_time: '3-5 minutes'
  },

  // Manus shortcuts
  'manus-email-pipeline': {
    persona: 'Manus',
    llm: 'manus-mcp',
    category: 'Workflow Automation',
    task: 'Email Automation',
    keywords: ['email automation', 'auto-send', 'email workflow', 'email trigger'],
    prompt_template: 'Set up automated email pipeline. Trigger: {{trigger}}. Recipients: {{recipients}}. Template: {{template}}.',
    context_required: ['trigger', 'recipients', 'template'],
    mcp_connection: 'manus-mcp',
    estimated_time: '10-15 minutes'
  },

  // CC shortcuts
  'cc-git-ops': {
    persona: 'CC',
    llm: 'Built-in',
    category: 'Development',
    task: 'Git Operations',
    keywords: ['git', 'commit', 'push', 'pull request', 'pr', 'merge'],
    prompt_template: 'Perform git operation: {{operation}}. Files: {{files}}. Message: {{message}}.',
    context_required: ['operation', 'files', 'message'],
    mcp_connection: 'built-in',
    estimated_time: '1-2 minutes'
  }
};

// Score each shortcut based on keyword matches
function scoreShortcut(shortcut, message) {
  let score = 0;
  shortcut.keywords.forEach(keyword => {
    if (message.includes(keyword)) {
      score += 1;
    }
  });
  return score;
}

// Filter shortcuts for selected agent's persona
const agentShortcuts = Object.entries(shortcuts)
  .filter(([id, shortcut]) => shortcut.persona === selectedAgent)
  .map(([id, shortcut]) => ({
    id,
    ...shortcut,
    score: scoreShortcut(shortcut, message)
  }))
  .filter(s => s.score > 0)
  .sort((a, b) => b.score - a.score);

// Select best match
const suggestedShortcut = agentShortcuts[0] || null;

// Extract context values from message
function extractContext(message, required) {
  // Simple extraction (you can enhance this with LLM parsing)
  const extracted = {};
  required.forEach(field => {
    // Placeholder - in production, use LLM to extract these values
    extracted[field] = `[Please specify ${field}]`;
  });
  return extracted;
}

const extractedContext = suggestedShortcut
  ? extractContext(message, suggestedShortcut.context_required)
  : {};

return {
  suggestedShortcut: suggestedShortcut ? {
    id: suggestedShortcut.id,
    persona: suggestedShortcut.persona,
    llm: suggestedShortcut.llm,
    category: suggestedShortcut.category,
    task: suggestedShortcut.task,
    mcp_connection: suggestedShortcut.mcp_connection,
    estimated_time: suggestedShortcut.estimated_time,
    prompt_template: suggestedShortcut.prompt_template,
    context_required: suggestedShortcut.context_required,
    extracted_context: extractedContext,
    confidence: suggestedShortcut.score / suggestedShortcut.keywords.length
  } : null,
  alternativeShortcuts: agentShortcuts.slice(1, 3), // Top 2 alternatives
  requiresHumanApproval: true
};
```

---

### **NEW: Node 4b - Format Approval Request**

**Type**: `Set`
**Name**: `Format Approval Request for Nera`

**Values**:
```javascript
{
  "message": "I've analyzed your request and recommend this approach:",
  "agent": "{{ $node['Determine Agent & Complexity'].json.selectedAgent }}",
  "agentReason": "{{ $node['Determine Agent & Complexity'].json.agentReason }}",
  "suggestedShortcut": "{{ $node['Match to Shortcut'].json.suggestedShortcut }}",
  "approvalRequired": true,
  "approvalPrompt": "Should I execute '{{ $node['Match to Shortcut'].json.suggestedShortcut.task }}' using {{ $node['Match to Shortcut'].json.suggestedShortcut.persona }} ({{ $node['Match to Shortcut'].json.suggestedShortcut.llm }})?\n\nEstimated time: {{ $node['Match to Shortcut'].json.suggestedShortcut.estimated_time }}\n\nThis will:\n{{ $node['Match to Shortcut'].json.suggestedShortcut.prompt_template }}\n\nRequired context:\n{{ JSON.stringify($node['Match to Shortcut'].json.suggestedShortcut.context_required) }}\n\nExtracted from your message:\n{{ JSON.stringify($node['Match to Shortcut'].json.suggestedShortcut.extracted_context) }}\n\n[Approve] [Choose different shortcut] [Cancel]"
}
```

---

### **NEW: Node 4c - Human Approval Gate**

**Type**: `Wait`
**Name**: `Wait for Human Approval`
**Mode**: `Webhook`
**Resume URL**: `https://your-n8n.railway.app/webhook/approve-shortcut`

**This pauses the workflow and sends an approval request to the dashboard.**

In your AAE Dashboard, add a button:
```typescript
// When Nera suggests a shortcut, show approval UI:
<div className="border rounded-lg p-4 bg-muted">
  <h3 className="font-semibold">Nera's Recommendation</h3>
  <p className="text-sm text-muted-foreground">{result.agentReason}</p>

  <div className="mt-3">
    <h4 className="font-medium">Suggested Shortcut: {result.suggestedShortcut.task}</h4>
    <div className="text-xs space-y-1 mt-2">
      <p><strong>Agent:</strong> {result.suggestedShortcut.persona} ({result.suggestedShortcut.llm})</p>
      <p><strong>Category:</strong> {result.suggestedShortcut.category}</p>
      <p><strong>Estimated time:</strong> {result.suggestedShortcut.estimated_time}</p>
    </div>
  </div>

  <div className="mt-3 text-xs">
    <p><strong>Required context:</strong></p>
    <ul className="list-disc list-inside">
      {result.suggestedShortcut.context_required.map(ctx => (
        <li key={ctx}>{ctx}: {result.suggestedShortcut.extracted_context[ctx]}</li>
      ))}
    </ul>
  </div>

  <div className="flex gap-2 mt-4">
    <Button onClick={() => approveShortcut(result.suggestedShortcut.id)}>
      ✅ Approve & Execute
    </Button>
    <Button variant="outline" onClick={() => showAlternatives()}>
      🔄 Show Alternatives
    </Button>
    <Button variant="ghost" onClick={() => cancel()}>
      ❌ Cancel
    </Button>
  </div>
</div>
```

---

## 🚀 Integration with Existing AI Agent Router

**Insert these nodes into your existing workflow AFTER Node 4 "Determine Agent & Complexity":**

```
Node 4: Determine Agent & Complexity
        ↓
Node 4a: Match to Shortcut ← NEW
        ↓
Node 4b: Format Approval Request ← NEW
        ↓
Node 4c: Human Approval Gate ← NEW
        ↓
   [User approves]
        ↓
Node 5: Switch - Route to Agent (existing)
        ↓
    [Execute]
```

---

## 📊 Example User Flow

**User**: "Create a landing page hero for my Executive Sanctuary product targeting burned-out executives"

**Nera's Response**:
```
I've analyzed your request and recommend this approach:

Agent: Fred (ChatGPT)
Reason: Marketing copy creation

Suggested Shortcut: Landing Page Hero

This will:
- Write a compelling hero section for Executive Sanctuary
- Include: Headline, Subheadline, CTA button text
- Target audience: Burned-out executives
- Tone: Professional, empathetic

Estimated time: 2-3 minutes

Required context:
✅ Product: Executive Sanctuary
✅ Audience: Burned-out executives
⚠️ Tone: [Please specify] - Suggested: Professional, empathetic

[Approve & Execute] [Choose Different] [Cancel]
```

**User clicks**: Approve & Execute

**Nera**: Executes `fred-landing-hero` via `ai-orchestration` MCP → Opens ChatGPT → Loads Fred persona → Runs prompt → Returns result

---

## 🎯 Success Metrics

After implementation:

✅ **Nera suggests exact shortcuts** (not just agent names)
✅ **Human approval** required before execution
✅ **Context extraction** from user message
✅ **MCP-based execution** (not manual copy-paste)
✅ **Confidence scores** shown to user
✅ **Alternative suggestions** if primary doesn't match

---

**Created**: January 9, 2026
**Nera now knows WHICH tool to use, not just WHICH agent!** 🚀
