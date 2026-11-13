# Queue Layer Rules

## Overview

The **Queue** layer runs asynchronous processing and background `jobs` on the server using **Inngest**, isolating infrastructure through the core's `Job` and `Amqp` contracts.

| Item | Definition |
| --- | --- |
| **Goal** | Orchestrate `jobs` and connect an execution engine (Inngest) to the core contracts. |
| **Responsibilities** | Define agnostic `jobs`; implement `composition roots` in the `runtime`; publish events via the `broker`. |
| **Does not do** | Business rules; direct coupling of a `job` to the Inngest SDK/`runtime`. |

## Directory Structure

| Folder/File | Purpose |
| --- | --- |
| `apps/server/src/queue/jobs/` | Jobs per domain (infrastructure-agnostic). |
| `apps/server/src/queue/inngest/` | Inngest infra (runtime/adapters). |
| `apps/server/src/queue/inngest/functions/` | Composition roots per domain (instantiates dependencies and runs the job). |
| `apps/server/src/queue/inngest/InngestAmqp.ts` | Adapter of the `Amqp` contract. |
| `apps/server/src/queue/inngest/inngest.ts` | Config and event schemas. |
| `apps/server/src/queue/inngest/InngestBroker.ts` | Event publishing (implements `Broker`). |
| `packages/core/src/global/interfaces/queue/Job.ts` | `Job` contract (core). |
| `packages/core/src/global/interfaces/queue/Amqp.ts` | `Amqp` contract (core). |

## Rules

- **Job vs infra separation**: a `job` must be testable and engine-agnostic; the infra connects the `job` to Inngest.
- **`amqp.run`**: external IO and side effects must run inside `amqp.run` (traceability and retries).
- **Composition at the edge**: concrete dependencies are instantiated in `apps/server/src/queue/inngest/functions/**`.

> ⚠️ Forbidden: a `job` importing `inngest` directly.

## Organization and Naming

- `job`: `VerbNounJob`.
- When used by Inngest: expose `static KEY` (and `static CRON_EXPRESSION` when applicable).

## Example

```ts
// Job (agnostic)
export class CreateChallengeJob {
  static readonly KEY = 'challenging/create.challenge.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * *'

  constructor(private readonly workflow: { run(): Promise<void> }) {}

  async handle(amqp) {
    await amqp.run(async () => await this.workflow.run(), 'Create Challenge Workflow')
  }
}
```

## Integration with Other Layers

- **Allowed**: `apps/server/src/queue/inngest/functions/**` instantiating repos/REST services/providers; jobs depending on core interfaces via injection.
- **Forbidden**: the core depending on `apps/server/src/queue/**`.
- **Contract**: `Job` + `Amqp` (core); `InngestAmqp` (adapter).
- **Direction**: Inngest (infra) -> Job -> Core.

## Checklist (before the PR)

- The job is Inngest-agnostic.
- IO runs inside `amqp.run`.
- The composition root instantiates concrete dependencies.
- `KEY`/cron/event names are stable and unique.

## Notes

- Inngest is the current queue engine.
- Tooling: `documentation/tooling.md`.
