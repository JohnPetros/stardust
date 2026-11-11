---
title: Avaliação — Confirmação de criação de perfil via polling no Web
spec: ./spec.md
spec_revision: 4
status: ready
base_commit: 634c2ca19b5cddf831bf822ccc207afbe8332353
evaluated_commit: 634c2ca19b5cddf831bf822ccc207afbe8332353 (base; candidato = working tree não commitado, a identificar no commit de `conclude-spec`)
last_updated_at: 2026-11-11
---

# Evaluation — Confirmação de criação de perfil via polling no Web

## Escopo avaliado

- Spec: `./spec.md` (revisão 4, `in_progress` durante a publicação)
- Commit-base: `634c2ca19b5cddf831bf822ccc207afbe8332353`
- Branch/candidato: `refactor/643-profile-creation-polling` (candidato ainda não commitado)
- Assignment (Builder Direct, task principal): RF-01..RF-07 e CA-01..CA-19; paths permitidos = mapa canônico da Spec (60 paths na revisão 3; 66 na revisão 4); proibidos = qualquer path fora do mapa, inclusive `docker/`, deployment env e Penpot. Rule Pack: o da Spec. Sem referências de Design (sem UI visual).
- Baseline conhecido: `main` limpa exceto Spec e `grilling-prompt.md` não commitados. Nenhuma suíte executada antes da implementação.

## Evidências dos critérios

| Critério | Implementação | Verificação | Evidência real | Trabalho restante |
| -------- | ------------- | ----------- | -------------- | ----------------- |
| CA-01 | Complete | Passed | EV-01 — `useProfileCreationPolling.test.ts` (timers falsos; consulta imediata, 2000 ms, uma em voo) | nenhum |
| CA-02 | Complete | Passed | EV-01 — backoff 4000/8000/8000 e retorno a 2000 ms | nenhum |
| CA-03 | Complete | Passed | EV-01 — entrega única e sem consulta posterior | nenhum |
| CA-04 | Complete | Passed | EV-01 — `stopped` sem evento | nenhum |
| CA-05 | Complete | Passed | EV-01 — timeout 120 s, resposta tardia ignorada, cleanup duplo | nenhum |
| CA-06 | Complete | Passed | EV-01 — bearer 2xx/404/401/403/500/rejeição | nenhum |
| CA-07 | Complete | Passed | EV-01 — sem token nenhuma chamada; novo canal com token | nenhum |
| CA-08 | Complete | Passed | EV-01 — comprovante null/created/pending/401/403/502 | nenhum |
| CA-09 | Complete | Passed | EV-02 — suíte Playwright completa usa `ProfileChannelMock` injetado (78 passed) | nenhum |
| CA-10 | Complete | Passed | EV-02 — `sign-up.test.ts`: 0 assinaturas antes do envio, 1 depois | nenhum |
| CA-11 | Complete | Passed | EV-02 — 78 passed; EV-01 — hooks das páginas (40 testes) e novo caso do social; D-13 | nenhum |
| CA-12 | Complete | Passed | EV-03 — typecheck core/web/backoffice/server; EV-05 — git grep | nenhum |
| CA-13 | Complete | Passed | EV-11 — `SignUpRoute` + `FetchOnboardingAttemptRoute`: 2 suítes, 7 testes; EV-05 | nenhum |
| CA-14 | Complete | Passed | EV-02 — `/api/auth/profile-events` não é 200 nem `text/event-stream` (maxRedirects 0); EV-05 | nenhum |
| CA-15 | Complete | Passed | EV-05 — git grep Web/CI/docs; EV-03 typecheck | nenhum |
| CA-16 | Complete | Passed | EV-12 — MV-01 no stack local | nenhum |
| CA-17 | Complete | Passed | EV-12 — MV-02 (após D-12/D-13) | nenhum |
| CA-18 | Complete | Passed | EV-05 — docs atualizados; git grep | nenhum |
| CA-19 | Complete | Passed | EV-02 — 78 passed; EV-12 — MV-02 com bearer na primeira consulta; EV-14 — auth/reporting/space/shop 55 passed no candidato final | nenhum |
| CA-20 | Complete | Passed | EV-15 — AV-07 (7 suítes, 24 testes) e MV-03 (sem remount do `SignInPage`); EV-14 | nenhum |

## Revisões

### Spec Reviewer

- Veredito: `clear`
- Revisão: 2
- Escopo: compatibilidade com `architecture.md` e Rules antes da implementação
- Findings: nenhum aberto (revisão 1 teve 2 bloqueantes, resolvidos na revisão 2)

### Implementation Reviewer

- Veredito: `PASS` (código), revisão final sobre o delta D-12/D-13 e o ledger; revisão anterior (pré-D-12/D-13) superada
- Commit: working tree sobre `634c2ca19` (não commitado); Spec rev. 3
- Findings: F-1 (inventário MV corrompido): corrigido; F-2 (`check:code`/`format` stale e contagem 57 vs 60): rerodados e contagem unificada; F-3 (`evaluated_commit`): candidato não commitado, ver Handoff; F-4 (low) header vazio ao limpar o token e mutação do client singleton durante o render: o mesmo padrão já existe em `AuthContextProvider`; `NextRestClient.setHeader` só sobrescreve; o Server trata `Authorization` vazio como ausente (comportamento anterior idêntico, que usava `''`); nenhum uso do client durante SSR; aceito; F-5 (low) teste de regressão estreito: acrescentado o caso do ciclo `user` null→definido; `useAccountConfirmationPage` segue sem teste de Hook dedicado (lacuna pré-existente), coberto por Playwright e MV-02, registrada como limitação; sem finding bloqueante

### Implementation Reviewer — delta da revisão 4

- Veredito: `PASS` (código) sobre `ServerProviders`, `FeedbackLayout/**` e `useSignInPage.ts`; ambientes sem Bash (revisou o estado atual dos arquivos)
- Findings: F-6 (medium, Contract desatualizado): resolvido pela revisão 4 da Spec; F-7 (low, hook sem teste): resolvido com `useFeedbackLayout.test.ts`; risco de `display: contents` e a11y: baixo (wrappers `div` sem semântica); nenhum seletor dependente da estrutura em `global.css`/`RootLayoutView`

### Visual Reviewer

- Veredito: não aplicável (sem UI design-backed; Spec não tem `VV-*`)

## Inventário manual e visual

| MV/VV | CA | Superfície/rota | Estado | Viewport | Board Penpot | Candidato | Artefato | Resultado observado | Disposição do Reviewer |
| ----- | -- | --------------- | ------ | -------- | ------------ | --------- | -------- | ------------------- | ---------------------- |
| MV-01 | CA-16 | `/auth/sign-up` | cadastro real | desktop (chromium) | não aplicável | working tree rev. 3, após D-12/D-13 | nenhum (rota/status) | passed — EV-12 | aceito (revisão final, evidência por EV-12) |
| MV-02 | CA-17, CA-19 | `/auth/account-confirmation` | confirmação por email | desktop (chromium) | não aplicável | working tree rev. 3, após D-12/D-13 | nenhum (rota/status) | passed — EV-12 | aceito (revisão final, evidência por EV-12) |
| MV-03 | CA-20 | `/auth/sign-in` → `/space` | login com conta seed | desktop (chromium) | não aplicável | working tree rev. 4 | nenhum (rota/DOM) | passed — EV-15 | aceito (evidência por EV-15) |

## Sensores e preflight

Ambiente: pnpm local v10 (o pnpm 11.28.11 fixado não está instalado; usado `npm_config_manage_package_manager_versions=false`, `pnpm --filter` no lugar de `-w`; lockfile gerado com `npx pnpm@11.28.11`).

| ID | Comando | Estado | Evidência |
| -- | ------- | ------ | --------- |
| EV-01 | `pnpm --filter @stardust/web run test:unit src/ui/global/contexts/RealtimeContext src/ui/auth/widgets/pages` | passed | 11 suítes, 55 testes (inclui 15 de `useProfileCreationPolling.test.ts`) |
| EV-02 | `pnpm --filter @stardust/web run test:integration` (suíte completa) | passed | 78 passed (4,7 min). Execução anterior: 74 passed, 4 failed (2 por minha asserção de redirect, corrigida com `maxRedirects: 0`; 2 de `account-confirmation` por timeout de `page.goto` sob carga, passaram isoladas e na rerodada completa) |
| EV-03 | `pnpm --filter @stardust/{core,backoffice,server,web} run check:types` | passed | web após remover `.next/types` gerado e obsoleto |
| EV-04 | `pnpm --filter @stardust/{core,web,server,backoffice} run check:code` | passed | só warnings pré-existentes; arquivos alterados sem warnings novos além do `biome-ignore` documentado de deps do `useMemo` |
| EV-05 | `git grep` de AV-05 | passed com ressalva | web/CI/docs: nenhuma ocorrência exceto `sign-up.test.ts` (permitido). O regex `@supabase/` do Spec casa com o Server, que mantém o SDK para Auth: aplicado a `apps/web`, CI e docs (ver ACH-01) |
| EV-06 | `pnpm run check:architecture` (dependency-cruiser) | passed | 3905 módulos, sem violações; o passo seguinte do script (`crew`) falha só por pnpm 11 ausente |
| EV-07 | `pnpm run check:test-integrity` | passed | 3 testes alterados, sem queda |
| EV-08 | `pnpm --filter @stardust/{web,server} run check:complexity` | passed | após refatoração e `update:complexity-baseline` (ACH-02) |
| EV-09 | `pnpm run check:spec-implementation ... --base 634c2ca19` | passed | superado por EV-13: 60 paths (Create 9, Modify 36, Generate 1, Remove 14) na revisão 3 (era 57 na revisão 2) |
| EV-10 | `format` core/web/server/backoffice | passed | `pnpm run format` raiz falha em `@stardust/crew` apenas por pnpm 11 ausente |
| EV-11 | AV-04: `npx jest --selectProjects server-integration --testPathPattern 'SignUpRoute\|FetchOnboardingAttemptRoute'` com env local exportado (`SUPABASE_URL` na porta do Envoy do `.env.local`, `DATABASE_URL` do exportador) | passed | 2 suítes, 7 testes. O comando do Spec (`pnpm run test:integration <arquivos>`) é inócuo: os arquivos são consumidos por `--selectProjects`, rodando a suíte inteira (ACH-06) |
| EV-12 | MV-01/MV-02: script Playwright (chromium) em `localhost:3000` + Server `3334` + Mailpit, conta descartável gerada em memória (sem email/senha/token registrados) | passed | MV-01: `POST /api/auth/sign-up` 201; sucesso após ~4,2 s; 2 consultas `GET /api/auth/onboarding-attempt` 200 a ~2 s, cessam após o sucesso; nenhuma requisição `profile-events`/Supabase Realtime; sem `pageerror`; o único WebSocket é o HMR do Next dev. MV-02: link do Mailpit (origem `127.0.0.1:3000` reescrita para `localhost:3000`, host do app) → `/auth/account-confirmation`; `GET /profile/users/id/:id` 200 (2 consultas), `Authorization` presente na primeira, sem 401 nem `refresh-session`; sem `pageerror`. Primeira execução revelou ACH-04/ACH-05 |
| EV-13 | rerodada após correções (D-12/D-13): `format` e `check:code` web (só warnings pré-existentes), `test:unit` auth pages + global (35 suítes, 199 testes; o social passou a ter 6 casos, incluindo o ciclo `user` null→definido sem reassinar); `test:integration` completa (78 passed, 5,2 min); `check:types`, `check:complexity` web, `check:test-integrity`, `check:spec-implementation` (60 paths) | passed | — |
| EV-14 | conclusão (escopo reduzido por instrução do usuário: só código alterado e consumidores diretos): `test:unit` RealtimeContext + auth pages + reporting (13 suítes, 65 testes) e `FeedbackLayout` (3 suítes, 13 testes, inclui o novo `useFeedbackLayout.test.ts`); `test:integration` auth, reporting, space e shop (55 passed); `check:types` web e email; `check:code` web e email (só warnings pré-existentes); `check:complexity` web e email; `check:architecture`; `check:test-integrity --base 634c2ca19`; `check:spec-implementation --base 634c2ca19` (60 paths, 22 não relacionados ignorados) | passed | A suíte completa de integração (AV-03 do Spec, 78 testes) **não** foi rerodada sobre o candidato final: o usuário instruiu a rodar só os testes do código alterado (tooling.md, "Execução local escopada"); a última execução completa (EV-13: 78 passed) é anterior à correção do remount do sign-in. Limitação registrada |
| EV-15 | AV-07: `pnpm --filter @stardust/web run test:unit src/ui/reporting/widgets/layouts/FeedbackLayout src/ui/auth/widgets/pages/SignIn` (7 suítes, 24 testes); `git grep sessionStorage -- apps/web/src` sem ocorrências. MV-03: Playwright (chromium) em `localhost:3000` com a conta seed local (exportador `--seed`): `MutationObserver` registrou, entre o envio e `/space`, apenas a remoção da própria navegação (~4,7 s); antes da correção a árvore da página era removida/adicionada em ~560 ms | passed | `/space` alcançado; sem `pageerror`; nenhuma credencial registrada |

## Warnings e findings

- BLK-01 (resolvido) — `db:test` falhava em `minio-init` (pull `quay.io/minio/mc` 401) e `db:migrate` recusava o volume local (default ACL global e funções do schema `realtime` acusando `externalExposure`). Recuperação: executei `supabase-db-reset` e `db:migrate` sem `minio-init`, reverti o default ACL local e, com autorização explícita do usuário, parei o container Realtime e removi o schema `realtime` do banco local de teste antes de migrar; Realtime e Envoy foram reiniciados depois da migração (Envoy depende dele) e o banco recebeu `db:seed` (substitui dados locais; necessário para os jobs de criação de perfil: sem catálogo a cadeia falha com "Planeta não encontrado"). Follow-up de infraestrutura: `docker/supabase/reset.sh` não limpa default ACL global nem o schema `realtime`; o Compose depende de `quay.io/minio/mc`.
- ACH-01 — O regex de AV-05 inclui `@supabase/` sobre `apps/server/src`, onde o SDK permanece para Auth. Disposição: escopo do regex restrito ao Web/CI/docs (intenção do RF-06); sem mudança de Contract.
- ACH-02 — `check:complexity` falhava: funções novas/alteradas com MI < 65 e entradas de baseline que não se realinham quando as métricas mudam (função movida/melhorada, arquivo renomeado). Correção: simplificações de código (classe `PollingSubscription`, helpers `to*Poll`, `selectRealtimeProvider`, `checkTestingMode`, spread de props) e `pnpm run update:complexity-baseline` (arquivo fora do mapa do Spec; alterações: remoção de `ProfileEventsRouter`/`SupabaseProfileChannel`, entrada de `OnboardingAttemptsRouter`, melhoria de `ClientProviders`/`ServerProviders`, reordenação de `star-challenge/page.tsx`).
- ACH-04 — MV-02 (real) mostrou ciclo de consultas: com polling, cada nova assinatura entrega `created` na hora quando o perfil já existe; `onRefetchUser` re-renderiza e o effect das páginas de confirmação reassina (49 consultas em 8 s). Correção: D-13 (guard `user` e dep) em `useAccountConfirmationPage` e `useSocialAccountConfirmationPage` + caso de regressão no teste do social. Mudança de Contract (3 paths): Spec revisão 3, aguarda aprovação do usuário.
- ACH-05 — MV-02: a primeira consulta bearer saía sem `Authorization` (header do `restClient` definido em `useEffect` do provider, depois dos efeitos filhos) → 401 + `refresh-session`, violando CA-17. Correção: D-12, header definido durante o render em `useRestContextProvider`.
- ACH-06 — O comando de AV-04 do Spec não filtra arquivos (script usa `--selectProjects server-integration` e consome os caminhos). Disposição: usar `--testPathPattern`; sem mudança de Contract.
- ACH-03 — `sign-up.test.ts`: o middleware redireciona `/api/auth/profile-events` anônimo para o sign-in (200 HTML) ao seguir redirects; asserção ajustada para `maxRedirects: 0` (status não 200 e sem `text/event-stream`), sem enfraquecer o Contract.
- ACH-07 — Remount do `SignInPage` logo após o login (animação do foguete reiniciava ~560 ms depois do envio): `ServerProviders` só envolvia `children` em `FeedbackLayout` quando havia conta, mudando a posição da página na árvore React; o workaround de `sessionStorage` em `useSignInPage` apenas restaurava o estado. Correção pedida diretamente pelo usuário (fora do Contract da revisão 3): `FeedbackLayout` sempre montado com `isEnabled` (wrappers com `display: contents` quando desabilitado), `useSignInPage` sem o workaround, novo teste do hook. Trace no navegador: o remount some. Estado: resolvido pela revisão 4 da Spec (D-14, RF-08, CA-20); aprovada pelo usuário em 2026-11-11.
- F-6 (Implementation Reviewer, delta pós-PASS, medium) — Contract (`spec.md` ~207/417) e matriz de UI não refletem `isEnabled`, os 4 arquivos de `FeedbackLayout` nem a remoção do workaround em `useSignInPage.ts`; resolvido: amendment na revisão 4, aprovado pelo usuário em 2026-11-11 (D-14, CA-20, seis paths, AV-07, MV-03).
- F-7 (low) — `useFeedbackLayout` sem teste: resolvido com `FeedbackLayout/tests/useFeedbackLayout.test.ts` (5 casos).

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| ------- | ----- | ------------------------- | ------ |
| BLK-01 | estado do volume local e imagem indisponível | não aplicável — ambiente; follow-up de infraestrutura registrado (reset.sh, minio/mc) | concluído |
| ACH-04 | Spec presumia páginas sem alteração; polling entrega imediatamente quando o perfil já existe | lição registrada: efeitos de assinatura de canal por polling devem ser condicionados ao estado que o evento atualizaria; Spec rev. 3 (D-13) | concluído, aprovado |
| ACH-05 | efeito do provider roda depois dos efeitos filhos | lição registrada: configuração de client compartilhado que descendentes usam em efeitos deve ser aplicada no render; Spec rev. 3 (D-12) | concluído, aprovado |
| ACH-06 | comando do Spec inócuo | não aplicável — pontual | concluído |
| ACH-01 | regex do Spec amplo demais | não aplicável — pontual | concluído |
| ACH-02 | gate de complexidade exige MI ≥ 65 em função nova e realinha baseline só com métricas idênticas | lição registrada abaixo; sem mudança de Rule | concluído |
| ACH-03 | pontual (comportamento do middleware) | não aplicável | concluído |
| ACH-07 | wrapper condicional por conta em `ServerProviders` muda a posição da página na árvore no login; remount reiniciava animação | lição registrada (D-14): wrappers de layout que dependem de sessão mantêm a mesma estrutura DOM e alternam só classes/`display: contents`; sem mudança de Rule; `feedback-dialog-history/evaluation.md` ("só monta FeedbackLayout com conta") fica como histórico | concluído, aprovado |
| F-6 | delta fora do Contract | Spec revisão 4 | concluído |

## Decisões

- Implementação em `Builder Direct` na task principal: trabalho coeso.
- Branch `refactor/643-profile-creation-polling` criada a partir de `main` no kickoff.
- `PollingProfileChannel` implementado com classe interna privada (`PollingSubscription`) atrás da factory exportada, para cumprir o gate de complexidade; o contrato público é o do Spec.
- Entry Point `RealtimeContextProvider` repassa `...useAuthContext()` a `useRealtimeContextProvider` (campos extras são ignorados) e `ClientProvidersView` repassa `...session` a `AuthContextProvider`, só para manter MI ≥ 65; `ClientProviders` recebe `accountDto: AccountDto | null` obrigatório (único chamador, `ServerProviders`, sempre o fornece).
- Desvio aceito do Spec: `User.create(body)` é usado em `toUserPoll`/`pollByAccount` com destructuring; semântica idêntica ao Contract.

## Auditoria de UI (UI Layer Audit)

| Widget | Entry Point | View | Hook | Resultado | Evidência |
| --- | --- | --- | --- | --- | --- |
| `SignUpPage` | `SignUp/index.tsx` — passa `{ enabled: userEmail !== null }` | `SignUpPageView.tsx` (inalterada) | `useSignUpPage.ts` (inalterado) | passed | diff |
| `RealtimeContextProvider` | `RealtimeContext/index.tsx` resolve contexts | não há View (context) | `useRealtimeContextProvider.ts` e `useProfileCreationPolling.ts` declarados com `function`, dependências por parâmetro | passed | diff |
| `ClientProviders` | `ClientProviders/index.tsx` | `ClientProvidersView.tsx` só renderiza providers por props | não há | passed com desvio pré-existente: `useEffect` do PostHog no Entry Point (não alterado) | diff |
| `ServerProviders` | `ServerProviders/index.tsx` | não há View | não há | passed com desvio pré-existente: Server Component sem `*View.tsx` | diff |
| `useProfileSocket` | hook global | n/a | `useProfileSocket.ts` (`function`, listener em ref) | passed; sem teste dedicado (regra de hooks globais) | diff |

## Trabalho fora do Contract (solicitado diretamente pelo usuário após a aprovação da revisão 3; o remount do sign-in foi incorporado na revisão 4)

Preservado e excluído da conformidade do Spec (o `check:spec-implementation` os ignora como não relacionados; o remount do sign-in, ACH-07, foi incorporado à Spec na revisão 4). A decisão de commit/PR (mesmo PR em commits separados ou outro branch) pertence ao usuário:

- Templates de email: `packages/email/**` (partials, `Footer.tsx`, três templates), `docker/supabase/templates/*.html` (HTML renderizado do React Email) — correção da rota `/api/auth/confirm-email` e redesenho.
- `docker-compose.yml`: `GOTRUE_URI_ALLOW_LIST` aceita as origens exatas (`http://localhost:3000`, `http://127.0.0.1:3000`); sem isso o link de confirmação apontava para `127.0.0.1` e o cookie ia para o host errado (login perdido após confirmar).
- `AGENTS.md`: orientação de execução de testes alinhada ao `tooling.md` (só código alterado; suíte completa só a pedido do usuário).
- `.code-multivitals-baseline.json`: regenerado (entradas de `useSignInPage`/`useFeedbackLayout` melhoradas; `ConfirmSignUpTemplateView`/`ConfirmPasswordResetTemplateView` entram como avisos).
- Conhecido, sem correção: `SupabaseAuthService.signIn` devolve a mensagem genérica para `email_not_confirmed` (recomendação apresentada ao usuário, fora de escopo); a senha da conta seed local estava divergente até o segundo `db:seed`.

## Alinhamento documental

- Spec: alinhada
- Rules/Architecture/Overview: alinhados (realtime-rules, web-application-rules, widget-tests-rules, server-application-rules, server-routes-testing-rules, architecture, infrastructure, tooling atualizados). `documentation/overview.md` inexistente (lacuna pré-existente). Títulos `Drizzle e SSE` permanecem em `infrastructure.md` e `tooling.md`, cujo conteúdo não cita SSE como transporte do Web.

## Handoff

- Revisão da Spec e branch/candidato: rev. 4 (aprovada em 2026-11-11), `refactor/643-profile-creation-polling`, base `634c2ca19`, working tree não commitado
- Critérios: CA-01..20 implementados e verificados (EV-01..EV-15); Implementation Reviewer: PASS (revisão final e delta da revisão 4); sem findings abertos
- Paths não commitados e ownership: todo o diff (task principal); trabalho fora do Contract listado acima
- Resultados reutilizáveis: EV-01..EV-15 válidos para o candidato atual. Limitação: a suíte completa de integração (AV-03) foi rodada em EV-13 (candidato da revisão 3); no candidato final rodaram só os arquivos afetados (EV-14), por instrução do usuário; o CI do PR executa a suíte completa
- Build local: não executado (pré-condição de `commit-code`, não de fechamento local)
- Processos/portas: servidores dev 3000/3334 e containers `stardust-*` em execução
- Publicação: não solicitada (sem autorização de commit, push, PR ou sincronização com `main`); nenhuma mutação externa
- Bloqueios: nenhum
- Próxima ação: para publicar, o usuário autoriza explicitamente commit/PR (a Spec volta a `in_progress` durante o handoff até o CI do HEAD)

## Conclusão

- Estado: `ready` (publicação autorizada pelo usuário em 2026-11-11; handoff de commit/PR)
- Próxima ação: commit, PR e CI do HEAD; depois `completed`
