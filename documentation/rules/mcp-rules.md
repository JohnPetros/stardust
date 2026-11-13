# MCP Usage Rules

## Goal

The project's MCPs exist to speed up context reading, validation of real
behavior, integration with external services and assisted editing of
non-code artifacts. They must be used as operational extensions of the
work, not as substitutes for technical analysis.

## MCPs supported in the project

- **Context7**: fetch up-to-date documentation for libraries, frameworks,
  SDKs, APIs and CLIs.
- **CodeGraph**: explore symbols, call paths and the impact of changes
  in the indexed codebase.
- **Penpot**: inspect and edit the Penpot file `stardust`, export
  board images, read components and tokens and validate layout.
- **Pencil**: read and edit `.pen` files, validate layout and work with
  design context.
- **Supabase Dev**: inspect and operate the Supabase development
  environment.
- **Supabase Prod**: inspect the Supabase production environment with extra
  care.
- **Playwright MCP**: validate real browser flows, navigation,
  authentication, scroll, forms and visual/interactive regression.

## General rules

- Always choose the most specific MCP for the task before resorting to the shell
  or generic web search.
- Do not use an MCP when the answer can be obtained in a simpler and safer way
  from the local codebase itself.
- Do not assume the MCP is ready to use: confirm the environment prerequisites
  when the tool depends on binaries, local services, session or
  credentials.
- Treat the MCP output as operational evidence. It is still necessary to
  interpret the result based on the project's architecture and rules.
- When the MCP reveals an infrastructure or environment failure, record that
  explicitly instead of incorrectly concluding that the bug is in the code.

## When to use each MCP

### Context7

Use when the task depends on up-to-date documentation and there is a risk of
drift from outdated information.

Use for:

- library syntax and contracts;
- configuration options;
- version migrations;
- current behavior of external tools.

Do not use as the main source to explain the project's own codebase.

### CodeGraph

Use before reading or editing code when you need to understand symbols, flows,
architecture, bugs or the impact of a change. The exploration returns source code,
call paths and blast radius.

Best practices:

- query relevant symbols or files in a single exploration;
- treat the returned code as a current read and do not repeat the search with `grep` or
  by reading the same files;
- use direct reading for files outside the index or details that the exploration
  did not show;
- if the project is not indexed, use the local navigation and reading
  tools; do not initialize the index without a request.

### Penpot

Use to inspect or edit the Penpot file `stardust`, the project's canonical
visual source. The MCP only works with the file open in the browser and the
Penpot MCP plugin loaded and connected to it.

Best practices:

- read `high_level_overview` once per session and consult `penpot_api_info`
  before using `execute_code`;
- confirm with `penpot.currentFile.name` that the connected file is `stardust`;
  the MCP server may be linked to another Penpot file;
- locate pages and boards by name (`penpot.currentFile.pages`,
  `penpotUtils.findShapes`); the name is the contract and IDs change if the board is
  recreated;
- read the structure, the components (`penpot.library.local`) and the tokens before
  deducing colors, measurements or components;
- use `export_shape` only when visual validation is necessary;
- when editing, use the library's components and tokens, do not change
  library components without a request and check the result with
  `export_shape`; Penpot saves automatically;
- the `execute_code` sandbox has no `fetch`; send data inline and do not depend
  on local servers.

### Pencil

Use only for `.pen` files or when the task requires real editor
design context.

Best practices:

- first obtain the editor's current state/schema;
- use a screenshot only when visual validation is necessary;
- prefer structural validation when the goal is layout or hierarchy.

### Supabase Dev and Supabase Prod

Use to verify schema, logs, configuration and data related to the flow
under investigation.

Best practices:

- start with inspection before changing anything;
- prefer `Dev` by default;
- use `Prod` only when the question requires the real production state;
- in production, avoid mutating operations without an objective need and evidence.

### Playwright MCP

Use when the change touches real visual or interactive behavior:

- authenticated pages;
- navigation;
- forms;
- scroll;
- modals and drawers;
- layout regression;
- browser behavior that a unit test does not cover well.

## Specific rules for the Playwright MCP

### Prerequisites

Before opening the page:

- confirm that the correct app is running on the expected port;
- confirm that the binary required by the MCP exists on the host;
- confirm that the URL responds without a structural error;
- confirm whether the route requires authentication.

### Session and authentication

- The MCP's browser uses an isolated context. A manual login in the user's local
  browser does not imply an authenticated session in Playwright.
- For authenticated routes, authenticate inside the MCP itself or inject the session
  explicitly.
- When it is necessary to authenticate in the current environment to validate
  protected pages, use the credentials provided by the user in this project:
  `ctrlaltdel.cursor@gmail.com` / `123456`.
- If the protected route redirects to login, do not treat this as a bug of the
  target screen without first validating the absence of a session.

### Correct validation

- Do not rely only on the final URL. Capture a snapshot, the console and, when it makes
  sense, a screenshot.
- Distinguish a product error from an environment error. Example: `404` assets,
  wrong process on the port, missing session, broken server.
- When measuring scroll or viewport bugs, collect the real dimensions of the scrollable
  container and of the target element in the browser context.
- When the flow depends on animation, lazy-load or late layout, wait for a
  stable state before concluding that the behavior is correct.

### Limits

- Console warnings only matter when they directly affect the validated flow.
- Auxiliary errors in parallel requests must be recorded, but must not
  invalidate the main conclusion without a clear causal link.
- If the MCP fails due to infrastructure, document the exact cause and the step that
  remained pending.

## Recommended order of use

1. Confirm the goal and the type of validation needed.
2. Choose the appropriate MCP.
3. Verify the environment prerequisites.
4. Run the reading or validation.
5. Record the observed evidence.
6. Separate environment problem, data problem and code problem.

## Anti-patterns

- Using Playwright to try to prove a UI bug without the app running correctly.
- Using Context7 to answer a question about local code that CodeGraph or
  direct reading would solve better.
- Using Supabase Prod when Dev is enough.
- Concluding that a route is broken without checking authentication, redirect or
  the browser's isolated context.
- Ignoring MCP infrastructure failures and proceeding with speculative conclusions.
