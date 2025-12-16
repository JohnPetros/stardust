# Camada Core - Regras de Negócio e Interfaces

A camada Core é o coração da aplicação Gaia Web, contendo todas as regras de negócio, interfaces e contratos em TypeScript puro. Esta camada é **completamente independente** de frameworks externos e serve como base para todas as outras camadas da aplicação.

## 🏗️ Arquitetura da Camada

A camada Core é organizada por **domínios de negócio**, facilitando a manutenção e evolução independente de cada funcionalidade:

```
src/core/
├── global/                 # Elementos globais da aplicação
│   ├── constants/          # Constantes globais
│   ├── interfaces/         # Interfaces globais
│   ├── responses/          # Classes de resposta padronizadas
│   └── types/              # Tipos globais
├── membership/             # Domínio de membership
│   ├── dtos/               # DTOs específicos de membership
│   ├── interfaces/         # Interfaces específicas de membership
│   └── types/              # Tipos específicos de membership
└── telemetry/              # Domínio de telemetria
    └── dtos/               # DTOs específicos de telemetria
```

## 📋 Princípios Fundamentais

### ✅ O que DEVE conter
- **Interfaces e contratos** para todas as operações
- **DTOs (Data Transfer Objects)** para transferência de dados
- **Tipos TypeScript** para tipagem forte
- **Constantes** de configuração e valores fixos
- **Classes de resposta** padronizadas
- **Regras de negócio** puras em TypeScript

### ❌ O que NUNCA deve conter
- **Dependências externas** (React, Axios, etc.)
- **Implementações concretas** de serviços
- **Lógica de apresentação** ou UI
- **Configurações de banco de dados**
- **Código específico de framework**

## 🌐 Módulo Global

O módulo global contém elementos compartilhados por toda a aplicação.

### Constants (`src/core/global/constants/`)

#### `env.ts` - Variáveis de Ambiente
```typescript
// Validação e tipagem de variáveis de ambiente
const envSchema = z.object({
  gaiaServerUrl: z.url(),
})

export const ENV = envSchema.parse({
  gaiaServerUrl: process.env.SERVER_APP_URL,
})
```

#### `http-headers.ts` - Cabeçalhos HTTP
```typescript
export const HTTP_HEADERS = {
  authorization: 'Authorization',
  xPass: 'X-Pass',
  xPaginationResponse: 'X-Pagination-Response',
  // ... outros cabeçalhos
} as const
```

#### `http-status-code.ts` - Códigos de Status HTTP
```typescript
export const HTTP_STATUS_CODE = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  // ... outros códigos
} as const
```

#### `routes.ts` - Constantes de Rotas
```typescript
export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  stations: '/stations',
  api: {
    membership: {
      createUser: '/api/membership/users/create-user',
      // ... outras rotas de API
    },
  },
}
```

### Interfaces (`src/core/global/interfaces/`)

#### `rest-client.ts` - Interface do Cliente HTTP
```typescript
export interface RestClient {
  get<ResponseBody>(url: string): Promise<RestResponse<ResponseBody>>
  post<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  // ... outros métodos HTTP
  setBaseUrl(url: string): void
  setAuthorization(token: string): void
}
```

#### `call.ts` - Interface para Chamadas RPC
```typescript
export interface Call<Request = void> {
  getFormData(): Promise<Request>
  redirect(route: string): void
}
```

### Responses (`src/core/global/responses/`)

#### `rest-response.ts` - Classe de Resposta HTTP
```typescript
export class RestResponse<Body = unknown> {
  readonly statusCode: number
  readonly headers: Record<string, string>
  
  get isSuccessful(): boolean
  get isFailure(): boolean
  get isValidationFailure(): boolean
  get body(): Body
  get errorMessage(): string
  throwError(): never
}
```

#### `pagination-response.ts` - Resposta Paginada
```typescript
export class PaginationResponse<Item> {
  readonly items: Item[]
  readonly pageSize: number
  readonly nextCursor: string | null
  readonly previousCursor: string | null
  readonly hasNextPage: boolean
  readonly hasPreviousPage: boolean
}
```

### Types (`src/core/global/types/`)

#### `pagination-params.ts` - Parâmetros de Paginação
```typescript
export type PaginationParams = {
  nextCursor: string | null
  previousCursor: string | null
  pageSize: number
}
```

## 👥 Módulo Membership

Domínio responsável por operações relacionadas a usuários e permissões.

### DTOs (`src/core/membership/dtos/`)

#### `user-dto.ts` - DTO de Usuário
```typescript
export type UserDto = {
  id?: string
  name: string
  email: string
  role: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
```

### Interfaces (`src/core/membership/interfaces/`)

#### `membership-service.ts` - Interface do Serviço de Membership
```typescript
export interface MembershipService {
  fetchUsers(params: UsersListingParams): Promise<RestResponse<PaginationResponse<UserDto>>>
  createUser(userDto: UserDto): Promise<RestResponse<UserDto>>
  updateUser(userDto: UserDto): Promise<RestResponse<UserDto>>
  activateUser(userId: string): Promise<RestResponse<void>>
  deactivateUser(userId: string): Promise<RestResponse<void>>
}
```

### Types (`src/core/membership/types/`)

#### `users-listing-params.ts` - Parâmetros de Listagem de Usuários
```typescript
export type UsersListingParams = {
  name?: string
  status?: string
} & PaginationParams
```

## 📊 Módulo Telemetry

Domínio responsável por operações relacionadas a telemetria e parâmetros meteorológicos.

### DTOs (`src/core/telemetry/dtos/`)

#### `parameter-dto.ts` - DTO de Parâmetro
```typescript
export type ParameterDto = {
  id?: string
  name: string
  unitOfMeasure: string
  factor: number
  offset: number
  createdAt?: Date
  updatedAt?: Date
  isActive?: boolean
}
```

## 🔄 Padrões de Uso

### 1. Importação de Elementos
```typescript
// Importar constantes
import { HTTP_STATUS_CODE, HTTP_HEADERS, ROUTES } from '@/core/global/constants'

// Importar interfaces
import type { RestClient, Call } from '@/core/global/interfaces'

// Importar responses
import { RestResponse, PaginationResponse } from '@/core/global/responses'

// Importar DTOs específicos
import type { UserDto } from '@/core/membership/dtos'
import type { ParameterDto } from '@/core/telemetry/dtos'
```

### 2. Implementação de Interfaces
```typescript
// Implementar interface do Core
class MyRestClient implements RestClient {
  async get<ResponseBody>(url: string): Promise<RestResponse<ResponseBody>> {
    // Implementação específica
  }
  // ... outros métodos
}
```

### 3. Uso de Responses
```typescript
// Criar resposta de sucesso
const response = new RestResponse({
  body: { message: 'Success' },
  statusCode: HTTP_STATUS_CODE.ok
})

// Verificar status
if (response.isSuccessful) {
  const data = response.body
}

// Tratar erro
if (response.isFailure) {
  response.throwError()
}
```

## 🚫 Violações Comuns a Evitar

1. **Dependências Externas**: Nunca importe React, Axios ou outros frameworks
2. **Implementações Concretas**: Mantenha apenas interfaces e contratos
3. **Lógica de Apresentação**: Não inclua código relacionado a UI
4. **Configurações Específicas**: Evite configurações de banco ou servidor
5. **Código de Framework**: Mantenha apenas TypeScript puro

## 📚 Convenções de Nomenclatura

- **Interfaces**: PascalCase com sufixo descritivo (`RestClient`, `MembershipService`)
- **DTOs**: PascalCase com sufixo `Dto` (`UserDto`, `ParameterDto`)
- **Types**: PascalCase descritivo (`PaginationParams`, `UsersListingParams`)
- **Constantes**: UPPER_SNAKE_CASE (`HTTP_STATUS_CODE`, `ROUTES`)
- **Classes**: PascalCase (`RestResponse`, `PaginationResponse`)

## 🔗 Integração com Outras Camadas

- **REST Layer**: Implementa interfaces do Core (`RestClient`)
- **RPC Layer**: Usa interface `Call` do Core
- **Validation Layer**: Valida DTOs e types do Core
- **UI Layer**: Consome DTOs e types do Core via RPC
- **App Layer**: Orquestra todas as camadas usando elementos do Core

Esta camada serve como a **fonte única da verdade** para todas as regras de negócio e contratos da aplicação, garantindo consistência e manutenibilidade em todo o sistema.
