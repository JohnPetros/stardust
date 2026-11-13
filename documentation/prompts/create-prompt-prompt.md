---
description: Create a generic prompt (meta-prompt) to generate consistent and reusable prompts
---

# Prompt: Create Generic Prompt

**Objective:** Create a **generic, reusable prompt** (meta-prompt) that serves as a basis for generating high-quality prompts for different tasks (e.g. technical spec, PRD, checklist, refactoring plan, implementation roadmap). The result must be clear, modular, and easy to adapt by swapping only variables.

**Input:**

- Main topic/task that the generic prompt must cover (e.g. “generate technical spec”, “generate PRD”, “generate test plan”).
- Constraints and preferences (e.g. “do not include tests”, “use markdown”, “follow layered architecture”).
- Available sources (e.g. PRDs, guidelines, codebase, links, internal docs).

**Applicable Rules:**

There is no mandatory layer rule for every meta-prompt.

When the generated prompt is specific to StarDust, include in the prompt itself a rules section that points to:

- `documentation/rules/rules.md` — general index.
- `documentation/rules/code-conventions-rules.md` — when it involves code, naming, classes, factories, errors or events.
- Specific rules of the layers or test types the prompt intends to operate on.

**Execution Guidelines:**

1. **Research and Contextualization (Chain of Thought):**
   - **Understand the end goal:** Which artifact the generic prompt will generate and what for.
   - **Define variables (placeholders):** List parameterizable fields (e.g. `{TASK}`, `{CONTEXT}`, `{STACK}`, `{RULES}`, `{OUTPUT}`).
   - **Map the workflow:** Which inputs become which outputs and in what order.
   - **Identify dependencies:** Which documents/files/rules the model must consult before writing.
   - **Avoid ambiguity:** Include completeness criteria and how to handle missing information (e.g. “assume X”, “record pending items”).

2. **Use of Auxiliary Tools:**
   - **Repository search tool (optional):** If available, instruct the AI to locate similar files and examples.
   - **Documentation tool (optional):** If available, instruct the AI to consult official docs when in doubt about a lib/framework.
   - **No-tools mode:** If there are no tools, the AI must ask the user for the relevant excerpts (PRD, guidelines, examples).

3. **Document Structure:** Generate the Markdown file of the **generic prompt** strictly following the model below (the output is a prompt, not the final document of the task):

   Header (Frontmatter):
   - description: [Short description of what the generic prompt generates]

   # Prompt: [Name of the Generic Prompt]

   **Objective:**
   - [Explain in 2–4 lines what this meta-prompt will do when used.]

   **Input:**
   - [List the mandatory and optional inputs.]
   - [Explain the expected format (e.g. bullets, links, file excerpts).]

   **Execution Guidelines:**
   1. [Step 1 — understanding the context and validating inputs]
   2. [Step 2 — surveying what already exists (if applicable)]
   3. [Step 3 — generating the final structure with sections]
   4. [Step 4 — final quality/consistency checks]

   **Output Template (Mandatory Structure):**
   - [Define the first-level headings (#) the output must have.]
   - [Include the expected sub-items within each section.]
   - [Use `{...}` placeholders when it is variable.]

4. Rules:
  - [List fixed rules and constraints of the meta-prompt.]
  - [E.g. “Do not include automated tests”, “Do not invent file paths”, “Use Markdown”, “Do not omit mandatory sections”.]
