# RPC Layer Rules

## Overview

The **RPC** layer exposes application calls as typed `actions`, connecting UI/routes/server actions to the core through the `Action` + `Call` contract.

| Item | Definition |
| --- | --- |
| **Goal** | Provide a typed boundary to execute core logic at the edge (Next.js). |
| **Responsibilities** | Define `actions` per domain; adapt `Call` to the `runtime`; execute `actions` in `composition roots` with input validation. |
| **Does not do** | Business rules; instantiate dependencies inside the `action`; couple the `action` to the `runtime`. |

## Directory Structure

| Folder/File | Purpose |
| --- | --- |
| `apps/web/src/rpc/actions/` | Actions organized by domain. |
| `apps/web/src/rpc/next/NextCall.ts` | Next adapter for the core's `Call`. |
| `apps/web/src/rpc/next-safe-action/` | Composition root: `zod` validation, dependency instantiation and execution. |
| `apps/web/src/rpc/next-safe-action/clients/actionClient.ts` | Client with consistent error handling. |
| `packages/core/src/global/interfaces/rpc/Action.ts` | `Action` contract (core). |
| `packages/core/src/global/interfaces/rpc/Call.ts` | `Call` contract (core). |

## Rules

- **Core contracts**: every `action` implements `Action<Request, Response>`; every execution goes through `Call<Request>`.
- **Dependency inversion**: `action` receives dependencies (`services`, `broker`, etc.) via parameters.
- **Validation at the edge**: the `composition root` validates inputs with `zod` before creating the `Call`.
- **Errors**: domain errors are propagated as `AppError` and handled by the `actionClient`.

> ⚠️ Forbidden: `action` importing `next/*` or `next-safe-action`.

## Organization and Naming

- Action: `VerbNounAction` and exported as `export const`.
- Actions per domain: expose through `index.ts` inside the domain folder.

## Example

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

## Integration with Other Layers

- **Allowed**: actions depending on core interfaces and on the app's REST services (injected).
- **Allowed (composition root)**: instantiating the broker (e.g.: `apps/web/src/rpc/next-safe-action/authActions.ts`).
- **Forbidden**: `@stardust/core` depending on `apps/web/src/rpc/**`; action depending on UI.
- **Direction**: UI -> RPC -> REST/Queue -> Core (dependencies always point inward to the core).

## Checklist (before the PR)

- A `zod` schema exists in the composition root.
- Action receives dependencies by parameter.
- Action implements `Action<Request, Response>`.
- The correct `Call` was used (e.g.: `NextCall`).
- Error handling follows the `actionClient` pattern.

## Notes

- The RPC layer currently exists in `apps/web/src/rpc`.
- For handler/action tests: `documentation/rules/handlers-testing-rules.md`.
