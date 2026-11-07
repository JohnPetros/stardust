---
title: Componentes compartilhados e páginas de autenticação alinhados ao design system
status: in_progress
revision: 4
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/620
  - type: prd
    ref: documentation/prds/auth/sign-in.md
    revision: 2026-08-30
    requirements: [RP-01, RP-02, RP-03, RP-04]
    journeys: [JN-01]
  - type: prd
    ref: documentation/prds/auth/sign-up.md
    revision: 2026-06-17
    requirements: [RP-01, RP-02, RP-06, RP-07]
    journeys: [JN-01]
  - type: prd
    ref: documentation/prds/auth/password-reset.md
    revision: 2026-06-24
    requirements: [RP-01, RP-02, RP-03, RP-04]
    journeys: [JN-01]
  - type: prd
    ref: documentation/prds/auth/account-confirmation.md
    revision: 2026-06-28
    requirements: [RP-02, RP-03, RP-04]
    journeys: [JN-01]
  - type: prd
    ref: documentation/prds/auth/social-account-confirmation.md
    revision: 2026-06-15
    requirements: [RP-02, RP-03, RP-05, RP-06]
    journeys: [JN-01]
scope:
  - apps/web/tailwind.config.js
  - apps/web/src/ui/global/styles
  - apps/web/src/ui/global/widgets/layouts/Root
  - apps/web/src/ui/global/widgets/components/Button
  - apps/web/src/ui/global/widgets/components/Input
  - apps/web/src/ui/global/widgets/components/ErrorMessage
  - apps/web/src/ui/global/widgets/components/Dialog
  - apps/web/src/ui/global/widgets/components/AlertDialog
  - apps/web/src/ui/global/contexts/ToastContext
  - apps/web/src/ui/auth
  - documentation/design.md
  - documentation/tooling.md
  - scripts/check-test-integrity.mjs
  - scripts/tests/check-test-integrity.test.mjs
  - .code-multivitals-baseline.json
  - penpot:stardust
last_updated_at: 2026-11-07
---

# Context and scope

## Contexto

A Issue #620 (descrição emendada em 2026-11-03 com aprovação explícita) leva o design system aprovado às cinco
rotas de autenticação da Web App — Sign-in, Sign-up, Reset password, Account confirmation e Social account
confirmation — no desktop e no mobile. Como decisão de produto registrada durante esta Spec, os componentes
compartilhados `Button`, `Input`, `Dialog`, `AlertDialog` e o Toast passam a seguir os tokens e a geometria
aprovados **em toda a Web App**, sem variante opt-in. As rotas de autenticação são a referência visual.

Esta Spec não altera Core, Server, banco, rotas HTTP, contratos de domínio ou autorização. É uma entrega
exclusivamente de UI (`apps/web`), de tokens de estilo e de documentação, mais a manutenção do arquivo Penpot
`stardust` já realizada durante a criação desta Spec. A revisão 2 acrescenta um ajuste mínimo no detector
`check:test-integrity` (D-11), necessário para que o teste do Toast seja alterável, e a revisão 4, a atualização revisada do baseline de
complexidade (D-14).

## Classificação

- **Origem:** `issue` (#620) com cinco PRDs de `documentation/prds/auth/`.
- **Modo:** completo. Há tokens globais, cinco componentes compartilhados com alcance em toda a Web App,
  cinco rotas, estados com e sem frame, mobile e desktop, e varredura de regressão.
- **Roteamento após `open`:** `create-plan`, seguido de `implement-spec`.

## Escopo incluído

- Tokens semânticos `stardust-dark` e geometria padrão disponibilizados na Web App.
- `Button`, `Input`, `ErrorMessage`, `Dialog` (header e animação), `AlertDialog` e Toast restilizados no lugar,
  para todos os consumidores.
- Visual aprovado nas cinco rotas de autenticação, com seus estados, diálogos, mensagens e toasts.
- Correção de copy "Verique" para "Verifique" no Sign-up.
- Foco visível por teclado nos controles compartilhados e de autenticação.
- Atualização de `documentation/design.md`.
- Ajuste do detector `check:test-integrity` para aceitar testes colocalizados em `ui/**/contexts/**/tests`, com seu teste e
  a descrição em `documentation/tooling.md` (RF-18, D-11).
- Atualização revisada de `.code-multivitals-baseline.json` com `update:complexity-baseline` (D-14).
- Referências Penpot: frames desktop redimensionados para 1440 × 900 e componentes `Notificação / Toast`,
  `Diálogos / Diálogo` e `Diálogos / Diálogo de alerta` adicionados ao arquivo `stardust` (já feitos).

## Fora de escopo

- Modo claro e as famílias Orbit, Sakura e Glacial.
- Decisão entre Poppins e Funnel Sans; a tipografia permanece Poppins.
- Migração dos estilos hard-coded das demais telas que não vêm dos componentes compartilhados.
- Suporte a movimento reduzido e testes automatizados de regressão visual.
- Revisão de copy além de "Verifique"; frames mobile para estados de erro, diálogos e Social account confirmation.
- Correção dos hooks existentes que acessam contexts ou providers diretamente (por exemplo
  `useResetPasswordFormDialog`, `useSignInPage`): pré-existente e fora de escopo, sem alteração de lógica.
- Alterações de fluxo, validação, redirecionamento, API, banco ou autorização.
- Remoção ou escopo da escala da fonte raiz de `global.css` (94,75% até 1080 px e 90,5% até 720 px); o comportamento
  existente permanece (D-12, DV-09).
- Alteração do componente `Hero`, que permanece sem mudança (D-13, DV-10).
- Fechar o `Dialog` `Nova senha` ao abrir o `AlertDialog` `Senha redefinida`: comportamento pré-existente do fluxo de
  `useResetPasswordFormDialog`, fora de escopo por RF-12 (DV-14).

## Rastreabilidade de produto

| PRD | RP cobertos | JN | RF desta Spec |
| --- | --- | --- | --- |
| `sign-in.md` | RP-01 principal, RP-02, RP-03, RP-04 | JN-01 | RF-06, RF-11, RF-12 |
| `sign-up.md` | RP-01, RP-02, RP-06, RP-07 | JN-01 | RF-07, RF-11, RF-12 |
| `password-reset.md` | RP-01 a RP-04 | JN-01 | RF-08, RF-11, RF-12 |
| `account-confirmation.md` | RP-02 a RP-04 | JN-01 | RF-09, RF-12 |
| `social-account-confirmation.md` | RP-02, RP-03, RP-05 e RP-06 como suporte | JN-01 | RF-10, RF-12 |

Os PRDs não definem requisitos visuais; a autoridade visual é o Penpot `stardust`. Os PRDs fixam o comportamento
que esta entrega deve preservar.

## Síntese da pesquisa

| Seção | Conteúdo |
| --- | --- |
| Mapeamento | Cinco páginas em `apps/web/src/ui/auth/widgets/pages/*`; componentes de autenticação em `widgets/components/{Title,Link,AppMessage,AnimatedForm,Hero,RocketAnimation}`; componentes compartilhados em `apps/web/src/ui/global/widgets/components/{Button,Input,ErrorMessage,Dialog,AlertDialog}` e `ui/global/contexts/ToastContext`. |
| Fluxo de dados | Sem mudança. As páginas continuam chamando `useAuthContext`, `useRestContext`, `useToastContext` e Server Actions existentes. O Toast é montado uma vez no Root e acionado por `toast.show/showError/showSuccess` em 26 arquivos (54 chamadas). |
| Atenção | `Button` é importado por 68 arquivos (27 com override de `h-*`), `AlertDialog` por 28, `Dialog` por 14, `Input` por 9. A mudança visual é global; existem suítes Playwright para auth, challenging, profile, reporting, shop e space. `body` usa `bg-gray-900` (igual ao token `background`). `Dialog` e `AlertDialog` compartilham `DialogAnimation`. |
| Lacunas | Não existe frame de foco por teclado (o `Campo de texto` tem Padrão, Ativo e Erro). Frames mobile para erros, diálogos e Social account confirmation não existem. As demais telas não têm frame; usam varredura. Os frames contêm placeholders de ativos e variações de copy documentadas em Design Contract. |

# Implementation Contract

## Requisitos funcionais

- **RF-01 — Tokens e geometria na Web App.** Disponibilizar os tokens semânticos da variante `stardust-dark`
  (todas as cores do set `Semantic/Dark` do Penpot) e a geometria (raio padrão e `full`, altura, padding
  horizontal, gap de ícone e borda de controle) como variáveis CSS ativas sob `data-theme="stardust-dark"` no
  `<html>`, expostas no Tailwind no namespace `theme-*`. Spacing `space.*` não é duplicado.
- **RF-02 — Button compartilhado.** O `Button` segue o botão primário do Penpot: altura `control.height`, raio
  `radius.default`, fundo `action`, texto `canvas` em 14/500, sem sombra ou brilho. Preserva `asChild`,
  `isLoading`, `disabled`, `testId`, `whileTap`, estado de hover e opacidade desabilitada. Overrides de
  `className` dos chamadores continuam prevalecendo por `twMerge`.
- **RF-03 — Input compartilhado.** O `Input` segue o `Campo de texto`: superfície `surface`, borda `border`,
  `control.height`, `radius.default`, padding e gap de controle, rótulo 14/500 `text-primary`. O estado de erro
  usa `danger` no rótulo, borda e mensagem; `isActive` usa borda `action`. Preserva `testId`, `label`,
  `icon`, `type`, `errorMessage`, `isActive`, `ref` e o alternador de senha, que passa a ter `aria-label`.
- **RF-04 — Dialog e AlertDialog compartilhados.** `DialogAnimation`, `DialogHeader` e `AlertDialog` seguem os
  componentes `Diálogo` e `Diálogo de alerta` do Penpot: superfície `surface`, borda `border-quiet`,
  raio `radius.default`, largura de superfície de 512 px, divisor `border-quiet`, alvo de fechar de 44 × 44. O overlay do
  `Dialog` não muda.
- **RF-05 — Toast compartilhado.** O `ToastView` segue o componente `Toast` (Tipo: Erro e Sucesso): superfície,
  borda, raio, selo de ícone com `danger-surface`/`success-surface`, texto 14/400, botão de fechar e barra de
  progresso de 4 px na cor do tipo. Preserva posição, animação de entrada/saída, barra temporizada, arraste e
  rótulo acessível `Fechar mensagem`.
- **RF-06 — Sign-in.** `/auth/sign-in` segue `Autenticação / Desktop / Sign-in` e `· Erro de validação` e
  `Autenticação / Mobile / Sign-in`, com Título, Botões sociais, Divisor de opções, Campos, botão `Entrar` e Links.
  O formulário tem a largura do frame (392 px no desktop; largura do conteúdo com margem de 24 px no mobile).
- **RF-07 — Sign-up.** `/auth/sign-up` segue os três frames desktop e o frame mobile, preservando a revelação
  progressiva, mensagens de nome/e-mail em uso, o estado de confirmação de e-mail e o fundo animado. A copy
  "Verique" passa a "Verifique".
- **RF-08 — Reset password.** `/auth/reset-password` segue os frames de solicitação, e-mail inválido e pronto
  para redefinir (desktop e mobile) e os três diálogos (`Nova senha`, `Senhas diferentes`, `Senha redefinida`).
- **RF-09 — Account confirmation.** `/auth/account-confirmation` segue `Criando perfil` e `Perfil criado`
  (desktop e mobile), incluindo a nova tentativa manual.
- **RF-10 — Social account confirmation.** `/auth/social-account-confirmation` segue os três frames desktop
  (`Conectando conta`, `Criando perfil`, `Perfil criado`); no mobile segue os frames de Account confirmation.
- **RF-11 — Componentes de autenticação.** `Title`, `Link` (tons `highlight` e `subtle`), `AppMessage`,
  `AnimatedForm`, botões sociais e o novo `OptionsDivider` seguem os componentes `Autenticação / …` do Penpot.
- **RF-12 — Preservação de comportamento.** Fluxos, redirecionamentos, validações, mensagens, emojis,
  animações (RocketAnimation, revelação progressiva, Lottie, TypeWriter) e identificadores de teste
  permanecem. A única mudança de copy é "Verifique".
- **RF-13 — Responsividade.** Em 390 px as cinco rotas e os estados sem frame mobile não têm rolagem horizontal;
  o painel Hero permanece oculto abaixo de `lg`.
- **RF-14 — Acessibilidade.** Textos e controles dos componentes compartilhados e das rotas atingem contraste
  WCAG AA; cada controle interativo exibe foco visível por teclado conforme D-04.
- **RF-15 — Sem regressão nas demais telas.** As telas fora da autenticação mudam somente pelos componentes
  compartilhados (cores, raio, altura de controle, foco), sem regressão funcional nem de layout.
- **RF-16 — Documentação.** `documentation/design.md` registra as referências Penpot, o mapeamento de
  implementação dos tokens, o foco como extensão aprovada e a lacuna de paletas mistas.
- **RF-17 — Referências Penpot íntegras.** O arquivo Penpot `stardust` contém os boards e componentes listados
  na matriz de referências visuais, com os frames desktop em 1440 × 900.
- **RF-18 — Detector de integridade de testes.** `check:test-integrity` aceita testes alterados em
  `apps/web/src/ui/**/contexts/**/tests` (e no mesmo local do Backoffice) como locais permitidos, e continua rejeitando
  testes dedicados de constantes, providers e fixtures e qualquer outro local não reconhecido. Sem isso, o teste
  `ToastView.test.tsx`, que já existe nesse local, não pode ser alterado.

## Design Contract

A fonte visual canônica é o arquivo Penpot `stardust`, inspecionado pelo Penpot MCP (arquivo conectado:
`stardust`; confirmar com `penpot.currentFile.name`). Os builders e reviewers inspecionam os frames diretamente;
nenhuma medida ou token é copiado para a Spec. A precedência é: tokens do repositório e comportamento dos
componentes compartilhados; frames do Penpot e tokens vinculados; Issue #620 para copy e comportamento.

### Matriz de referências visuais

Páginas: `🖥️ Desktop`, `📱 Mobile`, `🧩 Components`. Viewports de referência: desktop 1440 × 900 e mobile 390 × 844.
Evidência Penpot: `export_shape` do frame e leitura de estrutura/tokens. Evidência Web: Playwright no viewport,
estado e rota indicados (VM-02). "Âncoras" são as dimensões e posições que a comparação deve conferir. As divergências DV-xx aprovadas não contam como falha dos CA que exigem correspondência aos frames.

| Frame ou componente | Viewport | Estado / variante | Rota e como alcançar | CA | Âncoras e observações |
| --- | --- | --- | --- | --- | --- |
| `Autenticação / Desktop / Sign-in` | 1440 × 900 | padrão | `/auth/sign-in` | CA-07 | main 576 px; Hero 864 px com fundo `surface`; form 392 px; controles 44 px; divisor "ou". |
| `Autenticação / Desktop / Sign-in · Erro de validação` | 1440 × 900 | erro de campo | `/auth/sign-in`, envio vazio | CA-07 | rótulo, borda e mensagem em `danger`. |
| `Autenticação / Mobile / Sign-in` | 390 × 844 | padrão | `/auth/sign-in` | CA-08 | margem 24 px; Hero oculto; links na mesma linha. |
| `Autenticação / Desktop / Sign-up` | 1440 × 900 | campos preenchidos e ativos | `/auth/sign-up` | CA-09 | form 384 px; campos `isActive` com borda `action`; fundo animado em tela cheia a 25% de brilho (DV-12). |
| `Autenticação / Desktop / Sign-up · Nome em uso` | 1440 × 900 | erro de nome | `/auth/sign-up`, nome em uso (ServerMock) | CA-09 | mensagem `Nome já utilizado por outro usuário` em `danger`. |
| `Autenticação / Desktop / Sign-up · Confirme seu e-mail` | 1440 × 900 | sucesso | `/auth/sign-up`, cadastro concluído (ServerMock) | CA-09 | texto de confirmação e botão de reenvio; copy "Verifique". |
| `Autenticação / Mobile / Sign-up` | 390 × 844 | padrão | `/auth/sign-up` | CA-09 | margem 24 px. |
| `Autenticação / Desktop / Reset password` | 1440 × 900 | solicitação | `/auth/reset-password` | CA-11 | conteúdo 384 px, gap 32 px. |
| `Autenticação / Desktop / Reset password · E-mail inválido` | 1440 × 900 | erro de e-mail | `/auth/reset-password`, e-mail inválido | CA-11 | mensagem `Informe um e-mail válido`. |
| `Autenticação / Desktop / Reset password · Pronto para redefinir` | 1440 × 900 | autorizado | `/auth/reset-password` com sessão de redefinição (ServerMock) | CA-11 | AppMessage com Lottie, título, subtítulo e botão. |
| `Autenticação / Mobile / Reset password` e `· Pronto para redefinir` | 390 × 844 | solicitação e autorizado | idem | CA-11 | conteúdo 342 px. |
| `Autenticação / Desktop / Reset password · Diálogo Nova senha` | 512 px | aberto | botão `Redefinir senha` | CA-11 | `Diálogo` com dois campos de senha e botão primário. |
| `Autenticação / Desktop / Reset password · Diálogo Senhas diferentes` | 512 px | erro | envio com senhas diferentes | CA-11 | confirmação em `danger` e mensagem. |
| `Autenticação / Desktop / Reset password · Diálogo Senha redefinida` | 512 px | sucesso | redefinição concluída | CA-11 | `Diálogo de alerta` com Lottie, mensagem e ação. |
| `Autenticação / Desktop / Account confirmation · Criando perfil` | 1440 × 900 | espera com nova tentativa | `/auth/account-confirmation` | CA-12 | spinner, frase de espera 18/400, botão 288 px. |
| `Autenticação / Desktop / Account confirmation · Perfil criado` | 1440 × 900 | sucesso | `/auth/account-confirmation` | CA-12 | AppMessage 384 px, botão 288 px. |
| `Autenticação / Mobile / Account confirmation · Criando perfil` e `· Perfil criado` | 390 × 844 | espera e sucesso | idem | CA-12 | conteúdo 288 px e 342 px. |
| `Autenticação / Desktop / Social account confirmation · Conectando conta` | 1440 × 900 | conectando | `/auth/social-account-confirmation` | CA-13 | spinner e frase de espera, sem botão. |
| `Autenticação / Desktop / Social account confirmation · Criando perfil` | 1440 × 900 | espera com nova tentativa | idem | CA-13 | botão de nova tentativa. |
| `Autenticação / Desktop / Social account confirmation · Perfil criado` | 1440 × 900 | sucesso | idem | CA-13 | AppMessage e botão. |
| `Autenticação / Título`, `Campo de texto`, `Botão social`, `Divisor de opções`, `Link de texto` (🧩 Components) | componente | variantes Ícone, Tipo × Estado, Provedor, Tom | todas as rotas de auth | CA-14 | Link `Destaque` (Sign-in) e `Discreto` (Sign-up, Reset). |
| `Botão` (🧩 Components) | componente | Primário | todas as telas | CA-03 | variantes Contorno, Perigo e Desabilitado não são alvo; overrides de chamadores permanecem. |
| `Campo de texto` (🧩 Components) | componente | Padrão, Ativo, Erro | todas as telas | CA-04 | foco por teclado definido em D-04. |
| `Diálogos / Diálogo` e `Diálogos / Diálogo de alerta` (🧩 Components) | 512 px | padrão | `Dialog` e `AlertDialog` | CA-05 | adicionados a esta entrega. |
| `Notificação / Toast` (🧩 Components) | 360 px | Erro e Sucesso | `toast.showError` / `showSuccess` | CA-06 | adicionado a esta entrega; largura `min(360px, 90vw)`. |

### Divergências aprovadas e ausências

| ID | Frame ou área | Divergência | Decisão |
| --- | --- | --- | --- |
| DV-01 | Frames com placeholders ("Ilustração", "Lottie · spinner", "Lottie · apollo-asking", "Animação rocket-exploring · brilho 25%", logo em texto) | O frame desenha placeholder, o código usa o ativo real. | Manter logo, TypeWriter, `rocket.svg`, Lottie e fundo animado reais, nas posições e tamanhos do frame, exceto o fundo animado do Sign-up (DV-12). A faixa clara de 900 px atrás do Sign-up é o placeholder da animação, não um container. |
| DV-02 | Copy dos frames (por exemplo `Continuar`, `Criar conta` duplicado no mobile, "Insira…", ausência de emojis, `Nova senha` exibido como `Senha`) | O frame diverge da copy existente. | A copy existente prevalece (Issue #620). Só "Verifique" muda. |
| DV-03 | Sign-in: largura do form | Código 320 px; `Campo de texto` do Penpot 392 px; a coluna Conteúdo do frame mede 391 px (x 92,5, subpixel). | A largura do `Campo de texto` prevalece: form de 392 px. O 1 px do frame é arredondamento e não é alvo. |
| DV-04 | Foco por teclado | Sem frame; `design.md` o registra como não especificado. | Extensão aprovada D-04. |
| DV-05 | Toast, `Diálogo` e `Diálogo de alerta` | Não existiam no Penpot. | Criados nesta entrega e aprovados pelo usuário antes de `open`. |
| DV-06 | Estados sem frame (mobile de erros, diálogos e Social) | Sem frame canônico. | Seguem os mesmos componentes e regras de layout dos frames mais próximos. |
| DV-07 | Frames desktop | Eram 1920 × 911. | Redimensionados para 1440 × 900 nesta entrega. |
| DV-08 | Account e Social `· Criando perfil` | Os frames mostram o botão de nova tentativa junto do spinner. | É o estado "nova tentativa visível"; o botão continua condicionado à regra existente. |
| DV-09 | Frames mobile (390 × 844) de Sign-in, Sign-up, Reset password, Account e Social | `global.css` aplica a escala do `rem` (94,75% até 1080 px e 90,5% até 720 px): a tipografia fica cerca de 9,5% menor que a do frame (por exemplo título 21,72 px contra 24 px; botão e link 12,67 px contra 14 px) e as posições verticais diferem de 2 a 3 px. | Mantida a escala existente (D-12): removê-la mudaria todas as telas, contra RF-15. Geometria de margem 24 px e larguras do frame em `px` permanece exata. Aprovada pelo usuário em 2026-11-04. |
| DV-10 | `Autenticação / Desktop / Sign-in`: citação do `Hero` | O código exibe a citação com `TypeWriter` em `text-base` e duas linhas; o frame mostra 14/400 `text-secondary` em uma linha. | `Hero` permanece sem alteração (D-13); logo e ilustração coincidem. Aprovada pelo usuário em 2026-11-04. |
| DV-11 | `Autenticação / Desktop / Sign-up · Nome em uso` | O frame mostra os campos de e-mail e senha; o código os oculta até o nome ser válido (revelação progressiva). | O comportamento do código prevalece (RF-07, RF-12). |
| DV-12 | Fundo animado do Sign-up | O código usava `size='full'` (animação quadrada da largura da janela, ancorada no topo). A revisão 2 o trocou por `size={900}` centrada, igual ao placeholder do frame (DV-01). | Revisão 3, por decisão do usuário em 2026-11-07 ao ver a caixa de 900 px: a animação volta a cobrir a página inteira, agora centralizada e sem corte nos dois eixos (`size='full'` com lado `max(100vw, 100vh)` em um contêiner `fixed inset-0 overflow-hidden`, a 25% de brilho). Medido: 1902 × 1902 em 1902 × 903 e 844 × 844 em 390 × 844. A faixa de 900 px do frame não é alvo. |
| DV-13 | `Diálogos / Diálogo` e `Diálogos / Diálogo de alerta` | A superfície media 464 px por causa do `p-6` externo ao `max-w-lg`. | A superfície passa a medir 512 px; diálogos que passam `max-w-*` próprio continuam prevalecendo e diálogos sem `className` passam de 464 px para 512 px. |
| DV-14 | `Diálogo de alerta` `Senha redefinida` | O `Dialog` `Nova senha` permanece aberto por baixo do `AlertDialog` e o foco permanece no diálogo de baixo. | Comportamento pré-existente do fluxo; fora de escopo (RF-12). Registrado como observação. |
| DV-15 | Componente `Botão` | O Penpot desenha padding horizontal de 24 px sem token. | Não aplicado, para não comprimir botões de ícone com largura fixa dos chamadores (D-03). |
| DV-16 | `Campo de texto` em erro com foco | D-04 descreve o foco apenas do campo normal. | O campo em erro com foco mantém borda e anel de 1 px em `danger`. |
| DV-17 | `Diálogo` e `Diálogo de alerta` | O traço de 1 px é interno no Penpot e não ocupa layout: conteúdo de 464 px e alturas de 373 px (Nova senha) e 421 px (Senha redefinida). Na Web a borda CSS ocupa o layout: conteúdo de 462 px e alturas de 371 px e 423 px; a superfície de 512 px é igual. | Mantida a borda CSS; diferenças de até 2 px não são alvo. |
| DV-18 | `Notificação / Toast` | O frame mostra a mensagem de duas linhas com 34 px e altura de 70 px (linha de cerca de 17 px). O Toast usa `text-sm` com linha de 20 px: 40 px de mensagem e 78 px de altura; a largura de 360 px é igual. | Mantida a escala tipográfica `text-sm` do app; a diferença de 8 px em duas linhas não é alvo. |
| DV-19 | Hover, pressionado e foco do e-mail no Sign-in | O Penpot não desenha hover nem pressionado. O Sign-in abre com o e-mail focado (`autoFocus` pré-existente), então a Web mostra o anel de foco D-04 onde o frame mostra o campo padrão. | Comportamento existente preservado; o hover do `Button` segue o existente (D-03). |
| DV-20 | Defeitos dos frames | `Sign-up · Confirme seu e-mail` tem texto sobreposto e rótulo cortado; os frames de `Account confirmation` cortam o rótulo do botão ("Tentar novamente", "Ir para a página prin…"); os frames de diálogo alinham o rótulo do botão à direita. | Não replicados: a Web exibe o texto completo e centralizado; a largura do botão (288 px, 384 px ou 464 px; 462 px na Web, DV-17) é a âncora. |

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | a Web App carrega qualquer rota | o documento é renderizado | `html` tem `data-theme="stardust-dark"` e cada variável de cor `theme-*` resolve ao valor do token `Semantic/Dark` do Penpot | VM-01 e EV-01 (computed style) |
| CA-02 | RF-01 | utilitários `theme-*` de cor, raio, altura, padding, gap e borda | a Web App compila | todos existem e são consumidos pelos componentes compartilhados | `check:types`, build do CI e EV-01 |
| CA-03 | RF-02 | um `Button` sem override | é renderizado, recebe foco por teclado, é pressionado, fica desabilitado ou carrega | tem 44 px, raio e cores do token, `whileTap`, opacidade desabilitada e spinner, e um `className` com `h-*`, `rounded-*` ou cor continua prevalecendo | `ButtonView.test.tsx` (unidade) e VM-04 |
| CA-04 | RF-03 | um `Input` nos estados padrão, foco, ativo e erro, com e sem ícone, `type="password"` | é renderizado e interagido | usa os tokens do `Campo de texto`, o erro exibe rótulo, borda e mensagem em `danger`, o alternador de senha tem `aria-label` e as props existentes funcionam | `InputView.test.tsx` (unidade) e VM-02 |
| CA-05 | RF-04 | `Dialog` e `AlertDialog` abertos | são renderizados | seguem os componentes `Diálogo` e `Diálogo de alerta` com superfície de 512 px de largura em 1440 × 900, o fechar tem 44 × 44 e foco visível, e o overlay é o atual | VM-02 e VM-04 (browser) e CA-11 |
| CA-06 | RF-05 | o Toast em `error` e `success` | `toast.showError` e `toast.showSuccess` são chamados | segue `Notificação / Toast`, mantém posição, animação, arraste e barra temporizada, e o fechar tem o rótulo `Fechar mensagem` e foco visível | `ToastView.test.tsx` (unidade) e VM-02 |
| CA-07 | RF-06 | o desktop em 1440 × 900 | `/auth/sign-in` é aberta no estado padrão e com erro de validação | corresponde aos frames desktop em cores, tipografia, espaçamento, raio e altura de controles, com Hero e formulário nas âncoras (exceto DV-10) | EV-02 (comparação Penpot × Web) |
| CA-08 | RF-06 | o mobile em 390 × 844 | `/auth/sign-in` é aberta | corresponde ao frame mobile em geometria (margem, larguras e alturas), com tipografia conforme DV-09, sem Hero e sem rolagem horizontal | EV-02 |
| CA-09 | RF-07 | desktop e mobile | `/auth/sign-up` percorre a revelação progressiva, nome em uso e confirmação de e-mail | corresponde aos frames, preserva a revelação e as mensagens, e exibe "Verifique o seu e-mail para confirmar o seu cadastro 😉." | EV-02 e `SignUpPageView.test.tsx` |
| CA-10 | RF-07 | o Sign-up concluído | a confirmação de e-mail é exibida | o texto contém "Verifique" e não contém "Verique" | `SignUpPageView.test.tsx` |
| CA-11 | RF-08 | desktop e mobile | `/auth/reset-password` percorre solicitação, e-mail inválido, pronto para redefinir e os três diálogos | corresponde aos frames e às mensagens existentes, e o diálogo `Nova senha` mantém seus campos, erros e ações | EV-02 e `ResetPasswordFormDialog.test.tsx` |
| CA-12 | RF-09 | desktop e mobile | `/auth/account-confirmation` exibe espera, nova tentativa e perfil criado | corresponde aos frames e preserva `go-to-space-button` e `retry-user-creation-button` | EV-02 e integração Web |
| CA-13 | RF-10 | desktop (e mobile pelas regras de Account confirmation) | `/auth/social-account-confirmation` exibe conectando, espera com nova tentativa e perfil criado | corresponde aos frames desktop e segue o layout mobile de Account confirmation | EV-02 |
| CA-14 | RF-11 | `Link` com `tone` `highlight` e `subtle`, `OptionsDivider` e `Title` | são renderizados | seguem as variantes `Destaque` e `Discreto`, o divisor e o título do Penpot | `LinkView.test.tsx`, `OptionsDividerView.test.tsx` e EV-02 |
| CA-15 | RF-12 | as suítes existentes | `test:unit` e `test:integration` são executados | passam sem regressão e os `testId` existentes seguem presentes | EV-03 (comandos) |
| CA-16 | RF-12 | o Server e a Web App locais com contas seed | Sign-in e Sign-up percorrem o caminho feliz | o resultado visível ocorre e os endpoints essenciais respondem `2xx` | VM-03 e EV-04 |
| CA-17 | RF-13 | 390 × 844 | cada rota e estado sem frame mobile é aberto | `document.documentElement.scrollWidth` é menor ou igual a `clientWidth` | VM-02 e EV-02 |
| CA-18 | RF-14 | os pares de cor de texto e controle nas rotas e componentes | o contraste é medido | texto normal tem no mínimo 4,5:1 e texto grande e fronteiras de controle têm 3:1 | VM-04 e EV-05 |
| CA-19 | RF-14 | navegação por Tab | cada controle interativo recebe foco | exibe o indicador de D-04 e o foco fica contido e é restaurado nos diálogos | VM-04 e EV-05 |
| CA-20 | RF-15 | as telas da varredura | são abertas em 1440 × 900 e 390 × 844 | não há sobreposição, corte, rolagem horizontal ou perda de função, e os controles seguem utilizáveis a 44 px | VM-05 e EV-06 |
| CA-21 | RF-16 | `documentation/design.md` | a entrega é concluída | registra referências Penpot, mapeamento de tokens, foco D-04 e a lacuna de paletas mistas | revisão do diff e `check:code` |
| CA-22 | RF-17 | o Penpot `stardust` conectado | a estrutura é lida pelo Penpot MCP | os frames desktop de autenticação têm 1440 × 900 e existem `Notificação / Toast`, `Diálogos / Diálogo` e `Diálogos / Diálogo de alerta` | VM-06 e EV-07 |
| CA-23 | RF-18 | o detector `check:test-integrity` e um teste de view alterado em `apps/web/src/ui/**/contexts/**/tests` | o detector é executado | o local é aceito (sem `forbiddenTestPaths`) e os testes dedicados de constantes, providers e fixtures e os locais não reconhecidos continuam rejeitados | `scripts/tests/check-test-integrity.test.mjs` (`test:scripts`) e `check:test-integrity` |

# Technical Contract

## Baseline e fluxo de dados

Estado atual: os componentes compartilhados usam classes Tailwind fixas (`h-10`, `rounded`, `bg-green-400`,
`gray-*`, `red-700`, `custom-outline` roxo); `body` usa `bg-gray-900`; não há infraestrutura de tema. As páginas de
autenticação usam essas classes e valores como `max-w-[320px]`. Fluxo de dados: inalterado. Mudança necessária:
declarar variáveis CSS e utilitários `theme-*`, fazer os componentes compartilhados consumi-los, e ajustar as
páginas de autenticação aos frames.

## Decisões técnicas

| ID | Decisão | Evidência | Alternativas | Motivo e impacto |
| --- | --- | --- | --- | --- |
| D-01 | Variáveis CSS sob `:root[data-theme='stardust-dark']`, `data-theme` no `<html>` do Root e utilitários `theme-*` no Tailwind (18 cores + geometria; sem `space.*`, Primitives, Story ou Achievement). | `design.md` define a variante `<família>-<modo>`; Penpot `Semantic/Dark` e `Geometry`. | Declarar em `:root` sem atributo; nomes sem prefixo (`bg-surface`). | O atributo nomeia a variante e prepara famílias futuras; o prefixo evita colisão com `gray`, `green` e `border`. |
| D-02 | Restilizar `Button`, `Input`, `ErrorMessage`, `Dialog`, `AlertDialog` e Toast no lugar, sem `variant`. | Decisão do usuário e Issue #620 emendada. | Variante opt-in; restilização só da autenticação. | Toda a Web App adota o visual; exige varredura de regressão. |
| D-03 | Overrides de `h-*`, `rounded-*` e cor nos chamadores permanecem como exceções compactas; só mudam se a varredura achar defeito. | 27 arquivos de `Button` com override de altura. | Remover todos os overrides. | Menos edições e menos risco de layout. |
| D-04 | Foco por teclado: `Button`, links, botões sociais, alternador de senha, fechar de diálogo e de toast usam contorno `focus-visible` de 2 px em `action` com offset de 2 px; campos usam borda `action` mais anel de 1 px com `focus-within`. Hover, disabled e loading permanecem. | `design.md` marca o foco como não especificado; o `Input` atual muda a borda para verde. | Só trocar a cor da borda; anel de 4 px roxo atual. | Contraste suficiente sobre `canvas`/`background`; extensão aprovada sem frame. O botão deixa de usar `custom-outline`; a regra global permanece para outros usuários. |
| D-05 | Toast, `Diálogo` e `Diálogo de alerta` foram desenhados no Penpot e aprovados antes de `open`; o Toast é restilizado globalmente. | Não havia frame. | Toast legado; variante opt-in. | Segue a regra de fonte visual canônica. |
| D-06 | Referência desktop 1440 × 900 e mobile 390 × 844. | Frames eram 1920 × 911; Issue pede 1440. | Comparar em 1920. | Alinha Issue e design. |
| D-07 | Ativos reais substituem placeholders; copy do código prevalece. | Issue #620 (preservar copy e animações). | Seguir a copy dos frames. | Evita regressão de produto. |
| D-08 | `Link` ganha `tone: 'highlight' \| 'subtle'` (padrão `subtle`); `OptionsDivider` é criado. | Componentes `Link de texto` (Destaque, Discreto) e `Divisor de opções`. | Estilizar inline. | Mapeia 1 para 1 os componentes do design. |
| D-09 | Paletas mistas entre componentes compartilhados e telas não migradas são aceitas como transição. | Decisão do usuário. | Migrar todas as telas. | Registrada em `design.md`. |
| D-10 | Cada widget modificado que renderiza a árvore inteira em `index.tsx` ganha uma View explícita (`*View.tsx`) e o `index.tsx` passa a ser um Entry Point fino, com os mesmos exports e props: `Button`, `Input`, `AlertDialog`, `Title`, `AppMessage`, `AnimatedForm` (components), `ResetPasswordFormDialog`, `SignInForm` e `SignUpForm`. Hooks existentes e a lógica de UI não mudam; o Entry Point continua chamando-os. `Toast`, `ErrorMessage` e as Views de página já cumprem a Rule. As duas partes modificadas do `Dialog` (`DialogAnimation`, `DialogHeader`) são renomeadas para `DialogAnimationView.tsx` e `DialogHeaderView.tsx` e o barrel `index.tsx` mantém os aliases públicos `Animation` e `Header`; `Dialog.tsx` (container Radix) não é alterado. Os arquivos `*View.tsx` que usam `motion`, Radix ou hooks mantêm `'use client'`. | `ui-layer-rules.md` exige Entry Point e View explícita e não prevê exceção; o Spec Reviewer apontou a violação (ACH-01 a ACH-03); decisão do usuário (a). | Exceção registrada na Rule; manter a estrutura atual. | Segue a Rule sem alterar a Rule; adiciona Views e testes; as APIs públicas e os 68 + 28 + 14 + 9 consumidores não mudam. |
| D-11 | Adicionar ao `ALLOWED_TEST_PATH_PATTERNS` de `scripts/check-test-integrity.mjs` um padrão para `apps/(web\|backoffice)/src/ui/**/contexts/**/tests`, com um caso de teste em `scripts/tests/check-test-integrity.test.mjs` e uma frase em `documentation/tooling.md`. Os padrões proibidos (constantes, providers, fixtures) não mudam. | ACH-01: `check:test-integrity` falhou com `ToastView.test.tsx: test file is outside allowed test locations`; o arquivo é pré-existente em `contexts/ToastContext/Toast/tests`, `tooling.md` e `sdd.md` já permitem testes de views colocalizados, e a Spec `supabase-local-development` já alterou o mesmo script e seu teste. Decisão do usuário (opção b). | Reverter o teste e remover a linha `Modify` do Toast, deixando o novo markup sem teste atualizado. | O detector estava mais estreito que a política documentada; o ajuste é mínimo e mantém todas as rejeições existentes. |
| D-12 | Manter a escala da fonte raiz de `global.css`; a tipografia mobile diverge dos frames por aproximadamente 9,5% (DV-09). | ACH-02: `html { font-size: 94.75% }` até 1080 px e `90.5%` até 720 px; medições em `results-signin-mobile.json`. Decisão do usuário (opção a). | Remover ou escopar a regra para a Web App inteira. | Remover mudaria todas as telas, contra RF-15 e a Issue #620. |
| D-13 | `Hero` permanece sem alteração; a citação diverge do frame (DV-10). | ACH-03: `components/Hero/index.tsx` está fora do mapa e exigiria extração de View. Decisão do usuário (opção b). | Incluir `Hero` no mapa e restilizar. | Menor escopo; logo e ilustração já coincidem. |
| D-14 | Atualizar `.code-multivitals-baseline.json` com `npm run update:complexity-baseline` depois de revisar as entradas: Views e componentes extraídos por D-10 e as Views criadas nesta entrega entram como funções novas no baseline, todas em nível de aviso (índice de manutenibilidade de JSX, comprimento de função de 41 a 61 linhas, complexidade ciclomática 12 no `InputView`), nenhuma em nível de erro. | CI-01: `check-code-complexity` do Web reprovou com 22 funções piores que o baseline após o ACH-15; `tooling.md` permite atualizar o baseline após revisão explícita das alterações de complexidade. Decisão do usuário (2026-11-07). | Refatorar as 22 funções para sair do nível de aviso. | As Views só renderizam e não têm lógica a simplificar; refatorar invalidaria Views já comparadas com o Penpot e revisadas. O diff do baseline foi conferido por função: 15 entradas novas, 3 removidas e 12 remedidas (nenhuma em nível de erro), todas em arquivos desta Spec, e o total de erros do baseline caiu de 243 para 242. |

## Mapa canônico de paths afetados

### Web — tokens e Root

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/tailwind.config.js` | Modify | `theme.extend.colors.theme`, `borderRadius.theme`, `height['theme-control']`, `spacing` e `borderWidth` de controle | Utilitários `theme-*` apontam para variáveis CSS; nada existente é removido | `global.css` | build e `check:types` |
| `apps/web/src/ui/global/styles/global.css` | Modify | Bloco `:root[data-theme='stardust-dark']` com as variáveis `--theme-*` | Valores iguais aos tokens `Semantic/Dark` e `Geometry` do Penpot; `.custom-outline` permanece | Tailwind | VM-01 |
| `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx` | Modify | `RootLayoutView` | `<html data-theme='stardust-dark'>`; `body` passa a usar `bg-theme-background` | `global.css` | VM-01 |

### Web — componentes compartilhados

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/widgets/components/Button/index.tsx` | Modify | `export const Button = ButtonView` | Entry Point fino; mesmo export `Button` e mesmas props (`ButtonProps`); o export `ButtonComponent` não tem consumidor externo e é removido | `ButtonView` | `Button/tests/ButtonView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/Button/ButtonView.tsx` | Create | `ButtonView = forwardRef<HTMLButtonElement, ButtonProps>(...)` | Classes de RF-02 e foco D-04; `asChild`, `isLoading`, `disabled`, `testId`, `whileTap` preservados; `twMerge` mantém overrides | `Loading`, `motion`, `tailwind-merge` | `Button/tests/ButtonView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/Button/tests/ButtonView.test.tsx` | Create | `describe('ButtonView')` | Cobre padrão, `isLoading`, `disabled`, `asChild`, `testId`, override de `className` e classes de foco | Testing Library | este arquivo |
| `apps/web/src/ui/global/widgets/components/Input/index.tsx` | Modify | `export const Input = forwardRef(InputComponent)` | Entry Point: chama `useInput(type)` e `useId()` e passa `id`, `innerType` e `onEyeClick` à View; mesmas props e mesmo `ref` | `useInput`, `InputView` | `Input/tests/InputView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/Input/InputView.tsx` | Create | `InputView = forwardRef<HTMLInputElement, InputViewProps>(...)` com `InputViewProps = InputProps & { id: string; innerType: string; onEyeClick: () => void }` | Tokens de campo, estados padrão, foco, ativo e erro; `aria-label` no alternador (`Mostrar senha` / `Ocultar senha`) | `Icon`, `ErrorMessage` | `Input/tests/InputView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/Input/tests/InputView.test.tsx` | Create | `describe('InputView')` | Cobre rótulo, ícone, erro, ativo, alternador de senha e `testId` | Testing Library | este arquivo |
| `apps/web/src/ui/global/widgets/components/ErrorMessage/ErrorMessageView.tsx` | Modify | `ErrorMessageView({ children, className }: ComponentProps<'p'>)` | Texto em `danger` 14/500 | `tailwind-merge` | VM-02 |
| `apps/web/src/ui/global/widgets/components/Dialog/DialogAnimationView.tsx` | Create | `DialogAnimationView({ children, className }: DialogAnimationProps)` | Substitui `DialogAnimation.tsx` com o mesmo contrato; superfície, borda `border-quiet` e raio por token; animação inalterada | `motion` | VM-02 |
| `apps/web/src/ui/global/widgets/components/Dialog/DialogAnimation.tsx` | Remove | `DialogAnimation` | Removido; o alias `Animation` do barrel passa a apontar para `DialogAnimationView` | não se aplica | não se aplica |
| `apps/web/src/ui/global/widgets/components/Dialog/DialogHeaderView.tsx` | Create | `DialogHeaderView({ children, className }: DialogHeaderProps)` | Substitui `DialogHeader.tsx` com o mesmo contrato; título 18/600, divisor `border-quiet`, fechar 44 × 44 com foco D-04 | Radix Dialog, Phosphor | VM-02 |
| `apps/web/src/ui/global/widgets/components/Dialog/DialogHeader.tsx` | Remove | `DialogHeader` | Removido; o alias `Header` do barrel passa a apontar para `DialogHeaderView` | não se aplica | não se aplica |
| `apps/web/src/ui/global/widgets/components/Dialog/index.tsx` | Modify | `export { Dialog as Container, DialogAnimationView as Animation, DialogHeaderView as Header, … }` | Barrel mantém os nomes públicos `Animation` e `Header`; nenhum consumidor muda | `DialogAnimationView`, `DialogHeaderView` | VM-02 |
| `apps/web/src/ui/global/widgets/components/Dialog/DialogContent.tsx` | Modify | `DialogContent({ children, className, animationClassName }: DialogProps)` | Importa `DialogAnimationView`; contrato e props inalterados | `DialogAnimationView` | VM-02 |
| `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx` | Modify | `export { Component as AlertDialog }` | Entry Point: chama `useAlertDialog`, expõe `AlertDialogRef` por `useImperativeHandle` e delega à View; mesma API | `useAlertDialog`, `AlertDialogView` | `AlertDialog/tests/AlertDialogView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/AlertDialog/AlertDialogView.tsx` | Create | `AlertDialogView(props: AlertDialogViewProps)` com `AlertDialogViewProps = Omit<AlertDialogProps, 'onOpenChange' \| 'shouldPlayAudio'> & { animation: AnimationName \| null; isRendered: boolean; isOpen: boolean; containerRef: RefObject<HTMLElement \| null>; onOpenChange: (isOpen: boolean) => void }` (aqui `onOpenChange` é o `handleOpenChange` do hook) | Título centralizado 16/600, divisor `border-quiet`, superfície por `DialogAnimation`; overlay e Radix preservados | `DialogAnimation`, `Animation`, `Hydration`, Radix AlertDialog | `AlertDialog/tests/AlertDialogView.test.tsx` |
| `apps/web/src/ui/global/widgets/components/AlertDialog/tests/AlertDialogView.test.tsx` | Create | `describe('AlertDialogView')` | Cobre título, corpo, ação, cancelar opcional e animação (Radix com mock) | Testing Library | este arquivo |
| `apps/web/src/ui/global/contexts/ToastContext/Toast/ToastView.tsx` | Modify | `ToastView(props: Props)` | Visual do componente `Toast`; mesmas props, variants de animação, barra temporizada e `Fechar mensagem` | Radix Toast, `Icon`, `motion` | `Toast/tests/ToastView.test.tsx` |
| `apps/web/src/ui/global/contexts/ToastContext/Toast/tests/ToastView.test.tsx` | Modify | `describe('ToastView')` | Seletor da barra e asserções de tipo atualizados para o novo markup | Testing Library | este arquivo |

### Web — autenticação

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/auth/widgets/components/Title/index.tsx` | Modify | `export const Title = TitleView` | Entry Point fino; mesma API (`title`, `text`, `icon`) | `TitleView` | `Title/tests/TitleView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/Title/TitleView.tsx` | Create | `TitleView({ title, text, icon }: TitleProps)` | Componente `Autenticação / Título` | `Icon` | `Title/tests/TitleView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/Title/tests/TitleView.test.tsx` | Create | `describe('TitleView')` | Cobre título, texto e ícone | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/components/Link/LinkView.tsx` | Modify | `LinkView({ children, href, testId, tone = 'subtle' }: Props)` com `tone: 'highlight' \| 'subtle'` | `highlight` usa `accent-text` 14/500; `subtle` usa `text-secondary` 14/400; alvo de 44 px e foco D-04 | `next/link` | `Link/tests/LinkView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/Link/tests/LinkView.test.tsx` | Create | `describe('LinkView')` | Cobre os dois tons, `href` e `testId` | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/components/OptionsDivider/index.tsx` | Create | `export const OptionsDivider = OptionsDividerView` | Entry Point | `OptionsDividerView` | VM-02 |
| `apps/web/src/ui/auth/widgets/components/OptionsDivider/OptionsDividerView.tsx` | Create | `OptionsDividerView({ label }: { label: string })` | Linha, rótulo e linha, conforme `Divisor de opções` | tokens `theme-*` | `OptionsDivider/tests/OptionsDividerView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/OptionsDivider/tests/OptionsDividerView.test.tsx` | Create | `describe('OptionsDividerView')` | Cobre o rótulo e as duas linhas | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/components/AppMessage/index.tsx` | Modify | `export const AppMessage = AppMessageView` | Entry Point fino; mesma API (`title`, `subtitle`, `footer`) | `AppMessageView` | `AppMessage/tests/AppMessageView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/AppMessage/AppMessageView.tsx` | Create | `AppMessageView({ title, subtitle, footer }: AppMessageProps)` | Título 18/400 `text-primary`, subtítulo 16/400 `text-secondary`, Lottie, largura do frame; animação de entrada e saída preservada | `Animation`, `motion` | `AppMessage/tests/AppMessageView.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/AppMessage/tests/AppMessageView.test.tsx` | Create | `describe('AppMessageView')` | Cobre título, subtítulo e rodapé (Lottie e motion com mock) | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/components/AnimatedForm/index.tsx` | Modify | `export const AnimatedForm = AnimatedFormView` | Entry Point fino; mesma API (`isVisible`, `children`) | `AnimatedFormView` | `AnimatedForm/tests/AnimatedForm.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/AnimatedForm/AnimatedFormView.tsx` | Create | `AnimatedFormView({ isVisible, children }: AnimatedFormProps)` | Largura máxima do formulário conforme o frame (392 px); animação e `data-testid='animated-form'` preservados | `motion` | `AnimatedForm/tests/AnimatedForm.test.tsx` |
| `apps/web/src/ui/auth/widgets/components/AnimatedForm/tests/AnimatedForm.test.tsx` | Modify | `describe('AnimatedForm')` | Passa a importar `AnimatedFormView`; os casos e asserções existentes permanecem | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInPageView.tsx` | Modify | `SignInPageView(props: Props)` | Estrutura do frame: Título, sociais, `OptionsDivider`, campos, links `highlight`; margem de 24 px no mobile; mesmos `testId` e props | `Link`, `OptionsDivider`, `SocialLinks`, `SignInForm`, `AnimatedHero` | `SignIn/tests/SignInPageView.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/index.tsx` | Modify | `SignInForm({ onSubmit }: SignInFormProps)` | Entry Point: chama `useSignInForm(onSubmit)` e delega `errors`, `isLoading`, `register` e `handleSubmit` à View; mesma API | `useSignInForm`, `SignInFormView` | `SignIn/SignInForm/tests/SignInForm.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SignInForm/SignInFormView.tsx` | Create | `SignInFormView(props: SignInFormViewProps)` com `errors`, `isLoading`, `register`, `handleSubmit` | Espaçamento entre campos e botão conforme o frame; `testId` e comportamento inalterados | `Input`, `Button` | `SignIn/SignInForm/tests/SignInForm.test.tsx` (existente, widget de formulário) |
| `apps/web/src/ui/auth/widgets/pages/SignIn/SocialLinks/SocialLinksView.tsx` | Modify | `SocialLinksView()` | Componente `Botão social` (superfície, borda, 44 px, 8 px, ícone real) e foco D-04; `aria-label` atuais | `next/link`, `next/image` | VM-02 |
| `apps/web/src/ui/auth/widgets/pages/SignIn/AnimatedHero/AnimatedHeroView.tsx` | Modify | `AnimatedHeroView({ isVisible }: Props)` | Painel Hero com fundo `surface`; animação de saída e `data-testid='animated-hero'` preservados | `Hero`, `motion` | `SignIn/AnimatedHero/tests/AnimatedHeroView.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpPageView.tsx` | Modify | `SignUpPageView(props: Props)` | Layout do frame, fundo animado em tela cheia (DV-12), link `subtle`, copy "Verifique…"; mesmos `testId` e props | `Title`, `Link`, `Button`, `SignUpForm`, `Animation`, `AnimatedOpacity` | `SignUp/tests/SignUpPageView.test.tsx` |
| `apps/web/src/ui/auth/widgets/pages/SignUp/tests/SignUpPageView.test.tsx` | Modify | `describe('SignUpPageView')` | Acrescenta a asserção de "Verifique" e a ausência de "Verique" | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/pages/SignIn/tests/SignInPageView.test.tsx` | Modify | `describe('SignInPageView')` | Acrescenta as asserções do título, do divisor "ou" e dos links `highlight` | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/pages/ResetPassword/tests/ResetPasswordPageView.test.tsx` | Modify | `describe('ResetPasswordPageView')` | Acrescenta as asserções do contêiner de 384 px com o link `subtle` e do estado autorizado; substitui a asserção vacuosa | Testing Library | este arquivo |
| `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/index.tsx` | Modify | `SignUpForm({ profileService, isSubmitting, onSubmit }: Props)` | Entry Point: chama `useSignUpForm` e delega estado, `register` e `handleSubmit` à View; mesma API | `useSignUpForm`, `SignUpFormView` | `SignUp/SignUpForm/tests/SignUpForm.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpForm/SignUpFormView.tsx` | Create | `SignUpFormView(props: SignUpFormViewProps)` com `errors`, `isNameValid`, `isEmailValid`, `isPasswordValid`, `isSubmitting`, `register`, `handleSubmit` | Dicas de validação em `text-secondary`, espaçamento do frame; revelação progressiva e `testId` preservados | `Input`, `Button`, `AnimatedContainer` | `SignUp/SignUpForm/tests/SignUpForm.test.tsx` (existente, widget de formulário) |
| `apps/web/src/ui/auth/widgets/pages/ResetPassword/ResetPasswordPageView.tsx` | Modify | `ResetPasswordPageView(props: Props)` | Conteúdo de 384 px (342 px no mobile), título 24/600, instrução, campo, botão, link `subtle`; remove o `className` inconsistente do `Input` | `Input`, `Button`, `Link`, `AppMessage`, `ResetPasswordFormDialog` | `ResetPassword/tests/ResetPasswordPageView.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/ResetPassword/ResetPasswordFormDialog/index.tsx` | Modify | `ResetPasswordFormDialog({ children, onNewPasswordSubmit, onPasswordReset }: Props)` | Entry Point: resolve `useRestContext`, chama `useResetPasswordFormDialog` e delega à View; mesma API | `useRestContext`, `useResetPasswordFormDialog`, `ResetPasswordFormDialogView` | `ResetPassword/ResetPasswordFormDialog/tests/ResetPasswordFormDialog.test.tsx` (existente) |
| `apps/web/src/ui/auth/widgets/pages/ResetPassword/ResetPasswordFormDialog/ResetPasswordFormDialogView.tsx` | Create | `ResetPasswordFormDialogView(props: ResetPasswordFormDialogViewProps)` com `children`, `errors`, `isSubmitting`, `alertDialogRef`, `register`, `handleSubmit`, `onOpenChange` | Diálogo `Nova senha` e `Senha redefinida` conforme o Penpot; copy, `testId` e fluxo preservados | `Dialog`, `AlertDialog`, `Input`, `Button` | `ResetPassword/ResetPasswordFormDialog/tests/ResetPasswordFormDialog.test.tsx` (existente, widget de formulário) |
| `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/AccountConfirmationPageView.tsx` | Modify | `AccountConfirmationPageView(props: Props)` | Estados espera, nova tentativa e perfil criado conforme os frames; `testId` e props preservados | `AppMessage`, `Loading`, `Button`, `UserCreationPendingMessage` | integração Web (existente) |
| `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/SocialAccountConfirmationPageView.tsx` | Modify | `SocialAccountConfirmationPageView(props: Props)` | Estados conectando, espera e perfil criado conforme os frames; props preservadas | `AppMessage`, `Loading`, `Button`, `UserCreationPendingMessage` | `SocialAccountConfirmation/tests/useSocialAccountConfirmationPage.test.ts` (existente) |
| `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/UserCreationPendingMessage/UserCreationPendingMessageView.tsx` | Modify | `UserCreationPendingMessageView({ quote, handleAnimationComplete }: Props)` | Frase de espera 18/400 `text-secondary`; animação `BlurText` preservada | `BlurText` | VM-02 |

### Documentação

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `documentation/design.md` | Modify | Seções 3, 10 e 12 | Referências Penpot e componentes novos, mapeamento `theme-*`, foco D-04 e lacuna de paletas mistas | Penpot `stardust` | revisão do diff |

### Detector de integridade de testes

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `scripts/check-test-integrity.mjs` | Modify | `ALLOWED_TEST_PATH_PATTERNS` | Novo padrão aceita `apps/(web\|backoffice)/src/ui/**/contexts/**/tests`; `FORBIDDEN_TEST_SUBJECT_PATTERNS` e os demais padrões permanecem | Git diff | `scripts/tests/check-test-integrity.test.mjs` |
| `scripts/tests/check-test-integrity.test.mjs` | Modify | caso de teste do detector | Prova que um teste de view em `contexts/**/tests` é aceito e que os testes dedicados de constantes, providers e fixtures seguem rejeitados | Node test runner | este arquivo (`test:scripts`) |
| `documentation/tooling.md` | Modify | parágrafo de `check:test-integrity` | Registra `contexts/**/tests` entre os locais permitidos de testes de views e hooks | detector | revisão do diff |

### Baseline de complexidade

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `.code-multivitals-baseline.json` | Modify | entradas das funções dos arquivos desta Spec | Regenerado por `npm run update:complexity-baseline` e revisado por função (D-14); nenhuma entrada fora dos arquivos desta Spec muda | `scripts/check-complexity.mjs` | `check:complexity -w @stardust/web` |

## Interfaces, ports e assinaturas

Esta entrega não cria nem altera interface, port, repository ou service. As únicas assinaturas novas ou alteradas
são de componentes de UI:

- `LinkView(props: { children: ReactNode; href: string; testId?: string; tone?: 'highlight' | 'subtle' }): JSX.Element`.
- `OptionsDividerView(props: { label: string }): JSX.Element` e `OptionsDivider = OptionsDividerView`.
- `ButtonProps`, `InputProps`, `AlertDialogProps`, `ToastView.Props`, `DialogHeaderProps` e `DialogAnimationProps`
  mantêm exatamente os campos atuais.

## Detalhamento da camada UI

- **Entry Point / View / Hook.** As páginas de autenticação mantêm `index.tsx` (Entry Point), `*PageView.tsx` e
  hooks (`useSignInPage`, `useSignUpPage`, `useResetPassword`, `useAccountConfirmationPage`,
  `useSocialAccountConfirmationPage`) sem alteração de lógica. `OptionsDivider` tem Entry Point e View sem hook.
  Navegação continua por `useNavigation`/provider existente.
- **Estados.** Loading (`isLoading` do `Button`, spinner de espera), erro (campos, mensagens e toasts), vazio (não
  se aplica) e conteúdo seguem os frames; recovery é a nova tentativa manual.
- **Responsividade.** Hero visível a partir de `lg` (1024 px); abaixo, o formulário ocupa a largura com margem de
  24 px. Sem rolagem horizontal em 390 px.
- **Acessibilidade.** Rótulos visíveis, mensagens de erro associadas aos campos, `aria-label` nos controles de
  ícone, foco D-04, contraste AA, `aria-live` do RocketAnimation preservado.
- **Referência de implementação similar.** `Button`/`Input` atuais; `LinkView` atual; `Toast` atual.

## Auditoria estrutural de UI

| Widget | Entry Point | View | Hook | Regra aplicável | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| `SignInPage` | `pages/SignIn/index.tsx` | `SignInPageView.tsx` | `useSignInPage.ts` | ui-layer-rules | passa; lógica inalterada |
| `SignUpPage` | `pages/SignUp/index.tsx` | `SignUpPageView.tsx` | `useSignUpPage.ts` | ui-layer-rules | passa; lógica inalterada |
| `ResetPasswordPage` | `pages/ResetPassword/index.tsx` | `ResetPasswordPageView.tsx` | `useResetPassword.ts` | ui-layer-rules | passa; lógica inalterada |
| `ResetPasswordFormDialog` | `ResetPasswordFormDialog/index.tsx` | `ResetPasswordFormDialogView.tsx` (novo) | `useResetPasswordFormDialog.ts` | ui-layer-rules | passa após extração; o hook acessa `useToastContext` (pré-existente, fora de escopo) |
| `SignInForm` | `SignIn/SignInForm/index.tsx` | `SignInFormView.tsx` (novo) | `useSignInForm.ts` | ui-layer-rules | passa após extração |
| `SignUpForm` | `SignUp/SignUpForm/index.tsx` | `SignUpFormView.tsx` (novo) | `useSignUpForm.ts` | ui-layer-rules | passa após extração |
| `AccountConfirmationPage` | `pages/AccountConfirmation/index.tsx` | `AccountConfirmationPageView.tsx` | `useAccountConfirmationPage.ts` | ui-layer-rules | passa |
| `SocialAccountConfirmationPage` | `pages/SocialAccountConfirmation/index.tsx` | `SocialAccountConfirmationPageView.tsx` | `useSocialAccountConfirmationPage.ts` | ui-layer-rules | passa |
| `Link` | `components/Link/index.tsx` | `LinkView.tsx` | não se aplica | ui-layer-rules | passa |
| `OptionsDivider` | `components/OptionsDivider/index.tsx` | `OptionsDividerView.tsx` | não se aplica | ui-layer-rules | passa (novo) |
| `SocialLinks` e `AnimatedHero` | `SocialLinks/index.tsx` e `AnimatedHero/index.tsx` | `SocialLinksView.tsx` e `AnimatedHeroView.tsx` | não se aplica | ui-layer-rules | passa |
| `UserCreationPendingMessage` | `UserCreationPendingMessage/index.tsx` | `UserCreationPendingMessageView.tsx` | `useUserCreationPendingMessage.ts` | ui-layer-rules | passa; lógica inalterada |
| `Title` | `components/Title/index.tsx` | `TitleView.tsx` (novo) | não se aplica | ui-layer-rules | passa após extração |
| `AppMessage` | `components/AppMessage/index.tsx` | `AppMessageView.tsx` (novo) | não se aplica | ui-layer-rules | passa após extração |
| `AnimatedForm` (components) | `components/AnimatedForm/index.tsx` | `AnimatedFormView.tsx` (novo) | não se aplica | ui-layer-rules | passa após extração |
| `Button` | `components/Button/index.tsx` | `ButtonView.tsx` (novo) | não se aplica | ui-layer-rules | passa após extração |
| `Input` | `components/Input/index.tsx` | `InputView.tsx` (novo) | `useInput.ts` | ui-layer-rules | passa após extração; o Entry Point chama o hook |
| `AlertDialog` | `components/AlertDialog/index.tsx` | `AlertDialogView.tsx` (novo) | `useAlertDialog.ts` | ui-layer-rules | passa após extração; o hook acessa `useAudioContext` (pré-existente, fora de escopo) |
| `ErrorMessage` | `components/ErrorMessage/index.tsx` | `ErrorMessageView.tsx` | não se aplica | ui-layer-rules | passa; só estilo |
| `Toast` | `ToastContext/Toast/index.tsx` | `ToastView.tsx` | `useToast.ts` | ui-layer-rules | passa; só estilo |
| `Dialog` (partes `DialogAnimation` e `DialogHeader`) | `components/Dialog/index.tsx` (barrel, com os aliases públicos `Animation` e `Header`) | `DialogAnimationView.tsx` e `DialogHeaderView.tsx` (renomeadas com o sufixo `View`) | `useDialog.ts` (usado por `Dialog.tsx`, sem alteração) | ui-layer-rules | as duas partes passam; `Dialog.tsx` (container Radix com `useDialog` e `useImperativeHandle`) não é alterado, e a ausência de uma View própria do container é pré-existente e fora de escopo; `DialogContent.tsx` só troca o import de `DialogAnimationView` |

Sem alteração e fora do mapa: `RocketAnimation`, `Hero`, `Loading`, `Animation` e `AnimatedContainer`. Os
requisitos de fundo animado, spinner e painel Hero são cumpridos pelos arquivos acima (por exemplo, o fundo
`surface` do Hero em `AnimatedHeroView.tsx`) e pelos ativos reais existentes.

## Sensores aplicáveis

`format`, `check:code`, `check:types`, `test:unit`, `check:architecture`, `test:integration`, `test:coverage` e
`check:coverage` para `@stardust/web` (respeitando `coverage-baseline.json`), `check:complexity` para `@stardust/web`
(contra `.code-multivitals-baseline.json`), `check:test-integrity` e `check:spec-implementation`; `test:scripts` cobre o detector alterado (RF-18).

# Validation Contract

## Testes automatizados

| Alvo | Camada | Cenários | CA |
| --- | --- | --- | --- |
| `ButtonView` | unidade (View) | padrão, `isLoading`, `disabled`, `asChild`, `testId`, override de `className`, classes de foco | CA-03 |
| `InputView` | unidade (View) | padrão, ícone, erro, ativo, senha com alternador, `testId` | CA-04 |
| `AlertDialogView` | unidade (View, Radix com mock) | título, corpo, ação, cancelar opcional, animação | CA-05 |
| `TitleView` e `AppMessageView` | unidade (View) | título, texto, ícone, subtítulo e rodapé | CA-14 |
| `AnimatedFormView` | unidade (View) | casos existentes retargetados para a View | CA-15 |
| `SignInForm`, `SignUpForm` e `ResetPasswordFormDialog` | unidade de widget de formulário (exceção de `widget-tests-rules.md` §2 para react-hook-form) | suítes existentes preservadas, sem redução de casos ou asserções | CA-15 |
| `ToastView` | unidade | tipos `error` e `success`, barra temporizada reiniciada por `animationKey` | CA-06 |
| `LinkView` | unidade | `tone` `highlight` e `subtle`, `href`, `testId` | CA-14 |
| `OptionsDividerView` | unidade | rótulo e linhas | CA-14 |
| `SignUpPageView` | unidade | copy "Verifique" e ausência de "Verique" | CA-09, CA-10 |
| Suítes existentes de unidade e Playwright (`auth`, `challenging`, `profile`, `reporting`, `shop`, `space`) | unidade e integração | regressão | CA-15 |
| `check-test-integrity.test.mjs` | unidade (script, Node test runner) | local `contexts/**/tests` aceito; constantes, providers e fixtures e locais não reconhecidos rejeitados | CA-23 |

Os testes de integração `apps/web/src/app/tests/**` não são alterados; testes de regressão visual automatizada
estão fora de escopo.

## Comandos

```text
npm run format
npm run check:code
npm run check:types
npm run test:unit
npm run check:architecture -w @stardust/web
npm run check:complexity -w @stardust/web
npm --workspace @stardust/web run test:integration
npm run test:coverage -w @stardust/web
npm run check:coverage -- @stardust/web
npm run check:test-integrity
npm run test:scripts
npm run check:spec-definition -- documentation/features/auth/design-system-alignment/spec.md
npm run check:spec-implementation -- documentation/features/auth/design-system-alignment/spec.md --base <commit-base>
```

## Validações manuais

| VM | Cenário | Evidência | CA |
| --- | --- | --- | --- |
| VM-01 | Abrir `/auth/sign-in` e ler `data-theme` e as variáveis `--theme-*` e os utilitários no navegador. | EV-01 | CA-01, CA-02 |
| VM-02 | Para cada linha da matriz de referências visuais, exportar o frame no Penpot e capturar a rota no estado e viewport indicados com Playwright em modo de teste (`ServerMock`) e comparar âncoras, cores, tipografia, espaçamento, raio e altura de controles. Capturar também `scrollWidth` em 390 px. | EV-02 | CA-05 a CA-09, CA-11 a CA-14, CA-17 |
| VM-03 | Subir Server e Web locais, carregar as contas seed com `export-web-app-e2e-env.mjs --seed`, percorrer Sign-in até `/space` e Sign-up até a confirmação de e-mail e registrar os endpoints `2xx`. | EV-04 | CA-16 |
| VM-04 | Percorrer Tab em cada rota, em `Dialog`, `AlertDialog` e Toast, confirmando o indicador D-04 e medindo contraste dos pares de cor. | EV-05 | CA-03, CA-05, CA-18, CA-19 |
| VM-05 | Varredura de `/space`, lista e editor de desafios, `/profile`, `/shop`, uma lição, ranking e playground em 1440 × 900 e 390 × 844, com checklist de sobreposição, corte, rolagem horizontal, controles utilizáveis a 44 px, contraste AA e foco visível; sem comparação de pixels. | EV-06 | CA-20 |
| VM-06 | Ler a estrutura do Penpot `stardust` pelo MCP e exportar os boards e componentes listados. | EV-07 | CA-22 |

## Evidências esperadas

| EV | Conteúdo |
| --- | --- |
| EV-01 | Computed style de `html` e de elementos que consomem `theme-*`, comparados com os valores do Penpot. |
| EV-02 | Pares de screenshots Penpot × Web por linha da matriz, com resultado e divergências. |
| EV-03 | Saída dos comandos de sensores, com data e SHA. |
| EV-04 | Registro do caminho feliz de Sign-in e Sign-up com status dos endpoints essenciais. |
| EV-05 | Tabela de contraste e registro de foco por teclado. |
| EV-06 | Checklist e screenshots da varredura de regressão por rota e viewport. |
| EV-07 | Leitura da estrutura do Penpot e exportações dos boards e componentes. |

# Documentation alignment and revision history

## Alinhamento documental

- **Issue #620:** corpo e título emendados em 2026-11-03, com aprovação explícita do usuário, para refletir a
  restilização dos componentes compartilhados em toda a Web App, o Penpot como fonte visual e a varredura de
  regressão.
- **`documentation/design.md`:** atualizado conforme RF-16 durante a implementação.
- **`documentation/tooling.md`:** uma frase registra `contexts/**/tests` entre os locais permitidos (RF-18).
- **`.code-multivitals-baseline.json`:** regenerado e revisado por função após o CI-01 (D-14).
- **PRDs:** sem alteração; os requisitos de comportamento permanecem.
- **Penpot `stardust`:** frames desktop de autenticação redimensionados para 1440 × 900; componentes `Toast`,
  `Diálogo` e `Diálogo de alerta` adicionados.
- **Rule Pack:** `ui-layer-rules.md`, `web-application-rules.md`, `widget-tests-rules.md`,
  `web-app-routes-testing-rules.md`, `code-conventions-rules.md` e `mcp-rules.md`. Autoridades:
  `AGENTS.md`, `architecture.md`, `tooling.md`, `sdd.md`.

## Condições de abertura

- Componentes novos do Penpot (`Notificação / Toast`, `Diálogos / Diálogo`, `Diálogos / Diálogo de alerta`)
  revisados e aprovados pelo usuário em 2026-11-03.
- `npm run check:spec-definition` aprovado e revisão do Spec Reviewer com resultado `clear`.
- Sem questões pendentes materiais.

## Histórico de revisões

| Revisão | Data | Mudança |
| --- | --- | --- |
| 1 | 2026-11-03 | Criação a partir da Issue #620 emendada, após Grilling com o usuário (viewport 1440, ativos reais, tokens, foco, restilização global dos componentes, varredura de regressão, paletas mistas, ícones Phosphor mantidos). |
| 1 | 2026-11-03 | Ajuste de draft após a primeira revisão do Spec Reviewer (ACH-01 a ACH-03, resolvidos com a decisão do usuário (a)): D-10 reescrito para extrair Views dos widgets sem View; mapa de paths com `ButtonView`, `InputView`, `AlertDialogView`, `TitleView`, `AppMessageView`, `AnimatedFormView`, `ResetPasswordFormDialogView`, `SignInFormView` e `SignUpFormView`; auditoria estrutural corrigida; testes retargetados às Views; hooks com acesso a contexts registrados como pré-existentes. |
| 1 | 2026-11-03 | Ajuste de draft após a segunda revisão (ACH-04): `DialogAnimation` e `DialogHeader` renomeados para `DialogAnimationView` e `DialogHeaderView` (Create e Remove), com o barrel e `DialogContent.tsx` ajustados e os aliases públicos preservados; tipagem de `AlertDialogViewProps` corrigida. |
| 1 | 2026-11-03 | Spec Reviewer: revisão 1 avaliada, resultado `clear`. Findings verificados e resolvidos: ACH-01 a ACH-03 (extração de Views, auditoria corrigida, testes retargetados às Views) e ACH-04 (partes do `Dialog` renomeadas com o sufixo `View`, aliases do barrel preservados). Observações mantidas para o Evaluation: `Dialog.tsx` sem View e os hooks `useAlertDialog` e `useResetPasswordFormDialog` com acesso a contexts, pré-existentes e fora de escopo. |
| 1 | 2026-11-03 | Spec aberta (`open`) após a aprovação do usuário dos componentes do Penpot. |
| 1 | 2026-11-04 | Correção mecânica de formato, sem mudança de Contract: as células `Change` do mapa canônico deixam de usar crases, para que `check:spec-implementation` leia os 51 paths. Status passa a `in_progress` com o início da implementação. |
| 2 | 2026-11-04 | Emenda durante a implementação, com decisões do usuário (Q4 b, Q5 a, Q6 b e confirmação da emenda): RF-18, CA-23 e D-11 (detector `check:test-integrity` aceita `ui/**/contexts/**/tests`, com os paths `scripts/check-test-integrity.mjs`, `scripts/tests/check-test-integrity.test.mjs` e `documentation/tooling.md`); D-12 (escala da fonte raiz mantida) e D-13 (`Hero` sem alteração); divergências aprovadas DV-09 a DV-16 (tipografia mobile, citação do `Hero`, Nome em uso, fundo do Sign-up, largura de 512 px dos diálogos, `AlertDialog` sobre o `Dialog`, padding do `Botão` e foco do campo em erro); RF-04 e CA-05, CA-07 e CA-08 ajustados. Origem dos achados ACH-01 a ACH-03, ACH-05 e ACH-06 do Evaluation. |
| 2 | 2026-11-04 | Spec Reviewer: revisão 2 avaliada, resultado `clear`, sem findings. Observação não bloqueante adotada: a frase de `tooling.md` cita testes de views e hooks de `contexts`, igual ao alcance do padrão. A Spec retorna a `in_progress` e o Plan é reconciliado para a revisão 2. |
| 3 | 2026-11-07 | Emenda durante a validação, com decisão do usuário (fundo animado do Sign-up cobrindo a página inteira): DV-01 e DV-12 reescritos; DV-03 ajustado para os 392 px do `Campo de texto`; DV-17 a DV-20 acrescentados após o pacote EV-02 (Penpot × Web) medido em 1440 × 900 e 390 × 844; `SignInPageView.test.tsx` e `ResetPasswordPageView.test.tsx` incluídos no mapa; `AlertDialogViewProps.animation` alinhado a `AnimationName \| null`; linhas da matriz e do mapa do Sign-up atualizadas para o fundo em tela cheia. Sem mudança de requisitos funcionais nem de critérios de aceitação. A Spec volta a `draft` até a revisão do Spec Reviewer. |
| 3 | 2026-11-07 | Spec Reviewer: revisão 3 avaliada, resultado `clear`, sem findings. Observações não bloqueantes adotadas: pipe escapado na assinatura de `AlertDialogViewProps`, `last_updated_at` atualizado, DV-20 cita os 462 px da Web, histórico e dependências de `SignUpPageView` completados e uma frase na matriz sobre as divergências aprovadas. A Spec retorna a `in_progress` e o Plan é reconciliado para a revisão 3. |
| 4 | 2026-11-07 | Emenda após o CI-01 (ACH-15 e comparação com o baseline de complexidade), com decisão do usuário (atualizar o baseline após revisão): D-14 e o path `.code-multivitals-baseline.json` (Modify). Mapa com 57 paths. |
| 4 | 2026-11-07 | Spec Reviewer: revisão 4 avaliada, resultado `clear`, sem findings. Observações não bloqueantes adotadas: `check:complexity` em Sensores e Comandos, item em Escopo incluído, menção no Contexto, no `scope` do front matter e no Alinhamento documental, e D-14 esclarece que nenhuma das 12 entradas remedidas está em nível de erro. |
