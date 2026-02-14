# Regras da Camada REST

## Visao Geral

A camada **REST** padroniza comunicacao HTTP com APIs externas e com o backend, consolidando configuracao, parsing e tratamento de erros via `RestClient`.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Transportar dados via HTTP com contratos estaveis (`RestClient`, `RestResponse`). |
| **Responsabilidades** | Implementar `clients` por ambiente; implementar `services` tipados por rota; normalizar erros e paginacao. |
| **Nao faz** | Regra de negocio (use-cases/entidades); instanciar `RestClient` dentro de `service`. |

## Estrutura de Diretorios

| App | Caminho | Finalidade |
| --- | --- | --- |
| Web | `apps/web/src/rest/next/` | Clientes `fetch` e adaptacoes Next. |
| Web | `apps/web/src/rest/services/` | Services consumidos por UI/RPC/tools. |
| Web | `apps/web/src/rest/controllers/` | Controllers/handlers na borda web (quando aplicavel). |
| Server | `apps/server/src/rest/axios/AxiosRestClient.ts` | Implementacao do `RestClient` via `axios`. |
| Server | `apps/server/src/rest/services/` | Services usados pelo server. |
| Server | `apps/server/src/rest/controllers/` | Controllers na borda server. |
| Studio | `apps/studio/src/rest/axios/AxiosRestClient.ts` | Implementacao do `RestClient` via `axios`. |

## Regras

- **Inversao de dependencia**: `services` recebem `RestClient` por injecao (argumento ou construtor).
- **Retorno**: metodos retornam `Promise<RestResponse<Body>>` (ou `RestResponse` sem `body`).
- **Falhas**: sempre tratar `response.isFailure` e usar `response.throwError()` quando necessario.
- **URLs**: `routes` em `services` sao relativas; `baseUrl` e configurada no `client` (`setBaseUrl`).
- **DTO mapping**: se a API retorna um `shape` diferente do dominio, mapear antes de retornar.

> ⚠️ Proibido: instanciar `RestClient` dentro de `*/rest/services/**`.

## Padroes

- **Clientes por ambiente**
  - Web: `apps/web/src/rest/next/NextRestClient.ts` (baseado em `fetch`).
  - Web (server-side): `apps/web/src/rest/next/NextServerRestClient.ts` (baseUrl + auth via cookies).
  - Server: `apps/server/src/rest/axios/AxiosRestClient.ts` (baseado em `axios`).
  - Studio: `apps/studio/src/rest/axios/AxiosRestClient.ts` (baseado em `axios`).
- **Services tipados**: Web/Studio preferem factory functions (ex: `apps/web/src/rest/services/ConversationService.ts`).
- **Paginacao**: clients detectam headers e retornam `PaginationResponse` quando aplicavel.
- **Query params**: preferir `setQueryParam` no `RestClient`.

## Exemplo

```ts
import type { RestClient } from '@stardust/core/global/interfaces'
import type { ConversationService as IConversationService } from '@stardust/core/conversation/interfaces'

export const ConversationService = (restClient: RestClient): IConversationService => {
  return {
    async fetchChatMessages(chatId) {
      return await restClient.get(`/conversation/chats/${chatId.value}/messages`)
    },
  }
}
```

## Integracao com Outras Camadas

- **Permitido**: importar contratos do core (ex: `@stardust/core/global/interfaces`, `@stardust/core/global/responses`).
- **Proibido**: `@stardust/core` importar qualquer coisa de `apps/**`.
- **Contrato**: `RestClient` + `RestResponse` (core).
- **Direcao**: apps implementam adaptadores REST; o core define interfaces/DTOs.

## Checklist (antes do PR)

- Interface no core existe/foi atualizada.
- Service recebe `RestClient` por injecao.
- Retorno e `RestResponse` tipado.
- URL e relativa; `baseUrl` configurada no client.
- Mapeamento de formatos externos esta encapsulado no service.

## Notas

- `NextServerRestClient` usa cookies para `authorization` quando presente (`apps/web/src/rest/next/NextServerRestClient.ts`).
- Tooling: `documentation/tooling.md`.
