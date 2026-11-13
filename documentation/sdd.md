# Specification-Driven Development (SDD) at StarDust

## Goal

SDD turns a feature demand into an implementable Contract, a traceable execution and a
delivery closed by evidence in the PR. The whole flow happens in the same task:

```text
PRD, Issue, Report or direct demand
→ create-spec
→ Spec Reviewer + user review of the written Spec
→ implement-spec
→ integrated verification (automated + manual + visual)
→ Implementation Reviewer (+ Visual Reviewer in parallel, when there is UI)
→ check-spec-implementation + check:test-integrity + evaluation.md ready
→ conclude-spec → commit-code → open-pr → CI of the PR HEAD
→ Spec and Evaluation completed
```

SDD is not mandatory for maintenance that does not need a Contract. The main task
classifies the demand and uses direct maintenance when a Spec adds no authority,
controlled risk or useful traceability. `chore` and `refactor` issues with multiple flows,
CI/CD, integrations or migrations may originate a Spec, without a PRD or product milestone.

## Abbreviation convention

Use these abbreviations and namespaces in every new or revised SDD artifact:

| Abbreviation | Meaning |
| --- | --- |
| **SDD** | *Specification-Driven Development* — development driven by specification |
| **PRD** | *Product Requirements Document* — product requirements document |
| **RP-\*** | *Requisito de Produto* (Product Requirement) — requirement of the canonical PRD versioned in `documentation/prds/` |
| **JN-\*** | *Jornada* (Journey) — user journey |
| **RF-\*** | *Requisito Funcional* (Functional Requirement) — functional requirement of the local Spec |
| **CA-\*** | *Critério de Aceitação* (Acceptance Criterion) — verifiable criterion of the Spec |
| **AV-\*** | *Verificação Automatizada* (Automated Verification) — automated test, sensor or baseline gate |
| **MV-\*** | *Verificação Manual* (Manual Verification) — happy-path journey executed in a real browser or terminal |
| **VV-\*** | *Verificação Visual* (Visual Verification) — comparison of a Penpot board with the corresponding Playwright capture |
| **EV-\*** | *Evidência* (Evidence) — evidence that a criterion or gate was met |
| **ACH-\*** | *Achado de revisão* (Review Finding) — finding from a review, sensor or verification |
| **SHI-\*** | key of the Jira issue used to track a Shifu delivery |

The prefixes (`RP`, `JN`, `RF`, `CA`, `AV`, `MV`, `VV`, `EV`, `ACH`, `SHI`) are identifiers derived from the
original Portuguese terms and stay unchanged. The traceability relations are `RP/JN → RF → CA → EV`; `AV`, `MV` and `VV`
describe the verifications that produce an `EV` (the IDs are unique across the three types), and
`ACH` records problems found during review or verification. The Evaluation does not record PR
CI results: workflows, checks and build stay in the PR. `SHI-*`
is optional and only appears when there is a Shifu Jira issue.

Historical artifacts may keep old identifiers so as not to break
references. When revising an old artifact, preserve the crosswalk in the
historical revision and use the current namespaces for new requirements, validations,
evidence and findings.

## Authorities

Before starting or resuming SDD, read `AGENTS.md`, `documentation/architecture.md`,
`documentation/modules.md`, `documentation/tooling.md`, `documentation/rules/rules.md` and
all the Rules selected by the affected paths and behaviors. Also read the applicable canonical PRD,
Issue, Report, Design and real code.

| Authority                   | Governs                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `AGENTS.md`                 | safety, tools, environments and mandatory validations       |
| Architecture and Overview   | system boundaries, dependencies and responsibilities        |
| Selected Rules              | reusable implementation and testing conventions             |
| PRD                         | product outcome, actors, capabilities and experience        |
| Design and saved references | visual intent and UI states                                 |
| Tooling                     | real commands and environments                              |
| Spec                        | delivery-specific Contract                                  |

### Canonical PRD and milestone

The canonical product PRD is the document versioned in the repository at
`documentation/prds/<module>/<slug>.md`. That file is the product authority
for outcome, actors, capabilities, experience, `RP-*` requirements and `JN-*`
journeys; there is no requirement to publish or mirror it in Confluence.

When there is a product milestone on GitHub, it must point to the corresponding
local PRD. That link is the official index between product and SDD:

1. find the milestone associated with the demand;
2. follow its description and open the link to the canonical PRD in `documentation/prds/`;
3. use the content of that document as the product authority before creating the Spec.

Do not reconstruct the PRD from the Issue's title, label or path. If the milestone
has no valid link to a local PRD, record the gap and resolve the
traceability before starting the Contract. Open Specs must record the
path and revision of the PRD consulted, along with the relevant `RP-*` and `JN-*`.

A normative change to product, Architecture, a global Rule or ownership requires explicit
user approval and an update of the authority before the Spec. The current implementation never
silently replaces an authority.

### Required PRD structure

PRDs are written in PT-BR, like Pull Requests, so the section titles below are
the literal Portuguese headings, each followed by its English meaning in
parentheses. Every new or revised PRD must follow the canonical structure below,
using the `RP-*` and `JN-*` IDs defined in this documentation:

1. Header with title, `Disponibiliza para` (provided to) and `Navegação` (navigation);
2. Resumo Executivo (Executive Summary);
3. Problema e Oportunidade (Problem and Opportunity), including the source base
   and authority;
4. Público-alvo (Target Audience), usage context and Jobs to Be Done;
5. Objetivos e Métricas de Sucesso (Goals and Success Metrics), including
   validation limits and assumptions;
6. Requisitos de Produto (Product Requirements), with concepts/responsibilities
   and, for each `RP-*`, user needs, outcome, actors, business rules and
   experience rules;
7. Grafo de Dependências do Produto (Product Dependency Graph);
8. Jornadas (Journeys), identified as `JN-*`;
9. Fora do Escopo (Out of Scope), including decisions discarded during definition.

Competitive analysis, pricing and positioning are conditional discovery content:
they only enter when relevant to a product decision and
must be supported by sources. They are not a mandatory PRD section.
The canonical template and the creation flow must stay aligned with this
order. Existing PRDs outside this structure are legacy and must be
normalized at the next revision, without inventing missing content.

## Roles

| Role                    | Responsibility                                                                                                            | Constraint                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Main task (Orchestrator) | selects workflows, maintains Spec and Evaluation, decides order and delegation, integrates diffs, runs sensors, records evidence, publishes and routes failures | does not delegate the official verdict nor use a subagent's report as proof |
| Spec Reviewer           | runs a single gate before implementation, with retries of the same revision when needed                                   | read-only; only evaluates Architecture and Rules                     |
| Builder                 | implements a bounded scope of paths against an exact revision (Direct in the main context or siblings by ownership)       | does not edit Spec, Evaluation, PRD or Rules; uses the Penpot MCP for UI |
| Implementation Reviewer | reviews the integrated candidate against the Contract, Architecture, layer rules and the current evidence                 | read-only; does not fix nor produce the official verdict             |
| Visual Reviewer         | compares, in parallel, the required happy-path captures with current exports of the Penpot boards, row by row of the inventory | does not edit nor capture; reads Penpot only through the MCP; advisory |

Subagents are siblings created by the main task in the current task. No subagent creates another
agent or task. `create-spec`, `implement-spec` and `conclude-spec` are workflows, not roles.

## Durable artifacts

```text
documentation/prds/<module>/<slug>.md           # canonical versioned PRD of the module
documentation/features/<domain>/<feature>/
├── spec.md
└── evaluation.md           # created at the implementation kickoff
```

A behavior change after completion uses
`documentation/features/<domain>/<feature>/changes/<change>/`.

| Artifact             | Owns                                                        | Does not own                            |
| -------------------- | ----------------------------------------------------------- | --------------------------------------- |
| `spec.md`            | behavior, Design, Technical and Verification Contracts      | attempts and executed results           |
| `evaluation.md`      | commands, evidence, findings, history, comparisons and CI   | product or architecture authority       |
The Penpot file `stardust` is the canonical, editable visual source, inspected directly by the
Penpot MCP. The design is not extracted into feature artifacts. Screenshots of the implementation stay
in the ignored `test-results/` or in CI artifacts; the identifier, the comparison and the result
stay in `evaluation.md`.

Design handoffs, manifests and extracted reference images are no longer used: new Specs
do not create nor reference them. When materially updating a legacy Spec that cites them,
replace those references with Penpot `stardust` boards and preserve the revision history.
`design/stardust.fig` (Open Pencil) is a frozen legacy file, kept only as history: it is
no longer the source of truth and must not be opened or edited by new Specs.

## States

| Artifact    | States                                                      |
| ----------- | ----------------------------------------------------------- |
| Spec        | `draft`, `open`, `in_progress`, `completed`, `superseded`   |
| Evaluation  | `in_progress`, `ready`, `completed`                         |
| Evidence    | `pending`, `passed`, `failed`, `stale`, `not_applicable`    |
| Finding (`ACH-*`) | `active`, `resolved`, `accepted_non_blocking`, `superseded` |

Failures do not create extra states: the item stays `in_progress`, with a finding and next action.

## Grilling gate

After factual research and before writing or creating the ticket, apply the Grilling protocol
from [`grilling-prompt.md`](prompts/grilling-prompt.md). The protocol also applies, depending on the
artifact, to the creation or update of PRDs and Specs. The task builds the design tree, computes
the frontier, asks the whole current round in the `❓`/`➡️` format with recommendation and impact, recomposes the
frontier after each answer and does not guess dependent decisions.

For tickets, the frontier must cover actor/outcome, scope/exclusions, permissions, acceptance/failure,
technical boundary, validation, decomposition, sprint and assignee when not yet resolved. Researchable
facts are the task's responsibility; material decisions belong to the user. No
artifact or external mutation occurs while a material branch is open. Once the frontier is empty,
the task presents the shared understanding and obtains explicit confirmation; accepted decisions and
assumptions are recorded in the final artifact, not in the transcript.

## Optional intake

A GitHub Issue is tracking, not a technical Contract. The Issue may point to a milestone, but the
PRD is only identified after the canonical PRD path in `documentation/prds/` is resolved:

- `open-feat-issue` turns a milestone/PRD or approved request into an issue with Objetivo (Goal),
  Escopo da Entrega (Delivery Scope), Critérios de Aceitação (Acceptance Criteria), Validação (Validation), Rastreabilidade (Traceability) and Fora de Escopo (Out of Scope)
  (the issue itself and its section headings stay in PT-BR); after approval/publication, `create-spec` creates the Contract;
- `open-bug-issue` records symptom, expectation, reproduction and context without diagnosis;
- `create-bug-report` requires the approved bug issue, produces a durable diagnosis and recommends a direct
  fix or a Correction Spec according to risk and coordination.

Feature and bug issues require explicit approval before writing to GitHub. Approving an issue does not
authorize implementation, branch, commit, PR or product change.

Feature and bug issue workflows run PRD discovery before the draft; a feature issue requires a
main PRD, while a bug issue records the most relevant PRD/`RP-*` or `None` with evidence
of the search. A chore issue is technical maintenance independent of product and does not research, mention or
associate a PRD, PRD requirement or product milestone. A refactor issue only consults a PRD when
it needs to define the boundary of the behavior that must be preserved. The association is never
inferred from the title, label or path alone; a milestone only serves as a bridge after its single
link to the canonical PRD in `documentation/prds/` has been validated.

Before the draft, the issue workflows run Grilling: facts are researched and decisions are
walked through in rounds along the design tree's frontier. The confirmation of shared understanding
ends the interview but does not replace the explicit approval of the exact published version.

The two PRD workflows, prospective or retrospective, also run Grilling after the
research and before writing. The PRD is only created or updated after the frontier is empty and the
user confirms the shared understanding.

## Spec

`create-spec` researches the codebase directly before writing. Organize independent boundaries
as investigation lanes of the task itself, check the authorities and resolve conflicts by direct
inspection, without creating research agents.

The Spec is not written while a material product, technical, Design or validation choice exists.
Questions must bring evidence, recommendation, alternative and impact. The Spec
has exactly:

1. Context and scope;
2. Implementation Contract with `RF-*` and Given/When/Then `CA-*` criteria;
3. Technical Contract with baseline, path map, `Expected file tree` per app/package, runtime flow and declarations per layer;
4. Verification Contract with automated `AV-*`, manual `MV-*` and visual `VV-*` verifications;
5. documentation alignment, Rule Pack and revision history.

After research and before writing, `create-spec` runs Grilling until the frontier is empty and
explicit confirmation is obtained. Facts belong to research; only decisions not resolved by the
authorities are taken to the user.

Every relevant `RP-*`/`JN-*` must map to `RF-*`; every `RF-*` maps to
at least one `CA-*` and vice versa. Paths are exact and classified
as Create, Modify, Generate or Remove. The Spec does not contain execution results.

For UI, the Spec records the exact widget tree, loading/empty/success/error/recovery states,
keyboard, focus, responsiveness, reference frames in Penpot `stardust` and viewports.
Behavior inferred only from an image needs clarification. The visual detail stays in
Penpot `stardust`, inspected through the Penpot MCP; the Spec remains the authority for
product, scope, behavior and validation. A sound Spec goes straight from `draft` to the independent
review by the Spec Reviewer, before any implementation.

Before the review, `create-spec` performs a manual integrity check of the structure, the IDs, the
traceability and the canonical path map; it does not replace the Spec Reviewer. The format of the
path map is validated afterwards, against the diff, by `check:spec-implementation`.

After the integrity check, and before `implement-spec`, the main task
activates exactly one read-only Spec Reviewer with the exact revision, `architecture.md` and the
Rule Pack of the affected layers. The Reviewer only checks boundaries, dependencies, ownership
and adherence to the Rules; it does not evaluate product, Design, criteria or validation. The main task verifies
each finding, fixes the same Spec and resumes the Reviewer before implementation. The Spec only moves to
`open` when that review is `clear` and no verified blocking finding remains;
then the flow proceeds to `implement-spec`. A later amendment invalidates the result and requires
a new review before implementing. The revision history records the revision, the result and the verified
resolutions, without incorporating the raw report.

## Design Contract

When the delivery has UI, the canonical visual source is the Penpot file `stardust`, inspected
directly by the Penpot MCP by whoever creates, implements and reviews the Spec. There is no extraction of the
design: the Spec does not create `design/handoff.md`, does not export images to the feature and does not copy
tokens, measurements or visual recipes.

The Spec's Design Contract (`## Design Contract` subsection of `Implementation Contract`, UI only) records, at a minimum:

1. the relevant frames, identified by the page and the name of the board or component (the name is the
   contract; IDs may change if the board is recreated);
2. the state, variant and viewport of each frame, with the related `RF-*`/`CA-*`/`VV-*`;
3. allowed divergences, approved extensions, exclusions and states with no canonical frame;
4. the visual comparison requirements tied to `CA-*` and `VV-*`.

The default precedence is: the repository's design system and tokens; behavior of shared
components; Penpot `stardust` frames and the tokens bound to them. A visual value
without a variable does not authorize a new color, measurement, component, icon or CSS without a token, Rule or recorded
decision. Semantic fallbacks and accessible adaptations must be declared in the Spec;
material divergences without a traceable decision keep the Spec open.

If the Penpot MCP is not available, or the Penpot file `stardust` is not connected to it, the
inspection or comparison that depends on the design is blocked and recorded as such; do not
replace the frame with assumptions.

`evaluation.md` records implementation screenshots, comparisons, observations, `EV-*`, `ACH-*`
and the final state. If a change alters the visual intent, that is a Contract change:
return the Spec to `draft`, increment the revision, update the Design Contract and invalidate the affected
evidence.

## Implementation and living evidence

`implement-spec` is the only implementation entry point and always runs the Builder Direct in the
main context. `evaluation.md` is the only execution ledger: progress, evidence,
findings and next action.

No source, test, migration or generated artifact is changed before a bounded assignment
is recorded in the Evaluation with revision, RF/CA, paths, Rules and exits. The Spec is
compared with the file tree, contracts, states and exclusions before each handoff and after
each fix. A conformance failure, an unavailable manual/runtime scenario or stale evidence keeps
the work `in_progress` and blocks advancing to `ready`.

Before the sensors and the Reviewer, run `pnpm run check:spec-implementation <spec> --base <base-commit>`.
This preflight requires the canonical `Path | Change | ...` map of the `Technical Contract` and
confirms that each `Create`, `Modify`, `Generate` or `Remove` matches the diff and the
filesystem. It is structural and does not replace tests, sensors, Reviewer or Evaluation.

Before changing source or tests, materialize `evaluation.md` through the canonical Contract defined
in `implement-spec`, record revision, assignment, paths, Rules, criteria and exits, and move the Spec to
`in_progress`. The main task inspects each diff, runs the official sensors and updates the
Evaluation after each change to code, test, browser, migration, artifact or documentation.
Builder and Reviewer reports are input, not evidence; the main task verifies the integrated
candidate and records the commands, results, freshness and evidence IDs.

For each affected group of HTTP routes, the corresponding `.rest` file in `apps/server/rest-client/`
is part of the scope and must contain current examples for all the controller's routes, without secrets.
`use-*.ts` behavior hooks in scope must have tests colocated in `tests/use-*.test.ts`,
unless there is an explicit Rule Pack exception recorded in the Evaluation.

For frontend, automated tests do not replace the mandatory manual smoke test of the real happy path
defined in `AGENTS.md`: local service, login and protected route when applicable, main
result and status of the essential endpoints. Do not manually exercise error/loading/recovery states.
Record console, `pageerror`, `requestfailed` and
detailed responses only to diagnose an unexpected failure; a screenshot is necessary when the
UI changes or the visual comparison requires it. After a fix, repeat only the affected happy path. For
Server and database, mocks do not replace real request/response, authorization, tenant and persistence in
Supabase Dev when applicable.

After integration, an Implementation Reviewer reviews the integrated candidate. For design-backed
UI, the Visual Reviewer runs in parallel on the same candidate and the already existing captures,
with one disposition per row of the Evaluation's manual/visual inventory; there is no
third serial Reviewer. The Reviewers consume the recorded results and do not rerun green
suites. The main task verifies the findings and consolidates the verdict, `ACH-*` and
evidence in `evaluation.md`.

Evidence is invalidated by the claim and the affected dependencies, not by commit age:
a new SHA or a ledger edit, by itself, does not invalidate proof of unchanged behavior.
The Evaluation keeps a factual Handoff section (revision, candidate, unfinished criteria,
dirty paths and ownership, processes and ports started, blockers and next action) so that another
agent can resume from the Spec, the Evaluation and the diff.

Evidence prior to the last affected change becomes `stale`. The Evaluation only moves to `ready`
when all `CA-*`, sensors, `AV-*`, `MV-*`, `VV-*`, `EV-*`, visual comparisons and blocking `ACH-*`
are current and resolved.

## Fix versus Contract change

| Class                     | Action                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Implementation fix        | keeps the revision; records a finding; reopens work/evidence; resumes the Builder; reruns only invalidated exits                    |
| Contract change           | pauses; Spec returns to `draft`; updates the authority; increments the revision; reconciles Design and Evaluation; resumes `implement-spec` |

A test, browser, console, runtime, migration, CI or visual comparison error within the Contract
is an automatic fix. No authorization is requested to make the implementation conform. Ask
only when a product, authority, environment, security or scope decision is missing.

## Conclusion, PR and CI

`conclude-spec` requires the Spec `in_progress`, the Evaluation `ready`,
current conformance and no blocking evidence. With authorization for commit/push/PR:

1. repeats preflight and conformance on the current candidate;
2. invokes `commit-code` for intentional commits;
3. invokes `open-pr` to create or update a ready-for-review PR;
4. waits for each applicable workflow on the PR's current HEAD;
5. records name, result, URL and SHA in the Evaluation;
6. on failure, routes immediately to `implement-spec` or an amendment, republishes and repeats CI;
7. after green CI, marks the Spec and Evaluation as `completed`.

Before marking the artifacts as `completed`, `conclude-spec` analyzes all the findings,
warnings and failures of the delivery and identifies causes that may recur. Gaps in process,
Architecture, tooling or Rules must update the corresponding normative documentation; reusable
implementation errors must be recorded as anti-patterns in the layer's Rule. Each
preventive action, changed document or justification of non-applicability is recorded in
`evaluation.md`. Normative changes that require a user decision keep the Spec open until
approval.

Do not use a push run, an old SHA, a missing check or a local build as a substitute for the PR's CI.
Do not merge or deploy without an explicit request. Later feedback on an open PR may reopen the
same Spec; after merge, a defect uses a Bug Report and new behavior uses a change Spec.

## Official sensors

After a code change, run the detectors from `AGENTS.md` in the affected scope:
`check:code` and `check:types` in the changed workspaces and in the consumers, and `test:unit`
with the test files verified in the code. Add `check:architecture`, integration tests
(only the affected files or scenarios), generation, browser, Supabase Dev and
build according to Rules, Spec, paths and risk. Run `pnpm run check:test-integrity` after
adding, moving or removing tests. The coverage ratchet
(`pnpm run test:coverage -w <workspace>` and `pnpm run check:coverage <workspace>`) measures the
whole workspace and runs in the CI of `@stardust/core`, `@stardust/server`, `@stardust/backoffice` and
`@stardust/web`; run it locally only when the demonstrated impact spans the
workspace, when the Spec requires it or when the user asks. The checks fail if any
metric falls below the baseline versioned in `coverage-baseline.json`. The
`check:test-integrity` requires pairing
only for controllers, jobs, use-cases, entities/structures/aggregates,
hooks, views/widgets, Web routes (`app/page|layout|route`) and Server routes
(`tests/routes`), RPC actions and AI tools; barrels, generic services/repositories,
generated types/code, fixtures, mocks and test infrastructure are excluded and
listed in the JSON result. Tests must live in `scripts/tests/**` or in a
`tests/` colocated with the allowed target (domain, use-case, controller,
job, hook, widget/view, Web/Server route, RPC action or AI tool); the others
fail with `forbiddenTestPaths`. `@stardust/lsp`, `@stardust/validation`,
`@stardust/email` are outside this quality ratchet.

Record in `evaluation.md` the exact commands, the files and scenarios, the counts, the result
and the evaluated candidate. An empty or ignored selection does not pass just because the command finished
successfully. Review, continuation and conclusion reuse the non-invalidated evidence: a new commit
or a ledger edit alone does not justify another run. Preserve the original result of
failures and of full runs; a focused fix proves only the scope it ran. `format`
applies formatting but does not prove behavior.
