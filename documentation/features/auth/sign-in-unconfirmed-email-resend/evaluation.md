---
title: Avaliação — Aviso de e-mail não confirmado e reenvio do link no sign-in
spec: ./spec.md
spec_revision: 3
status: completed
base_commit: 93b3e3e0956bfb60c968a8b5520ffe07b84611db
evaluated_commit: working-tree@93b3e3e09
last_updated_at: 2026-11-12
---

# Evaluation — Aviso de e-mail não confirmado e reenvio do link no sign-in

## Escopo avaliado

- Spec: `./spec.md` (revisão 3, `in_progress`; reaberta em 2026-11-12 para o token D-15)
- Commit-base: `93b3e3e0956bfb60c968a8b5520ffe07b84611db`
- Commit avaliado: ainda não definido (candidato = working tree do branch `feat/sign-in-unconfirmed-email-resend`, sem commits)
- Assignment: Builder Direct (task principal). RP-01/JN-01 de `documentation/prds/auth/sign-in-prd.md`; RF-01..RF-08; CA-01..CA-17. Paths permitidos: os 31 do mapa canônico (revisão 3) da Spec; proibidos: Core, `packages/validation`, banco, migrations, Backoffice, `auth.rest` (D-09).
- Rule Pack: `rest-layer-rules`, `rpc-layer-rules`, `ui-layer-rules`, `handlers-testing-rules`, `server-routes-testing-rules`, `widget-tests-rules`, `web-app-routes-testing-rules`, `server-application-rules`, `web-application-rules`, `code-conventions-rules`, `sdd.md`.
- Design: Penpot `stardust`, frames `Autenticação / Desktop|Mobile / Sign-in · E-mail não confirmado`.

## Evidências dos critérios

| Critério | Implementação | Verificação | Evidência real | Trabalho restante |
| -------- | ------------- | ----------- | -------------- | ----------------- |
| CA-01 | Complete | Passed | EV-10 — AV-01, 403 + mensagem, sem tokens/conta | nenhum |
| CA-02 | Complete | Passed | EV-10 — AV-01, três 401 com a mesma mensagem | nenhum |
| CA-03 | Complete | Passed | EV-10 — AV-01, 201 com `account.email` e tokens; 400 para e-mail inválido | nenhum |
| CA-04 | Complete | Passed | EV-10 — AV-02, 200 e `confirmation_sent_at` posterior ao valor recuado | nenhum |
| CA-05 | Complete | Passed | EV-10 — AV-02, 429 com a mensagem; 400 para e-mail inválido | nenhum |
| CA-06 | Complete | Passed | EV-03 — `SignInAction.test.ts`, 3 casos | nenhum |
| CA-07 | Complete | Passed | EV-13 (Playwright, 9 testes) e EV-12 (MV-01 passo 2) | nenhum |
| CA-08 | Complete | Passed | EV-13 (reexecução) — Playwright 401 → `toast-progress-bar` visível e aviso ausente | nenhum |
| CA-09 | Complete | Passed | EV-04 — `useSignInPage.test.ts` (limpa na nova submissão, mantém foguete em `signed-in`) | nenhum |
| CA-10 | Complete | Passed | EV-13 — unit do diretório SignIn (29 testes), com o caso das classes `bg-theme-reward-surface` e `border-theme-reward`; resolução real da classe em VV-01/VV-02 | nenhum |
| CA-11 | Complete | Passed | EV-04 — sucesso, 429 e 500, loading e retorno sem e-mail | nenhum |
| CA-12 | Complete | Passed | EV-13 (EV-05 superado) — clique chama `onResend`, não `onSubmit`; loading desabilita | nenhum |
| CA-13 | Complete | Passed | EV-13 (EV-06 superado) — Playwright reenvio 200 (request com o e-mail) e 429 (mensagem do Server) | nenhum |
| CA-14 | Complete | Passed | EV-12 — MV-01 completo | nenhum |
| CA-15 | Complete | Passed | VV-01: recaptura da revisão 3 comparada ao export atual (EV-13); Visual Reviewer `pass` | nenhum |
| CA-16 | Complete | Passed | VV-02: recaptura da revisão 3, ordem de foco (Reenviar → Entrar logo depois do campo; o botão de visibilidade do `Input` vem antes) e anel de foco capturado; Visual Reviewer `pass` | nenhum |
| CA-17 | Complete | Passed | EV-08 — `SignInGodAccountController.test.ts`, 3 casos | nenhum |

## Revisões

### Spec Reviewer

- Veredito: `clear`
- Revisão: 2
- Escopo: compatibilidade com `architecture.md` e Rules antes da implementação
- Findings: nenhum (rev. 1 teve `blocking_findings`, resolvidos na rev. 2)

### Implementation Reviewer

- Veredito: `PASS` (sem findings bloqueantes)
- Commit: working-tree@93b3e3e09 (sem commits)
- Findings: todos não bloqueantes, ver ACH-05..ACH-09. O Reviewer apontou o ledger desatualizado (CA-01..05, EV-10, MV-01); já reconciliado com EV-10 e EV-12. Essa revisão foi sobre a revisão 2; depois dela mudaram o View e seu teste (ACH-11) e o token D-15

#### Implementation Reviewer — revisão 3

- Veredito: `PASS` (sem findings bloqueantes; 1 medium e 6 low, todos de ledger ou documentação, nenhum de código)
- Commit: working-tree@93b3e3e09 (sem commits); escopo: delta pós-revisão 2 (token D-15 e ACH-11) e os 31 paths
- Confirmou: token aplicado como D-15 (`global.css:33`, `tailwind.config.js:76`), paleta `yellow` inalterada, View sem hooks e com `bg-theme-reward-surface`, `design.md:998-1026` coerente, 31 paths sem arquivo fora do mapa além do baseline (ACH-02/ACH-09)
- Findings: ACH-12 (auditoria de UI sem tabela com evidência por linha, medium) e ACH-13 (ledger, handoff, EV-05, EV-11, ACH-01 e histórico da Spec desatualizados, low); todos corrigidos nesta reconciliação

### Visual Reviewer

- Veredito: `PASS` (VV-01 pass, VV-02 pass; sem findings bloqueantes)
- Commit: working-tree@93b3e3e09 (revisão 3, depois do token D-15)
- Método: exportou os dois frames pelo Penpot MCP, leu fill, stroke, tokens, layout e tipografia do componente `Aviso · E-mail não confirmado` e mediu pixels das capturas e dos exports
- Disposição por linha: MV-01 não visual (fora do escopo dele); VV-01 `pass`; VV-02 `pass`
- Confirmou: fill `#443102` idêntico ao do Penpot (`color.yellow.900`) nos dois viewports, borda `#ffce31` 1 px, raio 8, padding 16, gap 12, textos idênticos, botão contornado de largura total, posição entre Senha e Entrar; Penpot: aviso 391×152 (desktop) e 342×152 (mobile)
- Diferenças só nos desvios permitidos (hero `AnimatedHero`; 154 px contra 152 px pela borda; mobile reduzido pela escala de `rem`, 140 contra 152 px; e-mail real quebrando a linha) e em variações de rasterização
- Observações não bloqueantes, registradas: (1) texto cerca de 3% mais largo no Chrome do que no export do Penpot (título, rótulo e o cabeçalho pré-existente), diferença de rasterização; (2) o form do Penpot tem 391 px (x 92,5) e a página 392 px, sub-pixel pré-existente que atinge inputs, aviso e "Entrar", fora do aviso; (3) a ordem de Tab real é Senha → botão de visibilidade da senha (do primitivo `Input`, pré-existente, presente no frame) → Reenviar → Entrar; a redação de CA-16 omite o botão de visibilidade, e a ordem relevante, Reenviar → Entrar logo depois do campo, vale também no desktop; (4) "Entrar" em `#30e08f` no desktop é a transição de 400 ms do `disabled:opacity-70` logo após a submissão, não cor errada

| Gate | Estado | Evidência |
| ---- | ------ | --------- |
| UI Layer Audit | passed | tabela abaixo, ACH-12 |
| Penpot/Web comparison | passed | VV-01, VV-02: Visual Reviewer `pass` (revisão 3) |

### Auditoria de UI (`ui-layer-rules.md`)

| Widget | Entry Point | View | Hook | Resultado | Evidência |
| --- | --- | --- | --- | --- | --- |
| `SignInPage` | `SignIn/index.tsx:1-45`, resolve `useRestContext().authService` e conecta Hook e View | `SignInPageView.tsx:1-80`, só repassa props a `SignInForm`, sem hooks | `useSignInPage.ts:1-98`, declaração `function`, `authService` por parâmetro; desvio pré-existente (`useToastContext`, `useNavigationProvider`, `useSleep`) mantido, D-07 | passed | `useSignInPage.test.ts`, `SignInPageView.test.tsx` (EV-13) |
| `SignInForm` | `SignInForm/index.tsx:1-31`, só repassa as props do aviso | `SignInFormView.tsx:1-63`, aviso entre os inputs e "Entrar" (linhas 51-60), sem hooks | `useSignInForm.ts` (inalterado) | passed | `SignInForm.test.tsx` (EV-13) |
| `UnconfirmedEmailNotice` | `UnconfirmedEmailNotice/index.tsx:1-3`, alias `export const UnconfirmedEmailNotice = UnconfirmedEmailNoticeView` | `UnconfirmedEmailNoticeView.tsx:1-38`, sem hooks nem efeitos, `bg-theme-reward-surface` | não há (sem estado) | passed | `UnconfirmedEmailNoticeView.test.tsx` (EV-13) |
| `AuthContextProvider` | `AuthContext/index.tsx` (inalterado) | não há (context) | `hooks/useAuthContextProvider.ts:1-259` e `hooks/useSignInAction.ts:1-21`; sem teste dedicado (D-06, D-14) | passed | jornada Playwright com o provider real (EV-13) |

## Inventário manual e visual

| MV/VV | CA | Superfície/rota | Estado | Viewport | Board Penpot | Candidato | Artefato | Resultado observado | Disposição do Reviewer |
| ----- | -- | --------------- | ------ | -------- | ------------ | --------- | -------- | ------------------- | ---------------------- |
| MV-01 | CA-07, CA-14 | `/auth/sign-up` → `/auth/sign-in` → Mailpit → `/auth/account-confirmation` → `/space` | jornada real | desktop | — | working-tree@93b3e3e09 | `scratchpad/mv01-final.png` | passed (EV-12) | não aplicável |
| VV-01 | CA-15 | `/auth/sign-in` | aviso visível, reenvio ocioso | 1440×900 | `🖥️ Desktop` / `Autenticação / Desktop / Sign-in · E-mail não confirmado` | working-tree@93b3e3e09 (revisão 3) | `scratchpad/vv-desktop-1440x900.png`; referência `scratchpad/penpot-desktop-unconfirmed.png` (export de `5c472853…9bd1`) | Recapturada depois do token. Estilo computado do aviso: fundo `rgb(68, 49, 2)` (`#443102`), borda 1 px `rgb(255, 206, 49)` (`#ffce31`), raio 8 px, gap 12 px, padding 16 px; posição 92,492.5, 392×154 (frame 392×152; +2 px do `border`, desvio permitido). Entre Senha e Entrar, título 14/600, corpo 12 px, botão contornado 40 px e textos coincidem com o export; o e-mail da conta quebra linha por ser longo. Visual Reviewer: `pass`, ver Revisões | pass |
| VV-02 | CA-16 | `/auth/sign-in` | aviso visível, reenvio ocioso | 390×844 | `📱 Mobile` / `Autenticação / Mobile / Sign-in · E-mail não confirmado` | working-tree@93b3e3e09 (revisão 3) | `scratchpad/vv-mobile-390x844.png`; referência `scratchpad/penpot-mobile-unconfirmed.png` (export de `5c472853…32f3`) | Recapturada depois do token. Fundo marrom `#443102` e borda `#ffce31` iguais ao export; largura 342 px (x 24) igual; sem scroll horizontal nem texto cortado. Ordem de Tab depois da senha: botão sem `data-testid` (alternância de visibilidade da senha, pré-existente) → `resend-confirmation-email-button` → `submit-button`. Foco do botão de reenvio (CA-16): `scratchpad/vv-mobile-focus-resend.png` mostra o anel `focus-visible` verde (`action`) ao redor do botão, sobre o fundo `#443102`. Desvio permitido: `rem` escala fontes (altura 139,5 px contra 152 px). Visual Reviewer: `pass`, ver Revisões | pass |

## Sensores e preflight

Candidato: working tree sobre `93b3e3e09` (sem commits). Datas: 2026-11-12.

| EV | Comando | Estado | Evidência |
| -- | ------- | ------ | --------- |
| EV-01 | `pnpm run check:spec-implementation <spec> --base 93b3e3e09` | passed | 28 paths contratados (Create 7, Modify 21), 4 caminhos não relacionados ignorados |
| EV-02 | `pnpm --filter @stardust/web run format`; `pnpm --filter @stardust/server run format` | passed | só arquivos do escopo alterados |
| EV-03 | AV-03 `pnpm --filter @stardust/web run test:unit src/rpc/actions/auth/tests/SignInAction.test.ts` | passed | 3 casos |
| EV-04 | AV-04 `…/SignIn/tests/useSignInPage.test.ts` | passed | casos existentes migrados para `SignInResult` + novos (CA-09, CA-11) |
| EV-05 | AV-05 `UnconfirmedEmailNoticeView.test.tsx`, `SignInForm.test.tsx`, `SignInPageView.test.tsx` | passed | 5 suítes (EV-03..05 juntas): 29 testes, 0 falhas |
| EV-06 | AV-06 `pnpm --filter @stardust/web exec playwright test --config=playwright.config.ts src/app/tests/auth/sign-in.test.ts` | passed | 9 testes (5 existentes + 3 novos + 401 reforçado), duas execuções consecutivas verdes |
| EV-07 | `check:code` e `check:types` (`@stardust/web`, `@stardust/server`); `biome check` nos arquivos alterados | passed | tsc sem erros; biome sem diagnósticos nos arquivos alterados (avisos pré-existentes do workspace inalterados) |
| EV-08 | AV-08 `pnpm --filter @stardust/server exec jest src/rest/controllers/auth/tests/SignInGodAccountController.test.ts --selectProjects server` | passed | 3 casos. Antes, `test:unit … <arquivo>` rodou o projeto server inteiro (169 suítes, 336 testes verdes), porque `--selectProjects` consome o argumento de caminho |
| EV-09 | `check:architecture`, `check:test-integrity`, `check:complexity` (web e server) | passed | 0 violações de dependência; integrity PASSED (9 testes alterados); complexidade 0/0 após revisão do baseline (ver ACH-02) |
| EV-10 | AV-01 e AV-02, serializados, via `jest <arquivo> --selectProjects server-integration` com o env do stack (script do scratchpad: `export-local-database-env.mjs` + `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` de `.env.local`, sem imprimir valores) | passed | AV-01 `SignInRoute.test.ts`: 4 casos; AV-02 `ResendSignUpEmailRoute.test.ts`: 3 casos. Setup: `db:test` subiu os containers e falhou só no `minio-init` (pull de `quay.io/minio/mc` 401; não usado por estes testes); rodei `supabase-db-reset` e `db:migrate` manualmente. O `migrate` recusou o banco por uma entrada residual de default ACL global (`postgres`, funções) do volume; restaurei com `ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT EXECUTE ON FUNCTIONS TO PUBLIC` e o migrate passou. Primeiro comando `pnpm run test:integration <arquivo>` rodou a suíte inteira por causa do `--selectProjects` e foi interrompido (TaskStop); não usado como evidência |
| EV-11 | Penpot MCP para VV-01/VV-02 e tokens/medidas do aviso | resolved (superado: o Penpot foi conectado e os frames foram exportados e inspecionados, ver VV-01/VV-02 e EV-13) | `No Penpot instance connected for user token` nos três servidores (reverificado depois do `.env.local` corrigido). Entrada necessária: abrir o arquivo `stardust` no Penpot com o plugin MCP conectado |
| EV-12 | MV-01 — Playwright (chromium) real contra `http://localhost:3000` (Web dev) e `http://localhost:3334` (Server dev), stack local seed (`db:seed` rodado porque `db:test` não semeia e sem tiers/avatars/rockets o perfil não é criado); conta descartável `mv01-<timestamp>@stardust.dev`, senha aleatória em memória; script em `scratchpad/mv01.cjs` (fora do repo) | passed | Passo 1 `POST /api/auth/sign-up` 201. Passo 2: URL `/auth/sign-in`, aviso visível com o e-mail, 0 toasts, sem scroll horizontal em 1440 e 390; Server respondeu `403` (a Web registrou "Confirme seu e-mail antes de entrar"). Passo 3 (após 66 s): botão desabilitado durante o loading, `POST /auth/resend-email/sign-up` 200, toast de sucesso, 2 mensagens no Mailpit (porta 54327). Passo 4: link mais recente → `/auth/account-confirmation`. Passo 5: sign-in, `GET /profile/users/id/…` 200 ×2, URL final `/space`; 0 `pageerror`. Ordem de Tab a partir de Senha: Reenviar → Entrar. Na UI o Server Action mostra `POST /auth/sign-in` 200; os `403`/`201` são do Server (verificados por AV-01 e pelo log). Artefatos: `scratchpad/mv01-desktop-1440x900.png`, `mv01-mobile-390x844.png`, `mv01-final.png`. Dev servers encerrados pela task |
| EV-13 | Revisão 3 (token D-15), candidato working-tree@93b3e3e09: `pnpm run format`; `check:spec-implementation <spec> --base 93b3e3e09`; `pnpm --filter @stardust/web run check:code`, `check:types`, `check:complexity`; `pnpm run check:architecture`, `check:test-integrity`; `pnpm --filter @stardust/web run test:unit src/ui/auth/widgets/pages/SignIn`; `pnpm --filter @stardust/web run test:integration src/app/tests/auth/sign-in.test.ts` | passed | 31 paths contratados (Create 7, Modify 24), 3 não relacionados ignorados; `check:code`: 0 erros (172 avisos pré-existentes; `biome check` nos arquivos alterados só aponta o `!important` de `global.css:98` e o formato de `content` em `tailwind.config.js:3`, ambos em linhas que não mudaram, e `tailwind.config.js` fica fora do `biome check src`); `check:types` sem erros; complexidade 0 warn / 0 error; arquitetura sem violações; integrity PASSED (9 testes alterados); unit do diretório SignIn: 5 suítes, 29 testes, incluindo o novo caso de classes `bg-theme-reward-surface` e `border-theme-reward` (CA-10); Playwright: 9 testes verdes |
| EV-14 | Build local do candidato (pré-condição de `commit-code`): `pnpm --filter @stardust/server run build` e `pnpm --filter @stardust/web run build` (o `pnpm run build` da raiz roda `replace-packages-imports.mjs`, que altera arquivos, e não foi usado) | passed | `tsup` com `build/main.js` gerado; `next build` concluído com a lista de rotas. O build reescreveu `apps/web/next-env.d.ts` (artefato do `next build`, fora do escopo); revertido com `git checkout`, árvore de trabalho com os 31 paths da entrega mais o baseline e os documentos |


## Warnings e findings

- ACH-01 — **Spec: localizador de toast.** CA-07/AV-06 citam "nenhum toast (`role="alert"`)", mas o Next injeta o `<next-route-announcer role="alert">` em toda página, então `getByRole('alert')` nunca fica vazio e o assert vacuoso do teste 401 passava sem toast. A jornada usa `getByTestId('toast-progress-bar')` (testid do `ToastView`). Comportamento coberto é o mesmo; o texto da Spec ficou impreciso. Estado: corrigido na implementação e na redação da Spec (revisão 3: CA-07, CA-08 e AV-06 usam `toast-progress-bar`).
- ACH-02 — **Baseline de complexidade.** `useAuthContextProvider` (baselined, cyc 21/len 200) e `SupabaseAuthService.signIn` mudaram de métrica; o ratchet só realinha entradas com métricas idênticas, então o check reprovava. Reestruturei para não piorar nenhuma métrica (hook 21/198, `signIn` halstead 449→417, MI 49.8→52, mapeamento extraído para `signInError`) e regenerei `.code-multivitals-baseline.json` com `update:complexity-baseline`, conforme `tooling.md` (revisão explícita). Entradas novas aceitas: `signInError` (MI 60.7), `handleResendEmail` (MI 59.5), `UnconfirmedEmailNoticeView` (MI 56.2), todas só com rating de MI em `warn`, sem métrica acima do limite. O arquivo não consta do mapa canônico (fora do Contract): requer ciência do usuário.
- ACH-03 — **Cache do `fetch` do Next em POST.** `NextRestClient()` (default `isCacheEnabled`, `revalidate: 60`) fez o `fetch` do servidor devolver o login bem-sucedido em cache para o mesmo corpo `{email, password}`, então os testes 401/403 com as credenciais do teste de sucesso recebiam a sessão antiga (descoberto ao depurar). Fora do escopo; a jornada usa credenciais distintas por cenário (`rejectedFields`, `unconfirmedFields`). Possível defeito real de produção a investigar à parte.
- ACH-04 — **Spec: porta do Mailpit.** O setup cita `http://127.0.0.1:54324`, mas o `.env.local` local remapeia o Stardust para `SUPABASE_MAILPIT_HTTP_PORT=54327` (a 54324 é de outro projeto). MV-01 deve usar a porta configurada.

- ACH-05 — CA-09: o teste prova que `unconfirmedEmail` fica `null` após uma segunda submissão que falha, mas não observa o limpar "antes da chamada" com `handleSignIn` pendente. Implementação correta (`useSignInPage.ts`, `setUnconfirmedEmail(null)` antes do `await`). Disposição: aceito, melhoria opcional de teste.
- ACH-06 — CA-10: `SignInPageView.test.tsx` prova o repasse de `unconfirmedEmail` e `isResendingEmail`, mas não clica no botão para provar `onResendEmail`; a cadeia do clique é provada em `SignInForm.test.tsx` e no Playwright. Disposição: aceito, melhoria opcional.
- ACH-07 — CA-12: o caso de loading afirma `disabled` e a ausência do rótulo, não a presença do `Loading`. Disposição: aceito, comportamento garantido pelo `ButtonView`.
- ACH-08 — RF-05: `.finally` zera o loading mas não captura rejeição de rede; o padrão é o mesmo do SignUp. Disposição: aceito, fora do Contract.
- ACH-09 — escopo: `.code-multivitals-baseline.json` fora do mapa; deve constar na descrição do PR (ver ACH-02). Também aceito: o assert vacuoso `getByRole('alert')` pré-existente no teste 401 segue, seguido do assert real do toast.
- ACH-10 — **Fidelidade visual: cor do fill.** O Penpot liga o fill a `color.yellow.900` (`#443102`) e o `yellow-900` do Tailwind é `#1c1400`. Decisão do usuário: token novo. Resolvido pela revisão 3 da Spec (D-15, `reward-surface`): `global.css`, `tailwind.config.js`, `design.md` e a View com `bg-theme-reward-surface`; o estilo computado em VV-01 é `#443102` (EV-13). Estado: resolvido, aguarda a disposição dos Reviewers.
- ACH-11 — **Correções de fidelidade já aplicadas ao View** (comparação com os frames, via Penpot MCP): corpo `text-xs` (12 px, lh 1,5), título 14/600 com `leading-5`, as três linhas filhas com `gap-3` (12 px, antes havia um grupo com gap de 4 px), botão `h-10` (40 px). Mudança posterior ao Implementation Reviewer, junto com a troca da classe do fill (D-15): o View e seu teste precisam ser revistos de novo.
- ACH-12 — **Auditoria de UI sem formato de tabela** (Implementation Reviewer, rev. 3, medium): `ui-layer-rules.md` exige a tabela Widget / Entry Point / View / Hook / Resultado / Evidência com `arquivo:linha`. Disposição: corrigido, tabela acima.
- ACH-13 — **Ledger e handoff desatualizados** (low): EV-01, EV-05 e EV-12 anteriores às mudanças de View e token; EV-11 com texto de falha; ACH-01 e o histórico da Spec (correção de redação duplicada na revisão 2). Disposição: corrigido; EV-13 é a evidência vigente do código e dos gates, e EV-12 segue válido para o comportamento de CA-14.
- ACH-14 — **Redação de CA-16 e foco** (Visual Reviewer, observação 3): a ordem de Tab inclui o botão de visibilidade do `Input`, pré-existente, que a redação de CA-16 omite. Disposição: aceito como interpretação (sem mudança de código ou de Contract); a ordem relevante, Reenviar → Entrar depois do campo de senha, vale nos dois viewports. O `focus-visible` do botão de reenvio foi capturado (`vv-mobile-focus-resend.png`).
- Observações visuais restantes: (a) a borda de 1 px do aviso soma 2 px à altura no DOM (154 px; o frame usa stroke interno, 152 px); (b) no mobile, os `rem` da Web escalam as fontes (14 px → 12,67 px, altura 139,5 px contra 152 px do frame); é o comportamento global da página para todos os elementos de texto, não específico do aviso.
- RF-03 / D-06: "conta continua nula e sem `identifyUser`" só é coberto indiretamente (AV-06), como o D-06 aceita.

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| ------- | ----- | ------------------------- | ------ |
| ACH-01 | pontual da Spec | redação corrigida na revisão 3; sem regra | concluído |
| ACH-02 | processo (ratchet exige métricas idênticas) | `tooling.md` já descreve o fluxo; não aplicável | concluído |
| ACH-03 | latente, fora do escopo | tarefa separada sugerida ao usuário | pendente (usuário) |
| ACH-04 | ambiente local | não aplicável | concluído |
| ACH-10 | Spec: mapeamento de token sem conferir o valor | revisão 3 da Spec (`create-spec`): token novo `reward-surface`, `design.md` atualizado; sem Rule nova | concluído |
| ACH-05..ACH-09 | lacunas pontuais de teste ou escopo, sem recorrência | não aplicável (sem Rule nova) | concluído |
| ACH-14 | redação do critério omite um controle pré-existente | `No change` | concluído |
| ACH-12, ACH-13 | preenchimento do Evaluation; a Rule já exige a tabela | `No change` | concluído |

## Decisões

- Implementação direta (Builder Direct) na task principal: escopo coeso, 31 paths (revisão 3) em duas apps ligadas por um contrato de status (403).
- Revisão 3 (token `reward-surface`, D-15): decisão do usuário (Q12); Spec Reviewer `clear`; Contract aprovado pelo usuário e Spec `open` → `in_progress`.

## Lições aprendidas

- Antes de afirmar que um assert de toast é real, confirme que ele falha quando o toast não existe (`role="alert"` é sempre ocupado pelo route announcer do Next). Disposição: sem mudança normativa; detalhe local da jornada.
- Em Playwright do Web, cenários que reaproveitam as mesmas credenciais podem receber resposta em cache do `fetch` do Next (ACH-03).

## Alinhamento documental

- Spec: alinhada (revisão 3; `design.md` registra `reward-surface`)
- Rules/Architecture/Overview: alinhados; nenhuma Rule nova necessária (ACH-01..04 sem lacuna normativa recorrente)

## Handoff

- Revisão da Spec e branch/candidato: rev. 3 (`in_progress`), `feat/sign-in-unconfirmed-email-resend`, working tree sobre `93b3e3e09`, sem commits
- Critérios concluídos / inacabados: verificados CA-01..CA-14 e CA-17; CA-01..CA-17 verificados; CA-15 e CA-16 com Visual Reviewer `pass`
- Paths não commitados: todo o diff (Server, Web, PRD, Spec, Evaluation) mais `.code-multivitals-baseline.json` (fora do mapa, ACH-02); dono: task principal
- Últimos resultados reutilizáveis e evidência stale: EV-13 é a evidência vigente do código e dos gates (supera EV-01, EV-05, EV-06 e EV-07 a EV-09 no que mudou); EV-03, EV-04, EV-08 e EV-10 seguem válidos; EV-12 (MV-01) foi capturado antes do token e segue válido só para o comportamento (CA-14). Qualquer mudança em `SupabaseAuthService`, fixtures ou nos widgets do SignIn reabre os checks afetados
- Processos/portas iniciados pela task: dev servers 3000/3334 já encerrados; containers do stack Stardust (`stardust-*`) ficaram de pé, banco local resetado e semeado (`db:seed`); `/tmp/stardust/stardust-web-server-mock-routes.json` é o estado do mock do Playwright
- Bloqueios específicos: nenhum. Dev servers 3000/3334 da revisão 3 já encerrados
- Próxima ação: `conclude-spec` (ACH-03, a tarefa separada do cache de fetch, e `.code-multivitals-baseline.json` fora do mapa devem constar na descrição do PR)

## Conclusão

- Estado: `completed` (revisão 3: token aplicado e provado; Implementation Reviewer `PASS` e Visual Reviewer `pass`)
- Próxima ação: `conclude-spec`
