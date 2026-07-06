---
title: Rota de Resultado do Challenge Retorna 404
prd: https://github.com/JohnPetros/stardust/milestone/14
issue: https://github.com/JohnPetros/stardust/issues/454
apps: web
status: open
last_updated_at: 2026-07-03
---

# Bug Report: Rota de Resultado do Challenge Retorna 404

## Problema Identificado

Ao executar o codigo de um desafio ou acessar diretamente `/challenging/challenges/[challengeSlug]/challenge/result`, a aplicacao web navega para uma pagina 404. O comportamento esperado e manter o usuario dentro do layout de challenge e renderizar a aba `ChallengeResultSlot` como conteudo ativo da area de abas.

O erro afeta tanto a navegacao iniciada por `useChallengeCodeEditorSlot.handleRunCode()` quanto o acesso direto ou refresh da URL canonica de resultado.

## Causas

- A URL canonica de resultado existe em `ROUTES.challenging.challenges.challengeResult(challengeSlug)`, mas nao ha uma entrada explicita no slot implicito `children` em `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/result/page.tsx`.
- A implementacao atual do resultado existe apenas dentro do slot paralelo `@tabContent/result/page.tsx`. Em rotas paralelas do App Router, pastas `@slot` nao fazem parte da URL; a navegacao dura para uma rota profunda tambem precisa que os slots nao correspondentes tenham fallback valido e que a arvore de rota publica consiga resolver o segmento solicitado.
- O hook `useChallengeResultSlot()` ja depende de `currentRoute.endsWith('/result')` para restaurar estado de resposta concluida, mas a rota 404 impede que esse codigo seja montado.
- Nao ha teste co-localizado de App Router ou fluxo Playwright cobrindo a rota publica `/challenging/challenges/[challengeSlug]/challenge/result`, permitindo a regressao de roteamento.

## Contexto e Análise

### Camada UI (Widgets)

- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts`
- **Diagnóstico:** Fato: `handleRunCode()` executa o codigo, atualiza `results` no `ChallengeStore` e navega para `ROUTES.challenging.challenges.challengeResult(challenge.slug.value)`. O destino gerado e a URL publica `/challenging/challenges/${challengeSlug}/challenge/result`. O hook esta alinhado ao contrato esperado, mas depende de a rota existir no App Router.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/slots/ChallengeResult/useChallengeResultSlot.ts`
- **Diagnóstico:** Fato: o hook consome `results` do store, usa o `challenge` hidratado e possui regra especifica para `currentRoute.endsWith('/result')` restaurar a resposta verificada quando o desafio ja esta concluido. A logica pressupoe que a pagina `/result` monte normalmente; com 404, essa restauracao nunca executa.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
- **Diagnóstico:** Fato: o hook deriva `activeContent` do ultimo segmento de `currentRoute` e define `result` como conteudo ativo quando a URL termina em `/result`. A UI ja esta preparada para reconhecer a rota final, desde que o App Router consiga renderizar a pagina.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/components/ChallengeContentLink/useChallengeContentLink.ts`
- **Diagnóstico:** Fato: links de conteudo montam URLs no formato `/challenging/challenges/${challengeSlug}/challenge/${contentType}` para abas diferentes de `description`. Isso confirma que `result` e tratado como segmento publico de URL, nao apenas como estado interno de aba.

### Camada UI (Stores)

- **Arquivo:** `apps/web/src/ui/challenging/stores/ChallengeStore/index.ts`
- **Diagnóstico:** Fato: o store centraliza `challenge`, `activeContent`, `results` e `tabHandler`, que sao os estados consumidos pelo layout, pelo editor e pela aba de resultado. O problema nao esta no contrato do store; ele e impactado porque a pagina de resultado nao monta.

### Camada Next.js App (Pages, Layouts)

- **Arquivo:** `apps/web/src/constants/routes.ts`
- **Diagnóstico:** Fato: `ROUTES.challenging.challenges.challengeResult(challengeSlug)` retorna `/challenging/challenges/${challengeSlug}/challenge/result`, que e a URL canonica descrita na issue e usada pelo editor.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx`
- **Diagnóstico:** Fato: o layout recebe `children` como header, `tabContent` e `codeEditor` como slots paralelos, e os injeta em `ChallengeLayout`. A solucao deve preservar essa composicao para que `/result` continue exibindo header, aba e editor no mesmo contexto de challenge.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx`
- **Diagnóstico:** Fato: a pagina base `/challenge` carrega `challengeSlug`, busca dados via `challengingActions` e renderiza `ChallengePage` como conteudo do slot `children`. Hipotese: a rota `/challenge/result` precisa de uma entrada equivalente para hidratar o mesmo header no slot `children` durante navegacao direta.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/result/page.tsx`
- **Diagnóstico:** Fato: o conteudo de resultado esta implementado como slot paralelo e renderiza `ChallengeResultSlot`. Hipotese: por estar somente dentro de `@tabContent`, ele nao e suficiente para tornar `/challenge/result` uma rota publica completa sem uma pagina correspondente no slot implicito `children`.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/result/default.tsx`
- **Diagnóstico:** Fato: existe fallback para o slot `@tabContent/result`, mas ele renderiza o mesmo `ChallengeResultSlot`. O fallback nao substitui a necessidade de resolver corretamente o segmento publico `/result` na arvore da rota.

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@codeEditor/default.tsx`
- **Diagnóstico:** Fato: o slot `@codeEditor` possui fallback e consegue manter o editor quando outro segmento da rota esta ativo. Esse padrao deve ser preservado para que o resultado seja exibido ao lado do editor.

## Plano de Correção

### 1. O que já existe?

- **web**
  - `ROUTES.challenging.challenges.challengeResult()` — Define a URL canonica `/challenging/challenges/${challengeSlug}/challenge/result`.
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx` — Compoe o layout de challenge com slots `children`, `tabContent` e `codeEditor`.
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` — Hidrata o header/contexto principal do challenge na rota base.
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/result/page.tsx` — Renderiza o conteudo visual da aba de resultado.

- **ui**
  - `useChallengeCodeEditorSlot()` — Executa codigo, persiste resultados no store e navega para a rota de resultado.
  - `useChallengeResultSlot()` — Renderiza/verifica resultados e restaura estado quando a rota termina em `/result`.
  - `useChallengePage()` — Hidrata o challenge e sincroniza `activeContent` com o segmento final da URL.
  - `ChallengeStore` — Mantem `challenge`, `results`, `activeContent` e handlers de tab/slider.

### 2. O que deve ser criado?

- **web**
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/result/page.tsx` — Nova entrada publica da rota `/challenge/result`, reutilizando a mesma composicao de carregamento de `challenge/page.tsx` para renderizar `ChallengePage` no slot `children` e permitir que `@tabContent/result/page.tsx` seja montado no layout.
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/result/tests/page.test.tsx` — Teste co-localizado da rota App Router garantindo que `params.challengeSlug` e dependencias de borda sejam resolvidas e que a pagina renderize o contexto do challenge sem `notFound`.
  - `apps/web/src/app/tests/challenging/challenge-result.test.ts` — Teste Playwright do fluxo publico `/challenging/challenges/[challengeSlug]/challenge/result`, cobrindo acesso direto ou refresh da rota dentro do layout de challenge.

### 3. O que deve ser modificado?

- **web**
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/page.tsx` — Extrair a composicao compartilhada de carregamento do challenge para evitar duplicacao entre a rota base e `result/page.tsx`, ou reutilizar uma helper local existente se a implementacao optar por criacao incremental.
  - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/result/page.tsx` — Manter a renderizacao de `ChallengeResultSlot`, ajustando apenas se a nova pagina publica exigir alinhamento de fallback ou export.

- **ui**
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeCodeEditor/useChallengeCodeEditorSlot.ts` — Preservar a navegacao para `ROUTES.challenging.challenges.challengeResult(challenge.slug.value)` e validar por teste que o destino agora resolve.
  - `apps/web/src/ui/challenging/widgets/slots/ChallengeResult/useChallengeResultSlot.ts` — Preservar a regra `currentRoute.endsWith('/result')`; adicionar cobertura se a restauracao de estado em refresh ainda nao estiver protegida por teste.

### 4. O que deve ser removido?

- **web**
  - Nenhuma remocao obrigatoria identificada. Se a correcao extrair uma helper compartilhada para carregar o challenge, remover apenas duplicacao local introduzida entre `challenge/page.tsx` e `challenge/result/page.tsx`.
