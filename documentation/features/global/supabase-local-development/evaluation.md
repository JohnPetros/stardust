---
title: Avaliação — Desenvolvimento local isolado com Supabase, MinIO e Mailpit
spec: ./spec.md
spec_revision: 40
status: in_progress
base_commit: 0b2ea4cae4870067d506a257f2d3244ecbab742c
evaluated_commit: a0898d21e5f274aab6f7605449c0bda0f22dc643
last_updated_at: 2026-09-29
---

# Evaluation — Desenvolvimento local isolado com Supabase, MinIO e Mailpit

## Escopo avaliado

- Spec: revisão 40, in_progress; CA-03 cobre somente o caminho protegido do Studio. O cenário Web foi removido por decisão do usuário. Publishable keys em Server/Web, Envoy para o gateway local e PostgreSQL direto somente nas operações administrativas de feedback. Drizzle/RLS permanecem para a próxima task; migrations não mudam. Spec Reviewer rev40 clear.
- Plan: reconciliado para revisão 40, status in_progress; Builders e paired reviews concluídos, com P2 no handoff final.
- Autoridade de produto: documentation/prds/auth/sign-in.md, RP-01, RP-02, JN-01; Issue #601 foi lida. As decisões de execução usam a revisão vigente da Spec.
- Commit-base: 0b2ea4cae4870067d506a257f2d3244ecbab742c.
- Commit-base: `0b2ea4cae4870067d506a257f2d3244ecbab742c`; implementação registrada nos commits da branch até `08ccbdc0c87717026775af99f038f67b397b58be`. CI remoto de PR foi dispensado como gate de evidência pelo usuário.
- Design: sem Design Contract, sem widgets alterados.
- Assignments registradas no Plan:
  - Task principal / P0/P1: Rules, AGENTS.md, documentation/sdd.md, Spec, Plan e Evaluation; atualizar a regra de smoke manual para caminho feliz conciso.
  - Builder Infra / I1-I2: .gitignore, docker-compose.yml, docker/supabase/** e documentation/tooling.md; atualizar instruções de ambiente root para `.env.local`.
  - Builder Server / S1-S2 e ACH-19: paths do mapa rev31; confirmar conta efêmera via Mailpit local mantendo autoconfirm desativado.
  - Task principal / A1: `documentation/architecture.md` atualizado após reset, startup Compose e integração local.
  - Builder Clientes / C1: apps/web/.env.example, apps/web/next.config.js, apps/web/src/constants/client-env.ts, apps/studio/src/constants/envSchema.ts, `apps/studio/src/vite-config.test.ts` e scripts/check-test-integrity.mjs, scripts/tests/check-test-integrity.test.mjs.
  - Task principal / E1: renomear os quatro root/app `.env.local` ignorados para `.env.local`; atualizar `AGENTS.md`, Rules, Tooling e scripts de exportação.
  - Builder Clientes / C2: `apps/studio/src/vite-config.test.ts`, cobrindo `envSchema` pela composição existente da Vite config.
- Builder Studio / C4: `apps/studio/package.json`, `apps/studio/vite.config.ts`, `package-lock.json`; atualizar polyfill para Vite 8/Rolldown e validar browser runtime.
- Builder Infra / I3: `docker-compose.yml`; remover `docker/supabase/kong.yml`; criar `docker/supabase/envoy/bootstrap.yaml`, `docker/supabase/envoy/clusters.yaml`, `docker/supabase/envoy/listener.template.yaml` e `docker/supabase/envoy/entrypoint.sh`; nenhum segredo de gateway pode ser impresso ou exposto aos apps.
- Builder Server / S3: `apps/server/.env.example`, `apps/server/package.json`, `apps/server/src/constants/env.ts`, `apps/server/src/database/supabase/supabase.ts`, `apps/server/src/database/postgres/PostgresClient.ts`, `apps/server/src/database/postgres/PostgresFeedbackReportsRepository.ts`, `apps/server/src/database/postgres/PostgresFeedbackMessagesRepository.ts`, `apps/server/src/database/postgres/index.ts`, `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`, `apps/server/src/tests/routes/reporting/FeedbackConversationsPersistence.test.ts`, `package-lock.json`.
- S3 local test support: `apps/server/src/tests/fixtures/LocalSupabaseProxy.ts`, `apps/server/src/tests/fixtures/AuthFixture.ts`; integrated Redis endpoint correction: `apps/server/src/tests/routes/global/RateLimiterRoute.test.ts`.
- Builder Clientes / C5: `apps/web/.env.example`, `apps/web/src/constants/client-env.ts`.
- Task principal / P2: `documentation/architecture.md`, `documentation/infrastructure.md`, `documentation/tooling.md`, Server/Web Rules, `documentation/features/global/supabase-local-development/spec.md`, `plan.md`, `evaluation.md`.
  - Paths proibidos: projeto Supabase remoto, migrations de aplicação, snapshots/seeds/exportações de staging, identidades sintéticas, widgets e qualquer path fora do mapa da Spec.
- Estado observado no kickoff: o worktree já continha alterações em spec.md (revisão 10 → 26), quatro arquivos de Rules e os dois paths de check-test-integrity. Essas alterações foram preservadas e incluídas nos ownerships acima; nenhuma alteração de source adicional foi iniciada antes do registro da assignment e desta Evaluation.
- Findings ou restrições de ambiente são registrados abaixo; valores de credenciais não são coletados nem exibidos.
- Assignment rev34: Supabase apps usam publishable key; rotas administrativas de feedback usam `SUPABASE_DATABASE_URL`; RLS/repositories comuns ficam inalterados até task futura de Drizzle; nenhuma migration de aplicação é criada, removida ou modificada.
- Correction D2 / ACH-01/02: matriz de imagem, tabela de portas, descrição do stack e árvore esperada agora usam Envoy e incluem os adapters PostgreSQL/client Supabase/FeedbackRouter. `check:spec-definition` e `check:plan-definition` passaram; Spec Reviewer revision 34 clear.
- C5 Builder result: Web `.env.example` e `client-env.ts` agora usam `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; consumidor e guard foram preservados. O Builder reportou `check:code`, `check:types`, `test:unit` (115 suites/480 tests com valor dummy apenas no processo) e `git diff --check` passando; paired Reviewer pendente. O worktree ainda não foi avaliado de forma integrada.
- I3 Builder result: Compose agora usa `supabase-envoy` e os quatro arquivos Envoy de RF-12; o Builder reportou validação real do bootstrap/LDS/CDS com valores dummy no processo, Compose config, `sh -n` e `git diff --check` aprovados. Stack não iniciado; paired Reviewer e smoke integrado pendentes.
- S3 progress: Server reads only `SUPABASE_PUBLISHABLE_KEY`, removes `supabaseAdmin`/legacy app key settings and routes God Account feedback through Postgres repositories; `db:test` now targets `supabase-envoy`. Builder reports `npm run db:test -w @stardust/server` passed after local key rotation. Focused route integration and the remaining S3 sensors are in progress; no migration diff.
- S3 focused route attempt: failed (1 suite, 1 of 4 tests failed; raw output withheld). Builder is extracting a sanitized failure identifier and correcting the implementation; full integration has not started. Mark route behavior evidence stale until the focused retry passes.
- S3 diagnostic attempt: failure originates in pre-route `SupabaseFixture.clearDatabase()` rather than an admin-route assertion. A temporary test-only diagnostic will expose only database error code/status (never message/body/env), then be removed before retry. Fixture and route evidence remain stale during diagnosis.
- S3 root cause: `LocalSupabaseProxy` readiness probe called `/auth/v1/health` without a key; Envoy correctly returned 401 under the new mandatory key contract, causing the generic 10s readiness timeout before the test. Correction is to send the configured publishable key on this local health probe, preserving gateway enforcement. Temporary diagnostic has confirmed no DB/JWT/RLS/schema error; implementation and retry pending.
- S3 focused retry after health-probe correction: `db:test` passed; focused route still failed 1/4 after readiness. Builder is isolating the REST cleanup failure with status/code only; do not attribute failure to the route or accept CA-13 until corrected.
- S3 latest focused attempt reached `AuthFixture.createAccount()` but failed email confirmation before the feedback routes. Temporary diagnostic scope now includes the already-contracted `apps/server/src/tests/fixtures/AuthFixture.ts` and will capture only response status/code (no body, email, token or environment); remove instrumentation after cause is known. CA-13 remains unverified.
- S3 root cause confirmed: `ConfirmSignUpTemplate.html` links to `/api/auth/confirm-email?token=...`, but `AuthFixture.getLocalConfirmationToken` only accepted `/confirm-email`; the fixture therefore discarded the local link before calling verifyOtp. Builder is correcting the matcher on the contracted `AuthFixture.ts` path and removing temporary diagnostics. Then reset/focused test must pass before full integration.
- S3 focused retry after matcher correction: test progresses farther but still reports 3/4 assertions; Builder is capturing only verifyOtp status/code or the remaining stage. Do not accept CA-13 yet; evidence is stale until the focused test passes.
- S3 focused route diagnosis: confirmation and sign-in now pass; the first route assertion failed because the test used `/reporting/feedback/` with a trailing slash, returning 404, while the existing route contract and REST client use `/reporting/feedback`. Builder is aligning the test URL and removing temporary probes; no admin repository failure is established by this attempt.
- S3 focused route passed after three corrections: gateway readiness probe now carries publishable key, AuthFixture matches `/api/auth/confirm-email`, and the test requests `/reporting/feedback` without a trailing slash. Fresh `db:test` passed; focused integration 1 suite / 4 tests passed with Auth confirm/sign-in and admin list/detail/read. The two temporary diagnostics were removed.
- S3 integrated Server run: serial full suite with ephemeral 6144 MiB Node heap ended at 65/66 suites and 204/205 tests. The only failure was the real Redis adapter test using hardcoded `redis://127.0.0.1:6379` while the local Compose port is configurable; Jest reported `MaxRetriesPerRequestError`. This is an environment-port mismatch, not a feedback/PostgreSQL assertion. The test now uses `ENV.redisUrl`; its targeted rerun passed 1/1 suite and 8/8 tests and Jest exited normally. Do not mark full CI-10 complete until the integrated full-suite rerun.
- I3 paired Review: failed, finding IR-02 — `listener.template.yaml` encaminhava qualquer `apikey` desconhecida como Bearer quando Authorization faltava ou era a publishable key. Isso contradiz a exigência de validar e traduzir somente a publishable key e poderia encaminhar credencial privilegiada ao PostgREST. Fix exigido: resposta de rejeição para API keys inesperadas, preservar JWT de usuário e rotas OAuth callback sem API key quando aplicável; re-run de smoke HTTP/WS. Config/stacks/CA-12 evidence fica stale até o fix e re-review.
- Builder Fix IR-02 result: Envoy now rejects absent/unknown keys with 401 except the OAuth `/auth/v1/callback`; translates only the exact publishable key and does not forward arbitrary bearer values, while preserving user JWTs. Builder reports Compose config, shell syntax, diff-check and mocked HTTP/WS smoke passed: valid key Auth 200, missing/unknown key 401, callback 200, arbitrary bearer replaced, Realtime WebSocket 101. Temporary mock containers/network were removed. Evidence awaits paired re-review; real local Compose integration still pending.
- I3 IR-02 re-review accepted: Reviewer confirmed exact publishable-only translation, 401 on absent/unknown API keys except keyless OAuth callback, JWT preservation, Realtime WebSocket routing, and no app forwarding of gateway credentials. No blockers remain in the I3 diff. Nonblocking cleanup note: duplicate Lua bearer-parse assignment at lines 115–116; no behavioral impact. Real local Compose integration is still pending.
- ACH-28 — env inspection incident: um comando do Builder Infra imprimiu valores das variáveis presentes em `apps/server/.env.local` e `apps/web/.env.local` para o output efêmero da ferramenta; não foram passados a outro comando nem gravados em arquivo. O Builder não conseguiu reconstruir com segurança a lista de nomes e foi instruído a não reler os arquivos. O gate de uso local fica pausado até remover os nomes legacy anon/service-role do runtime e confirmar a configuração publishable por arquivos de nome/parse somente; nenhum valor será reproduzido.
- ACH-28 remediation: replaced the local `SUPABASE_JWT_SECRET`, generated a fresh opaque publishable key shared by root/Server/Web local envs, generated a matching internal anon JWT only in root `.env.local`, removed legacy anon/service-role entries from Server/Web `.env.local`, and updated ignored testing envs (Web gets a non-secret test-only publishable value). Verified names only; values were not printed. Existing local Auth JWT sessions are invalidated. No tracked code or migration was modified by this env operation; Compose restart/reset and local Auth verification remain pending.
- ACH-19 environment: added only the ignored `MAILPIT_API_URL=http://127.0.0.1:54327` setting to `apps/server/.env.testing`; it follows the already configured host port and contains no credential.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 | passed | EV-05 — 10 serviços long-running healthy após down/up; reset e bucket init passaram 2x; startup/recovery signup local entregou templates renderizados; sem seed |
| CA-02 | blocked/deferred | EV-06 — usuário pediu para tratar depois; Next 16.3.0 abre o listener antes de carregar next.config.js |
| CA-03 | passed | EV-01/VM-02 — Studio autenticou e carregou `/dashboard` e `/profile/users`, com listagem protegida 2xx e sessão persistida. O cenário Web foi removido do CA-03 por decisão do usuário. |
| CA-04 | passed | EV-02 — cadastro local recebeu link `/api/auth/confirm-email` e chegou à tela de confirmação após a rota confirmar o email; recuperação recebeu `/api/auth/confirm-password-reset` e exibiu o estado autorizado para redefinir senha, sem efetivar a troca. Respostas Auth foram 200 e nenhuma entrega saiu do Mailpit. |
| CA-05 | passed | EV-21 — nenhum arquivo seed/snapshot de dados no tree tracked/untracked, `[db.seed]` permanece `false`, reset e logs Compose não introduzem catálogo, mídia ou conta pré-criada. |
| CA-06 | waived by user | Evidência manual signed PUT/GET no browser removida do gate de conclusão; não declarar o fluxo browser como testado. |
| CA-07 | waived by user | Login real Google/GitHub e callback em navegador removidos do gate de conclusão; nenhuma credencial local de provider foi necessária ou usada. |
| CA-08 | passed | EV-08 — Rules P0 aceitas, `check:test-integrity` passou e Builder reportou `test:scripts` 34/34; Reviewer C1 aceitou CA-08 |
| CA-09 | passed | EV-17 — fresh `db:test`, focused feedback route 4/4, and full Server integration 66/66 suites, 205/205 tests passed; Redis integration uses the configured Compose URL. |
| CA-10 | passed | EV-07 — após down/up, linha PostgreSQL e objeto MinIO persistiram; chave Redis não persistiu; dados de smoke removidos |
| CA-11 | passed | EV-12/EV-01 — root + três apps usam `.env.local` local-only, arquivos ignorados e dotenv parseados; exporters carregaram env sem expor valores e os launchers locais Web/Studio/Server foram exercitados |
| CA-12 | partial, browser evidence waived | Auth Server pelo Envoy passou na suíte local completa; consumidores Web e reviewers confirmam a publishable key. Web real/Auth browser não foi validado e saiu do gate por decisão do usuário. |
| CA-13 | passed | EV-15/EV-17 — feedback God Account usa PostgreSQL direto, focused 4/4 e full Server integration 66/66 suites, 205/205 tests; migrations inalteradas |

## Revisões

### Spec Reviewer

- Veredito: clear
- Revisão: 28
- Escopo: `.env.local` e cobertura de Studio via consumidor Vite contra Architecture e Rules
- Findings: nenhum; CA-02 está adiado pelo usuário e segue registrado como finding não resolvido para trabalho posterior
- Revisão 30: clear; RF-02 esclarece os protocolos por endpoint, portas customizadas preservam loopback/defaults, e Redis fica fora do guard contratado.
- Revisão 31: clear; sem blockers arquiteturais ou de Rules. AuthFixture permanece no boundary de fixtures Server e é validada pelas rotas; a atualização de polyfills permanece no boundary de build Studio.
- Revisão 34: clear após correção documental ACH-01/02; Envoy consistente na matriz, porta, descrição e árvore; árvore contém os adapters de PostgreSQL e rota de feedback.
- Revisão 40: clear; CA-03 cobre somente login e rota protegida do Studio, sem gate de onboarding Web. RF-03 e RF-12 seguem alinhados à Architecture e Rules.

### Implementation Reviewers

| Ownership | Estado | Escopo |
| --- | --- | --- |
| Task principal / P0 | accepted | IR-01 corrigido e re-review read-only aceito; CA-08 Rules passed |
| Builder Infra | accepted | I1/I2 accepted by paired Reviewer after IR-01 correction; revision-29 configurable host-port delta accepted without findings |
| Builder Server | accepted | S1/S2 and ACH-19/21/23 accepted by paired Reviewer after fresh reset, focused route and full Server integration passed |
| Builder Server / S3 | accepted | Spec rev35; paired reviewer found no blocking issues; CA-13 and full Server integration passed. Server Auth uses local Envoy; CA-12 remains partial pending Web Auth through Envoy. |
| Builder Clientes | C1 blocked by deferral; C2 accepted | C1/CA-02 fica adiado; C2 passou pelo teste consumidor Studio e review pareado |
| Builder Clientes | C3 accepted | revisão 29; teste Studio 6/6, Web integration 73/73, checks Web/Studio e smoke Next passaram; Reviewer aceitou sem findings |
| Task principal / A1 | accepted | Architecture re-review clear após runtime integrado; sem findings |
| Task principal / E1 | completed | root/apps substituídos por `.env.local` local-only; referências, parser dotenv e ignore confirmados; generated values were not printed |
| Task principal / V1 | implemented, accepted | revisão 33 formaliza validação manual somente happy-path concisa em AGENTS.md e documentation/sdd.md; critérios automatizados e outcomes funcionais preservados; Spec Reviewer clear |
| Task principal / D2 | accepted | Spec rev34; ACH-01/02 corrigidos; Spec Reviewer clear |
| Builder Clientes / C5 | accepted | Implementation Reviewer aceitou RF-12 e os paths Web; CA-12 permanece parcial até validar Web Auth local pelo gateway com a chave publishable |
| Builder Clientes / C4 | accepted | implementation review rev31 accepted without findings; plugin `^0.28.0`, client-only polyfills with `module`/`stream` excluded; build and Vite HTTP 200 passed |
| Builder Server / ACH-19/21/23 | accepted | re-review rev31 accepted after `db:test`, focused 2/2 and full Server integration 66/66 suites / 204/204 tests; no findings in assigned code paths |
| Task principal / A1 | accepted | re-review clear after Architecture distinguishes Mailpit SMTP/API from `supabase-templates` and describes token_hash confirmation; no findings |
| Builder Clientes / C2 | accepted | teste pela borda Vite para recuperar CI-07 sem teste dedicado de constant; Reviewer revision 28 sem findings |

- Builder Clientes reportou `npm run test:scripts` (34/34), `npm run check:test-integrity`, tipos/código Web e Studio e `git diff --check` como passed. Reviewers anteriores aceitaram CA-08. Re-review da revision 27 aceitou CA-08 e falhou CA-02: guard de `next.config.js` carrega após o bind.
- EV-06 diagnóstico Web original: endpoint `remote.example.invalid` chegou a `Ready` e listener antes do import guard. Após amendment 27, inspeção do Next instalado **16.3.0** confirmou `server.listen()` em `apps/web/node_modules/next/dist/server/lib/start-server.js:446`; o callback de `listening` imprime `Ready in …` em :317 e só depois inicializa handlers/carrega configuração. Builder reproduziu falha sanitizada da config após `Ready` (exit 1). A recusa impede instalação de handlers, mas não precede o listener; CA-02 falha literalmente. `node --check apps/web/next.config.js`, config loopback em development, endpoint remoto em MODE=testing, rejeição remota em development com nome da variável, `check:code` e `check:types` passaram; integração Web em andamento.
- Builder Server reportou checks de tipo e código do workspace; check:code registrou 40 warnings, incluindo optional chaining no adapter Dropbox movido. S1/S2 e os fluxos Auth foram aceitos após full integration; VMs reais foram executadas para Web/Studio e seus resultados estão registrados abaixo.
- Reviewer Server aceitou S1/S2 e ACH-19/21/23 sem findings após CA-09/CI-10. CA-02 continua adiado; VM-02 está concluída no escopo de CA-03 e VM-01/VM-04 permanecem registrados separadamente.
- Builder Server concluiu S2: `db:test` usa root `.env.local`, Compose local e reset; LocalSupabaseProxy valida API/DB loopback e readiness Auth sem Supabase CLI. `db:test` e integração Server passaram; Reviewer aceitou S1/S2 e ACH-19/21/23.
- Reviewer Server aceitou S1/S2 sem findings após CA-09. CA-02 segue adiado; CA-06 ainda aguarda VM-04 signed PUT/GET no browser.
- ACH-04 — resolved locally: credenciais MinIO do Server correspondem às credenciais do serviço Compose; verificação de igualdade não imprimiu valores.

### Auditoria visual

| Gate | Estado | Evidência |
| --- | --- | --- |
| UI Layer Audit | not_applicable | nenhum widget alterado |
| Pencil/Web comparison | not_applicable | a Spec não altera widgets ou comportamento visual e não possui Design Contract/node Pencil aplicável |

- VM-01 blocked: Playwright CLI on `http://localhost:3000` submitted the local sign-in and observed `/auth/sign-in` 200 plus `/auth/refresh-session` 201, with zero page errors. The session reached `/auth/account-confirmation`, but `/profile/users/id/:id` returned 404 and retry did not create the user profile; navigating to `/space` returned to account confirmation. The local Auth user exists and is confirmed, while required application profile/catalog data is absent. Creating seed/catalog data or synthetic identities is outside CA-05 and the approved contract.
- Confirmation follow-up: the local Mailpit link was validated through the application's `/auth/confirm-email` endpoint (200); the matching local Auth user then reported `confirmed_at` present. No token, email, response body, or credential value was retained.
- Browser origin finding: using `127.0.0.1:3000` caused transient Next development chunk 403s and did not hydrate the form; the required `localhost:3000` origin loaded cleanly and submitted the action. The earlier query-string navigation artifact was removed with the Playwright workspace.
- VM-02 completed for its contracted flow: Playwright CLI autenticou (`/auth/sign-in/god` 201, `/auth/account` 200), abriu `/dashboard` e `/profile/users`, encontrou `Usuários` e recebeu listagem 200; viewport 1280x720, screenshot `/tmp/supabase-local-studio-users.png`. `requestfailed` e `pageerror` ficaram vazios. Console registrou `GET /reporting/feedback` 500; logs Postgres associaram a permissão de `feedback_messages`. O reviewer confirmou que este endpoint global está fora do Contract CA-03/VM-02; o erro permanece visível/documentado e não invalida a rota/listagem protegida.
- VM-03 passed: Mailpit confirmation and recovery messages used the custom templates and valid local `/api/auth/...` links; confirmation reached `/auth/account-confirmation`, and recovery displayed the authorized reset state without changing the password. No credentials or token values were retained.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| npm run check:plan-definition -- documentation/features/global/supabase-local-development/plan.md | passed no último rerun após atualizar ledger/status | CI-15 |
| npm run check:spec-definition -- documentation/features/global/supabase-local-development/spec.md | passed após resolver ACH-01/02 e registrar rev34 | D2 |
| npm run check:plan-definition -- documentation/features/global/supabase-local-development/plan.md | passed após ativar I3/S3/C5 e registrar findings/estado | D2 |
| `.env.local` Git ignore audit | passed | root, Server/Web local e test files permanecem ignorados; só nomes foram inspecionados |
| `docker compose --env-file .env.local -f docker-compose.yml config --quiet` | passed | Envoy configuration and local key variables interpolate successfully; command emitted no resolved config/value output |
| `git diff --quiet -- apps/server/supabase/migrations` | passed | migrations permanecem byte-a-byte inalteradas após amendment rev34 e env key rotation |
| npm run check:spec-definition -- documentation/features/global/supabase-local-development/spec.md | passed no último rerun | CI-12 |
| npm run check:spec-implementation -- documentation/features/global/supabase-local-development/spec.md --base 0b2ea4cae4870067d506a257f2d3244ecbab742c | passed | atual; 57 contracted paths; 17 Create, 37 Modify, 0 Generate, 3 Remove; 3 unrelated changed paths ignored |
| npm run format | passed | 7 workspaces; formatter reported no fixes |
| npm run check:code | passed | 7/7 workspaces; existing warnings only |
| npm run check:types | passed | 7/7 workspaces |
| npm run test:unit | passed | CI-05; global rerun 5/5 tasks; Server 167 suites/322 tests; Studio Vite consumer test included |
| npm run test:coverage | passed | 4/4 tasks; Core 176 suites/638 tests, Web 115/480, Server 167/322, Studio 14 suites/62 tests; server worker forced-exit warning after completion |
| npm run check:coverage | passed | all four workspaces; Studio lines 10.54% vs 10.21%, statements 10.44% vs 10.10%, functions 9.89% vs 9.65%, branches 9.16% vs 8.82% |
| npm run check:architecture | passed | 3,683 modules / 6,564 dependency edges; no violations |
| npm run check:test-integrity -- --base 0b2ea4cae4870067d506a257f2d3244ecbab742c | passed | atual; 4 changed test files, 1 testable source file, 16 excluded source files |
| `.env.local` safety audit | passed | root + server/web/studio files parse as dotenv; all 4 are ignored by Git; values never read or printed; exporter scripts pass `node --check`; Server package JSON parses |
| `docker compose --env-file .env.local -f docker-compose.yml config --quiet` | passed | root `.env.local` now satisfies Compose's required local variables; config output suppressed |
| npm run db:test -w @stardust/server | passed | CI-09; Compose versionado, root `.env.local`, portas alternativas e jobs `minio-init`/reset separados; migrations reaplicadas |
| npm run test:integration -w @stardust/server -- --runInBand src/tests/routes/auth/RetryUserCreationRoute.test.ts | failed | CI-10; confirmação Mailpit corrigiu o setup; caso não autenticado 401 passa, retry autenticado segue falhando e o relatório sanitizado não contém classe/status; suíte completa não executada |
| npm run build -w @stardust/server | passed | execução atual de `npm run build:server` concluiu; Server e dependências construíram sem erro |
| npm run build -w @stardust/web | passed | execução atual de `npm run build:web`: Next compiled, TypeScript e 21 páginas concluídos |
| npm run build -w @stardust/studio | passed | execução atual de `npm run build:studio`: Vite client/SSR concluídos; warning Node 22.17.0 abaixo do recomendado pelo React Router |
| npm --workspace @stardust/web run test:integration | passed on C1 revision 27 | 73/73 in 6.6m; `MODE=testing` and ServerMock; emitted existing UI/network warnings from fixtures/assets |
| Builds de Server, Web e Studio no CI do HEAD do PR | waived by user | Builds locais passaram; o usuário removeu CI remoto de PR da lista de evidências desta conclusão. |

## Checks e build do CI

| ID | Verificação | Estado | HEAD / evidência |
| --- | --- | --- | --- |
| CI-01 | check:test-integrity | passed | EV-08; detector reports passed |
| CI-02 | format | passed | EV-09; 7/7 workspaces, no fixes |
| CI-03 | check:code | passed | EV-09; 7/7 workspaces |
| CI-04 | check:types | passed | EV-09; 7/7 workspaces |
| CI-05 | passed | Atual; `npm run test:unit` passou em 5/5 tasks, incluindo teste consumidor Studio; Server 167 suítes/322 testes |
| CI-06 | passed | Current `npm run test:coverage`; Core 176/638, Web 115/480, Server 167/322; Studio 14/62; all 4 coverage workspaces passed |
| CI-07 | passed | Current `npm run check:coverage` passed all four workspaces; Studio lines 10.54% vs 10.21%, statements 10.44% vs 10.10%, functions 9.89% vs 9.65%, branches 9.16% vs 8.82% |
| CI-08 | check:architecture | passed | Atual; 3,683 módulos / 6,564 arestas, sem violações |
| CI-09 | db:test -w @stardust/server | passed | EV-05; `npm run db:test -w @stardust/server` passou novamente com Compose versionado, root `.env.local`, portas customizadas e sem override |
| CI-10 | passed | EV-17; full serial Server integration with ephemeral `NODE_OPTIONS=--max-old-space-size=6144`: 66/66 suites and 205/205 tests. |
| CI-11 | Web test:integration | passed, current rerun | EV-11; `npm --workspace @stardust/web run test:integration`, 73/73 in 5.6 minutes; `MODE=testing`; only the previously observed fixture/assets warnings |
| CI-12 | check:spec-definition | passed | EV-13; definition passou no rerun integrado |
| CI-13 | passed | EV-13; `check:spec-implementation` confirmou os 44 paths contratados no estado Git/filesystem |
| CI-14 | CI builds Server/Web/Studio | waived by user | Builds locais passaram; CI remoto de PR foi removido da lista de evidências desta conclusão por decisão do usuário. |
| CI-15 | check:plan-definition | passed | rerun atual após reconciliar ledger/status |

## Warnings e findings

- ACH-01 — resolved: o primeiro Plan definition check encontrou nomes de dependência diferentes dos nomes das tarefas. Os nomes foram alinhados e o check passou.
- IR-01 — resolved: a regra 6 das fixtures condiciona a verificação de persistência aos cenários que produzem efeitos persistidos; C3 também recebeu sensores atuais e paired re-review accepted.
- ACH-03 — deferred by user: nem `client-env.ts` nem `next.config.js` garantem recusa antes do listener; Next 16.3.0 faz bind antes de carregar a config. Guard atual impede handlers para URL remota, mas não satisfaz CA-02. O usuário pediu para tratar CA-02 posteriormente; não ampliar paths para esse critério nesta revisão.
- C1/C3 review state — C1/CA-02 pré-listener foi deferred pelo usuário; C3/portas loopback configuráveis foi aceita no review pareado. A integração Web 73/73 usa `ServerMock` e não demonstra CA-02.
- Reviewer C1 fix — verdict failed for CA-02; `next dev` with remote Supabase reached Ready/listener before `client-env.ts` validation. User approved the narrow revision 27 path amendment; the old review is invalidated for C1.
- Reviewer C1 revision 27 — verdict failed: IR-01 confirma que `next.config.js` carrega após `server.listen()`; IR-02 confirma que Studio coverage ratchet continua abaixo do baseline. Não criar teste dedicado de constants nem alterar baseline.
- ACH-02 — waived by user for this conclusion: OAuth real Google/GitHub não será executado; nenhum valor foi registrado.
- ACH-04 — resolved: variáveis MinIO/S3 existem em `.env.local` local e correspondem entre Server e Compose; nenhum valor foi registrado.
- ACH-05 — local containment complete, external rotation pending: quatro `.env.local` foram substituídos por configuração dotenv local-only; Compose config passou e as antigas cópias locais de credenciais de terceiros foram removidas. A tentativa anterior de `source` tratou conteúdo como código, emitiu saída com material de credenciais e tentou comandos locais. Nunca carregar arquivo como shell nem registrar valores. As evidências atuais não identificam quais valores antigos de quais provedores foram expostos; não revoguei credenciais externas às cegas. Revogação/provider rotation segue pendente.
- ACH-07 — resolved in Compose: Realtime recebe `METRICS_JWT_SECRET` vinculado ao JWT local. Startup ainda requer outras correções, registradas como ACH-11/12.
- ACH-08 — resolved in code: healthcheck Inngest não pode chamar `wget`, ausente na imagem; Bash existe e probe TCP em 8288 foi aplicado.
- ACH-09 — resolved in Compose: imagem distroless v14.15 oferece `postgrest --ready`, que chama o admin endpoint HTTP `/ready`; a probe real passou contra a instância local.
- ACH-10 — resolved in runtime: containers de Postgres e MinIO estavam sem endpoints na rede Compose; `down` sem `-v` e recriação conectaram os serviços e DNS interno voltou a resolver.
- ACH-11 — resolved in Compose/bootstrap: initializer idempotente atualiza as senhas de `authenticator` e `supabase_auth_admin` na imagem persistida; Auth e PostgREST reportam healthy.
- ACH-12 — resolved in Compose: Realtime declara `APP_NAME=realtime-dev`.
- ACH-13 — resolved: outros projetos locais ocupam portas padrão de Redis, Kong, Postgres, Mailpit e MinIO. A revisão 29 permite configurar portas host livres em `.env.local`, mantém os projetos externos intocados e preserva os defaults.
- ACH-14 — resolved in Compose/bootstrap: initializer cria `_realtime` com ownership `supabase_admin`, e Realtime depende da conclusão do initializer; startup real conectou e criou scopes.
- ACH-15 — resolved in Compose: admin server local usa host `localhost`, porta `3001`, e a healthcheck `postgrest --ready` verifica `/ready`; service bind público permaneceu preservado e a healthcheck reporta healthy.
- ACH-16 — resolved: reset executa o drop de `storage` com o role local `supabase_admin`; `supabase-db-reset` passou duas vezes e reaplicou as migrations.
- ACH-17 — resolved in package: `db:test` fixa o root `docker-compose.yml`, lê root `.env.local`, aguarda somente serviços long-running, roda `minio-init` separadamente e depois executa o reset. A execução base-only passou sem override temporário.
- IR-01 — resolved by Builder Fix/re-review rev28: os comandos SQL de role-passwords e schema `_realtime` foram consolidados no path contratado `docker/supabase/init/roles.sql`; arquivo extra removido. Implementation Reviewer aceitou I1/I2 sem findings.
- ACH-18 — resolved locally: guards Web/Studio e Server aceitam portas host loopback customizadas; C3 Reviewer e Infra rev29 aceitos. O stack usa API 54323, PostgreSQL 54345, Redis 6380, Mailpit 54327/54328 e MinIO 9002/9003; `.env.local` raiz e app/test URLs estão alinhados sem imprimir valores. `db:test` passou sem override temporário.
- ACH-19 — code/runtime passed locally: AuthFixture finds the generated recipient's Mailpit message, validates its recipient and local `/confirm-email` callback, verifies OTP, deletes only that message and then signs in; autoconfirm remains disabled. Focused route passed 2/2; full Server integration passed 66/66 suites and 204/204 tests.
- ACH-21 — resolved locally: `docker-compose.yml` sets GoTrue default JWT group to `authenticated`; after reset the focused auth route passed 2/2 and the full integration suite passed 66/66.
- ACH-22 — resolved for validation: default V8 heap OOMed at 58/66 suites (~4.4 GiB). Full serial suite passed after fresh reset using ephemeral `NODE_OPTIONS=--max-old-space-size=6144`, with 66/66 suites and 204/204 tests; no repository memory setting was changed.
- ACH-23 — resolved locally: GoTrue's default 30/hour email-send limiter had been exhausted by test retries and survives PostgreSQL resets. Compose now sets email-send to 1000 per hour and verify to 1000; Mailpit remains SMTP and autoconfirm remains false. Auth was recreated; fresh `db:test`, focused 2/2 and full integration 66/66 suites / 204/204 tests passed.
- ACH-25 — empty-database Web onboarding remains unverified: a previous real flow had no profile/catalog row after sign-up. The user removed this Web scenario from CA-03; it is not a gate for this conclusion, and no seed or synthetic identity was added.
- ACH-26 — resolved: the Studio env-schema consumer test mocked `nodePolyfills` as returning `undefined`, which made the Vite config spread fail. The mock now returns an empty plugin list; global unit and coverage suites pass and the Studio ratchet remains above baseline.
- ACH-27 — resolved: real local signup mail originally carried `/confirm-email?token=...`, but Web exposes `/api/auth/confirm-email`; the recovery template had the equivalent mismatch. Both local GoTrue template links now target the matching `/api/auth/...` route. Fresh Mailpit confirmation and recovery links both reached their intended Web states.
- ACH-24 — resolved: Architecture distingue Mailpit SMTP/API do serviço `supabase-templates` e descreve a confirmação por link `token_hash`; re-review pareado clear, sem findings.
- ACH-20 — accepted by paired Reviewer: plugin atualizado para `^0.28.0`, polyfills limitados ao client, `module`/`stream` excluídos para manter SSR; build Studio e startup HTTP 200 na porta 8001 passaram. VM-02 executou login e rota protegida conforme o Contract.
- Runtime persistence — passed: após `down`/`up --wait` com override temporário, uma linha PostgreSQL e objeto MinIO permaneceram; a chave Redis não persistiu. Linha/objeto/chave temporários foram removidos.
- ACH-06 — resolved: `apps/studio/src/vite-config.test.ts` exercita `parseEnv` pela borda consumidora, cobrindo loopback, rejeição remota sem ecoar valores e mode production. O teste focado e a suíte global passaram. Cobertura Studio: lines 10.54% vs 10.21%, statements 10.44% vs 10.10%, functions 9.89% vs 9.65%, branches 9.16% vs 8.82%; baseline preservado. Reviewer aceitou sem findings.
- EV-11 — `node --check apps/web/next.config.js`, focused Web check:code, check:types e integração Playwright passaram; Web integration 73/73 em 6.6 minutos. Warnings existentes incluem MODE/NO_COLOR, middleware deprecated, fixtures com requests não mockados e assets remotos 404; sem falha de teste.
- EV-14 — decisão do usuário em 2026-09-29 reduziu a validação manual a caminhos felizes concisos; nenhuma evidência runtime antiga foi reinterpretada por essa mudança. A Spec rev33 e as regras gerais foram alinhadas; Spec Reviewer clear, sem findings bloqueantes.
- EV-13 — rodada integrada atual: `check:types`, `check:code`, `test:unit` (5/5 tasks; Server 167/322), `check:architecture` (3.683 módulos, zero violações), `check:test-integrity`, `check:coverage`, `check:spec-definition`, `check:plan-definition`, `check:spec-implementation` (44 paths) e builds locais Server/Web/Studio passaram. O Studio permanece acima dos quatro baselines; CI-14 de PR não foi executado.
- EV-15 — S3: `db:test` passou com base Compose e root `.env.local`; feedback route integration passou 1/1 suite e 4/4 tests. Full Server integration executou em série com `NODE_OPTIONS=--max-old-space-size=6144`, terminou em 65/66 suites e 204/205 tests; única falha foi `RateLimiterRoute.test.ts` usando Redis hardcoded em porta 6379, incompatível com o port configurável local, classe `MaxRetriesPerRequestError`. O `.env.testing` ignorado foi alinhado à porta Redis do Compose por parser dotenv, sem imprimir valores; o teste usa `ENV.redisUrl`, e a suíte direcionada passou 1/1 suite e 8/8 tests. `check:types`, `check:architecture`, `check:test-integrity` e `check:code` passaram (warnings existentes). Paired review aceito; full-suite integrada permanece pendente.
- EV-16 — Spec amendment rev35 adiciona `RateLimiterRoute.test.ts` ao mapa canônico e explicita RF-09 usando `ENV.redisUrl`. `check:spec-definition` e `check:plan-definition` passaram; Spec Reviewer rev35 clear, sem findings. Nenhuma migration mudou.
- EV-17 — após `npm run db:test -w @stardust/server`, a suíte de integração Server completa passou em série com `NODE_OPTIONS=--max-old-space-size=6144`: 66/66 suites e 205/205 testes. A suíte Redis usa `ENV.redisUrl`; migration diff vazio.
- EV-18 — Spec rev36 removeu do mapa canônico a remoção antiga de Kong, já ausente na base `HEAD`; `check:spec-implementation --base HEAD` passou com 57 paths. `check:spec-definition`, `check:plan-definition` e Spec Reviewer rev36 passaram/clear.
- EV-19 — sensores globais passaram: `check:code` (warnings preexistentes), `check:types`, `test:unit` (5/5 tasks; Server 167/167 suites, 322/322 testes), `check:coverage` (quatro workspaces acima do baseline), `check:architecture` (3.688 módulos, zero violações), `check:test-integrity`, `check:spec-definition`, `check:plan-definition`, `check:spec-implementation --base HEAD` e `git diff --check`.
- EV-20 — por decisão do usuário, evidências manuais Web browser, signed PUT/GET MinIO no browser, OAuth real e CI remoto de PR foram removidas dos gates; os fluxos não executados permanecem explicitamente não verificados. Spec rev37 foi clear.
- EV-21 — auditoria CA-05 passou: nenhum artefato seed/snapshot/import/export de dados apareceu entre paths tracked/untracked; `[db.seed] enabled = false`; `db:test` resetou sem dados semeados; Compose logs não foram usados para registrar valores sensíveis.
- EV-22 — Spec rev38 remove referências obsoletas a VM-01; a observação não bloqueante do Reviewer sobre CA-12 foi resolvida na rev39, que limita o Auth local comprovado ao Server e esclarece a evidência Web mockada/configuração. Spec Reviewer rev39 clear.
- EV-23 — fechamento integrado: Spec/Plan definitions passaram na rev39, `check:spec-implementation --base HEAD` passou (57 paths), Compose `config --quiet` passou, `git diff --check` passou e migrations continuam byte-a-byte inalteradas.
- EV-24 — por decisão do usuário, CA-03 cobre somente o fluxo protegido do Studio; Web CA-03 e seu pré-requisito de perfil/catálogo não são gates. Spec Reviewer rev40: clear. `check:spec-definition`, `check:plan-definition`, `check:spec-implementation --base HEAD`, `check:test-integrity` e `git diff --check` passaram; migrations permanecem inalteradas.
- EV-25 — revisão para publicação em `08ccbdc0c87717026775af99f038f67b397b58be`: nove commits semânticos criados; hooks `check:code` passaram em 7/7 workspaces. Com base `0b2ea4cae4870067d506a257f2d3244ecbab742c`, `check:spec-definition`, `check:plan-definition`, `check:spec-implementation` (57 paths), `check:test-integrity` (4 test files) e `git diff --check` passaram. Nenhuma migration mudou. ACH-05 continua pendente porque os provedores/alvos antigos não estão identificados.
- EV-26 — PR [#606](https://github.com/JohnPetros/stardust/pull/606) criado em `2026-09-29`, base `main`, head `bc5317a2d7dcb28df139db428e773bffd8f04d5b`; `origin/main` é ancestral e worktree limpa. Ao registrar, workflows aplicáveis estavam `IN_PROGRESS`/`QUEUED`; nenhum resultado foi presumido.
- EV-27 — Builder Fix para falhas do CI no head anterior do PR: Web não recebia `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no ambiente Jest; a configuração Web fornece uma chave dummy somente quando `NODE_ENV=test`. O detector de complexidade atingia os validadores de endpoint Web/Studio e a validação Server; helpers foram extraídos, `parseEnv` Studio simplificado e as consultas do repositório PostgreSQL divididas. O baseline CodeMultiVitals recebeu snapshots apenas para funções Server com warning/error em paths alterados/novos e providers movidos; nenhum threshold foi alterado. `check:code` passou em 7/7 workspaces (warnings preexistentes), `check:types` passou em 7/7, `test:unit` passou (167 suites/322 testes Server), cobertura Web passou (115 suites/480 testes), `check:coverage` passou com os quatro workspaces acima do baseline, `check:complexity` passou, `check:architecture` passou (3.688 módulos/zero violações), `check:test-integrity`, definições Spec/Plan e path check (57 paths) passaram. `db:test` aplicou as migrations versionadas no Supabase local; integração Server passou 66/66 suites e 205/205 testes. A suíte Web completa chegou a 49/73 antes de ser interrompida para limpar um processo de teste órfão; os dois casos reportados como falhos passaram em rerun focado (2/2). `git diff --check` passou no worktree após as atualizações de evidência. O Implementation Reviewer pareado aceitou o Builder Fix sem findings bloqueantes. Correção de código commitada em `568e9eed15bbabd21ea62edbc2a6533357e894b8`; o CI remoto aguarda push.
- EV-28 — re-review final do `.code-multivitals-baseline.json`: Reviewer confirmou que os snapshots agregam 2.831 funções em warning/error, sem funções com severidade agregada `ok`; thresholds ciclomático 15, cognitivo 25, comprimento 70, nesting 4 e Halstead 800 não mudaram. Veredito do Builder Fix continua aceito, sem findings bloqueantes; checks remotos ainda pendentes.
- EV-29 — o workflow de integração Web do head `0884ac0a56d94bdced02776def0b210adda81517` falhou ao iniciar Next em `MODE=testing`, porque o runner usa `NODE_ENV=development` e `client-env` ainda exigia a chave publishable nesse modo. O fallback `test-publishable-key` agora cobre `NODE_ENV=test` ou `MODE=testing`; em outros modos a publishable key continua obrigatória. O paired Implementation Reviewer aceitou a correção sem findings bloqueantes. No worktree, `check:code` (7/7), `check:types` (7/7), `test:unit` (167 suítes/322 testes Server), cobertura Web (115 suítes/480 testes), `check:coverage`, `check:complexity`, `check:spec-definition`, `check:plan-definition`, `check:spec-implementation` (57 paths), `check:test-integrity` e `git diff --check` passaram. Smoke Web focado passou 2/2 com `MODE=testing`; novo CI aguarda publicação do fix.
- S3 paired implementation review — accepted, Spec rev35, sem findings bloqueantes. Reviewer confirmou publishable key única no runtime Server, autorização God Account antes dos repositories Postgres, queries bindadas, caminho request-scoped/RLS preservado para usuários, CA-13 e full integration passados e migrations inalteradas. CA-12 tem evidência Server pelo gateway; Web browser foi removido do gate por decisão do usuário.

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| --- | --- | --- | --- |
| ACH-01 | dependências do ledger não usavam os nomes idênticos às tarefas | manter referências de dependência iguais às células Name e executar check:plan-definition antes do save e de cada wave | concluído |
| ACH-02 | configuração OAuth GitHub não localizada no ambiente development inspecionado | evidência OAuth real removida do gate por decisão do usuário; credenciais ficam fora do Git | waived by user |
| ACH-03 | Next chama `server.listen()` antes de carregar next.config.js | usuário pediu para tratar CA-02 em trabalho posterior; não ampliar o path map agora | deferred |
| ACH-04 | variáveis MinIO/S3 locais necessárias ao smoke estavam ausentes | configuração local foi substituída com dotenv sem registrar valores | resolvido localmente |
| ACH-05 | conteúdo anterior que não era dotenv foi avaliado como shell e expôs saída sensível | ambientes locais foram substituídos por assignments dotenv e segredos locais regenerados; os registros não identificam provedores/credenciais antigas para uma revogação seletiva segura | pendente de identificar os alvos e revogar/rotacionar |
| ACH-06 | cobertura do Studio ficou abaixo do baseline após a execução atual | testar a borda consumidora Vite e manter o baseline intacto | resolved |
| ACH-29 | Playwright inicia a Web App com `MODE=testing` e `NODE_ENV=development`, não ativando o fallback que cobria apenas Jest | aceitar a chave dummy apenas em `NODE_ENV=test` ou `MODE=testing`; manter a publishable key obrigatória nos demais modos | corrigido e validado localmente; CI da revisão atual pendente |

## Decisões

- Três Builders com ownership estável por Infra, Server e Clientes; Rules, Architecture e artefatos SDD ficam sob ownership da task principal.
- Nenhum seed, snapshot, conta sintética ou sincronização de staging; cadastro e OAuth reais são necessários conforme a Spec revisão 29.
- A implementação mantém Supabase local como único backend de desenvolvimento e validação.
- Em 2026-09-26, o usuário solicitou renomear os ambientes locais de desenvolvimento para `.env.local`, corrigir CI-07 pela borda consumidora Studio e adiar CA-02. Isso supersede a recusa anterior do harness; nenhum baseline será alterado.

## Lições aprendidas

- Ledger: dependências devem citar exatamente o nome da tarefa, além de permanecerem acíclicas.

## Alinhamento documental

- Spec: revisão 40 em andamento; CA-03 cobre Studio; Reviewer rev40 clear. Publishable key, Envoy, admin feedback PostgreSQL e Redis configurável no teste existem; Drizzle/RLS amplos ficam para task posterior.
- Plan: alinhado à revisão 40; Builders e paired reviews aceitos; full Server integration e sensores globais passaram. Web CA-03, MinIO browser, OAuth real e CI de PR foram removidos dos gates por decisão do usuário.
- Rules/Architecture/Tooling: atualizadas e alinhadas à implementação; sem alteração visual, Design Contract/Pencil não aplicável.

## Conclusão

- Estado: in_progress
- Estado: in_progress; não marcar como completed ainda.
- Gates locais da revisão 40: Spec Reviewer clear; CA-03 Studio passed; definitions, path/integrity checks, coverage, arquitetura, tipos, código, testes, Server integration, builds locais e Compose config passaram. Nenhuma migration foi alterada. Web CA-03, browser MinIO, OAuth real e CI remoto de PR foram dispensados pelo usuário; isso não é registrado como evidência aprovada. CA-02 foi adiado pelo usuário.
- Pendências para conclusão formal: ACH-05 — revogação provider-side das credenciais antigas continua pendente porque os alvos não estão identificados; CI do head com ACH-29 corrigido ainda aguarda publicação. O fluxo `conclude-spec` exige CI verde do PR antes de marcar Spec/Plan/Evaluation como completed.
- Concluído nesta rodada: Spec rev40 revisada e clara; Plan/Evaluation reconciliados com a decisão de remover Web do CA-03 e com as evidências/checkers já executados.
- Próxima ação: publicar o fix de ACH-29 e validar os checks do novo head no PR #606. Resolver ACH-05 exige identificar quais provedores receberam credenciais antigas; até isso ser confirmado e rotacionado, Spec/Plan/Evaluation permanecem `in_progress`. Drizzle permanece para a próxima task.
