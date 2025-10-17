# Queue Layer - Background Jobs and Event-Driven Architecture

The queue layer is responsible for handling background jobs and enabling an event-driven architecture. It uses **Inngest** to manage queues and execute jobs asynchronously.

## Structure

The queue layer is located in the `/home/petros/stardust/apps/server/src/queue` directory.

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

- **`inngest`**: Contains the Inngest configuration, client, and functions.
- **`jobs`**: Contains the job definitions, organized by domain.

## Inngest

Inngest is a powerful tool for building reliable and observable background jobs. In this project, it is used to:
- **Create functions** that are triggered by events.
- **Manage queues** and ensure that jobs are executed reliably.
- **Provide observability** into the execution of jobs.

The `inngest` directory contains:
- **`client.ts`**: The Inngest client instance.
- **`InngestAmqp.ts`**: An adapter to use AMQP (like RabbitMQ) with Inngest.
- **`InngestEventBroker.ts`**: A custom event broker for Inngest.
- **`functions/`**: The Inngest functions that are triggered by events.

### Inngest Functions

Inngest functions are the core of the queue layer. They are responsible for listening to events and executing the corresponding jobs.

**Example: `NotificationFunctions.ts`**

This file defines the Inngest functions related to notifications. It creates functions that are triggered by events like `PlanetCompletedEvent` and `SpaceCompletedEvent`.

```typescript
export class NotificationFunctions extends InngestFunctions {
  private createCreateUserFunction() {
    return this.inngest.createFunction(
      { id: SendPlanetCompletedNotificationJob.KEY },
      { event: PlanetCompletedEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const repository = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new SendPlanetCompletedNotificationJob(repository)
        return await job.handle(amqp)
      },
    )
  }

  // ... other functions
}
```

## Jobs

Jobs are the actual business logic that is executed in the background. They are organized by domain in the `jobs` directory.

Each job is a class that has a `handle` method. This method is called by the Inngest function when the job is executed.

## Event-Driven Architecture

The queue layer enables an event-driven architecture, where different parts of the application can communicate with each other through events.

1.  An action in the `core` layer dispatches an event (e.g., `PlanetCompletedEvent`).
2.  The event is sent to the message broker (e.g., RabbitMQ).
3.  Inngest receives the event and triggers the corresponding function (e.g., `createCreateUserFunction` in `NotificationFunctions`).
4.  The Inngest function executes the job (e.g., `SendPlanetCompletedNotificationJob`).
5.  The job performs the necessary actions (e.g., sends a notification to Discord).

This architecture decouples the different parts of the application and makes it more scalable and resilient.