---
description: Prompt to update the architecture document based on PRDs, specs, rules, and code changes.
---

# Prompt: Update architecture document

**Goal:**
Keep the project's architecture document (`documentation/architecture.md`) up to date, ensuring it faithfully reflects the structural decisions, design patterns, adopted technologies, and code organization.

**Inputs:**
1.  Product Requirements Documents (PRDs) and Technical Specifications (Specs).
    *   *Note:* all Spec files have the `-spec.md` extension.
2.  Architecture and layer rules documents.
    *   Example: `documentation/rules/rules.md`, `documentation/rules/ui-layer-rules.md`, `documentation/rules/core-package-rules.md`.
3.  Significant changes in the source code (new layers, refactorings, introduction of packages).
4.  The current `documentation/architecture.md` file.

**Applicable Rules:**

Before editing the architecture, read:

- `documentation/rules/rules.md` — index of rules per layer.
- The Rules of the layers impacted by the architectural change.
- `documentation/rules/code-conventions-rules.md` — when the update mentions naming patterns, factories, events, errors, or organization.

If the architecture and a specific rule diverge, record the divergence and update both documents in the same flow.

**Execution Guidelines:**

1.  **Impact Analysis:**
    *   **PRDs/Specs:** Assess whether they introduce new domains, components, or technological needs.
    *   **Rules:** Check whether new rules change existing architectural patterns (e.g., a new way of handling errors, a new mandatory folder structure).
    *   **Code:** Check whether the code changes respect the boundaries defined in the current architecture or require a documentation update (architecture evolution).

2.  **Updating Critical Sections:**
    *   **Overview and Diagrams:** Update the ASCII diagrams if there are changes in the data flow or the relationship between layers.
    *   **Domain Modules:** Add new modules or update the DTOs listed in the bounded contexts table.
    *   **Technology Stack:** Keep dependency versions up to date according to `pubspec.yaml` and document new key libraries.
    *   **Layers (UI, Core, Rest, Database, RPC, etc.):** Reflect changes in the folder structure or in each layer's responsibilities. If new patterns are adopted (e.g., moved from MVP to MVVM), update the explanations and code examples.
    *   **Directory Structure:** Keep the directory tree at the end of the document in sync with the project's reality.

3.  **Consistency Validation:**
    *   Ensure the code examples in the architecture document compile or are syntactically correct and representative of the real code.
    *   Check whether the "Pitfalls to Avoid" are still relevant or whether new lessons learned should be added.
