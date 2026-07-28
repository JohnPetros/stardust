---
title: Toast de erro ao carregar histórico do assistente
prd: https://github.com/JohnPetros/stardust/milestone/2
issue: https://github.com/JohnPetros/stardust/issues/492
apps: web
status: open
last_updated_at: 2026-07-27
---

# Bug Report: Toast de erro ao carregar histórico do assistente

## Problema Identificado

Ao acessar autenticado uma página de desafio, o carregamento automático do histórico de conversas do assistente exibe um toast de validação semelhante a `Error: erro -> page -> Expected number, received nan; itemsPerPage -> Expected number, received nan`. A página deveria carregar sem apresentar erro durante a inicialização normal do assistente, e o histórico deveria consultar a API com paginação válida.

## Causas

- **Fato:** o histórico é montado junto com o assistente e inicia a consulta antes de o diálogo ser aberto; qualquer falha dessa consulta é encaminhada ao toast global.
- **Fato:** o erro observado corresponde à rejeição de `page` e `itemsPerPage` pela validação da rota `/conversation/chats`, indicando que a requisição que falhou não apresentou valores numéricos válidos para esses campos.
- **Hipótese principal:** a página pode se perder no transporte interno entre `getKey` e `infiniteFetcher`, pois `usePaginatedCache` codifica a paginação em uma string e a recupera com `split` e `Number`, sem validar explicitamente o resultado antes de chamar o fetcher.
- **Lacuna de confirmação:** com a implementação atual, a chave `/assistant-chats?&itemsPerPage=10&page=1` resulta em `page = 1`; portanto, a afirmação de que `itemsPerPage` é capturado pelo `split('&page=')` não se confirma por inspeção estática. Não há teste que execute a integração entre a chave gerada, o fetcher do SWR e a serialização do service, então a condição exata que produz os dois `NaN` continua sem reprodução automatizada.

## Contexto e Análise

### Camada REST (Services)

- **Arquivo:** `apps/web/src/rest/services/ConversationService.ts`
- **Diagnóstico:** `fetchChats` serializa `page.value` e `itemsPerPage.value` como query params antes de chamar `/conversation/chats`. Quando recebe instâncias válidas de `OrdinalNumber`, o service produz valores numéricos válidos; logo, não há evidência de erro de mapeamento neste arquivo. Ele é, porém, o último ponto no cliente em que a integridade da paginação pode ser verificada antes da requisição HTTP.

### Camada UI (Widgets)

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts`
- **Diagnóstico:** o hook habilita `usePaginatedCache` assim que a conta está autenticada, mesmo com o diálogo fechado. O número extraído da chave é convertido em `OrdinalNumber` e uma resposta HTTP inválida é lançada por `response.throwError()`, fazendo a falha alcançar o tratador global do cache.

- **Arquivo:** `apps/web/src/ui/global/hooks/usePaginatedCache.ts`
- **Diagnóstico:** `getKey` embute dependências, quantidade por página e página em uma string opaca; `infiniteFetcher` recupera a página com `Number(key.split('&page=').at(-1))`. Essa dependência implícita do formato da chave não garante, no próprio hook, que o valor recuperado seja inteiro, finito e maior que zero. O `onError` exibe toda falha não relacionada à autenticação como toast, tornando o erro de paginação visível durante a montagem da página.

### Camada Next.js App (Pages, Layouts)

- **Arquivo:** `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/layout.tsx`
- **Diagnóstico:** o layout compõe `ChallengeLayout`, que monta o painel do assistente na página de desafio. Não há evidência de defeito no layout, mas ele é o ponto de entrada do fluxo no qual o histórico passa a ser inicializado e o toast é observado.

## Direcionamento de Correção

A correção deve se concentrar no contrato de paginação entre `usePaginatedCache` e `useAssistantChatsHistory`, substituindo ou endurecendo a extração manual da página para que somente um inteiro positivo chegue ao `ConversationService`. A validação da rota deve ser preservada, e a correção precisa ser acompanhada por uma cobertura de regressão que percorra a chave do SWR até os query params enviados, reproduzindo o carregamento inicial autenticado sem toast.
