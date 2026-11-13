# Handler Testing Rules (Controllers, Actions, Jobs and Tools)

This documentation defines the standards and practices for writing unit tests
for the different types of handlers in the Stardust project: **Controllers**
(REST), **Actions** (RPC), **Jobs** (Queue) and **Tools** (AI).

## 1. Overview

Handlers are the entry points of the application. Their responsibility is to receive
data from an external source (HTTP, RPC, Queue, AI), orchestrate the call to the domain
layer or use cases and return a formatted response.

| Type           | Layer | Context (Input) | Return (Output)         |
| :------------- | :----- | :----------------- | :---------------------- |
| **Controller** | REST   | `Http<T>`          | `Promise<RestResponse>` |
| **Action**     | RPC    | `Call<T>`          | `Promise<U>`            |
| **Job**        | Queue  | `Amqp<T>`          | `Promise<U>`            |
| **Tool**       | AI     | `Mcp<T>`           | `Promise<U>`            |

---

## 2. Controllers (REST)

Controllers live mainly in `apps/server/src/rest/controllers` or
`apps/web/src/rest/controllers`.

### 2.1. Test Pattern

The test must ensure that the controller:

1. Correctly extracts the data from the `Http` object (body, params, query,
   accountId).
2. Calls the Use Case with the transformed parameters.
3. Responds with the correct status code and body through the `Http` object.

### 2.2. Implementation Example

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
    http.statusCreated.mockReturnValue(http); // Fluent interface support

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

Actions live in `apps/web/src/rpc/actions` and are implemented as _Factory
Functions_.

### 3.1. Test Pattern

The test must focus on the `handle` method returned by the factory. It must ensure
that the Action:

1. Uses the `Call` object to obtain request data and manage
   cookies/session.
2. Fires events via `Broker` if necessary.
3. Returns the plain data to the RPC caller.

### 3.2. Implementation Example

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

Jobs live mainly in `apps/server/src/queue/jobs` and represent the application's
asynchronous handlers. They receive events via `Amqp<T>`,
orchestrate workflows, use cases or services and delegate execution to the queue
engine at the application boundary.

### 4.1. Test Pattern

The test must ensure that the Job:

1. Correctly extracts the payload from the `Amqp` object through `getPayload()`.
2. Calls the workflow, use case or service with the transformed parameters.
3. Executes side effects and IO inside `amqp.run(...)` when applicable.
4. Correctly propagates failures when the dependency returns an error.

### 4.2. Implementation Example

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

Tools are used by AI assistants and live in
`apps/web/src/ai/tools`. They also follow the _Factory Function_ pattern.

### 5.1. Test Pattern

Tools use the `Mcp` (Model Context Protocol) object for input. The test must
validate whether the Tool:

1. Correctly extracts the arguments from the `Mcp`.
2. Uses the infrastructure or domain services to fetch/process
   information.
3. Returns a friendly response for the language model.

### 5.2. Implementation Example

```ts
import { type Mock, mock } from "ts-jest-mocker";
import type { Mcp } from "@stardust/core/global/interfaces";
import { RestResponse } from "@stardust/core/global/responses";
import { GuidesFaker } from "@stardust/core/manual/entities/fakers";
import type { ManualService } from "@stardust/core/manual/interfaces";
import { GetMdxGuideTool } from "../GetMdxGuideTool";

describe("Get Mdx Guide Tool", () => {
  let service: Mock<ManualService>;
  let mcp: Mock<Mcp<void>>;
  let tool: ReturnType<typeof GetMdxGuideTool>;

  beforeEach(() => {
    service = mock<ManualService>();
    mcp = mock<Mcp<void>>();
    tool = GetMdxGuideTool(service);
  });

  it("should fetch mdx guides and join contents", async () => {
    const guideA = GuidesFaker.fakeDto({ category: "mdx", content: "# Guia A" });
    const guideB = GuidesFaker.fakeDto({ category: "mdx", content: "# Guia B" });

    service.fetchGuidesByCategory.mockResolvedValue(
      new RestResponse({ body: [guideA, guideB] }),
    );

    const result = await tool.handle(mcp);

    expect(service.fetchGuidesByCategory).toHaveBeenCalledWith(
      expect.objectContaining({ value: "mdx" }),
    );
    expect(result).toBe("# Guia A\n# Guia B");
    expect(mcp.getInput).not.toHaveBeenCalled();
  });
});
```

---

## 6. Common Best Practices

1. **Isolate the Handler:** Do not test the business logic inside the handler. It
   must be in the Use Case or Service. The handler test focuses on
   **orchestration** and **data translation**.
2. **Interface Mocks:** Always prefer mocking interfaces (`Http`, `Call`,
   `Amqp`, `Mcp`, `Broker`, `UseCase`) instead of concrete implementations.
3. **Use of Fakers:** Use the core Fakers to generate response data for the
   dependencies, keeping the tests clean and focused.
4. **Async/Await:** All handlers are inherently asynchronous.
   Make sure to use `await` in all calls and error assertions
   (`rejects`).
5. **Fluent Interface:** For controllers, remember that methods such as
   `statusCreated`, `statusOk`, etc., return the `http` instance itself.
   Mock them appropriately: `http.statusOk.mockReturnValue(http)`.
6. **Queue Context:** For jobs, explicitly mock `amqp.getPayload()` and,
   when there is IO or side effects, use `amqp.run.mockImplementation(async (callback) => await callback())`
   to validate the orchestration without depending on the real queue infrastructure.

## Tooling

- Test runner: Jest.
- TypeScript in tests:
  - `ts-jest` to transform TS when configured in the workspace.
  - `ts-jest-mocker` for type-safe mocks of interfaces.
- Commands:
  - Global (Turbo): `pnpm run test`.
  - Per workspace: `pnpm --filter @stardust/server run test:unit`, `pnpm --filter @stardust/web run test:unit`, `pnpm --filter @stardust/backoffice run test:unit`, `pnpm --filter @stardust/core run test:unit`.
- General reference: `documentation/tooling.md`.
