---
title: Componentes compartilhados e páginas de autenticação alinhados ao design system — implementation plan
status: completed
spec: ./spec.md
spec_revision: 6
evaluation: ./evaluation.md
updated_at: 2026-11-07
---

# Execution status

## Estado

- **Spec:** `completed`, revisão 6 (as revisões 4 a 6 acrescentaram o refresh do baseline de complexidade, os testes das Views do `Dialog` e as
  pastas dos campos do Sign-up), `Spec Reviewer` com resultado `clear` para cada revisão. Issue #620.
- **Motivo do Plan:** mudança visual global em `apps/web` (tokens, cinco componentes compartilhados com 68 + 28 + 14 + 9
  consumidores, nove extrações de View, cinco rotas), dependência entre tokens/componentes e páginas, paralelismo útil
  entre duas áreas sem paths em comum, UI com validação por frame e varredura de regressão dependente de ambiente.
- **Branch e baseline:** a entrega foi publicada na branch limpa `feat/design-system-alignment-web-auth` a partir de `origin/main`
  (PR #631); commit-base congelado em `cb8460cfca198da0ff3236fc47bd786389ce96c3`. Mergeado em `main` por squash (`ed91d7f02`).
- **Fase atual:** concluída. Validação integrada, Implementation Reviewers pareados aceitos e CI verde no HEAD final `45eb57dc5` do PR #631.
- **Próxima ação:** nenhuma nesta Spec. As pendências fora dela estão na seção Conclusão de `evaluation.md`.
- **Blockers:** nenhum. O servidor de testes Web usa `distDir` isolado e porta própria (`3100`), em paralelo ao `next dev` do usuário.

## Builders

| Builder | Boundary | Reviewer pareado | Paths (ownership exclusivo) |
| --- | --- | --- | --- |
| `builder_web_foundation` | tokens, Root, componentes compartilhados, Toast e `design.md` | `implementation_reviewer_foundation` (`implementation-reviewer-agent`) | `apps/web/tailwind.config.js`, `apps/web/src/ui/global/**` (Root, Button, Input, ErrorMessage, Dialog, AlertDialog, Toast), `documentation/design.md`, `documentation/tooling.md`, `scripts/check-test-integrity.mjs`, `scripts/tests/check-test-integrity.test.mjs` |
| `builder_web_auth` | widgets e páginas de autenticação | `implementation_reviewer_auth` (`implementation-reviewer-agent`) | `apps/web/src/ui/auth/**` |

A task principal coordena, integra diffs e mantém `spec.md`, `plan.md` e `evaluation.md`. Builders não os editam.
Arquivos compartilhados, lockfiles e dependências ficam sob a task principal; esta entrega não adiciona dependências.

## Rules e autoridades

Rule Pack: `ui-layer-rules.md`, `web-application-rules.md`, `widget-tests-rules.md`, `web-app-routes-testing-rules.md`,
`code-conventions-rules.md` e `mcp-rules.md`. Autoridades: `AGENTS.md`, `architecture.md`, `tooling.md`, `sdd.md`.

## Política de recuperação

- Um defeito encontrado na validação integrada é corrigido primeiro nos componentes compartilhados do mapa de paths
  (ownership de `builder_web_foundation`).
- Se somente a edição de um arquivo chamador fora do mapa resolver o defeito, o trabalho pausa, a Spec é emendada via
  `create-spec` (revisão 2) com os paths específicos, e o Plan é reconciliado antes de qualquer edição.
- Correção dentro do Contract: registrar `ACH-*`, marcar apenas a evidência afetada como `stale`, retomar o Builder
  responsável e rerodar seus exits. Três falhas materialmente idênticas escalam ao usuário.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | builder_web_foundation | Fundação | F1 Tokens | — | A1 Estrutura | completed | `tailwind.config.js`, `global.css` e `RootLayoutView.tsx` entregues; `html` com `data-theme='stardust-dark'`; utilitários `theme-*` compilam; `format`, `check:code`, `check:types` verdes; EV-01 capturado em computed style. |
| 1 | builder_web_foundation | Fundação | F2 Componentes | F1 Tokens | A1 Estrutura | completed | `Button`, `Input`, `ErrorMessage`, `Dialog` (partes), `AlertDialog` e Toast restilizados com Views e testes novos ou atualizados passando; comparação com o componente do Penpot registrada; `implementation_reviewer_foundation` aceito. |
| 1 | builder_web_foundation | Fundação | F3 Documentação | F2 Componentes | A1 Estrutura | completed | `documentation/design.md` registra referências Penpot, mapeamento `theme-*`, foco D-04 e lacuna de paletas mistas; `check:code` verde. |
| 3 | builder_web_foundation | Fundação | F4 Detector de testes | F2 Componentes | — | completed | `scripts/check-test-integrity.mjs` aceita `ui/**/contexts/**/tests` com caso novo em `scripts/tests/check-test-integrity.test.mjs`; `documentation/tooling.md` atualizado; `npm run test:scripts` e `npm run check:test-integrity` verdes; `implementation_reviewer_foundation` aceito. |
| 1 | builder_web_auth | Autenticação | A1 Estrutura | — | F1 Tokens, F2 Componentes, F3 Documentação | completed | Views extraídas (`Title`, `AppMessage`, `AnimatedForm`, `SignInForm`, `SignUpForm`, `ResetPasswordFormDialog`), `Link` com `tone`, `OptionsDivider` criado, copy "Verifique" corrigida e testes retargetados passando, sem mudança visual; `format`, `check:code`, `check:types` e `test:unit` verdes. |
| 2 | builder_web_auth | Autenticação | A2 Sign-in e Sign-up | F1 Tokens, F2 Componentes, A1 Estrutura | — | completed | Componentes de autenticação, Sign-in e Sign-up alinhados aos frames desktop e mobile; comparação Penpot × Web por estado e viewport; `testId` e fluxos preservados. |
| 2 | builder_web_auth | Autenticação | A3 Demais rotas | A2 Sign-in e Sign-up | — | completed | Reset password (e diálogos), Account confirmation e Social account confirmation alinhados; comparação Penpot × Web registrada; `implementation_reviewer_auth` aceito. |

## Task cards

### F1 Tokens

- **Status/owner:** pending / `builder_web_foundation`.
- **Dependências/paralelismo:** sem dependências; paralela a A1 Estrutura.
- **Paths:** `apps/web/tailwind.config.js`, `apps/web/src/ui/global/styles/global.css`,
  `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx`.
- **RF/CA:** RF-01 / CA-01, CA-02.
- **Resultado observável:** variáveis `--theme-*` (18 cores de `Semantic/Dark` e geometria) ativas sob
  `:root[data-theme='stardust-dark']`, `<html data-theme='stardust-dark'>`, utilitários `theme-*` de cor, raio, altura,
  padding, gap e borda; `body` com `bg-theme-background`; nada existente removido.
- **Rules:** `ui-layer-rules.md`, `web-application-rules.md`, `code-conventions-rules.md`, `mcp-rules.md` (Penpot).
- **Exit:** valores lidos de `Semantic/Dark` e `Geometry` no Penpot MCP; `check:types` e `check:code` verdes.

### F2 Componentes

- **Status/owner:** pending / `builder_web_foundation`.
- **Dependências/paralelismo:** depende de F1 Tokens; paralela a A1 Estrutura.
- **Paths:** `apps/web/src/ui/global/widgets/components/Button/**`, `.../Input/**`, `.../ErrorMessage/ErrorMessageView.tsx`,
  `.../Dialog/{index.tsx,DialogContent.tsx,DialogAnimationView.tsx,DialogHeaderView.tsx}` (remove `DialogAnimation.tsx` e
  `DialogHeader.tsx`), `.../AlertDialog/**`,
  `apps/web/src/ui/global/contexts/ToastContext/Toast/{ToastView.tsx,tests/ToastView.test.tsx}`.
- **RF/CA:** RF-02, RF-03, RF-04, RF-05 / CA-03, CA-04, CA-05, CA-06 (com RF-14 / CA-19 para o foco D-04).
- **Resultado observável:** componentes seguem `Botão`, `Campo de texto`, `Diálogo`, `Diálogo de alerta` e `Notificação / Toast`;
  Entry Points finos com as mesmas props e exports; `aria-label` no alternador de senha; foco `focus-visible` conforme D-04;
  overrides de `className` dos chamadores continuam prevalecendo.
- **Rules:** `ui-layer-rules.md` (Widget Pattern, hooks com `function`), `widget-tests-rules.md`, `web-application-rules.md`.
- **Exit:** `ButtonView.test.tsx`, `InputView.test.tsx`, `AlertDialogView.test.tsx` e `ToastView.test.tsx` passando;
  `check:test-integrity` verificado em F4 Detector de testes; comparação de cada componente com o frame da página 🧩 Components.

### F3 Documentação

- **Status/owner:** pending / `builder_web_foundation`.
- **Dependências/paralelismo:** depende de F2 Componentes; paralela a A1 Estrutura.
- **Paths:** `documentation/design.md`.
- **RF/CA:** RF-16 / CA-21.
- **Resultado observável:** seções 3, 10 e 12 refletem referências e componentes novos do Penpot, mapeamento `theme-*`,
  foco D-04 como extensão aprovada e a lacuna de paletas mistas (D-09).
- **Rules:** `code-conventions-rules.md`.
- **Exit:** `npm run check:code` verde e diff revisado.

### F4 Detector de testes

- **Status/owner:** completed / `builder_web_foundation`.
- **Dependências/paralelismo:** depende de F2 Componentes; sem paralelismo (wave 3).
- **Paths:** `scripts/check-test-integrity.mjs`, `scripts/tests/check-test-integrity.test.mjs`, `documentation/tooling.md`.
- **RF/CA:** RF-18 / CA-23.
- **Resultado observável:** `ALLOWED_TEST_PATH_PATTERNS` ganha um padrão para `apps/(web|backoffice)/src/ui/**/contexts/**/tests`
  (D-11) sem alterar `FORBIDDEN_TEST_SUBJECT_PATTERNS`; um caso novo prova que um teste de view em `contexts/**/tests` é aceito e
  que os testes dedicados de constantes, providers e fixtures seguem rejeitados; `tooling.md` cita testes de views e hooks de
  `contexts` entre os locais permitidos.
- **Rules:** `code-conventions-rules.md`; autoridade `tooling.md` e `sdd.md`.
- **Exit:** `npm run test:scripts` e `npm run check:test-integrity` verdes (esta última sem o erro de `ToastView.test.tsx`).

### A1 Estrutura

- **Status/owner:** pending / `builder_web_auth`.
- **Dependências/paralelismo:** sem dependências; paralela a F1, F2 e F3.
- **Paths:** `apps/web/src/ui/auth/widgets/components/{Title,AppMessage,AnimatedForm,Link,OptionsDivider}/**`,
  `.../pages/SignIn/SignInForm/{index.tsx,SignInFormView.tsx}`, `.../pages/SignUp/SignUpForm/{index.tsx,SignUpFormView.tsx}`,
  `.../pages/ResetPassword/ResetPasswordFormDialog/{index.tsx,ResetPasswordFormDialogView.tsx}`,
  `.../pages/SignUp/SignUpPageView.tsx` e `.../pages/SignUp/tests/SignUpPageView.test.tsx`.
- **RF/CA:** RF-11, RF-12 / CA-10, CA-14, CA-15.
- **Resultado observável:** Entry Points finos com Views explícitas, mesmas props e exports; `Link` com `tone`
  (`highlight` | `subtle`, padrão `subtle`); `OptionsDivider` criado; "Verifique" no Sign-up; testes retargetados
  (`AnimatedForm.test.tsx`) e novos (`TitleView`, `AppMessageView`, `LinkView`, `OptionsDividerView`); sem mudança visual.
- **Rules:** `ui-layer-rules.md`, `widget-tests-rules.md` (exceção §2 para widgets react-hook-form), `web-application-rules.md`.
- **Exit:** suítes existentes de `SignInForm`, `SignUpForm` e `ResetPasswordFormDialog` sem redução de casos; `format`,
  `check:code`, `check:types`, `test:unit` e `check:test-integrity` verdes.

### A2 Sign-in e Sign-up

- **Status/owner:** pending / `builder_web_auth`.
- **Dependências/paralelismo:** depende de F1 Tokens, F2 Componentes e A1 Estrutura; sem paralelismo.
- **Paths:** os Views de `Title`, `AppMessage`, `AnimatedForm`, `Link` e `OptionsDivider`; `pages/SignIn/{SignInPageView.tsx,
  SignInForm/SignInFormView.tsx,SocialLinks/SocialLinksView.tsx,AnimatedHero/AnimatedHeroView.tsx}`;
  `pages/SignUp/{SignUpPageView.tsx,SignUpForm/SignUpFormView.tsx}`.
- **RF/CA:** RF-06, RF-07, RF-11, RF-13, RF-14 / CA-07, CA-08, CA-09, CA-17.
- **Resultado observável:** Sign-in e Sign-up correspondem aos frames desktop (1440 × 900) e mobile (390 × 844) nas âncoras
  da Spec, com ativos reais, copy do código e `testId` preservados; sem rolagem horizontal em 390 px; Hero oculto abaixo de `lg`.
- **Rules:** `ui-layer-rules.md`, `web-app-routes-testing-rules.md`, `mcp-rules.md` (Penpot e Playwright).
- **Exit:** screenshots Playwright atuais com comparação inspecionada por estado e viewport; console, pageerror e requests
  sem falha inesperada; sensores focados verdes.

### A3 Demais rotas

- **Status/owner:** pending / `builder_web_auth`.
- **Dependências/paralelismo:** depende de A2 Sign-in e Sign-up; sem paralelismo.
- **Paths:** `pages/ResetPassword/{ResetPasswordPageView.tsx,ResetPasswordFormDialog/ResetPasswordFormDialogView.tsx}`,
  `pages/AccountConfirmation/AccountConfirmationPageView.tsx`,
  `pages/SocialAccountConfirmation/{SocialAccountConfirmationPageView.tsx,UserCreationPendingMessage/UserCreationPendingMessageView.tsx}`.
- **RF/CA:** RF-08, RF-09, RF-10, RF-13, RF-14 / CA-11, CA-12, CA-13, CA-17.
- **Resultado observável:** as três rotas e os três diálogos de Reset password correspondem aos frames; nova tentativa manual
  e `testId` (`go-to-space-button`, `retry-user-creation-button`) preservados; sem rolagem horizontal em 390 px.
- **Rules:** `ui-layer-rules.md`, `web-app-routes-testing-rules.md`, `mcp-rules.md`.
- **Exit:** screenshots Playwright atuais e comparação por estado e viewport; sensores focados verdes.

# Validation and handoff

Revisão de Reviewers: `implementation_reviewer_foundation` (`implementation-reviewer-agent`) é pareado exclusivamente com
`builder_web_foundation`; `implementation_reviewer_auth` (`implementation-reviewer-agent`) é pareado exclusivamente com
`builder_web_auth`. Cada um é ativado depois do diff do respectivo Builder e retomado após correções. Não há revisão
integrada adicional.

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| --- | --- | --- | --- | --- | --- |
| Sensor | `check:spec-definition` e `check:plan-definition` | Spec e Plan válidos antes de qualquer Builder | `sdd.md` | EV-03 | passed |
| Sensor | `check:spec-implementation -- <spec> --base ea870e258` | Mapa de paths conforme Git e disco, após cada wave e após correções | Spec, Mapa canônico | EV-03 | passed |
| Sensor | `format`, `check:code`, `check:types`, `test:unit` | Verdes por Builder e no candidato integrado | `AGENTS.md` | EV-03 | passed |
| Sensor | `check:test-integrity`, `check:architecture`, `test:coverage`, `check:coverage -- @stardust/web` | Sem testes enfraquecidos, sem violação de camada, baseline não diminui | `tooling.md` | EV-03 | passed |
| Sensor | `npm --workspace @stardust/web run test:integration` | Suítes `auth`, `challenging`, `profile`, `reporting`, `shop` e `space` sem regressão | CA-15 | EV-03 | passed |
| Sensor | `npm run test:scripts` e `check:test-integrity` sem `forbiddenTestPaths` | CA-23: local `contexts/**/tests` aceito; constantes, providers e fixtures rejeitados | D-11, RF-18 | EV-03 | passed |
| Audit | Widget Pattern dos widgets alterados | Tabela de auditoria de `ui-layer-rules.md` preenchida por widget | `ui-layer-rules.md` | EV-03 | passed |
| VM-01 | `/auth/sign-in`: `data-theme`, `--theme-*` e utilitários | CA-01, CA-02 | Penpot `Semantic/Dark`, `Geometry` | EV-01 | passed |
| VM-02 | Sign-in desktop 1440 × 900, padrão e erro de validação | CA-07 | `Autenticação / Desktop / Sign-in` e `· Erro de validação` | EV-02 | passed |
| VM-02 | Sign-in mobile 390 × 844 | CA-08, CA-17 | `Autenticação / Mobile / Sign-in` | EV-02 | passed |
| VM-02 | Sign-up desktop: padrão, nome em uso, confirmação de e-mail | CA-09 | três frames `Autenticação / Desktop / Sign-up` | EV-02 | passed |
| VM-02 | Sign-up mobile 390 × 844 | CA-09, CA-17 | `Autenticação / Mobile / Sign-up` | EV-02 | passed |
| VM-02 | Reset password desktop: solicitação, e-mail inválido, pronto para redefinir | CA-11 | frames `Autenticação / Desktop / Reset password` | EV-02 | passed |
| VM-02 | Reset password mobile: solicitação e pronto para redefinir | CA-11, CA-17 | frames `Autenticação / Mobile / Reset password` | EV-02 | passed |
| VM-02 | Diálogos `Nova senha`, `Senhas diferentes` e `Senha redefinida` | CA-05, CA-11 | três frames de diálogo 512 px | EV-02 | passed |
| VM-02 | Account confirmation desktop e mobile: criando perfil e perfil criado | CA-12, CA-17 | frames `Account confirmation` | EV-02 | passed |
| VM-02 | Social account confirmation desktop: conectando, criando perfil, perfil criado | CA-13 | frames `Social account confirmation` | EV-02 | passed |
| VM-02 | Social account confirmation mobile (regras de Account confirmation) | CA-13, CA-17 | frames mobile de Account confirmation | EV-02 | passed |
| VM-02 | Componentes `Título`, `Campo de texto`, `Botão social`, `Divisor de opções`, `Link de texto`, `Botão`, Toast, `Diálogo`, `Diálogo de alerta` | CA-03 a CA-06, CA-14 | página 🧩 Components | EV-02 | passed |
| VM-03 | Caminho feliz de Sign-in até `/space` e Sign-up até a confirmação com contas seed, endpoints `2xx` | CA-16 | `AGENTS.md` (smoke manual) | EV-04 | passed |
| VM-04 | Tab em cada rota, `Dialog`, `AlertDialog` e Toast; contraste dos pares de cor | CA-03, CA-05, CA-18, CA-19 | D-04 | EV-05 | passed |
| VM-05 | Varredura em 1440 × 900 de `/space`, desafios (lista e editor), `/profile`, `/shop`, lição, ranking e playground | CA-20 | checklist da Spec | EV-06 | passed |
| VM-05 | A mesma varredura em 390 × 844 | CA-20 | checklist da Spec | EV-06 | passed |
| VM-06 | Estrutura do Penpot `stardust`: frames desktop 1440 × 900 e componentes `Toast`, `Diálogo` e `Diálogo de alerta` | CA-22 | RF-17 | EV-07 | passed |
| Reviewer | `implementation_reviewer_foundation` (`implementation-reviewer-agent`) após o diff de `builder_web_foundation` | Sem finding bloqueante | Spec, Rules, evidências | EV-03 | pending |
| Reviewer | `implementation_reviewer_auth` (`implementation-reviewer-agent`) após o diff de `builder_web_auth` | Sem finding bloqueante | Spec, Rules, evidências | EV-03 | pending |

## Handoff

1. Os dois Reviewers pareados aceitos, `evaluation.md` completo (uma linha por RF/CA, sensor, `VM-*`, comparação visual,
   finding e `CI-*`) e status `ready`.
2. Ambiente: Docker e Supabase local via `npm run db:test` e `npm run db:seed`, depois `apps/server` e `apps/web` em
   terminais separados, com credenciais das contas seed carregadas por `export-web-app-e2e-env.mjs --seed`, sem copiar valores.
3. Em seguida: `conclude-spec`, `commit-code` (somente os paths do mapa) e `create-pr` (título e descrição em PT-BR).

# Execution log

- 2026-11-04 — Wave 1 ativada: `builder_web_foundation` (F1 a F3, em sequência) e `builder_web_auth` (A1) em paralelo,
  com ownership de paths disjuntos. A porta de teste 3100 fica reservada a `builder_web_foundation` durante a wave 1.
- 2026-11-04 — A1 Estrutura entregue por `builder_web_auth` (sem commit). Verificação independente da task principal:
  `biome check src/ui/auth` sem erros (2 warnings pré-existentes) e `test:unit src/ui/auth` com 16 suítes e 53 testes
  passando. Pontos para o Reviewer: `LinkView` agora tem altura de 44 px (`h-theme-control`; antes 36 px) e `outline-theme-action`
  ainda precisa de confirmação de CSS gerado na validação integrada. A1 aguarda o diff final da wave para o
  `implementation_reviewer_auth` (revisão pareada ocorre depois de A3).
- 2026-11-04 — F1 e F3 entregues; F2 entregue com `ACH-01` aberto (`check:test-integrity` rejeita o local pré-existente de
  `ToastView.test.tsx`; ver `evaluation.md`). Wave 1 integrada pela task principal: types, `check:code`, arquitetura e
  `test:unit` verdes. Wave 2 iniciada com A2 (não depende de `ACH-01`); `implementation_reviewer_foundation` aguarda a
  resolução de `ACH-01` para avaliar o candidato final de `builder_web_foundation`.
- 2026-11-04 — A2 entregue por `builder_web_auth`; achados `ACH-02` (escala da fonte raiz no mobile) e `ACH-03` (citação do
  `Hero`) dependem de decisão do usuário e de emenda da Spec (revisão 2). `ACH-04` (crases nas células `Change` da Spec)
  corrigido mecanicamente; `check:spec-implementation` passou a ler os 51 paths e só aponta as 4 paths de A3. A3 iniciada
  para o layout desktop e para a geometria mobile; a tipografia mobile permanece baseada em `rem` até `ACH-02` ser decidido.
- 2026-11-04 — A3 entregue; `check:spec-implementation` PASSED (51 paths). Novo `ACH-05` (largura do `Dialog` 464 px contra
  512 px) devolvido a `builder_web_foundation` (F2 volta a `in_progress`); `ACH-06` registrado como observação pré-existente.
  Aguardam decisão do usuário: `ACH-01` (sensor), `ACH-02` (escala da fonte raiz) e `ACH-03` (Hero) e a emenda da Spec (revisão 2).
- 2026-11-04 — Spec emendada para a revisão 2 (draft; `check:spec-definition` PASSED) com as decisões do usuário para `ACH-01`
  (RF-18, CA-23, D-11), `ACH-02` (D-12, DV-09), `ACH-03` (D-13, DV-10) e as divergências DV-11 a DV-16. Implementação pausada
  até o `Spec Reviewer` da revisão 2 retornar `clear`; depois o Plan é reconciliado (`spec_revision: 2`, nova tarefa F4 para
  `builder_web_foundation`).
- 2026-11-04 — Spec revisão 2 `clear` pelo `Spec Reviewer`; Spec de volta a `in_progress`; Plan reconciliado (`spec_revision: 2`,
  F4). F4 entregue por `builder_web_foundation`: padrão `contexts/**/tests` no detector, dois casos novos e uma frase em
  `tooling.md`. Verificação da task principal: `check:spec-implementation` PASSED (54 paths: Create 20, Modify 32, Remove 2),
  `check:test-integrity` PASSED, `node --test scripts/tests/check-test-integrity.test.mjs` 14/14. `ACH-01` resolvido.
  `test:scripts` completo falha em `run-crew-pr-review.test.mjs` (`ERR_UNKNOWN_FILE_EXTENSION .ts` em `apps/crew`, Node v22.17.0),
  sem relação com esta entrega; `apps/crew` não foi tocado. Próximo: sensores integrados e Reviewers pareados.
- 2026-11-04 — Rodada 1 dos Reviewers pareados: `implementation_reviewer_foundation` e `implementation_reviewer_auth` retornaram
  `failed` sem defeito de código, só por lacunas de evidência e de classificação Penpot (`ACH-07`, `ACH-08`, `ACH-09`; ver
  `evaluation.md`). Em andamento: pacote EV-02 (referência Penpot e captura Web no HEAD final), validação integrada
  (VM-01, VM-03 a VM-06) e a correção de uma asserção vazia em `ResetPasswordPageView.test.tsx` (`builder_web_auth`). O
  `test:integration` e as capturas Web em modo de teste dependem de a porta 3000 e o lock do `next dev` do usuário estarem livres.
- 2026-11-04 — `ACH-05` resolvido por `builder_web_foundation` (superfície do `Dialog`/`AlertDialog` em 512 px); verificação da
  task principal verde (types, `check:code`, 571 testes, path conformance). F2 permanece `in_progress` somente por `ACH-01`.
- 2026-11-07 — Spec emendada para a revisão 3 (fundo animado do Sign-up em tela cheia, DV-03, DV-17 a DV-20, dois testes no mapa) e `Spec Reviewer` `clear`. Plan reconciliado.
  Validação integrada: sensores, `test:integration` 78/78 (porta `3100`, `distDir` isolado), VM-03 a VM-05 no stack real, pacote EV-02 (Penpot 32 PNGs, Web 27 PNGs) e correções ACH-11 a ACH-14. Pendentes: Implementation Reviewers pareados e `evaluation.md` `ready`.
- 2026-11-07 — Publicação: PR #631 aberto de uma branch limpa a partir de `origin/main`. `CI-01` reprovou em `check-code-complexity` (ACH-15, `SignUpFormView` com 95 linhas): `Builder Fix ACH-15` extraiu helpers de apresentação no mesmo arquivo e o Reviewer pareado aceitou. A segunda execução comparou 22 funções com o baseline de complexidade; com decisão do usuário, a Spec foi emendada para a revisão 4 (D-14 e o path `.code-multivitals-baseline.json`) e o baseline regenerado e revisado por função.
- 2026-11-07 — CI verde no HEAD `7c47bcc2f` (31 checks aprovados, 1 ignorado) após reexecuções do Server CI (falhas de memória do Jest sem relação com o diff) e do `Crew PR review`. O review do Crew deixou 6 comentários; por pedido do usuário (`resolve-pr-pendencies`), a Spec foi emendada para a revisão 5 (testes de `DialogHeaderView` e `DialogAnimationView`).
- 2026-11-07 — Review do PR #631: `DialogHeaderView.test.tsx` e `DialogAnimationView.test.tsx` criados (revisão 5). Por decisão do usuário, `NameField`, `EmailField`, `PasswordField` e `SubmitButton` saem de `SignUpFormView.tsx` para diretórios próprios e `SignUpForm.test.tsx` ganha dois casos de "já utilizado" (revisão 6, 68 paths); baseline de complexidade regenerado e revisado por função (+3 Views, −3 helpers, 1 remedida, erros 243→242).
- 2026-11-07 — Concluído: CI verde no HEAD `ad0f48bb4` do PR #631; Spec, Plan e `evaluation.md` marcados como `completed`.
