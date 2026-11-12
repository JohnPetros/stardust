---
title: Aviso de e-mail não confirmado e reenvio do link no sign-in
status: in_progress
revision: 3
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/646
  - type: prd
    ref: documentation/prds/auth/sign-in.md
    revision: last_updated_at 2026-11-11 (emenda de RP-01 e JN-01 aprovada nesta task, Q1/Q8)
    requirements: [RP-01]
    journeys: [JN-01]
  - type: prd
    ref: documentation/prds/auth/sign-up.md
    revision: last_updated_at 2026-06-17
    requirements: [RP-06]
  - type: direct-request
    ref: Decisões de grilling (Q1–Q12) e revisão de design em cinco seções confirmadas nesta task
scope:
  - apps/server/src/rest/services
  - apps/server/src/rest/controllers/auth
  - apps/server/src/tests/fixtures
  - apps/server/src/tests/routes/auth
  - apps/web/src/rpc/actions/auth
  - apps/web/src/ui/auth/contexts/AuthContext
  - apps/web/src/ui/auth/widgets/pages/SignIn
  - apps/web/src/app/tests/auth
  - apps/web/src/ui/global/styles
  - apps/web/tailwind.config.js
  - documentation/prds/auth/sign-in.md
  - documentation/design.md
last_updated_at: 2026-11-12
---

# Context and scope

A Issue #646 (milestone #20 "Sign In") relata que uma pessoa que se cadastra por e-mail e senha,
sai antes de confirmar o e-mail e tenta entrar recebe "E-mail ou senha incorretos", e passa a
achar que errou as credenciais. A entrega faz o sign-in informar que falta confirmar o e-mail e
permite reenviar o link na própria página, sem sessão.

**Autoridade de produto.** `documentation/prds/auth/sign-in.md` (RP-01 e JN-01) foi emendado
nesta task, com aprovação explícita do usuário (Q8), para incluir as regras "Conta não
confirmada", "Sigilo do estado da conta", "Reenvio sem sessão", "Limite de reenvio", "Aviso
inline de confirmação", "Feedback de reenvio" e o ramo "Conta não confirmada" de JN-01.
`documentation/prds/auth/sign-up.md` RP-06 (reenvio com loading e feedback) é a referência
complementar do padrão de reenvio.

**Estado atual verificado:**

- `SupabaseAuthService.signIn` (`apps/server/src/rest/services/SupabaseAuthService.ts`) mapeia
  qualquer erro do GoTrue para `401 "E-mail ou senha incorretos"`.
- O GoTrue local (`public.ecr.aws/supabase/gotrue:v2.193.0`, `GOTRUE_MAILER_AUTOCONFIRM=false`)
  só retorna `email_not_confirmed` depois de validar a senha (`internal/api/token.go`: a
  checagem `!user.IsConfirmed()` ocorre após `invalid_credentials`). Senha errada ou e-mail
  inexistente produzem `invalid_credentials`, para conta confirmada ou não.
- `POST /auth/resend-email/sign-up` já existe, é público, valida `emailOnlySchema` e chama
  `SupabaseAuthService.resendSignUpEmail`, que mapeia qualquer erro para
  `500 "Erro inesperado ao reenviar e-mail de cadastro"`. O GoTrue retorna `429`
  `over_email_send_rate_limit` quando o último envio ocorreu há menos de `SMTP.MaxFrequency`
  (padrão `1m` em `ApplyDefaults`; não configurado no `docker-compose.yml`) e
  `over_request_rate_limit` no limite por IP.
- No Web, o login passa pela Server Action `authActions.signIn` → `SignInAction` →
  `response.throwError()`; `actionClient.handleServerError` reduz o erro a uma string, então a UI
  não distingue tipos de falha. `AuthContext.handleSignIn` retorna `boolean` e mostra
  `toast.showError(message, 10)` em qualquer falha; seu único consumidor é a página SignIn.
- O reenvio no Web já existe no SignUp: `authService.resendSignUpEmail(Email)` via `RestContext`,
  `Button isLoading` e toasts (`useSignUpPage.ts`).
- O link de confirmação já termina em `/auth/account-confirmation`
  (`apps/web/src/app/api/auth/confirm-email/route.ts` → `ConfirmEmailController`).

**Escopo:** Server (mapeamento de erros no adapter REST, preservação do contrato de
`/auth/sign-in/god`, fixtures e testes), Web (Action RPC, AuthContext, página SignIn e novo widget
de aviso, testes de widget, action e jornada), o token semântico `reward-surface` do aviso (CSS
variable, Tailwind e `design.md`, D-15) e a emenda do PRD. Core, `packages/validation`,
banco, migrations, rotas registradas e payloads de request permanecem inalterados; o port
`AuthService` do Core não muda.

**Consumidores do adapter afetados:** `SupabaseAuthService.signIn` também atende
`POST /auth/sign-in/god` (`SignInGodAccountController`, consumido pelo Backoffice em
`apps/backoffice/src/rest/services/AuthService.ts`), cujo contrato é preservado em `401` (D-11).
`SupabaseAuthService.resendSignUpEmail` também atende a página SignUp (`useSignUpPage`), que já
exibe `response.errorMessage` em toast e passa a mostrar a mensagem de limite sem mudança de código
(D-12).

**Fora de escopo (Issue #646):** login social; troca de e-mail; endpoint novo de reenvio ou
exigência de senha para reenviar; cooldown visível; redirecionar o usuário não confirmado para
`/auth/account-confirmation` (exige sessão); correção dos rótulos do frame mobile original do
sign-in (`Continuar`, `Criar conta` duplicado).

**Modo:** completo e conciso. Há risco de segurança (enumeração de contas) e um contrato cross-app
(status do Server → Server Action do Web → UI), sem persistência própria nem migration.

# Implementation Contract

## Requisitos funcionais

| RF | Requisito | Origem |
| --- | --- | --- |
| RF-01 | `POST /auth/sign-in` com e-mail e senha corretos de conta não confirmada responde `403` com a mensagem "Confirme seu e-mail antes de entrar", sem sessão nem tokens. Senha incorreta (conta confirmada ou não) e e-mail inexistente continuam recebendo o mesmo `401 "E-mail ou senha incorretos"`. Conta confirmada com credenciais corretas continua recebendo `201` com a sessão. | RP-01 (Conta não confirmada; Sigilo do estado da conta); Q2 |
| RF-02 | `POST /auth/resend-email/sign-up` responde `429` com "Aguarde alguns instantes antes de reenviar o e-mail" quando o GoTrue limita o envio (`over_email_send_rate_limit` ou `over_request_rate_limit`); sucesso e demais falhas permanecem como hoje. | RP-01 (Limite de reenvio); Q7 |
| RF-03 | No Web, `SignInAction` traduz o `403` do sign-in em um resultado tipado sem definir cookies, e `AuthContext.handleSignIn` retorna `'signed-in'`, `'email-not-confirmed'` ou `'failed'`. Conta não confirmada não gera toast nem conta autenticada; falha genérica mantém o toast atual. | RP-01; JN-01; Q3, Q5 |
| RF-04 | A página `/auth/sign-in` exibe, dentro do formulário entre os campos e "Entrar", o aviso "Confirme seu e-mail para entrar" com o texto "Enviamos um link de confirmação para {e-mail submetido}. Ele expira em 1 hora." e a ação "Reenviar e-mail de confirmação". O aviso é limpo no início da próxima submissão e substituído conforme o novo resultado. | RP-01 (Aviso inline de confirmação); JN-01; Q4, Q6, Q9 |
| RF-05 | A ação de reenvio, sem sessão, chama o endpoint público existente com o e-mail rejeitado, mostra loading no botão e termina com o toast de sucesso "Reenviamos para você o e-mail de confirmação" ou com o toast de erro contendo a mensagem recebida. O botão não submete o formulário. | RP-01 (Reenvio sem sessão; Feedback de reenvio); sign-up RP-06 |
| RF-06 | O link do novo e-mail confirma a conta pelo fluxo existente e leva a `/auth/account-confirmation`; depois disso, o login com as mesmas credenciais funciona normalmente. | RP-01 (Reenvio sem sessão); JN-01 |
| RF-07 | O aviso segue os frames Penpot de desktop e mobile, com foco por teclado e rótulos acessíveis. | RP-01 (Aviso inline de confirmação); Issue #646 |
| RF-08 | `POST /auth/sign-in/god` (Backoffice) mantém o contrato atual: conta não confirmada com senha correta continua recebendo `401 "E-mail ou senha incorretos"`. | Fora de escopo da Issue (Backoffice); Q11 |

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | Uma conta criada no Supabase Auth local e não confirmada | `POST /auth/sign-in` com o e-mail e a senha corretos | Status `403`; corpo com `message` "Confirme seu e-mail antes de entrar"; corpo sem `accessToken`, `refreshToken` ou `account` | AV-01 |
| CA-02 | RF-01 | Uma conta não confirmada, uma conta confirmada e um e-mail sem conta | `POST /auth/sign-in` com senha incorreta nas duas contas e com o e-mail inexistente | As três respostas têm status `401` e o mesmo `message` "E-mail ou senha incorretos" | AV-01 |
| CA-03 | RF-01 | Uma conta confirmada | `POST /auth/sign-in` com credenciais corretas; e um body com e-mail inválido | Credenciais corretas → `201` com `account.email` igual ao enviado e tokens presentes; body inválido → `400` | AV-01 |
| CA-04 | RF-02 | Uma conta não confirmada cujo `auth.users.confirmation_sent_at` foi recuado 2 minutos | `POST /auth/resend-email/sign-up` com o e-mail da conta | Status `200`; `confirmation_sent_at` lido do banco é posterior ao valor recuado | AV-02 |
| CA-05 | RF-02 | Uma conta não confirmada recém-criada (envio há menos de 1 minuto) | `POST /auth/resend-email/sign-up` com o e-mail; e um body com e-mail inválido | Envio recente → `429` com `message` "Aguarde alguns instantes antes de reenviar o e-mail"; body inválido → `400` | AV-02 |
| CA-06 | RF-03 | `AuthService.signIn` mockado | `SignInAction.handle` executa com resposta `403`, `201` e `401` | `403` → retorna `{ isEmailConfirmed: false }` sem chamar `call.setCookie`; `201` → define os cookies de access e refresh token e retorna `{ isEmailConfirmed: true, account }`; `401` → lança `AuthError` com a mensagem recebida | AV-03 |
| CA-07 | RF-03, RF-04 | `/auth/sign-in` com `ServerMock` respondendo `POST /auth/sign-in` com `403` | O usuário envia credenciais válidas | A URL permanece `/auth/sign-in`; o aviso `unconfirmed-email-notice` fica visível com o título e o e-mail submetido; nenhum toast aparece (`data-testid="toast-progress-bar"` ausente) | AV-06, MV-01 |
| CA-08 | RF-03 | `/auth/sign-in` com `ServerMock` respondendo `POST /auth/sign-in` com `401` | O usuário envia credenciais válidas | A URL permanece `/auth/sign-in`; o toast de erro aparece (`data-testid="toast-progress-bar"` visível); o aviso `unconfirmed-email-notice` não existe | AV-06 |
| CA-09 | RF-04 | `useSignInPage` com `handleSignIn` mockado | `handleFormSubmit` recebe `'email-not-confirmed'`, depois uma nova submissão começa e recebe `'failed'` | `unconfirmedEmail` passa a ser o e-mail submetido, sem foguete nem navegação; na nova submissão é limpo antes da chamada e permanece `null`; `'signed-in'` mantém o fluxo de foguete e navegação | AV-04 |
| CA-10 | RF-04 | `SignInForm` e `UnconfirmedEmailNoticeView` renderizados | `unconfirmedEmail`/`email` definido ou `null` | Com e-mail, o aviso aparece entre o campo de senha e o botão "Entrar", com título, texto contendo o e-mail e "Ele expira em 1 hora.", `role="status"`, `aria-live="polite"` e o contêiner com as classes `bg-theme-reward-surface` e `border-theme-reward`; com `null`, o aviso não existe; `SignInPageView` repassa as três props ao formulário | AV-05 |
| CA-11 | RF-05 | `useSignInPage` com `authService` mockado e `unconfirmedEmail` definido | `handleResendEmail` executa com resposta de sucesso, de `429` e de `500` | `resendSignUpEmail` recebe `Email` com o e-mail rejeitado; `isResendingEmail` fica `true` durante a chamada e `false` ao final; sucesso → `toast.showSuccess("Reenviamos para você o e-mail de confirmação", 10)`; falhas → `toast.showError(errorMessage, 5)`; sem `unconfirmedEmail`, nenhuma chamada | AV-04 |
| CA-12 | RF-05 | O aviso renderizado | O usuário clica em "Reenviar e-mail de confirmação"; e o aviso com `isResending` verdadeiro | O clique chama `onResend` e não chama `onSubmit` do formulário; com loading, o botão fica desabilitado e mostra o `Loading`; o nome acessível do botão é "Reenviar e-mail de confirmação" | AV-05 |
| CA-13 | RF-05 | `/auth/sign-in` com o aviso visível via `ServerMock` | O usuário clica no reenvio com `POST /auth/resend-email/sign-up` respondendo `200` e, em outro cenário, `429` | `200` → toast de sucesso "Reenviamos para você o e-mail de confirmação"; `429` → toast com "Aguarde alguns instantes antes de reenviar o e-mail"; a request é enviada com o e-mail submetido | AV-06 |
| CA-14 | RF-06 | Stack local real e uma conta recém-cadastrada não confirmada | O usuário tenta entrar, aguarda mais de 60 s, reenvia, abre o link mais recente do Mailpit e entra de novo | `POST /auth/sign-in` `403` e aviso visível; `POST /auth/resend-email/sign-up` `200` e nova mensagem no Mailpit; o link leva a `/auth/account-confirmation`; o novo login responde `201`, `GET /auth/account` `200` e a URL final é `/space` | MV-01 |
| CA-15 | RF-07 | Viewport 1440×900 com o aviso visível (MV-01, passo 2) | A captura Playwright é comparada ao export atual do frame desktop | Posição, tokens, tipografia, botão contornado, espaçamentos e textos do aviso coincidem com o frame, exceto os desvios permitidos do Design Contract | VV-01 |
| CA-16 | RF-07 | Viewport 390×844 com o aviso visível | A captura é comparada ao frame mobile e a página é percorrida com Tab | Mesmas propriedades de CA-15 no frame mobile; ordem de foco Senha → "Reenviar e-mail de confirmação" → "Entrar", com `focus-visible` perceptível; sem scroll horizontal | VV-02 |
| CA-17 | RF-08 | `AuthService.signIn` mockado retornando `403` | `SignInGodAccountController.handle` executa | Rejeita com `AuthError` cuja mensagem é "E-mail ou senha incorretos" (servido como `401` pelo `HonoApp`), sem consultar `ENV.godAccountIds`; os casos existentes (God válido e conta não God) continuam passando | AV-08 |

## Design Contract

**Fonte canônica:** arquivo Penpot `stardust`, board `Autenticação · Sign-in`.

| Superfície / rota | Estado / viewport | Página / board / componentes do Penpot | CA / VV | Desvios permitidos |
| --- | --- | --- | --- | --- |
| `/auth/sign-in` | Aviso de e-mail não confirmado visível, reenvio ocioso; desktop 1440×900 | Página `🖥️ Desktop`, frame `Autenticação / Desktop / Sign-in · E-mail não confirmado`; componente `Aviso · E-mail não confirmado` (filhos `Título do aviso`, `Texto do aviso`, `Reenviar e-mail`) dentro de `form`, entre `Campos` e `Entrar` | CA-10, CA-15 / VV-01 | Hero: o placeholder `Ilustração` é substituído pelo `AnimatedHero` existente; altura do aviso 154 px contra 152 px do frame, porque o `border` CSS de 1 px entra na altura e o stroke do Penpot não |
| `/auth/sign-in` | Mesmo estado; mobile 390×844 | Página `📱 Mobile`, frame `Autenticação / Mobile / Sign-in · E-mail não confirmado`; mesmo componente | CA-10, CA-16 / VV-02 | Rótulos do frame mobile original do sign-in fora de escopo; a escala de `rem` global do app reduz a tipografia do aviso e sua altura em relação ao frame (comportamento global, sem override local) |

**Mapeamento para tokens e primitivos existentes:**

- fill do aviso `color.yellow.900` (`#443102`, primitivo do Penpot) → token novo `theme-reward-surface`
  (`bg-theme-reward-surface`, D-15); stroke `color.reward` → `theme-reward`; título
  `color.text-primary`; texto `color.text-secondary`; stroke do botão `color.border`. O único token
  novo é `reward-surface`; nenhuma outra cor ou medida é criada e a paleta Tailwind `yellow-900`
  (`#1c1400`, usada como `text-yellow-900` em `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx`) não é alterada nem usada pelo aviso.
- O botão reutiliza o primitivo `Button` (`apps/web/src/ui/global/widgets/components/Button`) com
  overrides de `className` (fundo transparente, borda e texto primário), que o `twMerge` do
  `ButtonView` já suporta. Não há variante nova do primitivo nem CSS fora de Tailwind.

**Estados sem frame canônico e precedência:** loading do reenvio usa o `Loading` do próprio
`Button` (mesmo padrão do SignUp); sucesso e erro do reenvio e erro de credenciais usam o `Toast`
existente. A UI fora do aviso (cabeçalho, links sociais, divisor, campos, "Entrar", links
auxiliares e hero) é preservada sem alteração.

**Acessibilidade:** o aviso usa `role="status"` e `aria-live="polite"`; o botão é nativo
(`type="button"`), alcançável por Tab depois do campo de senha, com nome acessível "Reenviar
e-mail de confirmação" e o `focus-visible` do primitivo; fica desabilitado durante o loading.

**Matriz de auditoria estrutural de UI:**

| Widget / unidade | Entry Point | View | Hook | Regra aplicável |
| --- | --- | --- | --- | --- |
| `SignInPage` | `SignIn/index.tsx` (Modify: resolve `useRestContext().authService` e repassa ao hook; repassa as novas props à View) | `SignInPageView.tsx` (Modify: só repassa props ao `SignInForm`) | `useSignInPage.ts` (Modify) | UI Rules (dependências no Entry Point; View só renderiza). Desvio pré-existente aceito: `useSignInPage` já chama `useToastContext()`, `useNavigationProvider()` e `useSleep()` diretamente; esta entrega não amplia o desvio (D-07) |
| `SignInForm` | `SignInForm/index.tsx` (Modify: repassa as props do aviso) | `SignInFormView.tsx` (Modify: renderiza o aviso entre os campos e o botão) | `useSignInForm.ts` (inalterado) | Widget Tests Rules, seção 2 (formulário testado pelo widget inteiro) |
| `UnconfirmedEmailNotice` | `SignInForm/UnconfirmedEmailNotice/index.tsx` (Create: alias `export const UnconfirmedEmailNotice = UnconfirmedEmailNoticeView`) | `UnconfirmedEmailNoticeView.tsx` (Create) | Não há Hook (sem estado) | UI Rules ("Entry Point como alias da View"; diretório próprio) |
| `AuthContextProvider` | `AuthContext/index.tsx` (inalterado) | Não há View (context) | `hooks/useAuthContextProvider.ts` e `hooks/useSignInAction.ts` (Modify) | UI Rules; teste dedicado de `*Provider` proibido por `check-test-integrity.mjs` (D-06) |

# Technical Contract

## Decisões técnicas

| Decisão | Escolha | Alternativas descartadas | Motivo e impacto |
| --- | --- | --- | --- |
| D-01 (Q1, Q8) | Emendar `sign-in.md` (RP-01 e JN-01) antes da Spec, com o texto aprovado pelo usuário | Registrar a regra só na Spec | `sdd.md` exige atualizar a autoridade de produto antes do Contract; preserva a rastreabilidade `RP → RF`. |
| D-02 (Q2) | `403 Forbidden` + "Confirme seu e-mail antes de entrar", detectado por `error.code === 'email_not_confirmed'` no adapter | `401` com mensagem diferente | O status é o discriminador estável; a mensagem é só para pessoas. Não revela estado de conta porque o GoTrue só emite o código após validar a senha. No contrato de `/auth/sign-in`, `403` significa exclusivamente conta não confirmada. |
| D-03 (Q3) | `SignInAction` retorna `SignInActionResponse` (`{ isEmailConfirmed: false }` no `403`) e `handleSignIn` retorna `SignInResult` | `serverError` estruturado no `actionClient` global; comparar a mensagem no cliente | Menor raio de impacto: só o caminho do sign-in muda; o `actionClient` e as demais Server Actions ficam intactos; não acopla a UI ao texto do Server. Exceção consciente a `rpc-layer-rules.md` ("erros de domínio são propagados como `AppError` e tratados pelo `actionClient`"): conta não confirmada é modelada como resultado esperado do login, não como erro; todas as demais falhas continuam em `response.throwError()`. |
| D-04 (Q4) | Manter "Ele expira em 1 hora." do frame | Remover a frase; texto neutro | O usuário confirmou que a expiração de OTP de e-mail em produção é 1 hora. O GoTrue local usa o padrão de 24 h, o que não afeta a cópia. |
| D-05 (Q5, Q6, Q9) | Aviso inline sem toast, limpo no início da próxima submissão, renderizado por um widget novo filho de `SignInForm`, com estado em `useSignInPage` | Aviso + toast; limpar ao editar o e-mail; aviso fora do `<form>` em `SignInPageView` | Fiel ao frame (o aviso é filho de `form`, entre `Campos` e `Entrar`); o reenvio sempre usa o e-mail efetivamente rejeitado; o formulário continua sem chamar services. |
| D-06 (Q10) | Sem teste dedicado de `useAuthContextProvider`; os três resultados de `handleSignIn` são provados pelo provider real na jornada Playwright (AV-06) | Extrair `useSignInHandler` para criar um teste de hook de context | `check-test-integrity.mjs` rejeita `*Provider.test.*` (`FORBIDDEN_TEST_SUBJECT_PATTERNS`); a jornada já exercita `201`, `401` e `403` pelo provider real, sem estrutura nova só para viabilizar um arquivo de teste. |
| D-07 (design, seção 2) | `useSignInPage` mantém as chamadas legadas a `useToastContext`, `useNavigationProvider` e `useSleep`; o reenvio usa o `toast` já existente; o `authService` novo entra por parâmetro | Mover toast e navegação para o Entry Point agora | Refactor fora da Issue; a dependência nova segue a regra (parâmetro), sem ampliar o desvio (o mesmo padrão existe em `useSignUpPage`). Resultado esperado na auditoria de UI do Evaluation para `SignInPage`: `passed` com o desvio pré-existente registrado. |
| D-08 (Q7) | `resendSignUpEmail` mapeia `over_email_send_rate_limit` e `over_request_rate_limit` para `429` + "Aguarde alguns instantes antes de reenviar o e-mail" | Manter o `500` genérico | Limite não é erro inesperado; a Issue pede que o limite seja exibido. Nenhuma rota, payload ou cooldown novo. |
| D-09 | `apps/server/rest-client/auth/auth.rest` permanece inalterado | Acrescentar exemplos | Já contém `### Sign in`, `### Sign in God account` e `### Resend sign up email` com os payloads atuais; nenhuma rota ou request muda. |
| D-10 (revisão rev. 1) | `SignInActionResponse` é exportado de `SignInAction.ts`, reexportado com `export type` pelo barrel `rpc/actions/auth/index.ts`, e os consumidores de UI usam somente `import type` | Arquivo próprio em `rpc/actions/auth/types/`; declarar o shape inline em cada hook | Nenhuma action exporta tipo hoje, então o padrão é novo e fica registrado. `import type` garante que o bundle do cliente não puxe actions pelo barrel; a factory continua sendo a exportação principal do arquivo. |
| D-11 (Q11) | `SignInGodAccountController` converte `403` do service em `AuthError('E-mail ou senha incorretos')` antes de `throwError()`, mantendo `/auth/sign-in/god` em `401` | Aceitar o `405` que `NotAllowedError` produziria no `HonoApp` | O Backoffice está fora do escopo da Issue e `405` ("Method Not Allowed") seria um status enganoso no contrato de outro app. |
| D-12 (revisão rev. 1) | A página SignUp é consumidora afetada do novo `429` de reenvio, sem mudança de código | Tratar o `429` só no SignIn | `useSignUpPage` já mostra `response.errorMessage`; passar a exibir "Aguarde alguns instantes antes de reenviar o e-mail" no limite é o efeito pretendido de Q7 nas duas páginas. |
| D-13 (revisão rev. 1) | O recuo e a leitura de `auth.users.confirmation_sent_at` ficam em `SupabaseFixture`, com a mesma guarda `ENV.mode === 'production'` de `setAuthMetadata` | `UPDATE` direto no arquivo de teste | `server-routes-testing-rules.md` centraliza preparação e leitura de estado em fixtures; a única escrita existente em `auth.users` já vive em `SupabaseFixture` com guarda. |
| D-14 (revisão rev. 1) | `useSignInAction` não recebe teste dedicado | Criar `AuthContext/hooks/tests/useSignInAction.test.ts` (local permitido) | A mudança no hook é só de tipo; o comportamento passa pela jornada AV-06 com o provider real. |
| D-15 (Q12, revisão 3) | Novo token semântico `reward-surface`: `--theme-reward-surface: #443102` no bloco `stardust-dark` de `global.css`, `'reward-surface'` em `theme.colors.theme` de `tailwind.config.js` (classe `bg-theme-reward-surface`) e a role listada em `documentation/design.md`; o aviso usa essa classe | Reutilizar o `yellow-900` da paleta Tailwind (`#1c1400`, difere do design); espelhar o primitivo (ex.: `refined-yellow-900`); literal `bg-[#443102]` | O Penpot liga o fill ao primitivo `color.yellow.900`, e o `Semantic/Dark` não tem role de superfície de recompensa, ao contrário de `selection-surface`, `success-surface` e `danger-surface`. O token segue o padrão `*-surface` e mantém o repositório só com tokens semânticos. É um token só do Web, sem contraparte em `Semantic/Dark`: o arquivo Penpot não entra no escopo e `design.md` registra a divergência. O `yellow-900` legado continua intacto para o MDX. |

## Conceitos novos

**`SignInActionResponse` (camada RPC do Web).** União discriminada exportada por
`apps/web/src/rpc/actions/auth/SignInAction.ts`:
`{ isEmailConfirmed: true; account: AccountDto } | { isEmailConfirmed: false }`. É o único
contrato pelo qual a Server Action comunica "conta não confirmada" ao cliente, já que o
`actionClient` reduz erros a texto. Produtor: `SignInAction`; consumidores: `useSignInAction` e
`useAuthContextProvider`. A fonte de verdade do estado de confirmação é o GoTrue, lido pelo
Server; o Web nunca o infere. O ramo `false` não carrega dados de conta nem define cookies.

**`SignInResult` (AuthContext do Web).** Tipo `'signed-in' | 'email-not-confirmed' | 'failed'`
em `AuthContext/types/SignInResult.ts`, retornado por `handleSignIn`. Substitui o `boolean`
anterior para que a página distinga a falha genérica (o provider já mostrou o toast) da conta não
confirmada (o provider não mostra nada e a página mostra o aviso). Exemplo: um `403` produz
`'email-not-confirmed'`, a conta do contexto continua `null` e `analyticsProvider.identifyUser`
não é chamado.

**Estado do aviso (`useSignInPage`).** `unconfirmedEmail: string | null` guarda o e-mail da última
tentativa recusada por falta de confirmação; `isResendingEmail: boolean` controla o loading do
reenvio. Ambos são estado local da página: somem ao recarregar, e `unconfirmedEmail` é limpo no
início de cada submissão. A direção é `useSignInPage` → `SignInPageView` → `SignInForm` →
`SignInFormView` → `UnconfirmedEmailNotice`, sem estado duplicado nos filhos.

## Expected file tree

```text
apps/server/
└── src/
    ├── rest/
    │   ├── controllers/auth/
    │   │   ├── SignInController.ts                                  (unchanged)
    │   │   ├── SignInGodAccountController.ts                        [M]
    │   │   └── tests/SignInGodAccountController.test.ts             [M]
    │   └── services/SupabaseAuthService.ts                          [M]
    └── tests/
        ├── fixtures/
        │   ├── AuthFixture.ts                                       [M]
        │   └── SupabaseFixture.ts                                   [M]
        └── routes/auth/
            ├── SignInRoute.test.ts                                  [N]
            └── ResendSignUpEmailRoute.test.ts                       [N]
apps/web/
├── tailwind.config.js                                                   [M]
└── src/
    ├── app/tests/auth/sign-in.test.ts                                   [M]
    ├── rpc/actions/auth/
    │   ├── SignInAction.ts                                              [M]
    │   ├── index.ts                                                     [M]
    │   └── tests/SignInAction.test.ts                                   [N]
    └── ui/
        ├── global/styles/global.css                                     [M]
        └── auth/
            ├── contexts/AuthContext/
            │   ├── index.tsx                                            (unchanged)
            │   ├── hooks/useSignInAction.ts                             [M]
            │   ├── hooks/useAuthContextProvider.ts                      [M]
            │   └── types/
            │       ├── AuthContextValue.ts                              [M]
            │       ├── SignInResult.ts                                  [N]
            │       └── index.ts                                         [M]
            └── widgets/pages/SignIn/
                ├── index.tsx                                            [M]
                ├── SignInPageView.tsx                                   [M]
                ├── useSignInPage.ts                                     [M]
                ├── tests/
                │   ├── SignInPageView.test.tsx                          [M]
                │   └── useSignInPage.test.ts                            [M]
                └── SignInForm/
                    ├── index.tsx                                        [M]
                    ├── SignInFormView.tsx                               [M]
                    ├── useSignInForm.ts                                 (unchanged)
                    ├── tests/SignInForm.test.tsx                        [M]
                    └── UnconfirmedEmailNotice/
                        ├── index.tsx                                    [N]
                        ├── UnconfirmedEmailNoticeView.tsx               [N]
                        └── tests/UnconfirmedEmailNoticeView.test.tsx    [N]
documentation/
├── design.md                                                        [M]
└── prds/auth/sign-in.md                                             [M]
```

`apps/server/rest-client/auth/auth.rest` é vizinho inalterado (D-09) e por isso não aparece na
árvore nem no mapa.

## Mapa canônico de paths afetados

### apps/server — REST service

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/server/src/rest/services/SupabaseAuthService.ts` | Modify | `AUTH_ERROR_CODES` ganha `emailNotConfirmed: 'email_not_confirmed'` e `overEmailSendRateLimit: 'over_email_send_rate_limit'`; `signIn(email: Email, password: Password): Promise<RestResponse<SessionDto>>`; `resendSignUpEmail(email: Email): Promise<RestResponse>` | `signIn`: `error.code === emailNotConfirmed` → `RestResponse<SessionDto>({ errorMessage: 'Confirme seu e-mail antes de entrar', statusCode: HTTP_STATUS_CODE.forbidden })`; qualquer outro erro → `401 'E-mail ou senha incorretos'` (inalterado); sucesso inalterado. `resendSignUpEmail`: `error.code` em `overEmailSendRateLimit` ou `overRequestRateLimit` → `RestResponse({ errorMessage: 'Aguarde alguns instantes antes de reenviar o e-mail', statusCode: HTTP_STATUS_CODE.tooManyRequests })`; demais erros → `500` inalterado; sucesso inalterado | Supabase JS `auth.signInWithPassword`, `auth.resend`; `HTTP_STATUS_CODE`, `RestResponse` do Core | AV-01, AV-02 |

### apps/server — REST controllers

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/server/src/rest/controllers/auth/SignInGodAccountController.ts` | Modify | `handle(http: Http<Schema>): Promise<RestResponse>` | Antes de `response.throwError()`: `response.statusCode === HTTP_STATUS_CODE.forbidden` → `throw new AuthError('E-mail ou senha incorretos')`; demais falhas, checagem de `ENV.godAccountIds` e sucesso inalterados | `AuthService` do Core, `AuthError`, `HTTP_STATUS_CODE` | AV-08 |
| `apps/server/src/rest/controllers/auth/tests/SignInGodAccountController.test.ts` | Modify | `describe('SignInGodAccountController')` | Acrescenta CA-17; casos existentes preservados | `ts-jest-mocker`, Handlers Testing Rules (Controllers) | AV-08 |

### apps/server — Fixtures e testes de rota

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/server/src/tests/fixtures/AuthFixture.ts` | Modify | `createUnconfirmedAccount(input?: CreateAccountInput): Promise<{ accountId: string; email: string; password: string }>` | Cria a conta pelo `supabase.auth.signUp` sem chamar `confirmSignUp`; e-mail e senha padrão únicos como em `createAccount`; lança `Error` se o signUp falhar ou não retornar `user.id`; não guarda sessão nem altera `account`/`session` da fixture | `LocalSupabaseProxy.ensureRunning`, client Supabase da fixture | Validada por AV-01 e AV-02 (fixtures não recebem testes dedicados) |
| `apps/server/src/tests/fixtures/SupabaseFixture.ts` | Modify | `setConfirmationSentAt(accountId: Id, sentAt: Date): Promise<void>`; `getConfirmationSentAt(accountId: Id): Promise<Date \| null>` | Ambos lançam `Error` se `ENV.mode === 'production'`, como `setAuthMetadata`; `setConfirmationSentAt` executa `UPDATE auth.users SET confirmation_sent_at` para o id; `getConfirmationSentAt` lê a coluna e retorna `null` se vazia ou se a conta não existir | `this.database` (Drizzle `sql`), `Id` do Core | Validada por AV-02 |
| `apps/server/src/tests/routes/auth/SignInRoute.test.ts` | Create | `describe('[POST /auth/sign-in]')` | Cobre CA-01, CA-02 e CA-03 sobre `honoFixture.server` com `supertest`; banco limpo em `beforeEach` | `HonoFixture`, `SupabaseFixture`, `AuthFixture` | AV-01 |
| `apps/server/src/tests/routes/auth/ResendSignUpEmailRoute.test.ts` | Create | `describe('[POST /auth/resend-email/sign-up]')` | Cobre CA-04 e CA-05; recua `confirmation_sent_at` com `supabaseFixture.setConfirmationSentAt(Id.create(accountId), <agora − 2 min>)` e relê com `getConfirmationSentAt` após o sucesso | `HonoFixture`, `SupabaseFixture`, `AuthFixture` | AV-02 |

### apps/web — RPC

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/rpc/actions/auth/SignInAction.ts` | Modify | `export type SignInActionResponse = { isEmailConfirmed: true; account: AccountDto } \| { isEmailConfirmed: false }`; `SignInAction(authService: AuthService): Action<Request, SignInActionResponse>` com `Request = { email: string; password: string }` inalterado | `response.statusCode === HTTP_STATUS_CODE.forbidden` → retorna `{ isEmailConfirmed: false }` sem `setCookie`; outra falha → `response.throwError()`; sucesso → define os dois cookies como hoje e retorna `{ isEmailConfirmed: true, account: session.account }` | `AuthService` do Core, `Call`, `COOKIES` | AV-03 |
| `apps/web/src/rpc/actions/auth/index.ts` | Modify | `export type { SignInActionResponse } from './SignInAction'` | Exports existentes inalterados | — | AV-07 (types) |
| `apps/web/src/rpc/actions/auth/tests/SignInAction.test.ts` | Create | `describe('Sign In Action')` | Cobre CA-06 com `AuthService` e `Call` mockados (`ts-jest-mocker`) e `AccountsFaker` | Handlers Testing Rules (Actions) | AV-03 |

### apps/web — AuthContext

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/auth/contexts/AuthContext/hooks/useSignInAction.ts` | Modify | `useSignInAction(): { signIn(email: string, password: string): Promise<ActionResponse<SignInActionResponse>> }` | `serverError` → `ActionResponse({ errorMessage })`; senão `ActionResponse({ data })`; muda só o tipo; `SignInActionResponse` via `import type` (D-10) | `authActions.signIn`, `SignInActionResponse` | AV-06 (D-14) |
| `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts` | Modify | `Params.signIn: (email: string, password: string) => Promise<ActionResponse<SignInActionResponse>>`; `handleSignIn(email: string, password: string): Promise<SignInResult>` | Falha → `toast.showError(errorMessage, 10)` e `'failed'`; `isEmailConfirmed === false` → `'email-not-confirmed'` sem toast, sem `setAccount` e sem `identifyUser`; sucesso → `setAccount(Account.create(account))`, `analyticsProvider.identifyUser(id, email)` e `'signed-in'`; `SignInActionResponse` via `import type` (D-10) | `ActionResponse`, `Account`, `useToastContext` | AV-06 (D-06) |
| `apps/web/src/ui/auth/contexts/AuthContext/types/AuthContextValue.ts` | Modify | `handleSignIn(email: string, password: string): Promise<SignInResult>` | Demais membros inalterados | `SignInResult` | AV-07 (types) |
| `apps/web/src/ui/auth/contexts/AuthContext/types/SignInResult.ts` | Create | `export type SignInResult = 'signed-in' \| 'email-not-confirmed' \| 'failed'` | Resultado do login exposto pelo context | — | AV-07 (types) |
| `apps/web/src/ui/auth/contexts/AuthContext/types/index.ts` | Modify | `export type { SignInResult } from './SignInResult'` | Exports existentes inalterados | — | AV-07 (types) |

### apps/web — UI

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/auth/widgets/pages/SignIn/index.tsx` | Modify | `SignInPage()` | Resolve `useRestContext().authService` e passa a `useSignInPage`; passa `unconfirmedEmail`, `isResendingEmail` e `onResendEmail={handleResendEmail}` a `SignInPageView`; sem estado próprio | `useRestContext`, `useAuthContext` | Não testado (Entry Point) |
| `apps/web/src/ui/auth/widgets/pages/SignIn/useSignInPage.ts` | Modify | `useSignInPage({ rocketAnimationRef, error, nextRoute, handleSignIn, authService }: Params)`, com `handleSignIn: (email: string, password: string) => Promise<SignInResult>` e `authService: AuthService`; retorna `{ rocketAnimationRef, isRocketVisible, unconfirmedEmail, isResendingEmail, handleFormSubmit, handleResendEmail }`, com `handleResendEmail(): Promise<void>` | `handleFormSubmit` limpa `unconfirmedEmail` antes de chamar `handleSignIn`; `'email-not-confirmed'` → `setUnconfirmedEmail(email)` e retorna; `'failed'` → retorna; `'signed-in'` → foguete e navegação como hoje. `handleResendEmail`: sem `unconfirmedEmail` retorna; senão liga o loading, chama `authService.resendSignUpEmail(Email.create(unconfirmedEmail))`, mostra `toast.showSuccess('Reenviamos para você o e-mail de confirmação', 10)` ou `toast.showError(response.errorMessage, 5)` e desliga o loading | `AuthService` do Core, `Email`, `toast` existente (D-07) | AV-04 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInPageView.tsx` | Modify | `Props` ganha `unconfirmedEmail: string \| null`, `isResendingEmail: boolean`, `onResendEmail: () => Promise<void>` | Repassa as três props a `<SignInForm>`; resto da árvore inalterado | `SignInForm` | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/tests/useSignInPage.test.ts` | Modify | `describe('useSignInPage hook')` | Casos existentes migram de `boolean` para `SignInResult`; acrescenta CA-09 e CA-11 | `ts-jest-mocker` (`AuthService`), mocks de toast/navegação existentes | AV-04 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/tests/SignInPageView.test.tsx` | Modify | `describe` existente | Acrescenta o repasse das props do aviso ao `SignInForm` (CA-10) | — | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/index.tsx` | Modify | `SignInFormProps = { onSubmit; unconfirmedEmail: string \| null; isResendingEmail: boolean; onResendEmail: () => Promise<void> }` | Repassa as props do aviso a `SignInFormView` | `useSignInForm` | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/SignInFormView.tsx` | Modify | `SignInFormViewProps` ganha `unconfirmedEmail`, `isResendingEmail`, `onResendEmail` | Com `unconfirmedEmail`, renderiza `<UnconfirmedEmailNotice email isResending onResend />` entre o bloco de inputs e o botão "Entrar"; sem ele, nada | `UnconfirmedEmailNotice` | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/tests/SignInForm.test.tsx` | Modify | `describe('SignInForm')` | Acrescenta CA-10 (posição e presença) e CA-12 (clique no reenvio não submete) | `@testing-library/react`, `user-event` | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/UnconfirmedEmailNotice/index.tsx` | Create | `export const UnconfirmedEmailNotice = UnconfirmedEmailNoticeView` | Alias da View, único export público do widget | — | Não testado (Entry Point) |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/UnconfirmedEmailNotice/UnconfirmedEmailNoticeView.tsx` | Create | `export type UnconfirmedEmailNoticeViewProps = { email: string; isResending: boolean; onResend: () => void }`; `UnconfirmedEmailNoticeView(props)` | Contêiner `data-testid="unconfirmed-email-notice"`, `role="status"`, `aria-live="polite"`; título "Confirme seu e-mail para entrar"; texto "Enviamos um link de confirmação para {email}. Ele expira em 1 hora."; `Button` com `type="button"`, `testId="resend-confirmation-email-button"`, `isLoading={isResending}`, `onClick={onResend}` e rótulo "Reenviar e-mail de confirmação"; classes `border border-theme-reward bg-theme-reward-surface` no contêiner, demais tokens do Design Contract; sem hooks nem efeitos | `Button`, `reward-surface` (D-15) | AV-05 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/UnconfirmedEmailNotice/tests/UnconfirmedEmailNoticeView.test.tsx` | Create | `describe('UnconfirmedEmailNoticeView')` | Cobre CA-10 (texto, e-mail, papéis ARIA e classes de token do contêiner) e CA-12 (clique, loading, nome acessível) | `@testing-library/react`, `user-event` | AV-05 |

### apps/web — Tokens de tema

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/styles/global.css` | Modify | `--theme-reward-surface: #443102;` no bloco `:root[data-theme="stardust-dark"]`, após `--theme-danger-surface` | Nova variável do tema escuro; as 18 variáveis existentes e a geometria permanecem inalteradas; valor igual ao primitivo `color.yellow.900` do Penpot | — | AV-05 (classe), VV-01, VV-02 |
| `apps/web/tailwind.config.js` | Modify | `'reward-surface': 'var(--theme-reward-surface)'` em `theme.colors.theme`, após `'danger-surface'` | Expõe `bg-theme-reward-surface`, `text-…`, `border-…` etc.; a paleta `yellow` (inclusive `yellow-900`) e os demais tokens permanecem inalterados | `global.css` | AV-05 (classe), VV-01 e VV-02 (estilo computado) |

### apps/web — Jornada Playwright

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/app/tests/auth/sign-in.test.ts` | Modify | `test.describe('/auth/sign-in')` | Acrescenta CA-07 e CA-13 (`403` e reenvio `200`/`429`) e, no teste existente de `401`, a ausência do aviso (CA-08); demais testes inalterados | `ServerMock`, helpers locais `gotoSignInPage` e `fillValidSignInForm` | AV-06 |

### documentation

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `documentation/prds/auth/sign-in.md` | Modify | RP-01 (Regras de Negócio e de Experiência), JN-01 e `last_updated_at` | Emenda aprovada (Q8), já aplicada antes da Spec | — | Revisão do usuário |
| `documentation/design.md` | Modify | Seção de tokens do Web: tabela `color.<role>` e a frase "all 18 colors" | Acrescenta `reward-surface` em linha ou nota própria, fora da linha `color.<role>` dos 18 roles do Penpot (para a tabela não afirmar que é token do Penpot), ajusta "all 18 colors" e registra que ele é um token só do Web, ligado no Penpot ao primitivo `color.yellow.900` (`#443102`), sem contraparte em `Semantic/Dark`; demais conteúdos inalterados | `global.css`, `tailwind.config.js` | Revisão do usuário |

## Detalhamento técnico por camada afetada

**REST do Server.** O mapeamento fica no adapter `SupabaseAuthService`; `SignInController`,
`ResendSignUpEmailController`, `AuthRouter` e seus schemas não mudam. `SignInController` só
publica `AccountSignedInEvent` quando `response.isSuccessful`, então o `403` não gera evento. O
`403` não usa `supabaseAuthError` para não registrar o caso esperado como erro de Supabase no log;
os demais ramos continuam usando o helper. O segundo consumidor do mesmo `signIn`,
`SignInGodAccountController`, converte o `403` em `AuthError` (D-11) porque `RestResponse.throwError`
transformaria o `403` em `NotAllowedError`, que o `HonoApp` serve como `405`.

**Tokens de tema do Web.** `reward-surface` segue o encanamento dos demais `*-surface`:
variável em `global.css` sob `stardust-dark` → entrada em `theme.colors.theme` do Tailwind →
classe `bg-theme-reward-surface`. Só o tema escuro existe no Web, então não há valor claro. O
aviso é o único consumidor. A paleta `yellow` do Tailwind não muda, porque `apps/web/src/ui/global/widgets/components/Mdx/Content/ContentView.tsx` usa `text-yellow-900` (`#1c1400`).

**Testes de rota do Server.** Um arquivo por rota (Server Routes Testing Rules).
`createUnconfirmedAccount` entra na `AuthFixture` porque os dois arquivos precisam da mesma
preparação. Os dois cenários de `401` de CA-02 comparam status e `message` entre si para provar
que a resposta não distingue conta inexistente, conta confirmada e conta não confirmada. O recuo e
a leitura de `confirmation_sent_at` ficam em `SupabaseFixture` (D-13), ao lado de `setAuthMetadata`,
com a mesma guarda de ambiente; nenhum token, OTP ou corpo de e-mail é lido ou registrado.

**RPC do Web.** `authActions.signIn` (composition root) não muda: continua validando o input com
zod e executando a action. A action não importa `next/*`. O tipo `SignInActionResponse` mora no
arquivo da action, é reexportado com `export type` pelo barrel do domínio e consumido na UI só por
`import type` (D-10).

**AuthContext do Web.** `AuthContext/index.tsx` já repassa `useSignInAction().signIn` ao provider
e não muda. `ui/global/hooks/tests/mocks/useAuthContextMock.ts` usa `jest.fn()` sem tipo de
retorno e não precisa mudar.

**UI do Web.** `SignInFormView` mantém `<form className="flex flex-col gap-6">`; o aviso entra como
filho direto entre o bloco de inputs e o botão, herdando o `gap` de 24 px que o frame usa em
`form`. O `useSignInForm` continua dono só do `react-hook-form` e do loading de submissão.

## Runtime Flow

**Login de conta não confirmada.**

```text
SignInFormView submit → useSignInForm (zod) → useSignInPage.handleFormSubmit
  → setUnconfirmedEmail(null)
  → AuthContext.handleSignIn → useSignInAction.signIn → Server Action authActions.signIn (zod)
  → SignInAction → AuthService(web).signIn → POST /auth/sign-in
  → ValidationMiddleware(credentialsSignInSchema) → SignInController
  → SupabaseAuthService.signIn → GoTrue signInWithPassword
       senha errada / e-mail inexistente → invalid_credentials → 401 (inalterado)
       senha correta, conta não confirmada → email_not_confirmed → 403
  ← SignInAction: 403 → { isEmailConfirmed: false } (sem cookies)
  ← handleSignIn → 'email-not-confirmed' (sem toast, conta continua null)
  ← useSignInPage: setUnconfirmedEmail(email submetido) → aviso renderizado
```

- **Contexto confiável:** não há sessão. A única entrada do ator é o e-mail e a senha submetidos,
  validados por zod no formulário, na Server Action e no Hono. O estado de confirmação vem
  exclusivamente do GoTrue.
- **Sem efeitos:** nenhuma sessão, cookie, `AccountSignedInEvent` ou `identifyUser`.
- **Sigilo:** o `403` só existe depois da validação de senha pelo GoTrue; as respostas de senha
  errada e e-mail inexistente permanecem idênticas (`401`, mesmo corpo).

**Reenvio.**

```text
UnconfirmedEmailNotice (button type=button) → useSignInPage.handleResendEmail
  → isResendingEmail = true
  → RestContext authService.resendSignUpEmail(Email) → POST /auth/resend-email/sign-up (público, emailOnlySchema)
  → SupabaseAuthService.resendSignUpEmail → GoTrue resend({ type: 'signup', emailRedirectTo: stardustWebUrl })
       ok → 200 → toast de sucesso
       over_email_send_rate_limit / over_request_rate_limit → 429 → toast "Aguarde alguns instantes…"
       outro erro → 500 → toast "Erro inesperado ao reenviar e-mail de cadastro"
  → isResendingEmail = false (sempre)
```

- **Efeito persistido:** o GoTrue atualiza `auth.users.confirmation_sent_at` e envia o e-mail
  (Mailpit no ambiente local). Nenhuma tabela da aplicação muda.
- **Concorrência:** o `Button` fica desabilitado durante o loading, então cliques repetidos não
  disparam requisições paralelas. O único cooldown é o do provedor (`SMTP.MaxFrequency`).
- **Ciclo de vida:** o aviso vive no estado da página; é limpo na próxima submissão e perdido ao
  recarregar. O reenvio usa o e-mail rejeitado, não o valor atual do campo.

**Confirmação (fluxo existente, não alterado).** Link do e-mail → `GET /api/auth/confirm-email`
→ `ConfirmEmailController` → `/auth/account-confirmation`. Depois disso, as mesmas credenciais
retornam `201`, a página executa o foguete e navega para `/space`.

# Verification Contract

## Shared setup

- **Integração do Server (AV-01, AV-02):** na raiz, `pnpm --filter @stardust/server run db:test`
  sobe o stack do `docker-compose.yml` raiz com `.env.local` (GoTrue com
  `GOTRUE_MAILER_AUTOCONFIRM=false`, Mailpit, Inngest, Redis) e reseta o banco sem seed. Contas
  efêmeras: `AuthFixture.createAccount({ email, password })` (confirmada pelo Mailpit) e
  `AuthFixture.createUnconfirmedAccount()` (nova); `confirmation_sent_at` recuado e lido por
  `SupabaseFixture.setConfirmationSentAt`/`getConfirmationSentAt`. `SupabaseFixture.clearDatabase()` em
  `beforeEach`. `SMTP.MaxFrequency` local é o padrão `1m`, o que torna o `429` de CA-05
  determinístico logo após o cadastro. Serializar com qualquer outro comando que use os
  containers. Nenhum token, OTP ou corpo de e-mail é registrado.
- **Unit Server (AV-08):** Jest do projeto `server`, sem serviços externos; `AuthService` e `Http`
  via `ts-jest-mocker`, como no `SignInGodAccountController.test.ts` existente.
- **Unit Web (AV-03, AV-04, AV-05):** Jest do workspace `@stardust/web`, sem serviços externos;
  `AuthService` e `Call` via `ts-jest-mocker`; contas via `AccountsFaker`; toast e navegação pelos
  mocks já usados em `useSignInPage.test.ts`.
- **Integração Web (AV-06):** `apps/web/playwright.config.ts` sobe o Web em
  `http://127.0.0.1:3100` com `MODE=testing` e `apps/web/.env.testing`; cada teste registra suas
  respostas com `ServerMock(page)` (`POST /auth/sign-in` com `403`/`401`;
  `POST /auth/resend-email/sign-up` com `200`/`429`). Não iniciar `next dev` manualmente. Sem
  credenciais reais.
- **Manual e visual (MV-01, VV-01, VV-02):** stack local com `.env.local` raiz;
  `pnpm --filter @stardust/server run dev` em `http://localhost:3334` e
  `pnpm --filter @stardust/web run dev` em `http://localhost:3000`, em terminais separados. O ator
  é uma conta nova e descartável criada no próprio MV-01 por `/auth/sign-up`, com e-mail único; as
  contas de `seed-accounts.json` não servem porque já estão confirmadas. Links lidos na UI/API do
  Mailpit em `http://127.0.0.1:54324`. Nenhum e-mail, senha, cookie ou link é escrito em arquivo
  ou log. A conta permanece só no banco local; não há reset compartilhado.

## Automated

### AV-01 — Sign-in distingue conta não confirmada sem revelar estado

**Critérios:** CA-01, CA-02, CA-03
**Alvo / fronteira:** `apps/server/src/tests/routes/auth/SignInRoute.test.ts` (planejado), rota HTTP real via `HonoFixture` e GoTrue local
**Comando:** na raiz, depois do setup, `pnpm --filter @stardust/server run test:integration src/tests/routes/auth/SignInRoute.test.ts`
**Condição de aprovação:** `403` com a mensagem e sem tokens para a conta não confirmada; três `401` com `message` idêntico (não confirmada com senha errada, confirmada com senha errada, e-mail inexistente); `201` com `account.email` e tokens para a conta confirmada; `400` para e-mail inválido; status via `HTTP_STATUS_CODE`; a seleção executa casos > 0 sem `skip`/`todo`.

### AV-02 — Reenvio com sucesso persistido e limite do provedor

**Critérios:** CA-04, CA-05
**Alvo / fronteira:** `apps/server/src/tests/routes/auth/ResendSignUpEmailRoute.test.ts` (planejado), rota HTTP real e `auth.users` local
**Comando:** na raiz, `pnpm --filter @stardust/server run test:integration src/tests/routes/auth/ResendSignUpEmailRoute.test.ts`, serializado após AV-01
**Condição de aprovação:** `200` e `confirmation_sent_at` posterior ao valor recuado; `429` com "Aguarde alguns instantes antes de reenviar o e-mail" logo após o cadastro; `400` para e-mail inválido; casos > 0 sem `skip`.

### AV-03 — Action traduz o 403 em resultado tipado

**Critérios:** CA-06
**Alvo / fronteira:** `apps/web/src/rpc/actions/auth/tests/SignInAction.test.ts` (planejado), action com `AuthService` e `Call` mockados
**Comando:** na raiz, `pnpm run test:unit -w @stardust/web -- src/rpc/actions/auth/tests/SignInAction.test.ts`
**Condição de aprovação:** `403` → `{ isEmailConfirmed: false }` e `call.setCookie` nunca chamado; `201` → dois `setCookie` com as chaves de `COOKIES` e `{ isEmailConfirmed: true, account }`; `401` → rejeita com `AuthError`; casos > 0.

### AV-04 — Estado do aviso e reenvio no hook da página

**Critérios:** CA-09, CA-11
**Alvo / fronteira:** `apps/web/src/ui/auth/widgets/pages/SignIn/tests/useSignInPage.test.ts`, hook de widget com `handleSignIn` e `AuthService` mockados
**Comando:** na raiz, `pnpm run test:unit -w @stardust/web -- src/ui/auth/widgets/pages/SignIn/tests/useSignInPage.test.ts`
**Condição de aprovação:** os casos existentes passam com `SignInResult` (sem reduzir casos ou asserções); `unconfirmedEmail` segue CA-09; `handleResendEmail` segue CA-11 para sucesso, `429` e `500`, inclusive o retorno sem chamada quando não há e-mail; casos > 0.

### AV-05 — Renderização e acessibilidade do aviso

**Critérios:** CA-10, CA-12
**Alvo / fronteira:** `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/UnconfirmedEmailNotice/tests/UnconfirmedEmailNoticeView.test.tsx` (planejado), `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/tests/SignInForm.test.tsx` e `apps/web/src/ui/auth/widgets/pages/SignIn/tests/SignInPageView.test.tsx`
**Comando:** na raiz, `pnpm run test:unit -w @stardust/web -- src/ui/auth/widgets/pages/SignIn/SignInForm/UnconfirmedEmailNotice/tests/UnconfirmedEmailNoticeView.test.tsx src/ui/auth/widgets/pages/SignIn/SignInForm/tests/SignInForm.test.tsx src/ui/auth/widgets/pages/SignIn/tests/SignInPageView.test.tsx`
**Condição de aprovação:** View com título, texto contendo o e-mail e "Ele expira em 1 hora.", `role="status"`, `aria-live="polite"`, classes `bg-theme-reward-surface` e `border-theme-reward` no contêiner, nome acessível do botão, `onResend` no clique e `Loading`/desabilitado com `isResending`; no formulário, o aviso aparece só com `unconfirmedEmail`, fica entre o campo de senha e `submit-button` na ordem do DOM e o clique no reenvio não chama `onSubmit`; a View da página repassa as props; casos existentes preservados; casos > 0.

### AV-06 — Jornada de sign-in com provider real

**Critérios:** CA-07, CA-08, CA-13
**Alvo / fronteira:** `apps/web/src/app/tests/auth/sign-in.test.ts`, rota real `/auth/sign-in` com `AuthContextProvider`, Server Action e `ServerMock`
**Comando:** na raiz, `pnpm --filter @stardust/web run test:integration src/app/tests/auth/sign-in.test.ts`
**Condição de aprovação:** `403` → URL `/auth/sign-in`, `unconfirmed-email-notice` visível com o e-mail e nenhum `toast-progress-bar` (o `role="alert"` do toast colide com o route announcer do Next e não prova a ausência); `401` → `toast-progress-bar` visível e aviso ausente; reenvio `200` → toast de sucesso e request com o e-mail submetido; reenvio `429` → toast com a mensagem do Server; os testes existentes continuam passando (inclusive o redirecionamento para `/space`, que prova o ramo `'signed-in'`); sincronização por `waitForRequest`/`waitForResponse`/`toHaveURL`, sem `waitForTimeout` nos testes novos; casos > 0.

### AV-08 — Rota God preserva o 401

**Critérios:** CA-17
**Alvo / fronteira:** `apps/server/src/rest/controllers/auth/tests/SignInGodAccountController.test.ts`, controller com `AuthService` e `Http` mockados
**Comando:** na raiz, `pnpm run test:unit -w @stardust/server -- src/rest/controllers/auth/tests/SignInGodAccountController.test.ts`
**Condição de aprovação:** `403` do service → rejeita com `AuthError` e mensagem "E-mail ou senha incorretos"; os dois casos existentes continuam passando sem redução de asserções; casos > 0.

### AV-07 — Verificações de baseline aplicáveis

**Critérios:** CA-01 a CA-13 e CA-17 (integridade estática do candidato)
**Escopo:** `@stardust/server` e `@stardust/web`. Consumidores afetados sem mudança de código: o Backoffice (via `/auth/sign-in/god`, contrato preservado e provado por AV-08) e a página SignUp (via o `429` de reenvio, D-12, coberta pelo typecheck do Web). Core e Backoffice não mudam, então não há typecheck deles.
**Verificações:**

- `pnpm run format` antes dos checks;
- `pnpm run check:code -w @stardust/server` e `pnpm run check:code -w @stardust/web` (`biome check src` cobre `global.css`; `tailwind.config.js` fica fora desse escopo e é provado pela resolução da classe `bg-theme-reward-surface` no estilo computado de VV-01 e VV-02);
- `pnpm run check:types -w @stardust/server` e `pnpm run check:types -w @stardust/web` (projeto inteiro do workspace, sem passar arquivos);
- `pnpm run check:architecture` (dependency-cruiser: limites entre apps e Core);
- `pnpm run check:complexity -w apps/web` e `pnpm run check:complexity -w apps/server`, com `.code-multivitals.json` e o baseline `.code-multivitals-baseline.json` (função nova acima do nível de aviso falha; a View nova fica abaixo de 70 linhas);
- `pnpm run check:test-integrity` (sem `forbiddenTestPaths`, sem queda de casos/asserções nos testes modificados);
- `pnpm run check:spec-implementation documentation/features/auth/sign-in-unconfirmed-email-resend/spec.md --base <commit-base>`.

`test:coverage`/`check:coverage` e as suítes completas rodam no CI do PR; o ratchet de
`coverage-baseline.json` não é medido localmente salvo pedido explícito.
**Condição de aprovação:** todos os gates passam no candidato integrado e as seleções de AV-01 a AV-06 e AV-08 executam casos reais.

## Manual

### MV-01 — Conta não confirmada, reenvio e confirmação no stack real

**Critérios:** CA-07, CA-14
**Ferramenta / setup:** Playwright em navegador real; setup compartilhado "Manual e visual"
**Procedimento:**

1. Abrir `http://localhost:3000/auth/sign-up` e cadastrar uma conta nova com e-mail único;
2. abrir `/auth/sign-in` e entrar com as mesmas credenciais (capturar aqui VV-01 e VV-02);
3. aguardar mais de 60 s desde o cadastro e clicar em "Reenviar e-mail de confirmação";
4. abrir, pelo Mailpit, o link da mensagem mais recente para o e-mail da conta;
5. voltar a `/auth/sign-in` e entrar com as mesmas credenciais.

**Condição de aprovação:** passo 2 → `POST /auth/sign-in` `403`, URL `/auth/sign-in` e aviso visível com o e-mail; passo 3 → loading no botão, `POST /auth/resend-email/sign-up` `200`, toast de sucesso e nova mensagem no Mailpit; passo 4 → `/auth/account-confirmation`; passo 5 → `POST /auth/sign-in` `201`, `GET /auth/account` `200` e URL final `/space`; sem `pageerror`. Registrar só rota, resultado e status. Senha errada e `429` não são exercitados manualmente (AGENTS.md: só caminho feliz).

## Visual

### VV-01 — Aviso visível, desktop 1440×900

**Critérios:** CA-15
**Referência / setup:** Penpot `stardust`, página `🖥️ Desktop`, frame `Autenticação / Desktop / Sign-in · E-mail não confirmado` (1440×900), componente `Aviso · E-mail não confirmado`; captura Playwright de MV-01, passo 2, em viewport 1440×900
**Captura / comparação:** export atual do frame pelo Penpot MCP comparado com a captura da página; inspecionar as duas imagens
**Condição de aprovação:** aviso dentro do formulário entre o campo de senha e "Entrar"; fill `theme-reward-surface` (`#443102`, medido no estilo computado do contêiner) e borda `theme-reward`; título em texto primário e corpo em texto secundário com as cópias do frame (o e-mail é o da conta); botão contornado de largura total com a borda do token `color.border`; espaçamento de 24 px entre campos, aviso e "Entrar"; demais elementos inalterados. Desvio aceito: hero `AnimatedHero` no lugar do placeholder `Ilustração`.

### VV-02 — Aviso visível, mobile 390×844

**Critérios:** CA-16
**Referência / setup:** Penpot `stardust`, página `📱 Mobile`, frame `Autenticação / Mobile / Sign-in · E-mail não confirmado` (390×844), mesmo componente; mesma sessão de MV-01 com viewport 390×844
**Captura / comparação:** export atual do frame comparado com a captura; percorrer a página com Tab a partir do campo de senha
**Condição de aprovação:** as mesmas propriedades de VV-01 na largura mobile, sem scroll horizontal nem texto cortado; foco Senha → "Reenviar e-mail de confirmação" → "Entrar", com indicador de foco visível. Desvio aceito: rótulos do frame mobile original fora de escopo.

# Documentation alignment and revision history

**Alinhamento documental:** `documentation/prds/auth/sign-in.md` foi emendado nesta task (D-01) e
`documentation/design.md` passa a listar o token `reward-surface` (D-15). Nenhuma Rule, Architecture
ou Tooling muda: o comportamento novo usa padrões existentes (adapter
REST, action RPC, Widget Pattern, testes por rota). A Issue #646 aponta para esta Spec no campo
"Spec" quando o PR for aberto.

**Rule Pack:** `ui-layer-rules.md`, `widget-tests-rules.md`, `rpc-layer-rules.md`,
`rest-layer-rules.md`, `handlers-testing-rules.md`, `server-routes-testing-rules.md`,
`web-app-routes-testing-rules.md`, `code-conventions-rules.md`, `server-application-rules.md`,
`web-application-rules.md`.

| Revisão | Data | Mudança | Revisão independente |
| --- | --- | --- | --- |
| 1 | 2026-11-12 | Criação a partir da Issue #646 e do PRD `sign-in.md` emendado, após grilling (Q1–Q10) e aprovação das cinco seções de design. | Spec Reviewer: `blocking_findings`. Bloqueante: `POST /auth/sign-in/god` também consome `SupabaseAuthService.signIn` e passaria de `401` a `405` (via `NotAllowedError`) para conta não confirmada, sem declaração nem cobertura. Não bloqueantes: exceção ao padrão de erros de `rpc-layer-rules.md` não registrada; resultado esperado da auditoria de UI com D-07; `UPDATE` em `auth.users` no arquivo de teste em vez de fixture; padrão novo de tipo exportado por action; justificativa inexistente para não testar `useSignInAction`; página SignUp não declarada como consumidora do `429`. Todos verificados diretamente no código. |
| 2 | 2026-11-12 | Q11 (a): `SignInGodAccountController` preserva `401` (D-11, RF-08, CA-17, AV-08, dois paths). D-03 registra a exceção de RPC; D-07 fixa o resultado da auditoria; D-10 (`import type`), D-12 (consumidor SignUp), D-13 (fixture `SupabaseFixture` para `confirmation_sent_at`, um path) e D-14 (sem teste de `useSignInAction`). Escopo, Shared setup e AV-07 corrigidos. | Mesmo Spec Reviewer: `clear`. Os sete findings da revisão 1 foram resolvidos e nenhum finding novo apareceu. `AuthError` → `401` (`HonoApp.ts:158-159`) foi verificado diretamente. O usuário aprovou o Contract escrito em 2026-11-12 e o status passou a `open`, sem incremento de revisão. |
| 3 | 2026-11-12 | Q12 (token novo): `reward-surface` (`--theme-reward-surface: #443102`, `bg-theme-reward-surface`) substitui o `yellow-900` legado no aviso (D-15; `global.css`, `tailwind.config.js` e `design.md`, três paths novos no mapa; `scope`, Design Contract, CA-10, AV-05, AV-07 e VV-01 ajustados). Correção de redação: CA-07, CA-08 e AV-06 localizam o toast por `data-testid="toast-progress-bar"`, não por `role="alert"`. Desvios de design registrados: altura do aviso (+2 px do `border`) e escala de `rem` no mobile. A prova VV-01 e VV-02 e a revisão independente da implementação ficam invalidadas até a recaptura. | Spec Reviewer: `clear`, sem findings bloqueantes. Dois não bloqueantes aplicados: `design.md` registra `reward-surface` fora da linha dos 18 roles do Penpot, e a Spec cita o path completo e o uso de `yellow-900` como texto. O usuário aprovou o Contract escrito em 2026-11-12 e o status passou a `open`, sem incremento de revisão. Correção de redação pós-aprovação (2026-11-12, sem mudança de comportamento nem de path): AV-07 passa a dizer que o `check:code` do Web (`biome check src`) não alcança `tailwind.config.js`, provado por VV-01/VV-02. |
