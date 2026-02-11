# Diretrizes da Camada REST

A camada `rest` é responsável por realizar requisições HTTP para APIs externas e serviços remotos. Ela atua como uma porta de saída da aplicação, permitindo que o sistema interaja com outros serviços através do protocolo HTTP.

## Visão Geral

O objetivo principal desta camada é abstrair a complexidade das requisições HTTP (como configuração de headers, parsing de resposta, tratamento de erros e paginação) através de uma interface unificada `RestClient`.

*   **Interface Base:** `RestClient` (`@stardust/core/global/interfaces`)
*   **Resposta Padrão:** `RestResponse<Body>` (`@stardust/core/global/responses`)

## Implementações

Existem duas implementações principais do `RestClient`, adaptadas para cada ambiente:

### 1. Web (`apps/web`) -> `NextRestClient`
Utilizada pelo Frontend (Next.js) para se comunicar com o Backend (`apps/server`) ou outras APIs.
*   **Tecnologia Base:** `fetch` (Nativo)
*   **Recursos Específicos:** Suporte a cache e revalidação do Next.js 13+ (`tags`, `revalidate`).
*   **Localização:** `apps/web/src/rest/next/NextRestClient.ts`

### 2. Studio (`apps/studio`) -> `AxiosRestClient`
Utilizada pelo Painel Admin (Remix/Vite) para comunicação com o Backend.
*   **Tecnologia Base:** `axios`
*   **Padrão:** Factory Function (diferente do Server que usa Class)
*   **Localização:** `apps/studio/src/rest/axios/AxiosRestClient.ts`

### 3. Server (`apps/server`) -> `AxiosRestClient`
Utilizada pelo Backend para consumir serviços externos (ex: Supabase, Discord, Gateways de Pagamento).
*   **Tecnologia Base:** `axios`
*   **Padrão:** Classe Singleton/Instanciável
*   **Localização:** `apps/server/src/rest/axios/AxiosRestClient.ts`

## Estrutura de Pastas

```text
src/rest/
├── axios/ ou next/      # Implementação concreta do cliente (Infrastructure)
└── services/            # Serviços de domínio que consomem APIs (Use Cases)
```

## Como Implementar um Novo Serviço REST

Os serviços REST devem implementar interfaces de domínio definidas no pacote `core`. Eles traduzem chamadas de métodos tipados para rotas HTTP.

### Passo 1: Definir a Interface no Core
Garanta que a interface do serviço exista em `@stardust/core/<dominio>/interfaces`.

```typescript
// core/src/notification/interfaces/NotificationService.ts
export interface NotificationService {
  sendPlanetCompletedNotification(user: string, planet: string): Promise<RestResponse>
}
```

### Passo 2: Criar a Classe/Factory de Serviço
Implemente a interface injetando o `RestClient`.

**No Server (Classe):**
```typescript
import type { RestClient } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'

export class DiscordNotificationService implements NotificationService {
  constructor(private readonly restClient: RestClient) {}

  async sendPlanetCompletedNotification(user: string, planet: string) {
    return await this.restClient.post('/', {
      content: `Usuário ${user} completou o planeta ${planet}`,
    })
  }
}
```

**Na Web e Studio (Factory Function):**
```typescript
import type { ProfileService as IProfileService } from '@stardust/core/profile/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

export const ProfileService = (restClient: RestClient): IProfileService => {
  return {
    async fetchUserById(userId: Id) {
      return await restClient.get(`/profile/users/id/${userId.value}`)
    },
    // ...
  }
}
```

## Funcionalidades do RestClient

### Gerenciamento de Query Params
Use `setQueryParam` para adicionar parâmetros de busca de forma estruturada antes de realizar a chamada. O `clearQueryParams` deve ser chamado quando necessário (embora o cliente Web faça isso automaticamente após um GET bem-sucedido em alguns casos).

```typescript
restClient.setQueryParam('page', '1')
restClient.setQueryParam('search', 'query')
const response = await restClient.get('/users')
```

### Tratamento de Paginação
O `RestClient` detecta automaticamente headers de paginação (ex: `x-pagination-response`). Se presentes, ele encapsula o corpo da resposta em um `PaginationResponse`.

```typescript
if (response.body instanceof PaginationResponse) {
  console.log(response.body.items)      // Dados
  console.log(response.body.totalItems) // Total
}
```

### Tratamento de Erros
Todas as respostas são envolvidas em um `RestResponse`.
*   Verifique `response.isFailure` para erros.
*   Use `response.throwError()` para lançar o erro capturado se necessário.

## Boas Práticas

1.  **Sempre tipar o retorno:** Use `Promise<RestResponse<SeuTipoDTO>>`.
2.  **Injeção de Dependência:** Nunca instancie o `RestClient` diretamente dentro do serviço. Receba-o via construtor ou argumento.
3.  **URLs Relativas:** Configure a `baseUrl` no cliente, e use caminhos relativos nos serviços (`/users` em vez de `http://api.../users`).
4.  **Mapeamentos:** Se a API externa retornar dados em formato diferente do esperado pelo domínio, faça a conversão dentro do serviço REST antes de retornar.

## Tooling

- Execucao por app (onde a implementacao vive):
  - Web: `npm run dev -w @stardust/web`.
  - Studio: `npm run dev -w @stardust/studio`.
  - Server: `npm run dev -w @stardust/server`.
- Qualidade (por workspace): `npm run codecheck -w <workspace>` e `npm run typecheck -w <workspace>`.
- Testes (quando aplicavel): `npm run test -w <workspace>`.
- Referencia geral: `documentation/tooling.md`.
