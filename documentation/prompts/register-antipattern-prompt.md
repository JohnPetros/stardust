---
description: Registers an anti-pattern committed during implementation in the corresponding layer's rules doc, to avoid recurrence in future sessions.
---

# Prompt: Register Anti-pattern

**Goal:** Document an implementation mistake made by the AI in the corresponding
layer's rules file, in a clear and actionable way so that the
same anti-pattern does not recur in future sessions.

> Before registering the anti-pattern, read:
> - `documentation/overview.md`
> - `documentation/architecture.md`
> - `documentation/rules/rules.md`

---

## Applicable Rules

This prompt always changes `documentation/rules/`, so read:

- `documentation/rules/rules.md` — index for selecting the target file.
- The specific Rule of the layer affected by the anti-pattern.
- `documentation/rules/code-conventions-rules.md` — when the anti-pattern involves names, factories, errors, events or general organization.

---

## Input

- **Anti-pattern description:** what was done wrong and in what context
  (free text, code snippet, description of the incorrect behavior).
- **Affected layer** (optional): if already known, provide the layer
  (`core`, `database`, `rest`, `rpc`, `queue`, `ui`, `realtime`,
  `provision`, `ai`, `validation`, `lsp`, `testing`, `code-conventions`,
  `web`, `server`, `backoffice`). If
  unknown, the prompt identifies it automatically.

---

## Execution Guidelines

### 1. Identify the correct rules doc

Read `documentation/rules/rules.md` and, based on the anti-pattern description,
identify the rules file of the affected layer:

| Layer | File |
|---|---|
| Business rule / domain | `documentation/rules/core-package-rules.md` |
| Persistence / repositories / mappers | `documentation/rules/database-rules.md` |
| HTTP communication / `RestClient` / REST services | `documentation/rules/rest-layer-rules.md` |
| Actions / `Call` contract / RPC | `documentation/rules/rpc-layer-rules.md` |
| Async jobs / Inngest / broker | `documentation/rules/queue-layer-rules.md` |
| Widgets / hooks / views / stores | `documentation/rules/ui-layer-rules.md` |
| Realtime channels / listeners | `documentation/rules/realtime-rules.md` |
| Third-party providers / gateways | `documentation/rules/provision-layer-rules.md` |
| AI tools / workflows / prompts | `documentation/rules/ai-layer-rules.md` |
| Shared schemas and validations | `documentation/rules/validation-layer-rules.md` |
| Delegua language / LSP package | `documentation/rules/lsp-layer-rules.md` |
| Code conventions / naming / factories | `documentation/rules/code-conventions-rules.md` |
| Web app rules | `documentation/rules/web-application-rules.md` |
| Server app rules | `documentation/rules/server-application-rules.md` |
| Studio app rules | `documentation/rules/backoffice-application-rules.md` |
| Handler tests | `documentation/rules/handlers-testing-rules.md` |
| Server HTTP route tests | `documentation/rules/server-routes-testing-rules.md` |
| Web routes and pages tests | `documentation/rules/web-app-routes-testing-rules.md` |
| Use case tests | `documentation/rules/use-cases-testing-rules.md` |
| Widget tests | `documentation/rules/widget-tests-rules.md` |
| Domain object tests | `documentation/rules/domain-objects-testing-rules.md` |
| MCP usage | `documentation/rules/mcp-rules.md` |
| PR review | `documentation/rules/pr-review-rules.md` |
| Commits | `documentation/rules/commit-rules.md` |

If the anti-pattern crosses more than one layer, register it in all the
relevant docs.

> Use the project's real names and paths. Do not invent rules files.

### 2. Format the anti-pattern entry

Structure the record in the following format before inserting it into the rules doc:

```markdown
### Anti-pattern: <Short, descriptive title>

**What was done:**
<Objective description of the mistake made, with a code snippet if available.>

**Why it is wrong:**
<Explanation of the architectural impact, principle violation or risk created.>

**What should be done:**
<Description of the correct approach, with a code snippet if possible.>
```

### 3. Insert into the rules doc

Open the rules file identified in step 1 and insert the record:

- Locate the most appropriate section of the doc to register the anti-pattern.
  Fit priority:
  1. an existing prohibitions/anti-patterns section;
  2. a `## Rules` or `## Patterns` section when it already concentrates warnings;
  3. a `## Notes` section, if the document is older and has no
     clear block for prohibitions.
- If the document has no appropriate subsection, create a short, objective
  H3 subsection, without restructuring the rest of the file.
- Add the new anti-pattern at the end of the chosen section, without removing
  existing entries.
- Keep the style and language of the original document.
- Preserve consistency with the StarDust architecture: `packages/core`
  framework-agnostic, apps as adapters, use of Factory Functions where
  applicable and dependency direction pointing inward.

### 4. Confirm

After inserting, display the added excerpt and confirm the path of the
updated file.

---

## Expected Output

- The layer's rules doc updated with the new anti-pattern registered in the most
  appropriate section of the document.
- Display of the inserted excerpt for visual confirmation.

---

## Restrictions

- **Do not remove or rewrite** existing entries in the rules doc.
- **Do not generalize** the anti-pattern beyond what was described — register exactly
  the mistake made, without inferring unobserved problems.
- **Do not invent** fixed sections that do not exist in the current document. Adapt the
  insertion to the real structure of the rules file.
- If the anti-pattern involves an architectural violation, state explicitly the broken boundary
  (e.g., `core` importing an app, business logic outside `packages/core`,
  `RestClient` instantiated inside a `service`, `job` coupled to the Inngest
  SDK, widget accessing infrastructure directly).
- If there is not enough context to identify the layer or describe the
  "What should be done", use the `question` tool before writing.
