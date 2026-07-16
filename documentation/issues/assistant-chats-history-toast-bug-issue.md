Título: Correção do toast de erro ao carregar histórico do assistente

## Objetivo

Corrigir o toast de erro exibido ao carregar a página de desafio quando o assistente de IA tenta listar o histórico de conversas.

Atualmente, ao abrir a página de desafio, aparece um toast com erro de validação semelhante a `Error: erro -> page -> Expected number, received nan; itemsPerPage -> Expected number, received nan`. O comportamento esperado é que a página carregue sem toast de erro, e que a listagem de chats do assistente envie paginação válida para a API.

## Requisitos de Produto

PRD: https://github.com/JohnPetros/stardust/milestone/2

- O assistente de IA deve carregar seu histórico de conversas sem exibir erros indevidos ao usuário.
- A página de desafio não deve exibir toast de erro durante o carregamento normal do assistente.
- A listagem de chats deve usar paginação válida e compatível com a API.

## Requisitos Técnicos

Camadas impactadas: ui, rest, web

Fluxo - carregamento do histórico de chats do assistente:

1. O usuário autenticado acessa a página de desafio.
2. O widget do assistente de IA inicializa o histórico de conversas.
3. `useAssistantChatsHistory` usa `usePaginatedCache` para buscar `/conversation/chats`.
4. `usePaginatedCache` deve montar uma chave de paginação estável e extrair corretamente o número da página.
5. `ConversationService.fetchChats` deve enviar `page` e `itemsPerPage` numéricos válidos.
6. A rota `/conversation/chats` deve receber query params válidos e retornar a lista sem disparar toast de erro.

Contratos esperados:

- `usePaginatedCache.getKey(pageIndex, previousPageData) -> string | null` deve montar uma key que preserve query params válidos e parseáveis.
- `usePaginatedCache.infiniteFetcher(key) -> Promise<CacheItem[]>` não deve depender de split frágil que confunda `page` com `itemsPerPage`.
- `ConversationService.fetchChats({ page, itemsPerPage, search })` deve receber `OrdinalNumber` válido para `page` e `itemsPerPage`.
- `ChatsRouter` deve continuar validando `page` e `itemsPerPage`, mas não deve receber `NaN` produzido pela UI.

## Referências na Codebase

- `apps/web/src/ui/global/hooks/usePaginatedCache.ts` - monta a key como `${key}?${dependenciesQuery}&itemsPerPage=${itemsPerPage}&page=${pageIndex + 1}` e extrai a página com `Number(key.split('&page=').at(-1))`. Como a key contém `&itemsPerPage=`, o split pode capturar o trecho errado e produzir `NaN`.
- `apps/web/src/ui/challenging/widgets/layouts/Challenge/AssistantChatbot/AssistantChatsHistory/useAssistantChatsHistory.ts` - usa `usePaginatedCache` com `CACHE.keys.assistantChats`, `itemsPerPage: 10`, `isInfinity: true` e chama `OrdinalNumber.create(page)`.
- `apps/web/src/rest/services/ConversationService.ts` - envia `page.value` e `itemsPerPage.value` como query params para `/conversation/chats`.
- `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts` - valida a query da rota `/conversation/chats` com `pageSchema` e `itemsPerPageSchema`, rejeitando `NaN`.
- `packages/validation/src/modules/global/schemas/pageSchema.ts` - define `page` como número coercível com mínimo `1`.
- `packages/validation/src/modules/global/schemas/itemsPerPageSchema.ts` - define `itemsPerPage` como número coercível com mínimo `1`.
