---
title: Supabase local development — implementation plan
status: in_progress
spec: ./spec.md
spec_revision: 40
evaluation: ./evaluation.md
updated_at: 2026-09-29
---

# Execution status

- **Spec:** revisão 40, in_progress; CA-03 agora valida apenas Studio; Web CA-03 saiu do gate por decisão do usuário. Evidência Web/MinIO/OAuth e CI de PR também removida dos gates. Chaves publishable, gateway Envoy, PostgreSQL feedback e Redis configurável estão implementados; Drizzle/RLS ficam para a próxima task.
- **Plan:** in_progress; necessário pela dependência entre o stack Compose, o reset do PostgreSQL, os adapters locais, a integração Server e os fluxos reais Web/Studio.
- **Fase atual:** W7 — implementação e paired reviews concluídos; Spec Reviewer rev40 clear; P2 mantém o handoff em andamento enquanto ACH-05 e os gates formais de PR não forem resolvidos.
- **Próxima ação:** identificar quais credenciais de quais provedores foram expostas no incidente ACH-05 e revogar/rotacionar esses alvos; sensores integrados passaram sem alterar migrations.
- **Blockers externos:** ACH-05 — provedores e credenciais antigas afetadas não estão identificados nas evidências disponíveis, então a revogação seletiva segura não foi executada. CA-02 permanece deferred por decisão do usuário, não como gate desta conclusão.
- **Findings:** ACH-25 descreve onboarding Web removido do CA-03 e não é gate; CA-03 agora cobre somente Studio. OAuth real e CI de PR foram dispensados dos gates a pedido do usuário. ACH-26/27 corrigiram, respectivamente, o teste de consumo Vite e os links Auth locais.
- **Builders ativos:** nenhum; Infra, Server, C3/C4, A1 e reviews pareados concluídos. Somente a Task principal mantém o handoff P1 aberto.
- **Builders próximos:** nenhum; Web browser, MinIO browser, OAuth real e CI de PR foram removidos dos gates por decisão do usuário; CA-02 permanece deferred.
- **Ownership da task principal:** atualizar as Rules, Spec, Plan, Evaluation e Architecture; coordenar nomes de serviços, portas e URLs entre Compose e apps; não registrar credenciais, tokens ou corpos sensíveis; integrar evidências e findings.
- **Design Contract:** não aplicável; a Spec não altera widgets ou comportamento visual. As validações manuais reais seguem somente os caminhos felizes contratados, com evidência concisa; diagnóstico detalhado só é coletado em caso de falha.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| ---- | ------- | ----- | ---- | ---------- | ------------- | ------ | -------------- |
| W0 | Task principal | P0 | Rules e kickoff | — | — | completed | Rules alinhadas, Evaluation criada e Spec em in_progress; diff de Rules revisado |
| W1 | Builder Infra | I1 | Compose stack | Rules e kickoff | Server adapters; Client guards | completed | configuração Compose válida e árvore do stack atende à Spec |
| W1 | Builder Server | S1 | Server adapters | Rules e kickoff | Compose stack; Client guards | completed | endpoint guards e adapters Server implementados nos paths contratados |
| W1 | Builder Clientes | C1 | Client guards | Rules e kickoff | Compose stack; Server adapters | blocked | CA-02 ficou para trabalho posterior por decisão do usuário; guard atual em next.config.js falha após bind |
| W1 | Task principal | E1 | Convenção `.env.local` | Rules e kickoff | Cobertura pela borda Vite | completed | root/apps usam `.env.local`, exportadores e docs atualizados, env ignorado e outros modos preservados |
| W1 | Builder Clientes | C2 | Cobertura pela borda Vite | Rules e kickoff | Convenção `.env.local` | completed | teste consumidor, cobertura Studio e Implementation Reviewer pareado passaram |
| W2 | Builder Infra | I2 | Compose runtime | Compose stack | — | completed | stack healthy, reset repetível, persistência, paths contratados e tooling revisados |
| W2 | Builder Server | S2 | Server integration | Compose stack, Server adapters, Compose runtime | — | completed | db:test e integração Server passam contra o Compose local após confirmação Mailpit e JWT group local |
| W2 | Builder Clientes | C3 | Portas loopback configuráveis | Cobertura pela borda Vite | Server integration; Compose runtime | completed | Web/Studio aceitam portas host configuradas em loopback; remotos/esquemas inválidos são rejeitados; CA-02 pré-listener permanece adiado |
| W3 | Task principal | A1 | Architecture docs | Server integration, Client guards, Compose runtime | — | completed | Architecture revisada e aceita após integração local |
| W4 | Task principal | P1 | Validação integrada e handoff | Compose runtime, Server integration, Architecture docs, Client guards | — | completed | CA-03 Studio passou; Web CA-03, MinIO/OAuth browser e CI de PR foram removidos/dispensados por decisão do usuário; CA-02 fica deferred |
| W2 | Builder Clientes | C4 | Polyfills compatíveis com Vite 8 | Portas loopback configuráveis | Server integration; Architecture | completed | build client/SSR e fluxo autenticado local do Studio revisados e aceitos |
| W5 | Task principal | D2 | Spec amendment review | Architecture docs | — | completed | Spec Reviewer rev34–40 clear; CA-03 ajustado para Studio por decisão do usuário |
| W6 | Builder Infra | I3 | API gateway para chave publishable | Web publishable key | — | completed | IR-02 corrigido e re-review aceito; smoke HTTP/WS mock passou; Server Auth integrado ao Envoy passou na suíte completa |
| W6 | Builder Server | S3 | Server publishable key e feedback PostgreSQL | API gateway para chave publishable; Web publishable key | — | completed | paired review aceito; CA-13 passou; teste Redis usa `ENV.redisUrl`; Server integration 66/66 suites, 205/205 testes |
| W6 | Builder Clientes | C5 | Web publishable key | Spec amendment review | — | completed | Paired Reviewer aceitou diff e checks Web passaram; validação real Web/Auth local continua fora da evidência integrada concluída |
| W7 | Task principal | P2 | Docs, validação integrada e paired review | API gateway para chave publishable; Server publishable key e feedback PostgreSQL; Web publishable key | — | in_progress | Architecture/Rules/Evaluation alinhadas; sensores integrados passaram; fechar ACH-05 e fluxo formal de PR |

## Task cards

### P0 — Rules e kickoff

- **Status/owner:** completed — Task principal; implementation-reviewer-agent aceitou o diff após resolução de IR-01.
- **Dependências/paralelismo:** sem dependências; termina antes dos Builders para que as Rules alinhadas governem a implementação.
- **Paths:** documentation/rules/code-conventions-rules.md; documentation/rules/provision-layer-rules.md; documentation/rules/server-routes-testing-rules.md; documentation/rules/rules.md; documentation/features/global/supabase-local-development/spec.md; documentation/features/global/supabase-local-development/evaluation.md.
- **RF/CA:** RF-08; CA-08.
- **Resultado observável:** as Rules proíbem testes dedicados de providers, constants e fixtures; descrevem a validação pelas bordas consumidoras e o setup Compose. Evaluation existe antes de qualquer alteração de source/teste, e a Spec passa para in_progress sem mudar revisão ou contrato.
- **Rules:** documentation/sdd.md; documentation/rules/code-conventions-rules.md; documentation/rules/provision-layer-rules.md; documentation/rules/server-routes-testing-rules.md.
- **Exit:** diff de Rules alinhado à revisão 26; Evaluation aberta; Spec em in_progress; Reviewer independente sem finding bloqueante.

### I1 — Compose stack

- **Status/owner:** completed — Builder Infra; I1/I2 aceitos pelo Reviewer pareado após correção IR-01 e runtime local.
- **Dependências/paralelismo:** depende de P0; paralelo com S1 e C1. Os nomes de serviços, portas e variáveis são congelados pela revisão 26.
- **Paths:** .gitignore; docker-compose.yml; docker/supabase/kong.yml; docker/supabase/init/roles.sql; docker/supabase/init/storage-compatibility.sql; docker/supabase/reset.sh; docker/supabase/templates/ConfirmSignUpTemplate.html; docker/supabase/templates/ConfirmPasswordResetTemplate.html.
- **RF/CA:** RF-01, RF-04, RF-05, RF-09, RF-10; CA-01, CA-04, CA-05, CA-09, CA-10.
- **Resultado observável:** Compose define o stack mínimo, imagens fixadas, health checks, readiness, prefixos supabase-, volumes apenas de PostgreSQL e MinIO, templates read-only, bucket idempotente e reset sem seed que limpa Auth/public/storage e reaplica migrations locais.
- **Rules:** documentation/sdd.md; documentation/rules/server-application-rules.md; documentation/rules/database-rules.md; AGENTS.md.
- **Exit:** docker compose config passa; a configuração não declara os serviços excluídos nem persistência para serviços descartáveis; serviços e portas correspondem ao contrato antes do smoke local de I2.

### S1 — Server adapters

- **Status/owner:** completed — Builder Server; paired Reviewer aceitou S1/S2. CA-02 está deferred; CA-03 Web e CA-06 permanecem como gates de browser em P1.
- **Dependências/paralelismo:** depende de P0; paralelo com I1 e C1. A execução real contra Compose fica em S2.
- **Paths:** apps/server/.env.example; apps/server/src/constants/env.ts; apps/server/src/provision/storage/S3FileStorageProvider.ts (Remove); apps/server/src/provision/storage/S3FileObject.ts (Remove); apps/server/src/provision/storage/s3/S3FileStorageProvider.ts (Create); apps/server/src/provision/storage/s3/S3FileObject.ts (Create); apps/server/src/provision/storage/DropboxStorageProvider.ts (Remove); apps/server/src/provision/storage/dropbox/DropboxStorageProvider.ts (Create); apps/server/src/provision/storage/index.ts; apps/server/src/app/hono/middlewares/StorageMiddleware.ts.
- **RF/CA:** RF-02, RF-03, RF-06; CA-02, CA-03, CA-06.
- **Resultado observável:** Server development aceita apenas endpoints locais esperados; o provider S3 usa MinIO em development e R2 em production; Dropbox e S3 ficam nas subpastas contratadas; middleware mantém o port e o fluxo de upload existentes.
- **Rules:** documentation/rules/server-application-rules.md; documentation/rules/provision-layer-rules.md; documentation/rules/database-rules.md; documentation/rules/code-conventions-rules.md.
- **Exit:** Server compila e typecheck passa; endpoints remotos são recusados no startup e nenhum segredo ou erro do SDK é exposto.

### C1 — Client guards

- **Status/owner:** blocked — o usuário pediu para lidar com CA-02 mais tarde; Next 16.3.0 abre o listener antes de carregar `next.config.js`, então o critério continua sem solução na revisão vigente.
- **Dependências/paralelismo:** depende de P0; paralelo com I1 e S1; paths não se sobrepõem aos demais Builders.
- **Paths:** apps/web/.env.example; apps/web/next.config.js; apps/web/src/constants/client-env.ts; apps/studio/src/constants/envSchema.ts; scripts/check-test-integrity.mjs; scripts/tests/check-test-integrity.test.mjs.
- **RF/CA:** RF-02, RF-03, RF-08; CA-02, CA-03, CA-08.
- **Resultado observável:** Web recusa Supabase/CDN remotos, Studio recusa Server/CDN remotos, ambos aceitam somente endpoints locais esperados, e o detector reprova testes dedicados de providers, constants e fixtures com indicação do path.
- **Rules:** documentation/rules/web-application-rules.md; documentation/rules/studio-appllication-rules.md; documentation/rules/code-conventions-rules.md; documentation/rules/server-routes-testing-rules.md.
- **Exit:** Web e Studio passam typecheck; endpoint remoto Web é recusado antes do listener por uma entrypoint validada; detector passa; nenhum teste dedicado a constants é criado; `check:coverage` preserva os baselines.

### E1 — Convenção `.env.local`

- **Status/owner:** completed — Task principal; quatro arquivos locais renomeados sem ler valores, documentação e launchers atualizados; ignore e sintaxe dotenv verificados.
- **Dependências/paralelismo:** depende da revisão 29 aprovada; paralelo com C2, sem paths sobrepostos.
- **Paths versionados:** `AGENTS.md`; `apps/server/package.json`; `documentation/tooling.md`; Rules Server/Web/Studio; `scripts/export-studio-app-e2e-env.mjs`; `scripts/export-web-app-e2e-env.mjs`.
- **Artefatos locais ignorados:** root e os três apps agora usam `.env.local`; preservar `.env.testing`, `.env.staging` e `.env.production`.
- **RF/CA:** RF-11; CA-11.
- **Exit:** referências ativas usam `.env.local`, quatro arquivos locais migrados, `git check-ignore` confirma exclusão, parser dotenv aceita os arquivos e nenhum valor de env foi impresso.

### C2 — Cobertura pela borda Vite

- **Status/owner:** completed — Builder Clientes; teste consumidor implementado pela composição `apps/studio/vite.config.ts` → `parseEnv`, sem teste isolado de constants; coverage e paired review passaram.
- **Dependências/paralelismo:** depende da revisão 29 aprovada; paralelo com E1.
- **Paths:** `apps/studio/src/vite-config.test.ts` (Create).
- **RF/CA:** RF-08; CA-08; sensores `test:unit`, `test:coverage` e `check:coverage`.
- **Exit:** casos de endpoint loopback, URL remota e mode não-development exercitam a borda consumidora; cobertura e ratchet do Studio passam; detector de integridade passa.

### C3 — Portas loopback configuráveis

- **Status/owner:** completed — Builder Clientes; paired Reviewer aceitou a revisão 29 sem findings; CA-02 pré-listener permanece adiado.
- **Dependências/paralelismo:** depende da revisão 29 aprovada; paralelo com S2, sem paths sobrepostos.
- **Paths:** `apps/web/next.config.js`; `apps/web/src/constants/client-env.ts`; `apps/studio/src/constants/envSchema.ts`; `apps/studio/src/vite-config.test.ts`.
- **RF/CA:** RF-02; CA-02 permanece adiado conforme decisão do usuário; VM-06 valida portas customizadas e rejeições.
- **Resultado observável:** Web e Studio aceitam endpoints `http` em loopback sem exigir porta fixa; endpoints remotos e esquemas diferentes são recusados em development com mensagem sanitizada. A verificação de `next.config.js` é proteção adicional e não satisfaz o requisito pré-listener de CA-02.
- **Exit:** sensores atuais passam; Studio Vite consumer 6/6, Web integration 73/73, checks de código e tipos Web/Studio e smoke Next aceitam/rejeitam conforme contrato; Reviewer pareado aceitou. CA-02 continua adiado.

### C4 — Polyfills compatíveis com Vite 8

- **Status/owner:** completed — Builder Clientes; paired Reviewer aceitou rev31 sem findings.
- **Dependências/paralelismo:** depende de Portas loopback configuráveis; paralelo com Server integration, sem paths sobrepostos.
- **Paths:** `apps/studio/package.json`; `apps/studio/vite.config.ts`; `package-lock.json`.
- **RF/CA:** RF-02, RF-03; CA-03, CA-09; VM-02, VM-06.
- **Resultado observável:** plugin upstream substituto do incompatível `vite-plugin-node-polyfills@0.2.0` suporta Vite 8/Rolldown e não chama hooks esbuild legados.
- **Evidence:** `npm run build -w @stardust/studio` passou com bundles client e SSR; dev startup em `127.0.0.1:8001` retornou HTTP 200. `vite-plugin-node-polyfills@^0.28.0` é client-only e exclui `module`/`stream` do polyfill; Reviewer pareado aceitou sem findings.
- **Exit:** focused checks, build e paired review passaram; VM-02 autenticou, abriu dashboard e rota protegida. Um erro independente de `/reporting/feedback` 500 permanece documentado fora do Contract.

### I2 — Compose runtime

- **Status/owner:** completed — Builder Infra; Reviewer pareado aceitou I1/I2 após consolidar o bootstrap em `roles.sql`; paths dentro do Contract.
- **Dependências/paralelismo:** depende de I1; o reset e os smokes de persistência terminam antes de S2.
- **Paths:** docker-compose.yml; documentation/tooling.md.
- **RF/CA:** RF-01, RF-04, RF-05, RF-09, RF-10; CA-01, CA-04, CA-05, CA-09, CA-10.
- **Resultado observável:** stack sobe duas vezes; os 10 serviços de longa duração ficam healthy; `minio-init` e reset passam duas vezes; signup e recovery locais entregam templates renderizados ao Mailpit; down/up preserva dados PostgreSQL/MinIO e descarta Redis; todos os artefatos temporários são removidos.
- **Rules:** documentation/sdd.md; documentation/rules/server-application-rules.md; documentation/rules/database-rules.md; tooling local de AGENTS.md.
- **Exit:** smoke local e auditoria de persistência passaram; tooling documenta Compose, reset, OAuth, MinIO, Mailpit e db:test → test:integration; logs permanecem sanitizados; Implementation Reviewer pareado aceitou sem findings.

### S2 — Server integration

- **Status/owner:** completed — Reviewer aceitou após `db:test`, rota focada 2/2 e integração Server completa 66/66 suítes / 204/204 testes com heap Node efêmero de 6144 MiB.
- **Dependências/paralelismo:** depende de I1, S1 e I2; executa após o stack Compose estar healthy.
- **Paths:** apps/server/package.json; apps/server/src/constants/env.ts; apps/server/src/tests/fixtures/LocalSupabaseProxy.ts.
- **RF/CA:** RF-02, RF-05, RF-09; CA-01, CA-03, CA-05, CA-09.
- **Resultado observável:** db:test prepara o profile Compose, aguarda health e executa supabase-db-reset; endpoints aceitam portas host não padrão apenas em loopback e protocolo local; LocalSupabaseProxy valida loopback/readiness sem iniciar Supabase CLI; a suíte Server usa Auth e PostgreSQL locais, migrations versionadas e nenhum seed.
- **Rules:** documentation/rules/server-routes-testing-rules.md; documentation/rules/database-rules.md; documentation/rules/server-application-rules.md; AGENTS.md.
- **Exit:** npm run db:test -w @stardust/server seguido de npm run test:integration -w @stardust/server passa contra o stack Compose local; nenhum endpoint remoto é chamado.

### ACH-19 — Confirmação de conta na fixture Server

- **Status/owner:** completed — Builder Server; Spec Reviewer clear rev31 e Reviewer de implementação aceitou; limite local de email foi elevado e Auth recriado.
- **Assignment:** Spec rev31; RF-09, RF-11; CA-09; VM-03/EV-02; Server Routes Testing e Server Application Rules.
- **Paths:** `apps/server/.env.example`; `apps/server/src/constants/env.ts`; `apps/server/src/tests/fixtures/AuthFixture.ts`. Ignored local test config `apps/server/.env.testing` now points `MAILPIT_API_URL` at the configured loopback Mailpit port 54327.
- **Resultado observável:** a fixture aguarda a mensagem endereçada à conta aleatória recém-criada no Mailpit loopback, confirma pelo OTP sem ecoá-lo, apaga somente a mensagem consumida e então faz sign-in; GoTrue mantém confirmação obrigatória.
- **Exit:** testes de rota focados e suíte Server passam contra Compose; nenhuma URL remota, token ou corpo de email é registrado.

### ACH-20 — Vite polyfills no Studio

- **Status/owner:** completed — Builder Clientes; paired Reviewer aceitou rev31 sem findings. Build passed and Vite dev returned HTTP 200 at `127.0.0.1:8001`.
- **Assignment:** Spec rev31; RF-02/RF-03; CA-03/CA-09; VM-02/VM-06; Studio Application Rules.
- **Paths:** `apps/studio/package.json`; `apps/studio/vite.config.ts`; `package-lock.json`.
- **Resultado observável:** plugin de node polyfills usa versão compatível com Vite 8/Rolldown e `npm run dev -w @stardust/studio` alcança Ready em porta livre.
- **Evidence:** build Studio client/SSR passou; Vite dev em `127.0.0.1:8001` retornou HTTP 200. Plugin 0.28.0 limita polyfills ao client e exclui `module`/`stream`; paired review aceito. VM-02 chegou à rota protegida e documenta o erro de feedback fora do Contract.
- **Exit:** focused checks, build, paired review and VM-02 authenticated flow pass; a screenshot is not required because this task does not change UI.

### ACH-21 — GoTrue default JWT role

- **Status/owner:** Compose change and full integration complete — Builder Server.
- **Assignment:** Spec rev31, existing `docker-compose.yml` path; S2, CA-03/CA-09, VM-01/02.
- **Evidence:** authenticated focused route receives a GoTrue JWT without a `role` claim; PostgREST rejects it as `role "" does not exist`, while required PostgreSQL roles exist.
- **Change:** set the local GoTrue default JWT group to the local `authenticated` role; keep production and remote configuration untouched.
- **Evidence:** after `db:test`, focused auth route passed (1 suite/2 tests); full Server integration passed 66/66 suites and 204/204 tests with ephemeral 6144 MiB Node heap.
- **Exit:** fresh email-confirmed account JWT has expected role classification; focused and full Server integration pass consistently.

### ACH-23 — GoTrue local email rate limit

- **Status/owner:** implementation and full integration complete — Builder Server.
- **Assignment:** Spec rev31, existing `docker-compose.yml` path; S2, RF-04, CA-04/CA-09, VM-03.
- **Evidence:** previous attempts exhausted GoTrue's default email cap (429 `over_email_send_rate_limit`); PostgreSQL reset does not reset its in-memory counter. Raising local limits and recreating Auth resolved the issue.
- **Change:** local Compose sets `GOTRUE_RATE_LIMIT_EMAIL_SENT=1000/1h` and `GOTRUE_RATE_LIMIT_VERIFY=1000`; retains `GOTRUE_MAILER_AUTOCONFIRM=false` and Mailpit SMTP. Auth was recreated to clear counters.
- **Evidence:** fresh `db:test`, focused auth route passed (1 suite/2 tests), and full integration passed (66/66 suites, 204/204 tests) with ephemeral 6144 MiB Node heap.
- **Exit:** confirmation/recovery flows remain local; fresh reset, focused route and full Server integration pass.

### A1 — Architecture docs

- **Status/owner:** completed — Task principal; Architecture re-review clear, sem findings.
- **Dependências/paralelismo:** depende de S2, C1 e I2; documenta o fluxo integrado já estabilizado.
- **Paths:** documentation/architecture.md.
- **RF/CA:** RF-03, RF-06, RF-09, RF-10; CA-03, CA-06, CA-09, CA-10.
- **Resultado observável:** Architecture registra Auth/REST/Realtime locais, PostgreSQL direto preparado para futura adoção de Drizzle, PostgREST temporário para repositories atuais e fluxo StorageMiddleware → S3FileStorageProvider com MinIO em development e R2 em production.
- **Rules:** documentation/architecture.md; documentation/sdd.md; documentation/rules/rules.md.
- **Exit:** a documentação corresponde ao runtime integrado sem acrescentar schema, migration, endpoint ou dependência.

### D2 — Spec amendment review

- **Status/owner:** pending — Task principal; revisão 34 inclui chaves publishable para os apps e PostgreSQL direto somente no feedback administrativo; Drizzle/RLS ficam para task posterior.
- **Paths:** Architecture/Rules alinhadas; Spec e Plan revisão 34.
- **RF/CA:** RF-12/RF-13; CA-12/CA-13.
- **Exit:** definition passa, mapa contém cada path uma única vez e Spec Reviewer fica clear antes da implementação.

### I3 — API gateway para chave publishable

- **Status/owner:** pending — Builder Infra; editar somente Compose e arquivos do gateway.
- **Paths:** `docker-compose.yml`; `docker/supabase/kong.yml` (Remove); `docker/supabase/envoy/bootstrap.yaml`; `docker/supabase/envoy/clusters.yaml`; `docker/supabase/envoy/listener.template.yaml`; `docker/supabase/envoy/entrypoint.sh`.
- **RF/CA:** RF-01/RF-12; CA-01/CA-12.
- **Exit:** Compose fica healthy e uma chave publishable autentica Auth/REST/Realtime; nenhuma chave aparece em logs ou nos envs dos apps.

### S3 — Server publishable key e feedback PostgreSQL

- **Status/owner:** in_progress — Builder Server; implementação contratada concluída, aguardando full integration rerun e paired review.
- **Paths:** env, package/dependência PostgreSQL, cliente Supabase, `database/postgres/*`, FeedbackRouter e teste de integração existente conforme mapa da Spec rev34.
- **RF/CA:** RF-12/RF-13; CA-12/CA-13.
- **Exit:** nenhuma referência runtime a `SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE`; rotas administrativas passam na integração local; migrations sem diff.
- **Evidence:** `db:test` passou; feedback persistence passou 1/1 suite e 4/4 tests; full Server integration teve 65/66 suites e 204/205 tests. A única falha era o teste Redis usando `127.0.0.1:6379` em vez de `ENV.redisUrl`; após a correção, RateLimiter passou 1/1 suite e 8/8 tests. Paired review aceito sem findings; CA-13 passou, CA-12 parcial e full integration rerun pendente.

### C5 — Web publishable key

- **Status/owner:** pending — Builder Clientes; editar somente ambiente Web e consumidor existente.
- **Paths:** `apps/web/.env.example`; `apps/web/src/constants/client-env.ts`.
- **RF/CA:** RF-12; CA-12.
- **Exit:** Web usa somente `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e Auth local preserva o caminho feliz.

### P2 — Docs, validação integrada e paired review

- **Status/owner:** pending — Task principal; integra I3, S3 e C5 sem tocar migrations nem ampliar a retirada de RLS.
- **Paths:** Architecture, Infrastructure, Tooling, Server/Web Rules, Spec, Plan e Evaluation conforme mapas canônicos.
- **RF/CA:** RF-01/RF-12/RF-13; CA-01/CA-12/CA-13.
- **Exit:** sensores/builds passam, checks SDD passam, Reviewers aceitam os três ownerships e Evaluation registra evidências reais.

### P1 — Validação integrada e handoff

- **Status/owner:** in_progress — Task principal; gates locais e sensores executados; permanecem gates de browser e dependências externas explicitadas no handoff.
- **Dependências/paralelismo:** depende de I2, S2, A1 e C1; serial, pois as evidências exigem a implementação integrada e os Reviewers pareados.
- **Paths:** AGENTS.md; documentation/sdd.md; documentation/features/global/supabase-local-development/spec.md; documentation/features/global/supabase-local-development/plan.md; documentation/features/global/supabase-local-development/evaluation.md.
- **RF/CA:** RF-01 a RF-10; CA-01 a CA-10.
- **Resultado observável:** VMs, sensores, execução local, Reviewers e checks de CI têm resultados atuais e sanitizados registrados na Evaluation; findings usam ACH-* e a próxima ação fica explícita.
- **Rules:** documentation/sdd.md; AGENTS.md; Rules listadas nos cards dos Builders.
- **Exit:** nenhum gate obrigatório ou finding bloqueante fica pendente; todas as evidências exigidas estão atuais e o handoff segue para implement-spec/conclude-spec conforme o estado do SDD.

# Validation and handoff

As variáveis vêm do `.env.local` raiz pelos scripts de exportação; nunca registre credenciais, tokens, cookies ou corpos sensíveis. Validações manuais restantes executam somente os caminhos felizes, registrando app/rota, resultado e status dos endpoints essenciais. Web browser, MinIO browser e OAuth real foram removidos dos gates por decisão do usuário; CI remoto de PR também não é requisito desta conclusão.

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| VM-02 | Studio real: login, /dashboard e /profile/users no mesmo contexto; título Usuários e resposta da listagem | RF-03, RF-05; CA-03; login, /auth/account e endpoints da tela retornam 2xx, sem request staging | Spec VM-02; AGENTS.md Playwright no Studio | EV-01 | completed — autenticação/listagem protegida 2xx e título presente; erro global `/reporting/feedback` 500 ficou registrado, fora do Contract e do critério da listagem |
| VM-03 | Mailpit: confirmação de cadastro e recuperação de senha | RF-04; CA-04; duas mensagens usam templates customizados e links locais válidos, sem entrega externa | Spec VM-03 | EV-02 | completed — confirmação e recovery via `/api/auth/...` chegaram aos estados corretos no navegador sem alterar a senha |
| VM-06 | Startup feliz de Server/Web/Studio com loopback em porta customizada | RF-02, RF-09; CA-02, CA-09; endpoints locais ficam prontos; CA-02 pré-listener segue adiado | Spec VM-06 | EV-06 | completed — endpoints loopback com portas customizadas ficaram prontos; CA-02 pré-listener permanece deferred por decisão do usuário |
| Runtime | Repetir docker compose up -d e executar supabase-db-reset; verificar serviços, migrations, Auth/public vazio e ausência de seed | RF-01, RF-05, RF-09; CA-01, CA-09 | Spec CA-01/09; Technical Contract | EV-05 | completed — stack saudável, reset repetível e integration passou sem seed |
| Runtime | Auditar diff, árvore, containers e logs em busca de seed, snapshot, export/sync staging, catálogo, mídia ou usuário sintético | RF-05; CA-05; nenhum artefato ou execução de seed existe | Spec CA-05 | EV-21 | completed — nenhum seed/snapshot de dados encontrado; `[db.seed]` está desabilitado |
| Runtime | Gravar dados de verificação, executar docker compose down e up -d; conferir persistência de PostgreSQL/MinIO, Redis vazio e ausência de diretórios para serviços stateless | RF-10; CA-10 | Spec CA-10; docker/volumes ignorado | EV-07 | completed — PostgreSQL/MinIO persistiram; Redis não persistiu; dados temporários removidos |
| CI-01 | npm run check:test-integrity e regressão do detector para provider, constant e fixture | RF-08; CA-08; os casos proibidos falham identificando o path e a árvore válida passa | Spec CA-08; scripts/check-test-integrity.mjs | EV-08 | completed |
| CI-02 | npm run format | RF-01 a RF-11; formatação final sem diff não revisado | Spec Sensores | EV-09 | completed |
| CI-03 | npm run check:code | RF-01 a RF-11; passa no HEAD integrado | AGENTS.md Detectores de erros | EV-09 | completed |
| CI-04 | npm run check:types | RF-01 a RF-11; passa em todos os workspaces afetados | AGENTS.md Detectores de erros | EV-09 | completed |
| CI-05 | npm run test:unit | RF-01 a RF-11; passa sem testes proibidos | AGENTS.md Detectores de erros | EV-09 | completed |
| CI-06 | npm run test:coverage | RF-01 a RF-11; relatório atual disponível | Spec Sensores | EV-09 | completed |
| CI-07 | npm run check:coverage | RF-01 a RF-11; baseline preservado | Spec Sensores | EV-09 | completed |
| CI-08 | npm run check:architecture | RF-02, RF-03, RF-06; fronteiras seguem Architecture | Spec Sensores; Architecture | EV-09 | completed |
| CI-09 | npm run db:test -w @stardust/server | RF-01, RF-05, RF-09; reset local sem seed | Spec Sensores; Server Rules | EV-05 | completed |
| CI-10 | npm run test:integration -w @stardust/server | RF-03, RF-05, RF-09; rotas usam Compose local e persistência real | Spec Sensores; Server Routes Rules | EV-05 | completed — 66/66 suites, 204/204 tests using ephemeral 6144 MiB Node heap |
| CI-11 | npm --workspace @stardust/web run test:integration | RF-02, RF-03; ServerMock continua no fluxo Web | Spec Sensores; Web Rules | EV-09 | completed |
| CI-12 | npm run check:spec-definition -- documentation/features/global/supabase-local-development/spec.md | RF-01 a RF-11; definição e mapa canônico íntegros | Spec Sensores; SDD | EV-09 | completed |
| CI-13 | npm run check:spec-implementation -- documentation/features/global/supabase-local-development/spec.md --base 0b2ea4cae4870067d506a257f2d3244ecbab742c | RF-01 a RF-10; todos os paths Create/Modify/Remove correspondem ao diff e filesystem | Spec Sensores; SDD | EV-13 | completed — rerun atual confirmou os 44 paths contratados |
| CI-14 | Builds de Server, Web e Studio no CI do HEAD do PR | RF-01 a RF-10; builds e checks obrigatórios passam | Spec Sensores; CI do PR | EV-09 | waived by user — builds locais Server/Web/Studio passaram; CI remoto foi removido dos gates |
| CI-15 | npm run check:plan-definition -- documentation/features/global/supabase-local-development/plan.md antes de salvar e antes de cada wave | RF-01 a RF-11; ledger, dependências, ownership e revisão da Spec continuam íntegros | create-plan; documentation/sdd.md | EV-09 | completed |
| Reviewer | Task principal — Rules do P0; implementation-reviewer-agent pareado após o diff | Rules routes document root Compose, db:test, no-seed reset, and Mailpit AuthFixture confirmation | Spec revisão 31; SDD; Server Rules | EV-10 | completed — accepted, no findings |
| Reviewer | Builder Infra — diff I1/I2; implementation-reviewer-agent pareado após o diff | Compose, reset e tooling aderem à Spec e às Rules de Server/Database | Spec revisão 31; Technical Contract | EV-10 | completed — accepted after IR-01 correction, no findings |
| Reviewer | Builder Server — S1/S2 and rev31 ACH-19/21/23 fixes; paired implementation-reviewer-agent | code meets Mailpit confirmation and local JWT group contracts; CA-09 full-suite evidence required for exit | Spec revisão 31; Architecture; Server Rules | EV-10 | completed — accepted after full-suite pass; no findings in assigned code paths |
| Reviewer | Task principal — Architecture A1; implementation-reviewer-agent pareado após o diff | Architecture descreve o runtime integrado e respeita a Spec e Rules | Spec revisão 31; Architecture; Rules | EV-10 | completed — re-review clear, no findings |
| Reviewer | Builder Clientes — diff C1; implementation-reviewer-agent pareado após o diff | guards e detector aderem à Spec e às Rules de Web/Studio/testes | Spec revisão 31; Rules selecionadas | EV-10 | deferred — CA-02 pré-listener conforme decisão do usuário; C3 foi revisado e aceito separadamente |
| Reviewer | Builder Clientes — diff C4 Studio; implementation-reviewer-agent pareado após o diff | plugin polyfills compatível com Vite 8/Rolldown e startup real preservam Rules e fronteiras | Spec revisão 31; Architecture; Studio Rules | EV-10 | completed — accepted, no findings |

# Execution log

- **ACH-01 — resolved:** o primeiro integrity check encontrou nomes de dependência diferentes dos nomes no ledger. O ledger foi alinhado e o integrity check passou; detalhes do comando e do resultado ficam em evaluation.md no kickoff.
- **ACH-05 — active:** não usar `source`/`eval` em `.env.local`; conteúdo não assignment causou parse failure no Compose e execução indevida na tentativa anterior. Os quatro arquivos foram substituídos com dotenv seguro; a revogação provider-side ainda depende de acesso aos provedores.
- **ACH-11 — active:** GoTrue e PostgREST não autenticam com as senhas das roles existentes no PostgreSQL persistido. Configurar `authenticator` e `supabase_auth_admin` durante bootstrap local e reset com a senha local do banco; não usar superuser como contorno.
- **ACH-12 — active:** Realtime não inicia sem `APP_NAME`; declarar `realtime-dev` na configuração e validar startup.
- **ACH-13 — resolved:** outros projetos locais ocupam portas Compose padrão. A revisão 29 permite configurar as portas host no `.env.local` raiz, mantendo loopback e defaults; este workspace usa ports livres e preserva os demais projetos.
- **ACH-14 — active:** Realtime conecta ao PostgreSQL, mas não consegue criar sua tabela de migrations porque `DB_AFTER_CONNECT_QUERY` seleciona `_realtime` antes de o schema existir. Garantir o schema no bootstrap/reset e ordenar o serviço de roles antes do Realtime.
- **ACH-15 — active:** PostgREST `--ready` retorna unhealthy enquanto seu probe não especifica admin port e `server-host=localhost`; configure a chamada ao endpoint `/ready` sem alterar o bind público do serviço.
- **ACH-16 — active:** o reset não pode dropar o schema persistido `storage` como role `postgres`, pois seu owner local é `supabase_admin`. Executar somente a operação de drop como o admin local já inicializado e recriar o schema compatível pelo bootstrap.
- **ACH-17 — active:** `up -d --wait` sem lista inclui `minio-init`; embora o job termine com exit 0, o comando retorna não-zero. A sequência local deve aguardar apenas serviços long-running e chamar os jobs idempotentes separadamente.
- **ACH-18 — resolved locally:** portas alternativas aprovadas no Grilling foram usadas no Compose e nos clientes; `db:test`, guards loopback e smoke local passaram. S2/CA-09 foi aceito pelo Reviewer após confirmação Mailpit e suíte completa.
- **ACH-25 — non-gate:** o onboarding Web sem perfil/catálogo continua não verificado; o usuário removeu esse cenário do CA-03. Nenhum seed ou identidade sintética foi adicionado.
- **ACH-05 — external:** rotação de tokens antigos exige acesso a provedores; valores nunca registrados. OAuth browser foi removido dos gates por decisão do usuário.
- **ACH-03 — deferred:** usuário adiou CA-02 pré-listener; next.config.js só roda após bind no Next 16.3.0.
- **ACH-26/27 — resolved:** teste consumidor Studio corrigido e templates GoTrue apontam para rotas Web locais válidas.
- **ACH-28 — resolved:** `check:types` identificou callback `applyToEnvironment` sem tipo após spread do plugin; tipo explícito foi adicionado e `check:types` passou em 7/7 workspaces.
