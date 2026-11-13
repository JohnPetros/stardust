---
description: Prompt to conclude a report of any type (performance, security, bug report), verifying fixes in the code, updating item statuses, and closing the document.
---

# Prompt: Conclude Report

## Goal

Finalize a report — a diagnostic one (performance, security) or a bug report — by verifying the fixes applied in the code, consolidating the state of each identified item, and updating the document with the resolution record.

---

## Input

- **Report:** Path of the document to be concluded
  - Diagnostic: `documentation/reports/{name}.md`
  - Bug report: `documentation/features/{domain}/bug-reports/{name}.md`
- **Resolved items:** IDs or description of what was fixed (e.g., `ISSUE-01, ISSUE-03` or `"main bug fixed"`)
- **Discarded items (optional):** What was evaluated and will not be fixed, with justification
- **New findings (optional):** Problems found during implementation that were not in the original report

---

## Step 1: Identify the Type and the App

Read the document's frontmatter:

| Field | Diagnostic | Bug Report |
|-------|-------------|------------|
| Location | `documentation/reports/` | `documentation/features/.../bug-reports/` |
| `type` | `performance` \| `security` | absent |
| `apps` | e.g., `web`, `server` | e.g., `web`, `server` |
| `last_updated_at` | ✓ | absent — uses `last_updated` |

Use the `apps` field to build the quality commands. If there are multiple apps (e.g., `web, server`), run the commands for each one.

The execution flow diverges according to the identified type.

---

## Applicable Rules

Before verifying or closing any report, read:

- `documentation/rules/rules.md` — index to discover the rules of the layers affected by the resolved items.
- `documentation/rules/code-conventions-rules.md` — general validation of naming, organization, factories, errors, and events.
- The testing rules corresponding to the fixed artifacts, when coverage was created or changed:
  - `documentation/rules/domain-objects-testing-rules.md`
  - `documentation/rules/use-cases-testing-rules.md`
  - `documentation/rules/handlers-testing-rules.md`
  - `documentation/rules/server-routes-testing-rules.md`
  - `documentation/rules/web-app-routes-testing-rules.md`
  - `documentation/rules/widget-tests-rules.md`

For performance or security reports, also consult the rules of the layers cited in each issue before marking the item as `resolved`.

---

## Flow A — Diagnostic (performance, security)

### A1: Classify the Issues

Read all issues in the document. For each one, set the state based on the inputs received:

- `resolved` — fixed and validated in the code
- `open` — not yet addressed
- `discarded` — evaluated and discarded with justification

### A2: Verify the Fixes in the Code

For each `resolved` issue:

- Locate the file and line pointed to as **Evidence** in the original issue.
- Confirm that the problematic snippet was changed.
- If the actual approach differs from the recommended one, document the difference — do not rewrite the original issue.
- If it is not possible to verify in the code, mark it as `resolved (not verified)` and record it in the pending items of the Final Resolution section.

### A3: Run the Quality Checklist

Run for each affected app and record the result:

```bash
pnpm --filter @stardust/{APP} run test:unit
pnpm --filter @stardust/{APP} run check:types
pnpm --filter @stardust/{APP} run check:code
```

If any command fails, **do not close the report** — record the failure in the checklist and keep `status: open`.

### A4: Record New Findings

If there are new findings:

- Add them to the report with sequential IDs starting from the last existing one (e.g., if the last was `ISSUE-16`, the new one starts at `ISSUE-17`).
- Use the same format as the document's original issues.
- Classify them as `open`.

### A5: Update the Document

Make the following edits to the file:

1. **Frontmatter:** Update `last_updated_at`. Change `status` to `closed` **only** if there is no `open` issue without a discard justification.
2. **Status per issue:** Add `- **Status:** resolved | open | discarded` at the end of each issue block.
3. **Discard justification:** In `discarded` issues, add `- **Discard justification:** {REASON}`.
4. **Verification Checklist:** Fill in the checklist that already exists in the document with `[x]` for passed and `[ ]` for failed.
5. **Final Resolution section:** Add it at the end of the document, before `## References`.

---

### Template: Final Resolution Section (Diagnostic)

```md
## Final Resolution

**Completion date:** {DATE}

### Resolved Items

| ID | Title | Approach Taken |
|----|--------|-------------------|
| ISSUE-01 | {TITLE} | As per the original recommendation |
| ISSUE-03 | {TITLE} | Alternative approach: {DESCRIPTION} |

### Discarded Items

| ID | Title | Justification |
|----|--------|---------------|
| ISSUE-05 | {TITLE} | {REASON} |

### Open Items

| ID | Title | Next Step |
|----|--------|---------------|
| ISSUE-07 | {TITLE} | {PENDING_ACTION} |

### New Findings

| ID | Title | Impact | Status |
|----|--------|---------|--------|
| ISSUE-17 | {TITLE} | {IMPACT} | open |

### Notes

{NOTES_ABOUT_HOW_THE_FIXES_WERE_CARRIED_OUT — omit section if there are none}
```

---

## Flow B — Bug Report

### B1: Verify the Fix in the Code

Read the **Correction Plan** section of the document (subsections "What must be created", "What must be modified", "What must be removed"). For each item:

- Confirm in the code that the change was actually applied.
- If the actual approach differs from the plan, document the divergence — do not rewrite the original plan.
- If a plan item was not implemented, it is an `open` item — do not close the report.

### B2: Run the Quality Checklist

Run for each affected app and record the result:

```bash
pnpm --filter @stardust/{APP} run test:unit
pnpm --filter @stardust/{APP} run check:types
pnpm --filter @stardust/{APP} run check:code
```

In addition to the general commands, verify:

- Is there a **unit test covering the specific scenario that caused the bug**? If not, add one before closing.
- Do the regression tests of the affected module still pass?

If any command fails or the test for the specific case is missing, **do not close the report**.

### B3: Record New Findings

If additional problems not covered by the original bug report were found during the fix:

- Assess whether they deserve a **separate new bug report** (distinct problem, different layer) or can be recorded as a note in the current one (variation of the same problem).
- If you create a separate bug report, record its path in the Final Resolution section.

### B4: Update the Document

Make the following edits to the file:

1. **Frontmatter:** Update `last_updated` (without `_at`, the bug report standard). Change `status` to `closed` **only** if all plan items were implemented and the tests pass.
2. **Final Resolution section:** Add it at the end of the document.

---

### Template: Final Resolution Section (Bug Report)

```md
## Final Resolution

**Completion date:** {DATE}

### Confirmed Root Cause

{Description of the actual root cause. If it differed from the original diagnosis, record the divergence here.}

### Approach Taken

{Summary of what was actually implemented.}

**Divergences from the original plan:**
- {Item from the original plan} → {What was done differently and why}

### New Findings

{Problems found during the fix that were not in the original report. Omit section if there are none.}

- Separate bug report created: {yes — `documentation/features/{domain}/bug-reports/{name}.md` | no}

### Checklist Result

- [ ] The incorrect behavior no longer occurs
- [ ] Unit test covers the specific bug scenario
- [ ] `pnpm --filter @stardust/{APP} run test:unit` — passed | failed
- [ ] `pnpm --filter @stardust/{APP} run check:types` — passed | failed
- [ ] `pnpm --filter @stardust/{APP} run check:code` — passed | failed

### Notes

{Free-form notes about how the fix was carried out — omit section if there are none}
```

---

## Constraints

- Do not change the original content of the issues, diagnostics, or the correction plan — only add status fields, justifications, and the Final Resolution section.
- Do not mark an item as `resolved` without verifying the fix in the code or receiving explicit confirmation.
- Do not change `status` to `closed` in the frontmatter while there are `open` items without a discard justification.
- If the actual root cause differs from the one originally identified, record the divergence — never rewrite the document's history.
- In bug reports, do not close without confirming the existence of a unit test for the specific bug scenario.
