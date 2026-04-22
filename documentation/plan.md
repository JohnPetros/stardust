---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
status: closed
---

## Pendencias (quando aplicavel)

Sem pendencias bloqueantes identificadas na spec de entrada.

## Divergencias

- **2026-04-21 — Mastra MCP runtime:** a API instalada nao expoe uma implementacao concreta publica de `MCPServer` em `@mastra/core` para instanciacao direta no server app. Foi adotada uma implementacao compativel via `@modelcontextprotocol/sdk` encapsulada em `ChallengeManagementMcpServer`, mantendo contrato funcional de singleton MCP HTTP e uso das tools do `ChallengingToolset`.
- **2026-04-21 — Compatibilidade de testes Jest:** importacao estatica do runtime MCP causava erro ESM durante bootstrap dos testes (`@sindresorhus/slugify` transitivo de `@mastra/core/mcp`). O `McpRouter` passou a carregar o server MCP por `dynamic import` no handler da rota `/mcp`, preservando comportamento em runtime e estabilidade da suite de testes.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir contratos de autenticacao por API key e contexto MCP no core (interfaces e use case). | - | - |
| F2 | Implementar endpoint `/mcp` autenticado, server MCP e tools de gerenciamento de desafios no `apps/server`. | F1 | - |

> **Estratégia de paralelismo:** sempre comece pelo core (domínio, structures e use cases). Assim que o core estiver concluído, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Domínio, Structures e Use Cases

**Objetivo:** Definir o contrato do domínio — entidades, structures, interfaces de repositório/provider e use cases — sem nenhuma dependência de infraestrutura. Essa fase desbloqueia F2.

### Tarefas

- [x] **T1.1** — Expandir contrato `Mcp` com identidade autenticada
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/global/interfaces/ai/Mcp.ts` passa a exigir `getAccountId(): string` junto de `getInput()`, estabelecendo contrato unico para tools MCP consumirem a conta autenticada.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/global/interfaces/ai/Mcp.ts`
  - **Data:** 2026-04-21

- [x] **T1.2** — Adicionar lookup de API key por hash no contrato de repositorio
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/auth/interfaces/ApiKeysRepository.ts` passa a declarar `findByHash(keyHash: Text): Promise<ApiKey | null>` para autenticar sem trafegar segredo em texto claro.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/auth/interfaces/ApiKeysRepository.ts`
  - **Data:** 2026-04-21

- [x] **T1.3** — Criar `AuthenticateApiKeyUseCase`
  - **Depende de:** T1.2
  - **Resultado observavel:** novo arquivo `packages/core/src/auth/use-cases/AuthenticateApiKeyUseCase.ts` autentica `apiKey` via `ApiKeySecretProvider.hash`, busca por `findByHash`, rejeita key revogada e retorna `{ userId }` da key valida.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/auth/use-cases/AuthenticateApiKeyUseCase.ts`, `packages/core/src/auth/use-cases/tests/AuthenticateApiKeyUseCase.test.ts`
  - **Data:** 2026-04-21

- [x] **T1.4** — Exportar use case de autenticacao no barrel de auth
  - **Depende de:** T1.3
  - **Resultado observavel:** `packages/core/src/auth/use-cases/index.ts` exporta `AuthenticateApiKeyUseCase`, permitindo injecao no boundary do server sem importacao por caminho interno.
  - **Camada:** `core`
  - **Artefatos:** `packages/core/src/auth/use-cases/index.ts`
  - **Data:** 2026-04-21

---

## F2 — Server: Infra, Repositórios e Handlers

**Objetivo:** Implementar a camada de infraestrutura e exposição — repositórios, providers e handlers HTTP/MCP — consumindo os contratos definidos no core.

### Tarefas

- [x] **T2.1** — Implementar `findByHash` no repositório Supabase de API keys
  - **Depende de:** T1.2
  - **Resultado observavel:** `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts` consulta `key_hash` por `keyHash.value` e retorna `ApiKey` mapeada (ou `null`) via `SupabaseApiKeyMapper`.
  - **Camada:** `database`
  - **Artefatos:** `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts`
  - **Data:** 2026-04-21

- [x] **T2.2** — Adicionar middleware de autenticacao por `X-Api-Key`
  - **Depende de:** T1.3, T1.4, T2.1
  - **Resultado observavel:** `apps/server/src/app/hono/middlewares/AuthMiddleware.ts` passa a ter `verifyApiKeyAuthentication`, que extrai `X-Api-Key`, autentica com `AuthenticateApiKeyUseCase` e preenche `context.account.id` com o `userId` autenticado.
  - **Camada:** `rest`
  - **Artefatos:** `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`
  - **Data:** 2026-04-21

- [x] **T2.3** — Criar constante de instrucoes oficiais de criacao de desafios
  - **Depende de:** T1.1
  - **Resultado observavel:** novo arquivo `apps/server/src/ai/challenging/constants/challenge-creation-instructions.ts` define `CHALLENGE_CREATION_INSTRUCTIONS` com campos obrigatorios, formato de `testCases`, minimo de 3 casos e regra de controle server-side de `author`/`isPublic`.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/constants/challenge-creation-instructions.ts`
  - **Data:** 2026-04-21

- [x] **T2.4** — Publicar constante no barrel de constantes de challenging
  - **Depende de:** T2.3
  - **Resultado observavel:** `apps/server/src/ai/challenging/constants/index.ts` exporta `CHALLENGE_CREATION_INSTRUCTIONS` para consumo do toolset.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/constants/index.ts`
  - **Data:** 2026-04-21

- [x] **T2.5** — Criar tool de instrucoes de criacao
  - **Depende de:** T1.1, T2.3
  - **Resultado observavel:** novo arquivo `apps/server/src/ai/challenging/tools/GetChallengeCreationInstructionsTool.ts` retorna `{ instructions }` sem acesso a banco, usando somente a constante oficial.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/tools/GetChallengeCreationInstructionsTool.ts`
  - **Data:** 2026-04-21

- [x] **T2.7** — Criar tool MCP de atualizacao preservando `isPublic`
  - **Depende de:** T1.1
  - **Resultado observavel:** novo arquivo `apps/server/src/ai/challenging/tools/UpdateChallengeTool.ts` valida autoria via `mcp.getAccountId()`, reutiliza `author`/`isPublic` persistidos e delega para `UpdateChallengeUseCase`.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/tools/UpdateChallengeTool.ts`
  - **Data:** 2026-04-21

- [x] **T2.8** — Ajustar `PostChallengeTool` para autoria autenticada e rascunho forçado
  - **Depende de:** T1.1
  - **Resultado observavel:** `apps/server/src/ai/challenging/tools/PostChallengeTool.ts` remove autor hardcoded, usa `mcp.getAccountId()` para `author.id` e sempre envia `isPublic = false` ao `PostChallengeUseCase`.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`, `apps/server/src/ai/challenging/tools/tests/PostChallengeTool.test.ts`
  - **Data:** 2026-04-21

- [x] **T2.9** — Atualizar descricoes e barrel das tools de challenging
  - **Depende de:** T2.5, T2.7, T2.8
  - **Resultado observavel:** `apps/server/src/ai/challenging/constants/tools-descriptions.ts` descreve as novas tools MCP e `apps/server/src/ai/challenging/tools/index.ts` exporta as novas classes para composicao no toolset.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/challenging/constants/tools-descriptions.ts`, `apps/server/src/ai/challenging/tools/index.ts`
  - **Data:** 2026-04-21

- [x] **T2.10** — Expandir adapter `MastraMcp` com `getAccountId()`
  - **Depende de:** T1.1
  - **Resultado observavel:** `apps/server/src/ai/mastra/MastraMcp.ts` implementa `getInput()` + `getAccountId()` e passa a resolver a conta autenticada a partir do contexto do runtime MCP server.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/mastra/MastraMcp.ts`
  - **Data:** 2026-04-21

- [x] **T2.11** — Atualizar `ChallengingToolset` com schemas MCP e composicao das tools de gerenciamento
  - **Depende de:** T2.4, T2.5, T2.6, T2.7, T2.8, T2.9, T2.10
  - **Resultado observavel:** `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts` registra tools de instrucoes/criacao/consulta/atualizacao com `inputSchema` e `outputSchema` explicitos, derivando entradas de `challengeSchema`/`idSchema` sem `author` e `isPublic`.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`
  - **Data:** 2026-04-21

- [x] **T2.12** — Criar servidor MCP unico de gerenciamento de desafios
  - **Depende de:** T2.11
  - **Resultado observavel:** novo arquivo `apps/server/src/ai/mastra/mcp/ChallengeManagementMcpServer.ts` expoe `getServer()` com singleton de MCP HTTP runtime e toolset restrito ao dominio `challenging`.
  - **Camada:** `ai`
  - **Artefatos:** `apps/server/src/ai/mastra/mcp/ChallengeManagementMcpServer.ts`
  - **Data:** 2026-04-21

- [x] **T2.13** — Criar `McpRouter` com autenticacao por API key e validacao de insignia
  - **Depende de:** T2.2, T2.12
  - **Resultado observavel:** novo arquivo `apps/server/src/app/hono/routers/mcp/McpRouter.ts` registra `/mcp`, aplica `verifyApiKeyAuthentication`, valida insignia de Engenheiro e delega ao transporte HTTP do MCP server.
  - **Camada:** `rest`
  - **Artefatos:** `apps/server/src/app/hono/routers/mcp/McpRouter.ts`
  - **Data:** 2026-04-21

- [x] **T2.14** — Exportar router MCP nos barrels de roteamento
  - **Depende de:** T2.13
  - **Resultado observavel:** `apps/server/src/app/hono/routers/mcp/index.ts` e `apps/server/src/app/hono/routers/index.ts` passam a exportar `McpRouter` para composicao do app.
  - **Camada:** `rest`
  - **Artefatos:** `apps/server/src/app/hono/routers/mcp/index.ts`, `apps/server/src/app/hono/routers/index.ts`
  - **Data:** 2026-04-21

- [x] **T2.15** — Integrar `McpRouter` no `HonoApp` e isolar fluxo `/mcp` do decode JWT
  - **Depende de:** T2.14
  - **Resultado observavel:** `apps/server/src/app/hono/HonoApp.ts` registra `McpRouter` e `createSupabaseClient()` deixa de aplicar `jwtDecode` ao bearer de requests `/mcp`, preservando o comportamento atual das demais rotas.
  - **Camada:** `rest`
  - **Artefatos:** `apps/server/src/app/hono/HonoApp.ts`
  - **Data:** 2026-04-21
