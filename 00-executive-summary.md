# ACRRM Rural Generalist Training Post Decision Tree
## Executive Summary & Architecture Overview

**Document Version:** 1.0  
**Date:** 25 November 2025  
**Project:** ACRRM Practice Manager Decision Tree Architecture  
**Author:** Manus (AAE Council)  
**For:** Carla Taylor / ACRRM Project

---

## Project Overview

This architectural wireframe establishes the foundation for an **interactive decision tree** that will serve as a comprehensive decision support tool for Practice Managers and Practice Owners managing ACRRM rural generalist training posts. The decision tree synthesizes the restructured 6-part Practice Manager Handbook with embedded NTCER 2026.1 compliance requirements, creating a navigable, context-specific guidance system that addresses the complex, competing priorities inherent in training post management.

---

## Critical Design Principle

**Unlike traditional decision support tools that present simplified "best practice" recommendations, this decision tree explicitly surfaces the tensions and conflicts that arise when four competing priorities clash:**

1. **NTCER Compliance Requirements** (mandatory regulatory obligations)
2. **Training Quality Delivery** (educational outcomes and registrar development)
3. **Business Sustainability** (operational efficiency and financial viability)
4. **Registrar Experience & Retention** (workforce development and rural retention outcomes)

**The decision tree does not gloss over conflicts—it provides Practice Managers with frameworks for ethical and strategic decision-making when trade-offs are necessary.**

---

## Architecture Documents

This architectural wireframe consists of **seven documents**:

### Document 00: Executive Summary & Architecture Overview (This Document)
**Purpose:** Provides high-level overview of the project, architecture, and document structure

### Document 01: Hierarchical Decision Framework
**Purpose:** Establishes the decision tree structure, including:
- 18 primary decision branches (A-R) organized around the Training Post Lifecycle Model
- Tier-1, Tier-2, and Tier-3 question hierarchy
- Natural workflow integration (6 common workflows)
- Handbook integration points
- Cross-referencing architecture (forward, backward, lateral references)

**Key Insight:** The decision tree follows the natural administrative workflows that Practice Managers experience, from pre-placement through end-of-term, with explicit cross-referencing to enable fluid navigation.

---

### Document 02: Multi-Layer Integration Schema
**Purpose:** Defines how the four competing priority layers are integrated into each decision node, including:
- Detailed description of each priority layer (Compliance, Training Quality, Business Sustainability, Registrar Experience)
- Integration methodology and decision node template structure
- Priority alignment analysis framework
- NTCER 2026.1 clause mapping to decision nodes
- Conflict recognition triggers (4 types)
- Multi-layer decision consequence framework

**Key Insight:** Every decision node integrates all four priority layers, making competing priorities visible and explicit. Practice Managers can see where priorities align and where they conflict.

---

### Document 03: Conflict Recognition Architecture
**Purpose:** Establishes how conflicts between competing priorities are surfaced and managed, including:
- Conflict typology (6 primary conflict types)
- Conflict detection node structure
- Conflict resolution decision support framework (7 steps)
- Escalation pathways (TPA, ACRRM, Practice Owner, External Mediation)
- Conflict anticipation and prevention nodes
- Ethical decision-making framework
- Conflict case studies

**Key Insight:** Conflicts are not failures—they are inherent features of complex systems. The decision tree helps Practice Managers recognize conflicts early, understand their implications, and make informed trade-off decisions.

---

### Document 04: Question-Answer Mapping Template
**Purpose:** Provides the standardized template for each decision node, including:
- Decision context (user question, lifecycle phase, handbook reference)
- Multi-layer integration (all 4 priority layers)
- Conflict recognition (if applicable)
- Decision options with multi-layer consequences
- Stakeholder engagement guidance
- Escalation pathways
- Documentation and follow-up actions
- Related decision nodes (forward, backward, lateral references)
- Case studies and FAQs
- Additional resources (templates, tools, contacts)

**Key Insight:** The template ensures consistency, comprehensiveness, and usability across all decision nodes. It serves as the interface into which handbook content, NTCER clauses, and practice scenarios will be populated.

---

### Document 05: Handbook Integration Crosswalk
**Purpose:** Provides bidirectional mapping between the 6-part handbook and the decision tree, including:
- Handbook → Decision Tree mapping (which decision nodes are informed by each handbook section)
- Decision Tree → Handbook mapping (which handbook sections support each decision node)
- Part-by-part integration analysis (Parts 1-6)
- Appendices integration (Glossary, Touchpoints, Resources, Contacts)
- Bidirectional navigation implementation guidance
- Content synchronization protocol

**Key Insight:** The handbook and decision tree are complementary, not redundant. The handbook provides comprehensive reference material; the decision tree provides interactive, context-specific guidance. The crosswalk enables seamless navigation between both resources.

---

### Document 06: Implementation Roadmap
**Purpose:** Outlines the phases, tasks, resources, and timeline for populating and deploying the decision tree, including:
- 6 implementation phases (Architecture Validation, Priority Content Population, Remaining Content Population, User Testing, Platform Development, Launch & Continuous Improvement)
- Priority decision node tiers (Tier 1: Must-Have, Tier 2: Important, Tier 3: Nice-to-Have)
- Content development process and quality review workflow
- User testing approach with realistic scenarios
- Platform development options and requirements
- Training, launch, and continuous improvement strategy
- Resource requirements (personnel, budget, tools)
- Risk management and success metrics

**Key Insight:** Implementation should be phased and iterative, with early user testing to validate the architecture and refine the user experience before full-scale content population. Estimated timeline: 4-6 months.

---

## Decision Tree Structure at a Glance

### Training Post Lifecycle Model (4 Phases)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-PLACEMENT PHASE                          │
│  Decision Branches: A, B, C, D                                  │
│  Focus: Accreditation, Supervisor capability, Cultural safety,  │
│         Business sustainability                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING PHASE                             │
│  Decision Branches: E, F, G, H                                  │
│  Focus: Placement workflow, Mutual fit, Onboarding checklist,   │
│         Week 5 check-in                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DURING TERM PHASE                            │
│  Decision Branches: I, J, K, L, M                               │
│  Focus: Employment compliance, Supervision, Teaching,           │
│         Educational leave, AFEP access                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    END OF TERM PHASE                            │
│  Decision Branches: N, O, P, Q, R                               │
│  Focus: Reporting, Assessment, Respectful workplaces,           │
│         Troubleshooting, Retention strategies                   │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** Branches P (Respectful Workplaces) and Q (Troubleshooting) can be accessed from any phase.

---

## 18 Primary Decision Branches

| Branch | Title | Lifecycle Phase | Handbook Parts |
|--------|-------|-----------------|----------------|
| **A** | Practice Accreditation Readiness | Pre-Placement | 1, 2 |
| **B** | Supervisor Capability Assessment | Pre-Placement | 2, 5 |
| **C** | Cultural Safety & Specialist Context | Pre-Placement | 1, 2, 6 |
| **D** | Business Sustainability Planning | Pre-Placement | 1, 3 |
| **E** | Registrar Placement Workflow | Onboarding | 3, 4 |
| **F** | Mutual Fit & Interview Process | Onboarding | 4 |
| **G** | Onboarding Action Plan & Checklist | Onboarding | 4, 5 |
| **H** | Week 5 Check-In & Early Support | Onboarding | 4, 5, 6 |
| **I** | Employment & Financial Compliance | During Term | 3 |
| **J** | Supervision Model Implementation | During Term | 2, 5 |
| **K** | Teaching Requirements & Scheduling | During Term | 3, 5 |
| **L** | Educational Leave Management | During Term | 3, 5 |
| **M** | ACRRM Fellowship Education Programme | During Term | 1, 5 |
| **N** | Administrative Timeline & Reporting | End of Term | 4, 6 |
| **O** | Supporting Assessment | End of Term | 5, 6 |
| **P** | Respectful Workplaces & Wellbeing | Any Phase | 1, 2, 6 |
| **Q** | Troubleshooting & Escalation | Any Phase | All (context-dependent) |
| **R** | Retention Strategies | End of Term | 1, 6 |

---

## Six Conflict Types

The decision tree explicitly recognizes and addresses six types of conflicts that arise from competing priorities:

| Conflict Type | Competing Priorities | Example Decision Nodes |
|---------------|----------------------|------------------------|
| **Type 1** | Compliance vs Business Sustainability | I.1 (Employment Contract), I.4 (Leave Accrual), L.1 (Educational Leave) |
| **Type 2** | Training Quality vs Operational Efficiency | K.1 (Teaching Time Protection), K.2 (Patient Load), O.2 (WBA Coordination) |
| **Type 3** | Registrar Experience vs Practice Capacity | E.1 (Placement Capacity), J.3 (Off-Site Supervision), M.1 (AFEP Course Access) |
| **Type 4** | Compliance vs Training Quality | J.1 (Supervision Model), L.2 (Study Leave) |
| **Type 5** | Business Sustainability vs Registrar Retention | P.3 (Wellbeing Programs), R.2 (Community Integration) |
| **Type 6** | Compliance vs Registrar Experience | I.1 (NTCER Compliance), N.1 (Reporting Requirements) |

---

## User Entry Points

Practice Managers can enter the decision tree through multiple pathways:

### Entry by Lifecycle Phase
- "I'm in the pre-placement phase" → Branches A-D
- "I'm onboarding a registrar" → Branches E-H
- "I'm managing an ongoing placement" → Branches I-M
- "I'm preparing for reporting/end of term" → Branches N-R

### Entry by Topic
- "I need help with compliance" → Branch I
- "I need help with supervision" → Branch J
- "I need help with accreditation" → Branch A
- "I have a problem/conflict" → Branch Q

### Entry by Urgency
- "I have a registrar starting next week" → Branch G
- "I have a reporting deadline" → Branch N
- "I have a registrar complaint" → Branch Q
- "I need to decide on a placement offer" → Branch E

### Entry by Handbook Section
Users can also enter via the handbook structure (Parts 1-6), with the decision tree providing the interactive navigation layer.

---

## Priority Decision Nodes for Implementation

### Tier 1 Priority (Must-Have for Launch): 20 nodes
- **Accreditation:** A.1, A.2
- **Supervisor Capability:** B.1, B.2
- **Placement Workflow:** E.1, E.2, E.3
- **Mutual Fit:** F.1, F.2
- **Onboarding:** G.1, G.2, G.3
- **Early Support:** H.1, H.2
- **Employment Compliance:** I.1, I.2, I.3, I.6, I.9, I.10
- **Teaching Time:** K.1
- **Reporting:** N.1, N.2

### Tier 2 Priority (Important for Comprehensive Coverage): 15 nodes
- **Cultural Safety:** C.1, C.2
- **Business Sustainability:** D.1, D.2
- **Additional Employment:** I.4, I.5, I.7, I.8, I.11, I.12
- **Supervision:** J.1, J.2, J.3
- **Educational Leave:** L.1, L.2
- **AFEP:** M.1, M.2
- **Assessment:** O.1, O.2

### Tier 3 Priority (Nice-to-Have for Full Coverage): 10-15 nodes
- All remaining nodes in Branches A-R

---

## Implementation Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1:** Architecture Validation & Pilot Node Development | 2-3 weeks | Validated architecture, 3-5 fully populated pilot nodes |
| **Phase 2:** Content Population (Priority Nodes) | 4-6 weeks | 30-40 high-priority nodes fully populated |
| **Phase 3:** Content Population (Remaining Nodes) | 4-6 weeks | All decision nodes fully populated |
| **Phase 4:** User Testing & Refinement | 3-4 weeks | User feedback integrated, decision tree refined |
| **Phase 5:** Platform Development & Deployment | 4-6 weeks | Interactive decision tree platform deployed |
| **Phase 6:** Training, Launch, & Continuous Improvement | Ongoing | Practice Managers trained, decision tree launched, feedback loop established |

**Total Estimated Timeline:** 17-25 weeks (approximately 4-6 months)

---

## Success Metrics

### Launch Metrics (First 3 Months)
- **Practice Manager Awareness:** 90% of Practice Managers are aware of decision tree
- **Platform Adoption:** 60% of Practice Managers have accessed decision tree at least once
- **User Satisfaction:** Average rating of 4/5 or higher for usability, clarity, usefulness
- **Decision Node Coverage:** 100% of Tier 1 Priority nodes are populated and approved
- **Training Completion:** 70% of Practice Managers have completed training

### Long-Term Metrics (6-12 Months)
- **Regular Usage:** 40% of Practice Managers use decision tree at least monthly
- **Decision Node Usefulness:** 80% of decision nodes rated as "helpful" or "very helpful"
- **Reduction in TPA Support Requests:** 20% reduction in Practice Manager support requests to TPA
- **Improved Compliance:** Reduction in NTCER compliance issues among practices using decision tree
- **Positive Registrar Outcomes:** Practices using decision tree report higher registrar satisfaction and retention

---

## Key Innovations

This decision tree architecture introduces several innovations that distinguish it from traditional decision support tools:

### 1. Multi-Layer Integration
Every decision node integrates four competing priority layers (Compliance, Training Quality, Business Sustainability, Registrar Experience), making trade-offs explicit rather than hidden.

### 2. Conflict Recognition & Resolution
The decision tree explicitly surfaces conflicts between competing priorities and provides frameworks for ethical and strategic decision-making when trade-offs are necessary.

### 3. Bidirectional Handbook Integration
The decision tree and handbook are complementary resources with seamless bidirectional navigation, allowing users to move fluidly between interactive guidance and comprehensive reference material.

### 4. Lifecycle-Based Navigation
The decision tree follows the natural administrative workflows that Practice Managers experience, organized around the Training Post Lifecycle Model (Pre-Placement, Onboarding, During Term, End of Term).

### 5. Stakeholder Engagement Guidance
Each decision node includes explicit guidance on when to consult stakeholders (Practice Owner, Supervisor, Registrar, TPA, ACRRM) and provides engagement scripts to facilitate conversations.

### 6. Escalation Pathways
The decision tree provides clear escalation pathways when conflicts cannot be resolved internally, including TPA support, ACRRM guidance, Practice Owner consultation, and external mediation.

### 7. Case Studies & Real-World Scenarios
Each decision node includes case studies and real-world scenarios that illustrate how Practice Managers have navigated similar decisions, providing practical, evidence-based guidance.

---

## Alignment with Project Goals

This architectural wireframe directly addresses the project goals outlined in the original request:

### Goal 1: Develop a wireframe and structural architecture for an interactive decision tree
✓ **Achieved:** Documents 01-04 establish the hierarchical framework, multi-layer integration schema, conflict recognition architecture, and question-answer mapping template.

### Goal 2: Integrate the 6-part handbook structure with NTCER 2026.1 compliance requirements
✓ **Achieved:** Document 05 (Handbook Integration Crosswalk) provides comprehensive bidirectional mapping between handbook and decision tree, with explicit NTCER clause integration.

### Goal 3: Address four competing priorities without glossing over conflicts
✓ **Achieved:** Documents 02-03 establish the multi-layer integration schema and conflict recognition architecture, ensuring conflicts are surfaced and managed rather than hidden.

### Goal 4: Create a framework that can be populated with content systematically
✓ **Achieved:** Document 04 (Question-Answer Mapping Template) provides a standardized template for populating decision nodes, and Document 06 (Implementation Roadmap) outlines the systematic content population process.

### Goal 5: Provide a roadmap for implementation
✓ **Achieved:** Document 06 (Implementation Roadmap) provides a detailed, phased implementation plan with timeline, resource requirements, and success metrics.

### Goal 6: Save as a GitHub memory point for AAE Council integration
✓ **Achieved:** All documents are saved to `/home/ubuntu/acrrm-decision-tree/` and will be committed to GitHub (carlorbiz/mem0) for AAE Council context continuity.

---

## Next Steps

### Immediate Actions (This Week)
1. **Stakeholder Review:** Distribute Documents 00-06 to ACRRM Project Team and key stakeholders for review
2. **Feedback Collection:** Gather feedback on architecture, template, and implementation roadmap
3. **Pilot Node Selection:** Confirm which 3-5 pilot decision nodes will be developed in Phase 1
4. **Resource Allocation:** Identify content developers, subject matter experts, and Practice Manager reviewers
5. **Budget Approval:** Secure budget approval for implementation phases

### Phase 1 Kickoff (Next Week)
1. **Architecture Refinement:** Incorporate stakeholder feedback into Documents 00-06
2. **Content Developer Training:** Train content developers on Decision Node Template and Handbook Integration Crosswalk
3. **Pilot Node Development:** Begin populating 3-5 pilot decision nodes
4. **User Testing Recruitment:** Recruit 3-5 Practice Managers for pilot node user testing

---

## Document Navigation

This executive summary provides a high-level overview of the entire architectural wireframe. For detailed information, please refer to the individual documents:

- **Document 01:** [Hierarchical Decision Framework](./01-hierarchical-decision-framework.md)
- **Document 02:** [Multi-Layer Integration Schema](./02-multi-layer-integration-schema.md)
- **Document 03:** [Conflict Recognition Architecture](./03-conflict-recognition-architecture.md)
- **Document 04:** [Question-Answer Mapping Template](./04-question-answer-mapping-template.md)
- **Document 05:** [Handbook Integration Crosswalk](./05-handbook-integration-crosswalk.md)
- **Document 06:** [Implementation Roadmap](./06-implementation-roadmap.md)

---

## Conclusion

This architectural wireframe establishes a comprehensive, innovative foundation for the ACRRM Practice Manager Decision Tree. By explicitly integrating four competing priority layers, surfacing conflicts rather than hiding them, and providing Practice Managers with frameworks for ethical and strategic decision-making, the decision tree will serve as a valuable decision support tool that addresses the complex realities of training post management.

The phased implementation approach ensures that the decision tree will be validated through user testing, populated systematically with high-quality content, and deployed on a functional platform that supports Practice Managers in their critical role of managing rural generalist training posts.

With appropriate resource allocation and commitment to the implementation roadmap, the decision tree can be launched within 4-6 months and will contribute to improved compliance, training quality, business sustainability, and registrar retention outcomes across Australia's rural generalist training network.

---

**Document Status:** Draft for Review  
**AAE Council Integration:** This document is saved to GitHub (carlorbiz/mem0) for AAE Council context continuity  
**Recommended Next Action:** Stakeholder review and feedback on Documents 00-06

**Date:** 25 November 2025  
**Author:** Manus (AAE Council)  
**For:** Carla Taylor / ACRRM Project
