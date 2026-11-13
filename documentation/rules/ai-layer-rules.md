# AI Layer Rules

> 💡 **Goal**: standardize the `AI` layer as an **application adapter** (orchestration + integration with `LLM`), keeping **business rules** and **domain contracts** in `@stardust/core`.

## Overview

### Scope

- **What it is**: an orchestration layer for `agents`, `prompts`, `toolsets` and `workflows` to integrate `LLM` runtimes into the system.
- **What it is not**: a domain layer. No business rule/validation should live here.

### Responsibilities

- **Prompts and instructions**
  - Define and centralize text/strings (e.g., `apps/server/src/ai/constants/agents-instructions.ts`, `apps/web/src/ai/constants/manual-prompts.ts`).
- **Contracts and adapters**
  - Implement `Tool<Input, Output>`.
  - Provide `Mcp<Input>` adapters per `runtime` (e.g., `apps/server/src/ai/mastra/MastraMcp.ts`, `apps/web/src/ai/vercel/VercelMcp.ts`).
- **Composition root per app**
  - Compose concrete dependencies for tools and flows (e.g., `RestClient`, `Repository`, `Broker`, `CacheProvider`).
- **Integration via core contracts**
  - Integrate with the system through interfaces (e.g., `ManualWorkflow`, `CreateChallengeWorkflow`).

### Boundaries (guardrails)

- **Must contain**: adaptation (formats), orchestration (sequence of steps) and calls to `tools`.
- **Must not contain**: business rules; use cases/entities/validations must live in `@stardust/core`.

## Directory structure

| Area | Path | Role |
| --- | --- | --- |
| Server AI | `apps/server/src/ai/` | Integration with the Mastra runtime, `toolsets`, `workflows` and server-side tools |
| Web AI | `apps/web/src/ai/` | Integration with the Vercel AI SDK (`ai`), `toolsets`, `workflows` and web-side tools |
| Core (contracts) | `packages/core/src/global/interfaces/ai/` | `Tool` and `Mcp` interfaces (reference, not implementation) |
| Core (workflows) | `packages/core/src/manual/interfaces/ManualWorkflow.ts` | `ManualWorkflow` contract |
| Core (workflows) | `packages/core/src/challenging/interfaces/CreateChallengeWorkflow.ts` | `CreateChallengeWorkflow` contract |

### Responsibility per directory

- `constants/`
  - **Must** contain only text/strings (prompts, descriptions).
  - **Must not** instantiate services nor import infrastructure.
- `tools/`
  - Small, testable implementations with **one** responsibility (one effect/query per `tool`).
- `toolsets/`
  - Encapsulate the adaptation to the `runtime` (Mastra/Vercel) + composition of dependencies.
- `workflows/`
  - Orchestrate steps and define the execution sequence.

### Organization and naming conventions

- **Tools**: `VerbNounTool` (e.g., `GetMdxGuideTool`, `PostChallengeTool`).
- **Toolsets**: named by domain (e.g., `ChallengingToolset`) with stable exports.
- **Prompts**: centralize and export via `index.ts` (e.g., `apps/server/src/ai/constants/index.ts`, `apps/web/src/ai/constants/index.ts`).

## Fundamental principles

### Must contain

- **Clear, typed contracts**
  - Every `tool` implements `Tool<Input, Output>` (e.g., `packages/core/src/global/interfaces/ai/Tool.ts`).
  - Every `runtime` provides `Mcp<Input>` with `getInput()`.
- **Validation at the boundary**
  - `toolsets` validate input/output at the runtime boundary (e.g., `zod` in `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts` and `apps/web/src/ai/vercel/toolsets/*.ts`).
- **Orchestration in the app, domain in the core**
  - `tools` delegate business rules to the core's use cases/entities (e.g., `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`).
- **Execution limits**
  - `agents` and `workflows` configure explicit iteration/step limits when supported (e.g., `stopWhen: stepCountIs(3)` in `apps/web/src/ai/vercel/agents/manualAgents.ts`).

### Must not contain

- **Duplicated domain rules**: the `AI` layer adapts formats and orchestrates calls; business rules stay in the core.
- **Improper direct access to infrastructure (especially in the Web)**
  - `apps/web/src/ai/**` does not access `database`, `queue` or providers directly; it uses `RestClient` and the services in `apps/web/src/rest/services`.
- **Prompts coupled to implementation**
  - Prompts do not depend on URLs, keys, internal IDs or infrastructure details; prompts do not import executable code.
- **Side effects outside `tools`/`workflows`**
  - Database writes, event publishing and external `IO` are encapsulated in `tools` triggered by `workflows`.

> ⚠️ If you need to repeat a business validation in the prompt to guide the model's response, this **does not replace** the validation in the core.

## Design patterns

### Tool pattern (core)

- A `tool` is a small, composable adapter: it receives `Mcp<Input>`, extracts the input, calls services/use cases and returns a typed output.
- Real example: `apps/web/src/ai/tools/manual/GetMdxGuideTool.ts`.

### Composition root via toolset

- `toolsets` are where concrete dependencies are created and wired.
- Server/Mastra: `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts` creates `SupabaseChallengesRepository`, `InngestBroker`, `UpstashCacheProvider`.
- Web/Vercel: `apps/web/src/ai/vercel/toolsets/*.ts` creates `NextServerRestClient()` and services (e.g., `ManualService`, `StorageService`, `ChallengingService`).

### Workflow orchestration

- `workflows` chain small, replaceable steps.
- Real example: `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts` (get problem -> generate challenge -> persist).
- `workflows` must not be used inside the core's `use-cases`.
- The correct direction is: the `controller`/`job`/entrypoint runs the `workflow`; when the `workflow` needs to apply a business rule or a system effect, it must trigger a `tool`, and that `tool` delegates to the core's `use-cases`/interfaces.
- In other words: **workflow -> tool -> use case**, never **use case -> workflow**.

### Agent/team pattern

- `agents` receive instructions via `constants` and expose tools explicitly.
- Real examples: `apps/server/src/ai/mastra/squads/ChallengingSquad.ts`, `apps/web/src/ai/vercel/agents/manualAgents.ts`.

## Applied usage patterns

### Common flows

1. **Automatic challenge creation (server)**
   - **Entry**: cron job `CreateChallengeJob` in `apps/server/src/queue/jobs/challenging/CreateChallengeJob.ts`.
   - **Orchestration**: `MastraCreateChallengeWorkflow` in `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`.
   - **Persistence**: `PostChallengeTool` delegates to `PostChallengeUseCase` in `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`.
2. **Manual/content assistant (web)**
   - **Entry**: `POST` route in `apps/web/src/app/api/conversation/chats/[chatId]/assistant/route.ts`.
   - **Orchestration**: `AskAssistantController` + `VercelAssistUserWorkflow` in `apps/web/src/rest/controllers/conversation/AskAssistantController.ts` and `apps/web/src/ai/vercel/workflows/VercelAssistUserWorkflow.ts`.
   - **Tools**: `manualToolset` and `challengingToolset` in `apps/web/src/ai/vercel/toolsets`.

### Example of a correct implementation (tool)

```ts
import type { Tool, Mcp } from '@stardust/core/global/interfaces'

type Input = { query: string }
type Output = string[]

export const ExampleTool = (service: SomeService): Tool<Input, Output> => {
  return {
    async handle(mcp: Mcp<Input>) {
      const { query } = mcp.getInput()
      return await service.search(query)
    },
  }
}
```

### Common mistakes

- `toolset` with business logic: it must only compose dependencies and trigger `tool.handle(mcp)`.
- `agent` without limits: it must configure `stop conditions`/`step limits` when supported by the runtime.
- Prompt without output restrictions: it must declare format, language and content restrictions (e.g., `apps/web/src/ai/constants/manual-prompts.ts`).
- `use-case` calling a `workflow`: `LLM` orchestration belongs to the `AI` layer; the core must not depend on an agent/workflow runtime.

## Integration rules with other layers

### Dependencies (allowed vs forbidden)

| Rule | Status | Detail |
| --- | --- | --- |
| `apps/*/src/ai/**` imports core contracts | Allowed | `@stardust/core/**` |
| `apps/*/src/ai/**` uses validation schemas | Allowed | `@stardust/validation/**` |
| `apps/server/src/ai/**` composes infra when necessary | Allowed | `database`/`queue`/providers in the server |
| `apps/web/src/ai/**` accesses data/effects via `rest` | Mandatory | `RestClient` + services in `apps/web/src/rest/**` |
| `packages/core/**` imports `apps/**` | Forbidden | dependency rule |
| `apps/web/src/ai/**` imports `apps/server/**` | Forbidden | no cross-app coupling |
| `apps/web/src/ai/**` accesses `apps/server/src/database/**` | Forbidden | no direct access to server infra |

### Communication contracts

- `Tool<Input, Output>` + `Mcp<Input>` in `packages/core/src/global/interfaces/ai/`.
- `CreateChallengeWorkflow` (server) and `ManualWorkflow` (web) defined in the core.

### Dependency direction and coupling

- The `AI` layer is an adapter: it depends on the core and on the app's local infrastructure.
- Integrations (routes/jobs/controllers) should reference `workflows`/`tools` through interfaces when possible (e.g., `CreateChallengeJob` depends on `CreateChallengeWorkflow`).
- REST `controllers` can run `workflows` directly when the feature is essentially an AI orchestration; in that case, the core's use cases remain restricted to business rules and do not coordinate the AI runtime.

## Quick checklist for new features

### Before opening a PR

- The feature uses core contracts (`Tool`, `ManualWorkflow`, `CreateChallengeWorkflow`) instead of direct coupling to the runtime.
- Boundary input/output validated with `zod` in the `toolset`.
- The `tool` is small (one responsibility) and contains no business rule (it delegated to the core's service/use case).
- No core `use-case` runs a `workflow`; if there is AI orchestration, it starts at the app's edge and goes down to `tools`/`use-cases`.
- Concrete dependencies created in the `composition root` (toolset/controller/job), not inside the core.
- `agent`/`workflow` with execution limits (steps/iterations) and a predictable error path.

### Minimum conformance criteria

- Web: `tools` access data only via `RestClient`/services (no direct access to `DB`/`queue`).
- Server: writes to `DB`/events go through the core's use cases or the core's interfaces.

### Warning signs

- A prompt requires internal IDs/secrets to work.
- A `toolset` instantiates dependencies that should be injected by a higher `composition root` (e.g., route/job).
- An `agent` runs `tools` loops without a limit.
- Duplication of business rules in the prompt/`tool`.

## Notes and open items

### Assumptions

- The `AI` layer is implemented as adapters in two stacks: Mastra on the server and the Vercel AI SDK on the web.

### Documentation gaps

- Credentials/model configuration (e.g., OpenAI/Google provider keys) is not described.
- The observability strategy (logs/metrics/tracing) for `LLM` calls is not described.

### Next steps

- Define test conventions for `tools`/`workflows` and examples of `Mcp` `mocks`.
- Document cost/latency limits and fallback policies per runtime (Mastra/Vercel).
