---
description: Update a rules document of an existing layer, fixing structure, scannability, paths, and consistency with the current architecture.
---

# Prompt: Update Layer Rules

**Goal:** Update the document `{TARGET_FILE}` (rules of the `{LAYER}` layer) preserving the existing valid content, fixing structural problems, validating path references, and aligning the document with the project's current architecture and conventions. The result must be the final Markdown, ready to replace the file directly.

**Input:**

- **Required:**
  - Layer name `{LAYER}` (e.g., UI, REST, RPC, Queue, Core, Database).
  - Path of the file to be updated `{TARGET_FILE}` (e.g., `documentation/rules/rest-layer-rules.md`).
  - Update goal `{UPDATE_GOAL}`: what needs to change and why (2-6 bullets).
- **Optional:**
  - Specific constraints `{CONSTRAINTS}` (e.g., "do not change the checklist section", "keep existing code examples").
  - Additional sources `{SOURCES}` (files, links, internal docs with new information to incorporate).

- **Expected format for `{UPDATE_GOAL}`:**

```md
- Fix the heading hierarchy (single H1, H2/H3 without skipping levels)
- Turn long blocks into tables and lists
- Validate and fix cited paths
  - Incorporate new naming conventions defined in {SOURCES}
```

**Applicable Rules:**

Before updating `{TARGET_FILE}`, read:

- `documentation/rules/rules.md` — to keep the index consistent with the updated rule.
- `documentation/rules/code-conventions-rules.md` — when the update involves names, factories, errors, events, or general organization.
- Rules of neighboring layers when the update touches boundaries, dependencies, or integration between layers.

If the update changes the scope of the rule, also update `documentation/rules/rules.md`.

**Execution Guidelines:**

1. **Understanding and validating inputs**
   - Confirm that `{TARGET_FILE}` exists and is a Markdown file.
   - Read the current content in full and identify:
     - Gaps relative to the standard layer rules template.
     - Repetitions, inconsistencies in terms, and hierarchy problems (H1/H2/H3).
     - All paths and links referenced in the document (extract as a list).
   - Confirm the scope of `{UPDATE_GOAL}`: what must change, what must be preserved.

2. **Context gathering (before rewriting)**
   - Consult the project's base docs to ensure alignment:
     - `documentation/overview.md`
     - `documentation/architecture.md`
     - `documentation/rules/rules.md`
   - If CodeGraph is available, validate the paths listed in the previous step and locate 2-5 real examples of the layer to reference.
   - If there is doubt about a library/framework, consult the official documentation with a docs tool (MCP Context7).
   - Without tools, ask the user for: the content of `{TARGET_FILE}`, the relevant base docs, and the minimum 2-5 examples needed.

3. **Updating the document (final rewrite)**
   - Rewrite preserving valid content and applying the fixes from `{UPDATE_GOAL}`.
   - Keep a professional, direct, and technical tone.
   - Body text in English; technical terms as `code` (e.g., `provider`, `repository`, `service`, `DTO`, `handler`, `runtime`).
   - Improve scannability:
     - Prefer lists and tables for responsibilities, boundaries, and rules.
     - Use `>` callouts for notes and warnings (e.g., `> ⚠️` for critical prohibitions).
   - Keep consistency with the layered architecture:
     - Make dependency direction, contracts, and boundaries explicit.
     - Ensure that the "before the PR" checklist is present and up to date.
   - If `{TARGET_FILE}` does not follow the standard section template, restructure it for conformance (see the template below).

4. **Final quality checks**
   - Validate before delivering:
     - Single H1 in the document; H2/H3 without skipping levels.
     - All cited paths exist in the project — do not invent.
     - External links with correct syntax: `[Text](URL)`.
     - Code blocks with a declared language (e.g., ` ```ts `, ` ```tsx `, ` ```bash `).
     - No mandatory section omitted.
   - If critical information is missing:
     - **Do not invent.** Record in `## Pending Items` what could not be validated.

**Output Template (Mandatory Structure):**

The updated document must follow exactly this section structure:

```markdown
# {LAYER} Layer Rules

## Overview
- Goal of the layer
- Main responsibilities
- Does not do (negative scope)

## Directory Structure
<!-- If the layer does not have a well-defined directory of its own, simplify
     to a short note indicating where its artifacts reside. -->
- Table with paths and purposes

## Fundamental Principles

### Must contain
- Mandatory elements of the layer
- Recommended practices

### Must not contain
- Anti-patterns and forbidden couplings
- Responsibilities that belong to other layers

## Design Patterns
- Accepted architectural patterns
- How to apply each pattern in the layer
- When to avoid each pattern

## Applied Usage Patterns
- Common flows of the layer
- Examples of correct usage
- Common mistakes and how to avoid them

## Integration Rules with Other Layers
- Allowed and forbidden dependencies
- Communication contracts/interfaces
- Dependency direction and coupling limits

## Quick Checklist for New Features in the Layer
- Objective validation items before opening a PR
- Minimum architectural conformance criteria
- Warning signs for technical review

## Notes
- Assumptions adopted
- Relevant internal references

## Pending Items
<!-- Include only if there is missing or unvalidated information.
     Remove the section if there are no pending items. -->
- Missing information
- Next steps for refinement
```

**Rules:**

- Use Markdown as the output format.
- Do not skip heading levels (H1 -> H2 -> H3).
- Do not omit mandatory sections of the template.
- Do not invent paths, file names, contracts, or nonexistent components.
- Preserve valid content from the original document — updating is not rewriting from scratch without criteria.
- Keep normative language: use "must", "must not", "may" with discretion.
- Technical terms remain in English as `code`.
- If there is a conflict between `{CONSTRAINTS}` and the template standard, prioritize `{CONSTRAINTS}` and record the impact in `## Notes`.
- Deliver the complete and final Markdown content, ready to replace `{TARGET_FILE}` directly.

**Expected output:**

In addition to the final Markdown document, include at the end a summarized validation block:

```md
## Update Validation Checklist

- [ ] Single H1; H2/H3 without skipping levels
- [ ] All mandatory sections present
- [ ] Cited paths validated (exist in the repo)
- [ ] Technical terms in `code`
- [ ] External links with correct syntax (when present)
- [ ] Code blocks with a declared language
- [ ] Valid content of the original preserved
- [ ] Pending items recorded (if any)
```

> 💡 To create a rules document from scratch, use the prompt `documentation/prompts/create-layer-rules-prompt.md`.
