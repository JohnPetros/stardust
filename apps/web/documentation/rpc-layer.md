# RPC (Remote Procedure Call) Layer

The RPC layer is responsible for abstracting the communication between API
routes and domain services by implementing the **Factory Functions** pattern to
create reusable and testable actions.

## Structure

```
src/rpc/
├── actions/              # Actions organized by domain
│   └── rewarding/        # Actions related to rewarding
│       ├── AccessStarChallengeRewardingPageAction.ts
│       └── ...
├── next/                 # Next.js-specific implementations
│   └── NextCall.ts       # Adapter for Next.js
└── next-safe-action/     # next-safe-action clients
    ├── clients/
    ├── rewardingActions.ts
    └── ...
```

## Core Concepts

### 1. The Call Interface

The `Call<Request>` interface defines the contract for communication between
actions and routes:

```typescript
interface Call<Request = void> {
  getFormData(): Promise<Request>;
  redirect(route: string): void;
  getCookie(cookie: string): Promise<string | undefined>;
  getUser(): Promise<User>;
  notFound(): void;
}
```

### 2. Actions (Factory Functions)

Actions are implemented as **Factory Functions** that receive dependencies and
return objects with executable methods:

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

### 3. Execution Pattern

All actions follow the same pattern:

1. **Receive dependencies** via factory function parameters.
2. **Return an object** with a `handle` method.
3. **Process data** via `call.get...()` methods.
4. **Execute the operation** in the domain service.
5. **Handle errors** by checking `response.isFailure`.
6. **Return a response** or redirect.

## Architectural Advantages

### 1. **Dependency Inversion**

- Actions receive dependencies as parameters.
- Facilitates unit testing with mocks.
- Decouples actions from specific implementations.

### 2. **Reusability**

- Actions can be used in different contexts.
- The same action works in different frameworks (Next.js, Express, etc.).
- Centralized business logic.

### 3. **Testability**

- Easy to create mocks for dependencies.
- Isolated tests without external dependencies.
- Framework-independent validation.

### 4. **Consistency**

- A uniform pattern for all actions.
- Standardized error handling.
- Predictable and maintainable structure.

## Usage in Routes

The project uses `next-safe-action` to expose the actions to the UI layer. The actions are wrapped in a client that handles the server-side execution and data validation.

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
      // ... zod schema for validation
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

## Call Implementations

### NextCall

- Adapts the `Call` interface for Next.js.
- Integrates with `zod` for validation.
- Supports Next.js redirects and not found pages.

## Organization by Domain

Actions are organized into folders by domain (e.g., `rewarding/`) with:

- **Individual files** for each action.
- **A barrel file** (`index.ts`) for centralized exports.
- **Consistent naming** following project standards.

## Best Practices

1. **Always use Factory Functions** for actions.
2. **Inject dependencies** via parameters.
3. **Keep actions focused** on a single responsibility.
4. **Use barrel files** for organized exports.
5. **Follow project naming conventions**.
6. **Handle errors** consistently.
7. **Document Request types** properly.