# Realtime Layer Rules

## Overview

The **Realtime** layer encapsulates real-time event subscriptions of the web application, translating external events into stable `@stardust/core` contracts.

**Core responsibilities:**

- Allow the UI to react to asynchronous onboarding and synchronization events without coupling `widgets` directly to the realtime provider SDK.
- Centralize the creation of realtime channels, adapters and clients of the web application.

**Out of scope for this layer:**

- Business rules, navigation, `widget` state or direct access to `controllers`, the server database and jobs.

> The current boundary of the layer is the `web` app, with the concrete integration in `apps/web/src/realtime/polling/` and exposure to the UI through `apps/web/src/ui/global/contexts/RealtimeContext/`. Today the transport is **REST polling**; the layer keeps no long-lived connection, WebSocket or stream.

---

## Directory Structure

| Path | Responsibility |
| :--- | :--- |
| `apps/web/src/realtime/polling/channels/` | Per-domain channel adapters that query an injected function (e.g. `PollingProfileChannel.ts`). |
| `apps/web/src/realtime/polling/types/` | Result types of each query (e.g. `ProfileCreationPoll.ts`). |
| `apps/web/src/ui/global/contexts/RealtimeContext/` | Client `Composition root` that injects realtime channels into the React tree. |
| `apps/web/src/ui/global/contexts/RealtimeContext/useProfileCreationPolling.ts` | Composes the polling channel: decides the credential transport and translates REST responses into `ProfileCreationPoll`. |
| `apps/web/src/ui/global/hooks/useRealtimeContext.ts` | Exposes access to the context, without recreating channels. |
| `apps/web/src/ui/global/hooks/useProfileSocket.ts` | Thin consumer `Hook` for subscribing to profile events, with an optional `enabled`. |
| `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/` | Registers the `RealtimeContextProvider` at the global client edge, inside `AuthContextProvider` and `RestContextProvider`. |
| `packages/core/src/profile/interfaces/ProfileChannel.ts` | Stable contract consumed by the UI. The realtime layer **must not** redefine this contract inside `apps/web`. |

---

## Core Principles

### Must contain

- Realtime adapters must **implement core contracts** (e.g. `ProfileChannel`), instead of directly exposing transport APIs.
- The adapter receives the query function and the polling times as parameters; it **knows nothing about REST, session or UI**.
- The **two-level translation** is explicit: the composition root (`useProfileCreationPolling`) translates REST responses into `ProfileCreationPoll`; the adapter translates `ProfileCreationPoll` into a domain event (e.g. `UserCreatedEvent`).
- Channel composition and injection into the tree happen at the **client edge**, in `RealtimeContextProvider`, `useRealtimeContextProvider` and `useProfileCreationPolling`.
- Consumer `Hooks` depend on stable interfaces of the layer (e.g. `profileChannel.onCreateUser(...)`).
- Each subscription returns an **explicit and idempotent cleanup** for correct use in `useEffect`.
- Each subscription has its own state, at most one query in flight, a timeout and single delivery.

### Must not contain

- Onboarding business rules, `retry`, redirection or flow decisions — those belong to the UI and the core.
- Imports from `apps/server/**`, repositories, jobs, REST `controllers` or RPC `actions`, nor from `apps/web/src/rest/**` or `apps/web/src/ui/**` inside `apps/web/src/realtime/**`.
- Leaking HTTP responses or the `ProfileCreationPoll` type into `widgets` and domain `hooks`.
- Mixing visual handling, component state or UX feedback with realtime adapters.
- Contracts parallel to the core's when a canonical interface already exists in `packages/core/**`.
- Tests in `apps/web/src/realtime/**`: the location is not allowed by `check:test-integrity`.

---

## Design Patterns

### Adapter per Domain

Each realtime integration must be implemented as a `factory function` named in `PascalCase`, receiving dependencies as parameters and returning a core interface.

```typescript
// Current example
function PollingProfileChannel(params: {
  pollProfileCreation: () => Promise<ProfileCreationPoll>
  intervalInMs: number
  maxBackoffInMs: number
  timeoutInMs: number
}): ProfileChannel {
  // ...
}
```

### Payload Translation

The composition root maps REST responses to `ProfileCreationPoll` (`pending`, `created`, `stopped`, `failed`). The adapter maps `created` to a canonical domain event before notifying `listeners`.

```typescript
// apps/web/src/ui/global/contexts/RealtimeContext/useProfileCreationPolling.ts
// REST (fetchUserById / fetchOnboardingAttempt) -> ProfileCreationPoll
// apps/web/src/realtime/polling/channels/PollingProfileChannel.ts
// ProfileCreationPoll { status: 'created' } -> UserCreatedEvent
```

### Composition Root via Context

Channel composition happens in `apps/web/src/ui/global/contexts/RealtimeContext/`. The Entry Point (`index.tsx`) resolves `profileService`, `account` and `accessToken` through the Rest and Auth contexts and passes them as parameters to `useRealtimeContextProvider`. A channel injected by prop (`testing` environment) takes precedence over the polling channel.

### Thin Consumer Hook

`Hooks` such as `apps/web/src/ui/global/hooks/useProfileSocket.ts` only subscribe and clean up `listeners`. The hook accepts `{ enabled }`, keeps the latest listener in a `useRef` and only resubscribes when `enabled` or `profileChannel` change, so that re-renders do not restart the polling. Any filtering by account, screen or flow stays in the consuming `hook`/page.

### Test coverage

Global hooks do not get dedicated tests. The channel behavior is covered by `RealtimeContext/tests/useProfileCreationPolling.test.ts` (runs the real adapter with fake timers) and by the Web Playwright journeys with `ProfileChannelMock`.

> **Note:** Avoid an adapter that is too generic when there is only one clear domain contract. While the need is localized, prefer per-domain channels over an abstract layer with no real use.

---

## Applied Usage Patterns

### Correct flow

1. `ClientProviders` registers `AuthContextProvider > RestContextProvider > RealtimeContextProvider`.
2. The context injects `profileChannel` (polling, or the mock in `testing`).
3. Client `Hooks`/pages subscribe to `onCreateUser` to react to `UserCreatedEvent`.

### Examples of correct usage

- **Confirmation pages:** the UI can filter the event by `account.email.value` and trigger `onRefetchUser()` or update local state.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
- **Sign-up:** `SignUpPage` only subscribes after the successful submission: `useProfileSocket(handleUserCreated, { enabled: userEmail !== null })`.

### Common mistakes

| Mistake | Fix |
| :--- | :--- |
| Calling `ProfileService` or `fetch` inside `apps/web/src/realtime/**`. | The query is injected by the composition root. |
| Passing the HTTP body or `ProfileCreationPoll` to the UI. | The UI must receive `UserCreatedEvent` or another core event. |
| Subscribing with a new listener on every render without the ref. | Use `useProfileSocket`, which keeps the subscription stable. |
| Duplicating subscription filters and event conversion across multiple components. | Concentrate them in the adapter or in the appropriate consumer `hook`. |

---

## Integration Rules with Other Layers

| Layer | Rule |
| :--- | :--- |
| **Core** | The realtime layer may import events, auxiliary entities and interfaces from `@stardust/core` (e.g. `ProfileChannel`, `UserCreatedEvent`). The core **must not** import anything from `apps/web/src/realtime/**`. |
| **UI** | The UI consumes realtime through `RealtimeContext` or dedicated `hooks`. The composition root (`useProfileCreationPolling`), in the UI, is what knows REST and session. |
| **REST/RPC/Queue** | The realtime adapter does not call these layers; the injected query function, created in the UI, uses the `RestContext` services. |
| **External infrastructure** | The transport is isolated in the adapter; the choice of transport must not change the UI's public contracts. |

**Dependency direction:**

```
UI (composition root) → ProfileService (port) → REST adapter
UI → Realtime adapter (receives the query function)
              ↑
         @stardust/core (domain contracts)
```

> New channels must be exposed through interfaces named by domain and injected into the context. There must be no cross `import` from the UI to internal files of `realtime/polling/channels/**` outside the composition root.

---

## Checklist for New Features in the Layer

- [ ] The new channel implements an existing core interface **or** introduces a new contract in the core before the web implementation.
- [ ] The adapter was created in `apps/web/src/realtime/...` as a `factory function` and receives the query function by injection.
- [ ] The external response was mapped to a canonical event/object before reaching the UI.
- [ ] The subscription returns an idempotent `cleanup` and consumption in React happens inside `useEffect`.
- [ ] Access to the channel goes through `RealtimeContextProvider` or another explicit `composition root`, with no local instantiation in a `widget`.
- [ ] No file in the layer imports `apps/server/**`, REST, UI, repositories, jobs or flow business rules.
- [ ] Tests live in allowed locations (`ui/**/contexts/**/tests`), never in `realtime/**` nor in global hooks.
- [ ] File names, `factories` and types follow the global conventions in `documentation/rules/code-conventions-rules.md`.
