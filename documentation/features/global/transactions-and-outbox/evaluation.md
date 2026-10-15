---
title: Transações e outbox — Evaluation
spec: ./spec.md
spec_revision: 2
status: ready
base_commit: c79b11a5f9c88f641f233665b90d1302feaae36b
evaluated_commit: working-tree
last_updated_at: 2026-10-15
---
# Evaluation — Transações e outbox

## Escopo avaliado

Spec revisão1, Plan adjacente, commit-base c79b11a5f9c88f641f233665b90d1302feaae36b. Assignments registrados no Plan:
Builder Core possui ports/produtores Core/testes; Builder Infrastructure possui
transaction/outbox/dispatcher; Builder Server possui composição/produtores Server.
Root possui geração, bootstrap, testes de rota, documentação e verificação integrada.
Paths permitidos e proibidos, Rule Pack e exits são os definidos na Spec/Plan.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 | passed | EV-11/EV-14: HTTP reporting/avatar rollback removes business writes and enqueue together; real PostgreSQL. |
| CA-02 | passed | EV-11/EV-14: caught nested rejection rolls back root; concurrent commit/rollback isolates ALS context. |
| CA-03 | passed | EV-07/EV-12: all29Core publishers require Database first;99uniqueCore tests and34handler tests; types and paired review. |
| CA-04 | passed | EV-14: nested SQL causes40001/40P01 retry once; repeat conflict409; rollback/context tests. |
| CA-05 | passed | EV-11/EV-13: durable pending row, feedback replay dedup/stable IDs, real Inngest delivery. |
| CA-06 | passed | EV-11:150events, concurrent workers claim disjoint50+100 batches; stale owner ACK/fail rejected. |
| CA-07 | passed | EV-06/EV-11: send/ACK outcomes,1/5/15/60min backoff, terminal10attempts. |
| CA-08 | passed | EV-06/EV-11: expired reservations recovered; periodic rescan independent of notifications. |
| CA-09 | passed | EV-06/EV-11: published-only30day retention, terminal/future work retained, cleanup daily/retry. |
| CA-10 | passed | EV-07 and paired Server/Core review: external I/O outside retry; CreateUser pureDB group one durable step. |
| CA-11 | passed | EV-27: official Server complexity725files3288functions0warnings/errors; final types/lint/architecture/build and behavior regressions passed. |

## Revisões

### Spec Reviewer

Revisão1 clear. ACH-01 resolvido: Text/Integer nos parâmetros dos ports.

### Implementation Reviewer

EV-01 Core accepted after ACH-07; EV-02 Infrastructure source/behavior accepted with complexity qualification; EV-03 Server composition accepted. No open blocking source findings. Shared readiness gate remains failed (EV-17).

## Sensores e preflight

check:spec-definition passed (5 RF, 10 CA e mapa de paths). Código ainda não alterado
no kickoff. Seleções/testes/tempo/ambiente serão registrados após cada checkpoint.
Registro histórico do kickoff: stack ainda não estava iniciado. Veja os checkpoints atuais abaixo. Cobertura agregada pendente para CI; não
substituída por cobertura focada.

## Checks e build do CI

Não executados: commit/push/PR não solicitados. Entrega permanece in_progress.

## Warnings e findings

ACH-01 resolved: parâmetros textuais/numéricos usam estruturas existentes.

## Análise preventiva dos findings

ACH-01: aplicar Core Rules aos novos ports; No change, regra existente já clara.

## Lições aprendidas

Separar retry de callback SQL de Auth/storage/AI e preservar ID estável no envio/ACK.

## Alinhamento documental

Architecture e Rules DB/Queue receberam destino autorizado antes do código.

## Resultado final

in_progress: implementation and behavioral evidence complete; Server complexity gate failed (EV-17). No ready/CI/publication claim. See final checkpoint below.

## Checkpoint — assignments ativos

Builder Core, Infrastructure e Server iniciados com revisão1 e ownership disjunto.
Execução Plan-backed por mudança cross-boundary e migration. Gate de definição
Spec/Plan passed antes dos Builders. db:test local iniciado para preparar integração;
nenhuma aplicação remota autorizada. Evidências de código ainda pending.

Core checkpoint: ports, 29 produtores e 26 testes existentes migrados pelo Builder;
typecheck focado em andamento, ainda sem aceite oficial. Novos testes pareados
FinishUserCreation/AcquireDefaultShopItems/AquireDefaultShopItems autorizados.
Root assume composição de seis jobs nas functions Inngest sem alterar infra de steps.

Checkpoint Infrastructure/Server: novos context/UOW/outbox/model/Broker em disco;
27 composições Server e 19 testes migrados pelo Builder. Três controllers de
recompensa têm outer run; CreateUserJob consolida somente operações DB. Root
atualizou quatro functions para injetar UOW, export do model e cleanup do outbox.
ACH-02: db:test falhou no baseline por defaultACL postgres global preservada pelo
reset anterior. Confirmado schema public vazio e restaurado default EXECUTE
PUBLIC somente no banco local antes das migrations, que revogam acesso novamente.
Nenhuma credencial registrada e nenhuma mudança remota. Migração baseline em andamento.

## Resumed checkpoint — 2026-10-15

Implementation present across Core producers, Server composition and outbox infrastructure.
Earlier builder reports are provisional; final integrated commands remain required.
ACH-03: migration runner freezes the journal at three entries and skips future migrations.
Necessary RF-03 correction assigned to Infrastructure: support append-only verified migrations,
preserve frozen baseline provenance/access checks, reject unsafe rollback after append.
Local db:test prepared services but migration failed on journal validation; database proof pending.
ACH-04: Infrastructure reviewer found shutdown hook removed before active sweep finished.
Root changed Hono close callback to remove the hook only after dispatcher.stop settles;
paired re-review pending. Server reviewer source finding about ServerType was disproven:
local alias exists at the bottom of HonoApp.ts. Core complexity corrections remain active.
New real job integration tests cover reservation concurrency, retries, leases, ownership,
cleanup, nested rollback-only, ALS isolation and role privileges. Reporting route tests now
assert persisted outbox and atomic rollback/retry. Types and database runs pending.
Server complexity reported new UOW nesting and dispatcher parser errors plus existing or
line-shifted baseline warnings; new regressions must be corrected without baseline changes.
No remote database, publication or browser activity performed.

ACH-03 correction design: validate all appended journal entries, retain frozen first-three
provenance, exact outbox addendum per intermediate/final schema, reject post-append rollback.
Root corrects non-null stable-ID assertion and adds avatar purchase success/rollback coverage;
route/job evidence pending. No contract behavior or global validation policy changes.

EV-06: official integrated unit selection passed: DispatchOutboxEventsJob.test.ts (16) and
CreateUserJob.test.ts (2), 2 suites/18 tests, 14.025s. Command: npm run test:unit
-w @stardust/server -- --runInBand --runTestsByPath src/queue/jobs/global/tests/DispatchOutboxEventsJob.test.ts
src/queue/jobs/profile/tests/CreateUserJob.test.ts. Candidate working tree on base c79b11a.
Exact path map reconciled for generated migrations, paired handler tests and new job boundary.
Real database suite running serially; access/catalog capture completed within rollback-only
probe transaction, existing outbox data unchanged.

EV-07 pending: Server Builder reruns affected controller/tool tests. Tooling now documents append-only migrations, worker runtime, delivery retries and required draining of old user-creation executions. No deployment authorized. Mutation route examples under inspection; additions will enter exact path map.

ACH-05: DrizzleDatabaseError retains SQL cause for retry diagnosis, but raw console inspection exposes non-enumerable cause. Root moves AppError response handling before generic error logging, preserving safe title/message. Database route evidence rerun after correction; no public response change. Added REST paths approved for missing examples only.

Server REST scope correction: profile/users reward bodies remove obsolete client execution counts; challenging/challenges POST uses required initialCode. Router schemas verified; no HTTP behavior change.

EV-08 failed infrastructure setup: default .env.testing gateway54323 could not reach local Compose15423. No application assertion accepted. Rerun loads root .env.local via Node and derives loopback URLs from configured ports, preserving keys only in process memory. EV-07 official handler log inspected:19suites34tests passed37.592s. EV-09 architecture Server passed895modules1752dependencies. EV-10 test-integrity passed55changed testfiles58testable sourcefiles; later changes require repeat only if affected.

EV-11: actual integration passed4suites26tests26.747s with configured local Supabase: reporting SendFeedbackReport/SendFeedbackMessage, profile AcquireAvatar, job DispatchOutboxEventsJob. UOW helper correction after run invalidates only transaction runtime evidence, selected rerun required. ACH-06: complexity reports CreateUserJob.handle length71; root cohesive extraction pending. Existing seed.ts/seed-config errors are outside task; no baseline changes authorized. Base-candidate comparison pending.

EV-12 Core official logs inspected:29suites96tests27.294s, typespassed7.698s, corrected scopedBiome58filespassed0.263s, complexity788files2126functions0warnings/errors6.14s. Default-item Logical truthiness bug is preexisting, preserved outside migration scope; follow-up finding only. ACH-06 implemented CreateUserJob helper extraction preserving sequential defaults/unlock/finalevent within same run; focused2test rerun pending. UOW boundedretry/nestedhelpers and dispatcher failureobserver corrections integrated; finaltypes/runtime evidence pending. Base complexity scan confirms preexisting2errorfunctions+15warnings in untouched seed/health files; finaldelta analysis pending.

EV-13 VM-01 passed: actual Hono listen3399, authenticated GET/auth/account200, POST/reporting/feedback201, event persisted and published by runtime dispatcher through local Inngest within15s. HTTP server closed and dispatcher drained before pool close. Nonversioned smoke script /tmp/stardust-outbox-runtime-smoke.mts; env loaded from root without logging secrets. EV-14 finalUOW runtime rerun2suites16tests19.028s confirms rollback-only/isolation/conflict paths after extraction. EV-15 Servertypespassed; Serverbuildpassedtsup1658ms; Corearchitecturepassed795modules1432deps. EV-16 lint138changedTS/MJSfiles0errors,2preexistingparameterwarnings,336ms. ACH-07 reviewer identified2validation-order drifts from helper extraction; Builderrestores and adds3regressions, finalCorefocusedproofpending. EV-17 complexityServerfailed106warnings/2errorfunctions; isolated base scanalreadyfails15warnings/2sameerrorfunctions(seed.ts populateDatabase,seed-config readSeedConfig). NewCreateUserlengtherrorresolved; no thresholds/baselines/exclusionschanged. Warnings include line-shifted baselinefunctions and newoutboxsource; this gate remains open, not passed.

EV-18 migration tooling official selection4tests4passed0skipped76.410s: journal tampering (runs twice because operational test module imports test helpers), historicalaccessrollback and actualbaseline3→outbox4→grants5/drift/access tests. EV-19 db:test finalpassedexit0: root .env.local, local defaultACL restoration before reset, Compose reset and fullmigrations. This also removes temporary manualfixturedata; no remote changes. Postfreshschema integration4filesrunning. ACH-07 final2suites11testspass5.479s including3newregressions; Coretypes9.98s and complexity788files2128functions0warnings/errors7.07s; pairedCoreaccepted. Updated canonical CA table using actualproof; overall status remainsin_progress because Servercomplexityfails.


## Final integrated sensor ledger

Candidate: working tree on `c79b11a5f9c88f641f233665b90d1302feaae36b`,
Node22.17.0, local Compose PostgreSQL/Supabase/Inngest. No remote database changes.
Test selections are the paired files in the exact Spec path map, excluding unrelated suites.
Ephemeral full output paths below aid local review; results/counts are persisted here.

| Evidence | Command / exact selection | Result | Time / scope / limitation |
| --- | --- | --- | --- |
| EV-12 | `npm run test:unit -w @stardust/core -- --runInBand --runTestsByPath` with29paired producer suites from Spec | passed96tests |27.294s; local unit boundary |
| EV-20 | Same Core command, only `src/reporting/use-cases/tests/ChangeFeedbackReportStatusUseCase.test.ts` and `src/space/use-cases/tests/GetNextStarUseCase.test.ts` | passed11tests incl3new |5.479s; supersedes original8tests in those2suites,99unique Core tests overall |
| EV-07 | `npm run test:unit -w @stardust/server -- --runInBand --runTestsByPath` with19changed controller/tool suites in Spec | passed34tests |37.592s; `/tmp/stardust-server-handlers-final.log` |
| EV-06 | Server unit command, `src/queue/jobs/global/tests/DispatchOutboxEventsJob.test.ts` and `src/queue/jobs/profile/tests/CreateUserJob.test.ts` | passed18tests |14.025s;16dispatcher+2creation |
| EV-21 | Server unit command, only `src/queue/jobs/profile/tests/CreateUserJob.test.ts` | passed2tests |8.385s; after final job helper extraction |
| EV-11 | Server integration command with4files listed below | passed26tests |26.747s; actual HTTP/Auth/PostgreSQL; transport controlled in job tests |
| EV-14 | Same integration command, only job+SendFeedbackReport route | passed16tests |19.028s after final UOW extraction |
| EV-13 | `/tmp/stardust-outbox-runtime-smoke.mts` via tsx with root local env and database exporter | VM-01 passed |actual listener3399; account200, feedback201, local Inngest published and shutdown drain; no payload/credential logs |
| EV-18 | `node --test --test-concurrency=1 --test-name-pattern='migration journal accepts|append-only outbox|rollback checks inverse' scripts/tests/check-drizzle-transition.test.mjs scripts/tests/adopt-drizzle-baseline.test.mjs` | passed4tests0skipped |76.410s; duplicate journal test via helper import;3unique scenarios; disposable real PostgreSQL |
| EV-19 | `npm run db:test -w @stardust/server` | passed |local-only reset+baseline+outbox migrations; defaultACL repair prerequisite below |
| EV-15 | `npm run check:types -w @stardust/server`; Core types after ACH-07 | passed |real project configs; Server duration not separately captured; Core9.98s |
| EV-09 | `npm run check:architecture -w @stardust/server`; same for Core | passed |895modules1752deps Server;795modules1432deps Core |
| EV-16 | `biome check`138changed TS/MJS paths from Git diff/untracked selection |0errors,2existing parameter warnings |336ms; no write; Core ACH-07 four-path lint rerun49ms passed |
| EV-22 | Core `check:complexity` after ACH-07 | passed |788files2128functions0warnings/errors7.07s |
| EV-17 | Server `check:complexity` | FAILED |106warnings2errors; preexisting base scan15warnings2same error functions; unchanged baselines; not waived |
| EV-23 | Server `build` after ACH-07 | passed |tsup1682ms; no CI claim |
| EV-24 | Spec/Plan definition, Spec implementation --base c79b11a, test integrity --base c79b11a, git diff --check | passed |152contracted paths;55changed testfiles58testable sourcefiles; baseline and thresholds untouched |
| EV-25 | Current Core producer inventory | passed29 |all publishing producers require Database first and contain transaction entry; paired source review verifies callback coverage |

EV-11 exact Server integration paths (relative to apps/server):
- `src/tests/jobs/DispatchOutboxEventsJob.integration.test.ts`
- `src/tests/routes/reporting/SendFeedbackReportRoute.test.ts`
- `src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts`
- `src/tests/routes/profile/users/AcquireAvatarRoute.test.ts`

Integration environment: load database exports using
`eval "$(node scripts/export-local-database-env.mjs)"`; Node loads root `.env.local`
and derives loopback `SUPABASE_URL`/`MAILPIT_API_URL` from configured API/Mailpit ports
before spawning the integration command. Never copy root key values into tests/logs.
The failed first attempt used the fixture default port and is retained as failed EV-08.

Local reset prerequisite ACH-02: old reset drops public schema but preserves global
postgres default function ACL. Before the final reset, restore only the local default:
`ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT EXECUTE ON FUNCTIONS TO PUBLIC;`.
Then db:test resets and migration0002 revokes access again; final0004 revokes outbox access.
No existing function grants are modified by ALTER DEFAULT PRIVILEGES. All manual smoke
fixtures were local; the final db:test removes them. This workaround is environment
repair, not a change to versioned production security or the frozen baseline.

## Open findings and handoff

- ACH-01 resolved: semantic port parameters.
- ACH-02 local environment repair applied; reset defaultACL behavior remains preexisting tooling debt.
- ACH-03 resolved: append-only migration provenance, exact intermediate/final catalog,
  browser table/sequence/column ACL verification and safe legacy rollback refusal.
- ACH-04 / IR-INFRA-01 resolved: drain hook retained until stop settles.
- ACH-05 resolved: SQL cause retained internally and omitted from HTTP AppError logs.
- ACH-06 resolved: CreateUser helper extraction removes new length error, behavior tests pass.
- ACH-07 resolved: validation ordering restored;3regressions; paired Core accepted.
- ACH-08 historical failure, now RESOLVED by ACH-09/EV-27: Server complexity originally failed106warnings/2errors. Both error functions
  (`database/seed.ts:populateDatabase`, `database/seeders/seed-config.ts:readSeedConfig`)
  already fail at the untouched base. Warnings include preexisting code, shifted
  line-number baseline identities and new transaction/outbox code; this delivery does
  not claim those warnings have all been resolved. No baseline update, threshold
  reduction, exclusion or gate waiver was performed. Overall readiness remains blocked.
- Follow-up outside scope: existing default-shop Logical-object predicates are always
  truthy; preserve behavior in this transaction migration, do not silently fix product semantics.

Lessons dispositions: existing transaction/credential Rules already cover safe boundaries
and logging, so No change for ACH-04/05/07 beyond local implementation correction.
The migration addendum and Tooling section record append behavior and rollout drain needs.
No CI/aggregate coverage run or publication authorized; no commit, push, PR or deploy.
Frontend smoke N/A: no frontend source or UI contract changed.

Historical revision1 outcome: source and behavior accepted, but complexity blocked ready.
Revision2 resolves that gate; current outcome and readiness are recorded below.

EV-26 final post-db:test integration passed4suites26tests51.469s, exact same4file
selection as EV-11, fresh locally migrated Supabase schema. This is the final database
candidate evidence. Spec/Plan definitions and diff whitespace rechecked passed.
Unique focused unit proof:99Core +52Server=151 tests;26realintegration tests;
4migration tooling test executions (3unique scenarios), no skipped acceptance cases.
All RF/CA behavioral claims passed; global ready still blocked by ACH-08.

## ACH-09 — user-authorized all-findings correction

2026-10-15: user explicitly requests “fix all” against106warnings/2errors.
Spec revision2 addsRF-06/CA-11, behavior-preserving Server refactors with zero official
complexity findings and unchanged baselines, thresholds, exclusions and test strength.
Ownership: Builder Seed owns database/seed.ts, database/seeders reported files and
rest/controllers/health/CheckHealthController.ts; Builder Server owns reported
controllers excepthealth, AI tools, queue/inngest/functions and business jobs;
Builder Infrastructure owns DrizzleOutboxRepository and DispatchOutboxEventsJob;
root owns HonoApp and FeedbackRouter, SDD ledgers, integration and official sensors.
No overlapping edits. Existing behavior evidence becomes stale only for refactored
boundaries; rerun affected tests/types/architecture and real HTTP/database bootstrap.
No credentials, migrations, Core, dependencies, baseline/config or publication edits.
Before builder activation: revision2 definition checks and compatibility review.

Revision2 SpecReviewerclear; definitionspassed before activation. Active stable builders:
SeedComplexity ownsseed/seeders+health; ServerComplexity ownsreportedcontrollers/tools,
Inngestfunctions and businessjobs; InfraComplexity ownsreportedDrizzlecontext/client/outbox,
dispatchjob and FeedbackRouter (moved fromroot for balancedownership). RootHonoApp only.
No overlappingpaths. All refactors preserve behavior; officialServer gate mustzero.
Root invalidates Hono/bootstrap, feedback and affectedhandler/seed/health evidence untilrerun.

RootHono attempt1: split startup/listen state, error classification/reporting,
router composition/mounting, Inngest groups and request authentication into cohesive
helpers. Preserve route construction/mount order, error response/status, MCP auth bypass,
singleflight/drainhook, bounded10portretry. New NodeServerStartup helper stays samefile;
Hono tests, source review and complexity now pending; priorbootstrap evidence stale.

RootHono attempt2: first raw scan70functions5MIwarnings/0errors; separated mounting
identity/learning/content/service groups, Supabase context setup and listen construction.
Seed/Server builders report substantive extraction progress; fullgate not yet accepted.
No metricpolicy/config changes; source tests/types pending integratedcandidate.

RootHono attempt3: split boundedport retry decision/reporting from listen attempt;
prior scan1remainingMIwarning. Same10attempt limit/erroridentity/development-only fallback.
Raw metrics and Hono/startNodeServer boundary tests now running.

RootHono rawmetricspassed1file80functions0warnings/errors. Add startupfailure regression
cases in permitted existingapp/hono/tests/HonoApp.test.ts: ten-attempt limit,
nonaddress error no retry, synchronous error identity. Existing legacytestfile remains
unchanged; no move/skip. Newpairedsource evidence required after Hono helper changes.

ACH-09 progress: RootHono raw80functions0warnings/errors (three existingstartup tests
passed19.348s; three addedregressions rerunning). ServerBuilder reports25filesrawzero;
InfraBuilder5files115functionsrawzero, outboxunit16passed0.557s, lintclean21ms.
Infra changes preserve pendingreservation/order/owner ACK and txfailedresponse sentinel.
Final integrated Servertypes/complexity now running; seed/health finalcheckpoint pending.
Source reviewer verdicts revision1 stale for refactoredownedpaths; pairedrevision2reviews required.

ACH-09 checkpoint: integratedscan5warnings/0errors while finalseed/health edits inprogress;
rootHono6tests passed10.046s, source reviews accept Hono+Infra and25Serverfiles conditionally.
Seed/health nowreportsraw7files152functions0warnings/errors; seed CLI tests6passed.
ACH-10 discovered preexistingwrong catalog path: seed-data.ts used ./seed-catalog.json
but trackedartifact is ./data/seed-catalog.json. Correct within ownedpath; actualseed
validation required. Healthpairedtest path approved for meaningful socketregression.
Root starts local seed only after sourcefinished; no concurrent sharedDB validation.

ACH-09 official Servercomplexitypassed725files3290functions0warnings/errors; finalseed
readonly/staticparameterbinding typingcorrection subsequently integrated, rawseed7files
150functionszero. Initialintegratedtypesfailed5seedtypeerrors; notwaived, correction
inAuthSeeder (staticSQL+boundparams, no casts) andreadonlyseeddatahelperinputs applied;
finaltypespending. SeedCLI6passed3.195s; Health15passed2.355s includes3TCPprecedence
regressions; rawHono80functionszero,6startupboundariespassed10.046s. Dedicatedseed
pairedreviewactive. ActualseedCLIinitialpass, repeat/rollback/auth integrationrunning
againstlatestSQL. Previouspassingmetrics retained as checkpoint, finalofficialrerunpending.

ACH-11 expandedreportingintegration16suites:15passed/1failed,58passed/1failed59tests64.962s.
Failure is historical statusroute expectation of postcommitBrokerpublication; nowdurable
enqueue occursinsideSQL transaction asRF03requires. Root ownsapproved existing
ChangeFeedbackReportStatusRoute.test.ts: realbroker callthrough, proveprecommit
invisibility andpostcommitstatus+pendingeventorder; addstatusrollbackonrealenqueuefailure.
No productionbehavior change. Only failedstatussuite mustrerun; other15suites remainvalid.
Officialfinalcomplexitypassed725files3288functions0warnings/errors; typessourcestable.

ACH-11 resolved: statusroute realbroker test nowproves separateconnection seesprevious
committedstatus duringenqueue, responsecommitsclosed/open states andtwoorderedpendingevents.
Newenqueuefailure testcase provesstatus+insertedevent rollback together. Focused5tests
passed8.974s; initialother15suites55tests remainvalid, total60uniqueintegrationcases.
Finaltypespassed; integrity58changedtests59testablesourcepassed. Sourcecorrectedstatus
filelintclean; finalreadiness requiresruntimebootstrap smoke+pairednarrowtestreview.
FinalofficialServercomplexity725files3288functions0warnings/errors, build495ms,
architecture895modules1752depspassed; baselines/configunchanged. Actualenabledseed
integration1passed0skipped4.304s provesrepeat, bothauthaccounts androllbacklateststaticSQL.


## Revision 2 final readiness — 2026-10-15

Status **ready** for local implementation handoff; no open blocking findings.
ACH-08/ACH-09 RESOLVED: all106warning findings and2preexisting error functions corrected
through cohesive behavior-preserving helpers; no baseline, threshold or exclusion edits.
ACH-10 RESOLVED: preexisting seed catalog path corrected; actual seed validation passed.
ACH-11 RESOLVED: status-route test follows durable enqueue semantics and strengthens
actual persisted event and rollback assertions. Core revision1 evidence remains valid
because no Core source changed in revision2.

| Evidence | Final command / exact scope | Result | Evidence details |
| --- | --- | --- | --- |
| EV-27 | `npm run check:complexity -w @stardust/server` | passed |725files3288functions0warnings0errors; `/tmp/stardust-complexity-official-final.log` |
| EV-28 | `npm run check:types -w @stardust/server` after final status test | passed exit0 |`/tmp/stardust-complexity-types-complete.log`; earlier seed type failure superseded |
| EV-29 | `biome check`147changedTS/MJS paths plus final status test check | passed |291ms;0errors,2existing test-helper default-parameter warnings outside Server complexity scope; `/tmp/stardust-complexity-lint-paths.json` exact selection |
| EV-30 | `npm run check:architecture -w @stardust/server` | passed |895modules1752dependencies; `/tmp/stardust-complexity-architecture.log` |
| EV-31 | `npm run build -w @stardust/server` | passed |tsup495ms; `/tmp/stardust-complexity-build-final.log` |
| EV-32 | `npm run test:unit -w @stardust/server -- --runInBand --runTestsByPath`18affected controller/tool/CreateUser suites | passed33tests |10.14s; exactselection `/tmp/server-worker-tests.json`, output `/tmp/server-worker-tests.log`; root inspected and paired Server reviewer accepted |
| EV-33 | Same Server unit command, `src/queue/jobs/global/tests/DispatchOutboxEventsJob.test.ts` | passed16tests |0.557s; `/tmp/infra-outbox-unit.log` |
| EV-34 | Same Server unit command, `src/app/hono/tests/HonoApp.test.ts` and unchanged legacy `src/tests/app/hono/startNodeServer.test.ts` | passed6tests |10.046s;3new startup failures; `/tmp/stardust-hono-complexity-tests-final.log` |
| EV-35 | Same Server unit command, `src/rest/controllers/health/tests/CheckHealthController.test.ts` | passed15tests |2.355s;3new TCP strategy cases; `/tmp/seed-health-tests.log` |
| EV-36 | `node --test scripts/tests/seed-database.test.mjs` | passed6tests |3.195s; local-only CLI validation guards; `/tmp/seed-unit.log` |
| EV-37 | `STARDUST_LOCAL_SEED_TEST=1 node --env-file=.env.local --test scripts/tests/seed-database.integration.test.mjs` after database exporter | passed1test0skips |4.304s; repeat seed, authenticate both fixed fixtures, forced failure rolls back everything; `/tmp/stardust-complexity-seed-integration.log` |
| EV-38 | `npm run db:seed -w @stardust/server` | passed |rootlocal env; actual catalog/Auth/fictional activity; subsequent final SQL version proven by EV-37 |
| EV-39 | Server integration command with16files listed below |15suites55tests passed; stale status assertion failed |64.962s overall initialrun; valid15suites retained, failed suite superseded byEV-40 |
| EV-40 | Same integration command only `src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts` | passed5tests |8.974s; new rollback case, real durable enqueue;60unique valid integration cases withEV-39 |
| EV-41 | Nonversioned `/tmp/stardust-outbox-runtime-smoke.mts` via tsx, rootenv/database exporter | VM-01 passed |actual listener3399: account200, feedback201, committed event published to local Inngest; HTTP closed and dispatcher drained before poolclose; `/tmp/stardust-complexity-runtime-smoke.log` |
| EV-42 | `npm run check:test-integrity -- --base c79b11a5f9c88f641f233665b90d1302feaae36b` | passed |58changed testfiles59testable sourcefiles; `/tmp/stardust-complexity-integrity-complete.log` |
| EV-43 | Spec/Plan definitions, spec implementation with samebase, git diff --check | passed |162contracted paths before finalledgeredit; no generated/config drift |

EV-39 exact paths (relative to apps/server):
- src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts
- src/tests/routes/reporting/CountUnreadFeedbackReportsRoute.test.ts
- src/tests/routes/reporting/CreateFeedbackMessageAttachmentUploadUrlRoute.test.ts
- src/tests/routes/reporting/CreateFeedbackReportAttachmentUploadUrlRoute.test.ts
- src/tests/routes/reporting/FeedbackConversationsPersistence.test.ts
- src/tests/routes/reporting/FetchUserFeedbackReportRoute.test.ts
- src/tests/routes/reporting/GetFeedbackReportRoute.test.ts
- src/tests/routes/reporting/ListFeedbackReportsRoute.test.ts
- src/tests/routes/reporting/ListUserFeedbackReportsRoute.test.ts
- src/tests/routes/reporting/MarkFeedbackReportAsReadRoute.test.ts
- src/tests/routes/reporting/MarkUserFeedbackReportAsReadRoute.test.ts
- src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts
- src/tests/routes/reporting/SendFeedbackReportRoute.test.ts
- src/tests/routes/reporting/UserFeedbackHistoryRoutes.test.ts
- src/tests/jobs/DispatchOutboxEventsJob.integration.test.ts
- src/tests/routes/profile/users/AcquireAvatarRoute.test.ts

Validation environment uses the same rootenv-derived local gateway/Mailpit/DB configuration
as EV-26; integration commands serialize shared database use. Expanded16files justified
by extracting every FeedbackRouter handler, plus changed outbox/purchase boundaries.
Actual local seed validation is required by changed SQL/seed guards, not substituted by mocks.
No frontend source changed, so browser smoke remains N/A. Runtime HTTP checks are real.

Paired reviews revision2: ServerComplexity accepted25files; InfraComplexity/rootbootstrap
accepted all transaction, SQL, route, auth and shutdown semantics plus status regression;
SeedComplexity accepted7productionfiles+healthtests after source and real seed review.
Compatibility review revision2 clear. Final types and global metrics satisfy qualifications.
No new architecture/Rule guidance needed: existing cohesive helper, SQL parameterization,
credential and boundary rules were clear (No change disposition for implementation fixes).

CI/aggregate coverage remain pending eventual authorized publication, not locally claimed.
No commit, push, PR, remote migration, merge or deploy performed. Spec stays in_progress
until the separately authorized conclusion workflow; local Evaluation is ready.

Final ledger conformance: first completedPlan definition rejected missing canonical reviewtable rows for3revision2builders. Added explicitpairedreview declarations referencing existingacceptedverdicts; finaldefinition rerun required. No code or runtime evidence changed.

Final Plan definition rerun PASSED; Spec definition and162-path conformance PASSED; diff whitespace PASSED. Evaluationready and Plancompleted are now structurally verified.

## Authorized commit and push handoff

User explicitly invokes commit-code then push after readiness. Earlier statements of
no publication authority describe the historical implementation stages. Current authority
covers real semantic commits and a normal push of codex/impact-based-validation to origin;
no PR, merge, deployment or remote migration requested. Source is unchanged from validated
candidate. Staging precheck empty,165pendingfiles; root configuredprecommitcheck:code
passed7tasks2.705s. Commit grouping: ports, usecases, SQLstorage, migrationverification,
seedrefactor, healthrefactor, queuedelivery, RESTcomposition, AIcomposition, integration
proof and docs. Gitlog is the authority for actual resultingSHAs; finalpush verifies
remote HEAD and clean worktree. Commit/push alone does not invalidate existing proof.
