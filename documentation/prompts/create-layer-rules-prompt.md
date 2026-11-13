---
description: Create a generic prompt to generate a rules document for an application layer
---

# Prompt: Create Layer Rules

**Goal:** Create a reusable meta-prompt to generate an architectural rules document for a specific application layer. The result must standardize how the layer is described, what boundaries it has, how it integrates with other layers and how to quickly validate new features. The prompt must be oriented toward consistency, clarity and day-to-day applicability for the team.

**Input:**

- **Required:**
  - Layer name `{LAYER}` (e.g. UI, REST, RPC, Queue, Core, Database).
  - Layer goal `{LAYER_GOAL}`.
  - Available sources `{SOURCES}` (files, links, internal docs).
- **Optional:**
  - Related stack and frameworks `{STACK}`.
  - Document constraints `{CONSTRAINTS}`.
  - Existing conventions `{EXISTING_CONVENTIONS}`.
  - Expected output format `{OUTPUT_FORMAT}` (default: Markdown).
  - Level of detail `{DETAIL_LEVEL}` (summarized, medium, complete).
- **Expected input format:**
  - Preferably in bullets.
  - File paths such as `documentation/...`.
  - Rule excerpts and real examples when they exist.

**Applicable Rules:**

Before creating a new rules document, read:

- `documentation/rules/rules.md` — to check whether an applicable rule already exists and avoid duplication.
- `documentation/rules/code-conventions-rules.md` — to keep naming, factories, errors, events and organization consistent.
- Rules of neighboring or analogous layers to `{LAYER}` — to preserve boundaries and dependency direction.

If the new layer is not covered by `rules.md`, the deliverable must also include updating the `documentation/rules/rules.md` index.

**Execution Guidelines:**

1. **Context understanding and validation**
   - Confirm the goal of the rules document for the `{LAYER}` layer.
   - Extract and list the placeholders that will be used in generation: `{LAYER}`, `{LAYER_GOAL}`, `{GLOBAL_DIRECTORIES}`, `{PRINCIPLES}`, `{DESIGN_PATTERNS}`, `{USAGE_PATTERNS}`, `{INTEGRATIONS}`, `{CHECKLIST}`, `{FIXED_RULES}`.
   - Validate whether the provided sources are sufficient to cover the layer's architecture, conventions and boundaries.
   - When there are gaps, assume conservative standards and record open items explicitly in the notes section.

2. **Survey of what already exists**
   - Consult the project's architecture and rules files before writing.
   - If CodeGraph is available, locate similar documents and implementations of the layer and of analogous layers.
   - If there is doubt about a library/framework, consult the official documentation with a docs tool (Context7 MCP).
   - Without tools, ask the user for the minimum necessary excerpts (architecture, conventions and rule examples).

3. **Generation of the final structure**
   - Produce the final document with the mandatory sections and prescriptive language (must/must not).
   - Make the layer's boundaries explicit: what belongs, what does not belong, and how to communicate with other layers.
   - Include practical examples of design patterns and usage patterns applied to the `{LAYER}` context.
   - Include a quick, objective checklist to guide the creation of new features.

4. **Final quality checks**
   - Verify consistency between principles, patterns and integration rules.
   - Verify there are no contradictions with the global architecture and existing rules.
   - Ensure all mandatory sections were filled in.
   - Clearly mark any assumption adopted and any missing information.

**Output Template (Mandatory Structure):**

- The final document must contain exactly the first-level headings below:

```markdown
# {LAYER} Layer Rules

# Overview
- Layer goal
- Main responsibilities
- Layer boundaries

# Global Directory Structure
- Map of relevant folders
- Responsibility of each directory
- Organization and naming rules

# Core Principles
## Must contain
- Mandatory elements of the layer
- Recommended practices

## Must not contain
- Anti-patterns and forbidden couplings
- Responsibilities that belong to other layers

# Design Patterns
- Accepted architectural patterns
- How to apply each pattern in the layer
- When to avoid each pattern

# Applied Usage Patterns
- Common flows of the layer
- Examples of correct usage
- Common mistakes and how to avoid them

# Integration Rules with Other Layers
- Allowed and forbidden dependencies
- Communication contracts/interfaces
- Dependency direction and coupling limits

# Quick Checklist for New Features in the Layer
- Objective validation items before opening a PR
- Minimum architectural conformance criteria
- Warning signs for technical review

# Notes and Pending Items
- Assumptions adopted
- Missing information
- Next steps for refinement
```

4. **Rules:**

- Use Markdown as the output format.
- Do not omit mandatory sections of the template.
- Do not invent nonexistent file paths, contracts or components.
- Prioritize actionable rules that are verifiable in code review.
- Keep normative language: use "must", "must not", "may" with judgment.
- Align the document with the current layered architecture.
- If critical context is missing, record it in `# Notes and Pending Items` instead of inferring freely.
- Avoid genericity: adapt examples and rules to the context of `{LAYER}` and `{STACK}`.
