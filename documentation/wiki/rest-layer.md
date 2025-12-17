---
alwaysApply: false
---
# Camada REST

A camada `rest` é responsável por realizar requisições HTTP para APIs externas e serviços remotos. Ela atua como uma porta de saída da aplicação, permitindo que o sistema interaja com outros serviços através do protocolo HTTP.

## Estrutura de Arquivos

```
src/rest/
├── axios/                    # Implementação do RestClient usando Axios
│   ├── axios-rest-client.ts  # Cliente HTTP principal
│   └── utils/                # Utilitários para o cliente
│       ├── build-url.ts      # Construção de URLs com query parameters
│       ├── create-rest-response.ts # Criação de respostas padronizadas
│       ├── handle-error.ts   # Tratamento de erros HTTP
│       └── index.ts          # Exportações dos utilitários
├── services/                 # Services que consomem APIs externas
│   ├── membership-service.ts # Service para operações de membership
│   ├── telemetry-service.ts  # Service para telemetria (incompleto)
│   └── index.ts              # Exportações dos services
└── README.md                 # Este arquivo
```

## Componentes Principais

### **RestClient (AxiosRestClient)**

Implementação da interface `RestClient` do core usando Axios como biblioteca HTTP.

**Características:**
- Suporte completo aos métodos HTTP (GET, POST, PUT, PATCH, DELETE)
- Configuração de base URL e headers customizados
- Gerenciamento de query parameters
- Tratamento automático de erros HTTP
- Suporte a autenticação via Bearer token

**Exemplo de uso:**
```typescript
import { AxiosRestClient } from '@/rest/axios/axios-rest-client'

const restClient = AxiosRestClient('https://api.exemplo.com')
restClient.setAuthorization('seu-token-aqui')
restClient.setHeader('Content-Type', 'application/json')

const response = await restClient.get<User[]>('/users')
if (response.isSuccessful) {
  const users = response.body
}
```

### **Services**

Factory functions que implementam a lógica de comunicação com APIs externas.

**Padrão de implementação:**
```typescript
export const MembershipService = (restClient: RestClient) => {
  return {
    async fetchUsers() {
      return await restClient.get<User[]>('/users')
    },
    
    async createUser(userData: CreateUserDto) {
      return await restClient.post<User>('/users', userData)
    }
  }
}
```

**Services disponíveis:**
- `MembershipService`: Operações relacionadas a usuários e membership
- `TelemetryService`: Operações de telemetria (⚠️ **incompleto**)

### **Utilitários**

#### **buildUrl**
Constrói URLs completas com query parameters:
```typescript
buildUrl('https://api.com', '/users', { page: '1', limit: '10' })
// Resultado: 'https://api.com/users?page=1&limit=10'
```

#### **createRestResponse**
Converte respostas do Axios para o formato `RestResponse`:
```typescript
const restResponse = createRestResponse(axiosResponse)
```

#### **handleError**
Trata erros HTTP e os converte para `RestResponse`:
```typescript
const errorResponse = handleError(error)
```

## Padrões e Convenções

### **1. Nomeação de Arquivos**
- Services: `[module]-service.ts` (ex: `membership-service.ts`)
- Utilitários: `[function-name].ts` (ex: `build-url.ts`)
- Barrel files: `index.ts` para exportações centralizadas

### **2. Factory Functions**
- Services são implementados como factory functions
- Recebem `RestClient` como dependência
- Retornam objetos com métodos que fazem requisições HTTP
- Seguem o padrão de injeção de dependência

### **3. Tratamento de Respostas**
- Todas as respostas são encapsuladas em `RestResponse<T>`
- Verificação de sucesso através de `response.isSuccessful`
- Acesso aos dados via `response.body`
- Tratamento de erros via `response.errorMessage`

### **4. Tipagem**
- Uso de generics para tipagem forte das respostas
- Interfaces definidas no core (`@/core/interfaces`)
- DTOs para transferência de dados

## Integração com o Core

A camada REST implementa a interface `RestClient` definida no core:

```typescript
// src/core/interfaces/rest-client.ts
export interface RestClient {
  get<ResponseBody>(url: string): Promise<RestResponse<ResponseBody>>
  post<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  // ... outros métodos
}
```

Esta camada garante uma comunicação robusta e tipada com APIs externas, mantendo a separação de responsabilidades e facilitando a manutenção do código.
