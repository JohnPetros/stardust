# Instructions for Pull Request Review

## Before starting

- If there is an issue linked to the pull request, read it before analyzing the changes. If there is no issue, base the review exclusively on the code and the project rules, without treating the absence as a problem.

---

## What must be validated

When reviewing the changes, identify and report:

- performance problems
- security problems
- concurrency problems
- coupling problems
- maintainability problems
- code or logic duplication
- missing tests or insufficient coverage
- readability problems
- typos, incorrect names or writing inconsistencies

---

## Compliance with project standards

Check whether the changes follow the standards defined in the files:

- `documentation/rules/code-conventions-rules.md`
- `documentation/rules/rules.md`

If any of these files is not available, state it explicitly and limit the review to the general criteria listed above.

In addition to the code convention, also confirm that the implementation is appropriate for the layer and responsibility of the changed code, respecting the architectural and organizational standards described in the documentation.

---

## Validation against the issue

If there is a linked issue, use it as a reference to validate whether the implementation:

- meets what was requested
- respects the defined scope
- covers the main requirements
- does not introduce behavior that diverges from what was expected

---

## How to report the problems found

Use the following format for each problem identified:

```
**[OBRIGATÓRIO | SUGESTÃO]**
**Problema:** clear and specific description of what is wrong
**Impacto:** real or potential consequence of the problem
**Sugestão:** recommended corrective action (whenever possible)
```

The review comment labels above (`OBRIGATÓRIO` = REQUIRED, `SUGESTÃO` = SUGGESTION, `Problema` = Problem, `Impacto` = Impact) stay in PT-BR, because review comments are written in Portuguese.

**Classification criteria:**

- **OBRIGATÓRIO** (REQUIRED) — security problems, bugs, direct violations of the project rules or behavior that diverges from what was expected in the issue.
- **SUGESTÃO** (SUGGESTION) — readability improvements, non-critical performance, refactoring opportunities or best practices not required by the rules.

---

## What not to do

- Do not comment on personal style preferences that are not covered by the project rules.
- Do not repeat what the code already clearly documents.
- Do not point out the absence of a linked issue as a problem.
- Do not invent standards or rules that are not documented in the reference files.

---

## Final guideline

Prioritize relevant, actionable comments grounded in the project rules. Avoid generic or subjective observations without justification. Quantity is not quality — one precise comment is worth more than five vague ones.
