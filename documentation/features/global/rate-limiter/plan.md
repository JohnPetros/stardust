---
title: Rate limiter global da aplicação Server — implementation plan
status: completed
spec: ./spec.md
spec_revision: 1
evaluation: ./evaluation.md
updated_at: 2026-09-12
---

# Execution status

- **Spec:** `completed`, revisão 1; `check:spec-definition` passou e o histórico da
  Spec registra `Spec Reviewer: clear`.
- **Plan:** `completed`; criado após o Grilling de execução confirmado em
  2026-09-12.
- **Motivo:** a entrega cruza Core, adapter Redis, middleware Hono,
  autenticação REST/MCP, testes HTTP concorrentes, runtime Redis e documentação,
  com ordem dependente e paralelismo seguro entre boundaries.
- **Fase atual:** Wave 4 / S3 concluída; `conclude-spec` concluído.
- **Próxima ação:** handoff para `create-pr`; a Evaluation foi concluída.
- **Blockers:** nenhum conhecido. Não há mudança de produto, UI, schema,
  migration, tenant ou persistência de negócio nesta Spec.
- **Builders:** C1, P1 e S1/S2/S3 concluídos; não há Builders pendentes.
- **Ownership compartilhado:** a task principal mantém este Plan, cria e
  atualiza `evaluation.md`, coordena os handoffs, executa os gates oficiais,
  integra os diffs e registra Reviewers/evidências. Builders alteram somente os
  paths de suas assignments e não editam Spec, Plan, Evaluation, Rules ou
  Architecture.
- **Decisões de execução confirmadas:** três Builders estáveis; Core primeiro;
  Provision e primitives Hono em paralelo após o port; bootstrap compartilhada
  entre produção e `HonoFixture`; doubles injetáveis; Redis real via
  `docker compose` com prefixo exclusivo; nenhuma alteração no Supabase Dev.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| ---- | ------- | ----- | ---- | ---------- | ------------- | ------ | -------------- |
| 1 | Builder Core | C1 | C1 — Port global e header de rate limit | — | — | completed | Port, tipos e export do Core compilam; `HTTP_HEADERS.retryAfter` está disponível; `check:types` do Core passa. |
| 2 | Builder Provision | P1 | P1 — Provider Redis atômico | C1 — Port global e header de rate limit | S1 — Primitives Hono e autenticação | completed | Provider dedicado implementa o port, executa Lua atômico, mapeia falhas sanitizadas e expõe lifecycle concreto; testes focados do adapter passam. |
| 2 | Builder Server | S1 | S1 — Primitives Hono e autenticação | C1 — Port global e header de rate limit | P1 — Provider Redis atômico | completed | Middleware, autenticação REST/MCP e controller usam o port sem acoplamento indevido; a ordem account-after-auth está coberta no desenho dos testes. |
| 3 | Builder Server | S2 | S2 — Composition root e integração HTTP | P1 — Provider Redis atômico, S1 — Primitives Hono e autenticação | — | completed | HonoApp e HonoFixture compartilham bootstrap, injetam doubles, preservam CORS antes do limiter e as suítes HTTP provam 429, exclusões, dimensões e breaker. |
| 4 | Builder Server | S3 | S3 — Alinhamento documental e handoff | S2 — Composition root e integração HTTP | — | completed | Architecture e Infrastructure refletem o fluxo implementado; sensores, preflight e runtime Redis estão registrados; Reviewer documental aceito. |

## Task cards

### C1 — Port global e header de rate limit

- **Status/owner:** `completed` — `Builder Core`; diff pareado por `implementation-reviewer-agent` aceito sem findings.
- **Dependências/paralelismo:** depende de nenhuma fase; não executa em paralelo; disponibiliza o contrato para P1 e S1.
- **Paths:** `packages/core/src/global/interfaces/provision/RateLimiterProvider.ts` (Create); `packages/core/src/global/interfaces/provision/index.ts` (Modify); `packages/core/src/global/constants/http-headers.ts` (Modify).
- **RF/CA:** RF-05, RF-06; CA-09, CA-10.
- **Resultado observável:** `RateLimitInput`, `RateLimitDecision` e `RateLimiterProvider.consume` permanecem agnósticos a Hono, Redis e Sentry; `HTTP_HEADERS.retryAfter` centraliza `Retry-After`.
- **Rules:** `documentation/rules/core-package-rules.md`; `documentation/rules/code-conventions-rules.md`; Core sem imports de app ou SDK.
- **Exit:** executar `npm run check:types -- --filter=@stardust/core` e o teste unitário aplicável; confirmar export pelo barrel sem alterar comportamento não contratado.

### Assignment ativa — Builder Core / C1 / tentativa 1

- **Spec/revisão:** `documentation/features/global/rate-limiter/spec.md`, revisão 1.
- **RF/CA:** RF-05, RF-06; CA-09, CA-10.
- **Paths permitidos:** `packages/core/src/global/interfaces/provision/RateLimiterProvider.ts`; `packages/core/src/global/interfaces/provision/index.ts`; `packages/core/src/global/constants/http-headers.ts`.
- **Paths proibidos:** todos os demais paths, especialmente Spec, Plan, Evaluation, Rules, Architecture, adapters Server e testes fora do escopo Core.
- **Rules/Architecture:** Core e code conventions; Core permanece agnóstico a Hono, Redis e Sentry.
- **Saída observável:** port `consume` tipado e header `retryAfter` exportado, sem mudança de comportamento não contratado.
- **Exit de validação:** typecheck e teste unitário focado do Core; diff revisado pelo Reviewer pareado.
- **Próxima ação:** Builder implementa somente os paths permitidos; task principal integra e registra evidências antes da Wave 2.

### C1 — tentativa 1 — implementação registrada

- **Mudança:** Builder Core criou o port `RateLimiterProvider` com `RateLimitInput` e `RateLimitDecision`, exportou os tipos no barrel de provision e adicionou `HTTP_HEADERS.retryAfter`.
- **Paths afetados:** `packages/core/src/global/interfaces/provision/RateLimiterProvider.ts`; `packages/core/src/global/interfaces/provision/index.ts`; `packages/core/src/global/constants/http-headers.ts`.
- **RF/CA:** RF-05, RF-06; CA-09, CA-10.
- **Estado:** `completed`; sensores focados passaram e o Reviewer pareado aceitou o diff sem findings.
- **Próxima ação:** aguardar os Reviewers de P1/S1/S2 e sensores integrados.

### P1 — Provider Redis atômico

- **Status/owner:** `completed` — implementação local excepcional registrada após despacho sem diff; Builder Fix IR-01 corrigiu a canonicalização IPv4-mapped IPv6 e o rerun do `implementation-reviewer-agent` aceitou sem findings.
- **Dependências/paralelismo:** depende de C1; executa em paralelo com S1; não compartilha paths ativos com S1.
- **Paths:** `apps/server/src/provision/rate-limiter/ioredis/IORedisRateLimiterProvider.ts` (Create); `apps/server/src/provision/rate-limiter/index.ts` (Create).
- **RF/CA:** RF-06, RF-07, RF-08; CA-10, CA-11, CA-12.
- **Resultado observável:** uma conexão ioredis dedicada usa `ENV.redisUrl`, `lazyConnect`, fila offline desativada e timeouts de 250 ms; um único Lua faz `INCR`, expiração apenas no primeiro consumo e leitura de `PTTL`; shape inválido e qualquer falha externa rejeitam com `AppError` sanitizado, sem chave, URL, host, credencial ou payload; `shutdown` fecha somente o client deste provider.
- **Rules:** `documentation/rules/provision-layer-rules.md`; `documentation/rules/server-application-rules.md`; não reutilizar `IORedisCacheProvider` nem expor tipos do SDK.
- **Exit:** testes focados do provider demonstram parsing, TLS, atomicidade, TTL, concorrência, timeout, resposta inválida e lifecycle; o teste Redis real usa prefixo exclusivo e limpa somente suas chaves.

### P1 — tentativa 1 — implementação local excepcional

- **Motivo:** três despachos do Builder Provision não produziram diff; a task principal assumiu apenas os dois paths da assignment para manter o progresso, sem ampliar o contrato.
- **Paths afetados:** `apps/server/src/provision/rate-limiter/ioredis/IORedisRateLimiterProvider.ts`; `apps/server/src/provision/rate-limiter/index.ts`.
- **RF/CA:** RF-06, RF-07, RF-08; CA-10, CA-11, CA-12.
- **Estado:** `completed`; typecheck, testes focados, Redis real e Reviewer independente passaram.
- **Próxima ação:** nenhuma; P1 liberou S2.

### S1 — Primitives Hono e autenticação

- **Status/owner:** `completed` — implementação local excepcional registrada após despacho sem diff; diff pareado por `implementation-reviewer-agent` aceito após correções.
- **Dependências/paralelismo:** depende de C1; executa em paralelo com P1; a composição concreta de HonoApp fica para S2 após ambos os contratos estarem disponíveis.
- **Paths:** `apps/server/src/app/hono/middlewares/RateLimitMiddleware.ts` (Create); `apps/server/src/app/hono/middlewares/index.ts` (Modify); `apps/server/src/app/hono/middlewares/AuthMiddleware.ts` (Modify); `apps/server/src/rest/controllers/auth/VerifyAuthenticationController.ts` (Modify); `apps/server/src/rest/controllers/auth/tests/VerifyAuthenticationController.test.ts` (Modify).
- **RF/CA:** RF-01, RF-02, RF-03, RF-04, RF-05, RF-07, RF-08; CA-01 a CA-09, CA-11, CA-12.
- **Resultado observável:** o middleware normaliza pathname/verbo e IP, deriva chave SHA-256 opaca, devolve o 429 estável com `Retry-After`, mantém breaker compartilhado e fail-open; autenticação REST só limita a conta após DTO verificado, MCP só após API key válida, e falhas auth não criam consumo de conta.
- **Rules:** `documentation/rules/server-application-rules.md`; `documentation/rules/provision-layer-rules.md`; `documentation/rules/handlers-testing-rules.md`; `documentation/rules/mcp-rules.md`; Hono, ConnInfo, Redis e Sentry permanecem fora do Core.
- **Exit:** typecheck do Server e testes focados dos contratos passam contra ports fakes; nenhuma rota chama handler após bloqueio; nenhum dado de identidade chega à telemetria.

### S1 — tentativa 1 — implementação local excepcional

- **Motivo:** os despachos e a retomada do Builder Server não produziram diff; a task principal assumiu somente os cinco paths S1 contratados, sem alterar composition root ou rotas.
- **Paths afetados:** `apps/server/src/app/hono/middlewares/RateLimitMiddleware.ts`; `apps/server/src/app/hono/middlewares/index.ts`; `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`; `apps/server/src/rest/controllers/auth/VerifyAuthenticationController.ts`.
- **RF/CA:** RF-01 a RF-05, RF-07, RF-08; CA-01 a CA-09, CA-11, CA-12.
- **Estado:** `completed`; typecheck, testes focados, integração e Reviewer independente passaram.
- **Próxima ação:** nenhuma; S1 liberou S2.

### S2 — Composition root e integração HTTP

- **Status/owner:** `completed` — composição local implementada; evidência HTTP reforçada após finding do primeiro Reviewer; rerun aceito sem findings.
- **Dependências/paralelismo:** depende de P1 e S1; não executa em paralelo; integra os contracts no runtime real de Hono.
- **Paths:** `apps/server/src/app/hono/HonoApp.ts` (Modify); `apps/server/src/constants/env.ts` (Modify); `apps/server/src/tests/fixtures/HonoFixture.ts` (Modify); `apps/server/src/app/hono/tests/HonoApp.test.ts` (Modify); `apps/server/src/tests/routes/global/RateLimiterRoute.test.ts` (Create); `apps/server/src/app/hono/routers/auth/tests/AuthRateLimitMiddleware.test.ts` (Create); `apps/server/src/app/hono/routers/mcp/tests/McpRateLimitMiddleware.test.ts` (Create).
- **RF/CA:** RF-01 a RF-08; CA-01 a CA-12.
- **Resultado observável:** produção e `HonoFixture` usam a mesma bootstrap, com CORS antes do rate limiter; HonoApp registra o limiter antes de Supabase/Inngest, injeta provider/telemetry e só aceita `X-Forwarded-For` vindo de CIDR confiável; requests Hono reais via `supertest` validam status, headers, JSON, 100/101, 60/61, autenticação REST/MCP válida e inválida, exclusões, seleção de política, dimensões, concorrência, Lua/TTL, breaker e rejeição de IP encaminhado por conexão não confiável. Não há persistência de negócio, tenant ou migration aplicável; as requests reais usam autorização apenas nos cenários autenticados e não registram tokens.
- **Rules:** `documentation/rules/server-routes-testing-rules.md`; `documentation/rules/handlers-testing-rules.md`; `documentation/rules/mcp-rules.md`; `documentation/rules/server-application-rules.md`; testes de rota ficam em `server-integration`, enquanto a fixture impede quota compartilhada nos demais testes.
- **Exit:** testes unitários, integração focada, cobertura, integridade, typecheck, build e Reviewer passam; a integração completa usa o stack Supabase local e é avaliada separadamente por seu consumo de memória.

### S3 — Alinhamento documental e handoff

- **Status/owner:** `completed` — diff documental pronto e Reviewer documental aceito sem findings.
- **Dependências/paralelismo:** depende de S2; não executa em paralelo; documentação só é atualizada após o fluxo integrado estar estabilizado.
- **Paths:** `documentation/architecture.md` (Modify); `documentation/infrastructure.md` (Modify).
- **RF/CA:** RF-01, RF-03, RF-04, RF-06, RF-07, RF-08; CA-01, CA-05, CA-07, CA-08, CA-10, CA-11, CA-12.
- **Resultado observável:** Architecture registra o adapter transversal, as duas etapas IP/conta e a fronteira Core/Server; Infrastructure registra `REDIS_URL`, Traefik/X-Forwarded-For, Redis dedicado e fail-open controlado. O handoff aponta para a Spec revisão 1 e para a Evaluation criada no kickoff da implementação.
- **Rules:** `documentation/sdd.md`; `documentation/architecture.md`; `documentation/rules/rules.md`; alinhamento sem criar requisito, schema, UI ou dependência nova.
- **Exit:** `check:spec-definition`, `check:plan-definition`, `check:spec-implementation --base 08cf4fe33e91becf68bc07dc2818c0af1d34b6c2`, revisão documental e todos os Reviewers pareados estão atuais antes de encaminhar para `conclude-spec`.

# Validation and handoff

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| MV-01 | Server local + Redis; 101 requests gerais com o mesmo IP | RF-01, RF-05; CA-01, CA-02, CA-09 | Spec, Contrato HTTP 429 | `RateLimiterRoute.test.ts`: 100 respostas `200`, 101ª `429`, JSON exato e `Retry-After` | passed |
| MV-02 | Server local; `/auth/**`, POST de execução e rotas parecidas | RF-02; CA-03, CA-04 | Spec, seleção de política | `RateLimiterRoute.test.ts`: 60/61 sensível; verbo não suportado de `/inngest` usa geral; proxy e classificação verificados | passed |
| MV-03 | Server local; `/live`, `/health`, `/inngest` e preflight CORS | RF-03; CA-05 | Spec, precedência CORS | `RateLimiterRoute.test.ts`: exclusões e preflight não chamam provider; CORS é registrado antes do limiter | passed |
| MV-04 | Requests REST/MCP autenticadas e não autenticadas | RF-04; CA-06, CA-07, CA-08 | AuthMiddleware, MCP e fluxo de runtime | testes canônicos via `HonoFixture`: IP precede auth; REST e API key válidos consomem conta após identidade; falha MCP não consome conta | passed |
| MV-05 | Redis interrompido e restaurado no runtime local | RF-07, RF-08; CA-11, CA-12 | Circuit breaker e telemetria | `RateLimiterRoute.test.ts`: fail-open, chamadas abertas não tocam provider e probe após 30s; telemetria uma vez por episódio | passed |
| Manual | Server local via HTTP com Supabase local e Redis local | RF-01 a RF-05 | Spec, Contrato HTTP 429 | rota geral: 100 respostas `401` e 101ª `429`; `/auth/account`: 60 `401` e 61ª `429`; 105 preflights CORS `2xx` sem consumo; JSON e `Retry-After` confirmados | passed |
| Sensor | `npm run format -- --filter=@stardust/core --filter=@stardust/server` | Spec, qualidade de código | Spec, Sensores obrigatórios | diff formatado e revisado durante as correções | passed |
| Sensor | `npm run check:code` | Spec, qualidade de código | AGENTS.md e Tooling | passou com warnings preexistentes | passed |
| Sensor | `npm run check:types` | RF-01 a RF-08 | Tooling e TypeScript | Core e Server compilam contra os contratos atuais | passed |
| Sensor | `npm run test:unit` | CA-09, CA-11, CA-12 e regressões | Tooling, Rules de handlers | suítes unitárias passaram sem depender de Redis real | passed |
| Sensor | `npm run test:coverage -- --filter=@stardust/core --filter=@stardust/server` | CA-01 a CA-12 | SDD, baseline de cobertura | 176 Core e 167 Server suites passaram; cobertura registrada | passed |
| Sensor | `npm run check:coverage -- @stardust/core @stardust/server` | CA-01 a CA-12 | `coverage-baseline.json` | ratchet passou após registrar 51,60% linhas, 47,11% funções e 83,33% branches do Server | passed |
| Sensor | `npm run test:integration -- --filter=@stardust/server` | CA-01 a CA-12 | Server route-testing Rules | stack Supabase local iniciou e aplicou as migrations; suíte completa avançou com rotas passando, mas o processo Jest abortou por OOM | warning |
| Sensor | `npm run check:architecture` | fronteiras Core/Server/Provision | Architecture e dependency cruiser | nenhuma dependência proibida | passed |
| Sensor | `npm run check:complexity` | RF-07, RF-08 | Tooling | 8.283 funções dentro dos thresholds após atualização restrita do baseline | passed |
| Sensor | `npm run check:test-integrity` | CA-01 a CA-12 | SDD e Rules de testes | paths e pareamento de testes aceitos | passed |
| Sensor | `npm run check:spec-definition -- documentation/features/global/rate-limiter/spec.md` | Spec revisão 1 | Spec e SDD | definição da Spec continua válida | passed |
| Sensor | `npm run check:plan-definition -- documentation/features/global/rate-limiter/plan.md --json` | Plan revisão 1 | `create-plan` | frontmatter, DAG, builders, Reviewers e referências passam | passed |
| Sensor | `npm run check:spec-implementation -- documentation/features/global/rate-limiter/spec.md --base 08cf4fe33e91becf68bc07dc2818c0af1d34b6c2` | mapa canônico de paths | SDD preflight | 17 paths contratados conformes | passed |
| Build | `npm run build:core` | RF-06, CA-10 | Tooling | pacote Core gera build atual | passed |
| Build | `npm run build:server` | RF-01 a RF-08 | Tooling | Server gera build atual sem importar detalhes do SDK fora do provider | passed |
| Environment | `docker compose up -d redis` e Redis local | CA-10, CA-11 | `docker-compose.yml`, Spec | serviço `redis:8-alpine` `Up` em `6379`; cleanup limitado à chave de teste | passed |
| Environment | `npm run db:test -w @stardust/server` e Supabase local | integração Server | Server route-testing Rules | stack local recriado para PostgreSQL 17.6 e migrations aplicadas; serviço Mailpit excluído para evitar conflito de porta | passed |
| Environment | Server local com `.env.development` | MV-01 a MV-05 | AGENTS.md, Tooling | testes executados sem expor credenciais, URL ou tokens | passed |
| Reviewer | `Builder Core` após C1 | RF-05, RF-06; CA-09, CA-10 | `implementation-reviewer-agent` | Reviewer aceitou port, exports e header | accepted |
| Reviewer | `Builder Provision` após P1 | RF-06, RF-07, RF-08; CA-10, CA-11, CA-12 | `implementation-reviewer-agent` | Reviewer aceitou adapter, Lua, TTL, parsing e lifecycle | accepted |
| Reviewer | `Builder Server` após S1 | RF-01 a RF-05, RF-07, RF-08; CA-01 a CA-09, CA-11, CA-12 | `implementation-reviewer-agent` | Reviewer aceitou primitives Hono/auth após correções | accepted |
| Reviewer | `Builder Server` após S2 | RF-01 a RF-08; CA-01 a CA-12 | `implementation-reviewer-agent` | primeiro veredito reprovou evidência; testes reforçados e rerun aceito sem findings | accepted |
| Reviewer | `Builder Server` após S3 | RF-01, RF-03, RF-04, RF-06, RF-07, RF-08; CA-01, CA-05, CA-07, CA-08, CA-10, CA-11, CA-12 | `implementation-reviewer-agent` | documentação aceita; sem findings | accepted |
| Visual | Nenhuma surface frontend, viewport ou Pencil | não aplicável | Spec, Cenários manuais e de runtime | registro explícito de ausência de UI/design; nenhum screenshot necessário | not_applicable |
| Handoff | `implement-spec` → `conclude-spec` → `create-pr` | todos RF/CA, sensores, MV e Reviewers | SDD | Evaluation `completed`, Spec/Plan completos e worktree avaliado contra o commit-base | completed |

## Handoff operacional

- A Wave 1 cria somente o port e o header. Após seu diff, a task principal
  executa o Reviewer pareado e registra o resultado antes de aceitar C1.
- P1 e S1 podem iniciar após C1 porque seus paths não se sobrepõem; S2 aguarda
  ambos para compor o provider concreto, o middleware e a fixture no mesmo
  runtime.
- A validação Redis real usa `docker compose` e prefixo exclusivo. A integração
  do Server usa o Supabase local como ambiente compartilhado, mas esta Spec não
  aplica migration nem grava dados de negócio; autorização é exercitada somente
  onde o cenário exige, com variáveis locais e sem exposição de segredos.
- A validação manual é HTTP/runtime no Server, não browser: verificar
  request/response, status, headers, JSON, ordem de autorização, tenant não
  aplicável, latência do breaker e telemetria sanitizada.
- Não existe interação cross-boundary sem Builder responsável; por isso não há
  revisão integrada adicional além dos Reviewers pareados por diff.

# Execution log

- **2026-09-12 — Grilling confirmado:** Q1 aprovou ownership e waves; Q2
  aprovou bootstrap compartilhada, ordem CORS/limiter e injeção de doubles; Q3
  aprovou Redis real local, fakes para middleware, HTTP Hono real, runtime com
  `.env.development` e Supabase Dev não aplicável. Nenhuma implementação foi
  autorizada por essa confirmação.
- **2026-09-12 — Preflight inicial:** `check:spec-implementation` foi executado
  contra `08cf4fe33e91becf68bc07dc2818c0af1d34b6c2` e falhou porque os paths
  contratados ainda não foram implementados; isso é o estado esperado antes de
  C1 e será substituído por evidência atual após o diff do Builder.
- **2026-09-12 — S2 reforçada após review:** o primeiro Reviewer encontrou que
  as suítes contornavam o composition root e não exercitavam autenticação. Os
  testes canônicos agora usam `HonoFixture`/`supertest`, cobrem 100/101, 60/61,
  exclusões, CORS, breaker, REST verificado e API key válida/inválida. A
  integração focada passou com 3 suítes e 9 testes; o rerun do Reviewer aceitou
  S2 sem findings.
- **2026-09-12 — S3 e alinhamento final:** a documentação foi alinhada ao
  contrato vigente, sem `X-Real-IP`: XFF válido mais à direita e, na ausência,
  endereço da conexão. O Reviewer rerun de S3 aceitou sem findings.
- **2026-09-12 — Builder Fix IR-01:** o Reviewer encontrou que formas IPv4 e
  IPv4-mapped IPv6 podiam derivar chaves diferentes. O fix consolidou decimal,
  hexadecimal comprimido e hexadecimal expandido, adicionou regressão HTTP e o
  Reviewer rerun aceitou S1 sem findings.
- **2026-09-12 — Gates finais:** check de código, tipos, unitários, cobertura,
  arquitetura, integridade, complexidade e builds Core/Server passaram. A suíte
  integral do Server continua registrada como warning por OOM; as 3 suítes
  canônicas passaram com 10 testes.
