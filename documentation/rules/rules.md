# Project Rules

This file serves as an index for the project's documentation rules.
Always consult the specific files below based on the task at hand.

## Crew Application Rules

**File:** `/documentation/rules/crew-app-rules.md`
**When to consult:** when changing `apps/crew/**`, `Dockerfile.crew` or the Crew CI.
Crew is independent tooling; its exceptions for structure, classes, persistence and
tests do not apply to the product applications.

## SDD Execution Rules

**Main file and sole normative source:** `/documentation/sdd.md`
**When to consult:**

- When creating or reviewing a technical Spec.
- The Spec Reviewer runs a single gate before implementation (with retries of the
  same review when there are findings) and evaluates only compatibility with
  Architecture and Rules.
- When implementing a Spec directly.
- When running sensors and concluding an implementation.
- When updating Spec, PRD, Architecture or Rules during implementation.
- When recording human review, progress or a finding.
- When creating or updating `evaluation.md`.
- When separating local sensors from the CI checks and build.

See `documentation/sdd.md` for the full flow, contracts, states,
roles, artifacts, sensors and completion criteria.

## Code Conventions Rules

**File:** `/documentation/rules/code-conventions-rules.md`
**When to consult:**

- When creating or modifying a document related to code conventions.
- For general naming conventions (variables, functions, classes,
  files).
- To understand the use of Factory Functions and Domain Objects (Entities,
  Value Objects, Aggregates).
- For rules about Barrel files (index.ts).
- When creating Event or Error classes.
- When defining constants and applying the prohibition of dedicated tests for them.

## Commit Rules

**File:** `/documentation/rules/commit-rules.md`
**When to consult:**

- Before creating commits in the repository.
- To choose the prefix, emoji and format of the commit message.
- To group changes by semantic responsibility.
- To replace the use of commit-specific prompts as the main source of decision.

## UI Layer Rules

**File:** `/documentation/rules/ui-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the UI layer.
- When creating or modifying React components (Widgets).
- To understand the structure of a widget (View, Hook, Index).
- For naming conventions of Views, Hooks and Props.
- When implementing event handlers or action executors.
- To understand when to use `forwardRef`.

## REST Layer Rules

**File:** `/documentation/rules/rest-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the REST layer.
- When making HTTP requests to external APIs or services.
- To implement new Services using `RestClient`.
- To understand how `RestResponse` works and the error handling in this
  layer.

## RPC Layer Rules

**File:** `/documentation/rules/rpc-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the RPC layer.
- When implementing Actions on the server using the Factory Function pattern.
- To understand the `Call` interface and how to handle
  requests/redirects.
- When organizing actions by domain.

## LSP Layer Rules

**File:** `/documentation/rules/lsp-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the LSP layer.
- When changing the `packages/lsp` package.
- To understand the responsibilities of `DeleguaLsp`, `DeleguaInterpretador` and `DeleguaConfiguracaoParaEditorMonaco`.
- When adding snippets, documentation, regex or tokens of the Delegua language.
- When integrating code editing, execution or analysis features with core contracts.

## Delegua Language Rules

**File:** `/documentation/rules/delegua-rules.md`
**When to consult:**

- When creating or modifying executable Delégua code.
- When writing challenges, official solutions, fixtures, mocks or snippets of
  Delégua.
- When defining inputs, outputs or expected results of Delégua programs.
- To ensure that booleans, reserved words, types and native functions
  are in Portuguese.
- When choosing the simplest, most readable and most didactic solution for a challenge.
- When integrating Delégua code with the editor, the LSP, the server or the playback.

## Queue Layer Rules

**File:** `/documentation/rules/queue-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the queue layer.
- When implementing background jobs or asynchronous processing.
- To understand the `Job` interface and the `Amqp` protocol.
- When defining new jobs with the `Job<Payload>` structure.

## Realtime Layer Rules

**File:** `/documentation/rules/realtime-rules.md`
**When to consult:**

- When creating or modifying a document related to the realtime layer.
- When implementing new realtime channels, adapters or clients in `apps/web`.
- To understand how to expose provider events to the UI without coupling widgets to the external SDK.
- When integrating hooks, contexts and listeners with core contracts, such as `ProfileChannel`.

## Providers Layer Rules (provision)

**File:** `/documentation/rules/provision-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the provision layer.
- When integrating with third-party tools (Storage, Email, Payments,
  etc.).
- To implement new Providers (Gateways) that encapsulate external SDKs.
- To validate providers through the consuming boundary, without dedicated tests in the
  Provision layer.

## AI Layer Rules

**File:** `/documentation/rules/ai-layer-rules.md`
**When to consult:**

- When creating or modifying a document related to the AI layer.
- When implementing tools, agents, prompts or AI flows.
- To understand the boundaries between AI adapters and the project's internal contracts.
- When integrating models, providers or inference orchestration.

## MCP Usage Rules

**File:** `/documentation/rules/mcp-rules.md`
**When to consult:**

- When deciding which MCP to use for a task.
- When validating real browser flows with Playwright MCP.
- When exploring symbols and call paths with CodeGraph.
- When consulting up-to-date documentation with Context7.
- When interacting with Supabase Dev/Prod.
- When inspecting or editing the `stardust` Penpot file via Penpot MCP.

## Penpot Design File Rules

**File:** `/documentation/rules/penpot-rules.md`
**When to consult:**

- When creating or editing frames, components or tokens in the `stardust` Penpot file.
- To decide which page (Desktop, Mobile, Components or Design System) owns a frame.
- To name screens, dialogs, components and variant properties.
- When extracting a repeated element into a component or updating the Design System page.

## Web Application Rules

**File:** `/documentation/rules/web-application-rules.md`
**When to consult:**

- When creating or modifying a document related to the web application.
- For an overview of the Web Application's architecture and stack (Next.js,
  Tailwind, etc.).
- To understand the folder structure of the `apps/web` project.

## Backoffice Application Rules

**File:** `/documentation/rules/backoffice-application-rules.md`
**When to consult:**

- When creating or modifying a document related to the backoffice application.
- For an overview of the Backoffice Application's architecture and stack (Admin
  Panel - React Router v7, Vite, Shadcn).
- To understand the folder structure of the `apps/backoffice` project.

## Server Application Rules

**File:** `/documentation/rules/server-application-rules.md`
**When to consult:**

- When creating or modifying a document related to the server application.
- For an overview of the Server Application's architecture and stack (Hono, Inngest, Supabase, etc.).
- To understand the folder structure of the `apps/server` project.

## Database Layer Rules (db)

**File:** `/documentation/rules/database-rules.md`
**When to consult:**

- When creating or modifying a document related to the database layer.
- When implementing data persistence (Repositories).
- To understand the Mappers pattern (DB <-> Entity conversion).
- When configuring connections or handling database-specific errors.

## Core Package Rules (core)

**File:** `/documentation/rules/core-package-rules.md`
**When to consult:**

- When creating or modifying a document related to the core package.
- To understand the Domain architecture (Tactical DDD).
- When creating Entities, Structures (Value Objects), Aggregates and Events.
- When implementing Use Cases and DTOs.
- When writing unit tests, Fakers or Mocks for the domain.

## Validation Layer Rules

**File:** `/documentation/rules/validation-layer-rules.md`
**When to consult:**

- When creating or modifying Zod schemas in the `packages/validation` package.
- To understand how to organize global and per-module validations.
- To standardize error messages in PT-BR within the schema itself.
- When exposing new schemas in the package's barrel files.

## Handler Testing Rules

**File:** `/documentation/rules/handlers-testing-rules.md`
**When to consult:**

- When writing tests for Controllers (REST), Actions (RPC), Jobs (Queue) or Tools (AI).
- To understand how to mock the `Http`, `Call`, `Amqp` and `Mcp` context objects.
- To follow the orchestration and data translation patterns in the application's
  entry tests.

## Server App Route Testing Rules

**File:** `/documentation/rules/server-routes-testing-rules.md`
**When to consult:**

- When writing tests for the server application's HTTP routes.
- To validate integration between handlers, middlewares and response contracts.
- When standardizing tests of endpoints exposed by `apps/server`.
- When creating or changing integration fixtures, which do not receive dedicated tests.

## Web App Route Testing Rules

**File:** `/documentation/rules/web-app-routes-testing-rules.md`
**When to consult:**

- When writing tests for pages, slots and flows of the `Next.js App Router` in
  `apps/web/src/app/**`.
- To standardize co-located tests of `page.tsx` and App Router entries.
- To write browser tests with Playwright in
  `apps/web/src/app/tests/**`.
- When validating web edge composition, route requests, redirects, `notFound()`
  and test-only bridges of the web app.
- When defining the mandatory coverage of authenticated navigation and of
  redirection to login in Web flows.

## Use Case Testing Rules

**File:** `/documentation/rules/use-cases-testing-rules.md`
**When to consult:**

- When writing unit tests for Use Cases in the core package.
- To understand how to mock repositories and other dependencies using
  `ts-jest-mocker`.
- To follow the pattern of testing success paths and business errors.
- For instructions on using Fakers to generate test data.

## Widget Testing Rules

**File:** `/documentation/rules/widget-tests-rules.md`
**When to consult:**

- When testing React components (Widgets) in the UI layer.
- To understand the separation of tests between Hooks and Views.
- To use helper functions such as `Hook()` and `View()` for cleaner
  tests.
- For instructions on integration tests of complex form widgets.

## Domain Object Testing Rules

**File:** `/documentation/rules/domain-objects-testing-rules.md`
**When to consult:**

- When writing tests for Entities, Structures and Aggregates.
- To understand how to use Fakers to prepare the state of domain tests.
- To follow the patterns of assertion and validation of business rules in the
  domain.
