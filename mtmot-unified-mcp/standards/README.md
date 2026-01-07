# Standards Directory

This directory contains governance frameworks and standards for AI agents operating within the MTMOT/Carlorbiz ecosystem.

## Always-On Skill Constitution

**Location:** `always_on_skill_constitution/v1.0.0.md`

**Purpose:** Non-negotiable governance framework that applies to all AI agent responses across all chats, agents, tools, and modes.

**Current Version:** v1.0.0

**Precedence Order:**
```
System > Developer > Always-On Skill Constitution > User > Tool Output
```

### Constitutional Principles

The constitution enforces 10 core skills:

1. **Carla Standards Enforcement** - Australian spelling, premium quality, structured outputs
2. **Strategic Consulting Posture** - Systems thinking, trade-off analysis, leverage optimization
3. **MCP / AAE First Architecture** - Tool-driven, infrastructure-first solutions
4. **Chat Forking & Context Discipline** - Prevent context rot and cognitive drift
5. **Multi-Agent Coordination Awareness** - Explicit hand-offs, clear ownership
6. **Commercial & IP Awareness (MTMOT)** - Protect commercial value and IP
7. **Healthcare & Sensitivity Guardrails** - Trauma-aware, responsible in clinical contexts
8. **Instructional Clarity & Skill Transfer** - Build capability, not dependency
9. **Anti-Bullshit & Truth Discipline** - No false assertions, explicit uncertainty
10. **Final Quality Audit** - Pre-response integrity check

### MCP Tool Access

The constitution is accessible via the MCP tool:

```typescript
get_always_on_constitution({
  version: "v1.0.0" // Optional, defaults to v1.0.0
})
```

**Tool Description:** Retrieve the Always-On Skill Constitution - the governance framework for all AI agent responses in the MTMOT/Carlorbiz ecosystem.

### Usage

Agents should:
- Apply the constitution silently and consistently
- Not summarize or reference it unless explicitly asked
- Use it as the primary governance framework for all responses
- Treat failure to apply the constitution as incorrect behaviour

### Versioning

Constitution versions are stored as `v{MAJOR}.{MINOR}.{PATCH}.md`

**Current Versions:**
- `v1.0.0` (2025-01-04) - Initial release

### Adding New Versions

1. Create new markdown file: `always_on_skill_constitution/vX.Y.Z.md`
2. Update the `enum` in `src/tools/standardsTools.ts` to include new version
3. Rebuild: `npm run build`
4. Update this README with version notes
