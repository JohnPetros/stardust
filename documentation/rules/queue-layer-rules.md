# Regras da Camada Queue

## Visao Geral

A camada **Queue** executa processamento assincrono e `jobs` em background no server usando **Inngest**, isolando infraestrutura via os contratos `Job` e `Amqp` do core.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Orquestrar `jobs` e conectar um motor de execucao (Inngest) aos contratos do core. |
| **Responsabilidades** | Definir `jobs` agnosticos; implementar `composition roots` no `runtime`; publicar eventos via `broker`. |
| **Nao faz** | Regra de negocio; acoplamento direto de `job` ao SDK/`runtime` do Inngest. |

## Estrutura de Diretorios

| Pasta/Arquivo | Finalidade |
| --- | --- |
| `apps/server/src/queue/jobs/` | Jobs por dominio (agnosticos de infraestrutura). |
| `apps/server/src/queue/inngest/` | Infra do Inngest (runtime/adaptadores). |
| `apps/server/src/queue/inngest/functions/` | Composition roots por dominio (instancia dependencias e executa job). |
| `apps/server/src/queue/inngest/InngestAmqp.ts` | Adaptador do contrato `Amqp`. |
| `apps/server/src/queue/inngest/inngest.ts` | Config e schemas de eventos. |
| `apps/server/src/queue/inngest/InngestBroker.ts` | Publicacao de eventos (implementa `Broker`). |
| `packages/core/src/global/interfaces/queue/Job.ts` | Contrato `Job` (core). |
| `packages/core/src/global/interfaces/queue/Amqp.ts` | Contrato `Amqp` (core). |

## Regras

- **Separacao job vs infra**: `job` deve ser testavel e agnostico do motor; a infra conecta `job` ao Inngest.
- **`amqp.run`**: IO externo e efeitos colaterais devem rodar dentro de `amqp.run` (rastreabilidade e retries).
- **Composicao na borda**: dependencias concretas sao instanciadas em `apps/server/src/queue/inngest/functions/**`.

> ⚠️ Proibido: `job` importar `inngest` diretamente.

## Organizacao e Nomeacao

- `job`: `VerboSubstantivoJob`.
- Quando usado por Inngest: expor `static KEY` (e `static CRON_EXPRESSION` quando aplicavel).

## Exemplo

```ts
// Job (agnostico)
export class CreateChallengeJob {
  static readonly KEY = 'challenging/create.challenge.job'
  static readonly CRON_EXPRESSION = 'TZ=America/Sao_Paulo 0 0 * * *'

  constructor(private readonly workflow: { run(): Promise<void> }) {}

  async handle(amqp) {
    await amqp.run(async () => await this.workflow.run(), 'Create Challenge Workflow')
  }
}
```

## Integracao com Outras Camadas

- **Permitido**: `apps/server/src/queue/inngest/functions/**` instanciar repos/services REST/providers; jobs dependerem de interfaces do core por injecao.
- **Proibido**: o core depender de `apps/server/src/queue/**`.
- **Contrato**: `Job` + `Amqp` (core); `InngestAmqp` (adaptador).
- **Direcao**: Inngest (infra) -> Job -> Core.

## Checklist (antes do PR)

- Job e agnostico do Inngest.
- IO roda dentro de `amqp.run`.
- Composition root instancia dependencias concretas.
- `KEY`/cron/event names sao estaveis e unicos.

## Notas

- Inngest e o motor atual de queue.
- Tooling: `documentation/tooling.md`.
