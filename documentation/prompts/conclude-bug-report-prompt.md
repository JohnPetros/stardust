---
description: Prompt to conclude a bug fix with validation, architectural adherence and a bug report update.
---

# Prompt: Conclude Bug Report

**Goal:**
Finalize and consolidate the fix for a reported error, ensuring that the bug was properly mitigated, that new tests were added (if applicable) and that the solution respects the project architecture.

**Input:**
*   **Bug Report:** The original report document
*   **Fixed Code:** The changes made to resolve the problem.

**Applicable Rules:**

- Read `documentation/rules/rules.md` to identify the rules of the layers affected by the fix.
- Read `documentation/rules/code-conventions-rules.md` before validating naming, factories, errors, events or general organization.
- Read the corresponding test rules when the fix requires or changes coverage:
    - `documentation/rules/domain-objects-testing-rules.md`
    - `documentation/rules/use-cases-testing-rules.md`
    - `documentation/rules/handlers-testing-rules.md`
    - `documentation/rules/server-routes-testing-rules.md`
    - `documentation/rules/web-app-routes-testing-rules.md`
    - `documentation/rules/widget-tests-rules.md`

**Execution Guidelines:**

1.  **Final Fix Validation:**
    *   **Regression Tests:** Run `pnpm run test` to validate that the bug was resolved and that the system remains stable.
    *   **Error Scenarios:** Make sure unit tests were added for the specific case of the bug, ensuring it does not return (test-first approach for bugs).

2.  **Pattern and Architecture Verification:**
    *   **Respect for Layers:** Validate that the fix respects `documentation/architecture.md` and the specific rules of the layers identified in the diagnosis.

3.  **Bug Report Update:**
    *   Update the Bug Report state or add notes about the final resolution and change the status to "closed".
    *   If the root cause identified during implementation differs from the initial one, document that finding.
