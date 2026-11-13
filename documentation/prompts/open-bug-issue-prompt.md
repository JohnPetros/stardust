---
name: open-bug-issue
description: Create a factual GitHub bug issue in Stardust from an observed failure, with an approval gate and no technical diagnosis.
---

# Create Bug Issue

Turn an informal report into a single intake and tracking issue. Do not diagnose the cause,
create a Bug Report/Spec, implement, open a branch, commit, or open a PR.

Write the title, the body, the Grilling questions, and the justifications in Brazilian Portuguese
(PT-BR). Preserve technical identifiers, paths, URLs, and official label names.

## Required context

Read `AGENTS.md`, `documentation/rules/rules.md`, and `documentation/modules.md`. Read the applicable
milestone and the canonical PRD in `documentation/prds/` when the failure violates product behavior. Inspect source or
tests only to identify the app/module or to distinguish current behavior from intent; deep
diagnosis belongs to `create-bug-report`.

Use the actual product contract for Expected Behavior and preserve any checkbox/status.
If the expectation changes the intended behavior, stop and route to a feature/amendment.

## Mandatory PRD gate

Before the draft, identify the most relevant PRD:

1. derive module, actor, lifecycle, and violated behavior from the report;
2. search the canonical PRD in `documentation/prds/*.md` and the feature PRDs in `documentation/**/prd.md`;
3. search open and closed milestones via GitHub and follow links to versioned PRDs;
4. compare candidates by the same outcome, actors, capabilities, experience, and flow — not only
   by title words;
5. select a single main reference and the most specific `RP-*` available;
6. when no PRD governs the behavior, explicitly record
   `None — <search evidence and reason>` instead of omitting it or inventing an association.

If the search does not find a candidate PRD, before preparing the draft ask the user (in PT-BR):
“Qual PRD você considera mais relevante para este comportamento? Se nenhum se aplicar, confirme
que não há PRD.” (“Which PRD do you consider most relevant for this behavior? If none applies, confirm
that there is no PRD.”) Use the user's indication only after checking that it matches the reported module,
actor, outcome, and flow. If the user confirms there is no PRD, record
`None — usuário confirmou que não há PRD aplicável após a busca` (“None — user confirmed there is no applicable PRD after the search”; this text goes into the PT-BR issue, so it stays in Portuguese).

If the milestone and the canonical PRD in `documentation/prds/` diverge, resolve the authority before the draft. The search and
selection are mandatory even when the user does not provide a PRD or milestone.

## Mandatory Grilling gate

Run the interview protocol in [`interview-prompt.md`](interview-prompt.md) after the factual research and
before the draft. Model as a design tree only the decisions needed to delimit the symptom, the
expected behavior, the reproduction, and the issue context; do not turn the round into a technical
diagnosis.

An empty frontier and confirmation of shared understanding allow preparing the
draft, but they do not replace the approval gate for the exact version to be published.

## GitHub metadata

- repository: `JohnPetros/stardust`;
- required label: `bug`;
- labels `web`, `server`, and/or `studio` only when confirmed;
- use only existing labels; do not create labels;
- milestone only when product ownership is established;
- do not add the bug to Project 2 by inference.

## Title and body

Use a noun-phrase title, without a commit prefix, describing the symptom, for example
`Correção do redirecionamento após login` (“Fix the redirect after login”). The title and the body stay in PT-BR.

The `Contexto` (Context) and `Evidência` (Evidence) sections are optional: include each one only when there is useful
data provided by the user or found during the permitted investigation. Never invent values
to fill in an optional section.

The body template below is the literal issue body and stays in PT-BR (it mirrors `.github/ISSUE_TEMPLATE/bug-issue.md`).
Section order: `Problema` (Problem), `Comportamento esperado` (Expected behavior), `Reprodução` (Reproduction),
`Contexto` (Context), `Evidência` (Evidence).

```md
## Problema

<o que acontece e onde>

## Comportamento esperado

<o que deveria acontecer segundo a autoridade existente>

## Reprodução

1. <estado inicial>
2. <ação>
3. <resultado observado>

## Contexto

- **Módulo:** <módulo ou Não identificado>
- **Aplicação:** <web|server|studio|combinação|Não identificada>
- **Ambiente:** <local|staging|production|Não identificado>
- **Frequência:** <sempre|intermitente|observado uma vez|Não identificada>
- **Perfil afetado:** <perfil ou Não identificado>
- **PRD mais relevante:** <path do PRD canônico em documentation/prds/ ou None com motivo>
- **Requisito do PRD:** <RP-* ou None>
- **Jornada:** <JN-* ou Não aplicável>
- **Jira Shifu:** <SHI-* ou Não aplicável>
- **Milestone:** <URL ou None>

## Evidência

- <links, screenshots, gravações ou outra evidência fornecida>
```

When there is no reproduction, write `Ainda não reproduzível` (“Not yet reproducible”); keep unknowns
explicit and never guess them.

## Approval gate

Before writing to GitHub, present the title, body, labels, milestone, selected PRD,
requirement/anchor, and relevance justification. Publish only after explicit approval
of the current version. The approval authorizes only the issue.

After publishing, return the number, URL, title, labels, milestone, selected PRD/requirement, and
a summary of the failure. Recommend `create-bug-report` as the next diagnostic step, but do not invoke it without
being asked.

## Constraints

- exactly one issue unless a decomposition is requested;
- no root cause, affected files, correction guidance, acceptance, validation, or tasks;
- do not change product, PRD, or SDD artifacts;
- do not use `None` without running and summarizing the mandatory PRD search;
- do not invent reproduction, environment, or expectation.
