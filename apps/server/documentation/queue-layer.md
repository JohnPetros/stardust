# Camada de Fila - Trabalhos em Segundo Plano e Arquitetura Orientada a Eventos

A camada de fila é responsável por lidar com trabalhos em segundo plano e habilitar uma arquitetura orientada a eventos. Ela usa o **Inngest** para gerenciar filas e executar trabalhos de forma assíncrona.

## Estrutura

A camada de fila está localizada no diretório `./apps/server/src/queue`.

```
src/queue/
├── inngest/
│   ├── functions/
│   │   └── NotificationFunctions.ts
│   ├── client.ts
│   ├── InngestAmqp.ts
│   └── InngestEventBroker.ts
└── jobs/
    └── notification/
        └── SendPlanetCompletedNotificationJob.ts
```

- **`inngest`**: Contém a configuração, o cliente e as funções do Inngest.
- **`jobs`**: Contém as definições de trabalho, organizadas por domínio.

## Inngest

O Inngest é uma ferramenta poderosa para construir trabalhos em segundo plano confiáveis e observáveis. Neste projeto, ele é usado para:

- **Criar funções** que são acionadas por eventos.
- **Gerenciar filas** e garantir que os trabalhos sejam executados de forma confiável.
- **Fornecer observabilidade** na execução dos trabalhos.

O diretório `inngest` contém:

- **`client.ts`**: A instância do cliente Inngest.
- **`InngestAmqp.ts`**: Um adaptador para usar AMQP (como RabbitMQ) com o Inngest.
- **`InngestEventBroker.ts`**: Um broker de eventos personalizado para o Inngest.
- **`functions/`**: As funções do Inngest que são acionadas por eventos.

### Funções do Inngest

As funções do Inngest são o núcleo da camada de fila. Elas são responsáveis por ouvir eventos e executar os trabalhos correspondentes.

**Exemplo: `NotificationFunctions.ts`**

Este arquivo define as funções do Inngest relacionadas a notificações. Ele cria funções que são acionadas por eventos como `PlanetCompletedEvent` e `SpaceCompletedEvent`.

```typescript
export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.inngest.createFunction(
      { id: SendPlanetCompletedNotificationJob.KEY },
      { event: PlanetCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl);
        const repository = new DiscordNotificationService(restClient);
        const amqp = new InngestAmqp<typeof context.event.data>(context);
        const job = new SendPlanetCompletedNotificationJob(repository);
        return await job.handle(amqp);
      },
    );
  }

  // ... outras funções
}
```

## Trabalhos

Os trabalhos são a lógica de negócios real que é executada em segundo plano. Eles são organizados por domínio no diretório `jobs`.

Cada trabalho é uma classe que possui um método `handle`. Este método é chamado pela função do Inngest quando o trabalho é executado.

## Arquitetura Orientada a Eventos

A camada de fila habilita uma arquitetura orientada a eventos, onde diferentes partes da aplicação podem se comunicar umas com as outras através de eventos.

1. Uma ação na camada `core` despacha um evento (e.g., `PlanetCompletedEvent`).
2. O evento é enviado para o broker de mensagens (e.g., RabbitMQ).
3. O Inngest recebe o evento e aciona a função correspondente (e.g., `createCreateUserFunction` em `NotificationFunctions`).
4. A função do Inngest executa o trabalho (e.g., `SendPlanetCompletedNotificationJob`).
5. O trabalho executa as ações necessárias (e.g., envia uma notificação para o Discord).

Essa arquitetura desacopla as diferentes partes da aplicação e a torna mais escalável e resiliente.