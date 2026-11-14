---
name: create-spec
description: Create or review an implementable Spec, compact or full, from a PRD, Issue, Report, or direct request.
---

# Create Spec

Act as the SDD Orchestrator. The main task conducts the authoring in the current task; do not
create a new thread. Translate a known version of the canonical product requirements into a
bounded and testable implementation Contract. Execution (order, decomposition,
delegation) belongs to the main task in `implement-spec`: do not put task breakdown
or an execution ledger in the Spec. Expected and scoped file trees
describe the affected boundaries; the ordinary organization of helpers remains flexible.

Use a Spec only for a delivery related to a feature. Direct maintenance is enough for
formatting, tooling, mechanical refactors, and repairs covered by an unchanged Contract. A
change to product behavior, public contracts, persistence semantics, events
between modules, or user journeys requires a new or amended Spec. Preserve unrelated
work.

## Classification

Identify the origin: `prd`, `issue`, `report`, or `direct-request`. Define
`scope` with workspaces, directories, or files. Use compact mode for a cohesive
outcome with stable boundaries and low risk; use full mode when there is material
risk in security, concurrency, migration, persistence, multiple modules/flows, or
integrations. Scale the detail by risk, not by file count. The compact Spec
keeps all sections, with concise scope, only the affected consequent contracts, and
sufficient focused proof; omit empty optional detail, with no minimum size. Full mode
adds detail only for the identified risks and guarantees.

## Sources

`source` is a list and may contain multiple references associated with the same
Spec. It is allowed to associate an Issue and a PRD simultaneously, in addition to a Report or
direct request when applicable. Detect all the sources given or
associated, then fetch and read each of them. If a PRD is associated with the Issue,
reading it is mandatory; the absence of a PRD does not block a Spec originating
from an Issue. In case of conflict, record the divergence and resolve the ambiguity
before opening the Spec.

Read all the sources of the request, `documentation/architecture.md`, applicable Rules,
`documentation/sdd.md`, and the real paths of the codebase. Use CodeGraph, Context7, Penpot, Playwright, or Supabase when
applicable.

Resolve material ambiguities before writing or modifying `spec.md`. The clarification
gate is a hard stop: do not encode a material decision in a draft only to ask the
user afterwards. Questions must bring evidence, recommendation, alternative, and impact.
Write only when all choices are resolved by the authority or explicitly accepted
as a documented assumption.

## Mandatory Grilling gate

Run the interview protocol in [`interview-prompt.md`](interview-prompt.md) after the factual research and
before writing or changing the Spec. Model as a design tree only decisions not yet resolved
by the sources, Architecture, Rules, Design, or codebase. Each question carries evidence,
alternatives, impact, and a recommended answer.

An empty frontier and explicit confirmation of
shared understanding are prerequisites for drafting. If a new material gap emerges
during the integrity check or the review, reopen the Grilling before continuing.

## Design review in chat

After the Grilling frontier empties and before drafting, validate the design with the
user in short sections in chat, scaled to risk: outcome and scope; ownership,
components, and public contracts (including the expected file tree of the affected
Server/Web boundaries); runtime flow, persistence, and failure handling; UI composition
and design references, when applicable; and verification. For consequent architectural
choices, compare the viable alternatives anchored in Stardust (usually two to
four) with a recommendation and the trade-offs of compatibility, ownership, consistency, and
recovery; do not invent alternatives when the existing authority already resolves the choice
nor add speculative capabilities. Use lists and code blocks, not tables, in the
chat sections. Explicitly ask whether each section is correct before continuing;
answering the questions of a section does not approve it, and a section reopened by a later
decision is re-presented as a delta. Explicit approval of the complete design allows
writing the Spec; it does not approve the written Spec nor authorize implementation. Record the
chosen approach and the justification in the existing Technical Contract: `spec.md` is the
written design artifact, with no second design document.

## Evidence and boundary principles

- Every cited path must exist; a creation must be declared as `Create` in the
  canonical path map.
- Every creation or change must be backed by a source, Architecture, Rule,
  similar implementation, or an explicitly recorded technical decision.
- Preserve the existing boundaries between authentication, authorization, ownership,
  transport, and domain. Data derived from the session does not belong in the client
  payload; HTTP, Supabase, and SDKs do not cross into the Core.
- Do not introduce cross-domain coupling, schema, provider, or integration without
  precedent or a verifiable architectural justification.
- When there is a migration, specify backfill, constraints, indexes, FKs,
  deletion behavior, RLS/grants, and effects on types/mappers/repositories.

## Research and synthesis protocol

Research only apps, packages, and layers reached by the scope. Before drafting
the solution, consolidate:

| Section        | Content                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| Mapping        | real paths, contracts, dependencies, and similar implementations         |
| Data flow      | current state, producers, consumers, transport, and required change      |
| Attention      | risks, authorization, concurrency, security, performance, and couplings  |
| Gaps           | expected elements not found and decisions without sufficient evidence    |

In multi-app flows, declare who exposes, who consumes, the transport, and the format
of the contract. Use codebase tools for local evidence, official
documentation for external APIs, Penpot for design, Playwright for browser
behavior, and Supabase for schema/data when applicable. The project's Architecture and
Rules prevail over generic recommendations from external tools.

When there are two or more independent lanes, organize them as bounded investigations of the
task itself, with explicit questions, paths, limits, and synthesis format. Research each boundary
directly, resolve conflicts by direct inspection, and verify consequential claims. Do not create
research agents.

## Design and Penpot references

When the scope involves frontend or UI, create the `## Design Contract` subsection inside
`Implementation Contract` (omit it when there is no UI) and declare:

- the canonical visual source, the Penpot file `stardust`;
- the page and the name of each relevant board or component. Do not use IDs as a
  reference: the name is the contract and the ID changes if the board is recreated in Penpot;
- the state, variant, and viewport represented, such as loading, error, empty,
  content, open/closed, desktop, or mobile;
- the mapping between each visual reference and the respective `RF-*`/`CA-*`;
- divergences between design, requirements, Architecture, Rules, and current
  behavior, indicating the precedence adopted and the expected alignment.

Use this table as the core of the subsection, one row per required surface/state/viewport:

```md
| Surface / route | State / viewport | Penpot page / board / components | CA / VV | Allowed deviations |
| --- | --- | --- | --- | --- |
| <affected surface> | <exact state and viewport> | <real names> | CA-01 / VV-01 | <accepted differences or none> |
```

Map the affected widgets to existing semantic tokens and variants of shared
primitives, and identify the UI preserved outside the change.

### Design-to-code rule

The declared frames are the canonical visual source for the code. The Spec must
treat as part of the Contract the preservation of the composition, hierarchy,
dimensions, spacing, typography, colors, borders, elevation, icons/assets,
density, variants, and observable states of each frame. Semantic HTML,
accessibility, interaction, data, and responsive reflow may adapt the
implementation, but do not authorize replacing, simplifying, or reinterpreting the
design.

Every divergence must be linked to the frame and the `CA-*`, have a verifiable
reason, and be approved as a decision or amendment before `open`. A missing,
contradicted, or unapproved added frame is blocking. Do not accept generic
CSS as an approximation, and do not invent a file, frame, or visual detail when
there is no canonical source; record the absence explicitly.

Inspect the references with the Penpot MCP; do not deduce visual details only from
screenshots or descriptions. Do not extract the design into other artifacts: do not create
`design/handoff.md`, do not export images to `design/`, and do not copy tokens, measurements, or recipes
into the Spec. Builders and Reviewers inspect the same frames directly through the Penpot MCP.
The Spec records only the relevant frames, states, variants, and viewports, their links with
`RF-*`/`CA-*`/`VV-*`, and the approved divergences. If the solution requires a change to the design,
include the Penpot `stardust` in the scope and specify the affected boards. If there is no canonical
visual source, record that explicitly and do not invent a file or frame.
A material divergence must be resolved before the Spec reaches `open`.

Frontend validation must require both the comparison with the frames in
Penpot and the exercise of the real flow in Playwright, covering the specified states and
viewports. Penpot validates the visual reference; Playwright validates
runtime behavior. Neither of them replaces the automated tests.

When runtime visual validation is mandatory, write that
explicitly in the Contract in one or more `CA-*`: declare the viewports, states,
interactions, route, and the required evidence (for example, a screenshot of the dialog
open, loading, error, empty, content, and closed, or an equivalent visual comparison). For each frame, also declare the reference dimension,
the state, the variant, and the expected comparison with the Web.
Do not use only ambiguous expressions such as “verify visually”. Always distinguish
the evidence of the reference in Penpot from the evidence of the real browser: the former
confirms alignment with the canonical design; the latter confirms rendering,
responsiveness, and observable behavior at runtime.

## File and Contract

Create `documentation/features/<domain>/<feature>/spec.md` with:

```yaml
---
title: <title>
status: draft
revision: 1
source:
  - type: <prd|issue|report|direct-request>
    ref: <path of the canonical PRD in documentation/prds/ or other source>
    revision: <source revision when applicable>
    requirements: [RP-01]
    journeys: [JN-01]
scope:
  - <workspace|directory|file>
last_updated_at: YYYY-MM-DD
---
```

The body must contain exactly five first-level sections (listed below the table).
Some have mandatory named subsections, when applicable:

| Section | Named subsection |
| --- | --- |
| `Implementation Contract` | `## Design Contract` — only with UI |
| `Technical Contract` | `## Expected file tree` — tree per app/package; `## Runtime Flow` — runtime flow (the path map and the per-layer detail live in the same section) |
| `Verification Contract` | `## Shared setup`, followed by `## Automated`, `## Manual`, and `## Visual` |

The five first-level sections are:

1. `Context and scope`;
2. `Implementation Contract`;
3. `Technical Contract`;
4. `Verification Contract`;
5. `Documentation alignment and revision history`.

Do not create `evaluation.md` at this stage; `implement-spec` materializes it at kickoff, before the
first feature edit. The Spec owns expected behavior; the Evaluation owns
execution and real results.

Use `RP-*` and `JN-*` to trace the Spec to the versioned canonical PRD and to the user
journeys. Use `RF-*` and `CA-*` as mandatory Spec IDs; record `AV-*`
for automated verifications, `MV-*` for manual verifications, `VV-*` for visual
verifications, and `EV-*` for the expected evidence. Use `SHI-*`
when there is a Jira Shifu issue:

```md
| CA    | RF    | Given        | When   | Then      | Expected evidence    |
| ----- | ----- | ------------ | ------ | --------- | -------------------- |
| CA-01 | RF-01 | precondition | action | result    | test/browser/sensor  |
```

Security, performance, and architecture enter as acceptance criteria or
technical constraints. Do not use `RN-*`, `RNF-*`, `RA-*`, `harness:evidence`
comments, own gates, or baselines.

Specify the methods of every interface, port, repository, or service created or
changed by the solution, including name, input, and return. Do not delegate to the Builder
the definition of these signatures.

The Spec's `Contract` is the source of truth for the Builder. Each requirement,
constraint, and acceptance criterion must be implementable and verifiable without the
Builder needing to infer missing behavior. `evaluation.md` records the real result
of the evidence for each `CA-*`, but does not replace the requirement in the Contract.

## Canonical map of affected paths

The `Technical Contract` must contain a map of affected paths, grouped by
application and layer. Use one table per affected application/layer combination,
always following this order in the first two columns:

```md
| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `packages/core/src/...` | Modify | `<exact symbol>` | `<runtime guarantee>` | `<collaborators>` | `<test boundary>` |
```

The columns after `Change` may vary by layer, but `Path` must
be the first field and `Change` the second. Each affected path appears exactly
once in the entire `Technical Contract` and uses only `Create`, `Modify`,
`Generate`, or `Remove`. Use `Create` for a new file, never `new file` in the
state column. Write the `Change` value without backticks (`Modify`, not
`` `Modify` ``): `check:spec-implementation` only recognizes plain text and, with
backticks, rejects the Spec for not finding path rows. For `Generate`, declare source, command/input, and output; do not
contract manual editing of a generated artifact.

Paths must be relative to the repository root, exact, normalized, and
verified on the filesystem. Unchanged dependencies are evidence or
consumers, not rows of the map. The checker
`pnpm run check:spec-implementation <spec>` validates this map against the Git
diff and fails on duplicates, inconsistent classification, a missing path, or an
undelivered change. Legacy Specs with an inventory in prose or in the
`Layer | Path and state` format must be normalized before being implemented;
the checker does not interpret ambiguous formats.

## Expected file tree

Every `Technical Contract` includes the `## Expected file tree` subsection, in compact and
full modes: a `text` block tree **per affected app/package** (`apps/server`, `apps/web`,
`apps/backoffice`, `packages/core`, etc.). A tree only in chat, or only the path map in a
table, does not replace it. The canonical map remains the source verified by
`check:spec-implementation`; the tree shows structure and ownership, and must contain
exactly the same paths as the map.

- Scope: files created, modified, generated, or removed and the directories that contain them.
  Use paths relative to the repository root and align the marker columns.
- Markers: `[N]` (`Create`), `[M]` (`Modify`), `[G]` (`Generate`), `[D]` (`Remove`), and
  `(unchanged)` only for a neighbor that clarifies ownership or composition. Do not list
  unchanged private helpers nor exhaustive catalogs.
- Core/Server layers: entities, structures, use-cases, ports, controllers, routers, jobs,
  repositories, mappers, migrations (never invent migration names), and the allowed tests
  in colocated `tests/`, plus the route group's `.rest` in
  `apps/server/rest-client/`.
- UI: the real ownership hierarchy: page/layout, reused components, child widgets
  nested under the owner, each `index.tsx` (Entry Point), `*View.tsx`, the colocated
  `use-*.ts` hook, and the allowed `tests/`. Do not stop at a top-level page or component when the
  approved composition has children. Components reused by more than one owner live at the
  appropriate module boundary. Explain the shared state and the local interaction
  responsibilities without duplicating state. Do not fabricate hooks or tests for purely
  structural children (View without behavior).
- Domain contexts and hooks: include the affected contexts with concrete file names
  (provider entry, value type, provider hook, consumer hook, and the allowed test of the
  provider hook) and the domain query/action hooks, without a generic hooks directory.
  Explain where the context is mounted, which branches share its state, and the direction between
  provider, operation hooks, and widget hooks; avoid cycles and duplicated state. Query/action
  hooks have no dedicated test files: point to the consumer or route that covers them
  in the `Verification Contract`.
- AI: with AI composition affected, show agent, structured output, workflow, Core port,
  model/provider adapter, and composition that belong to the slice, with the allowed tests,
  separating the included capabilities from the deferred ones.
- Reconcile the tree with the approved names and composition, the declarations, the path map,
  the Design Contract, and the paths of the `Verification Contract` before presenting the Spec. Private
  helpers and ordinary decomposition remain implementation choices: changing them, alone,
  does not require an amendment.

```text
apps/server/
├── rest-client/<module>/<group>.rest                                  [M]
├── src/<layer>/<module>/
│   ├── use-cases/get-example-use-case.ts                              [N]
│   └── tests/get-example-use-case.test.ts                             [N]
apps/web/
└── src/ui/<module>/widgets/pages/Example/
    ├── index.tsx                                                      [M]
    ├── ExamplePageView.tsx                                            [M]
    ├── useExamplePage.ts                                              [M]
    └── ExampleList/
        ├── index.tsx                                                  [N]
        └── ExampleListView.tsx                                        [N]
```

## Technical detail per affected layer

Include only layers that are really affected. For each row of the canonical map,
state responsibility, dependencies, signature/shape, similar reference, and
test evidence. Do not write implementation.

- Core/handlers/services/repositories/providers/jobs: injected dependencies,
  methods, request/response, errors, and effects.
- Validation/routes: schemas, server-derived fields, middlewares,
  authorization, and response codes.
- Database: migration, backfill, constraints, indexes, RLS/grants, mappers, and
  generated types.
- UI: Entry Point, View, Hook, props, dependencies, child widgets, and
  loading/error/empty/content states, plus responsiveness and accessibility.
- Queue/integrations: event, idempotency, retry, observability, composition at the
  edge, and separation between persistence and external effect.

## Runtime Flow

Every `Technical Contract` ends with the `## Runtime Flow` subsection. Explain the affected
runtime interactions: real entry points, trusted actor context (session, not the
client payload), validation, domain decisions, transactions, persistence, side effects,
visible result and cache, and the relevant guarantees of rejection, concurrency, retry, and
recovery. In a complex cross-app flow, declare who exposes, who consumes, the transport, and the
format of the contract. Use the diagram below only when it reduces material ambiguity.

### Optional technical diagram

Include a Mermaid diagram only when it reduces material ambiguity in
a solution that involves at least one of these conditions:

- three or more participating layers, applications, or systems;
- asynchronous processing, queue, outbox, retry, or external effect;
- a transaction followed by publication or a non-transactional integration;
- multiple actors, authorization paths, or ownership rules;
- states, transitions, or concurrency that are hard to understand linearly.

Choose the smallest suitable diagram type:

- `sequenceDiagram` for sequence between apps, API, database, queue, and providers;
- `flowchart` for decisions, forks, and processing;
- `stateDiagram-v2` for lifecycle and state transitions;
- `erDiagram` for persistent relationships relevant to the Contract.

Do not include Mermaid in a simple flow just to fill in the template. The diagram
complements the text and does not replace Contract, methods, paths, acceptance
criteria, technical decisions, or error behavior. Use names consistent with
the Spec's contracts and keep the syntax renderable in Markdown.

By default, explain, within the Technical Contract, each new and consequential concept of the
project: a name in the file tree or a declaration, alone, is not enough. For each
one, declare purpose, owning module/layer, inputs and outputs, relations with existing
concepts, source of truth and state ownership, and the applicable guarantees of
lifecycle, failure/recovery, and authorization, linking the explanation to the declarations, the
runtime flow, and the sensors without duplicating those contracts. For new hooks, contexts, and
realtime components, document input/return contracts, consumer and dependency direction,
connection/subscription ownership, event validation and ordering, reconciliation/reconnection, and
cleanup of stale callbacks; distinguish transport state from domain state. Define
unfamiliar terms and use a small concrete example when it helps. These explanations
clarify the approved design; they do not authorize new product behavior or integrations.
Ordinary private helpers and unchanged concepts need no inventory.

## Verification Contract

The `Verification Contract` (name in legacy Specs: `Validation Contract`) uses three categories,
each as a `##` subsection with individually named `###` blocks, instead of long tables
of commands and procedures. Each `CA-*` maps to sufficient concrete proof; it does not need to use
all three categories. Give each distinct observable result its own block (complementary
use-case/controller/widget/job proof may support the same result). Explain why a category is not applicable instead of keeping empty blocks.

| Category | Prefix | Content |
| --- | --- | --- |
| `## Automated` | `AV-*` | automated tests and gates: unit/component, integration, static, and baseline |
| `## Manual` | `MV-*` | concise happy-path journey, executable by the agent, in a real browser or terminal |
| `## Visual` | `VV-*` | comparison of a Penpot board with the corresponding Playwright capture |

The `AV`, `MV`, and `VV` IDs are unique across the three categories and among themselves. Real results
belong to the Evaluation (`EV-*`); the PR's CI is not recorded in the Evaluation. Keep existing IDs and
mappings on continuation; split an old group only with explicit mapping and
new proof where the historical result is not enough. Block in the format below:

```md
## Shared setup

<environment/URLs and health; actors and credential resolution; data and initial state; isolation, reruns, and cleanup; source paths of the fixtures>

## Automated

### AV-01 — <observable result>

**Criteria:** CA-01
**Target / boundary:** <exact test file and boundary (use-case, controller, widget, job)>
**Command:** <real command, working directory, and verified selector>
**Approval condition:** <assertions, intended selection, and limits of the evidence>

### AV-02 — Applicable baseline checks

**Scope:** <affected apps/packages and consumers>
**Checks:** <sensors required by Tooling and Rules; feature exceptions>
**Approval condition:** <required gates pass, static dispositions have real proof, and the intended tests execute>

## Manual

### MV-01 — <concise happy path executable by the agent>

**Criteria:** CA-01
**Tool / setup:** <Playwright or terminal; shared setup and differences>
**Procedure:** <ordered, narrow actions against the intended runtime boundary>
**Approval condition:** <final URL, visible/persisted effects, `2xx` requests, console, keyboard/focus, narrow viewport, and cleanup, as applicable>

## Visual

### VV-01 — <surface, state, and viewport>

**Criteria:** CA-01
**Reference / setup:** <page, board, and components of the Penpot `stardust`; exact viewport; related MV>
**Capture / comparison:** <current Penpot MCP export compared with the corresponding Playwright capture; reuse the capture from a current MV when possible>
**Approval condition:** <visual properties compared and accepted deviations>
```

Content rules:

- Separate the baseline gates and reference the applicable Tooling and Rules checks, including the
  affected consumers. Define separate obligations/dispositions for types (`check:types`),
  lint/code (`check:code`), and complexity, with exact paths for lint and affected
  configured projects for types. Complexity identifies its checker and real limits; a required
  quantitative metric that is unavailable stays `Blocked`. Mark nonexistent
  files/scenarios as planned and verify test names before prescribing filters.
- Declare the applicable sensors: `format`, `check:code`, `check:types`, `test:unit`,
  `check:architecture`, and `test:integration`, with the exact test files verified in the
  code (local execution is scoped; see `documentation/tooling.md`). `test:coverage` and
  `check:coverage` run in CI and only enter the Spec when the demonstrated impact spans the
  workspace; both respect `coverage-baseline.json`. `check:dead-code` is not official. Checks
  and build are also run by the PR's CI.
- Record the executable setup of related checks only once in the
  `## Shared setup` subsection (before `## Automated`); each AV/MV/VV block references the setup and cites only the
  differences. Inspect accounts, fixtures,
  seeders, manifests, and configuration defined in the source before prescribing: environment/URLs and
  health, route/function registration, real/mocked/disposable services; actors, permissions, and
  resolution of private credentials from exact paths (`seed-accounts.json`,
  `export-*-app-e2e-env.mjs --seed`); required data relations/statuses, initial-state
  assertions, and planned fixture fixes; isolation, rerun dependencies, and cleanup
  of own resources. Drafting the setup does not require running tests nor authorize resetting/reseeding
  shared data. Distinguish fixing the fixture source from applying it. Missing executable
  setup is a gap in the Contract.
- Automated covers authorization, isolation, persistence, contracted finite combinations,
  limits, failure/recovery, and concurrency at the allowed boundaries. For unbounded domains,
  specify equivalence classes and boundary values. Respect the test-integrity
  Rules: a direct test of an excluded/indirect source or a forbidden directory is a
  blocking defect of the Contract. Confirm that the intended tests execute; skip and empty selection are not
  approval. Never invent coverage percentages nor a generic aggregate command.
- Use focused unit/component and static feedback during construction. After integration,
  run the affected integration selections (changes, consumers, and dependencies) with a
  runner from the main task. Select tests only for changes in scope and directly
  affected consumers; broaden only given demonstrated impact or a concrete gap, recording
  why. A complete local suite requires a scope that covers it or an explicit user request.
  Review and conclusion reuse the current unaffected proof.
- Manual are concise happy paths; automated tests hold the systematic negative,
  failure/recovery, and concurrency matrices. Mocks do not prove required real
  authentication and persistence journeys. Follow `AGENTS.md` (manual Frontend verification).
- Visual names the page, board, and related components, state, viewport, compared
  properties, and accepted deviations. Capture during the linked MV when possible and inspect the
  images: saving a screenshot is not a visual approval. Keep runtime evidence in the ignored
  `test-results/` or CI artifacts; record paths and results in the Evaluation, without
  new evidence folders in the feature.

Legacy Specs with `VM-*`/`CI-*` tables and the subsections "Testes automatizados" (Automated tests), "Comandos" (Commands), and
"Validações manuais" (Manual validations) remain valid as history; normalize to this format at the next
material revision.

## Technical decisions and clarification

Record each material decision with evidence, alternatives considered, reason,
trade-offs, and impact on the Contract. Do not treat the absence of evidence as freedom
of implementation.

Before `open`, bring to the user product or architecture decisions whose material
impact cannot be resolved by the sources and Rules. Incorporate the answer as a
decision of the Spec. Only what the user explicitly leaves open remains in pending
questions; a material pending item prevents `open`.

The Spec does not contain test code, detailed fixtures, or mock implementation,
but must declare scenarios, coverage layer, sensors, and expected evidence
for each `CA-*`.

Before `open`, do a manual integrity check: the frontmatter and the five first-level
sections are complete; the `## Expected file tree` exists per affected app/package and
matches the canonical path map; no placeholders remain (`TBD`, `TODO`, `FIXME`); every
relevant `RF-*` has a `CA-*` and every `CA-*` points to an existing `RF-*`; each `CA-*` is
covered by at least one `AV-*`, `MV-*`, or `VV-*` verification (unique IDs, each block under the
correct category and with **Criteria** and **Approval condition**); each `CA-*` has an
observable result, verification method,
viewport/state when applicable, and responsible path or layer; each visual
requirement has separate evidence for Penpot and Playwright when both are
necessary; each UI change declares the Entry Point/View/Hook structure; and all
applicable sensors are named. If a requirement appears only in the
Evaluation, move it to the Contract before the review.

For UI, the Contract must contain a visual reference matrix and a structural
audit matrix. The first relates frame, viewport, state, route,
Penpot/Web evidence, relevant dimensions/anchors, and approved divergences. The
second relates each changed widget to
`index.tsx`, `*View.tsx`, Hook, and applicable rule. The absence of either
of these matrices prevents the `open` state when frontend is in scope.

After the integrity check, and before `implement-spec`, activate exactly one read-only
`spec-reviewer-agent` with the exact revision, `architecture.md`, and the Rule Pack of the
affected layers. The Reviewer verifies only compatibility of boundaries, dependencies, ownership, and
Rules; it does not assess product, Design, criteria, or validation. The report is not an official verdict:
verify each finding directly, fix the same Spec, and resume the same Reviewer until no blocking
architectural or Rule finding remains. Any later amendment invalidates the result and
requires a new review before implementing. Record in the revision history the evaluated revision, the `clear`
result, and the concise resolution of the verified findings; do not paste the raw report into the Spec.

Do a self-review of the written Spec: placeholders, internal contradictions, ambiguous
requirements, and scope that requires decomposition; fix before presenting it. Verify that the
new concepts and their consequent lifecycle contracts are explained, and not just
listed in the tree or in the declarations. Before presenting, confirm: authority/version
metadata; scope and traceability; observable criteria; resulting declarations,
impact on consumers/wiring, and runtime guarantees; the expected file tree and its
agreement with the approved widget composition and the sensor paths; available design
references; allowed test boundaries; real sensor commands; documentation links;
feasibility of reproducible setup/fixture and safe cleanup; and resolution of the verified
compatibility findings. Explicit implementation dependencies block
the affected work, not the opening, unless they leave the Contract materially ambiguous;
report concrete blockers instead of a successful gate.

After the independent review has no blocking findings, give the user the
path and revision of the Spec and ask them to review the written Contract. Wait for
explicit approval before changing to `open` or handing off to `implement-spec`. If the user asks for
changes, amend the Spec, repeat the affected self-review and independent review, and present
the revised Contract again.

Only then change to `open`. Report the Spec's path/revision/status, the bounded
outcome, the canonical source/version, the consequent decisions, the sensor coverage, and the
result of the review. The next step is [`create-plan`](create-plan-prompt.md), then `implement-spec`; the main task
decides the execution mechanics.

## Amendments and continuation

For a material change to the Contract, return the same Spec to `draft`, increment the revision,
re-read the affected authority, resolve the material decisions, and update the Contract and the
sensor mapping. Preserve the historical evidence of the Evaluation and mark as `stale`
only the affected results. Repeat the affected integrity and compatibility checks
before returning to `open`, then rerun `create-plan` to reconcile `plan.md` with the new
revision. Structural reorganization, status change, reruns,
publication, and conclusion do not increment the revision. A distinct change after
conclusion may receive a new Spec (`changes/<change>/`).

The Evaluation preserves continuity: acceptance status, current code revision and uncommitted
scope, valid sensor results, failures/blockers, and the immediate unfinished work.
A continuing agent reads the Spec, `plan.md`, the Evaluation, and the real diff, confirms the record,
and chooses how to proceed. Do not rebuild a phase ledger nor a task breakdown: `plan.md` only
tracks the rows of the Spec's path map.
