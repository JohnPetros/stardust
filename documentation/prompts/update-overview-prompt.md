---
description: Prompt to update the project overview with features, status and links aligned with the current state.
---

# Prompt: Overview Update

**Objective:**
Keep the project overview document (`documentation/overview.md`) up to date, ensuring it accurately reflects the current state of the software, including planned, in-development and completed features.

**Inputs:**
1.  GitHub milestones used as PRDs and related technical documents.
2.  The current `documentation/overview.md` file.
3.  Current state of the implementation (source code), if needed to verify status.

**Applicable Rules:**

Before updating the overview, read:

- `documentation/rules/rules.md` — when the overview mentions layers, apps or technical responsibilities.
- `documentation/rules/web-application-rules.md`, `documentation/rules/server-application-rules.md` and `documentation/rules/backoffice-application-rules.md` — when the update describes specific capabilities of those apps.
- `documentation/rules/code-conventions-rules.md` — when the overview mentions general organization or naming patterns.

Do not turn the overview into a rules document; use the rules only to avoid incorrect technical descriptions.

**Execution Guidelines:**

1.  **Analysis of PRDs and Features:**
    *   Examine GitHub milestones used as PRDs and available Specs to identify new features, modules or scope changes. Spec files end with the extension `-spec.md`.
    *   Identify features that have already been implemented but are not in the overview.

2.  **Document Update:**
    *   **Features:** Add or update the list of features/modules, briefly describing each one.
    *   **Status:** Update the status of the features (e.g. Planned, In Progress, Completed) according to the reality of the project.
    *   **Architecture:** If there are significant architectural changes mentioned in the PRDs or implemented, reflect them in the appropriate section of the overview.

3.  **Link Maintenance:**
    *   Make sure the overview contains valid links to the corresponding PRDs, making navigation easier.

4.  **Formatting:**
    *   Maintain visual and structural consistency with the rest of the document (headings, lists, tables).
