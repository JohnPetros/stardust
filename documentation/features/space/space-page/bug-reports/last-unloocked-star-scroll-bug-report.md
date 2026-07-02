---
title: Centralizacao da ultima estrela desbloqueada para antes do destino
issue: https://github.com/JohnPetros/stardust/issues/445
apps: web
status: closed
last_updated_at: 2026-07-02
---

# Bug Report: Centralizacao da ultima estrela desbloqueada para antes do destino

## Problema Identificado

Ao carregar `/space`, a navegacao assistida tenta levar o usuario ate a ultima estrela desbloqueada, mas o scroll pode parar algumas estrelas antes do destino real. O mesmo risco afeta o FAB "Ir ate a ultima estrela desbloqueada", que deve recentralizar a jornada no progresso atual do usuario, mas pode usar uma medicao ainda inconsistente do layout.

## Causas

- Estabilizacao de layout possivelmente concluida cedo demais antes da posicao final da estrela e da altura efetiva do container rolavel estarem confiaveis.
- Calculo de centralizacao dependente de `getBoundingClientRect()` no momento do disparo, sem uma garantia forte de que assets, animacoes e dimensoes da Space Page ja terminaram de alterar o layout.
- Estado visual do FAB pode ser atualizado como `in` com base na medicao corrente, mesmo quando o auto-scroll inicial terminou antes da ultima estrela desbloqueada.

## Contexto e Análise

### Camada UI (Contexts)

- **Arquivo:** `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`
- **Diagnóstico:** O contexto identifica `lastUnlockedStarId` percorrendo planetas e estrelas em ordem reversa, mantem `lastUnlockedStarRef`, resolve o container rolavel e executa `scrollIntoLastUnlockedStar()`. Fato encontrado no codigo: a centralizacao usa a posicao atual de `lastUnlockedStarRef.current.getBoundingClientRect()` contra o container resolvido no momento do scroll. Hipotese do bug: se esse metodo for chamado antes do layout final da Space Page estabilizar, o `top` calculado fica defasado e o scroll centraliza uma posicao anterior a estrela correta.

### Camada UI (Widgets)

- **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts`
- **Diagnóstico:** O hook da estrela dispara o auto-scroll inicial apenas uma vez quando `isLastUnlockedStar` e a ref DOM existem. Fato encontrado no codigo: `getLayoutSnapshot()` considera `starRect.top`, `starRect.height` e `document.documentElement.scrollHeight`, exigindo duas iteracoes estaveis ou no maximo 30 tentativas antes de chamar `scrollIntoLastUnlockedStar()`. Hipotese do bug: esse snapshot pode nao representar a altura ou estabilidade real do container interno usado pela Space Page, permitindo que a espera termine enquanto imagens, animacoes ou o proprio container rolavel ainda mudam.

- **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/index.tsx`
- **Diagnóstico:** O entry point da estrela compara `lastUnlockedStarId` com o id da estrela renderizada e passa `lastUnlockedStarRef`, `lastUnlockedStarPosition` e `scrollIntoLastUnlockedStar()` para `useStar`. Esse arquivo confirma que apenas a estrela considerada ultima desbloqueada ancora a ref usada pelas medicoes; portanto, o sintoma nao indica, por si so, falha na selecao da estrela, mas sim no momento e na confiabilidade da medicao usada para rolar ate ela.

- **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/StarView.tsx`
- **Diagnóstico:** A ref da ultima estrela desbloqueada e anexada ao wrapper externo do item de estrela. O elemento medido inclui conteudo visual que pode ser afetado por imagens e animacoes, reforcando a necessidade de aguardar estabilidade real antes de calcular o scroll.

- **Arquivo:** `apps/web/src/ui/space/widgets/pages/Space/index.tsx`
- **Diagnóstico:** A pagina renderiza o FAB com `isVisible={lastUnlockedStarPosition !== 'in'}` e reaproveita `scrollIntoLastUnlockedStar()` para a recentralizacao manual. Se `lastUnlockedStarPosition` for atualizado com base em uma medicao antecipada ou divergente, a UI pode esconder o FAB ou indicar estado correto mesmo com a estrela alvo fora da posicao esperada.

### Camada Next.js App (Pages, Layouts)

- **Arquivo:** `apps/web/src/app/(home)/space/page.tsx`
- **Diagnóstico:** A rota `/space` carrega os planetas via `SpaceService.fetchPlanets()` e renderiza `SpaceProvider` com `SpacePage`. Nao ha evidencia neste ponto de erro no carregamento dos dados da trilha; a falha descrita acontece depois da renderizacao, na coordenacao de scroll da UI.

- **Arquivo:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackLayoutView.tsx`
- **Diagnóstico:** O conteudo autenticado roda dentro de um container interno com `overflow-auto`. Esse layout confirma que a Space Page depende de medicoes relativas ao container rolavel real, nao apenas ao documento global. A correcao anterior ja passou a resolver esse container; o bug atual indica que o tempo de medicao e estabilizacao ainda pode ser insuficiente.

## Direcionamento de Correção

A correcao deve atuar na camada `ui`, principalmente em `apps/web/src/ui/space/widgets/pages/Space/Planet/Star/useStar.ts` e `apps/web/src/ui/space/contexts/SpaceContext/useSpaceContextProvider.ts`, fortalecendo o criterio de estabilidade antes do auto-scroll inicial e garantindo que a centralizacao manual pelo FAB sempre use uma medicao atual do mesmo container rolavel real. Nao ha evidencia de necessidade de alterar contratos REST, dados do core ou mapeamentos de banco.
