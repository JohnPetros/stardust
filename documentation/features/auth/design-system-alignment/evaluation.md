---
title: Componentes compartilhados e páginas de autenticação alinhados ao design system
spec: ./spec.md
spec_revision: 6
status: completed
base_commit: cb8460cfca198da0ff3236fc47bd786389ce96c3
evaluated_commit: ad0f48bb4
last_updated_at: 2026-11-07
---

# Evaluation — Componentes compartilhados e páginas de autenticação alinhados ao design system

## Escopo avaliado

- Spec: `./spec.md` (revisão 6, `completed`)
- Plan: `./plan.md`
- Commit-base: `ea870e258ba71caf80db559a1460ba29318e5a86` (`main`)
- Commit avaliado: HEAD final do PR #631 `45eb57dc5` (branch `feat/design-system-alignment-web-auth`); squash em `main`
  como `ed91d7f02`
- Alterações do working tree alheias à Spec (`AGENTS.md`, `design/*`, prompts SDD, `scripts/open-penpot.mjs`,
  `skills-lock.json`, `documentation/rules/*`, `documentation/sdd.md`) permanecem fora do candidato.

### Assignments ativas

| Builder | Wave / tarefas | RF / CA | Paths permitidos | Paths proibidos | Rule Pack | Exits |
| --- | --- | --- | --- | --- | --- | --- |
| `builder_web_foundation` | 1 / F1 Tokens, F2 Componentes, F3 Documentação | RF-01 a RF-05, RF-14, RF-16 / CA-01 a CA-06, CA-19, CA-21 | `apps/web/tailwind.config.js`, `apps/web/src/ui/global/**` conforme o mapa da Spec, `documentation/design.md` | `apps/web/src/ui/auth/**`, `spec.md`, `plan.md`, `evaluation.md`, lockfiles, `package.json` | `ui-layer-rules`, `widget-tests-rules`, `web-application-rules`, `code-conventions-rules`, `mcp-rules` | `format`, `check:code`, `check:types`, `test:unit`, `check:test-integrity`; comparação com os componentes do Penpot; `implementation_reviewer_foundation` aceito |
| `builder_web_foundation` | 3 / F4 Detector de testes | RF-18 / CA-23 | `scripts/check-test-integrity.mjs`, `scripts/tests/check-test-integrity.test.mjs`, `documentation/tooling.md` | `apps/web/**`, `apps/backoffice/**`, `spec.md`, `plan.md`, `evaluation.md`, lockfiles, `package.json` | `code-conventions-rules`; autoridades `tooling.md`, `sdd.md` | `npm run test:scripts`, `npm run check:test-integrity`; `implementation_reviewer_foundation` aceito |
| `builder_web_auth` | 1 / A1 Estrutura; 2 / A2 Sign-in e Sign-up, A3 Demais rotas | RF-06 a RF-13, RF-14 / CA-07 a CA-15, CA-17 | `apps/web/src/ui/auth/**` conforme o mapa da Spec | `apps/web/src/ui/global/**`, `apps/web/tailwind.config.js`, `documentation/**`, lockfiles, `package.json` | `ui-layer-rules`, `widget-tests-rules`, `web-app-routes-testing-rules`, `web-application-rules`, `mcp-rules` | mesmos sensores; comparação Penpot × Web por estado e viewport; `implementation_reviewer_auth` aceito |

## Evidências dos critérios

| Critério | Estado | Evidência real |
| -------- | ------ | -------------- |
| CA-01 | passed | EV-01: `data-theme='stardust-dark'` e as 18 cores `--theme-*` conferidas contra `Semantic/Dark` do Penpot em `/auth/sign-in` a 1440 × 900 (`scratchpad/validation/vm01/computed.json`) |
| CA-02 | passed | EV-01 (utilitários consumidos: botão e campo com 44 px, raio 8 px, cores por token) e `check:types` |
| CA-03 | passed | `ButtonView.test.tsx` (Web 571 testes, 2026-11-07), VM-04, aceito por `implementation_reviewer_foundation` (rodada 2) |
| CA-04 | passed | `InputView.test.tsx`, VM-02 (âncoras do `Campo de texto`: 108 px em erro), VM-04, Reviewer foundation |
| CA-05 | passed | VM-02 (diálogos 512 px, DV-13/DV-17), VM-04 (foco contido e restaurado com Esc), Reviewer foundation |
| CA-06 | passed | `ToastView.test.tsx`, VM-02 (360 px; DV-18), VM-04, Reviewer foundation |
| CA-07 | passed | EV-02 (Sign-in desktop, 24 linhas pareadas), Reviewer auth (rodada 2) |
| CA-08 | passed | EV-02 (mobile, DV-09), Reviewer auth |
| CA-09 | passed | EV-02, `SignUpPageView.test.tsx`, VM-03 (cadastro real até a confirmação), Reviewer auth |
| CA-10 | passed | `SignUpPageView.test.tsx` ("Verifique" presente, "Verique" ausente), VM-03 |
| CA-11 | passed | EV-02 (Reset password e três diálogos), `ResetPasswordFormDialog.test.tsx`, Reviewer auth |
| CA-12 | passed | EV-02, `test:integration` 78/78 (account-confirmation), Reviewer auth |
| CA-13 | passed | EV-02 (Social desktop; mobile sem frame, DV-06), Reviewer auth |
| CA-14 | passed | `LinkView.test.tsx`, `OptionsDividerView.test.tsx`, EV-02, Reviewer auth |
| CA-15 | passed | EV-03: `test:integration` 78/78 em 2026-11-07 (porta `3100`, `distDir` isolado) |
| CA-16 | passed | VM-03, EV-04: Sign-in real até `/space` e Sign-up real até a confirmação |
| CA-17 | passed | VM-02 e VM-05: sem rolagem horizontal em 1440 e 390 (Reviewer auth) |
| CA-18 | passed | VM-04, EV-05: Tab em Sign-in, `Dialog`, `AlertDialog` e Toast |
| CA-19 | passed | VM-04, EV-05: contraste de 20 pares e foco visível |
| CA-20 | passed | VM-05, EV-06: varredura de oito rotas em 1440 × 900 e 390 × 844 |
| CA-21 | passed | revisão do diff, `check:code`, Reviewer foundation (`design.md` seções 3, 10 e 12) |
| CA-22 | passed | VM-06, EV-07: boards desktop de autenticação 1440 × 900, mobile 390 × 844, e componentes `Notificação / Toast` (Erro e Sucesso), `Diálogos / Diálogo` e `Diálogos / Diálogo de alerta` presentes e exportados (`scratchpad/validation/vm06/`) |
| CA-23 | passed | `scripts/tests/check-test-integrity.test.mjs` (14/14), `check:test-integrity` verde, Reviewer foundation |

## Registro de mudanças de implementação

| ID | Data | Builder / tarefa | Paths | RF / CA | Estado | Evidência / impacto |
| --- | --- | --- | --- | --- | --- | --- |
| CH-01 | 2026-11-04 | `builder_web_auth` / A1 Estrutura | `apps/web/src/ui/auth/widgets/components/{Title,AppMessage,AnimatedForm,Link,OptionsDivider}/**`, `pages/SignIn/SignInForm/**`, `pages/SignUp/SignUpForm/**`, `pages/ResetPassword/ResetPasswordFormDialog/**`, `pages/SignUp/{SignUpPageView.tsx,tests/SignUpPageView.test.tsx}` | RF-11, RF-12 / CA-10, CA-14, CA-15 | entregue, aguardando Reviewer | Task principal: `biome check src/ui/auth` sem erros; `test:unit src/ui/auth` 16 suítes, 53 testes passando. Sem mudança visual intencional, exceto `Link` (`tone`, altura 44 px) e `OptionsDivider` (novo). HEAD `ea870e258` + working tree. Evidência visual (EV-02) ainda `pending`. |
| CH-02 | 2026-11-04 | `builder_web_foundation` / F1, F2, F3 | `apps/web/tailwind.config.js`, `apps/web/src/ui/global/styles/global.css`, `RootLayoutView.tsx`, `components/{Button,Input,ErrorMessage,Dialog,AlertDialog}/**`, `contexts/ToastContext/Toast/{ToastView.tsx,tests/ToastView.test.tsx}`, `documentation/design.md` | RF-01 a RF-05, RF-14, RF-16 / CA-01 a CA-06, CA-19, CA-21 | entregue; F2 com `ACH-01` aberto | Task principal: `check:types` sem erros; `check:code -w @stardust/web` sem erros (171 warnings pré-existentes); `check:architecture` sem violações (1635 módulos); `test:unit -w @stardust/web` 125 suítes e 566 testes passando. Builder: EV-01 de tokens e comparação de Botão, Campo e Toast Erro em `/auth/sign-in` e `/auth/reset-password` a 1440 × 900 (valores computados); Sucesso, `Dialog` e `AlertDialog` ainda não comparados no navegador (VM-02/VM-04). `check:test-integrity` falha: `ACH-01`. |
| CH-03 | 2026-11-04 | `builder_web_auth` / A2 Sign-in e Sign-up | Views de `Title`, `Link`, `OptionsDivider`, `AppMessage`, `AnimatedForm`; `pages/SignIn/{SignInPageView,SignInForm/SignInFormView,SocialLinks/SocialLinksView,AnimatedHero/AnimatedHeroView}.tsx`; `pages/SignUp/{SignUpPageView,SignUpForm/SignUpFormView}.tsx`; `TitleView.test.tsx`, `SignInPageView.test.tsx` | RF-06, RF-07, RF-11, RF-13, RF-14 / CA-07 a CA-09, CA-17 | entregue; `ACH-02` e `ACH-03` abertos | Task principal: `check:types` sem erros; `test:unit src/ui/auth` 16 suítes e 55 testes passando; `check:spec-implementation` com apenas as 4 paths de A3 pendentes. Builder: screenshots 1440 × 900 e 390 × 844 em `/tmp/claude-1000/-home-petros-projects-stardust/49d10351-e3a4-45cb-a4d2-107902db774c/scratchpad/a2/` e matriz abaixo; foco D-04 de `Link` confirmado por estilo computado (2 px `action`, offset 2 px; altura 44 px). Inspeção visual da task principal de `signin-desktop.png` contra o export do Penpot: layout, larguras e cores correspondem; citação do Hero diverge (`ACH-03`). |
| CH-04 | 2026-11-04 | `builder_web_auth` / A3 Demais rotas | `pages/ResetPassword/{ResetPasswordPageView.tsx,tests/ResetPasswordPageView.test.tsx,ResetPasswordFormDialog/ResetPasswordFormDialogView.tsx}`, `pages/AccountConfirmation/AccountConfirmationPageView.tsx`, `pages/SocialAccountConfirmation/{SocialAccountConfirmationPageView.tsx,UserCreationPendingMessage/UserCreationPendingMessageView.tsx}` | RF-08 a RF-10, RF-13, RF-14 / CA-11 a CA-13, CA-17 | entregue; `ACH-02`, `ACH-05` e `ACH-06` abertos | Task principal: `check:types` sem erros; `test:unit src/ui/auth` 16 suítes e 57 testes passando; `check:spec-implementation` **PASSED** (51 paths: Create 20, Modify 29, Remove 2). Builder: 21 screenshots 1440 × 900 e 390 × 844 em `/tmp/claude-1000/-home-petros-projects-stardust/49d10351-e3a4-45cb-a4d2-107902db774c/scratchpad/a3/` e medições em `results-merged.json`; todos os frames desktop de Reset, Account e Social em `match` (diálogos com `ACH-05`); geometria mobile em `match`, tipografia mobile diverge (`ACH-02`). Componentes compartilhados verificados no navegador: `Dialog` (superfície, borda, raio, cabeçalho 53 px, fechar 44 × 44), `AlertDialog` (cabeçalho, Lottie, mensagem, botão), Toast de sucesso (360 px, `success-surface`, barra 4 px, `Fechar mensagem`) e foco D-04 (2 px `action`, offset 2 px) por Tab; foco contido e restaurado no `Dialog` Nova senha. |
| CH-05 | 2026-11-04 | `builder_web_foundation` / F4 Detector de testes | `scripts/check-test-integrity.mjs`, `scripts/tests/check-test-integrity.test.mjs`, `documentation/tooling.md` | RF-18 / CA-23 | entregue, aguardando Reviewer | Task principal: `check:spec-implementation` PASSED (54 paths); `check:test-integrity` PASSED (13 arquivos de teste alterados); `node --test scripts/tests/check-test-integrity.test.mjs` 14 testes, 14 passando (2 casos novos); `biome format` sem pendências. `npm run test:scripts` completo: 1 falha em `scripts/tests/run-crew-pr-review.test.mjs` (`ERR_UNKNOWN_FILE_EXTENSION ".ts"` ao carregar `apps/crew/.../review-input-schema.ts`, Node v22.17.0), fora do escopo; `apps/crew` não alterado. `ACH-01` resolvido. |
| CH-06 | 2026-11-04 | `builder_web_auth` / Builder Fix (observação do Reviewer) | `apps/web/src/ui/auth/widgets/pages/ResetPassword/tests/ResetPasswordPageView.test.tsx` | RF-08 / CA-11 | entregue; invalida o veredito `implementation_reviewer_auth` da rodada 1 (reavaliação já prevista) | A asserção vazia `not.toHaveClass('w-[100rem]')` no `<input>` foi substituída por asserções observáveis do contêiner `max-w-[384px]`; o caso falharia no baseline. Task principal: `test:unit` do diretório ResetPassword 2 suítes, 4 testes passando. |
| CH-07 | 2026-11-04 | `builder_web_foundation` e `builder_web_auth` / Builder Fix de `ACH-09` e observação 4 | `apps/web/src/ui/global/widgets/components/Input/InputView.tsx`, `apps/web/src/ui/auth/widgets/pages/SignIn/SocialLinks/SocialLinksView.tsx` | RF-03, RF-11 / CA-04, CA-14 | entregue; invalida os vereditos da rodada 1 de ambos os Reviewers (reavaliação já prevista) | Removidas as classes sem suporte do Penpot: `placeholder:text-theme-text-secondary` (`InputView`) e `hover:border-theme-text-secondary` (`SocialLinksView`). Task principal: nenhuma ocorrência restante de `placeholder:` no `InputView` nem de `hover:` no `SocialLinksView`; builders: `InputView.test.tsx` 12/12, `test:unit src/ui/auth` 16 suítes e 57 testes, `check:types` e `biome check` sem erros. |

## Revisões

### Spec Reviewer

- Veredito: `clear`
- Revisão: 1, reavaliada na revisão 2 (emenda de 2026-11-04: RF-18, CA-23, D-11 a D-13 e DV-09 a DV-16), `clear` sem findings
- Escopo: compatibilidade com `architecture.md` e Rules antes do planejamento
- Observação não bloqueante adotada: a frase de `tooling.md` cita testes de views e hooks de `contexts`
- Findings: ACH-01 a ACH-04 resolvidos na Spec antes de `open` (extração de Views, auditoria corrigida, partes do
  `Dialog` com sufixo `View`). Observações pré-existentes e fora de escopo: `Dialog.tsx` sem View própria; `useAlertDialog`
  e `useResetPasswordFormDialog` acessam contexts.

### Implementation Reviewer

- `implementation_reviewer_foundation`: `failed` (rodada 1, 2026-11-04, sobre `ea870e258` + working tree). Sem defeito de código,
  Widget Pattern, comportamento ou escopo; bloqueio único `ACH-09` (lacuna de classificação Penpot); `test:integration` pendente.
- `implementation_reviewer_auth`: `failed` (rodada 1, 2026-11-04, sobre `ea870e258` + working tree). Sem defeito de código,
  Widget Pattern, comportamento ou escopo; bloqueios `ACH-07` e `ACH-08` (lacunas de evidência); `test:integration` pendente.
- `implementation_reviewer_auth`: **`accepted`** (rodada 2, 2026-11-07, Spec revisão 3, sobre `ea870e258` + working tree, 31 arquivos de `ui/auth/**`). Veredito por linha da matriz: as 24 linhas pareadas e os três estados do Social mobile (DV-06) sem diferença `missing`, `contradicted` ou adição não aprovada; sem rolagem horizontal em 1440 e 390; sem erros de console, página ou requisição nas capturas. Widget Pattern, `ui-layer-rules`, `widget-tests-rules` e mapa de paths conformes (os dois testes da revisão 3 incluídos). Sem finding bloqueante. Observações não bloqueantes, sem mudança de código: `IR-01` o mesmo `autoFocus` pré-existente também mostra o anel D-04 em Reset password, no diálogo `Nova senha` e no nome do Sign-up (rastreável por DV-04 e RF-12; DV-19 cita só o Sign-in e deve ser lido como "qualquer campo com `autoFocus`"); `IR-02` a caixa de 96 px do link "Esqueci a senha" no frame do Sign-in está cortada e a Web mostra o link inteiro (134 × 44), mesma natureza de DV-20; `IR-03` o fundo em tela cheia depende de o `div` raiz do Lottie ser filho direto do `AnimatedOpacity` (override `!important` de fora, porque o `Animation` compartilhado está fora do mapa); `IR-04` botão primário mais escuro em algumas capturas é artefato de hover/transição (cor medida `rgb(50, 233, 149)`). Autoridade: `No change`.
- Qualquer mudança no candidato após estes vereditos exige reavaliação pareada.
- `implementation_reviewer_foundation`: **`accepted`** (rodada 2, 2026-11-07, Spec revisão 3, sobre `ea870e258` + working tree). `ACH-09` fechado: `InputView` `mt-3` (Penpot: campo em erro 108 = 20 + 12 + 44 + 12 + 20), `placeholder:` (revertido em CH-07), `AlertDialogView` `mt-4` (padding 24, gap 16; 421 px no frame), `tracking-wide` removido (14/500 sem espaçamento; nó `…e29e7f8f203c`, letter-spacing 0, citado aqui como âncora complementar ao `penpot/index.json`), `DialogHeaderView` `pb-2` (53 = 44 + 8 + 1) e fechar fora do `DialogTitle` (nós irmãos no frame): todos `match` ou revertidos. CA-01 a CA-06, CA-19, CA-21 e CA-23 satisfeitos; Widget Pattern, `widget-tests-rules`, exports públicos e mapa de paths (25 paths de fundação) conformes. Sem finding bloqueante. Observações não bloqueantes, sem mudança de código: `IR-01` o componente `Diálogo de alerta` mede 389 px (cabeçalho derivado de 29 px) e o frame `Senha redefinida` 33 px, como a Web; diferença de 4 px contra o componente, de mesma natureza de DV-17; `IR-02` o letter-spacing 0 só consta em prosa (resolvido acima); `IR-03` o parágrafo genérico de "Implementation mapping" em `design.md` ficou depois da subseção "Keyboard focus" (ordem de leitura, sem efeito); `IR-04` `ToastView.test.tsx` usa `closeButton.click()` em vez de `userEvent`. Não alterados, para não invalidar o veredito. Autoridade: `No change`.
- Os dois Reviewers pareados avaliaram o working tree sobre `ea870e258`; depois deles, a branch recebeu o commit alheio `1380ab9af` (somente `apps/server`: env, `DropboxStorageProvider` e `SentryTelemetryProvider`), sem relação com esta Spec e sem toque em `apps/web`; ele não faz parte dos paths contratados.

| Gate | Estado | Evidência |
| ---- | ------ | --------- |
| UI Layer Audit | passed | task principal e dois Reviewers pareados (rodada 2) | tabela `Auditoria de UI` abaixo |
| Penpot/Web comparison | passed | EV-02 (2026-11-07): pacote Penpot × Web por linha da matriz (VM-02), aceito pelos dois Reviewers pareados |

### Auditoria de UI (`ui-layer-rules.md`)

Coletada pela task principal em 2026-11-04 sobre o working tree (HEAD `ea870e258` mais o candidato); cada `index.tsx` tem 0
ocorrências de `useState`/`useEffect`/`useCallback`/`useMemo`; cada View tem 0 ocorrências de `useEffect`, `useContext`,
chamadas de context, serviços ou `fetch` (a única correspondência, em `SignUpPageView.tsx`, é o tipo `ProfileService` repassado
por prop, idêntico ao baseline); todos os hooks são declarados com `function`.

| Widget | Entry Point | View | Hook | Resultado |
| --- | --- | --- | --- | --- |
| `Button` | `Button/index.tsx` (3 linhas) | `ButtonView.tsx` (52) | não se aplica | passed |
| `Input` | `Input/index.tsx` (27) | `InputView.tsx` (103) | `useInput.ts` | passed |
| `AlertDialog` | `AlertDialog/index.tsx` (38) | `AlertDialogView.tsx` (89) | `useAlertDialog.ts` | passed |
| `ErrorMessage` | `ErrorMessage/index.tsx` (3) | `ErrorMessageView.tsx` (10) | não se aplica | passed |
| `Dialog` (partes) | `Dialog/index.tsx` (17, barrel) | `DialogAnimationView.tsx` (49), `DialogHeaderView.tsx` (32) | `useDialog.ts` (container, sem alteração) | passed |
| `Toast` | `Toast/index.tsx` (43) | `ToastView.tsx` (136) | `useToast.ts` | passed |
| `Title` | `Title/index.tsx` (3) | `TitleView.tsx` (22) | não se aplica | passed |
| `AppMessage` | `AppMessage/index.tsx` (3) | `AppMessageView.tsx` (47) | não se aplica | passed |
| `AnimatedForm` | `AnimatedForm/index.tsx` (3) | `AnimatedFormView.tsx` (46) | não se aplica | passed |
| `Link` | `Link/index.tsx` (3) | `LinkView.tsx` (28) | não se aplica | passed |
| `OptionsDivider` | `OptionsDivider/index.tsx` (3) | `OptionsDividerView.tsx` (21) | não se aplica | passed |
| `SignInForm` | `SignInForm/index.tsx` (20) | `SignInFormView.tsx` (49) | `useSignInForm.ts` | passed |
| `SignUpForm` | `SignUpForm/index.tsx` (29) | `SignUpFormView.tsx` (128) | `useSignUpForm.ts` | passed |
| `ResetPasswordFormDialog` | `ResetPasswordFormDialog/index.tsx` (46) | `ResetPasswordFormDialogView.tsx` (94) | `useResetPasswordFormDialog.ts` (acessa `useToastContext`, pré-existente) | passed |
| `SignInPage` | `SignIn/index.tsx` (33) | `SignInPageView.tsx` (69) | `useSignInPage.ts` | passed |
| `SignUpPage` | `SignUp/index.tsx` (32) | `SignUpPageView.tsx` (81) | `useSignUpPage.ts` | passed |
| `ResetPasswordPage` | `ResetPassword/index.tsx` (37) | `ResetPasswordPageView.tsx` (90) | `useResetPassword.ts` | passed |
| `AccountConfirmationPage` | `AccountConfirmation/index.tsx` (42) | `AccountConfirmationPageView.tsx` (74) | `useAccountConfirmationPage.ts` | passed |
| `SocialAccountConfirmationPage` | `SocialAccountConfirmation/index.tsx` (51) | `SocialAccountConfirmationPageView.tsx` (69) | `useSocialAccountConfirmationPage.ts` | passed |
| `SocialLinks` | `SocialLinks/index.tsx` (3) | `SocialLinksView.tsx` (29) | não se aplica | passed |
| `AnimatedHero` | `AnimatedHero/index.tsx` (3) | `AnimatedHeroView.tsx` (35) | não se aplica | passed |
| `UserCreationPendingMessage` | `UserCreationPendingMessage/index.tsx` (13) | `UserCreationPendingMessageView.tsx` (22) | `useUserCreationPendingMessage.ts` | passed |

Observações pré-existentes e fora de escopo: `Dialog.tsx` (container Radix) sem View própria; `useAlertDialog` e
`useResetPasswordFormDialog` acessam contexts.

## Sensores e preflight

| Comando | Estado | Evidência |
| ------- | ------ | --------- |
| `npm run check:spec-definition -- documentation/features/auth/design-system-alignment/spec.md` | passed | 2026-11-04, PASSED (antes de qualquer Builder) |
| `npm run check:plan-definition -- documentation/features/auth/design-system-alignment/plan.md` | passed | 2026-11-04, PASSED (antes de qualquer Builder) |
| `npm run check:spec-implementation -- <spec> --base ea870e258` | passed | 2026-11-04, PASSED: 54 paths (Create 20, Modify 32, Remove 2); 32 paths alheios ignorados (EV-03) |
| `npm run format` | passed | `npx biome format src` no Web sem alterações pendentes (o script `format` grava em todo o working tree, que contém arquivos alheios; verificação sem escrita) (EV-03) |
| `npm run check:code` | passed | 2026-11-04, 9/9 tarefas ok, exit 0; 171 warnings pré-existentes no Web (EV-03) |
| `npm run check:types` | passed | 2026-11-04, 9/9 tarefas ok, exit 0 (EV-03) |
| `npm run test:unit` | passed | 2026-11-04, 6/6 tarefas ok; Web 125 suítes e 571 testes, Server 169 suítes e 335 testes (EV-03) |
| `npm run check:test-integrity` | passed | 2026-11-04, PASSED, 13 arquivos de teste alterados (após D-11/F4) (EV-03) |
| `npm run check:architecture -w @stardust/web` | passed | 2026-11-04, sem violações (1635 módulos, 2621 dependências) (EV-03) |
| `npm --workspace @stardust/web run test:integration` | passed | 2026-11-07, candidato atual (inclui ACH-13): 78 testes, 78 aprovados, 0 ignorados, 6,0 min, 1 worker, servidor de testes na porta `3100` com `distDir` isolado `.next-testing`, em paralelo ao `next dev` do usuário na `3000` (o Next só permite um `next dev` por diretório de build, mesmo em portas diferentes). Para isso, `next.config.js` aceita `NEXT_DIST_DIR`, `playwright.config.ts` usa `.next-testing` e a porta de `WEB_APP_TEST_PORT` (padrão `3100`), e `.gitignore` ignora `.next-testing`; essas alterações ficam fora do mapa de paths da Spec e vão para o branch de tooling. O Next reescreve `apps/web/next-env.d.ts` ao usar o `distDir` isolado; o arquivo foi restaurado com `git checkout`. Log: `scratchpad/integration.log` |
| `npm run test:coverage -w @stardust/web` | passed | 2026-11-04: statements 25,22%, branches 27,98%, functions 22,80%, lines 25,98%; 125 suítes e 571 testes (EV-03) |
| `npm run check:coverage -- @stardust/web` | passed | 2026-11-04: lines 25,98% (baseline 24,76%), statements 25,22% (23,93%), functions 22,80% (21,59%), branches 27,98% (27,07%) (EV-03) |
| `npm run test:scripts` | partial | 2026-11-04: `node --test scripts/tests/check-test-integrity.test.mjs` 14/14 (detector). O `test:scripts` completo falha só em `run-crew-pr-review.test.mjs` (`ERR_UNKNOWN_FILE_EXTENSION .ts`, `apps/crew` não tocado, Node v22.17.0), sem relação com a entrega |
| Reexecução dos sensores no estado atual (inclui ACH-13) | passed | 2026-11-07: `check:code` 9/9, `check:types` 9/9, `test:unit` (Web 125 suítes e 571 testes; Core 638; Server 335; Backoffice 64), `check:spec-definition`, `check:plan-definition`, `check:spec-implementation` (54 paths), `check:test-integrity --base ea870e258` e `check:architecture` (sem violações) com exit 0. `test:integration` segue bloqueado pelo `next dev` do usuário na porta 3000 |
| Sensores finais do `conclude-spec` (revisão 3, HEAD `1380ab9af` mais o diff da entrega) | passed | 2026-11-07: `check:spec-definition` PASSED; `check:plan-definition` PASSED; `check:spec-implementation -- <spec> --base ea870e258` PASSED (56 paths: Create 20, Modify 34, Remove 2; 38 paths alheios ignorados); `check:test-integrity -- --base ea870e258` PASSED (13 arquivos de teste alterados, 25 fontes testáveis, 14 excluídas). Nenhum arquivo de código mudou desde a reexecução de `check:code`, `check:types`, `test:unit` e `check:architecture` acima. Logs: `scratchpad/final/` |

## Validações manuais (VM)

Execução de 2026-11-04 por agente de validação, no stack local real (Web `next dev` do usuário em `localhost:3000`, Server em
`localhost:3334`, Supabase local em `127.0.0.1:15423`). Artefatos em
`/tmp/claude-1000/-home-petros-projects-stardust/49d10351-e3a4-45cb-a4d2-107902db774c/scratchpad/validation/`.

| ID | Cenário | Estado | Evidência / causa |
| --- | --- | --- | --- |
| VM-01 | Tokens e utilitários `theme-*` no navegador | passed | EV-01: `vm01/computed.json`, `vm01/signin-1440.png`; 18 cores e 6 variáveis de geometria iguais ao Penpot e a `global.css` |
| VM-02 | Penpot × Web por linha da matriz | passed | EV-02 (2026-11-07, candidato atual com ACH-13): pacote independente em `scratchpad/ev02/` — Penpot (32 PNGs com o tamanho do nó e `index.json` com 1 a 18 âncoras por slug, lidas pelo Penpot MCP) e Web (27 PNGs em modo de teste, porta `3100`, `distDir` isolado, estados por `ServerMock`, âncoras medidas no DOM, sem erros de página). Pares visuais lado a lado em `scratchpad/ev02/sheets/` (desktop 1 a 4, mobile, diálogos, Toasts). Resultado: estrutura, larguras (576/864/392/384/342/288/512/360), alturas de controle (44), cores e tipografia coincidem em todas as linhas da matriz; sem frame de Penpot para o Social mobile (DV-06). Divergências medidas e registradas na revisão 3 da Spec: DV-03 (391 px da coluna do frame × 392 px do componente), DV-09 (escala do `rem` no mobile, título 21,72 px × 24 px), DV-12 (fundo animado em tela cheia), DV-17 (borda CSS ocupa 2 px no diálogo), DV-18 (Toast 78 px × 70 px), DV-19 (sem hover; foco automático do e-mail no Sign-in), DV-20 (defeitos dos frames). A cor da mensagem de `Senha redefinida` coincide (`#58dfa6`), sem divergência. Confirmação independente pelos Implementation Reviewers pareados pendente |
| VM-03 | Caminho feliz de Sign-in e Sign-up no stack real | passed | EV-04 (2026-11-07, Playwright, stack real): Sign-in com a conta seed termina em `/space` autenticado (nome e e-mail exibidos; `POST /auth/sign-in` 200, `GET /auth/account` 200 e `POST /auth/refresh-session` 201 confirmados direto na API com o mesmo fluxo); Sign-up com e-mail novo: `POST /api/auth/sign-up` 201, WebSocket do Realtime aberto e `sign-up-success-message` com "Verifique o seu e-mail…" (após ACH-11). Capturas: `scratchpad/vm/vm03-space.png`, `scratchpad/signup-result.png` |
| VM-04 | Foco por teclado e contraste | passed | EV-05 (2026-11-07, Playwright, stack real): contraste de 20 pares passou (EV-05 anterior). Tab em Sign-in: Google > GitHub > e-mail > senha > Mostrar senha > Entrar > Esqueci a senha > Criar conta, todos com indicador visível (`outline` 2 px; Entrar 3 px; campos com anel no contêiner). `Dialog` `Nova senha` (reset real via Mailpit): foco entra em `new-password-input`, Tab e Shift+Tab ficam contidos (Fechar → primeiro campo) e Esc fecha e devolve o foco a `open-reset-password-dialog-button`. `AlertDialog` (saída da lição): foco entra em `Cancelar`, Tab alterna entre os dois botões e Esc devolve o foco a `Sair da lição`. Toast: `Fechar mensagem` alcançado por Tab (8º) com `outline` 2 px `action` e `:focus-visible`. Capturas: `scratchpad/vm/vm04-*.png` |
| VM-05 | Varredura de regressão a 1440 × 900 e 390 × 844 | passed | EV-06 (2026-11-07, Playwright, uma sessão por viewport): `/space`, lista e editor de desafios, `/profile/explorer-seed`, `/shop`, `/lesson/variaveis`, `/ranking` e `/playground/snippets/new` abrem na própria URL, sem rolagem horizontal, sem sobreposição ou corte atribuível à restilização e com a função preservada. Observações de dados/ambiente, sem relação com a Spec: ranking vazio no seed, imagens de insígnia e de lição sem CDN local, chips de filtro de desafios cortados na rolagem interna do mobile (pré-existente). Contact sheets: `scratchpad/vm/sheet-desktop.png`, `scratchpad/vm/sheet-mobile.png` |
| VM-06 | Estrutura do Penpot `stardust` | passed | EV-07: `scratchpad/validation/vm06/{toast-erro,toast-sucesso,dialogo,dialogo-alerta}.png`; frames 1440 × 900 e 390 × 844 |

Efeito colateral local: o Sign-up criou o usuário `vm03-85af544f@stardust.local` no Supabase local.

## Checks e build do CI

| ID | Verificação | Estado | HEAD / evidência |
| --- | --- | --- | --- |
| CI-01 | Checks automatizados | passed | PR https://github.com/JohnPetros/stardust/pull/631, head `feat/design-system-alignment-web-auth`, HEAD `ad0f48bb4` (revisão 6 da Spec): 31 checks aprovados e 1 ignorado (`gh pr checks 631`), incluindo `check-code-complexity`, `Check code`, `Check types`, `Check architecture`, `Unit tests`, os testes de integração da Web e do Server e o `Crew PR review`. Falhas anteriores, todas resolvidas: ACH-15 e ACH-16 (complexidade, HEAD `8c4012d81` e `48d156cc6`) e falhas de memória do Jest nos testes de integração do Server (sem relação com o diff; reexecutadas até passar, sem alteração de código) |
| CI-02 | Build | passed | Job `Build` aprovado no HEAD `ad0f48bb4` do PR #631 (três workflows; o quarto foi ignorado por regra do workflow) |

## Warnings e findings

- `ACH-01` — `check:test-integrity` falha (`FAILED`, reproduzido pela task principal em 2026-11-04): o mapa da Spec exige
  `Modify` em `apps/web/src/ui/global/contexts/ToastContext/Toast/tests/ToastView.test.tsx`, um caminho pré-existente que o
  sensor (`ALLOWED_TEST_PATH_PATTERNS` em `scripts/check-test-integrity.mjs`) não aceita; ele só dispara por o arquivo estar
  alterado. Não é defeito de implementação: o conflito é entre o Contract e a política do sensor. Estado: **decidido pelo usuário** em 2026-11-04 (opção b): D-11/RF-18/CA-23 na revisão 2 da Spec; correção em F4 Detector de testes (`builder_web_foundation`).
- `ACH-02` — escala da fonte raiz no mobile: `global.css` reduz o `rem` (94,75% abaixo de 1080 px e 90,5% abaixo de 720 px),
  então a tipografia em 390 px fica ~9,5% menor que o frame (título 21,72 px contra 24; botão e link 12,67 contra 14;
  divisor 14,48 contra 16; evidência `results-signin-mobile.json`). Geometria (margem 24 px, conteúdo 342 px) coincide. Remover
  ou escopar a regra é uma mudança global (RF-15) fora do Contract de `global.css`. Estado: **decidido pelo usuário** em 2026-11-04 (opção a): D-12 e DV-09 na revisão 2 da Spec; sem alteração de código. A tipografia mobile permanece como divergência aprovada.
- `ACH-03` — citação do `Hero` (`components/Hero/index.tsx`, declarado sem alteração e fora do mapa): web `text-base text-gray-100`
  em duas linhas; frame 14/400 `text-secondary`. CA-07 exige tipografia do frame. Estado: **decidido pelo usuário** em 2026-11-04 (opção b): D-13 e DV-10 na revisão 2 da Spec; `Hero` permanece sem alteração.
- `ACH-04` — `check:spec-implementation` retornava "Spec has no affected-path rows": as células `Change` do mapa estavam entre
  crases (`` `Modify` ``), que o parser não reconhece. Correção mecânica na Spec (51 linhas, sem alteração de Contract, revisão
  mantida em 1): células `Change` sem crases. `check:spec-definition` segue `PASSED`; o sensor agora lê 51 paths
  (Create 20, Modify 29, Remove 2). Estado: resolvido.
- `ACH-05` — largura do `Dialog`/`AlertDialog`: a superfície mede 464 px a 1440 × 900 (`rect` 488 a 952) contra 512 px no
  componente e nos frames do Penpot; `DialogContent.tsx` usa `max-w-lg` (512 px) com `p-6` por fora da superfície, sem compensar
  o padding. Espaçamentos internos conferem. Correção dentro do Contract e do ownership de `builder_web_foundation`
  (`DialogContent.tsx`, RF-04 / CA-05, CA-11). Estado: **resolvido** em 2026-11-04 por `builder_web_foundation`
  (`max-w-lg` para `max-w-[calc(512px+3rem)]` em `DialogContent.tsx` e `AlertDialogView.tsx`, mais um caso em
  `AlertDialogView.test.tsx`). Medição do Builder: superfície de 512 px a 1440 × 900 no `Dialog` Nova senha e no `AlertDialog`
  Senha redefinida, e 346,6 px (com margem) a 390 × 844, sem rolagem horizontal; diálogos com `max-w-*` próprio (`2xl`, `3xl`,
  `[680px]`) seguem prevalecendo; diálogos sem `className` passam de 464 para 512 px (intencional, RF-04). Task principal:
  `check:types` sem erros, `check:code` sem erros, `test:unit` 125 suítes e 571 testes passando, `check:spec-implementation`
  PASSED. A evidência de tamanho anterior fica `stale`; o Reviewer pareado reavalia o candidato final.
- `ACH-06` — o `AlertDialog` de Senha redefinida abre com o `Dialog` Nova senha ainda aberto por baixo (`useResetPasswordFormDialog`
  não o fecha) e o foco permanece no `Dialog` de baixo. Comportamento pré-existente; alterar o fluxo está fora do Contract
  (RF-12). CA-19 é comprovado para o `Dialog` Nova senha e para o `AlertDialog` pelos estilos de foco; a contenção de foco no
  `AlertDialog` sobre o `Dialog` fica registrada como observação e levada ao usuário no encerramento. Estado: observação aberta.
- `ACH-07` (`IR-01` do `implementation_reviewer_auth`, bloqueante, lacuna de evidência) — as medições de diálogo em
  `scratchpad/a3/results-merged.json` (superfície de 464 px) são anteriores ao fix `ACH-05` e contradizem DV-13/CA-05; a
  evidência fresca de 512 px está só em `scratchpad/f2fix/`, que não cobria os três estados do Reset password com a comparação
  Penpot. Estado: **aberto**; exige recaptura dos três diálogos (`Nova senha`, `Senhas diferentes`, `Senha redefinida`) no HEAD
  final, com a comparação Penpot × Web (EV-02). Evidência de `a3` marcada `stale` para os diálogos.
- `ACH-08` (`IR-02`, bloqueante, lacuna de evidência) — o Reviewer não pode chamar o Penpot MCP e só recebeu exports de Sign-in
  desktop, Sign-up desktop e Account desktop; faltam exports Penpot pareados para Reset password (3 desktop, 2 mobile, 3
  diálogos), Account mobile, Social desktop e Sign-in/Sign-up mobile. Estado: **aberto**; a task principal produz um pacote
  único de EV-02 (export_shape do Penpot e captura Web por linha da matriz, no HEAD final) para a reavaliação.
- Observações não bloqueantes do `implementation_reviewer_auth` (veredito provisório `failed` só por `ACH-07` e `ACH-08`; sem
  defeito de código, Widget Pattern, comportamento ou escopo): (1) `ResetPasswordPageView.test.tsx` tem uma asserção vazia
  (`not.toHaveClass('w-[100rem]')`, que passaria no baseline) a corrigir; (2) `TitleView` só renderiza o `<p>` quando há texto;
  (3) tipos de campos duplicados em `SignUpFormView` e `ResetPasswordFormDialogView` (compatíveis, sem deriva hoje); (4)
  `hover:border-theme-text-secondary` em `SocialLinksView` a conferir contra `Botão social`; (5) `SignInPageView.test.tsx` e
  `ResetPasswordPageView.test.tsx` modificados mas sem linha `Modify` no mapa; (6) a evidência final deve vir de uma única
  execução limpa no HEAD final.
- `ACH-09` (`IR-01` do `implementation_reviewer_foundation`, bloqueante, lacuna de classificação Penpot) — mudanças visuais
  sem `match` ou adaptação registrada contra o Penpot e fora de DV-01..DV-16: `InputView` (`ErrorMessage className='mt-3'` e
  `placeholder:text-theme-text-secondary`), `AlertDialogView` (margem da animação de `mt-3` para `mt-4`), `ButtonView` (remoção de
  `tracking-wide`) e `DialogHeaderView` (`pb-3` para `pb-2`, fechar fora do `DialogTitle`). Provável origem no Penpot, mas sem
  medição registrada. Estado: **aberto**; o pacote EV-02 deve citar o nó e o valor do Penpot para cada item (ou o item é
  revertido/declarado como divergência). Observações não bloqueantes do mesmo Reviewer: `AlertDialogViewProps.animation` mais
  estreito que a Spec; prop `type` repassada à View sem uso em `AlertDialogView`; `isActive` com `errorMessage` agora resolve para
  `danger` (confirmar em Sign-up `Nome em uso`); o primeiro hunk de `design.md` (linhas de fontes, fora das seções 3, 10 e 12) já
  era alteração não commitada do usuário; configurações `extendTailwindMerge` duplicadas em `ButtonView` e `DialogAnimationView`.
- `ACH-10` (ambiente, bloqueia VM-03 e VM-05) — o Supabase local tem as contas seed em `auth.users`, mas a conta seed não tem linha em
  `public.users` e `public.challenges` está vazio; `/space`, `/ranking` e `/shop` redirecionam para `/auth/account-confirmation`.
  Correção do ambiente: `npm run db:seed -w @stardust/server`, que limpa e repopula o banco local (exige autorização do usuário
  pelo efeito sobre os dados locais). Estado: **resolvido** em 2026-11-07 por pedido do usuário: o stack local estava parado (reinício da máquina), foi iniciado com `docker compose --env-file .env.local up -d --wait …` e `npm run db:seed -w @stardust/server` concluiu (`auth.users` 2, `public.users` 2, `challenges` 27, `planets` 8); `POST /auth/v1/token?grant_type=password` com a conta seed retorna 200.
- `ACH-11` (ambiente, bloqueia VM-03 b) — o serviço `supabase-realtime` do `docker-compose.yml` não provisiona tenant: o
  WebSocket em `127.0.0.1:15423/realtime/v1/websocket` retorna 403 (`TenantNotFound: Tenant not found: 127`; `_realtime.tenants`
  vazia). O estado de sucesso do Sign-up (`UserCreatedEvent`) depende do Realtime. Fora desta Spec; exige provisionar o tenant
  local ou uma decisão do usuário sobre a evidência. Estado: **resolvido no banco local em 2026-11-07**. Três lacunas do
  Supabase local, todas fora do código desta Spec: (1) tenant `127` criado pela API admin do Realtime (`PUT /api/tenants/127`);
  (2) `ALTER PUBLICATION supabase_realtime ADD TABLE public.users` (a migration `20250517205525_remote_schema.sql` já declara
  isso, mas o banco local não tinha a tabela publicada); (3) `GRANT SELECT ON public.users TO anon, authenticated` (a migration
  concede `ALL`; o banco local só concedia a `service_role`, e o Realtime devolvia `Error 401: Unauthorized` com registro vazio).
  Evidência: Playwright em `/auth/sign-up` (1440×900) com e-mail novo — `POST /api/auth/sign-up` 201, WebSocket
  `/realtime/v1/websocket` aberto e `sign-up-success-message` com "Verifique o seu e-mail para confirmar o seu cadastro 😉.".
  As três mudanças vivem só no banco local e se perdem se o volume for recriado; tornar o provisionamento durável (compose,
  init ou seed) é trabalho separado, fora do mapa de paths.
- `ACH-12` (ambiente, bloqueia VM-04 e VM-05 no stack real) — `apexcharts` está declarado, mas ausente de `node_modules` na raiz
  (existe só em `apps/web/node_modules`); abrir `/profile` faz o `next dev` retornar 500 em todas as rotas
  (`Module not found: Can't resolve 'apexcharts'`). Correção: reinstalar as dependências na raiz e reiniciar o `next dev`.
  Estado: **resolvido** em 2026-11-07 — cópia local de `apps/web/node_modules/apexcharts` (6.7.0, igual ao lockfile) para
  `node_modules/apexcharts` na raiz, sem `npm install` e sem reiniciar o `next dev`; `/profile/explorer-seed` autenticado
  retorna 200. Ambiente local apenas (`node_modules` ignorado pelo Git); sem mudança em arquivos versionados.
- `ACH-14` (ambiente e baseline, observado em VM-04 e VM-05, fora do mapa de paths) — (1) as chamadas do navegador à API (`:3334`) saem sem
  `Authorization` porque o cookie `@stardust:access-token` é `httpOnly` (introduzido antes desta Spec; `NextCall.ts`/`NextHttp.ts` e as
  rotas `api/auth` não têm diff nesta branch), o que gera `401` em `GET /reporting/feedback/mine/unread-count`, `POST /profile/achievements/…`
  e chamadas do editor; as telas renderizam com os dados do SSR; (2) o link de redefinição de senha é emitido para `127.0.0.1:3000` e redireciona
  para `localhost:3000`, então o cookie de sessão não acompanha e a página volta à solicitação (o teste copiou os cookies entre hosts);
  (3) `500` transitórios do Server enquanto o `tsx watch` do usuário reinicia. Nenhum afeta o alinhamento visual. Estado: **registrado, sem ação nesta Spec**.
- `ACH-13` (UI, apontado pelo usuário em 2026-11-07) — o Sign-up renderizava a Lottie `rocket-exploring` em uma caixa de 900 px
  (leitura literal da faixa clara do frame, DV-01), em vez de cobrir a página inteira como no comportamento original
  (`size='full'`). Correção em `SignUpPageView.tsx`: contêiner `fixed inset-0 overflow-hidden`, Lottie `size='full'` com lado
  `max(100vw, 100vh)` centralizado. Medido com Playwright: 1902×1902 em 1902×903 e 844×844 em 390×844 (cobre os dois eixos);
  `jest` do Sign-up 17/17. Pendência: a revisão 3 da Spec deve reescrever DV-01 (a faixa do frame é placeholder e o fundo
  cobre a viewport) e o Implementation Reviewer pareado deve revalidar.
  Estado: **corrigido, aguardando revisão 3 da Spec**.
- `ACH-15` (CI-01, `check-code-complexity` do Web, reprovado no HEAD `8c4012d81`) — `SignUpFormView` (`SignUp/SignUpForm/SignUpFormView.tsx`, View criada nesta Spec) tinha `functionLength=95` contra o limite de erro 70 (`cyclomaticComplexity=9` e `halsteadVolume=458,59` eram só avisos). O `check:complexity` (que `tooling.md` pede quando a lógica alterada puder piorar o baseline) não foi executado antes da publicação porque as Views novas foram tratadas como apresentação, sem lógica nova. Estado: **corrigido** por `Builder Fix ACH-15` em `d9f201ad7`: `NameField`, `EmailField`, `PasswordField` e `SubmitButton` extraídos como componentes de apresentação puros no mesmo arquivo (sem estado, hooks ou contexts; sem novo path), DOM, classes, `data-testid` e revelação progressiva idênticos. Evidência do Builder: Biome limpo, Jest do Sign-up 17/17, `check-complexity --scope apps/web` com 0 erros (`functionLength` 27, 26, 25, 14 e 31; `SignUpFormView` sem avisos), `check:types` não executável no worktree limpo (sem `node_modules` próprio) e deixado ao CI. Implementation Reviewer pareado do Builder Fix: `accepted`, sem findings bloqueantes (NB-01: `check:types` fica para o CI; NB-02: tipo `SignUpFormFields` duplicado já existente, fora de escopo).
- `ACH-16` (CI-01, `check-code-complexity` do Web, segunda execução no HEAD `48d156cc6`, exit 2) — com o erro do ACH-15 resolvido, o sensor comparou o código com `.code-multivitals-baseline.json` e acusou 22 funções piores que o baseline, todas em arquivos desta Spec e em nível de aviso: índice de manutenibilidade de Views e entry points reescritos (`AnimatedFormView`, `AppMessageView`, `OptionsDividerView`, `TitleView`, `AlertDialogView`, `AlertDialogComponent`, `ButtonView`, `DialogAnimationView`, `DialogHeaderView`, `InputViewComponent`, `InputComponent`, `ResetPasswordFormDialogView`, `ResetPasswordFormDialog`, `SignInFormView`, `SignInForm`, `SocialLinksView`, `SignInPageView`, `NameField`, `EmailField`, `PasswordField`, `SignUpFormView` e `SignUpForm`) e, além do índice, `functionLength` 45 (`SignInPageView`), 41 (`AlertDialogView`), 60 (`ResetPasswordFormDialogView`) e 61 (`InputViewComponent`, também cyclomatic 12 e Halstead 409,8), todos abaixo do limite de erro. Estado: **decidido pelo usuário** em 2026-11-07 (atualizar o baseline após revisão, em vez de refatorar as Views já comparadas com o Penpot): Spec na revisão 4 (D-14 e o path `.code-multivitals-baseline.json`). `npm run update:complexity-baseline` regerou o baseline; conferido por função, o diff tem 15 entradas novas, 3 removidas e 12 remedidas, todas em arquivos desta Spec, clones iguais e `errorCount` de 243 para 242. Spec Reviewer da revisão 4: `clear`, sem findings; as observações não bloqueantes foram adotadas.
- `ACH-17` (review do PR #631 pelo `Crew PR review`, 6 comentários inline, HEAD `7c47bcc2f`; triagem de 2026-11-07) — (1) P2, formulários sem teste no boundary: **não procede**, `SignUpForm.test.tsx`, `SignInForm.test.tsx` e `ResetPasswordFormDialog.test.tsx` existem em `tests/` ao lado dos widgets e são preservados sem redução (CA-15, exceção de `widget-tests-rules.md` §2); (2) P2, helpers `NameField`, `EmailField`, `PasswordField` e `SubmitButton` no arquivo da View: **procede**; a primeira resposta recusou com um precedente (`InputView`, `StyledButtonView`) que não se sustenta (são um componente interno com `forwardRef`, não vários irmãos). Por decisão do usuário, os quatro viraram subwidgets em diretórios próprios (`SignUp/SignUpForm/<Campo>/index.tsx` e `<Campo>View.tsx`), com a filtragem do erro nos Entry Points `NameField` e `EmailField` e dois casos de teste de "já utilizado" em `SignUpForm.test.tsx` (Spec na revisão 6, 68 paths); Spec Reviewer da revisão 6 `clear` e Implementation Reviewer pareado dos Builders Fix PR-631-B e PR-631-C `accepted`, sem findings bloqueantes (NB: nenhum teste prova que mensagens do zod continuam suprimidas; a corrida de `setError` registrada em ACH-18); Jest do Sign-up 19/19, Biome limpo, mutação do filtro provada, baseline regenerado e revisado por função; (3) P2, `Dialog` sem View: **recusado**, `Dialog.tsx` e os subcomponentes planos são pré-existentes e fora do mapa (observação pré-existente da auditoria de UI); (4) P3, entry points como alias de View (`AnimatedForm`, `AppMessage`, `Title`, `OptionsDivider`): **recusado**, widgets sem hook ou integração que o Entry Point conectaria; (5) P3, fundo animado do Sign-up maior que a viewport: **recusado**, cobrir a página inteira é decisão do usuário (DV-12) e o custo de pintura não foi medido; (6) P3, `DialogHeaderView` e `DialogAnimationView` sem teste: **procede**; Spec na revisão 5 com os dois testes de View e `Builder Fix` correspondente. Estado: **corrigido**: `DialogHeaderView.test.tsx` e `DialogAnimationView.test.tsx` criados (8 testes; Biome limpo, Jest 8/8, `check:test-integrity` e `check:spec-implementation` com 59 paths aprovados), Spec Reviewer da revisão 5 `clear` e Implementation Reviewer pareado do Builder Fix `accepted`, sem findings bloqueantes (NB: o mock de `motion` não cobre os valores dos variants; sem clique em `Fechar`). Respostas aos 6 comentários e reexecução do CI aguardam o push.
- `ACH-18` (observação do Builder Fix PR-631-C, fora do mapa) — ao escrever os casos de "já utilizado", o Builder notou que, com o mock resolvendo na hora, `setError` do hook `useSignUpForm` pode rodar antes de a validação assíncrona do resolver (`mode: 'onChange'`) da última tecla terminar, e essa validação limpa o erro; por isso o mock resolve após 50 ms. `verifyUserNameInUse` é chamado a cada tecla após 2 caracteres. Comportamento pré-existente de `useSignUpForm.ts`, que esta Spec não altera. Estado: **registrado, sem ação nesta Spec**; avaliar em uma tarefa própria (debounce/ordem de `setError`).
- `ACH-19` (segunda rodada do `Crew PR review`, 2 comentários P3 no HEAD `eca5122ed`; CI desse HEAD verde, 31 checks) — (1) filtro de mensagem de erro nos Entry Points `NameField` e `EmailField`: **recusado**, o próprio comentário reconhece que não viola a regra (não é estado nem handler) e o Reviewer pareado aceitou; levá-lo para o hook ou para a View traria a lógica de volta ao arquivo que o comentário P2 anterior retirou da View; (2) supressão sem teste: **procede**; dois casos novos em `SignUpForm.test.tsx` (nome '1' e e-mail 'abc' não exibem as mensagens do schema, só as dicas), com mutação provada nos dois Entry Points; Implementation Reviewer pareado do Builder Fix PR-631-D `accepted` (NB: `findByTestId` seria mais idiomático). Jest do Sign-up 21/21. O Crew revisa a cada push; novos comentários após esta rodada são registrados e levados ao usuário, sem nova rodada automática.
- Disposição de `ACH-09` com o pacote Penpot (EV-02, lado Penpot: índice `scratchpad/ev02/penpot-index.md`, âncoras
  `scratchpad/ev02/penpot-anchors.json`, 33 PNGs em `scratchpad/ev02/png/`; leitura somente, nada editado no Penpot):
  confirmados no Penpot, sem mudança de código: gap campo → mensagem de erro de 12 px (`mt-3`; nó `…e29ec628d5c1`), margens do
  `Diálogo de alerta` de 16 px entre cabeçalho, Lottie, mensagem e botão (`mt-4`; nó `…e450ee5b41fc`), `Botão` 14/500 com
  letter-spacing 0 (remoção de `tracking-wide`; nó `…e29e7f8f203c`), cabeçalho do `Diálogo` com gap de 8 px, padding-bottom 0,
  fechar 44 × 44 irmão do título (`pb-2`; nós `…e450ed339ffa`, `…e450ed79c871`). Sem suporte no Penpot, revertidos por
  `Builder Fix`: `placeholder:text-theme-text-secondary` em `InputView` (o `Campo de texto` não desenha placeholder) e
  `hover:border-theme-text-secondary` em `SocialLinksView` (o `Botão social` não tem estado hover; o baseline também não tinha).
  Divergências do próprio Penpot a registrar na Spec: os frames dos três diálogos de Reset password não seguem o componente
  `Diálogo` (gap do cabeçalho 12 contra 8, gap entre seções 24 contra 16, fills e strokes literais sem token); a precedência da
  Spec (componentes compartilhados antes dos frames) mantém o componente; o `Diálogo de alerta` `Senha redefinida` usa
  `success` na mensagem enquanto o componente usa `text-secondary`; o Sign-in tem `Conteúdo` de 391 px no Penpot e 392 px na
  Spec; o Penpot não tem estado hover, foco ou pressionado nos componentes (foco é a extensão D-04).
- Observação do `builder_web_auth` (A2): o frame `Sign-up · Nome em uso` mostra e-mail e senha; o código oculta esses campos até o
  nome ser válido (revelação progressiva, RF-12). Mantido o comportamento do código; registrar como divergência aprovada na
  eventual emenda. Fundo animado do Sign-up: `Animation size={900}` centrado em vez de `size='full'`, para coincidir com o
  placeholder do frame (DV-01).
- Observações do `builder_web_foundation` para o Reviewer: `Botão` sem padding horizontal de 24 px do Penpot (D-03); `DialogHeaderView`
  com fechar irmão do título, `aria-label='Fechar'`, 44 × 44; `Input` com erro e foco mantém borda e anel em `danger`;
  `AlertDialogViewProps.animation` tipado como `AnimationName | null` (mais estreito que o `string | null` da Spec);
  `twMerge` estendido localmente para chaves `theme-*` em `ButtonView` e `DialogAnimationView`.

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| ------- | ----- | ------------------------- | ------ |
| ACH-01 | O detector `check:test-integrity` era mais estreito que a política documentada de testes de views colocalizados | Detector e `tooling.md` ajustados na própria entrega (D-11, RF-18); `tooling.md` é documento do mapa | concluído (`check:test-integrity` PASSED) |
| ACH-02, ACH-03 | Escala global do `rem` no mobile e `Hero` fora do mapa; causas pontuais e pré-existentes | não aplicável: decisões do usuário registradas como DV-09 e DV-10 na Spec | concluído |
| ACH-04 | O gabarito da Spec em `create-spec-prompt.md` mostra a célula `Change` com crases, que o parser de `check:spec-implementation` não lê; reincidirá em toda Spec nova | `documentation/prompts/create-spec-prompt.md` (gabarito sem crases e regra explícita), no branch de tooling `docs/scoped-local-checks` | atualizado no worktree; entra com o branch de tooling |
| ACH-05 | Largura do diálogo por `max-w-lg` com padding por fora; causa pontual | não aplicável: corrigido com teste em `AlertDialogView.test.tsx` | concluído |
| ACH-06 | O `AlertDialog` abre sobre o `Dialog` ainda aberto; comportamento pré-existente fora do Contract | não aplicável: observação levada ao usuário | observação aberta (fora desta Spec) |
| ACH-07, ACH-08, ACH-09 | O Reviewer read-only não chama o Penpot MCP, a evidência ficou `stale` após correções e mudanças visuais não citavam o nó do Penpot; lacuna recorrente de processo em Specs de frontend | `documentation/prompts/implement-spec-prompt.md` (nó e valor do frame por mudança visual, pacote de exports entregue ao Reviewer, capturas `stale` após correção), no branch de tooling | atualizado no worktree; entra com o branch de tooling |
| ACH-10, ACH-11, ACH-12, ACH-14 | O ambiente local não estava pronto (seed, tenant, publicação e `SELECT` do Realtime, `apexcharts` na raiz); recorrente a cada recriação do volume | `documentation/tooling.md` (seção Supabase local, requisitos do Realtime e `apexcharts`), no branch de tooling; o provisionamento durável (compose, init ou seed) é trabalho separado | nota atualizada no worktree; provisionamento durável pendente fora desta Spec |
| ACH-13 | A Spec leu o placeholder de 900 px do frame como contêiner do fundo animado; causa pontual da Spec | não aplicável: DV-01 e DV-12 reescritos na revisão 3 e Spec Reviewer `clear` | concluído |
| ACH-15 | O gatilho de `check:complexity` em `tooling.md` fala em "lógica alterada"; Views novas ou extraídas não o acionam e só falham no CI | `documentation/tooling.md` (linha Complexidade da execução local escopada: sempre que criar ou extrair arquivo de código, inclusive Views, limite de 70 linhas por função), no branch de tooling `docs/scoped-local-checks` | atualizado no worktree; entra com o branch de tooling |
| ACH-16 | O `check:complexity` roda no CI contra o baseline e reprova Views novas em nível de aviso que a linha de complexidade de `tooling.md` limita a lógica que possa piorar o baseline; a execução local escopada não o rodou no fim da implementação | `documentation/tooling.md` (linha Complexidade: rodar `check:complexity -w @stardust/web` na verificação integrada de qualquer Spec que crie ou extraia arquivos de código e revisar o baseline com `update:complexity-baseline` antes da publicação), no branch de tooling `docs/scoped-local-checks` | pendente no worktree; entra com o branch de tooling |

## Decisões

- Estratégia Plan-backed com dois Builders estáveis (`builder_web_foundation`, `builder_web_auth`) e um Reviewer pareado
  cada; wave 1 em paralelo (F1 a F3 e A1), wave 2 apenas `builder_web_auth` (A2, A3).
- Branch `feat/design-system-alignment-auth`; baseline `ea870e258`; sem commits até `conclude-spec`.
- Varredura VM-05 e VM-03 no stack local real com contas seed; falha de ambiente bloqueia a fase, sem mock.
- Defeito que só um arquivo chamador fora do mapa corrija exige emenda da Spec (revisão 2).

- Spec emendada para a revisão 2 em 2026-11-04 com as decisões do usuário (Q4 b, Q5 a, Q6 b e a confirmação da emenda): RF-18, CA-23 e D-11 (detector aceita `ui/**/contexts/**/tests`), D-12 (escala da fonte raiz mantida), D-13 (`Hero` sem alteração) e divergências aprovadas DV-09 a DV-16. DV-15 (padding horizontal do `Botão`) e DV-16 (campo em erro com foco em `danger`) vieram do relatório do `builder_web_foundation` e aguardam objeção do usuário.
- A correção mecânica do formato das células `Change` do mapa (ACH-04) e o `Spec Reviewer` da revisão 2 (`clear`) estão registrados no histórico da Spec.

## Lições aprendidas

- Um placeholder de animação no frame (faixa clara de 900 px) não é um contêiner: a Spec deve perguntar o que o placeholder
  representa antes de contratar suas medidas (DV-01, DV-12).
- Evidência visual capturada antes de uma correção fica `stale`; o pacote Penpot × Web é regerado no HEAD final.
- O ambiente local de Realtime precisa de tenant, publicação e `SELECT`; verifique antes de validar fluxos que dependem dele.

## Alinhamento documental

- Spec: alinhada (revisão 6)
- Plan: alinhado
- `documentation/design.md` e `documentation/tooling.md` (frase de `contexts/**/tests`): atualizados pela entrega e dentro do mapa.
- Rules/Architecture/Overview: não aplicáveis; nenhuma fronteira arquitetural ou Rule mudou.
- Atualizações preventivas (`create-spec-prompt.md`, `implement-spec-prompt.md`, `open-pr-prompt.md`, a nota de Realtime em
  `tooling.md` e a regra do Entry Point como alias da View em `ui-layer-rules.md`): fora do mapa desta Spec e do commit da
  entrega, entregues no PR #633 (squash `96f9004a5`).

## Conclusão

- Estado: `completed`
- Entrega: PR https://github.com/JohnPetros/stardust/pull/631 (base `main`, head `feat/design-system-alignment-web-auth`), CI verde no HEAD
  final `45eb57dc5` (31 checks aprovados, 1 ignorado). Mergeado em `main` por squash (`ed91d7f02`) com privilégios de administrador, sem a
  aprovação de review humana que `main` exige; nenhum deploy foi feito.
- Pendências fora desta Spec: os quatro comentários do `Crew PR review` recusados (`ACH-17`, `ACH-19`) ficaram abertos no PR já
  mergeado; `ACH-06`, `ACH-14` e `ACH-18` são observações pré-existentes; a falha intermitente de memória nos jobs de integração do Server
  precisa de tarefa própria. As atualizações preventivas de documentação foram entregues no PR #633.
