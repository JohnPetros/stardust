# Regras de Teste de Handlers (Controllers, Actions, Jobs e Tools)

Esta documentação define os padrões e práticas para escrever testes unitários
para os diferentes tipos de handlers no projeto Stardust: **Controllers**
(REST), **Actions** (RPC), **Jobs** (Queue) e **Tools** (AI).

## 1. Visão Geral

Handlers são os pontos de entrada da aplicação. Sua responsabilidade é receber
dados de uma fonte externa (HTTP, RPC, Queue, IA), orquestrar a chamada para a camada
de domínio ou casos de uso e retornar uma resposta formatada.

| Tipo           | Camada | Contexto (Entrada) | Retorno (Saída)         |
| :------------- | :----- | :----------------- | :---------------------- |
| **Controller** | REST   | `Http<T>`          | `Promise<RestResponse>` |
| **Action**     | RPC    | `Call<T>`          | `Promise<U>`            |
| **Job**        | Queue  | `Amqp<T>`          | `Promise<U>`            |
| **Tool**       | AI     | `Mcp<T>`           | `Promise<U>`            |

---

## 2. Controllers (REST)

Os controllers residem principalmente em `apps/server/src/rest/controllers` ou
`apps/web/src/rest/controllers`.

### 2.1. Padrão de Teste

O teste deve garantir que o controller:

1. Extraia os dados corretamente do objeto `Http` (body, params, query,
   accountId).
2. Chame o Caso de Uso com os parâmetros transformados.
3. Responda com o status code e corpo corretos através do objeto `Http`.

### 2.2. Exemplo de Implementação

```ts
import { type Mock, mock } from "ts-jest-mocker";
import type { Http } from "@stardust/core/global/interfaces";
import type { SendFeedbackReportUseCase } from "@stardust/core/reporting/use-cases";
import { FeedbackReportsFaker } from "@stardust/core/reporting/entities/fakers";
import { SendFeedbackReportController } from "../SendFeedbackReportController";

describe("Send Feedback Report Controller", () => {
  let http: Mock<Http>;
  let useCase: Mock<SendFeedbackReportUseCase>;
  let controller: SendFeedbackReportController;

  beforeEach(() => {
    http = mock();
    useCase = mock();
    controller = new SendFeedbackReportController(useCase);
  });

  it("should call the use case and send created status", async () => {
    // Arrange
    const body = { content: "Great!" };
    const feedbackDto = FeedbackReportsFaker.fakeDto();

    http.getBody.mockResolvedValue(body);
    useCase.execute.mockResolvedValue(feedbackDto);
    http.statusCreated.mockReturnValue(http); // Suporte a interface fluida

    // Act
    await controller.handle(http);

    // Assert
    expect(useCase.execute).toHaveBeenCalledWith(expect.objectContaining({
      content: body.content,
    }));
    expect(http.statusCreated).toHaveBeenCalled();
    expect(http.send).toHaveBeenCalledWith(feedbackDto);
  });
});
```

---

## 3. Actions (RPC)

As actions vivem em `apps/web/src/rpc/actions` e são implementadas como _Factory
Functions_.

### 3.1. Padrão de Teste

O teste deve focar no método `handle` retornado pela factory. Deve-se garantir
que a Action:

1. Use o objeto `Call` para obter dados da requisição e gerenciar
   cookies/sessão.
2. Dispare eventos via `Broker` se necessário.
3. Retorne o dado puro para o chamador RPC.

### 3.2. Exemplo de Implementação

```ts
import { type Mock, mock } from "ts-jest-mocker";
import type { Broker, Call } from "@stardust/core/global/interfaces";
import type { AuthService } from "@stardust/core/auth/interfaces";
import { SignInAction } from "../SignInAction";

describe("Sign In Action", () => {
  let authService: Mock<AuthService>;
  let broker: Mock<Broker>;
  let call: Mock<Call>;
  let action: ReturnType<typeof SignInAction>;

  beforeEach(() => {
    authService = mock();
    broker = mock();
    call = mock();
    action = SignInAction(authService, broker);
  });

  it("should authenticate user and set session cookies", async () => {
    const request = { email: "user@stardust.com", password: "password123" };
    const session = {
      accessToken: "token",
      durationInSeconds: 3600,
      account: { id: "1" },
    };

    call.getRequest.mockReturnValue(request);
    authService.signIn.mockResolvedValue({ isFailure: false, body: session });

    await action.handle(call);

    expect(authService.signIn).toHaveBeenCalled();
    expect(call.setCookie).toHaveBeenCalledWith(
      expect.any(String),
      "token",
      3600,
    );
    expect(broker.publish).toHaveBeenCalled();
  });

  it("should throw error if authentication fails", async () => {
    call.getRequest.mockReturnValue({ email: "...", password: "..." });
    authService.signIn.mockResolvedValue({
      isFailure: true,
      throwError: () => {
        throw new Error("Auth Failed");
      },
    });

    await expect(action.handle(call)).rejects.toThrow("Auth Failed");
  });
});
```

---

## 4. Jobs (Queue)

Os jobs vivem principalmente em `apps/server/src/queue/jobs` e representam os
handlers assíncronos da aplicação. Eles recebem eventos via `Amqp<T>`,
orquestram workflows, casos de uso ou serviços e delegam a execução ao motor
de fila na borda da aplicação.

### 4.1. Padrão de Teste

O teste deve garantir que o Job:

1. Extraia corretamente o payload do objeto `Amqp` através de `getPayload()`.
2. Chame o workflow, caso de uso ou serviço com os parâmetros transformados.
3. Execute efeitos colaterais e IO dentro de `amqp.run(...)` quando aplicável.
4. Propague falhas corretamente quando a dependência retornar erro.

### 4.2. Exemplo de Implementação

```ts
import { type Mock, mock } from "ts-jest-mocker";
import type { Amqp } from "@stardust/core/global/interfaces";
import type { CreateChallengeWorkflow } from "@stardust/core/challenging/interfaces";
import { CreateChallengeJob } from "../CreateChallengeJob";

describe("Create Challenge Job", () => {
  let amqp: Mock<Amqp>;
  let workflow: Mock<CreateChallengeWorkflow>;
  let job: CreateChallengeJob;

  beforeEach(() => {
    amqp = mock();
    workflow = mock();
    job = new CreateChallengeJob(workflow);

    amqp.run.mockImplementation(async (callback) => await callback());
  });

  it("should run workflow inside amqp.run", async () => {
    await job.handle(amqp);

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      "Create Challenge Workflow",
    );
    expect(workflow.run).toHaveBeenCalled();
  });
});
```

---

## 5. Tools (AI)

As tools são utilizadas por assistentes de IA e vivem em
`apps/web/src/ai/tools`. Elas também seguem o padrão _Factory Function_.

### 5.1. Padrão de Teste

Tools usam o objeto `Mcp` (Model Context Protocol) para entrada. O teste deve
validar se a Tool:

1. Extrai corretamente os argumentos do `Mcp`.
2. Utiliza os serviços de infraestrutura ou domínio para buscar/processar
   informações.
3. Retorna uma resposta amigável para o modelo de linguagem.

### 5.2. Exemplo de Implementação

```ts
import { type Mock, mock } from "ts-jest-mocker";
import type { Mcp } from "@stardust/core/global/interfaces";
import type { StorageService } from "@stardust/core/storage/interfaces";
import { SearchGuidesTool } from "../SearchGuidesTool";

describe("Search Guides Tool", () => {
  let storageService: Mock<StorageService>;
  let mcp: Mock<Mcp>;
  let tool: ReturnType<typeof SearchGuidesTool>;

  beforeEach(() => {
    storageService = mock();
    mcp = mock();
    tool = SearchGuidesTool(storageService);
  });

  it("should search guides based on mcp input", async () => {
    mcp.getInput.mockReturnValue({ query: "laços de repetição" });
    storageService.searchEmbeddings.mockResolvedValue({
      isFailure: false,
      body: ["Guia de For", "Guia de While"],
    });

    const result = await tool.handle(mcp);

    expect(storageService.searchEmbeddings).toHaveBeenCalled();
    expect(result).toEqual(["Guia de For", "Guia de While"]);
  });
});
```

---

## 6. Boas Práticas Comuns

1. **Iisolar o Handler:** Não teste a lógica de negócio dentro do handler. Ela
   deve estar no Caso de Uso ou Serviço. O teste do handler foca na
   **orquestração** e **tradução de dados**.
2. **Mocks de Interfaces:** Sempre prefira mockar interfaces (`Http`, `Call`,
   `Amqp`, `Mcp`, `Broker`, `UseCase`) em vez de implementações concretas.
3. **Uso de Fakers:** Utilize os Fakers do core para gerar dados de resposta das
   dependências, mantendo os testes limpos e focados.
4. **Async/Await:** Todos os handlers são inerentemente assíncronos.
   Certifique-se de usar `await` em todas as chamadas e asserções de erro
   (`rejects`).
5. **Fluent Interface:** Para controllers, lembre-se de que métodos como
   `statusCreated`, `statusOk`, etc., retornam a própria instância do `http`.
   Mocke-os adequadamente: `http.statusOk.mockReturnValue(http)`.
6. **Contexto de Queue:** Para jobs, mocke explicitamente `amqp.getPayload()` e,
   quando houver IO ou efeitos colaterais, faça `amqp.run.mockImplementation(async (callback) => await callback())`
   para validar a orquestração sem depender da infraestrutura real da fila.

## Tooling

- Runner de testes: Jest.
- TypeScript em testes:
  - `ts-jest` para transformar TS quando configurado no workspace.
  - `ts-jest-mocker` para mocks type-safe de interfaces.
- Comandos:
  - Global (Turbo): `npm run test`.
  - Por workspace: `npm run test -w @stardust/server`, `npm run test -w @stardust/web`, `npm run test -w @stardust/studio`, `npm run test -w @stardust/core`.
- Referencia geral: `documentation/tooling.md`.
