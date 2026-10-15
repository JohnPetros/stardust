---
title: Transações e outbox — execução
status: completed
spec: ./spec.md
spec_revision: 2
evaluation: ./evaluation.md
updated_at: 2026-10-15
---
# Execution status

Revisão 2 in_progress, Spec Reviewer clear. Usuário autorizou todos os produtores e ambos
os padrões. Três ownerships independentes com interfaces congeladas; root mantém
documentos, geração de migrations, bootstrap e integração. Código integrado, todos os gates locais e revisões pareadas aceitos; Evaluation ready. Commit/push autorizados após ready; PR/deploy não solicitados.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Builder Core | F1 | Core contracts and producers | none | Infrastructure, Server composition | completed | RF-01/RF-02/RF-05; tipos e testes dos produtores |
| 1 | Builder Infrastructure | F1 | Infrastructure | none | Core contracts and producers, Server composition | completed | RF-01/RF-03/RF-04; job tests e tipos |
| 1 | Builder Server | F1 | Server composition | none | Core contracts and producers, Infrastructure | completed | RF-02/RF-05; composições e testes de handlers/jobs |
| 2 | Builder Infrastructure | F2 | Integrated persistence | Infrastructure, Core contracts and producers, Server composition | none | completed | CA-01 a CA-10; migrations e integração real verificadas pelo root |

| 3 | Builder Seed Complexity | F3 | Seed and health complexity | Integrated persistence | Server complexity, Infrastructure complexity | completed | RF-06/CA-11; seed/health tests, metrics and types passed |
| 3 | Builder Server Complexity | F3 | Server complexity | Integrated persistence | Seed and health complexity, Infrastructure complexity | completed | RF-06/CA-11; handlers/jobs/functions, metrics and tests passed |
| 3 | Builder Infrastructure Complexity | F3 | Infrastructure complexity | Integrated persistence | Seed and health complexity, Server complexity | completed | RF-06/CA-11; SQL/router/lifecycle and root bootstrap, metrics and real integration passed |

Builder Core: packages/core/src/global/interfaces e types, todos os use cases
com Broker e seus testes do mapa. Proibido editar apps/server ou artefatos SDD.
Builder Infrastructure: DatabaseTransactionContext, DrizzleUnitOfWork,
DrizzleRepository, DrizzleClient, DrizzleDatabaseError, DrizzleOutboxRepository,
model global outbox, InngestBroker, InngestEventPublisher, OutboxDispatcher,
DispatchOutboxEventsJob/test. Proibido Core, controllers, demais jobs, migrations e docs.
Builder Server: composição controllers, tools, jobs de negócio e testes respectivos,
FeedbackRouter. Proibido infra de outbox/Core/HonoApp/migrations/docs/testes de rota do root.
Root: fontes compartilhadas, bootstrap, schema exports, migrations, testes reais
reporting/profile, cleanup de fixture, docs, sensores oficiais e decisão final.

Rule Pack: o mesmo da Spec. Exits específicos no Validation Contract.

# Validation and handoff

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| --- | --- | --- | --- | --- | --- |
| review | Builder Core implementation-reviewer-agent | CA-03 | Spec revision1 | EV-01 | accepted |
| review | Builder Infrastructure implementation-reviewer-agent | CA-01/CA-02/CA-04 a CA-09 | Spec revision1 | EV-02 | accepted (complexity gate open) |
| review | Builder Server implementation-reviewer-agent | CA-03/CA-10 | Spec revision1 | EV-03 | accepted |
| review | Builder Seed Complexity implementation-reviewer-agent | CA-11 | Spec revision2 | EV-35/EV-37 | accepted |
| review | Builder Server Complexity implementation-reviewer-agent | CA-03/CA-10/CA-11 | Spec revision2 | EV-32 | accepted |
| review | Builder Infrastructure Complexity implementation-reviewer-agent | CA-01/CA-02/CA-04 a CA-11 | Spec revision2 | EV-39/EV-40/EV-41 | accepted |
| integration | reporting/profile e dispatch real | CA-01 a CA-10 | Supabase local | EV-26 | passed |
| manual | VM-01 API local autenticada | CA-05 | Hono HTTP real e PostgreSQL local | EV-13 | passed |

# Execution log

2026-10-15: kickoff; contratos congelados. Spec Reviewer clear. Sem publicação autorizada.

2026-10-15 resumed checkpoint: Core helper corrections owned by Builder Core Fix;
Infrastructure resumed for append-only migration tooling and UOW complexity fixes.
Allowed paths add scripts/check-drizzle-transition.mjs, apps/server/scripts/migrate-database.ts,
and scripts/tests/check-drizzle-transition.test.mjs. RF-03 requires applying generated
0003/0004 locally while preserving frozen first-three migration provenance, catalog/access
verification and rollback safety. Root owns route/job integration tests and bootstrap fix.
Next: migrations, focused database integration, static sensors, paired review.

Infrastructure attempt2: approved exact outbox catalog addendum in scripts/outbox-schema-catalog.json;
root adds avatar success/rollback integration and stable-ID assertion guard. CA-01/03/05,
proof pending focused routes/jobs. Existing baseline catalog remains frozen.

Integration attempt1 active: four focused route/job files, shared local DB serialized.
Outbox/CreateUser unit exits passed18tests; exact artifact paths reconciled in Spec.

Tooling runtime/rollout documentation aligned; Server Builder resumed for focused handler regression and missing REST examples. Root continues serialized database integration.

Server REST assignment approved: add missing audio file DELETE and feedback message/status examples only. Root sanitizes AppError logging before raw SQL cause inspection; RF-01/03.

Server REST scope correction: profile/users reward bodies remove obsolete client execution counts; challenging/challenges POST uses required initialCode. Router schemas verified; no HTTP behavior change.

Integration attempt1 invalid: fixture default gateway54323 differs from root-configured15423. Stop failed selection and rerun four files with root env-derived local gateway, key and Mailpit; no source environment values changed.

Root assumes CreateUserJob helper correction because resuming original Server Builder hit agent thread limit. Own exact job/test paths; resolve new functionLength71 error preserving single SQL/AMQP step. Existing seed complexity errors verified separately at base.

Core exits nowpassed29suites96tests, types, lint58files, complexity788files2126functions0warnings/errors. Core paired reviewer resumed. Infrastructure append verification and historicalrollback pass; root final UOW/HTTP rerun pending. Root corrected CreateUserJob with cohesive transaction-local helpers; paired Serverreview resumed.

ACH-07 Core ordering correction active: preserve expected-status conflict precedence and nextPlanet.firstStar validation before event enqueue. Builder adds3focused regressions. Final UOW runtime rerun passed2suites16tests19.028s; VM01 liveHTTP/Inngestpassed. Serverbuild/typespassed; static complexity remains failed with baseline debt and warnings.

Final preparation db:test passed after local-only restoring default PUBLIC EXECUTE before reset (old reset retains defaultACL). Baseline and outbox migrations applied from empty schema. Post-preparation4file integration rerun active. All three paired source reviewers accepted; global ready blocked by Servercomplexity.

Final checkpoint: fresh db:test succeeded, post-migration4suites26tests passed51.469s.
All behavioral exits and paired source reviews passed. Keep overall in_progress for
ACH-08 Server complexity gate (106warnings,2preexistingerrorfunctions). Next action:
resolve/triage that gate without changing baselines; no publication performed.

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

Final revision2 handoff: all source assignments and local validation exits completed.
OfficialServercomplexityzero725files3288functions, finaltypes/build/architecture/integrity
passed;60validintegrationcases and actualseed/runtimeInngest smoke passed. All paired
reviews accepted. Evaluationready, no blockedfinding. No publication authorized/performed.

Final Plan definition correction: explicitly declare all three revision2 pairedreviewers in the canonical reviewtable; verdicts already accepted, no source/evidence invalidation.

Commit handoff: user invokes commit-code then push. Stage initially empty; all165files belong to reviewed delivery. Group by semantic layer/responsibility; preserve verified source and ready evidence. Current branch codex/impact-based-validation tracks origin at samebase. Root configured precommit check:code passed7tasks2.705s; no source/test rerun required merely for commits.
