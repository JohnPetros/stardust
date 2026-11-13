# Instructions for GitHub Copilot Reviews

## Before starting

- Read the `AGENTS.md` file before starting the review.
- If there is an issue linked to the pull request, read it before analyzing the changes. If there is no issue, base the review exclusively on the code and the project rules, and do not treat the absence of an issue as a problem.

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
- typos, incorrect names, or writing inconsistencies

---

## Compliance with project standards

Check whether the changes follow the standards defined in these files:

- `documentation/rules/code-conventions-rules.md`
- `documentation/rules/rules.md`

If any of these files is not available, say so explicitly and limit the review to the general criteria listed above.

In addition to the code conventions, also confirm that the implementation is appropriate for the layer and responsibility of the changed code, respecting the architectural and organizational standards described in the documentation.

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

(The labels `OBRIGATÓRIO` (mandatory), `SUGESTÃO` (suggestion), `Problema` (problem), `Impacto` (impact) and `Sugestão` (suggestion) are literal tokens kept in Portuguese, as they are used across the project's review rules.)

**Classification criteria:**

- **OBRIGATÓRIO** — security problems, bugs, direct violations of the project rules, or behavior that diverges from what is expected in the issue.
- **SUGESTÃO** — readability improvements, non-critical performance, refactoring opportunities, or good practices not required by the rules.

---

## What not to do

- Do not comment on personal style preferences that are not covered by the project rules.
- Do not repeat what the code already documents clearly.
- Do not flag the absence of a linked issue as a problem.
- Do not invent standards or rules that are not documented in the reference files.

---

## Final guideline

Prioritize relevant, actionable comments grounded in the project rules. Avoid generic or subjective remarks without justification. Quantity is not quality — one precise comment is worth more than five vague ones.
