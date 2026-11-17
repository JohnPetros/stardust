---
title: Header e navegação lateral do layout Home no Widget Pattern
status: in_progress
revision: 3
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/661
  - type: direct-request
    ref: Decisões de grilling Q1–Q3 e revisão de design em cinco seções, confirmadas nesta task em 2026-11-16
  - type: direct-request
    ref: Revisão 2 (2026-11-17) — ícones Phosphor via `Icon` na navegação e no header do layout Home, alinhados aos componentes `sidebar` e `Espaço / Cabeçalho` do Penpot `stardust`; grilling Q4–Q6 e revisão de design em cinco seções, confirmados nesta task
scope:
  - apps/web/src/ui/profile/widgets/layouts/Home
  - apps/web/src/ui/profile/contexts/SidebarContext
  - apps/web/src/ui/global/widgets/components/Icon
  - apps/web/public/icons
  - Penpot stardust (componentes `sidebar` e `Espaço / Cabeçalho`, apenas os ícones)
last_updated_at: 2026-11-17
---

# Context and scope

A Issue #661 (refactor, label `web`) pede que o header e a navegação lateral do layout Home da Web
(`apps/web/src/ui/profile/widgets/layouts/Home/`) sigam o Widget Pattern das Regras da Camada UI,
sem mudar nenhum comportamento. Não há PRD nem milestone associados: a fonte é a Issue e as
decisões desta task. A Spec é compacta: um único app, fronteiras estáveis e baixo risco.

## Resultado delimitado

- Um widget pai novo, `HomeNavigation`, com Entry Point, View e hook próprios, resolve uma única vez o
  usuário e as ações Notas e Conquistas e compõe `Sidenav` (trilho desktop) e `Sidebar` (gaveta mobile)
  como filhos que ficam só com a View.
- `HomeHeader` continua widget separado: o acesso ao context sai do hook e fica no Entry Point. Na
  revisão 2 o hook `useHomeHeader` deixa de existir (seu único efeito era parar a animação de sequência),
  e o Entry Point só resolve contexts e renderiza a View.
- `Sidenav`, `SidenavButton` e `Sidebar` viram aliases da View (`export const X = XView`), porque não
  têm hook, context nem integração para conectar.
- `useSiderbarContext` passa a se chamar `useSidebarContext`, como renomeação mecânica do arquivo, do
  export, da mensagem de erro e dos importadores.
- Os testes que importam o Entry Point (`Sidenav.test.tsx`, `Sidebar.test.tsx`) são substituídos por
  testes de View e de hook; nenhum teste importa um `index.tsx`.
- Revisão 2 — ícones: os links de navegação (Aprender, Desafios, Loja, Perfil), o botão de expandir a
  sidenav e a moeda do header passam a usar ícones Phosphor (peso bold) pelo componente `Icon`, alinhados aos
  componentes `sidebar` e `Espaço / Cabeçalho` do Penpot `stardust`. O contrato de `Icon` ganha
  `graduation-cap`, `store`, `coins` e `fire`. A sequência do header passa a ser o ícone estático `fire`
  (verde com o dia concluído, cinza caso contrário); a animação Lottie, `useHomeHeader` e
  `streakAnimationRef` saem. Os SVGs `learn.svg`, `challenges.svg` e `shop.svg` ficam sem uso e são removidos.
- Para o usuário, fora os ícones acima, nada muda: textos, breakpoints (trilho em `md+`, gaveta abaixo de
  `md`, `TabNav` no mobile), ids `#sidenav` e `#sidebar`, `aria-controls`, animações das barras, rotas e os
  fluxos de Notas, Conquistas e Sair.

## Fora do escopo

- O redesenho do Penpot (remoção do Ranking, mudança do controle de galáxia): seria uma issue de feature.
  Os boards `sidebar` (112 px) e `Navegação` (268 px) do Penpot `stardust` divergem do código de
  propósito. Na revisão 2 os componentes `sidebar` e `Espaço / Cabeçalho` são referência **apenas dos
  ícones** (DT-03, DT-10): largura, ausência do botão Notas e o board `Navegação` continuam fora.
- Os assets `coin.svg` (usado por `Rewarding`, `Shop`, `Statistics`) e `profile.svg` (usado por `UserAvatar`)
  e o asset Lottie de sequência (usado por `StreakIcon` e `StreakBoard`).
- `AchievementsList`, `StreakBreakDialog`, `SignOutAlertDialog` e os `Animated*`. `NavLink` e `TabNav` só mudam o que os ícones exigem (RF-07).
- O header e a sidebar do Backoffice.
- A fusão de `Sidenav` e `Sidebar` em um único container responsivo.
- Qualquer mudança de Rule, Architecture ou documentação normativa.

## Classificação

Origem: `issue` + `direct-request`. Modo: compacto. Escopo: `apps/web` (camada UI do módulo `profile`).

## Decisões de grilling registradas

- **Q1 → A:** o widget pai novo vive em `Home/HomeNavigation/`, irmão de `Sidenav/` e `Sidebar/`, que
  permanecem onde estão e são importados pela View do pai. Alternativas descartadas: mover `Sidenav/` e
  `Sidebar/` para dentro do pai (cerca de 15 linhas `Remove` + `Create` e churn de imports e mocks) e
  outro nome.
- **Q2 → A:** `Sair` não tem handler a resolver: as Views continuam compondo `SignOutAlertDialog`, que é
  o widget global dono do fluxo. O pai resolve apenas usuário, Notas e Conquistas. Alternativas
  descartadas: injetar o dialog como slot e subir um handler de sign-out para o hook do pai.
- **Q3 → A (revisão 1):** sem `## Design Contract`; a preservação visual é provada por capturas Playwright do
  app real, uma antes e outra depois da mudança, em desktop e mobile. Na revisão 2 ela continua valendo para
  tudo, exceto os ícones de RF-07 e RF-08, cuja fidelidade é provada por VV-01 e VV-02 (Q4).
- **Q4 → A (revisão 2):** sem Design Contract formal. Não há PRD nem registro de revisão de design que cubra os
  componentes `sidebar` e `Espaço / Cabeçalho`; eles entram como referência visual inspecionada (DT-10), e a
  comparação se limita aos ícones (glifo, tamanho, cor e posição). Assunção aceita pelo usuário: não existe
  registro de design review para esses componentes. Alternativa descartada: escrever um PRD e rodar
  `/review-design` (caminho formal, desproporcional a uma troca de ícones; `documentation/prds` é local).
- **Q5 → B ajustada (revisão 2):** remover os SVGs que perdem uso (`learn.svg`, `challenges.svg`, `shop.svg`).
  `coin.svg` fica, pois `Rewarding`, `RocketItemView`, `AvatarItemView`, `InsigniaItemView` e `StatisticsView`
  ainda o usam (verificado por busca nas fontes em 2026-11-17); `profile.svg` fica por causa de `UserAvatar`.
- **Q6 → A (revisão 2):** o `check:complexity` pode exigir refresh do `.code-multivitals-baseline.json`
  (entradas existentes cujas métricas mudaram). O usuário aprovou o refresh do candidato final; o
  `evaluation.md` registra as entradas alteradas.

# Implementation Contract

## Requisitos funcionais

| RF    | Requisito                                                                                                                                                                                                                                                                                                                  | Origem                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| RF-01 | `HomeNavigation` resolve uma única vez o usuário, a rota atual, a navegação e o `SidebarContext`, e entrega a `Sidenav` e `Sidebar` os links, o estado ativo de Notas, a contagem de conquistas resgatáveis, os dados do usuário e os handlers de Notas e Conquistas. `Sidenav` e `Sidebar` só renderizam e não resolvem mais essas dependências. | Issue #661 (escopo), Q1, Q2     |
| RF-02 | Nenhum hook de widget de `HomeNavigation`, `Sidenav`, `SidenavButton` ou `Sidebar` acessa context ou provider, e nenhum Entry Point de `HomeHeader`, `HomeNavigation`, `Sidenav`, `SidenavButton` e `Sidebar` declara estado, efeito ou handler. `HomeHeader` não tem hook de widget (revisão 2, RF-08): o Entry Point só resolve os contexts e renderiza a View. | Issue #661 (escopo e critérios), revisão 2 |
| RF-03 | `Sidenav`, `SidenavButton`, `Sidebar` e `HomeHeader` seguem o Widget Pattern: Entry Point só compõe, View só renderiza, hooks com `function`, e o Entry Point é o alias `export const X = XView` quando não há hook nem integração.                                                                                          | Issue #661 (escopo), UI Rules   |
| RF-04 | `useSiderbarContext` deixa de existir; o hook de consumo do `SidebarContext` passa a se chamar `useSidebarContext` e os importadores o usam. O comportamento do `SidebarContext` não muda.                                                                                                                                  | Issue #661 (escopo e critérios) |
| RF-05 | O visual, os ids do DOM (`#sidenav`, `#sidebar`), `aria-controls`, os breakpoints, as animações das barras e os fluxos de navegação, Notas, Conquistas e Sair permanecem iguais em desktop e mobile, assim como a ordem de empilhamento (`HomeHeader` < `Sidenav` < `Sidebar`). **Exceção da revisão 2:** os ícones listados em RF-07 e RF-08 mudam. | Issue #661 (preservar), Q3, revisão 2 |
| RF-06 | Os testes que importam o Entry Point são substituídos por testes unitários de View e de hook, conforme `widget-tests-rules.md`, e nenhum teste importa `index.tsx`.                                                                                                                                                          | Issue #661 (critérios)          |
| RF-07 | Os links Aprender, Desafios, Loja e Perfil (na `Sidenav` e no `TabNav`), o botão de expandir/recolher a `Sidenav` e a moeda do header usam o componente `Icon` (Phosphor, peso bold) com `graduation-cap`, `terminal`, `store`, `person`, `simple-arrow-left`/`simple-arrow-right` e `coins`, e não mais imagens `/icons/*.svg` nem ícones de outra família. O contrato de `Icon` ganha `graduation-cap`, `store`, `coins` e `fire`. | Revisão 2 (direct-request), Q4, DT-12 |
| RF-08 | A sequência do header mostra o ícone estático `fire` do `Icon`, com `text-green-500` quando o dia de hoje está concluído e `text-gray-300` caso contrário; a animação Lottie `streak`, `useHomeHeader` e `streakAnimationRef` deixam de existir em `HomeHeader`. | Revisão 2 (direct-request), DT-11 |

## Critérios de aceitação

| CA    | RF           | Given                                                                                                                | When                                                                                    | Then                                                                                                                                                                                                                                                                                       | Expected evidence        |
| ----- | ------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| CA-01 | RF-01        | Usuário autenticado com slug, nome, e-mail, avatar e contagem de conquistas resgatáveis                              | `useHomeNavigation` roda                                                                | `links` tem Aprender, Desafios, Loja e Perfil, nessa ordem, com `route` de Perfil igual a `ROUTES.profile.user(slug)`; `rescueableAchievementsCount` é a contagem do usuário; `sidebarUser` tem nome, e-mail e avatar (`image`, `name`) como primitivos                                       | AV-01                    |
| CA-02 | RF-01        | `currentRoute` igual a `ROUTES.notes` ou diferente dela                                                              | `useHomeNavigation` roda e o botão Notas da `Sidenav` ou da `Sidebar` é clicado         | `isNotesActive` é `true` somente em `ROUTES.notes`; `handleNotesClick` chama `goTo(ROUTES.notes)` e as duas barras recebem o mesmo handler; no navegador a rota muda para `/notes`                                                                                                           | AV-01, AV-02, MV-01, MV-02 |
| CA-03 | RF-01        | `isAchievementsListVisible` verdadeiro ou falso                                                                      | `handleAchievementsClick` é chamado e o botão Conquistas da `Sidenav` é clicado         | `setIsAchievementsListVisible` recebe o valor invertido; o botão fica ativo quando a lista está visível e mostra o contador de resgatáveis; no navegador a lista de conquistas abre e fecha                                                                                                  | AV-01, AV-02, MV-01      |
| CA-04 | RF-01        | `user` igual a `null`                                                                                                | `useHomeNavigation` roda e `HomeNavigation` é renderizado                               | O hook devolve `links: []`, `rescueableAchievementsCount: 0` e `sidebarUser: null`; o Entry Point não renderiza nada (como `Sidenav`, `Sidebar` e `HomeHeader` faziam sem usuário)                                                                                                          | AV-01, AV-05 (auditoria) |
| CA-05 | RF-02, RF-08 | Usuário com o dia de hoje concluído ou não, e `HomeHeader` renderizado | `HomeHeaderView` renderiza com `isTodayDone` verdadeiro ou falso | A sequência é o ícone `fire` do `Icon`, tingido de `text-green-500` com o dia concluído e de `text-gray-300` caso contrário, ao lado do número da sequência; as moedas aparecem com o ícone `coins`; não há `Animation`, `useHomeHeader` nem `streakAnimationRef` em `HomeHeader`, e o Entry Point só resolve contexts e renderiza a View | AV-03, AV-04, MV-01 |
| CA-06 | RF-02, RF-03 | O candidato integrado | A auditoria estrutural da UI Rule e as buscas estáticas são executadas | Os Entry Points de `HomeHeader`, `HomeNavigation`, `Sidenav`, `SidenavButton` e `Sidebar` não declaram estado, efeito nem handler; `Sidenav`, `SidenavButton` e `Sidebar` são aliases da View; `useHomeNavigation` é declarado com `function`; nenhum hook de widget desses cinco nem `useHomeLayout` acessa context (o Entry Point `HomeLayout` os resolve); `HomeHeader` não tem hook | AV-04, AV-05 |
| CA-07 | RF-04        | O código da Web                                                                                                      | `useSiderbarContext` é buscado                                                          | Não há ocorrência em `apps/web`; `Home/index.tsx` (`HomeLayout`), `HomeHeader`, `HomeNavigation` e o `index.tsx` do context usam `useSidebarContext`, e o erro lançado fora do provider diz `useSidebarContext must be used inside SidebarProvider`                                                          | AV-04                    |
| CA-08 | RF-05 | Aluno seed autenticado, com capturas "antes" (base `f6c66f636`) e "depois" na mesma seed em 1440×900 e 390×844 | O trilho, a gaveta, as rotas e Notas, Conquistas e Sair são exercitados | `#sidenav` e `#sidebar` existem; `aria-controls` do botão da sidenav é `sidenav` e do botão de menu do header é `sidebar`; o trilho aparece em `md+` e a gaveta abaixo de `md`; a composição das capturas "depois" confere com as "antes" salvo os ícones de RF-07 e RF-08; `GET /auth/account` retorna `200` | MV-01, MV-02 |
| CA-09 | RF-06 | O candidato integrado | Os testes das Views e dos hooks e os gates de baseline rodam | `Sidenav.test.tsx` e `Sidebar.test.tsx` saem; os testes novos passam com contagem confirmada e nenhum importa `index.tsx`; `check:code`, `check:types`, `check:complexity`, `check:architecture`, `check:test-integrity` e `check:spec-implementation` passam | AV-01 a AV-05 |
| CA-10 | RF-07, RF-08 | Os componentes `sidebar` e `Espaço / Cabeçalho` do Penpot `stardust` e o app real autenticado, em desktop 1440×900 | O trilho recolhido e o header são capturados e comparados com os exports do Penpot | Glifo, tamanho, cor e posição dos ícones da navegação, do botão de expandir, da moeda e da sequência conferem com os componentes; largura do board, ausência de Notas e demais divergências ficam fora (DT-10); os links usam `Icon` e não restam imagens `/icons/{learn,challenges,shop}.svg` | VV-01, VV-02, AV-03, AV-04 |

## Matriz de auditoria estrutural

Uma linha por widget alterado, no formato da seção "Auditoria obrigatória de UI" de `ui-layer-rules.md`.
O resultado e a evidência (linhas) são registrados no `evaluation.md`.

| Widget          | Entry Point                                                                                                                                         | View                                                          | Hook                                                                  | Regra aplicada                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `HomeNavigation` | `index.tsx`: resolve `useAuthContext`, `useNavigationProvider` e `useSidebarContext`, chama `useHomeNavigation` e a View; sem estado, efeito ou handler | `HomeNavigationView.tsx`: renderiza `Sidenav` e `Sidebar`      | `useHomeNavigation.ts`: `function`, parâmetros, sem context            | Widget Pattern; Entry Point resolve dependências; hook sem context                           |
| `HomeHeader` | `index.tsx`: resolve `useAuthContext` e `useSidebarContext` e renderiza a View; sem hook, `useRef`, estado, efeito ou handler | `HomeHeaderView.tsx`: moedas com `Icon coins` e sequência com `Icon fire`, sem `Animation` | não há (RF-08) | Entry Point resolve dependências e compõe; View só renderiza |
| `Sidenav` | `index.tsx`: `export const Sidenav = SidenavView` | `SidenavView.tsx` (alterada: botão de expandir com `Icon simple-arrow-left/right` e tipo `IconName` dos links) | não há | Entry Point como alias da View |
| `SidenavButton` | `index.tsx`: `export const SidenavButton = SidenavButtonView`                                                                                       | `SidenavButtonView.tsx` (inalterada)                           | não há                                                                | Entry Point como alias da View                                                              |
| `NavLink` | `index.tsx` (alterado só no tipo de `icon`): resolve `useNavigationProvider` e deriva `isActive` por comparação de rota; sem estado, efeito ou handler (resolução pré-existente, fora do escopo da revisão 1) | `NavLinkView.tsx` (alterada: `Icon` no lugar de `Image`) | não há | Entry Point resolve dependências; View só renderiza |
| `TabNav` | `index.tsx` (inalterado) | `TabNavView.tsx` (alterada só no tipo de `icon`) | não há | View só renderiza |
| `Sidebar`       | `index.tsx`: `export const Sidebar = SidebarView`                                                                                                   | `SidebarView.tsx` (inalterada)                                 | não há                                                                | Entry Point como alias da View                                                              |

# Technical Contract

## Decisões técnicas

| DT    | Decisão                                                                                                                                                                                                                                                                                                                                                                                         | Evidência e alternativas                                                                                                                                                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DT-01 | `HomeNavigation` é irmão de `Sidenav/` e `Sidebar/` em `Home/` (Q1). `HomeLayoutView` o renderiza no lugar de `Sidenav`, depois de `HomeHeader`. `Sidebar` deixa de ser renderizado entre `StreakBreakDialog` e `AnimatedContainer`.                                                                                                                                                              | As duas barras são `fixed` com `z-50` (`AnimatedContainerView` da sidenav e `className='md:hidden z-50'` da sidebar) e `PageTransitionAnimation` é `z-[100]`; manter o pai depois do header preserva `HomeHeader` < `Sidenav` < `Sidebar`.         |
| DT-02 | `Sair` permanece como `<SignOutAlertDialog>` dentro das Views (Q2). O pai não expõe handler de sign-out.                                                                                                                                                                                                                                                                                        | `SignOutAlertDialog` tem hook próprio (`useSignOutAlertDialog`) e é global, fora do escopo.                                                                                                                                                          |
| DT-03 | Sem Design Contract formal (Q3, mantido na revisão 2 por Q4). Na revisão 1 o Penpot não era referência; na revisão 2 ele é referência **somente dos ícones** (DT-10). | Penpot `stardust` (verificado por MCP em 2026-11-16 e 2026-11-17): `sidebar` 112 px e `Navegação` 268 px, contra 88/164 px e `w-80` no código; a divergência de layout é o redesenho excluído pela Issue e continua fora. |
| DT-04 | `useHomeNavigation` aceita `user: User \| null` e é null-safe, porque `HomeNavigation` precisa chamar o hook de forma incondicional antes do retorno antecipado por falta de usuário.                                                                                                                                                                                                              | Regras dos hooks do React; `Sidenav` atual já chamava os hooks antes de `if (!user) return null`.                                                                                                                                                    |
| DT-05 | A navegação continua com `useNavigationProvider` (`@/ui/global/hooks/useNavigationProvider`). A UI Rule e o `AGENTS.md` citam `useNavigation`, que não existe no código.                                                                                                                                                                                                                        | `rg "useNavigation\b" apps/web/src` não retorna nada. Conflito documentação × código registrado aqui; a correção da Rule fica fora desta entrega.                                                                                                    |
| DT-06 | Revogada na revisão 2: `HomeHeader/index.tsx` não tem mais `useRef`, pois a animação de sequência e `useHomeHeader` saem (DT-11). | A decisão da revisão 1 (manter o `useRef` no Entry Point) só existia por causa da animação. |
| DT-07 | Revogada na revisão 3: `useHomeLayout` deixa de acessar `useSidebarContext`; o Entry Point `Home/index.tsx` (`HomeLayout`) resolve `useAuthContext`, `useSidebarContext` e `useNavigationProvider` e passa os valores ao hook por parâmetros. | A UI Rule proíbe hook de widget acessar context (`ui-layer-rules.md`, Regra do Hook); o usuário pediu a correção na PR (2026-11-17) após o apontamento P2 do Crew, no lugar de manter o débito da revisão 1. |
| DT-08 | `SidebarView.tsx` e `SidenavButtonView.tsx` ficam sem alteração, inclusive o guard `user &&` de `SidebarView` e o `onClick={() => null}` do botão Sair dentro de `SignOutAlertDialog`. `SidenavView.tsx`, `NavLinkView.tsx`, `TabNavView.tsx` e `HomeHeaderView.tsx` mudam só pelos ícones (RF-07, RF-08), sem alterar ids, `aria-*`, classes responsivas nem animações. | Refactor que preserva comportamento e DOM; as Views só mudam onde o ícone muda. |
| DT-09 | Revogada na revisão 3: `Home/index.tsx` (que exporta `HomeLayout`) muda para resolver o `SidebarContext` e passar os valores a `useHomeLayout` (DT-07). | A Issue já citava `HomeLayout` como consumidor do context; a revisão 1 o manteve sem mudança só por causa de DT-07. |
| DT-10 | Os componentes `sidebar` e `Espaço / Cabeçalho` da página `🧩 Components` do Penpot `stardust` são a referência visual **dos ícones** (Q4). Eles foram atualizados nesta entrega para Phosphor bold (sidebar: capelo, terminal, loja, usuário, caret, bandeira e power; header: moedas e fogo). Não há registro de revisão de design para eles (assunção aceita pelo usuário); a comparação é por nome de componente, inspecionada pelo Penpot MCP, e cobre glifo, tamanho, cor e posição. | `scripts/check-design.mjs` e `design-reviews/` ligam registros a PRDs, e nenhum PRD cobre esses componentes. Alternativa descartada: PRD + `/review-design` (Q4). |
| DT-11 | A sequência do header vira o ícone estático `fire` e a animação Lottie `streak` sai de `HomeHeader`, com `useHomeHeader`. Comportamento removido: com o dia concluído a animação rodava uma vez e, com o dia não concluído, parava no frame 0; agora os dois estados mostram o mesmo ícone, com cor diferente. É uma mudança de produto aprovada pelo usuário em 2026-11-17, não um refactor. | `useHomeHeader` só chamava `streakAnimationRef.current.stopAt(0)`; o asset Lottie permanece em `StreakIcon` e `StreakBoard`. |
| DT-12 | Os ícones novos usam o `Icon` (Phosphor) da Web, sem `lucide-react` (os componentes do Penpot eram lucide; a Web usa Phosphor, `design.md` §9). Entram `graduation-cap` → `GraduationCap`, `store` → `Storefront`, `coins` → `Coins` e `fire` → `Fire`; os demais nomes (`terminal`, `person`, `simple-arrow-left`, `simple-arrow-right`) já existem. `HOME_LINKS.icon` passa de nome de arquivo a `IconName`. | `PhosphorIcon/icons.ts`; o atalho `arrow-left/right` (seta) é trocado por `simple-arrow-left/right` (caret) para casar com o chevron do componente. |
| DT-13 | Os SVGs `apps/web/public/icons/learn.svg`, `challenges.svg` e `shop.svg` são removidos (Q5); `coin.svg` e `profile.svg` ficam. | Busca nas fontes em 2026-11-17: os três não têm referência; `coin.svg` é usado por cinco widgets e `profile.svg` por `UserAvatar`. |

## Conceitos novos

### `HomeNavigation` (widget, `profile`)

- **Propósito:** ser o único ponto que resolve o usuário e as ações de conta (Notas e Conquistas) para as
  duas barras de navegação do layout Home, em vez de `Sidenav` e `Sidebar` resolverem cada um a sua cópia.
- **Dono:** módulo `profile`, camada UI (`apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/`).
- **Entradas e saídas:** recebe de `HomeLayoutView` `isSidenavExpanded` e `onSidenavToggle` (estado que
  continua em `useHomeLayout`) e devolve a árvore visual de `Sidenav` e `Sidebar`.
- **Relações:** consome `AuthContext` (`user`), `useNavigationProvider` (`currentRoute`, `goTo`) e
  `SidebarContext` (`isOpen`, `toggle`, `isAchievementsListVisible`, `setIsAchievementsListVisible`);
  renderiza `Sidenav` e `Sidebar` e não conhece `HomeHeader`, que resolve o próprio usuário.
- **Fonte de verdade:** nenhuma nova. `SidebarContext` continua dono de `isOpen` e
  `isAchievementsListVisible`; `useHomeLayout` continua dono da expansão da sidenav; `AuthContext` dono do
  usuário. `HomeNavigation` não guarda estado.
- **Ciclo de vida, falha e autorização:** sem efeito, subscrição nem requisição. Sem usuário, renderiza
  `null`. A conta vem sempre da sessão via `AuthContext`; nada vem de payload do cliente.

### `useHomeNavigation` (hook de widget)

Função pura de composição de view-model: recebe dependências por parâmetro (não acessa contexts) e devolve
links, flags, contagem, dados do usuário para a gaveta e os dois handlers. Detalhe na seção de declarações.

## Expected file tree

```text
apps/web/
├── public/icons/
│   ├── learn.svg                                                   [D]
│   ├── challenges.svg                                              [D]
│   └── shop.svg                                                    [D]
└── src/ui/
    ├── global/widgets/components/Icon/
    │   ├── types/IconName.ts                                       [M]
    │   └── PhosphorIcon/icons.ts                                   [M]
    └── profile/
        ├── contexts/SidebarContext/
        │   ├── index.tsx                                           [M]
        │   └── hooks/
        │       ├── useSiderbarContext.ts                           [D]
        │       └── useSidebarContext.ts                            [N]
        └── widgets/layouts/Home/
            ├── HomeLayoutView.tsx                                  [M]
            ├── useHomeLayout.ts                                    [M]
            ├── home-links.ts                                       [M]
            ├── HomeNavigation/
            │   ├── index.tsx                                       [N]
            │   ├── HomeNavigationView.tsx                          [N]
            │   ├── useHomeNavigation.ts                            [N]
            │   └── tests/
            │       ├── HomeNavigationView.test.tsx                 [N]
            │       └── useHomeNavigation.test.ts                   [N]
            ├── HomeHeader/
            │   ├── index.tsx                                       [M]
            │   ├── HomeHeaderView.tsx                              [M]
            │   ├── useHomeHeader.ts                                [D]
            │   └── tests/
            │       └── HomeHeaderView.test.tsx                     [N]
            ├── NavLink/
            │   ├── index.tsx                                       [M]
            │   └── NavLinkView.tsx                                 [M]
            ├── TabNav/
            │   └── TabNavView.tsx                                  [M]
            ├── Sidenav/
            │   ├── index.tsx                                       [M]
            │   ├── SidenavView.tsx                                 [M]
            │   ├── SidenavButton/
            │   │   ├── index.tsx                                   [M]
            │   │   └── SidenavButtonView.tsx                       (unchanged)
            │   └── tests/
            │       ├── Sidenav.test.tsx                            [D]
            │       └── SidenavView.test.tsx                        [N]
            └── Sidebar/
                ├── index.tsx                                       [M]
                ├── SidebarView.tsx                                 (unchanged)
                └── tests/
                    ├── Sidebar.test.tsx                            [D]
                    └── SidebarView.test.tsx                        [N]
.code-multivitals-baseline.json                                      [G]
```

`HomeNavigation` é irmão de `Sidenav/` e `Sidebar/` (DT-01), não os contém. Não há contexts nem hooks de
query ou de action novos: o estado vem dos contexts existentes e `HomeNavigation` não faz requisições.

## Mapa canônico de paths afetados

### apps/web — contexts

| Path                                                                                      | Change | Declaration                                                                                                  | Contract                                                                                                                                                        | Dependencies   | Tests |
| ----------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----- |
| `apps/web/src/ui/profile/contexts/SidebarContext/hooks/useSiderbarContext.ts`             | Remove | `useSiderbarContext` (nome errado)                                                                           | Removido; substituído por `useSidebarContext`                                                                                                                   | —              | AV-04 |
| `apps/web/src/ui/profile/contexts/SidebarContext/hooks/useSidebarContext.ts`              | Create | `useSidebarContext(): SidebarContextValue`                                                                   | Mesmo comportamento do hook anterior; lança `useSidebarContext must be used inside SidebarProvider` fora do provider                                            | `SidebarContext` | AV-04 |
| `apps/web/src/ui/profile/contexts/SidebarContext/index.tsx`                               | Modify | importa e reexporta `useSidebarContext` no lugar de `useSiderbarContext`                                     | Valor do context e do provider inalterados                                                                                                                      | —              | AV-04 |

### apps/web — widgets do layout Home

| Path                                                                                       | Change | Declaration                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Contract                                                                                                                                                                                                                                   | Dependencies                                                   | Tests          |
| ------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | -------------- |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeLayoutView.tsx`                          | Modify | renderiza `<HomeNavigation isSidenavExpanded={isSidenavExpanded} onSidenavToggle={onSidenavToggle} />` no lugar de `<Sidenav/>`; remove `<Sidebar/>` e os dois imports                                                                                                                                                                                                                                                                                         | Ordem: `HomeHeader`, `HomeNavigation`, `PageTransitionAnimation`, `StreakBreakDialog`, `AnimatedContainer`, `TabNav`; rota de desafio inalterada                                                                                           | `HomeNavigation`                                               | AV-05, MV-01, MV-02 |
| `apps/web/src/ui/profile/widgets/layouts/Home/useHomeLayout.ts` | Modify | `useHomeLayout(params: { notifyUserChanges: () => void; isSidebarOpen: boolean; isAchievementsListVisible: boolean; onSidebarToggle: VoidFunction; setIsAchievementsListVisible: (isVisible: boolean) => void })`, mesmo retorno (`isSidenavExpanded`, `isTransitionVisible`, `toggleSidenav`, `handleContainerClick`) | Não acessa context: recebe o estado do sidebar por parâmetros; `handleContainerClick` chama `onSidebarToggle` se `isSidebarOpen` e `setIsAchievementsListVisible(false)` se `isAchievementsListVisible`; efeitos e temporizadores inalterados (DT-07) | — | AV-01, AV-04 |
| `apps/web/src/ui/profile/widgets/layouts/Home/index.tsx` | Modify | `HomeLayout` resolve `useSidebarContext()` (`isOpen`, `toggle`, `isAchievementsListVisible`, `setIsAchievementsListVisible`) além de `useAuthContext` e `useNavigationProvider` | Passa os valores a `useHomeLayout` e à View como parâmetros; sem estado, efeito ou handler (RF-04, DT-07, DT-09) | `useSidebarContext` | AV-01, AV-04 |
| `apps/web/src/ui/profile/widgets/layouts/Home/tests/useHomeLayout.test.ts` | Create | `describe('useHomeLayout')` com helper `Hook(params?: Partial<Params>)` | RF-04, CA-06: alterna a sidenav; clique no container fecha o sidebar aberto e esconde a lista de conquistas visível, e não chama nada com ambos fechados; notifica as mudanças do usuário após 320 ms uma única vez | Widget Tests Rules | AV-01 |
| `apps/web/src/ui/profile/widgets/layouts/Home/tests/HomeLayoutView.test.tsx` | Create | `describe('HomeLayoutView')` com helper `View(props?: Partial<ComponentProps<typeof HomeLayoutView>>)` | RF-02, CA-06: em rota comum renderiza header, navegação, transição, container e `TabNav` e o clique no container chama `onContainerClick`; em rota `/challenging` renderiza só a transição e os filhos | Widget Tests Rules; mocks dos widgets filhos | AV-02 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/index.tsx`                    | Create | `HomeNavigation({ isSidenavExpanded, onSidenavToggle }: { isSidenavExpanded: boolean; onSidenavToggle: VoidFunction }): JSX.Element \| null`                                                                                                                                                                                                                                                                                                                   | Chama `useAuthContext()`, `useNavigationProvider()` e `useSidebarContext()`, passa os valores a `useHomeNavigation` e à View; retorna `null` quando `sidebarUser` é `null`; sem estado, efeito ou handler                                   | `useAuthContext`, `useNavigationProvider`, `useSidebarContext` | AV-04, AV-05, MV-01 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/HomeNavigationView.tsx`       | Create | `HomeNavigationView(props: HomeNavigationViewProps): JSX.Element`, com `isSidenavExpanded: boolean`, `onSidenavToggle: VoidFunction`, `isSidebarOpen: boolean`, `onSidebarToggle: VoidFunction`, `isAchievementsListVisible: boolean`, `links: { route: string; label: string; icon: IconName }[]`, `isNotesActive: boolean`, `rescueableAchievementsCount: number`, `sidebarUser: { name: string; email: string; avatar: { image: string; name: string } }`, `onNotesClick: VoidFunction`, `onAchievementsClick: VoidFunction` | Fragmento com `<Sidenav isExpanded isAchievementsListVisible links isNotesActive rescueableAchievementsCount onToggleSidenav onNotesClick onAchievementsClick />` seguido de `<Sidebar isOpen toggle user onNotesClick />`; só renderiza | `Sidenav`, `Sidebar`                                           | AV-02          |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/useHomeNavigation.ts`         | Create | `useHomeNavigation(params: { user: User \| null; currentRoute: string; goTo: (route: string) => void; isAchievementsListVisible: boolean; setIsAchievementsListVisible: (isVisible: boolean) => void }): { links: { route: string; label: string; icon: IconName }[]; isNotesActive: boolean; rescueableAchievementsCount: number; sidebarUser: { name: string; email: string; avatar: { image: string; name: string } } \| null; handleNotesClick(): void; handleAchievementsClick(): void }` | `links` vem de `HOME_LINKS` (`route` função → `route(user.slug.value)`); `isNotesActive = currentRoute === ROUTES.notes`; `handleNotesClick` chama `goTo(ROUTES.notes)`; `handleAchievementsClick` chama `setIsAchievementsListVisible(!isAchievementsListVisible)`; sem usuário: `[]`, `0`, `null`; exporta `Params`; `function` | `HOME_LINKS`, `ROUTES`, `User` (`@stardust/core/global/entities`) | AV-01          |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/useHomeNavigation.test.ts` | Create | `describe('useHomeNavigation')` com helper `Hook(params?: Partial<Params>)`                                                                                                                                                                                                                                                                                                                                                                                   | CA-01 a CA-04 com valores injetados (`user` stub, `goTo` e `setIsAchievementsListVisible` mockados)                                                                                                                                         | Widget Tests Rules                                             | AV-01          |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/HomeNavigationView.test.tsx` | Create | `describe('HomeNavigationView')` com helper `View(props?: Partial<HomeNavigationViewProps>)`                                                                                                                                                                                                                                                                                                                                                                | `Sidenav` e `Sidebar` renderizam; clicar em Notas em cada uma chama o mesmo `onNotesClick`; Conquistas chama `onAchievementsClick`                                                                                                         | Widget Tests Rules; mocks de filhos animados                   | AV-02          |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/index.tsx` | Modify | `HomeHeader()` | Resolve `useAuthContext()` (`user`) e `useSidebarContext()` (`isOpen`, `toggle`), retorna `null` sem usuário e passa as mesmas props de hoje à `HomeHeaderView`, **sem** `streakAnimationRef`; sem `useRef`, hook, estado, efeito ou handler (RF-08, DT-06 revogada) | `useAuthContext`, `useSidebarContext` | AV-04, AV-05, MV-01 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/useHomeHeader.ts` | Remove | `useHomeHeader` (hook que só parava a animação de sequência) | Removido (RF-08, DT-11); o arquivo existe no commit base | — | AV-04 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/tests/HomeHeaderView.test.tsx` | Create | `describe('HomeHeaderView')` com helper `View(props?: Partial<ComponentProps<typeof HomeHeaderView>>)` | CA-05: com `isTodayDone` verdadeiro o ícone `fire` usa `text-green-500` e com falso `text-gray-300`; moedas e sequência renderizam seus valores; não há `Animation` | Widget Tests Rules; mocks de `UserAvatar`, `CountBadge` e `next/image` | AV-03 |
| `apps/web/src/ui/profile/widgets/layouts/Home/home-links.ts` | Modify | `HOME_LINKS: { route; label; icon: IconName }[]` com `icon` igual a `'graduation-cap'`, `'terminal'`, `'store'` e `'person'` | Mesmos links e rotas; só o campo `icon` passa de nome de arquivo a `IconName` (RF-07, DT-12) | `IconName` | AV-01, AV-05 |
| `apps/web/src/ui/profile/widgets/layouts/Home/NavLink/index.tsx` | Modify | `NavLink` com `icon: IconName` | Mesmo comportamento (`isActive` por rota); só o tipo de `icon` muda | `useNavigationProvider` | AV-04, AV-05 |
| `apps/web/src/ui/profile/widgets/layouts/Home/NavLink/NavLinkView.tsx` | Modify | `NavLinkView` com `icon: IconName` | Renderiza `<Icon name={icon} size={24} className='text-gray-800' />` no tile, no lugar de `<Image src={`/icons/${icon}`} />`; tile, estado ativo e rótulo animado inalterados (RF-07) | `Icon` | AV-05, VV-01, MV-01, MV-02 |
| `apps/web/src/ui/profile/widgets/layouts/Home/TabNav/TabNavView.tsx` | Modify | `links: { route; label; icon: IconName }[]` | Só o tipo de `icon` muda | `NavLink` | AV-05 |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavView.tsx` | Modify | `SidenavViewProps.links[].icon: IconName`; botão de expandir com `Icon` | O botão usa `Icon name='simple-arrow-left'` (expandida) ou `'simple-arrow-right'` (recolhida), `size={16}`, `weight='bold'`, `className='text-sm text-gray-800'`; demais ids, `aria-*`, classes e animações inalterados (RF-07, DT-12) | `Icon`, `NavLink` | AV-02, VV-01, MV-01 |
| `apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader/HomeHeaderView.tsx` | Modify | `HomeHeaderView` sem a prop `streakAnimationRef` | Moedas com `Icon name='coins' size={26} weight='bold' className='text-yellow-400'`; sequência com `Icon name='fire' size={24} weight='bold'` e classe `text-green-500` (`isTodayDone`) ou `text-gray-300`, ao lado do número; sem `Animation`, `RefObject` nem `AnimationRef` (RF-07, RF-08) | `Icon` | AV-03, VV-02, MV-01 |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/index.tsx`                           | Modify | `export const Sidenav = SidenavView`                                                                                                                                                                                                                                                                                                                                                                                                                          | Alias da View com as props de `SidenavView` (as props públicas deixam de ser `isExpanded`/`toggleSidenav` e passam a ser as da View; `HomeNavigationView` é o único consumidor); sem hook, context nem handler                                                                                                                                                                           | `SidenavView`                                                  | AV-04, AV-05   |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton/index.tsx`             | Modify | `export const SidenavButton = SidenavButtonView`                                                                                                                                                                                                                                                                                                                                                                                                              | Alias da View com as props de `SidenavButtonView` (idênticas às atuais); remove o componente que só repassava props                                                                                                                         | `SidenavButtonView`                                            | AV-04, AV-05   |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/tests/Sidenav.test.tsx`              | Remove | teste do Entry Point (`from '..'`) com mocks de contexts                                                                                                                                                                                                                                                                                                                                                                                                      | Removido: contraria a regra de que `index.tsx` nunca é testado; coberto por AV-01 e AV-02                                                                                                                                                  | —                                                              | AV-02          |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/tests/SidenavView.test.tsx`          | Create | `describe('SidenavView')` com helper `View(props?: Partial<ComponentProps<typeof SidenavView>>)`                                                                                                                                                                                                                                                                                                                  | CA-02 e CA-03: Notas chama `onNotesClick` e fica ativo com `isNotesActive`; Conquistas chama `onAchievementsClick` e fica ativo com `isAchievementsListVisible`; contador de resgatáveis; Perfil e demais links renderizam                  | Widget Tests Rules; mocks de filhos animados e de `next/*`     | AV-02          |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/index.tsx`                           | Modify | `export const Sidebar = SidebarView`                                                                                                                                                                                                                                                                                                                                                                                                                          | Alias da View com as props de `SidebarView` (`isOpen`, `toggle`, `user`, `onNotesClick`; `HomeNavigationView` é o único consumidor); remove os contexts, o closure inline e o retorno `undefined`                                          | `SidebarView`                                                  | AV-04, AV-05   |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/tests/Sidebar.test.tsx`              | Remove | teste do Entry Point (`from '..'`) com mocks de contexts                                                                                                                                                                                                                                                                                                                                                                                                      | Removido pelo mesmo motivo; coberto por AV-01 e AV-02                                                                                                                                                                                      | —                                                              | AV-02          |
| `apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/tests/SidebarView.test.tsx`          | Create | `describe('SidebarView')` com helper `View(props?: Partial<ComponentProps<typeof SidebarView>>)`                                                                                                                                                                                                                                                                                                                                               | CA-02: dados do usuário e botão Notas chama `onNotesClick`; botão de fechar chama `toggle`; Sair é renderizado dentro do dialog                                                                                                            | Widget Tests Rules; mocks de filhos animados                   | AV-02          |

### apps/web — componente Icon

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/ui/global/widgets/components/Icon/types/IconName.ts` | Modify | `IconName` ganha `'graduation-cap'`, `'store'`, `'coins'` e `'fire'` | Só acrescenta nomes; os existentes não mudam | — | AV-05 |
| `apps/web/src/ui/global/widgets/components/Icon/PhosphorIcon/icons.ts` | Modify | `ICONS` ganha `'graduation-cap': GraduationCap`, `store: Storefront`, `coins: Coins` e `fire: Fire` | Mapa nome → componente Phosphor; nenhuma entrada existente muda | `@phosphor-icons/react` (`GraduationCap`, `Storefront`, `Coins`, `Fire`) | AV-05 |

### apps/web — assets e geração

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/web/public/icons/learn.svg` | Remove | asset de ícone | Removido: sem referência após RF-07 (DT-13) | — | AV-04 |
| `apps/web/public/icons/challenges.svg` | Remove | asset de ícone | Removido: sem referência após RF-07 (DT-13) | — | AV-04 |
| `apps/web/public/icons/shop.svg` | Remove | asset de ícone | Removido: sem referência após RF-07 (DT-13) | — | AV-04 |
| `.code-multivitals-baseline.json` | Generate | baseline do `check:complexity` | Fonte: código da Web; comando: `pnpm run update:complexity-baseline`; saída: o próprio arquivo. Só entram entradas existentes cujas métricas mudaram, com aprovação do usuário (Q6); sem edição manual | `check-complexity.mjs` | AV-05 |

> **Ajuste das Views para os testes.** `SidenavView.tsx` e `SidebarView.tsx` não exportam hoje o tipo de
> props e, por DT-08, não são alteradas. Os helpers de teste tipam as props com
> `ComponentProps<typeof SidenavView>` e `ComponentProps<typeof SidebarView>`, sem editar as Views;
> `HomeNavigationView` exporta `HomeNavigationViewProps` (arquivo novo).

## Detalhamento técnico por camada afetada

- **UI (`apps/web`, módulo `profile`):** nenhuma camada de Core, Server, REST, RPC ou banco muda.
  - **Entry Points.** `HomeNavigation/index.tsx` e `HomeHeader/index.tsx` resolvem contexts e provider de
    navegação no Entry Point (Regra do Entry Point). Eles só conectam hook e View; não declaram estado,
    efeito ou handler. `Sidenav`, `SidenavButton` e `Sidebar` são aliases.
  - **Hooks.** `useHomeNavigation` é `function`, recebe dependências por parâmetros e não acessa contexts.
    `HomeHeader` não tem hook (RF-08). `useHomeNavigation` é null-safe (DT-04): sem usuário devolve
    `links: []`, `rescueableAchievementsCount: 0` e `sidebarUser: null`.
  - **Views.** `HomeNavigationView` só compõe os filhos com props. As Views existentes só mudam onde o ícone
    muda (DT-08), portanto ids, `aria-controls`, classes responsivas e animações das barras permanecem.
  - **Ícones.** `NavLinkView`, `SidenavView` e `HomeHeaderView` usam o `Icon` com os nomes de DT-12; o mapa
    `ICONS` ganha quatro entradas Phosphor. Nada novo de lifecycle, requisição ou estado.
  - **Estados.** Não há loading, empty, error nem recovery novos: as barras não consomem dados
    assíncronos. Estados observáveis: sidenav expandida/recolhida, gaveta aberta/fechada, lista de
    conquistas visível/oculta, Notas ativo, sem usuário (nada renderizado).
  - **Teclado, foco, responsividade e acessibilidade:** inalterados, por reaproveitarem as mesmas Views
    (`aria-label`, `aria-expanded`, `aria-controls` incluídos).
  - **Tests.** Segue `widget-tests-rules.md`: um teste de hook e um de View por alvo, helpers `Hook()` e
    `View()` com `Partial`, sem teste de `index.tsx`. `useSidebarContext` e os hooks de context não ganham
    teste dedicado (rename mecânico, coberto indiretamente pelos consumidores e pelo smoke manual).

## Runtime Flow

1. `HomeLayout` (`'use client'`) resolve `notifyUserChanges` do `AuthContext` e o estado do `SidebarContext` e
   os passa a `useHomeLayout`, que mantém a expansão da sidenav, o timeout da transição e o clique no container
   (fecha a gaveta e a lista de conquistas por callbacks recebidos). `HomeLayoutView` não renderiza nada do layout em rota de
   desafio (`/challenging`), como antes.
2. Fora de desafio, `HomeLayoutView` renderiza, nesta ordem, `HomeHeader`, `HomeNavigation`,
   `PageTransitionAnimation`, `StreakBreakDialog`, o `AnimatedContainer` com os filhos e `TabNav`.
3. `HomeNavigation` lê uma vez `user` (`AuthContext`, sessão verificada), `currentRoute` e `goTo`
   (`useNavigationProvider`) e `isOpen`, `toggle`, `isAchievementsListVisible` e
   `setIsAchievementsListVisible` (`SidebarContext`). Chama `useHomeNavigation`, que monta o view-model.
   Sem usuário, retorna `null`.
4. `HomeNavigationView` renderiza `Sidenav` e `Sidebar` no DOM, como antes; o CSS mostra a sidenav em
   `md+` (`hidden md:flex`) e a gaveta abaixo de `md` (`md:hidden`).
5. Notas: o botão chama `handleNotesClick` → `goTo(ROUTES.notes)` → o Next navega para `/notes`.
   Conquistas (só na sidenav): `handleAchievementsClick` inverte `isAchievementsListVisible` no
   `SidebarContext`; `AchievementsList` (fora do escopo) continua resolvendo os próprios dados.
   Sair: o botão dentro de `SignOutAlertDialog` abre o diálogo e o fluxo de sign-out segue em
   `useSignOutAlertDialog`, sem passar por `HomeNavigation`.
6. `HomeHeader` resolve `user` e `isOpen`/`toggle` no Entry Point e renderiza a View; o botão de menu do
   header chama `toggle` do mesmo `SidebarContext`. A sequência mostra o ícone estático `fire`, tingido por
   `isTodayDone` (DT-11); não há mais efeito sobre a animação.
7. Não há concorrência, retry nem recuperação: não existe efeito externo, requisição nem persistência.

# Verification Contract

## Shared setup

- **Ambiente:** Server em `http://localhost:3334` (`pnpm --filter @stardust/server run dev`) e Web em
  `http://localhost:3000` (`pnpm --filter @stardust/web run dev`), em terminais separados, com o
  Supabase local semeado (`pnpm --filter @stardust/server run db:seed`) e o `.env.local` raiz.
- **Conta:** aluno seed de `apps/server/src/database/seeders/seed-accounts.json`, carregado com
  `eval "$(node ./scripts/export-web-app-e2e-env.mjs --seed)"` (`WEB_APP_E2E_EMAIL`,
  `WEB_APP_E2E_PASSWORD`). Nenhuma credencial vai para testes, documentos ou logs.
- **Capturas:** Playwright (`playwright-cli`/`pnpm exec playwright` em `apps/web`), salvas em
  `test-results/home-navigation/before/` e `.../after/`, com o mesmo usuário, a mesma seed e os
  mesmos viewports (1440×900 e 390×844). O conjunto "antes" é capturado nesta branch no commit base
  `f6c66f636`, **antes da primeira edição** de código; o conjunto "depois" no candidato integrado.
  Registrar caminhos e resultado no `evaluation.md`; não criar pasta de evidência na feature.
- **Isolamento:** os testes unitários não usam rede nem banco. Os manuais só leem dados e não alteram
  o estado da conta; `Sair` é aberto e cancelado.
- **Processos:** encerrar o Server e a Web depois da validação.

## Automated

Todos os comandos rodam da raiz do repositório; os caminhos dos testes são relativos a `apps/web`. Os
arquivos de teste novos (planejados) são verificados e a contagem de testes executados é confirmada: seleção
vazia ou ignorada não é aprovação.

### AV-01 — `useHomeNavigation` monta o view-model e os handlers

**Criteria:** CA-01, CA-02, CA-03, CA-04
**Target / boundary:** `src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/useHomeNavigation.test.ts` (hook).
**Command:** `pnpm --filter @stardust/web run test:unit -- src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/useHomeNavigation.test.ts`
**Approval condition:** passam os casos de usuário presente e ausente, `currentRoute` igual a `ROUTES.notes` e
diferente, `isAchievementsListVisible` verdadeiro e falso, a rota de Perfil montada com o slug, `handleNotesClick`
chamando `goTo(ROUTES.notes)` e `handleAchievementsClick` invertendo o valor; contagem de testes confirmada.

### AV-02 — Views de `Sidenav`, `Sidebar` e `HomeNavigation`

**Criteria:** CA-02, CA-03, CA-09
**Target / boundary:** `Home/Sidenav/tests/SidenavView.test.tsx`, `Home/Sidebar/tests/SidebarView.test.tsx` e
`Home/HomeNavigation/tests/HomeNavigationView.test.tsx` (Views).
**Command:** `pnpm --filter @stardust/web run test:unit -- src/ui/profile/widgets/layouts/Home/Sidenav/tests/SidenavView.test.tsx src/ui/profile/widgets/layouts/Home/Sidebar/tests/SidebarView.test.tsx src/ui/profile/widgets/layouts/Home/HomeNavigation/tests/HomeNavigationView.test.tsx`
**Approval condition:** Notas chama o handler recebido em cada barra e fica ativo na sidenav quando
`isNotesActive`; Conquistas chama o handler e mostra o contador; a gaveta mostra nome, e-mail e avatar e fecha
pelo botão; `HomeNavigationView` entrega o mesmo `onNotesClick` às duas barras; os testes antigos de Entry
Point não existem mais e nenhum teste importa `index.tsx`; contagem confirmada.

### AV-03 — `HomeHeaderView` mostra moedas e a sequência com `Icon`

**Criteria:** CA-05, CA-10
**Target / boundary:** `Home/HomeHeader/tests/HomeHeaderView.test.tsx` (View; planejado).
**Command:** `pnpm --filter @stardust/web run test:unit -- src/ui/profile/widgets/layouts/Home/HomeHeader/tests/HomeHeaderView.test.tsx`
**Approval condition:** com `isTodayDone` verdadeiro o ícone de sequência usa `text-green-500` e com falso
`text-gray-300`; moedas e sequência mostram seus valores; o ícone de moedas usa `Icon`; a View não renderiza
`Animation`; contagem de testes confirmada (seleção vazia ou ignorada não é aprovação).

### AV-04 — Buscas estáticas de estrutura e de rename

**Criteria:** CA-05, CA-06, CA-07, CA-10
**Scope:** `apps/web/src/ui/profile` e `apps/web/src`.
**Checks (cada `rg` retorna zero ocorrências):**
`rg -n "useSiderbarContext" apps/web`;
`rg -n "useAuthContext|useNavigationProvider|useSidebarContext" apps/web/src/ui/profile/widgets/layouts/Home/Sidenav apps/web/src/ui/profile/widgets/layouts/Home/Sidebar`;
`rg -n "useAuthContext|useSidebarContext|useContext" apps/web/src/ui/profile/widgets/layouts/Home/HomeNavigation/useHomeNavigation.ts`;
`rg -n "useHomeHeader|streakAnimationRef|Animation" apps/web/src/ui/profile/widgets/layouts/Home/HomeHeader`;
`rg -n "useAuthContext|useSidebarContext|useContext" apps/web/src/ui/profile/widgets/layouts/Home/useHomeLayout.ts`;
`rg -n "lucide" apps/web/src`;
`rg -n "(learn|challenges|shop)\.svg" apps/web/src`.
Além disso, `git diff --stat f6c66f636 -- apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/SidebarView.tsx apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton/SidenavButtonView.tsx apps/web/src/ui/profile/widgets/layouts/Home/Sidenav/AnimatedContainer apps/web/src/ui/profile/widgets/layouts/Home/Sidebar/AnimatedBar`
não mostra alteração.
**Approval condition:** as buscas vazias e nenhuma View inalterada (`SidebarView`, `SidenavButtonView`, `Animated*`) com diff; a auditoria estrutural
(Matriz de auditoria estrutural) é registrada no `evaluation.md` com `file:linha` por widget.

### AV-05 — Verificações de baseline aplicáveis

**Scope:** `@stardust/web` (workspace alterado); nenhum outro workspace consome esses widgets
(`HomeLayout` só é importado por `apps/web/src/app/(home)/layout.tsx`).
**Checks:** `pnpm --filter @stardust/web run check:code`; `pnpm --filter @stardust/web run check:types`;
`pnpm --filter @stardust/web run check:complexity` (código novo: confirmar que cada função fica abaixo do
limite de erro de 70 linhas e que não surgem avisos fora do baseline); `pnpm --filter @stardust/web run
check:architecture`; `pnpm run check:test-integrity`; `pnpm run check:spec-implementation
documentation/features/profile/home-navigation-widget-pattern/spec.md --base f6c66f636 --require-plan`.
`format` é aplicado antes, mas não prova comportamento. `check:coverage` e `test:coverage` rodam no CI e não
entram, pois o impacto não abrange o workspace. Testes de integração Playwright da Web não são afetados: as
rotas, o middleware e o `ServerMock` não mudam (registrar a decisão no Evaluation).
**Approval condition:** todos passam, sem relaxar regra. O `.code-multivitals-baseline.json` só é regenerado
(`pnpm run update:complexity-baseline`) com a aprovação do usuário, dada na revisão 2 (Q6) para o candidato
final; o Evaluation registra as entradas que mudaram e que nenhuma regra foi relaxada. A auditoria estrutural de
CA-06 e a ausência de teste de Entry Point estão registradas no Evaluation.

## Manual

### MV-01 — Caminho feliz no desktop (1440×900)

**Criteria:** CA-02, CA-03, CA-05, CA-08, CA-10
**Tool / setup:** Playwright no Web e no Server locais; shared setup. Capturar o conjunto "antes" (passos 2 a 4)
no commit base antes da primeira edição e repetir o roteiro no candidato.
**Procedure:** 1) autenticar com o aluno seed e aguardar a navegação para a rota protegida; 2) capturar a
página com a sidenav recolhida, expandir pelo botão (`aria-controls="sidenav"`) e capturar; 3) navegar por
Aprender, Desafios, Loja e Perfil; 4) clicar em Notas e confirmar a rota `/notes`, clicar em Conquistas,
confirmar a lista aberta e capturar, fechar; 5) abrir o diálogo de Sair e cancelar; 6) conferir que `#sidenav`
existe e `#sidebar` está oculto em `md+`.
**Approval condition:** URL final `/notes` após Notas; lista de conquistas abre e fecha; `GET /auth/account`
`200` e `2xx` nas requisições essenciais; sem erros de console; as capturas "depois" conferem com as "antes"
em composição, ordem de empilhamento e estados, exceto os ícones de RF-07 e RF-08 (inspecionadas a olho, não apenas salvas); sessão mantida.

### MV-02 — Caminho feliz no mobile (390×844)

**Criteria:** CA-02, CA-08
**Tool / setup:** idem MV-01, viewport 390×844.
**Procedure:** 1) autenticar; 2) capturar com a gaveta fechada e confirmar `TabNav` visível; 3) tocar no botão
de menu do header (`aria-controls="sidebar"`), capturar com a gaveta aberta e conferir nome, e-mail e avatar;
4) tocar em Notas e confirmar a rota; 5) reabrir a gaveta, fechá-la pelo botão de fechar e também pelo clique no
container.
**Approval condition:** `#sidebar` presente, gaveta abre e fecha, Notas navega para `/notes`, `#sidenav` oculto
abaixo de `md`; capturas "depois" conferem com as "antes"; sem erros de console; endpoints essenciais `2xx`.

## Visual

Referência (Q4, DT-10): página `🧩 Components` do Penpot `stardust`, componentes `sidebar` e
`Espaço / Cabeçalho`, exportados pelo Penpot MCP; não há Design Contract formal nem registro de design review.
Compara-se **somente os ícones** (glifo, tamanho, cor, posição); largura do board, ausência do botão Notas e o
board `Navegação` ficam fora. Capturar durante MV-01 e inspecionar as imagens: salvar a captura não aprova.

### VV-01 — Ícones da sidenav recolhida (desktop 1440×900)

**Criteria:** CA-10
**Reference / setup:** componente `sidebar` (trilho recolhido: capelo, terminal, loja, usuário, caret de expandir,
bandeira e power); MV-01 passo 2, com a sidenav recolhida.
**Capture / comparison:** export atual do Penpot comparado com a captura Playwright de `#sidenav` recolhida.
**Approval condition:** os quatro ícones dos links e o caret de expandir conferem em glifo (Phosphor bold),
tamanho (24 px nos tiles e 16 px no caret), cor (`#1E2626`/`#141A1B` sobre o tile, `#32E995` nos ícones inferiores) e
posição centrada no tile; bandeira e power (Conquistas e Sair) continuam os ícones Phosphor existentes;
divergências aceitas: largura do trilho, ausência de Notas no board.

### VV-02 — Ícones do header (desktop 1440×900)

**Criteria:** CA-10
**Reference / setup:** componente `Espaço / Cabeçalho` (`coins-icon` e `streak-icon`); MV-01, página `/space`.
**Capture / comparison:** export atual do Penpot comparado com a captura Playwright do header.
**Approval condition:** moedas (`Coins`, `#FFCE31`) e sequência (`Fire`, verde `#58DFA6` com o dia concluído)
conferem em glifo, tamanho (moedas 26 px, fogo 24 px no código; 24 px no board) e posição ao lado do número;
com o dia não concluído o ícone usa o cinza de `text-gray-300` (estado fora do board, coberto por AV-03);
divergências aceitas: largura do header e tipografia fora do escopo de ícones.

# Documentation alignment and revision history

## Alinhamento documental

- Nenhum documento normativo é alterado: Rules, Architecture, Overview, Tooling e PRDs permanecem como estão.
- Conflito documentação × código registrado (DT-05): a UI Rule (`ui-layer-rules.md`, "Navegação") e o
  `AGENTS.md` citam `useNavigation`, que não existe; o código usa `useNavigationProvider`. A correção da
  Rule fica para uma decisão própria.
- Registro de design: ausente para os componentes `sidebar` e `Espaço / Cabeçalho` (assunção aceita pelo usuário, Q4/DT-10); a Spec não tem Design Contract formal.
- Rule Pack: UI Layer, Widget Tests, Web Application, Code Conventions, MCP Rules (Penpot e Playwright
  apenas para a verificação).

## Lacunas e pendências

- O conjunto de capturas "antes" precisa ser gerado antes da primeira edição de código; é um pré-requisito
  de `implement-spec`, não um bloqueio de abertura da Spec.
- O acesso a context dentro de `useHomeLayout` deixou de ser débito na revisão 3 (DT-07 revogada).
- A revisão 2 muda comportamento de produto (a animação de sequência sai, DT-11): as capturas "antes" da
  revisão 1 continuam sendo o comparativo, com os ícones como exceção declarada.
- Penpot já atualizado nesta entrega (ícones Phosphor em `sidebar` e `Espaço / Cabeçalho`); o `evaluation.md`
  registra os exports usados em VV-01 e VV-02.

## Histórico de revisões

| Revisão | Data       | Mudança                                                                                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | 2026-11-16 | Criação a partir da Issue #661, após grilling Q1–Q3 e revisão de design em cinco seções. Spec Reviewer (revisão 1, `clear`, sem findings bloqueantes): F-01 (débito de `useHomeLayout`) mantido como débito, com a confirmação do usuário registrada em DT-07; F-02 (precedente de `useRef`), F-03 (caminho `Home/index.tsx` em DT-09) e F-04 (props do alias são as da View, com `HomeNavigationView` único consumidor) corrigidos. Aprovada explicitamente pelo usuário em 2026-11-16 (Contrato escrito); status `open`. |
| 2       | 2026-11-17 | Emenda material: ícones Phosphor via `Icon` na navegação e no header, alinhados ao Penpot (RF-07, RF-08, CA-10, DT-10 a DT-13, VV-01, VV-02); `useHomeHeader` e a animação de sequência removidos; SVGs sem uso removidos; baseline autorizado (Q6). Grilling Q4–Q6 e revisão de design em cinco seções confirmados pelo usuário em 2026-11-17. Spec Reviewer (revisão 2, `clear`, sem findings bloqueantes): o finding sobre "seu teste" em RF-08 e DT-11 foi corrigido (esse teste nunca existiu no commit base); a nota sobre o `new Error` de `useSidebarContext` é registrada como guarda mantida sem alteração na renomeação mecânica, sem endosso. Contrato escrito aprovado explicitamente pelo usuário em 2026-11-17; status `open`. |
| 3       | 2026-11-17 | Emenda: `useHomeLayout` passa a receber o estado do sidebar por parâmetros e `Home/index.tsx` resolve o `SidebarContext` (DT-07 e DT-09 revogadas), a pedido do usuário após o apontamento P2 do Crew na PR 666; novo teste `useHomeLayout.test.ts`. Decisão do usuário ("fix it"); sem novo grilling. |
