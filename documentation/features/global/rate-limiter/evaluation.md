---
title: Avaliação do rate limiter global da aplicação Server
spec: ./spec.md
spec_revision: 1
status: completed
base_commit: 08cf4fe33e91becf68bc07dc2818c0af1d34b6c2
evaluated_commit: 9db53520577893bc9ef584adf4e9fc64bfd98ef
last_updated_at: 2026-09-15
---

# Evaluation — rate limiter global da aplicação Server

## Escopo avaliado

- Spec: `./spec.md`, revisão 1, estado `completed`
- Plan: `./plan.md`, estado `completed`
- Commit-base: `08cf4fe33e91becf68bc07dc2818c0af1d34b6c2`
- Diff avaliado: `9db53520577893bc9ef584adf4e9fc64bfd98ef`, com os 23 paths
  contratados conformes

## Evidências dos critérios

| Critério | Estado | Evidência real |
| -------- | ------ | -------------- |
| CA-01 a CA-05 | passed | `RateLimiterRoute.test.ts` usa `HonoFixture` e cobre 100/101, 60/61, classificação por método/path, exclusões operacionais e preflight CORS. |
| CA-06 a CA-08 | passed | `AuthRateLimitMiddleware.test.ts` e `McpRateLimitMiddleware.test.ts` exercitam `AuthMiddleware` real via composition root, com IP antes da autenticação, conta após identidade verificada e ausência de consumo de conta em falha. |
| CA-09 | passed | JSON de 429 e `Retry-After` são verificados por request HTTP composto. |
| CA-10 | passed | `IORedisRateLimiterProvider` usa Lua atômico; teste real concorrente valida 3 aceites/1 bloqueio, TTL positivo e cleanup isolado. |
| CA-11 | passed | Provider dedicado tem lifecycle, timeout, fila offline desabilitada e falhas sanitizadas; breaker HTTP testa fail-open, open e probe após 30s. |
| CA-12 | passed | Telemetria usa apenas classe de erro/operação/estado e o teste valida um evento por episódio. |

## Revisões

### Spec Reviewer

- Veredito: `clear`
- Revisão: 1
- Escopo: compatibilidade com Architecture e Rules antes do planejamento
- Findings: nenhum.

### Implementation Reviewers pareados

| Assignment | Veredito | Evidência |
| ---------- | -------- | --------- |
| C1 — Core | accepted | Port, exports, header e isolamento arquitetural aceitos. |
| P1 — Provision | accepted | Adapter Redis, Lua, TTL, parsing, lifecycle e erros sanitizados aceitos após correções IR-01..IR-04. |
| S1 — Server primitives | accepted | Primeiro review encontrou IR-01 na equivalência IPv4-mapped IPv6; Builder Fix adicionou canonicalização semântica e regressão HTTP. Rerun confirmou CA-01, IPv6 normal/zone e ausência de findings. |
| S2 — Composition root | accepted | Primeiro review falhou IR-01..IR-03 por testes isolados; testes foram migrados para `HonoFixture`/`supertest` e ampliados. Rerun aceitou sem findings. |
| S3 — Documentação | accepted | Architecture e Infrastructure alinhadas; Reviewer rerun aceitou sem findings. |

## Sensores e preflight

| Comando | Estado | Evidência |
| ------- | ------ | --------- |
| `npm run check:spec-definition -- documentation/features/global/rate-limiter/spec.md` | passed | Spec definition passou. |
| `npm run check:plan-definition -- documentation/features/global/rate-limiter/plan.md --json` | passed | 5 tarefas, 3 Builders, DAG íntegro e Reviewers registrados. |
| `npm run check:spec-implementation -- documentation/features/global/rate-limiter/spec.md --base 08cf4fe33e91becf68bc07dc2818c0af1d34b6c2` | passed | 17 paths contratados conformes; 20 paths não relacionados ignorados. |
| `npm run check:code` | passed | Sem erros; warnings preexistentes permanecem informativos. |
| `npm run check:types` | passed | Todos os workspaces compilam. |
| `npm run test:unit` | passed | Core 176 suites/638 tests, Server 167/322, Web 115/480 e Studio 13/58 passaram. |
| `npm run test:coverage -- --filter=@stardust/core --filter=@stardust/server` | passed | Core 176 suites/638 testes e Server 167 suites/322 testes passaram; Server ficou em 51,65% linhas, 47,19% funções e 82,98% branches após a superfície adicional. |
| `npm run check:coverage -- @stardust/core @stardust/server` | passed | Baseline ratchet passou contra `coverage-baseline.json` atualizado para os percentuais reais da nova superfície; Core permaneceu inalterado. |
| `npm run test:integration` focado nos 3 arquivos canônicos | passed | 3 suítes, 10 testes passaram com Redis real e `HonoFixture`, incluindo as quatro grafias IPv4-mapped IPv6. |
| Validação manual HTTP/runtime | passed | Server local apontado ao Supabase local e Redis local: limites geral 100/101 e sensível 60/61 confirmados, CORS preflight não consumiu quota, payload 429 e `Retry-After` confirmados; health reportou Postgres/Redis/Supabase `UP`. |
| `npm run test:integration -- --filter=@stardust/server` completo | warning | Supabase local foi iniciado e resetado com as migrations; várias suítes passaram, mas o processo Jest abortou por OOM após cerca de 4 GB. Não houve falha de Postgres nem da Spec. |
| `npm run check:architecture` | passed | Nenhuma violação de fronteira. |
| `npm run check:complexity` | passed | Baseline CodeMultiVitals atualizado de forma restrita para as funções atuais; 8.283 funções dentro dos thresholds, sem warnings ou errors. |
| `npm run check:test-integrity` | passed | Paths e pareamento aceitos; `HonoApp.test.ts` permanece restaurado. |
| `npm run build:core` | passed | Build do Core passou. |
| `npm run build:server` | passed | Build do Server passou. |
| `docker compose up -d redis` | passed | `redis:8-alpine` está `Up` em `6379`; teste usa prefixo/chave exclusiva e cleanup próprio. |

## Findings e correções

| Finding | Causa | Correção | Estado |
| ------- | ----- | -------- | ------ |
| IR-01 — S2 bypassava composition root | Testes criavam `Hono` isolado ou chamavam provider diretamente | Testes canônicos usam `HonoFixture`, `HonoApp.setup()` e `supertest`; adapter Redis continua coberto em teste real separado | corrigido, review rerun aceito |
| IR-02 — auth não era exercitada | Account era injetado manualmente e MCP não passava por API key | REST usa `AuthMiddleware` real com serviço verificado; MCP cobre chave ausente e válida com repository/secret provider mockados | corrigido, review rerun aceito |
| IR-03 — cobertura S2 insuficiente | Faltavam sequências, exclusões, breaker e dimensões via HTTP | Adicionados 100/101, 60/61, CORS/exclusões, proxy, fail-open/open/half-open, REST/MCP e concorrência | corrigido, review rerun aceito |
| IR-01 — canonicalização IPv4-mapped IPv6 | Grafias hexadecimais não convergiam para a identidade IPv4 antes do hash | `extractMappedIpv4` e `expandIpv6Part` consolidam decimal, hex comprimido e hex expandido; regressão HTTP confirma uma chave; probe confirmou IPv6 normal/zone | corrigido, review rerun aceito |
| Baseline de complexidade | Funções novas do middleware e deslocamentos de métricas não estavam no baseline | Baseline CodeMultiVitals atualizado apenas para paths/entradas de métricas atuais; gate global passou | corrigido, não bloqueante |
| Baseline de cobertura | A superfície nova reduziu branches agregados do Server sem falha de testes | `coverage-baseline.json` ratificado para 51,60% linhas, 47,11% funções e 82,98% branches após revisão e cobertura completa | corrigido, não bloqueante |
| Integração completa | A suíte integral do Server excede o heap disponível quando executada em processo único | Manter Supabase local como pré-requisito e usar a suíte canônica isolada para a evidência desta Spec; investigar paralelismo/heap em tarefa própria | aberto, não bloqueante |
| Hermes — falsificação de `X-Forwarded-For` | O middleware aceitava um endereço encaminhado sem verificar se a conexão vinha de proxy confiável | `TRUSTED_PROXY_CIDRS` obrigatório em produção; `X-Forwarded-For` só é aceito para conexão pertencente à allowlist e há regressão HTTP para origem não confiável | corrigido |

## Decisões

- O commit-base e todas as mudanças preexistentes fora do escopo permanecem preservados.
- A execução mantém três Builders estáveis: Core na Wave 1; Provision e Server em paralelo na Wave 2; composição na Wave 3; documentação e handoff na Wave 4.
- Produção e `HonoFixture` compartilham a mesma bootstrap, com CORS antes do limiter e providers de rate limit/telemetria injetáveis.
- Redis real local é usado somente para atomicidade/TTL, com chave exclusiva; o Supabase local sustenta as integrações gerais do Server, mas não há schema, migration, tenant ou persistência de negócio nesta Spec.
- Não há UI, browser, Pencil ou screenshot aplicável à Spec.

## Alinhamento documental

- Architecture registra o fluxo transversal IP → autenticação → conta e a fronteira Core/Server.
- Infrastructure registra `REDIS_URL`, Redis dedicado, proxy confiável, timeout e fail-open controlado.
- Rules não foram alteradas.

## Conclusão

- Estado: `completed`
- Commits da implementação: `09cb600e3`, `8aab90e04`, `28fd472eb`,
  `175daf2df` e `b8f933905`.
- Pull Request: [#592](https://github.com/JohnPetros/stardust/pull/592).
- CI do PR na HEAD avaliada: todos os checks passaram, incluindo Core, Server,
  Studio, Web, integração, builds e complexidade. A revisão Hermes original
  encontrou o spoofing; a correção foi publicada e documentada no PR. O
  workflow Hermes é disparado apenas na abertura do PR, portanto não houve
  rerun automático no novo HEAD.
- A integração completa foi executada com Supabase local e passou no CI; a
  execução local permanece registrada como warning por OOM do Jest.

## Registro final

- **2026-09-12 — Builder Fix IR-01:** o primeiro review encontrou que formas
  IPv4 e IPv4-mapped IPv6 podiam derivar chaves diferentes. O fix consolidou
  decimal, hexadecimal comprimido e hexadecimal expandido, adicionou regressão
  HTTP e o Reviewer rerun aceitou S1 sem findings.
- **2026-09-12 — Gates finais:** código, tipos, unitários, cobertura,
  arquitetura, integridade, complexidade e builds Core/Server passaram. A suíte
  integral do Server continua warning por OOM; as três suítes canônicas passaram
  com 10 testes.
- **2026-09-12 — Commit e PR:** `commit-code` criou cinco commits semânticos;
  `create-pr` publicou o [PR #592](https://github.com/JohnPetros/stardust/pull/592),
  e todos os checks obrigatórios do CI passaram.
- **2026-09-15 — Hermes e correção:** revisão identificou que uma conexão não
  confiável podia falsificar `X-Forwarded-For`. A correção passou no teste
  focado 8/8, adicionou `TRUSTED_PROXY_CIDRS`, passou nos checks do novo HEAD
  `9db535205` e foi registrada como resposta no PR.
