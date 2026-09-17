---
title: Roadmap curado de desafios — implementation plan
status: in_progress
spec: ./spec.md
spec_revision: 5
evaluation: ./evaluation.md
updated_at: 2026-09-16
---

# Execution status

- **Spec:** `in_progress`, revisão 5; `check:spec-definition` passou e o histórico da
  Spec registra `Spec Reviewer: clear` para esta revisão.
- **Plan:** `in_progress`; criado após o Grilling de execução confirmado em
  2026-09-16 e ativado pelo `implement-spec`.
- **Motivo:** a entrega cruza Core, Validation, migration/seed, Supabase Dev,
  adapters, rotas Server, Web, UI complexa, analytics, acessibilidade,
  integração autenticada e comparação visual.
- **Fase atual:** C1, D1, S1 e W1 concluídos; C2 verificado sem novo diff;
  S2/W2 estão em fechamento com Reviewers finais, evidência visual e browser
  real ainda pendentes.
- **Próxima ação:** rerodar os Reviewers atuais de Server/Web, concluir a
  auditoria UI/visual e repetir a validação autenticada sem os 401 compartilhados.
- **Blockers:** o comportamento principal está implementado, mas o handoff não
  pode ser declarado pronto enquanto a validação real registrar 401 em endpoints
  compartilhados, os screenshots/auditoria UI não forem duráveis e os Reviewers
  finais não forem atualizados. O Supabase Dev possui ainda o alerta
  pré-existente `ACH-SEC-01` de RLS ausente em 35 tabelas legadas; a remediação
  ampla não será aplicada sem policies aprovadas. Mudança de comportamento,
  DTO, schema, autorização ou intenção visual exige amendment da Spec revisão 5
  e novo `Spec Reviewer` antes de continuar.
- **Cobertura de rastreabilidade:** o Plan cobre explicitamente `RF-01`,
  `RF-02`, `RF-03`, `RF-04`, `RF-05`, `RF-06`, `RF-07`, `RF-08`, `RF-09`,
  `RF-10`, `RF-11`, `RF-12`, `RF-13`, `RF-14`, `RF-15` e `CA-01`, `CA-02`,
  `CA-03`, `CA-04`, `CA-05`, `CA-06`, `CA-07`, `CA-08`, `CA-09`, `CA-10`,
  `CA-11`, `CA-12`, `CA-13`, `CA-14`, `CA-15`, `CA-16`, `CA-17`, `CA-18`,
  `CA-19`, `CA-20`, `CA-21`, `CA-22`, `CA-23`, `CA-24`.
- **Builders:** `Builder Core`, `Builder Server` e `Builder Web`; ownership é
  estável e cada Builder atua somente nos paths da sua boundary.
- **Ownership compartilhado:** a task principal mantém este Plan, cria e
  atualiza `evaluation.md`, coordena as waves, integra os diffs, aplica/valida a
  migration no Supabase Dev, executa os gates oficiais e registra evidências.
  Também mantém `documentation/architecture.md` e
  `documentation/overview.md`, sem delegar esses paths aos Builders.
- **Decisões de execução confirmadas:** Core/Validation e migration/seed podem
  começar em paralelo; Server/API e Web/UI podem começar em paralelo depois dos
  contratos necessários; a integração final ocorre em Wave 3; o Supabase local
  é o ambiente principal dos testes, e o Supabase Dev recebe a migration
  versionada e sua validação explícita; findings retornam ao Builder da mesma
  boundary para correção e novo Reviewer.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| ---- | ------- | ----- | ---- | ---------- | ------------- | ------ | -------------- |
| 1 | Builder Core | C1 | C1 — Core + Validation + contratos de domínio | — | D1 — Migration + schema + seed V1 | completed | Estrutura `ChallengeRoadmap`, DTOs, ports, use cases, erros, schemas, fakers, exports e testes unitários cobrem as invariantes da Spec; recovery removeu fallback de UUID, complexity, typecheck, code check e testes focados passam; Reviewer rerun `clear`. |
| 1 | Builder Server | D1 | D1 — Migration + schema + seed V1 | — | C1 — Core + Validation + contratos de domínio | completed | Migration transacional, fixture local idempotente, reset local, aplicação/verificação no Supabase Dev e curadoria exata passam; nenhum ID interno é hardcoded. |
| 2 | Builder Server | S1 | S1 — Adapters Supabase + controllers + rotas | C1 — Core + Validation + contratos de domínio, D1 — Migration + schema + seed V1 | W1 — Web + roadmap UI + Design Contract | completed | Tipos gerados, mapper, repository, composição dos routers, controllers finos, GETs, guards, `.rest` e testes de rota real 4/4 passam no Supabase local. |
| 2 | Builder Web | W1 | W1 — Web App + roadmap UI + navegação | C1 — Core + Validation + contratos de domínio | S1 — Adapters Supabase + controllers + rotas | completed | Rota pública, switch, mapa/lista, drawer, query/storage, analytics e estados contratados implementados; unitários focados, Playwright 9/9 e build passam. |
| 3 | Builder Core | C2 | C2 — Conformance integrada de Core + Validation | S1 — Adapters Supabase + controllers + rotas, W1 — Web App + roadmap UI + navegação | S2 — Hardening Server/Supabase Dev; W2 — Browser + visual + acessibilidade | completed | Nenhum finding integrado exigiu alteração nos paths de Core/Validation; contratos, exports e sensores continuam passando e o Reviewer C1 rerun permaneceu `clear`. |
| 3 | Builder Server | S2 | S2 — Hardening Server + sincronização Supabase Dev | S1 — Adapters Supabase + controllers + rotas, W1 — Web App + roadmap UI + navegação | C2 — Conformance integrada de Core + Validation; W2 — Browser + visual + acessibilidade | in_progress | Blockers de rota 500 estrutural, contrato HTTP 409 e telemetria injetável foram corrigidos e a suíte focada passou 5/5; falta rerun independente do Reviewer. |
| 3 | Builder Web | W2 | W2 — Browser real + visual + responsividade + recovery | S1 — Adapters Supabase + controllers + rotas, W1 — Web App + roadmap UI + navegação | S2 — Hardening Server/Supabase Dev | in_progress | Recommendation agora usa `roadmap.recommendation.nodeKey` e Handles têm IDs explícitos; falta browser real limpo, screenshots duráveis, UI Layer audit e rerun do Reviewer Web após o último diff. |

## Task cards

### C1 — Core, Validation e contratos de domínio

- **Status/owner:** `completed` — `Builder Core`; C1 recovery eliminou os warnings de complexity, passou os sensores focados e o `implementation-reviewer-agent` pareado retornou `clear`.
- **Dependências/paralelismo:** não depende de outra fase; executa em paralelo com D1; libera S1 e W1 quando os contratos compartilhados estiverem estáveis.
- **Paths:** `packages/core/src/challenging/domain/structures/ChallengeRoadmap.ts`; `packages/core/src/challenging/domain/structures/dtos/ChallengeRoadmapDto.ts`; barrels de `structures`, `structures/dtos` e `structures/fakers`; `ChallengeRoadmapFaker`; testes de estrutura; `packages/core/src/challenging/domain/errors/ChallengeRoadmapNotFoundError.ts`; `ChallengeBelongsToPublishedRoadmapError.ts`; barrel de errors; `packages/core/src/challenging/interfaces/ChallengeRoadmapsRepository.ts`; alteração do port `ChallengingService` e barrel de interfaces; `GetChallengeRoadmapUseCase.ts`; `ListRoadmapNodeChallengesUseCase.ts`; testes dos dois use cases; alterações e testes de `UpdateChallengeUseCase.ts`, `EditChallengeStarUseCase.ts` e `DeleteChallengeUseCase.ts`; barrel de use cases; `packages/validation/src/modules/challenging/schemas/challengeRoadmapSchema.ts`; teste do schema e barrel.
- **RF/CA:** RF-02..RF-06, RF-11..RF-12; CA-02..CA-08, CA-15, CA-17..CA-18.
- **Resultado observável:** o domínio valida DAG, referências, unicidade, terminal `comingSoon`, progresso, elegibilidade e recomendação; use cases recebem apenas conclusões resolvidas pelo servidor; erros e schema de `nodeKey` são tipados; guards de exclusão, privatização e Star consultam membership ativo antes da persistência.
- **Rules:** `documentation/rules/core-package-rules.md`; `documentation/rules/validation-layer-rules.md`; `documentation/rules/use-cases-testing-rules.md`; `documentation/rules/domain-objects-testing-rules.md`; `documentation/rules/code-conventions-rules.md`; Core não importa Hono, Supabase, React ou SDKs.
- **Exit:** testes unitários focados de Core/Validation, `npm run check:types -- --filter=@stardust/core --filter=@stardust/validation` e `npm run check:code -- --filter=@stardust/core --filter=@stardust/validation` passam; o Reviewer pareado confirma os contratos antes de aceitar C1.

### D1 — Migration, schema e seed V1

- **Status/owner:** `completed` — `Builder Server`; fixture idempotente prepara o catálogo local sem duplicar o Supabase Dev, o reset local passa e a migration estrutural foi aplicada/verificada nos dois ambientes.
- **Dependências/paralelismo:** não depende de C1 para escrever o schema; executa em paralelo com C1; S1 depende da migration aplicada e dos tipos derivados.
- **Paths:** `apps/server/supabase/migrations/20260916223842_create_challenge_roadmap.sql`; `apps/server/supabase/migrations/20260916110000_seed_challenge_roadmap_catalog.sql`; `apps/server/supabase/schemas/schema.sql`; `apps/server/src/database/supabase/types/Database.ts` somente como saída gerada depois da aplicação; `apps/server/rest-client/challenging/roadmap.rest`.
- **RF/CA:** RF-02..RF-04, RF-11..RF-12; CA-02..CA-04, CA-15, CA-17..CA-18.
- **Resultado observável:** tabelas, constraints, FKs `RESTRICT`, índices, RLS, grants e trigger de imutabilidade existem; seed cria os oito nós, dez arestas e vinte desafios por slug/key estável, falhando atomicamente diante de categoria/desafio ausente, privado, Star, categoria divergente, duplicata ou ciclo.
- **Rules:** `documentation/rules/database-rules.md`; `documentation/rules/server-application-rules.md`; `documentation/sdd.md`; nenhuma credencial ou ID gerado é gravado no SQL.
- **Exit:** preflight remoto, `npm run db:test -w @stardust/server`, reset local, aplicação/verificação no Supabase Dev e geração oficial de `Database.ts` concluídos; nenhum reset ou delete remoto foi usado.

### S1 — Adapters Supabase, controllers e rotas

- **Status/owner:** `completed` — `Builder Server`; requests reais 4/4 no Supabase local passam; o Reviewer final atual ainda precisa ser rerodado.
- **Dependências/paralelismo:** depende de C1 e D1; executa em paralelo com W1; não altera paths de Core, Validation ou Web.
- **Paths:** `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeRoadmapMapper.ts` e barrel; `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeRoadmapsRepository.ts` e barrel; controllers/exports/testes em `apps/server/src/rest/controllers/challenging/roadmap/`; alterações e testes dos três controllers em `apps/server/src/rest/controllers/challenging/challenges/`; `ChallengeRoadmapRouter.ts`, `ChallengesRouter.ts`, `ChallengingRouter.ts`; testes em `apps/server/src/tests/routes/challenging/roadmap/`; `apps/server/rest-client/challenging/roadmap.rest`.
- **RF/CA:** RF-02..RF-06, RF-08, RF-11..RF-12; CA-02..CA-08, CA-13, CA-15, CA-17..CA-18.
- **Resultado observável:** mapper é a única fronteira de rows/`Database.ts`; repository filtra novamente público/não-Star, omite e registra inconsistências; routers são composition roots; controllers só traduzem Http; GET do snapshot e GET do nó retornam 200/404/500 contratados, sem IDs concluídos vindos do client; mutações retornam 409 orientativo antes da escrita.
- **Rules:** `documentation/rules/database-rules.md`; `documentation/rules/rest-layer-rules.md`; `documentation/rules/server-application-rules.md`; `documentation/rules/server-routes-testing-rules.md`; `documentation/rules/handlers-testing-rules.md`; `documentation/rules/use-cases-testing-rules.md`.
- **Exit:** testes unitários de mapper/use cases/controllers e duas suítes de rota com `request/response` real passam no Supabase local, cobrindo visitante, conta, ausência/integridade, nó inválido, filtros de visibilidade e guards de mutação; `check:types`, `check:code` e Reviewer pareado passam.

### W1 — Web App, roadmap UI e integração de navegação

- **Status/owner:** `completed` — `Builder Web`; os findings IR-01..IR-08 foram corrigidos, unitários focados, Playwright 9/9 e build passam; a validação manual/visual e o Reviewer final permanecem no W2.
- **Dependências/paralelismo:** depende de C1 e do contrato HTTP estável da Spec; executa em paralelo com S1 usando doubles/ServerMock nos testes; a integração real só é aceita após S1.
- **Paths:** `apps/web/package.json`, `apps/web/playwright.config.ts`, `apps/web/playwright.local.config.ts` e `package-lock.json`; `apps/web/src/constants/routes.ts`; `public-route-groups.ts`; `home-links.ts`; `ChallengingService.ts`; `apps/web/src/app/challenging/roadmap/page.tsx` e testes; toda a subtree declarada em `apps/web/src/ui/challenging/widgets/pages/ChallengeRoadmap/` com Entry Points, Views, Hooks e testes pareados; `ChallengesViewSwitch` e testes; `ChallengesPageView` e teste; alterações/testes de `Challenge/index.tsx`, `useChallengePage.ts`, `ChallengePageView.tsx`; `apps/web/src/app/challenging/roadmap/tests/challenge-roadmap.pw.test.ts` e `apps/web/src/app/challenging/challenges/tests/challenges.pw.test.ts`; handoff visual já existente em `design/`.
- **RF/CA:** RF-01, RF-05..RF-10, RF-13..RF-15; CA-01, CA-05, CA-07..CA-16, CA-19..CA-24.
- **Resultado observável:** `/challenging/roadmap` busca o snapshot sem cache compartilhado; switch, mapa React Flow read-only, linear acessível, drawer filtrável, query `node`, viewport em `sessionStorage`, revalidação, origem/retorno, analytics sanitizado e estados loading/empty/error/retry/visitante/conclusão/`Em breve` seguem o handoff; o pai não reproduz JSX de subwidgets e `RoadmapDrawerFilters` é o único Hook interno adicional.
- **Rules:** `documentation/rules/web-application-rules.md`; `documentation/rules/web-app-routes-testing-rules.md`; `documentation/rules/ui-layer-rules.md`; `documentation/rules/widget-tests-rules.md`; `documentation/rules/code-conventions-rules.md`; `design/handoff.md`; usar componentes/tokens/Icon existentes e não expor React Flow ao Core/Server.
- **Exit:** testes de Hook/View e integração Web com ServerMock cobrem query, seleção, filtros, retry, foco, origem, analytics e regressões; build Web/typecheck/code passam; inspeção estrutural confirma Entry Point/View/Hook/teste por subtree antes do Reviewer pareado.

### C2 — Conformance integrada de Core e Validation

- **Status/owner:** `completed` — `Builder Core`; a conformance não encontrou incompatibilidade nova e não ampliou o Contract.
- **Dependências/paralelismo:** depende de S1 e W1; executa em paralelo com S2 e W2 em paths de Core/Validation; não reabre a Spec para alterar comportamento.
- **Paths:** somente os paths permitidos em C1, além dos testes correspondentes; nenhum adapter, controller, router, UI ou documento compartilhado.
- **RF/CA:** RF-02..RF-06, RF-11..RF-12; CA-02..CA-08, CA-15, CA-17..CA-18.
- **Resultado observável:** qualquer incompatibilidade real de integração no domínio, port, erro, use case ou schema é corrigida mantendo a revisão 5; sem finding, a conformance é registrada como verificada.
- **Rules:** mesmas Rules de C1; `documentation/architecture.md` e `spec.md` continuam fora do ownership do Builder.
- **Exit:** sensores focados e Reviewer rerun aceitos, ou confirmação documentada de nenhum finding; se surgir ambiguidade de Contract, pausar e encaminhar amendment via `create-spec`.

### S2 — Hardening Server e sincronização Supabase Dev

- **Status/owner:** `in_progress` — `Builder Server`; blockers de contrato HTTP 500/409 e telemetria injetável foram corrigidos, a suíte focada passou 5/5 e o rerun do Reviewer ainda está pendente.
- **Dependências/paralelismo:** depende de S1 e W1; executa em paralelo com C2 e W2, mas a task principal serializa qualquer alteração no Supabase Dev e os testes que compartilham o stack remoto.
- **Paths:** somente os paths permitidos em D1 e S1; `documentation/architecture.md` e `documentation/overview.md` permanecem com a task principal.
- **RF/CA:** RF-02..RF-06, RF-08, RF-11..RF-12; CA-02..CA-08, CA-13, CA-15, CA-17..CA-18.
- **Resultado observável:** request/response, autorização opcional, tenant, persistência, RLS, integridade, telemetria sanitizada e consistência entre local e Supabase Dev estão comprovados; falhas são isoladas sem fallback parcial.
- **Rules:** mesmas Rules de S1 e D1; `documentation/sdd.md`; nunca registrar tokens, URLs privadas, credenciais ou payloads sensíveis.
- **Exit:** integração Server focada e validação remota passam; advisors aplicáveis são inspecionados; Reviewer rerun aceita a boundary. Falha remota sem alternativa segura mantém o Plan `in_progress` e registra `ACH-*`/próxima ação.

### W2 — Browser real, visual, responsividade e recovery

- **Status/owner:** `in_progress` — `Builder Web`; último diff corrigiu recommendation e Handles, mas browser real, auditoria visual e Reviewer rerun ainda estão pendentes.
- **Dependências/paralelismo:** depende de S1 e W1; executa em paralelo com C2 e S2 sem compartilhar paths; a validação manual real é coordenada pela task principal.
- **Paths:** somente os paths permitidos em W1 e screenshots runtime em `test-results/`; não alterar Spec, Plan, Evaluation, Rules, Architecture ou Overview dentro do Builder.
- **RF/CA:** RF-01, RF-05..RF-10, RF-13..RF-15; CA-01, CA-05, CA-07..CA-16, CA-19..CA-24.
- **Resultado observável:** diferenças de browser, foco, teclado, mobile, reduced motion, requests, console, pageerror, requestfailed ou comparação visual são corrigidas na boundary Web; divergência estrutural não decidida reabre a Spec.
- **Rules:** mesmas Rules de W1; `AGENTS.md`; Playwright CLI é o único mecanismo de browser autorizado no projeto.
- **Exit:** VM-03..VM-06 e screenshots por estado/viewport passam; build, typecheck, código, integridade de testes e Reviewer rerun passam.

# Validation and handoff

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| VM-01 | Pencil, `GJpSw`, 1440×1024, overview autenticado com drawer fechado | RF-14..RF-15; CA-20, CA-22..CA-23 | `design/handoff.md`, `design/GJpSw.png`, Spec rev5 | `EV-01`: node/aresta, header, summary, anchors, tipografia e ausência de clipping comparados | pending — screenshot temporário produzido, comparação durável ausente |
| VM-02 | Pencil, `b081p`, 1854×1024/área 1440×1024, drawer `operadores` aberto | RF-07, RF-15; CA-10..CA-13, CA-22..CA-23 | `design/handoff.md`, `design/b081p.png`, Spec rev5 | `EV-02`: drawer, busca, dois filtros, lista completa, dimensões e anchors comparados | pending |
| VM-03 | Web real visitante, 1440×1024, overview/switch/drawer/desafio | RF-01, RF-07..RF-10, RF-13; CA-01, CA-09..CA-16, CA-19 | `AGENTS.md`, `design/handoff.md`, `.env.development` sem expor valores | `EV-03`: fluxo completo, respostas 2xx, console/pageerror/requestfailed limpos e screenshot desktop | partial — roadmap 200 e sem pageerror/requestfailed, mas endpoints compartilhados retornaram 401 |
| VM-03 | Web real visitante, 390×844, linear/drawer/filtros/fechamento | RF-07..RF-09, RF-14; CA-10..CA-15, CA-20..CA-21, CA-23 | `AGENTS.md`, `design/handoff.md` | `EV-04`: equivalência linear, scroll, alvos ≥44px, foco e screenshot mobile | partial — viewport exercitado; evidência durável e console limpo pendentes |
| VM-04 | Web real autenticado, 1440×1024, login, rota protegida, continue, desafio e retorno | RF-05..RF-06, RF-10, RF-13; CA-05..CA-09, CA-16, CA-19 | `AGENTS.md`, Spec rev5 | `EV-05`: `/auth/account`, roadmap, drawer e endpoints do desafio 2xx; nó/viewport restaurados e eventos sem dados sensíveis | partial — login 200, refresh 201, `/space` e roadmap alcançados; endpoints compartilhados retornaram 401 |
| VM-04 | Web real autenticado, 390×844, conclusão total e retorno/foco | RF-05..RF-06, RF-10, RF-14; CA-08, CA-16, CA-20..CA-21, CA-23 | `AGENTS.md`, `design/handoff.md` | `EV-06`: 100%, ausência de CTA indevido, reduced motion, foco e revalidação confirmados | pending |
| VM-05 | Web real, 1440×1024, loading/erro/retry de snapshot e drawer, query inválida, vazio/Em breve | RF-02, RF-08..RF-09, RF-12; CA-03, CA-13..CA-15, CA-18, CA-23 | Spec rev5, `design/handoff.md` | `EV-07`: erro total sem grafo parcial, retry isolado, seleção removida e degradação segura | pending |
| VM-05 | Web real, 390×844, mesmos estados com scrim/drawer e foco | RF-08..RF-09, RF-14; CA-13..CA-15, CA-20..CA-23 | `AGENTS.md`, `design/handoff.md` | `EV-08`: estados acessíveis e recuperáveis sem overflow ou perda de foco | pending |
| VM-06 | Web real, desktop e mobile, teclado/Enter/Espaço/Escape, linear e reduced motion | RF-07, RF-14; CA-12, CA-20..CA-21, CA-23..CA-24 | `AGENTS.md`, `widget-tests-rules.md`, handoff | `EV-09`: labels, ordem topológica, foco visível/restaurado, equivalência e auditoria UI Layer | partial — fixes automatizados presentes; browser/auditoria ainda pendentes |
| Sensor | Core/Validation focados | RF-02..RF-06, RF-11..RF-12; CA-02..CA-08, CA-15, CA-17..CA-18 | Tooling e Rules de Core/Validation | `EV-10`/`CI-01`: testes unitários, typecheck e code check dos pacotes | passed |
| Sensor | Migration e adapters, Supabase local | RF-02..RF-04, RF-11..RF-12; CA-02..CA-04, CA-15, CA-17..CA-18 | `AGENTS.md`, `database-rules.md` | `EV-11`/`CI-02`: `db:test`, migration reset, seed, tipos, repository e RLS locais | passed |
| Environment | Supabase Dev, migration versionada | RF-02..RF-04, RF-11..RF-12; CA-04, CA-15, CA-17..CA-18 | decisão de Grilling, `AGENTS.md`, Database Contract | `EV-12`: migration aplicada uma vez, schema/contagens/curadoria/RLS verificados e advisors registrados | passed |
| Sensor | Controllers/routers Server e `.rest` | RF-02..RF-06, RF-08, RF-11..RF-12; CA-02..CA-08, CA-13, CA-17..CA-18 | `server-routes-testing-rules.md`, `rest-layer-rules.md` | `EV-13`/`CI-03`: request/response real, status/body, sessão opcional, autorização e tenant confirmados | passed for focused routes 7/7, including 500/409/telemetry; Reviewer rerun pending |
| Sensor | Web unit/integration | RF-01, RF-05..RF-10, RF-13..RF-15; CA-01, CA-05, CA-07..CA-16, CA-19..CA-24 | `web-app-routes-testing-rules.md`, `widget-tests-rules.md` | `EV-14`/`CI-04`: Hooks/Views/widgets, ServerMock, regressões do catálogo e pareamento estrutural | passed for automated scope |
| Sensor | Workspace e preflight final | RF-01..RF-15; CA-01..CA-24 | `AGENTS.md`, `documentation/sdd.md`, Tooling | `EV-15`/`CI-05`: typecheck, unit, architecture, coverage, integrity, complexity e definition/implementation checks passam; code check tem dois erros Web preexistentes | partial |
| Build | Core, Server e Web | RF-01..RF-15; CA-01..CA-24 | Tooling | `EV-16`/`CI-06`: build Web passa; builds adicionais dos workspaces afetados permanecem para o handoff | partial |
| Reviewer | `Builder Core` após C1 e C2 | RF-02..RF-06, RF-11..RF-12; CA-02..CA-08, CA-15, CA-17..CA-18 | `implementation-reviewer-agent`, Architecture e Rules | `EV-17`: veredito pareado atual, findings `ACH-*` resolvidos ou encaminhados | passed — C1 rerun `clear` |
| Reviewer | `Builder Server` após D1, S1 e S2 | RF-02..RF-06, RF-08, RF-11..RF-12; CA-02..CA-08, CA-13, CA-15, CA-17..CA-18 | `implementation-reviewer-agent`, Architecture e Rules | `EV-18`: veredito pareado atual, migration/API/authorization sem findings ativos | pending rerun |
| Reviewer | `Builder Web` após W1 e W2 | RF-01, RF-05..RF-10, RF-13..RF-15; CA-01, CA-05, CA-07..CA-16, CA-19..CA-24 | `implementation-reviewer-agent`, Architecture, handoff e Rules | `EV-19`: veredito pareado atual, UI tree/browser/visual sem findings ativos | pending rerun |
| Handoff | `implement-spec` → `conclude-spec` → `commit-code` → `create-pr` | RF-01..RF-15; CA-01..CA-24 | SDD, Spec rev5, Plan rev5 | `EV-20`: Evaluation `ready`, Spec/Plan completos, evidências atuais e integração avaliada contra o commit-base | blocked by open evidence |

## Handoff operacional

- `implement-spec` cria `evaluation.md` antes de qualquer source/test/migration,
  registra a revisão 5 e despacha C1/D1 com paths, Rules, RF/CA e exits
  delimitados.
- A task principal deve preparar o Supabase local com
  `npm run db:test -w @stardust/server`. Antes da alteração remota, deve fazer
  leitura de migrations/tabelas no Supabase Dev, confirmar que a versão ainda não
  foi aplicada e aplicar a migration versionada sem hardcoded IDs. A verificação
  remota é registrada; não se usa reset/delete remoto como recovery.
- C1 e D1 foram a paralelização inicial da Wave 1. S1 e W1 começaram após os
  contratos compartilhados de C1; S1 ainda depende do fechamento do gate local
  de D1 para validar request/response. A
  integração Server real usa Supabase local; o Dev é uma validação adicional e
  explícita da migration/curadoria.
- Após cada diff material de um Builder, a task principal executa os sensores
  focados, inspeciona o diff e despacha o `implementation-reviewer-agent` pareado.
  Finding bloqueante retorna ao mesmo Builder em C2, S2 ou W2; a próxima wave
  não é aceita até o rerun e a evidência estarem atuais.
- A task principal atualiza `documentation/architecture.md` e
  `documentation/overview.md` somente depois do comportamento integrado estar
  comprovado, sem criar requisito, schema, dependência ou intenção visual nova.
- A validação Web deve iniciar Server e Web locais em terminais separados,
  carregar `.env.development` pelos scripts oficiais, autenticar quando
  aplicável, acessar uma rota protegida além do login e capturar
  `console`, `pageerror`, `requestfailed` e respostas HTTP sem registrar
  credenciais, cookies ou tokens.
- Não há revisão integrada adicional prevista: cada interação pertence a Core,
  Server ou Web. Se a integração revelar uma decisão de Contract sem autoridade,
  interromper a execução, registrar `ACH-*` e encaminhar amendment via
  `create-spec` antes de editar o código.
- O handoff para `conclude-spec` exige todos os `VM-*`, sensores, builds,
  Reviewers pareados atuais, preflight e `evaluation.md` atuais; depois seguem
  `commit-code`, `create-pr` e os checks do CI do HEAD do PR.

# Execution log

- **2026-09-16 — Activation gate:** `implement-spec` congelou a revisão 4 no
  commit-base `0a50ce756b7d7df77c534e6825c7a8f35587fc3e`; `evaluation.md` foi
  criado e as assignments C1/D1 foram registradas. Nenhuma implementação foi
  autorizada fora desses paths.
- **2026-09-16 — Preflight inicial:** `check:spec-definition` e
  `check:plan-definition` passaram; `check:spec-implementation` registrou os
  125 paths ainda ausentes ou inalterados no commit-base, estado esperado antes
  de C1/D1 e sem finding de implementação.
- **2026-09-16 — Supabase Dev preflight:** leitura remota confirmou migrations
  até `20260811033517` e reportou `ACH-SEC-01`, RLS desabilitado em 35 tabelas
  legadas. Nenhuma remediação global foi aplicada; D1 deve proteger as novas
  tabelas do roadmap com RLS/policies/grants próprios.
- **2026-09-16 — C1/D1 tentativa 1:** C1 entregou o diff principal e os testes
  focados, mas `check:complexity -w @stardust/core` encontrou duas funções
  acima do limite; `ACH-C1-01` mantém C1 em `in_progress` para refatoração pelo
  mesmo Builder. D1 deixou migration/schema parciais no worktree e permanece
  em `in_progress`; a migration ainda não foi aplicada no Supabase Dev.
- **2026-09-16 — D1 sensor local:** `npm run db:test -w @stardust/server`
  confirmou o fail-fast da migration por ausência dos 20 slugs no catálogo local;
  `ACH-D1-01` está ativo. A preparação local deve ser resolvida antes de aplicar
  a migration no Supabase Dev.
- **2026-09-16 — D1 inspeção remota:** consulta read-only confirmou os 20 slugs
  no Supabase Dev e revelou que as categorias persistem em minúsculas; a
  migration usa literais capitalizados. `ACH-D1-02` mantém D1 em recovery para
  alinhar o lookup sem alterar labels de UI; Supabase Dev segue sem mutation.
- **2026-09-16 — D1 recovery/remoto:** lookup foi corrigido para os nomes
  persistidos; a migration foi aplicada uma vez no Supabase Dev como
  `20260916223842_create_challenge_roadmap` e verificada
  com 1 revisão publicada, 8 nós, 10 arestas, 20 associações e RLS/policy em
  cada tabela nova. `Database.ts` foi gerado pelo comando oficial. O reset
  local segue bloqueado por catálogo vazio (`ACH-D1-01`/`ACH-D1-03`).
- **2026-09-16 — ativação Wave 2:** S1 (Server) e W1 (Web) foram despachados em
  paralelo nos paths separados do Plan; a task principal corrigiu o adapter
  Studio para acompanhar os novos métodos da interface compartilhada.
- **2026-09-16 — exits iniciais Wave 2:** Server typecheck/code/architecture,
  testes focados e rotas mockadas passaram; a suíte Supabase real permanece
  bloqueada pelo catálogo local ausente. Web typecheck, unitários focados,
  Playwright roadmap+regressão (9/9) e build com o env do workspace passaram;
  o lint focado foi corrigido pelo Builder.
- **2026-09-16 — Recovery e sensores finais:** fixture local idempotente, schema
  com RLS/policies/trigger, composição dos routers, Handles do React Flow,
  estados mobile/reduced-motion, recommendation linear, contexto de retorno,
  retry stale-data e mocks/configuração Playwright foram corrigidos. `db:test`,
  rotas 4/4, Playwright 9/9, build Web, typecheck, unit, integrity,
  architecture, coverage e complexity passam; `check:code` mantém dois erros
  Web preexistentes fora do escopo.
- **2026-09-16 — Browser real:** login 200, refresh 201, `/space` protegido e
  roadmap 200 foram observados em desktop/mobile sem `pageerror` ou
  `requestfailed`; endpoints compartilhados de feedback/achievement retornaram
  401 e mantêm VM-03/VM-04 parciais. Screenshots temporários foram produzidos,
  mas ainda não versionados.
- **2026-09-16 — Reviewers finais:** Server retornou `failed` com blockers de
  rota 500 estrutural, contrato HTTP 409 e telemetria injetável de associação
  inválida. Web retornou `failed` antes do último patch local, apontando
  recommendation, Handles, manual 401, comparação visual e UI Layer audit.
- **2026-09-16 — Correção Web pós-review:** recommendation passou a ser marcada
  pelo `recommendation.nodeKey`, independente do `recommendationOrder`; Handles
  receberam IDs `source`/`target` e as arestas passaram a referenciá-los. Três
  suítes focadas passaram 5/5 e o Playwright Web roadmap+regressão passou 9/9.
- **2026-09-16 — Hardening Server pós-review:** rota estrutural 500, contrato
  HTTP 409 e telemetria de associação inválida foram cobertos no worktree;
  rotas roadmap passaram 7/7 no conjunto focado. O Reviewer independente foi
  despachado novamente, mas não concluiu antes do encerramento desta sessão.
- **2026-09-16 — Estado de fechamento:** `evaluation.md` foi atualizado para a
  Spec rev5 com os findings atuais. S2 está bloqueado até os testes/telemetria
  Server; W2 segue aberto até browser real limpo, UI Layer audit, comparação
  visual durável e Reviewer rerun.
