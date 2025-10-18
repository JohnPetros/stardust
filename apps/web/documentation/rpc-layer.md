# Camada RPC (Remote Procedure Call)

A camada RPC é responsável por abstrair a comunicação entre as rotas da API e os serviços de domínio, implementando o padrão **Factory Functions** para criar ações reutilizáveis e testáveis.

## Estrutura

```
src/rpc/
├── actions/              # Ações organizadas por domínio
│   └── rewarding/        # Ações relacionadas a recompensas
│       ├── AccessStarChallengeRewardingPageAction.ts
│       └── ...
├── next/                 # Implementações específicas do Next.js
│   └── NextCall.ts       # Adaptador para Next.js
└── next-safe-action/     # Clientes next-safe-action
    ├── clients/
    ├── rewardingActions.ts
    └── ...
```

## Conceitos Principais

### 1. A Interface Call

A interface `Call<Request>` define o contrato para a comunicação entre ações e rotas:

```typescript
interface Call<Request = void> {
  getFormData(): Promise<Request>;
  redirect(route: string): void;
  getCookie(cookie: string): Promise<string | undefined>;
  getUser(): Promise<User>;
  notFound(): void;
}
```

### 2. Ações (Factory Functions)

As ações são implementadas como **Factory Functions** que recebem dependências e retornam objetos com métodos executáveis:

```typescript
export const AccessStarChallengeRewardingPageAction = (
  service: ProfileService,
): Action<StarChallengeRewardingPayload, Response> => {
  return {
    async handle(call: Call<StarChallengeRewardingPayload>) {
      const rewardingPayloadCookie = await call.getCookie(COOKIES.keys.rewardingPayload)
      if (!rewardingPayloadCookie) call.notFound()

      // ...
    },
  };
};
```

### 3. Padrão de Execução

Todas as ações seguem o mesmo padrão:

1.  **Receber dependências** através dos parâmetros da factory function.
2.  **Retornar um objeto** com um método `handle`.
3.  **Processar dados** através dos métodos `call.get...()`.
4.  **Executar a operação** no serviço de domínio.
5.  **Lidar com erros** verificando `response.isFailure`.
6.  **Retornar uma resposta** ou redirecionar.

## Vantagens Arquiteturais

### 1. **Inversão de Dependência**

-   Ações recebem dependências como parâmetros.
-   Facilita testes unitários com mocks.
-   Desacopla ações de implementações específicas.

### 2. **Reutilização**

-   Ações podem ser usadas em diferentes contextos.
-   A mesma ação funciona em diferentes frameworks (Next.js, Express, etc.).
-   Lógica de negócios centralizada.

### 3. **Testabilidade**

-   Fácil de criar mocks para dependências.
-   Testes isolados sem dependências externas.
-   Validação independente do framework.

### 4. **Consistência**

-   Um padrão uniforme para todas as ações.
-   Tratamento de erros padronizado.
-   Estrutura previsível e de fácil manutenção.

## Uso em Rotas

O projeto usa `next-safe-action` para expor as ações para a camada de UI. As ações são envolvidas em um cliente que lida com a execução do lado do servidor e a validação de dados.

```typescript
// src/rpc/next-safe-action/rewardingActions.ts
'use server'

import { z } from 'zod'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { AccessStarChallengeRewardingPageAction } from '../actions/rewarding'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'

export const accessRewardForStarChallengeCompletionPage = authActionClient
  .schema(
    z.object({
      // ... esquema zod para validação
    }),
  )
  .action(async ({ clientInput, ctx }) => {
    const call = NextCall({
      request: clientInput,
      user: ctx.user,
    })
    const restClient = await NextServerRestClient({ isCacheEnabled: false })
    const profileService = ProfileService(restClient)
    const action = AccessStarChallengeRewardingPageAction(profileService)
    return await action.handle(call)
  })
```

## Implementações de Call

### NextCall

-   Adapta a interface `Call` para o Next.js.
-   Integra com `zod` para validação.
-   Suporta redirecionamentos e páginas não encontradas do Next.js.

## Organização por Domínio

As ações são organizadas em pastas por domínio (e.g., `rewarding/`) com:

-   **Arquivos individuais** para cada ação.
-   **Um arquivo barril** (`index.ts`) para exportações centralizadas.
-   **Nomenclatura consistente** seguindo os padrões do projeto.

## Melhores Práticas

1.  **Sempre use Factory Functions** para ações.
2.  **Injete dependências** via parâmetros.
3.  **Mantenha as ações focadas** em uma única responsabilidade.
4.  **Use arquivos barril** para exportações organizadas.
5.  **Siga as convenções de nomenclatura** do projeto.
6.  **Lide com erros** de forma consistente.
7.  **Documente os tipos de Request** adequadamente.