# Verification Contract

The `Verification Contract` (name in legacy Specs: `Validation Contract`) uses three categories,
each as a `##` subsection with individually named `###` blocks, instead of long tables
of commands and procedures. Each `CA-*` maps to sufficient concrete proof; it does not need to use
all three categories. Give each distinct observable result its own block (complementary
use-case/controller/widget/job proof may support the same result). Explain why a category is not applicable instead of keeping empty blocks.

| Category       | Prefix | Content                                                                            |
| -------------- | ------ | ---------------------------------------------------------------------------------- |
| `## Automated` | `AV-*` | automated tests and gates: unit/component, integration, static, and baseline       |
| `## Manual`    | `MV-*` | concise happy-path journey, executable by the agent, in a real browser or terminal |
| `## Visual`    | `VV-*` | comparison of a Doop frame with the corresponding Playwright capture               |

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
**Reference / setup:** <page, frame, and components of the Doop canvas `StarDust`; exact viewport; related MV>
**Capture / comparison:** <current Doop frame screenshot compared with the corresponding Playwright capture; reuse the capture from a current MV when possible>
**Approval condition:** <visual properties compared and accepted deviations>
```

Content rules:

- Derive the applicable checks from `documentation/tooling.md`, not from this prompt or from
  memory: the scripts in "Scripts de qualidade", the conditions and command forms in "Execução
  local escopada", and that document's notes on coverage, complexity, and official sensors,
  plus any check a selected Rule requires. Every check whose condition the change meets
  enters the Spec; none is omitted or added without that basis.
- Record each applicable check as its own obligation in the baseline block, covering the
  affected consumers, with exact paths, configured projects, verified test files, or routes as
  the check requires. A required quantitative metric that is unavailable stays `Blocked`. Mark
  nonexistent files/scenarios as planned and verify test names before prescribing filters.
  Checks and build are also run by the PR's CI.
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
- Visual names the page, frame, and related components, state, viewport, compared
  properties, and accepted deviations. Capture during the linked MV when possible and inspect the
  images: saving a screenshot is not a visual approval. Keep runtime evidence in the ignored
  `test-results/` or CI artifacts; record paths and results in the Evaluation, without
  new evidence folders in the feature.

Legacy Specs with `VM-*`/`CI-*` tables and the subsections "Testes automatizados" (Automated tests), "Comandos" (Commands), and
"Validações manuais" (Manual validations) remain valid as history; normalize to this format at the next
material revision.
