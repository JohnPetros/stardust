# Regras da Camada RPC

## Visao Geral

A camada **RPC** expoe chamadas de aplicacao como `actions` tipadas, conectando UI/rotas/server actions ao core por meio do contrato `Action` + `Call`.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Fornecer uma fronteira tipada para executar logica do core na borda (Next.js). |
| **Responsabilidades** | Definir `actions` por dominio; adaptar `Call` para o `runtime`; executar `actions` em `composition roots` com validacao de input. |
| **Nao faz** | Regra de negocio; instanciar dependencias dentro da `action`; acoplar `action` a `runtime`. |

## Estrutura de Diretorios

| Pasta/Arquivo | Finalidade |
| --- | --- |
| `apps/web/src/rpc/actions/` | Actions organizadas por dominio. |
| `apps/web/src/rpc/next/NextCall.ts` | Adaptador Next para `Call` do core. |
| `apps/web/src/rpc/next-safe-action/` | Composition root: validacao `zod`, instanciacao de dependencias e execucao. |
| `apps/web/src/rpc/next-safe-action/clients/actionClient.ts` | Client com tratamento consistente de erro. |
| `packages/core/src/global/interfaces/rpc/Action.ts` | Contrato `Action` (core). |
| `packages/core/src/global/interfaces/rpc/Call.ts` | Contrato `Call` (core). |

## Regras

- **Contratos do core**: toda `action` implementa `Action<Request, Response>`; toda execucao passa por `Call<Request>`.
- **Inversao de dependencia**: `action` recebe dependencias (`services`, `broker`, etc.) via parametros.
- **Validacao na borda**: `composition root` valida inputs com `zod` antes de criar o `Call`.
- **Erros**: erros de dominio sao propagados como `AppError` e tratados pelo `actionClient`.

> ⚠️ Proibido: `action` importar `next/*` ou `next-safe-action`.

## Organizacao e Nomeacao

- Action: `VerboSubstantivoAction` e exportada como `export const`.
- Actions por dominio: expor por `index.ts` dentro da pasta de dominio.

## Exemplo

```ts
import type { Action, Call, Broker } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'

type Request = { email: string; password: string }
type Response = unknown

export const SignInAction = (authService: AuthService, broker: Broker): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { email, password } = call.getRequest()
      const response = await authService.signIn(/* ... */)
      if (response.isFailure) response.throwError()

      await call.setCookie('accessToken', '...', 3600)
      return response.body as Response
    },
  }
}
```

## Integracao com Outras Camadas

- **Permitido**: actions dependerem de interfaces do core e de services REST da app (injetados).
- **Permitido (composition root)**: instanciar broker (ex: `apps/web/src/rpc/next-safe-action/authActions.ts`).
- **Proibido**: `@stardust/core` depender de `apps/web/src/rpc/**`; action depender de UI.
- **Direcao**: UI -> RPC -> REST/Queue -> Core (dependencias sempre apontam para dentro do core).

## Checklist (antes do PR)

- Existe schema `zod` no composition root.
- Action recebe dependencias por parametro.
- Action implementa `Action<Request, Response>`.
- `Call` correto foi usado (ex: `NextCall`).
- Tratamento de erro segue o padrao do `actionClient`.

## Notas

- A camada RPC existe hoje em `apps/web/src/rpc`.
- Para testes de handlers/actions: `documentation/rules/handlers-testing-rules.md`.
