# Diretrizes da Camada de Fila (queue)

Esta diretriz detalha como implementar e gerenciar processamento assíncrono e jobs em background na aplicação server-side (`apps/server`).

## Visão Geral

A camada de fila utiliza **Inngest** como motor de execução de workflows e jobs. Adotamos um padrão de design que separa a **definição do Job** (lógica de execução) da **implementação da infraestrutura** (Inngest Functions), utilizando uma abstração `Amqp` para facilitar testes e desacoplamento.

## Estrutura de Pastas

```text
apps/server/src/queue/
├── inngest/                # Implementação específica da infraestrutura (Inngest)
│   ├── functions/          # Agrupamento de funções Inngest por domínio
│   ├── InngestAmqp.ts      # Adaptador da interface Amqp para o Inngest
│   └── inngest.ts          # Configuração do cliente e schemas de eventos
└── jobs/                   # Definições de Jobs agnósticos à infraestrutura
    ├── notification/       # Jobs do domínio de notificação
    ├── profile/            # Jobs do domínio de perfil
    └── ...
```

## 1. Definindo um Novo Job

Os Jobs devem encapsular a lógica a ser executada quando um evento ocorre. Eles residem em `src/queue/jobs/<dominio>`.

### Padrão de Implementação

1.  **Nomenclatura**: Use `VerboSubstantivoJob` (ex: `SendPlanetCompletedNotificationJob`).
2.  **Identificadores**: Defina `KEY` (identificador único do job) e `SERVICE_NAME`.
3.  **Dependências**: Injete serviços necessários via construtor.
4.  **Método Handle**: Recebe `InngestAmqp<Payload>` para execução.

**Exemplo:**

```typescript
import type { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { PlanetCompletedEvent } from '@stardust/core/space/events'
import type { EventPayload } from '@stardust/core/global/types'

// Helper para inferir tipo do payload do evento
type Payload = EventPayload<typeof PlanetCompletedEvent>

export class SendPlanetCompletedNotificationJob {
  // Chave única para logs e identificação
  static readonly KEY = 'notification/send.planet.completed.notification.job'
  static readonly SERVICE_NAME = 'Notification Service'

  constructor(private readonly service: NotificationService) {}

  async handle(amqp: InngestAmqp<Payload>) {
    // Recupera dados do evento
    const { userSlug, userName, planetName } = amqp.getPayload()

    // amqp.run cria um "step" rastreável no Inngest
    const response = await amqp.run(
      async () =>
        await this.service.sendPlanetCompletedNotification(
          userSlug,
          userName,
          planetName,
        ),
      SendPlanetCompletedNotificationJob.SERVICE_NAME,
    )

    if (response?.isFailure) response.throwError()
  }
}
```

## 2. Implementando a Função Inngest

Para que o Job seja executado, ele precisa ser registrado como uma Inngest Function em `src/queue/inngest/functions`.

### Padrão de Implementação

1.  Agrupe funções por domínio (ex: `NotificationFunctions` gerencia todos os jobs de notificação).
2.  Estenda a classe base `InngestFunctions` (caso exista) ou siga o padrão de fábrica.
3.  Realize a **Injeção de Dependências** dentro do corpo da função (Composition Root).
4.  Instancie o `InngestAmqp` com o contexto do Inngest.

**Exemplo:**

```typescript
// src/queue/inngest/functions/NotificationFunctions.ts

import { PlanetCompletedEvent } from '@stardust/core/space/events'
import { SendPlanetCompletedNotificationJob } from '@/queue/jobs/notification'
// ... importações de implementações concretas (Axios, Repositories)

export class NotificationFunctions extends InngestFunctions {
  
  private createSendPlanetNotificationFunction() {
    return this.inngest.createFunction(
      { id: SendPlanetCompletedNotificationJob.KEY }, // ID do Job
      { event: PlanetCompletedEvent._NAME },          // Evento gatilho
      async (context) => {
        // COMPOSITION ROOT: Instanciar dependências concretas aqui
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        
        // Configurar adaptadores
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendPlanetCompletedNotificationJob(service)
        
        // Executar
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [
      this.createSendPlanetNotificationFunction(),
      // ... outros jobs
    ]
  }
}
```

## 3. Registrando Eventos e Schemas

Ao criar novos eventos que disparam jobs, adicione seus schemas de validação Zod no arquivo `src/queue/inngest/inngest.ts`.

```typescript
// src/queue/inngest/inngest.ts

const eventsSchema = {
  // ... outros eventos
  [NovoEvento._NAME]: {
    data: z.object({
      userId: idSchema,
      payloadField: z.string(),
    }),
  },
}
```

## Detalhes da Interface Amqp (`InngestAmqp`)

A classe `InngestAmqp` fornece métodos para interagir com o fluxo de trabalho de maneira segura e tipada:

*   `run(callback, stepName)`: Executa um bloco de código como um passo atômico do Inngest (com retentativas automáticas e memoização). **Sempre envolva chamadas a serviços externos ou efeitos colaterais nisto.**
*   `waitFor(eventName, timeout)`: Pausa a execução até que outro evento ocorra.
*   `sleepFor(timeExpression)`: Pausa a execução por um tempo determinado.
*   `getPayload()`: Retorna os dados tipados do evento gatilho.

## Fluxo de Desenvolvimento

1.  **Defina o Evento** no pacote `core` (se ainda não existir).
2.  **Crie o Job** em `apps/server/src/queue/jobs/<domain>` focando apenas na lógica de negócios e orquestração.
3.  **Adicione o Schema** em `apps/server/src/queue/inngest/inngest.ts` para validação de tipos.
4.  **Implemente a Função** em `apps/server/src/queue/inngest/functions/<Domain>Functions.ts`, conectando o Evento ao Job e injetando as dependências reais.
