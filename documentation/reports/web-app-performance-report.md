# Diagnostico de Performance - `apps/web`

## Escopo

- **Tarefa:** Identificar gargalos e riscos de performance no frontend web (Next.js 15) do StarDust.
- **Alvo:** `apps/web` -- todas as rotas, paginas, componentes, middleware, data fetching, e configuracao de build.
- **Criterios de sucesso:** Reducao de bundle JS, eliminacao de waterfalls de API, melhoria de TTFB/LCP nas rotas principais (landing, space, challenging, lesson).
- **Restricoes:** Nao alterar schema de banco; nao mudar comportamento funcional; preservar arquitetura DDD/hexagonal.

## Assuncoes e Pendencias

**Assuncoes:**
- Nao ha metricas de producao (Lighthouse, CrUX, p95/p99) disponiveis; severidade estimada por analise estatica do codigo.
- O backend (`apps/server`) responde em tempo razoavel (~50-200ms por chamada); o impacto das waterfalls assume essa latencia.

**Pendencias:**
- Rodar `next build && next analyze` para confirmar tamanhos reais de bundle por rota.
- Coletar metricas reais de TTFB/LCP/INP em staging/prod para priorizar com dados.
- Confirmar se WAV files sao carregados eagerly ou lazy pelo browser (depende dos componentes de audio).

## Mapa do Fluxo

```text
[Browser] --(HTTP)--> [Middleware: VerifyAuth + SetAccessToken + HandleRewarding + HandleRedirect]
                            |
                            v (fetchAccount -- API call a cada request)
                       [Next.js Server Component / Layout]
                            |
                            v (ServerProviders: fetchAccount novamente + cookies)
                       [RPC Action via authActionClient]
                            |
                            v (fetchAccount + fetchUserById -- 2 API calls sequenciais)
                       [Action handler: fetches adicionais]
                            |
                            v
                       [Response -> React Render -> Client Hydration]
                            |
                            v (Client: SWR fetches, Zustand stores, contextos)
                       [UI renderizada]
```

**Pontos de I/O criticos:**
1. Middleware -> Backend API (toda request)
2. ServerProviders -> Backend API (toda page navigation)
3. authActionClient -> Backend API (2x sequenciais, toda action)
4. SWR hooks -> Backend API (client-side, agressivo sem global config)

## Evidencias Coletadas

Todas as evidencias abaixo foram verificadas diretamente no codigo fonte.

## Issues de Performance (Prioridade)

### ISSUE-01: Minificacao de JS desabilitada em producao

- **Area:** Build
- **Sintoma:** Bundle JS de producao nao eh minificado.
- **Causa provavel:** `next.config.js:22` define `config.optimization.minimizer = []`, removendo TODOS os minificadores do webpack.
- **Evidencia:** `apps/web/next.config.js:21-24`:
  ```js
  webpack: (config) => {
    config.optimization.minimizer = [];
    return config;
  },
  ```
- **Impacto:** O JS servido em producao esta com nomes de variaveis completos, whitespace, e comentarios. Aumento estimado de 40-60% no tamanho total de JS entregue.
- **Risco:** Baixo (reverter eh trivial). Regressao: nenhuma funcional.
- **Correcao (quick win):** Remover o bloco `webpack` inteiro do `next.config.js`. Se havia um motivo especifico (ex: debugging em prod), usar `productionBrowserSourceMaps: true` em vez disso.
- **Correcao (robusta):** N/A.
- **Como validar:** `npm run build -w @stardust/web` e comparar tamanho de `.next/static/chunks` antes/depois.
- **Estimativa:** S (5 min). Sem dependencias.

### ISSUE-02: 5.5 MB de Lottie JSON importados estaticamente no bundle JS

- **Area:** Frontend / Bundle
- **Sintoma:** Bundle client contem ~5.5 MB de JSON de animacoes Lottie inlined como modulos JS.
- **Causa provavel:** `lotties.ts` importa 28 arquivos JSON via `import X from '../../../public/lotties/X.json'`, e webpack os inclui inline no chunk.
- **Evidencia:** `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts:1-28` -- 28 imports estaticos de JSON.
- **Impacto:** ~5.5 MB adicionados ao bundle JS do client. Arquivos como `planets-exploration.json` (1.1 MB) e `rocket-exploring.json` (768 KB) sao especialmente pesados.
- **Risco:** Baixo. Regressao possivel: FOUC momentaneo se animacao demora a carregar.
- **Correcao (quick win):** Usar `fetch('/lotties/${name}.json')` dentro do hook `useLottieAnimation`, carregando o JSON sob demanda. Manter os arquivos em `public/lotties/`.
- **Correcao (robusta):** Criar um mapa lazy: `const LOTTIES: Record<AnimationName, () => Promise<unknown>> = { '404': () => import('../../public/lotties/404.json'), ... }`. Carregar apenas quando o componente montar.
- **Como validar:** `next build` -> comparar `.next/static` size. Alvo: reducao de ~5 MB no JS total.
- **Estimativa:** M (1-2h). Precisa alterar `lotties.ts` + `useLottieAnimation.ts`.

### ISSUE-03: Middleware faz API call (`fetchAccount`) em TODA request, inclusive rotas publicas

- **Area:** API / Middleware
- **Sintoma:** Cada page navigation e API request adiciona ~50-200ms de latencia no middleware.
- **Causa provavel:** `VerifyAuthRoutesController.ts:57` chama `authService.fetchAccount()` incondicionalmente, ANTES de verificar se a rota eh publica.
- **Evidencia:** `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts:52-57`:
  ```ts
  async handle(http: Http) {
    const currentRoute = http.getCurrentRoute()
    const isPublicRoute = PUBLIC_ROUTES.map(String).includes(currentRoute) || ...
    const response = await authService.fetchAccount()  // <-- sempre executa
  ```
- **Impacto:** Toda request (landing page, challenges listing, playground) sofre latencia de auth desnecessaria. Em rotas publicas, a resposta do `fetchAccount` eh descartada.
- **Risco:** Baixo. Regressao: se a logica de "early return" para public routes tiver bug, usuarios autenticados podem nao ser redirecionados.
- **Correcao (quick win):** Inverter a logica: verificar `isPublicRoute` ANTES de `fetchAccount`. Se publico, pular o fetch:
  ```ts
  if (isPublicRoute) return http.pass()
  const response = await authService.fetchAccount()
  ```
  Nota: a rota root redireciona usuarios autenticados para `/space`, entao precisa de cuidado extra para manter esse redirect.
- **Correcao (robusta):** Separar controllers: `PublicRouteController` (sem fetch) e `ProtectedRouteController` (com fetch). Ou usar JWT decode local (sem API call) para checar se ha sessao ativa.
- **Como validar:** Medir TTFB da landing page antes/depois. Alvo: -50-200ms.
- **Estimativa:** M (2-3h). Precisa testar edge cases de redirecionamento.

### ISSUE-04: `authActionClient` faz 2 API calls sequenciais nao-cacheadas em TODA server action

- **Area:** API / RPC
- **Sintoma:** Toda server action autenticada adiciona ~100-400ms de waterfall antes de executar a logica.
- **Causa provavel:** `authActionClient.ts:10-22` chama `fetchAccount()` e depois `fetchUserById()` em sequencia, ambos com `isCacheEnabled: false`.
- **Evidencia:** `apps/web/src/rpc/next-safe-action/clients/authActionClient.ts:10-22`:
  ```ts
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authResponse = await authService.fetchAccount()  // Call #1
  const profileResponse = await profileService.fetchUserById(account.id)  // Call #2
  ```
- **Impacto:** Cada page load de rota autenticada (challenge, lesson, space, profile, playground) paga ~100-400ms extras de waterfall. Isso se ACUMULA com os fetches do middleware (ISSUE-03) e do ServerProviders.
- **Risco:** Medio. Regressao: se o cache estiver stale, user pode ver dados desatualizados momentaneamente.
- **Correcao (quick win):** Habilitar `isCacheEnabled: true` com `revalidate: 60` (1 min) para `fetchAccount` e `fetchUserById` no `authActionClient`.
- **Correcao (robusta):** Extrair dados do usuario de um JWT/session cookie local (sem API call). Ou consolidar `fetchAccount` + `fetchUserById` em um unico endpoint no backend (`/auth/me` com profile incluso).
- **Como validar:** Medir latencia de server actions (ex: `accessAuthenticatedChallengePage`) antes/depois.
- **Estimativa:** S para quick win (habilitar cache). L para endpoint consolidado (mudanca no server).

### ISSUE-05: `ServerProviders` faz `fetchAccount` duplicado (ja feito no middleware)

- **Area:** API
- **Sintoma:** `fetchAccount()` eh chamado 2-3 vezes por page load (middleware + ServerProviders + authActionClient).
- **Causa provavel:** `ServerProviders/index.tsx:19-21` cria outro `NextServerRestClient({ isCacheEnabled: false })` e chama `fetchAccount()` novamente.
- **Evidencia:** `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx:18-22`:
  ```ts
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const response = await authService.fetchAccount()
  ```
- **Impacto:** +1 API call redundante em TODA page navigation. Combinado com ISSUE-03 e ISSUE-04, uma pagina autenticada faz `fetchAccount` 3 vezes.
- **Risco:** Baixo.
- **Correcao (quick win):** Habilitar `isCacheEnabled: true` com tag de cache. O Next.js `fetch()` deduplication vai eliminar chamadas duplicadas no mesmo request.
- **Correcao (robusta):** Passar o `accountDto` via server-side props do middleware para o layout, eliminando a chamada duplicada.
- **Como validar:** Adicionar logging no backend para contar quantas vezes `/auth/account` eh chamado por page load. Alvo: 1x.
- **Estimativa:** S (habilitar cache). M (passar props do middleware).

### ISSUE-06: Three.js (~800KB) importado estaticamente na landing page

- **Area:** Frontend / Bundle
- **Sintoma:** Landing page carrega Three.js completo no bundle client.
- **Causa provavel:** `Particles/index.tsx` importa `@react-three/drei` e `@react-three/fiber` estaticamente, sem `next/dynamic`.
- **Evidencia:** `apps/web/src/ui/global/widgets/pages/Landing/Particles/index.tsx:1-2`:
  ```ts
  import { Stars } from '@react-three/drei'
  import { Canvas } from '@react-three/fiber'
  ```
- **Impacto:** ~800KB+ de JS adicionados ao bundle da landing page. Afeta TODOS os visitantes iniciais.
- **Risco:** Baixo. Regressao: flash de conteudo vazio ate o componente carregar.
- **Correcao (quick win):** Envolver o componente `Particles` com `next/dynamic({ ssr: false })`.
- **Como validar:** `next build` -> comparar chunk size da rota `/`.
- **Estimativa:** S (15 min).

### ISSUE-07: `isCacheEnabled: false` eh o default -- a maioria dos fetches server-side ignora cache do Next.js

- **Area:** API
- **Sintoma:** Nenhuma deduplicacao ou caching de `fetch()` no server-side.
- **Causa provavel:** `NextRestClient.ts:11` define `isCacheEnabled = false` como default, resultando em `cache: 'no-store'` em todos os requests.
- **Evidencia:** `apps/web/src/rest/next/NextRestClient.ts:10-11`:
  ```ts
  export const NextRestClient = ({
    isCacheEnabled = false,
  ```
  ~25 de 35 consumidores usam o default.
- **Impacto:** O Next.js nao pode deduplicar fetches identicos no mesmo request rendering cycle. Cada componente que chama o backend faz um round-trip independente.
- **Risco:** Medio. Regressao: dados podem ficar stale se o cache nao for invalidado corretamente.
- **Correcao (quick win):** Para endpoints de leitura que nao mudam a cada segundo (planetas, achievements, challenges metadata), usar `isCacheEnabled: true` com `revalidate` de 60-300s.
- **Correcao (robusta):** Inverter o default para `isCacheEnabled = true` com `revalidate: 60` e usar `cache: 'no-store'` apenas para endpoints que realmente precisam (ex: session, real-time data).
- **Como validar:** Contar API calls no backend por page load. Alvo: reducao de 30-50%.
- **Estimativa:** M (revisao de cada call site).

### ISSUE-08: 3 fetches sequenciais em `FetchLessonStoryAndQuestionsAction` (poderiam ser paralelos)

- **Area:** API
- **Sintoma:** Pagina de licao leva ~3x a latencia de um fetch individual.
- **Causa provavel:** `fetchQuestions`, `fetchTextsBlocks`, `fetchStarStory` sao independentes mas await-ados em sequencia.
- **Evidencia:** `apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts:25-35`.
- **Impacto:** Se cada fetch leva ~100ms, a acao leva ~300ms em vez de ~100ms.
- **Risco:** Baixo.
- **Correcao (quick win):** `const [q, t, s] = await Promise.all([service.fetchQuestions(starId), service.fetchTextsBlocks(starId), service.fetchStarStory(starId)])`.
- **Como validar:** Medir latencia da action antes/depois. Alvo: ~1/3 do tempo.
- **Estimativa:** S (15 min).

### ISSUE-09: Fetch duplicado de challenge na page + comments slot

- **Area:** API
- **Sintoma:** Mesma challenge eh buscada 2x no mesmo page load.
- **Causa provavel:** `challenge/page.tsx` e `challenge/@tabContent/comments/page.tsx` ambos chamam `fetchChallengeBySlug` independentemente, sem cache.
- **Evidencia:** `AccessChallengeCommentsSlotAction.ts:19-22` busca challenge so para extrair `challengeId`.
- **Impacto:** +1 API call redundante em cada page load de challenge.
- **Risco:** Baixo.
- **Correcao (quick win):** Habilitar cache no `NextServerRestClient` para requests de challenge, ou passar `challengeId` como searchParam.
- **Estimativa:** S (30 min).

### ISSUE-10: AuthContext cria `User.create(userDto)` em todo re-render sem `useMemo`

- **Area:** Frontend / Re-renders
- **Sintoma:** Todos os consumers de `AuthContext` re-renderizam quando qualquer state do contexto muda.
- **Causa provavel:** `useAuthContextProvider.ts:130` faz `User.create(userDto)` inline no return, criando nova referencia a cada render.
- **Evidencia:** `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts:129-130`:
  ```ts
  return {
    user: userDto ? User.create(userDto) : null,
  ```
- **Impacto:** Cascata de re-renders em TODO o app (Space, Ranking, Profile, etc. consomem AuthContext).
- **Risco:** Baixo.
- **Correcao (quick win):** `const user = useMemo(() => userDto ? User.create(userDto) : null, [userDto])`.
- **Correcao (robusta):** Memoizar o objeto de retorno inteiro do provider com `useMemo`, ou separar dados (user/account) de acoes (handleSignIn, etc.) em contextos distintos.
- **Como validar:** React DevTools Profiler -> contar re-renders dos consumers de AuthContext.
- **Estimativa:** S (quick win). M (separar contextos).

### ISSUE-11: `@tsparticles`, `swiper`, `react-confetti`, `typewriter-effect`, `html-to-image` importados estaticamente

- **Area:** Frontend / Bundle
- **Sintoma:** ~300KB+ de libs carregadas no bundle client sem necessidade imediata.
- **Causa provavel:** Imports estaticos no topo dos arquivos sem `next/dynamic` ou `import()`.
- **Evidencia:**
  - `@tsparticles`: `ui/space/widgets/pages/Space/Particles/index.tsx:1`
  - `swiper`: `ui/challenging/widgets/layouts/Challenge/ChallengeSlider/ChallengeSliderView.tsx:1`
  - `react-confetti`: `ui/challenging/widgets/components/ConfettiAnimation/ConfettiAnimationView.tsx:1`
  - `typewriter-effect` + `react-simple-typewriter`: `ui/global/widgets/components/TypeWriter/index.tsx:3-4`
  - `html-to-image`: `ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts:2`
- **Impacto:** ~300KB+ de JS desnecessario no initial load.
- **Risco:** Baixo.
- **Correcao (quick win):** Envolver cada componente com `next/dynamic({ ssr: false })`. Para `html-to-image`, usar `const { toPng } = await import('html-to-image')` dentro do handler.
- **Estimativa:** S (30 min-1h para todos).

### ISSUE-12: Toast scroll listener ativo em TODAS as paginas, sempre

- **Area:** Frontend / Runtime
- **Sintoma:** `setScrollPosition(window.scrollY)` dispara em todo evento de scroll, causando re-renders do Toast.
- **Causa provavel:** `useToast.ts:44-56` registra um scroll listener global que atualiza state a cada scroll.
- **Evidencia:** `apps/web/src/ui/global/contexts/ToastContext/Toast/useToast.ts:44-56`.
- **Impacto:** Re-renders desnecessarios durante scroll em TODAS as paginas. Pode causar jank.
- **Risco:** Baixo.
- **Correcao (quick win):** Throttle o handler de scroll (ex: `throttle(handleScroll, 100)`) ou usar `IntersectionObserver`.
- **Estimativa:** S (15 min).

### ISSUE-13: Nenhuma lista usa virtualizacao

- **Area:** Frontend / Runtime
- **Sintoma:** Listas potencialmente longas renderizam todos os items no DOM.
- **Causa provavel:** Nenhuma lib de virtualizacao (`react-window`, `@tanstack/react-virtual`) esta instalada ou usada.
- **Evidencia:** Listas afetadas: `RankingUsersList`, `AchievementsList`, `CommentsList` (com replies aninhadas), `ChallengesList`, `SolutionsList`.
- **Impacto:** Se rankings ou comments crescerem alem de ~100 items, a performance de scroll degrada.
- **Risco:** Medio (depende do volume de dados).
- **Correcao (quick win):** Para listas com paginacao (Challenges, Solutions), limitar items por pagina no backend. Para Ranking (~30 users por tier), pode ser aceitavel sem virtualizacao.
- **Correcao (robusta):** Adicionar `@tanstack/react-virtual` para `CommentsList` e `RankingUsersList`.
- **Estimativa:** M-L por lista.

### ISSUE-14: WAV audio files (3.2 MB) nao comprimidos

- **Area:** Assets
- **Sintoma:** Arquivos de audio em formato WAV (~10x maiores que MP3).
- **Evidencia:** `public/audios/` contem 9 arquivos `.wav` totalizando 3.2 MB.
- **Impacto:** Se carregados on-demand, impacto baixo. Se preloaded, ~2.5 MB de economia possivel.
- **Risco:** Baixo.
- **Correcao (quick win):** Converter WAV -> MP3/OGG com `ffmpeg`. Economia estimada: ~80%.
- **Estimativa:** S (30 min com script).

### ISSUE-15: 5+ Barrel imports de `@phosphor-icons/react` em vez de `/dist/ssr`

- **Area:** Build
- **Sintoma:** Build time maior e risco de tree-shaking falhar.
- **Evidencia:** `DialogHeader.tsx:4`, `Checkbox/index.tsx:5`, `Search/index.tsx:2`, `EditableTitleView.tsx:1`, `AnimatedArrowView.tsx:1` importam de `@phosphor-icons/react` em vez de `@phosphor-icons/react/dist/ssr`.
- **Impacto:** Leve aumento de build time. O `next.config.js` ja tem `optimizePackageImports` para o path SSR, mas esses imports nao se beneficiam.
- **Risco:** Baixo.
- **Correcao (quick win):** Trocar imports para `@phosphor-icons/react/dist/ssr`.
- **Estimativa:** S (15 min).

### ISSUE-16: `form.watch()` sem argumento no ChallengeEditor

- **Area:** Frontend / Re-renders
- **Sintoma:** ChallengeEditor inteiro re-renderiza a cada keystroke.
- **Causa provavel:** `useChallengeEditorPage.ts:98` chama `form.watch()` sem especificar campos, subscrevendo a TODOS os campos do form.
- **Evidencia:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts:98`.
- **Impacto:** Re-render de todo o editor (incluindo Monaco editor) a cada keystroke.
- **Risco:** Baixo.
- **Correcao (quick win):** Usar `form.watch('fieldName')` para campos especificos, ou usar `useWatch` com campos definidos.
- **Estimativa:** S-M (30 min-1h).

## Recomendacoes (Plano em Etapas)

### Etapa 1: Quick Wins + Instrumentacao (1-2 dias)

| # | Acao | Issues | Impacto Estimado |
|---|------|--------|-----------------|
| 1 | Remover `config.optimization.minimizer = []` | ISSUE-01 | -40-60% bundle JS |
| 2 | Converter Lottie imports para `fetch()` lazy | ISSUE-02 | -5.5 MB bundle |
| 3 | `next/dynamic` para Three.js, tsparticles, swiper, confetti, typewriter, html-to-image | ISSUE-06, ISSUE-11 | -1.1 MB+ bundle |
| 4 | `Promise.all()` em `FetchLessonStoryAndQuestionsAction` | ISSUE-08 | -200ms lesson page |
| 5 | Corrigir barrel imports de phosphor-icons | ISSUE-15 | Build time |
| 6 | Throttle no scroll listener do Toast | ISSUE-12 | Menos jank |
| 7 | `useMemo` no `User.create()` do AuthContext | ISSUE-10 | Menos re-renders |
| 8 | Converter WAV -> MP3 | ISSUE-14 | -2.5 MB assets |

### Etapa 2: Correcoes Estruturais (3-5 dias)

| # | Acao | Issues | Impacto Estimado |
|---|------|--------|-----------------|
| 1 | Skip `fetchAccount` em rotas publicas no middleware | ISSUE-03 | -50-200ms em rotas publicas |
| 2 | Habilitar cache para endpoints de leitura no `NextRestClient` | ISSUE-07 | -30-50% API calls |
| 3 | Cache ou consolidar `fetchAccount` em `authActionClient` | ISSUE-04, ISSUE-05 | -100-400ms por action |
| 4 | Eliminar fetch duplicado de challenge no comments slot | ISSUE-09 | -1 API call |
| 5 | Usar `form.watch('field')` especifico no ChallengeEditor | ISSUE-16 | Menos re-renders |

### Etapa 3: Hardening (1 semana+)

| # | Acao | Issues | Impacto |
|---|------|--------|---------|
| 1 | Adicionar `SWRConfig` global com `dedupingInterval: 30000` | Geral | Menos refetches |
| 2 | Separar AuthContext em dados vs acoes | ISSUE-10 | Menos re-renders cascade |
| 3 | Virtualizacao para listas longas (Comments, Ranking) | ISSUE-13 | Scroll performance |
| 4 | Endpoint `/auth/me` consolidado no backend | ISSUE-04 | -1 API call por action |
| 5 | Timeouts e circuit breaker no `NextRestClient` | Geral | Resiliencia |

## Instrumentacao e Medicao

| KPI | Onde Medir | Como Medir | Baseline |
|-----|-----------|------------|----------|
| Bundle JS total | Build output | `next build` -> `.next/static` total size | Rodar antes de correcoes |
| TTFB landing page | Browser/Lighthouse | `npx lighthouse http://localhost:3000 --output json` | Medir agora |
| LCP landing page | Browser | Lighthouse ou `web-vitals` lib | Medir agora |
| API calls por page load | Backend logs | Contar requests para `/auth/account` por page view | Provavelmente 3x |
| Lesson page load time | Server action duration | `console.time` em `FetchLessonStoryAndQuestionsAction` | ~300ms |
| Re-renders AuthContext consumers | React DevTools Profiler | Count renders em SpacePage, RankingPage | Medir agora |

## Checklist de Verificacao

- [ ] Nao mudou comportamento funcional (testes existentes passam: `npm run test -w @stardust/web`)
- [ ] Nao degradou acessibilidade/SEO (manter `metadata` exports, `alt` em images)
- [ ] Build completa com sucesso (`npm run build -w @stardust/web`)
- [ ] Typecheck passa (`npm run typecheck -w @stardust/web`)
- [ ] Validacao visual das animacoes Lottie apos migrar para lazy loading
- [ ] Validacao do fluxo de auth apos mudar middleware (public routes ainda funcionam, redirect para /space funciona para auth users)
- [ ] Comparar bundle size antes/depois

## Referencias

- `apps/web/next.config.js` -- configuracao de build
- `apps/web/src/rest/next/NextRestClient.ts` -- factory do REST client
- `apps/web/src/rpc/next-safe-action/clients/authActionClient.ts` -- middleware de auth
- `apps/web/src/rest/controllers/auth/VerifyAuthRoutesController.ts` -- controller de middleware
- `apps/web/src/ui/global/widgets/layouts/Root/ServerProviders/index.tsx` -- providers root
- `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/lotties.ts` -- imports estaticos de Lottie
- `apps/web/src/rpc/actions/lesson/FetchLessonStoryAndQuestionsAction.ts` -- fetches sequenciais
- `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts` -- contexto de auth
- `documentation/architecture.md` -- arquitetura do projeto
