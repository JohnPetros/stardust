---
description: Prompt para conduzir diagnóstico de performance no projeto StarDust, cobrindo bundle, data fetching, queries, jobs e runtime em todas as camadas da arquitetura (web e server).
---

# Prompt: Diagnóstico de Performance — StarDust

## Objetivo

Conduzir um diagnóstico de performance orientado à arquitetura do StarDust, identificando gargalos, waterfalls, desperdícios de bundle e problemas de runtime em todas as camadas do sistema (Build, UI, RPC, REST, Queue, Database, Provision, Assets). O resultado deve ser um relatório com issues classificados por área e esforço, com recomendações de correção alinhadas às convenções do projeto.

---

## Entradas

- **Obrigatórias:**
  - Aplicação alvo `{APP}` (ex: `web`, `server`, `studio`)
  - Escopo do diagnóstico `{ESCOPO}` (ex: módulo `auth`, rota `/space`, feature `lesson`, ou `full`)
  - Arquivos ou caminhos alvo `{ALVOS}` (ex: `apps/web/src/rpc/`, `apps/server/src/queue/`)
- **Opcionais:**
  - Métricas ou sintomas observados `{SINTOMAS}` (ex: "LCP alto na landing page", "endpoint /auth/account lento", "job de XP demora demais")
  - Critérios de sucesso `{CRITERIOS}` (ex: "reduzir bundle JS em 50%", "eliminar waterfalls de auth", "reduzir latência do endpoint para <100ms")
  - Restrições `{RESTRICOES}` (ex: "não alterar schema de banco", "preservar comportamento funcional")

---

## Mapa de Áreas para Diagnóstico

Antes de iniciar, identifique quais áreas estão no escopo e os arquivos de regra relevantes:

### `apps/web`

| Área | Arquivos-Chave | Problemas Típicos |
|------|---------------|-------------------|
| **Build** | `apps/web/next.config.js`, `package.json` | Minificação desabilitada (`minimizer = []`), `optimizePackageImports` ausente |
| **Bundle / Frontend** | `apps/web/src/ui/**/index.tsx`, `lotties.ts` | Imports estáticos de libs pesadas sem `next/dynamic`, JSONs Lottie inlined, barrel imports de ícones |
| **Data Fetching / RPC** | `apps/web/src/rpc/next-safe-action/clients/`, `apps/web/src/rpc/actions/` | `authActionClient` com chamadas sequenciais sem cache, fetches que deveriam ser `Promise.all` |
| **Data Fetching / REST** | `apps/web/src/rest/next/NextRestClient.ts`, `apps/web/src/rest/controllers/` | `isCacheEnabled: false` como default, `fetchAccount` chamado antes de verificar rota pública |
| **Middleware** | `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts` | API call incondicional em toda request, incluindo rotas públicas |
| **Re-renders / Runtime** | `apps/web/src/ui/**/contexts/`, `hooks/` | `useMemo` ausente em criações de objeto, `form.watch()` sem campo, scroll listeners sem throttle |
| **Assets** | `apps/web/public/lotties/`, `apps/web/public/audios/` | Arquivos WAV não comprimidos, JSONs Lottie importados estaticamente |

### `apps/server`

| Área | Arquivos-Chave | Problemas Típicos |
|------|---------------|-------------------|
| **API / Controllers** | `apps/server/src/rest/controllers/`, `apps/server/src/app/hono/routers/` | Handlers sem paginação, serialização excessiva de entidades, N+1 entre repositórios no controller |
| **API / Middleware** | `apps/server/src/app/hono/middlewares/` | Middlewares pesados executando em rotas que não precisam (ex: auth em rota pública) |
| **Database / Repositories** | `apps/server/src/database/supabase/repositories/` | `select('*')` em tabelas com muitas colunas, N+1 entre repositórios, ausência de `calculateQueryRange`, joins pesados sem índice |
| **Database / Mappers** | `apps/server/src/database/supabase/mappers/` | Loops síncronos em arrays grandes, normalização de tipos ausente (campos numéricos do Supabase chegando como `string \| null`) |
| **Queue / Jobs** | `apps/server/src/queue/jobs/`, `apps/server/src/queue/inngest/functions/` | Steps independentes em sequência em vez de `Promise.all`, IO fora de `amqp.run`, jobs sem idempotência |
| **Provision / Cache** | `apps/server/src/provision/cache/UpstashCacheProvider.ts` | Cache não utilizado em endpoints de leitura estável, TTL ausente ou muito curto |
| **Provision / Telemetria** | `apps/server/src/provision/monitor/SentryTelemetryProvider.ts` | Erros silenciados sem reporte ao Sentry, ausência de spans em operações críticas |
| **REST Client / Axios** | `apps/server/src/rest/axios/AxiosRestClient.ts` | Sem timeout configurado, sem retry em falhas transitórias |
| **Build** | `apps/server/package.json`, `tsup.config.ts` | Dependências desnecessárias no bundle de produção |

---

## Checklist de Diagnóstico por Área

### `apps/web` — 📦 Build e Bundle

- [ ] `next.config.js` não desabilita `config.optimization.minimizer` (remove 40-60% do JS de produção)
- [ ] Libs pesadas usam `next/dynamic({ ssr: false })`: Three.js, tsparticles, swiper, react-confetti, typewriter-effect, html-to-image
- [ ] JSONs Lottie não são importados estaticamente — usar `fetch('/lotties/${name}.json')` ou dynamic `import()`
- [ ] `@phosphor-icons/react` importado de `/dist/ssr` para se beneficiar do `optimizePackageImports`
- [ ] `next.config.js` tem `optimizePackageImports` configurado para libs de ícones/componentes

### `apps/web` — 🌐 Data Fetching

- [ ] `VerifyAuthRoutesController` verifica `isPublicRoute` **antes** de chamar `fetchAccount()` — rotas públicas não fazem API call
- [ ] `ServerProviders` não duplica `fetchAccount()` já feito no middleware — usar `isCacheEnabled: true` ou passar `accountDto` via props
- [ ] `authActionClient` não faz 2 chamadas sequenciais não-cacheadas (`fetchAccount` + `fetchUserById`) em toda server action
- [ ] `NextRestClient` usa `isCacheEnabled: true` como default para endpoints de leitura estável (planetas, achievements, challenges metadata)
- [ ] Fetches independentes dentro de uma mesma action usam `Promise.all` em vez de `await` sequencial (ref: `FetchLessonStoryAndQuestionsAction`)
- [ ] Slots paralelos do Next.js (ex: `@tabContent/comments`) não rebuscam dados já carregados na página pai

### `apps/web` — 🔄 Re-renders e Runtime

- [ ] Objetos de domínio criados durante render estão memoizados com `useMemo` (ex: `User.create(userDto)` no `AuthContext`)
- [ ] `form.watch()` do react-hook-form especifica campos concretos — sem `watch()` sem argumento
- [ ] Scroll listeners globais usam throttle ou `IntersectionObserver` (ref: `useToast`)
- [ ] Contextos grandes separados em dados vs ações para evitar re-render cascade (ex: `AuthContext`)
- [ ] Listas longas com potencial de crescimento usam virtualização (`@tanstack/react-virtual`) — Ranking, Comments, Solutions

### `apps/web` — 🗃️ Assets

- [ ] Arquivos de áudio em MP3/OGG — não WAV (~80% de economia)
- [ ] Animações Lottie carregadas sob demanda — não inlined no bundle JS
- [ ] Imagens com `next/image` para lazy loading e otimização automática

### `apps/server` — 🗄️ Database e Queries

- [ ] Queries Supabase usam `.select('col1, col2')` explícito — sem `select('*')` em tabelas com muitas colunas
- [ ] Repositórios que precisam de dados relacionados usam joins no Supabase em vez de N+1 queries separadas (ex: `select('*, users(...)')`)
- [ ] Listagens de recursos usam `calculateQueryRange` para paginação — sem `findAll()` irrestrito em tabelas de crescimento ilimitado
- [ ] Mappers não executam loops síncronos pesados em arrays grandes
- [ ] Tipos numéricos do banco são normalizados nos mappers antes de chegar ao Core (ex: `Number(value)` — ref: bug `SupabasePlanetMapper`)

### `apps/server` — ⚡ API e Controllers

- [ ] Controllers retornam DTOs mínimos — sem serializar entidades completas quando apenas subsets são necessários
- [ ] Middlewares de auth aplicados apenas nas rotas que precisam — sem overhead em rotas públicas
- [ ] Endpoints de leitura estável utilizam `UpstashCacheProvider` para evitar round-trips desnecessários ao Supabase
- [ ] `AxiosRestClient` tem timeout configurado — sem requests indefinidamente pendentes em integrações externas

### `apps/server` — 🎞️ Queue e Jobs (Inngest)

- [ ] Steps independentes dentro de um job usam `Promise.all` em vez de `await` sequencial
- [ ] Todo IO externo (repositório, provider) roda dentro de `amqp.run` para garantir rastreabilidade e retries
- [ ] Jobs são idempotentes — reprocessamento pelo Inngest não causa duplicações (ex: XP duplicado, conquista concedida duas vezes)
- [ ] Jobs com payloads grandes não carregam dados desnecessários — payload mínimo, dados buscados dentro do `amqp.run`
- [ ] Cron jobs (`CRON_EXPRESSION`) não executam em janelas de alto tráfego sem necessidade

### `apps/server` — 🔭 Observabilidade

- [ ] Erros críticos em controllers e jobs são reportados via `SentryTelemetryProvider` — sem `try/catch` silencioso
- [ ] Operações lentas têm spans de tracing identificáveis no Sentry
- [ ] Logs estruturados presentes em operações de alto volume para facilitar diagnóstico de latência

---

## Diretrizes de Execução

### Passo 1: Mapeamento do Escopo

- Identifique quais áreas e módulos estão no `{ESCOPO}` e qual app está sendo analisado.
- Para `web`: mapeie o fluxo browser → middleware → server component → action → UI.
- Para `server`: mapeie o fluxo request HTTP → Hono router → middleware → controller → use case → repository → response.
- Para jobs: mapeie evento → Inngest function → job handler → steps → efeitos.
- Marque explicitamente os pontos de I/O (Supabase, Upstash, Axios, Inngest) e pontos de CPU (parse, serialização, mapeamento).

### Passo 2: Coleta de Evidências

- Leia apenas os arquivos necessários para sustentar as evidências — não leia o projeto inteiro.
- Para cada suspeita de gargalo, localize o arquivo e a linha específica.
- Se houver dúvida sobre comportamento de lib (ex: Supabase query planner, Inngest steps, Next.js cache), consulte a documentação oficial antes de classificar como issue.
- Sem métricas reais disponíveis, sinalize como **estimativa por análise estática** e indique como medir.

### Passo 3: Classificação de Issues

| Esforço | Critério |
|---------|----------|
| **S** | Mudança pontual em 1 arquivo, menos de 30 min (ex: adicionar `select` explícito, `Promise.all`, trocar import) |
| **M** | Mudança em 2-5 arquivos, 1-3h (ex: adicionar cache em endpoint, refatorar mapper, ajustar paginação) |
| **L** | Mudança estrutural, 1+ dias (ex: novo endpoint consolidado, separar contextos, índice no banco com migração) |

| Impacto | Critério |
|---------|----------|
| 🔴 **Alto** | Afeta todas as requests ou o initial load — middleware, N+1 em listagens, jobs sem idempotência |
| 🟡 **Médio** | Afeta rotas específicas ou usuários autenticados — fetches sequenciais, queries sem paginação, re-renders de contexto |
| 🟢 **Baixo** | Afeta componente isolado ou operação pontual — scroll listener, assets individuais, mapper sem normalização |

### Passo 4: Relatório

Produza o relatório seguindo o template abaixo.

---

## Template de Saída (Estrutura Obrigatória)

```md
---
app: {APP}
status: open|closed
last_updated_at: {DATA}
---

# Diagnostico de Performance - `apps/{APP}`

## Escopo

- **Tarefa:** {TAREFA}
- **Alvo:** `apps/{APP}` -- {DESCRICAO_DO_ALVO}
- **Criterios de sucesso:** {CRITERIOS}
- **Restricoes:** {RESTRICOES}

---

## Assuncoes e Pendencias

**Assuncoes:**
- {ASSUNCAO_1}
- {ASSUNCAO_2}

**Pendencias:**
- {PENDENCIA_1}
- {PENDENCIA_2}

---

## Mapa do Fluxo

[Para web]
```text
[Browser] --(HTTP)--> [Next.js Middleware / VerifyAuthRoutesController]
                           |
                           v
                      [Server Component / Layout / ServerProviders]
                           |
                           v
                      [RPC Action via authActionClient]
                           |
                           v
                      [Response -> React Render -> Client Hydration -> SWR]
```

[Para server]
```text
[Cliente HTTP] --(HTTP)--> [Hono Router]
                                |
                                v
                           [Middlewares: verifyAuthentication, validationMiddleware]
                                |
                                v
                           [Controller.handle(http)]
                                |
                                v
                           [UseCase.execute(dto)]
                                |
                                v
                           [Repository -> Supabase Query -> Mapper -> Entity/DTO]
                                |
                                v
                           [http.send(dto)]
```

[Para jobs]
```text
[Evento via InngestBroker]
        |
        v
[Inngest Function (composition root)]
        |
        v
[Job.handle(amqp)]
        |
        v
[amqp.run("step", () => UseCase.execute())]
        |
        v
[Efeito: persistência / notificação / cache invalidation]
```

**Pontos de I/O criticos:**
1. {PONTO_IO_1}
2. {PONTO_IO_2}

---

## Evidencias Coletadas

Todas as evidencias abaixo foram verificadas diretamente no codigo fonte.

---

## Issues de Performance (Prioridade)

### ISSUE-01: {TITULO}

- **Area:** Build | Frontend/Bundle | API/Middleware | API/RPC | API/REST | API/Controllers | Database/Queries | Database/Mappers | Queue/Jobs | Provision/Cache | Frontend/Re-renders | Assets
- **App:** web | server
- **Sintoma:** {SINTOMA}
- **Causa provavel:** {CAUSA} (`caminho/do/arquivo.ts:linha`)
- **Evidencia:** `caminho/do/arquivo.ts:linhas`:
  ```ts
  // trecho de código problemático
  ```
- **Impacto:** {IMPACTO} (ex: "N+1 queries a cada listagem", "~200ms de waterfall por page load")
- **Risco:** Baixo | Médio | Alto. Regressão possível: {RISCO_REGRESSAO}
- **Correcao (quick win):** {CORRECAO_RAPIDA}
- **Correcao (robusta):** {CORRECAO_ESTRUTURAL} _(opcional)_
- **Como validar:** {VALIDACAO} (ex: contar queries no log do Supabase antes/depois)
- **Estimativa:** S | M | L

---

## Recomendacoes (Plano em Etapas)

### Etapa 1: Quick Wins (1-2 dias)

| # | Acao | App | Issues | Impacto Estimado |
|---|------|-----|--------|-----------------|
| 1 | ... | web | ISSUE-01 | ... |
| 2 | ... | server | ISSUE-02 | ... |

### Etapa 2: Correcoes Estruturais (3-5 dias)

| # | Acao | App | Issues | Impacto Estimado |
|---|------|-----|--------|-----------------|
| 1 | ... | server | ISSUE-XX | ... |

### Etapa 3: Hardening (1 semana+)

| # | Acao | App | Issues | Impacto |
|---|------|-----|--------|---------|
| 1 | ... | server | ISSUE-XX | ... |

---

## Instrumentacao e Medicao

| KPI | App | Onde Medir | Como Medir | Baseline |
|-----|-----|-----------|------------|----------|
| Bundle JS total | web | Build output | `next build` -> `.next/static` total size | Rodar antes das correcoes |
| TTFB | web | Browser/Lighthouse | `npx lighthouse http://localhost:3000 --output json` | Medir agora |
| LCP | web | Browser | Lighthouse ou `web-vitals` lib | Medir agora |
| API calls por page load | web | Backend logs | Contar requests para `/auth/account` por page view | Medir agora |
| Latencia de endpoint | server | Sentry / logs | Tempo medio de resposta por rota | Medir agora |
| Queries por request | server | Supabase logs | Contar queries SQL por request HTTP | Medir agora |
| Duracao de job | server | Inngest dashboard | Tempo de execucao por function | Medir agora |

---

## Checklist de Verificacao

- [ ] Nao mudou comportamento funcional (testes passam: `npm run test -w @stardust/{APP}`)
- [ ] Build completa com sucesso (`npm run build -w @stardust/{APP}`)
- [ ] Typecheck passa (`npm run typecheck -w @stardust/{APP}`)
- [ ] Qualidade passa (`npm run codecheck -w @stardust/{APP}`)
- [ ] Metricas comparadas antes/depois (bundle size, latencia, query count)
- [ ] Jobs idempotentes validados com reprocessamento manual no Inngest dashboard _(se aplicavel)_
- [ ] {VALIDACAO_ESPECIFICA_DO_ESCOPO}

---

## Referencias

- `documentation/architecture.md`
- `documentation/rules/server-application-rules.md`
- `documentation/rules/database-rules.md`
- `documentation/rules/queue-layer-rules.md`
- `documentation/rules/provision-layer-rules.md`
- `documentation/reports/web-app-performance-report.md`
- `{OUTROS_ARQUIVOS_CONSULTADOS}`
```

---

## Restrições

- **Não invente** caminhos de arquivo, APIs, nomes de módulos ou métricas sem evidência na codebase.
- Cite sempre o arquivo e a linha do problema — sem issues genéricos sem localização.
- Separe fato (evidência encontrada no código) de hipótese (suspeita sem confirmação) de experimento (sugestão de como medir).
- Não proponha correções que violem os contratos entre camadas definidos em `documentation/rules/` (ex: job não pode importar Inngest diretamente, core não pode depender de `apps/`, provider não pode expor tipos do SDK).
- Correções de banco devem ser compatíveis com a interface de repositório do core — não alterar contratos sem avaliar impacto no domínio.
- Se uma correção impactar o fluxo de auth, inclua validação explícita (rotas públicas, redirect para `/space`, cookies) no checklist.
- Quando não houver métricas reais disponíveis, sinalize como **análise estática** e inclua o instrumento de medição nas pendências.
- Issues sem `Como validar` concreto não devem ser incluídos no relatório.