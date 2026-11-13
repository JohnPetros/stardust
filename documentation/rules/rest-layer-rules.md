# REST Layer Rules

## Overview

The **REST** layer standardizes HTTP communication with external APIs and with the backend, consolidating configuration, parsing and error handling through `RestClient`.

| Item | Definition |
| --- | --- |
| **Goal** | Transport data over HTTP with stable contracts (`RestClient`, `RestResponse`). |
| **Responsibilities** | Implement `clients` per environment; implement typed `services` per route; normalize errors and pagination. |
| **Does not do** | Business rules (use cases/entities); instantiate `RestClient` inside a `service`. |

## Directory Structure

| App | Path | Purpose |
| --- | --- | --- |
| Web | `apps/web/src/rest/next/` | `fetch` clients and Next adaptations. |
| Web | `apps/web/src/rest/services/` | Services consumed by UI/RPC/tools. |
| Web | `apps/web/src/rest/controllers/` | Controllers/handlers at the web edge (when applicable). |
| Server | `apps/server/src/rest/axios/AxiosRestClient.ts` | `RestClient` implementation via `axios`. |
| Server | `apps/server/src/rest/services/` | Services used by the server. |
| Server | `apps/server/src/rest/controllers/` | Controllers at the server edge. |
| Backoffice | `apps/backoffice/src/rest/axios/AxiosRestClient.ts` | `RestClient` implementation via `axios`. |

## Rules

- **Dependency inversion**: `services` receive `RestClient` by injection (argument or constructor).
- **Return**: methods return `Promise<RestResponse<Body>>` (or `RestResponse` without `body`).
- **Failures**: always handle `response.isFailure` and use `response.throwError()` when necessary.
- **URLs**: `routes` in `services` are relative; `baseUrl` is configured in the `client` (`setBaseUrl`).
- **DTO mapping**: if the API returns a `shape` different from the domain, map it before returning.

> ⚠️ Forbidden: instantiating `RestClient` inside `*/rest/services/**`.

## Patterns

- **Clients per environment**
  - Web: `apps/web/src/rest/next/NextRestClient.ts` (based on `fetch`).
  - Web (server-side): `apps/web/src/rest/next/NextServerRestClient.ts` (baseUrl + auth via cookies).
  - Server: `apps/server/src/rest/axios/AxiosRestClient.ts` (based on `axios`).
  - Backoffice: `apps/backoffice/src/rest/axios/AxiosRestClient.ts` (based on `axios`).
- **Typed services**: Web/Backoffice prefer factory functions (e.g., `apps/web/src/rest/services/ConversationService.ts`).
- **Pagination**: clients detect headers and return `PaginationResponse` when applicable.
- **Query params**: prefer `setQueryParam` on `RestClient`.

### Registered anti-patterns

### Anti-pattern: REST Service with primitive parameters instead of domain objects

**What was done:**
REST service methods were implemented with primitive parameters for API key cases, for example:
`async createApiKey(name: string)` and `async renameApiKey(apiKeyId: Id, name: string)`.

**Why it is wrong:**
When the core contract already defines domain objects/structures (such as `Name` and `Id`), using primitives in the service breaks the typed boundary between domain and adapter, makes it easier to bypass semantic validations and creates divergence between the interface and the implementation in the apps (`web`, `server`, `backoffice`).

**What should be done:**
`services` methods must receive only domain objects defined in the core contract and serialize to primitives only at the moment of the HTTP call.

Correct example:

```ts
async createApiKey(name: Name) {
  return await restClient.post('/auth/api-keys', { name: name.value })
}

async renameApiKey(apiKeyId: Id, name: Name) {
  return await restClient.patch(`/auth/api-keys/${apiKeyId.value}`, {
    name: name.value,
  })
}
```

## Example

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

## Integration with Other Layers

- **Allowed**: import core contracts (e.g., `@stardust/core/global/interfaces`, `@stardust/core/global/responses`).
- **Forbidden**: `@stardust/core` importing anything from `apps/**`.
- **Contract**: `RestClient` + `RestResponse` (core).
- **Direction**: apps implement REST adapters; the core defines interfaces/DTOs.

## Checklist (before the PR)

- Interface in the core exists/was updated.
- Service receives `RestClient` by injection.
- Return is a typed `RestResponse`.
- URL is relative; `baseUrl` is configured in the client.
- Mapping of external formats is encapsulated in the service.

## Notes

- `NextServerRestClient` uses cookies for `authorization` when present (`apps/web/src/rest/next/NextServerRestClient.ts`).
- Tooling: `documentation/tooling.md`.
