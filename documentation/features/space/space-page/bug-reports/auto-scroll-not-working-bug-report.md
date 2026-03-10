---
title: Auto-scroll da Space Page nao recentraliza a ultima estrela desbloqueada
prd: documentation/features/space/space-page/prd.md
apps: web
status: resolvido
last_updated_at: 2026-03-09
---

# 1. Problema Identificado

Ao acessar a Space Page (`/space`), a pagina permanece na posicao inicial do layout em vez de rolar automaticamente ate a ultima estrela desbloqueada. Quando o usuario clica no FAB com rotulo "Ir ate a ultima estrela desbloqueada", a tela tambem nao recentraliza a jornada no ponto atual de progresso.

Incluindo o comportamento observado no relato atual:

* o usuario entra na pagina de espaco ou tenta usar o FAB de recentralizacao
* a interface continua na mesma posicao de scroll
* o esperado era centralizar a ultima estrela desbloqueada na area visivel da tela
* o problema ocorre no app web, dentro do fluxo autenticado da Space Page
* a implementacao atual indica um comportamento recorrente, nao pontual

> Nao ha evidencia, neste momento, de falha em contratos de dados, API ou desbloqueio de estrelas. O sintoma observado e de navegacao/scroll da UI.

---

# 2. Escopo e Impacto

## 2.1 Fluxo afetado

A feature afetada e a navegacao assistida da `Space Page`, composta por:

* auto-centralizacao inicial ao abrir `/space`
* acao manual do FAB para voltar ao ponto atual da jornada
* atualizacao do estado visual do FAB conforme a posicao da ultima estrela no viewport

## 2.2 Impacto funcional

O usuario perde o principal atalho de continuidade da trilha espacial e precisa localizar manualmente a ultima estrela desbloqueada. Isso aumenta atrito para retomar estudos e reduz a efetividade do fluxo "entrar e continuar", que e justamente o objetivo da pagina.

## 2.3 Severidade e alcance

Severidade funcional alta dentro da feature, porque dois comportamentos centrais previstos no fluxo de progressao deixam de funcionar. O alcance e restrito ao app `web`, mas afeta toda a jornada autenticada da `Space Page` enquanto ela estiver renderizada dentro do layout atual.

---

# 3. Contexto Esperado

O PRD da feature (`documentation/features/space/space-page/prd.md`, hoje apontando para o milestone 11 no GitHub) define explicitamente que a Space Page deve:

* rolar automaticamente ate a ultima estrela desbloqueada na primeira exibicao
* permitir recentralizacao manual via FAB
* atualizar direcao e visibilidade do FAB conforme a posicao da estrela em relacao ao viewport

Esse comportamento tambem e coerente com a implementacao existente:

* `apps/web/src/ui/space/widgets/pages/Space/index.tsx` renderiza um FAB dedicado a essa acao
* `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` tenta disparar a recentralizacao automaticamente na primeira exibicao
* `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts` concentra a logica de scroll e de calculo da posicao da ultima estrela

---

# 4. Causas Provaveis

* **Causa provavel:** a feature esta tentando controlar o scroll da janela (`window`), mas a Space Page vive dentro de um container interno com `overflow-auto`
  * **Evidencia encontrada:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackLayoutView.tsx` encapsula o conteudo em `<div className='flex-1 overflow-auto'>`, enquanto a implementacao anterior da Space Page usava `window.scrollTo(...)`
  * **Nivel de confianca:** alto
  * **Impacto no bug:** tanto o auto-scroll inicial quanto o clique no FAB atuam no alvo errado e, por isso, nao movem a area realmente rolavel da pagina

* **Causa provavel:** o monitoramento da posicao da ultima estrela escuta o scroll do viewport padrao, nao do container real da pagina
  * **Evidencia encontrada:** `apps/web/src/ui/global/hooks/useScrollEvent.ts` chamava `useScroll()` sem informar `container`; a implementacao anterior do provider da Space Page dependia disso para atualizar `lastUnlockedStarPosition`
  * **Nivel de confianca:** alto
  * **Impacto no bug:** o estado `above | in | bellow` pode ficar desatualizado, comprometendo a visibilidade e a direcao do FAB

* **Causa provavel:** a deteccao de visibilidade da ultima estrela usa o viewport padrao do Motion, sem alinhar a observacao ao container rolavel da Space Page
  * **Evidencia encontrada:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` usa `useInView(lastUnlockedStarRef)`; a documentacao do Motion indica que, em containers rolaveis, a opcao `root` deve apontar para o scrollable parent
  * **Nivel de confianca:** medio
  * **Impacto no bug:** mesmo apos corrigir o scroll alvo, o estado visual do FAB ainda pode oscilar ou nao refletir com precisao quando a estrela esta visivel dentro da area rolavel real

---

# 5. O que ja existe?

## UI - Pagina e widgets

* **`SpacePage`** (`apps/web/src/ui/space/widgets/pages/Space/index.tsx`) - Renderiza a trilha de planetas, o link de encerramento e o FAB que deveria recentralizar a ultima estrela.
* **`useSpacePage`** (`apps/web/src/ui/space/widgets/pages/Space/useSpacePage.ts`) - Encaminha o clique do FAB para a acao de scroll exposta pelo contexto.
* **`Star`** (`apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx`) - Identifica se a estrela atual e a ultima desbloqueada e conecta `useStar` com a `View`.
* **`StarView`** (`apps/web/src/ui/space/widgets/pages/Space/Planet/Star/StarView.tsx`) - Anexa `lastUnlockedStarRef` ao elemento que representa a estrela de referencia.

## UI - Estado e coordenacao

* **`SpaceProvider`** (`apps/web/src/ui/space/contexts/SpaceContext/index.tsx`) - Instancia o contexto da Space Page e compartilha estado/calculos com os widgets.
* **`useSpaceContextProvider`** (`apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`) - Calcula a ultima estrela desbloqueada, guarda a ref da estrela e concentra a logica de scroll/posicionamento.
* **`SpaceContextValue`** (`apps/web/src/ui/space/contexts/SpaceContext/types/SpaceContextValue.ts`) - Define o contrato consumido pela pagina e pelas estrelas.
* **`LastUnlockedStarViewPortPosition`** (`apps/web/src/ui/space/contexts/SpaceContext/types/LastUnlockedStarViewPortPosition.ts`) - Define os estados `above`, `in` e `bellow` usados pelo FAB.

## UI - Layout compartilhado

* **`FeedbackLayoutView`** (`apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackLayoutView.tsx`) - Cria o container rolavel real (`flex-1 overflow-auto`) que envolve a Space Page no fluxo autenticado.
* **`useScrollEvent`** (`apps/web/src/ui/global/hooks/useScrollEvent.ts`) - Hook compartilhado que observa scroll via Motion no viewport padrao.

## REST e dominio

* **`SpaceService`** (`apps/web/src/rest/services/SpaceService.ts`) - Carrega os planetas oficiais da trilha via `/space/planets`.
* **`User`** (`packages/core/src/profile/domain/entities/User.ts`) - Define `hasUnlockedStar(...)` e `hasRecentlyUnlockedStar(...)`, que sao a fonte de verdade para o estado de desbloqueio exibido na Space Page.

## Referencias internas reutilizaveis

* **`useChallengeTabContent`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/ChallengeTabContent/useChallengeTabContent.ts`) - Exemplo de scroll aplicado diretamente em um container DOM real (`contentRef.current?.scrollTo(...)`).
* **`AssistantChat`** (`apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/index.tsx`) - Exemplo de navegacao dentro de um container rolavel via `containerRef.current?.scrollTo(...)`.

---

# 6. Analise Tecnica por Camada

## UI - Layout compartilhado

* **Arquivo:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackLayoutView.tsx`
* **Responsabilidade atual:** envolver as paginas autenticadas em um layout com area de conteudo rolavel e dialogo de feedback.
* **Diagnostico:** a pagina nao usa o `window` como superficie principal de scroll; o scroll real acontece em um `div` interno.
* **Evidencia:** o layout renderiza `<div className='flex-1 overflow-auto'>{children}</div>`.
* **Risco associado:** qualquer feature que tente recentralizar conteudo com `window.scrollTo(...)` dentro desse layout pode aparentar "nao fazer nada".

## UI - Estado da Space Page

* **Arquivo:** `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`
* **Responsabilidade atual:** calcular `lastUnlockedStarId`, manter `lastUnlockedStarRef`, expor `scrollIntoLastUnlockedStar()` e atualizar `lastUnlockedStarPosition`.
* **Diagnostico:** a logica de scroll e de monitoramento assume viewport global, nao o container rolavel efetivo da pagina.
* **Evidencia:** a implementacao anterior usava `window.scrollTo(...)` e observava apenas o viewport padrao, desconsiderando o container real da pagina.
* **Risco associado:** a feature continua quebrada nos dois pontos centrais do PRD: auto-centralizacao inicial e recenter via FAB.

## UI - Hook compartilhado de scroll

* **Arquivo:** `apps/web/src/ui/global/hooks/useScrollEvent.ts`
* **Responsabilidade atual:** disparar callbacks quando o Motion detecta mudanca de scroll.
* **Diagnostico:** o hook observa o scroll padrao de `useScroll()` sem container explicito, o que nao acompanha o `overflow-auto` do layout autenticado.
* **Evidencia:** a versao original observava apenas `const { scrollY } = useScroll()` e `useMotionValueEvent(scrollY, 'change', onScroll)`, sem apontar para o container rolavel da Space Page.
* **Risco associado:** o FAB pode manter icone ou visibilidade incorretos mesmo quando o usuario navega manualmente pela Space Page.

## UI - Widget da estrela

* **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts`
* **Responsabilidade atual:** disparar o auto-scroll inicial da ultima estrela, tocar feedback audiovisual e navegar para licao/desafio.
* **Diagnostico:** o auto-scroll inicial depende integralmente da funcao do contexto hoje ligada ao alvo de scroll errado; alem disso, a verificacao de `in view` nao esta alinhada ao container real da pagina.
* **Evidencia:** `scrollIntoLastUnlockedStar()` e chamado no `useEffect` inicial; `useInView(lastUnlockedStarRef)` usa configuracao padrao.
* **Risco associado:** mesmo com a referencia da estrela correta, a pagina pode nao focar a jornada na primeira exibicao e o FAB pode nao refletir com precisao o estado "em tela".

## UI - Pagina

* **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/index.tsx`
* **Responsabilidade atual:** renderizar a trilha e condicionar FAB/icone ao estado do contexto.
* **Diagnostico:** a pagina esta acoplada a um estado de posicao que depende de uma infraestrutura de scroll hoje inconsistente com o layout real.
* **Evidencia:** `isVisible={lastUnlockedStarPosition !== 'in'}` e `onClick={handleFabClick}`.
* **Risco associado:** o usuario continua vendo um controle de navegacao assistida que nao entrega o comportamento prometido pela interface.

---

# 7. Plano de Correcao (Spec)

## 7.1 O que deve ser criado?

**Nao aplicavel**.

## 7.2 O que deve ser modificado?

### UI - Estado da Space Page

* **Arquivo:** `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`
* **Mudanca:** resolver o container de scroll efetivo a partir de `lastUnlockedStarRef.current` (com fallback para `window`), calcular a posicao da estrela em relacao a esse container e executar a recentralizacao no mesmo alvo.
* **Justificativa:** o scroll assistido precisa atuar sobre a area realmente rolavel do layout autenticado, nao sobre o viewport global.
* **Impacto esperado:** o auto-scroll inicial e o clique do FAB passam a mover a Space Page ate a ultima estrela desbloqueada.
* **Camada:** `ui`

### UI - Widget da estrela

* **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts`
* **Mudanca:** alinhar o gatilho de auto-centralizacao inicial e a deteccao de visibilidade ao mesmo container usado pela Space Page; evitar que a confirmacao de estado "in" dependa apenas do viewport padrao.
* **Justificativa:** a primeira exibicao da pagina e o estado visual do FAB precisam usar a mesma referencia espacial da logica de scroll.
* **Impacto esperado:** ao abrir `/space`, a jornada passa a iniciar focada na estrela correta e o FAB deixa de permanecer visivel quando a estrela ja esta na area rolavel atual.
* **Camada:** `ui`

### UI - Hook compartilhado de scroll

* **Arquivo:** `apps/web/src/ui/global/hooks/useScrollEvent.ts`
* **Mudanca:** ajustar o hook para aceitar container customizado, ou retirar seu uso da Space Page em favor de listener nativo acoplado ao container resolvido.
* **Justificativa:** a Space Page precisa reagir ao scroll do container real; manter observacao apenas do viewport preserva a discrepancia atual.
* **Impacto esperado:** `lastUnlockedStarPosition` passa a refletir corretamente se a estrela esta acima, em tela ou abaixo.
* **Camada:** `ui`

## 7.3 O que deve ser removido?

**Nao aplicavel**.

---

# 8. Contratos, Dados e Compatibilidade

Nao aplicavel.

A correcao proposta atua apenas no comportamento de UI/scroll da Space Page. Nao ha evidencia de necessidade de alterar:

* schemas
* DTOs
* payloads REST
* mapeamentos de dados
* contratos do `@stardust/core`

Os dados ja existentes (`PlanetDto` via `SpaceService` e o estado de desbloqueio do `User`) continuam sendo a fonte de verdade da feature.

---

# 9. Decisoes Tecnicas e Trade-offs

* **Decisao:** corrigir o bug na camada `ui`, tornando a logica de scroll da Space Page sensivel ao container real
  * **Alternativas consideradas:** alterar o layout global para voltar a usar `window` como scroll principal; mover a logica para REST/core
  * **Motivo da escolha:** o defeito nasce da coordenacao entre layout e widget de UI; nao ha evidencia de problema no dominio ou nos dados
  * **Impactos / trade-offs:** a correcao fica localizada e segura, mas exige tratar explicitamente a relacao entre ref da estrela e container rolavel

* **Decisao:** preferir uma correcao incremental sobre os arquivos ja existentes, sem criar nova infraestrutura
  * **Alternativas consideradas:** introduzir novo contexto global de scroll ou refatorar amplamente o layout autenticado
  * **Motivo da escolha:** o problema esta concentrado na Space Page e pode ser resolvido reaproveitando a `lastUnlockedStarRef` ja existente
  * **Impactos / trade-offs:** reduz risco de regressao ampla, mas demanda cuidado para manter compatibilidade com fallback em `window`

* **Decisao:** manter `SpaceService` e `User` como fontes de verdade, sem alterar contratos
  * **Alternativas consideradas:** recalcular a ultima estrela no servidor ou incluir metadados extras de viewport no payload
  * **Motivo da escolha:** nao ha evidencia de problema nos dados; o bug e de navegacao visual
  * **Impactos / trade-offs:** a correcao depende apenas da UI, o que simplifica rollout e evita migracoes desnecessarias

---

# 10. Diagramas e Referencias

* **Fluxo afetado:**

```text
Usuario abre /space ou clica no FAB
        |
        v
SpacePage / useStar
        |
        v
useSpaceContextProvider.scrollIntoLastUnlockedStar()
        |
        +--> calcula alvo com lastUnlockedStarRef
        |
        +--> chama window.scrollTo(...)
        |
        v
FeedbackLayoutView usa <div class="flex-1 overflow-auto"> como scroll real
        |
        v
window nao move o container da pagina
        |
        v
ultima estrela permanece fora de foco e FAB pode ficar desatualizado
```

* **Fluxo corrigido:**

```text
Usuario abre /space ou clica no FAB
        |
        v
SpacePage / useStar
        |
        v
useSpaceContextProvider resolve o scrollable parent da ultima estrela
        |
        +--> container.scrollTo(...) ou fallback para window
        +--> listener do mesmo container recalcula above/in/bellow
        |
        v
ultima estrela e recentralizada
        |
        v
FAB atualiza icone/visibilidade com base na area rolavel correta
```

* **Referencias:**
  * `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/ChallengeTabContent/useChallengeTabContent.ts`
  * `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChat/index.tsx`
  * `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackLayoutView.tsx`

---

# 11. Resolucao Final

## 11.1 Implementacao consolidada

* a logica de recentralizacao foi consolidada em `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`, que agora resolve o scrollable parent da ultima estrela e aplica `scrollTo(...)` no container correto, com fallback para `window`
* o listener de scroll passou a ser re-registrado quando a referencia da ultima estrela desbloqueada muda (incluindo fluxo de `refetchUser`), evitando ficar preso no fallback `window` quando o container real aparece depois
* a resolucao do container foi otimizada com cache (`scrollContainerRef`) e validacao rapida antes do fallback para busca por parents, reduzindo custo em eventos de scroll
* o estado `above | in | bellow` passou a ser recalculado contra a mesma superficie de scroll usada pela recentralizacao, eliminando a divergencia entre scroll real e estado do FAB
* `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` deixou de depender de `useInView` no viewport global e passou a usar o estado calculado pelo contexto, mantendo o auto-scroll inicial alinhado ao container real
* `apps/web/src/ui/space/widgets/pages/Space/index.tsx` e `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx` passaram a resolver dependencias de contexto no entry point, mantendo os hooks de widget focados em estado e efeitos de UI
* os fakers de `space` foram centralizados em `packages/core/src/space/domain/entities/fakers` e os antigos caminhos de `tests/fakers` passaram a reexportar a fonte unica para evitar duplicacao

## 11.2 Validacao e regressao

* testes adicionados em `apps/web/src/ui/space/contexts/SpaceContext/tests/useSpaceContextProvider.test.ts` cobrindo ultima estrela desbloqueada, fallback para primeira estrela, centralizacao via `window`, centralizacao via container com `overflow-auto` e estados `above`/`bellow`
* teste adicional no provider garante que, apos refetch do usuario, o estado volta a observar o scroll do container real
* testes atualizados em `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/useStar.test.ts` para garantir o auto-scroll inicial e a sincronizacao do estado visual da ultima estrela
* testes de view mantidos em `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/tests/StarView.test.tsx`
* regressao completa executada com `npm run test` na raiz do monorepo, sem falhas

## 11.3 Conclusao arquitetural

* a correcao permaneceu integralmente na camada `ui`, sem alterar contratos de REST, RPC ou `@stardust/core`
* a causa raiz confirmada bate com o diagnostico inicial: a Space Page estava operando sobre o alvo de scroll errado e derivando o estado visual a partir do viewport padrao, nao do container rolavel efetivo
* durante a consolidacao, tambem foi reforcado o limite entre entry point e hook de widget para aderir melhor a `documentation/rules/ui-layer-rules.md`

---
