---
alwaysApply: false
---
# Camada de Fila (queue)

A camada `queue` é responsável por todo o processamento assíncrono da aplicação, como execução de jobs em background, cron jobs, filas de mensagens e fluxos automatizados. Ela permite desacoplar a execução de tarefas pesadas ou demoradas do fluxo principal da aplicação.

## Estrutura de Arquivos

```
src/queue/
├── inngest/           # Implementação do protocolo Amqp (neste caso, usando Inngest)
│   ├── InngestAmqp.ts
│   ├── inngest.ts
│   └── functions/     # Funções Inngest registradas
├── jobs/              # Job Handlers organizados por domínio
│   ├── profile/
│   │   ├── CreateUserJob.ts
│   │   └── ...
│   ├── notification/
│   └── index.ts       # Exportações
└── index.ts
```

## Componentes Principais

### **Job (Handler)**

O `Job` é o `handler` responsável por processar uma mensagem recebida pela fila. Diferente de controllers ou actions, os jobs são implementados como **Classes** que implementam a interface `Job<Payload>`.

**Características:**
- Implementa a interface `Job<Payload>` do core.
- Define uma chave estática `KEY` para identificação única do job.
- Recebe dependências (Use Cases, Repositories) via construtor.
- Possui um método `handle` que recebe o protocolo `Amqp`.

**Exemplo de Implementação:**

```typescript
import type { Job, Amqp } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import { CreateUserUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof SomeEvent>

export class CreateUserJob implements Job<Payload> {
  static readonly KEY = 'profile/create.user.job'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    const createUserUseCase = new CreateUserUseCase(this.usersRepository)

    // O amqp.run permite executar passos de forma resiliente (steps)
    await amqp.run(
      async () => await createUserUseCase.execute(payload),
      CreateUserUseCase.name,
    )
  }
}
```

### **Amqp (Protocol)**

O `Amqp` é o `protocol` que fornece acesso aos dados do job e métodos de controle de fluxo. Na implementação atual, ele abstrai a biblioteca **Inngest**.

**Funcionalidades:**
- `getPayload()`: Retorna os dados da mensagem/evento.
- `run(step, name)`: Executa um passo da tarefa. O `run` é crucial para garantir idempotência e retries em etapas específicas (step functions).
- Controle de falhas e retries.

## Fluxo de Execução

1. Um evento é disparado na aplicação ou um agendamento é acionado.
2. O provedor de fila (Inngest) recebe o sinal e instancia o `Job` correspondente.
3. O método `handle` é chamado, recebendo uma instância de `Amqp`.
4. O Job utiliza `amqp.run()` para executar casos de uso ou lógica de negócio, garantindo que cada passo seja registrado e possa ser recuperado em caso de falha.

## Padrões e Convenções

1. **Classes para Jobs**: Use classes para permitir injeção de dependências no construtor.
2. **Identificação Única**: Defina sempre `static readonly KEY` com um formato hierárquico (ex: `domain/action.job`).
3. **Uso de Steps**: Envolva chamadas importantes (como UseCases) em `amqp.run()` para aproveitar os recursos de steps e retries da infraestrutura de fila.
4. **Payload Tipado**: Utilize `EventPayload<Type>` para garantir tipagem correta dos dados recebidos.
