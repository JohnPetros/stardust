---
title: MCP Server Autenticado para Gerenciamento de Desafios
prd: https://github.com/JohnPetros/stardust/milestone/26
issue: https://github.com/JohnPetros/stardust/issues/390
apps: server
status: closed
last_updated_at: 2026-04-21
---

# 1. Objetivo

Expor um único servidor MCP HTTP do Stardust em `apps/server` na rota `/mcp`, autenticado por `X-Api-Key`, para que engenheiros consigam conectar clientes MCP externos e executar um fluxo fechado de gerenciamento de desafios: obter instruções oficiais de criação, criar desafios sempre como rascunho com autoria do engenheiro autenticado, listar desafios com filtros e paginação e atualizar apenas desafios próprios sem alterar o estado de publicação. A entrega deve reaproveitar os contratos existentes de `core`, `database`, `validation` e a infraestrutura Mastra já usada no `server`, sem migrar o servidor inteiro para um novo adapter HTTP e sem introduzir múltiplos MCP servers por domínio.

---

# 2. Escopo

## 2.1 In-scope

- Expor um endpoint MCP HTTP único em `/mcp` dentro do `HonoApp`.
- Manter apenas um MCP server do Stardust para esta entrega, agregando nele as tools de gerenciamento de desafios.
- Autenticar o endpoint MCP com API key já gerenciada pelo módulo `auth`.
- Validar API key enviada em `X-Api-Key` por hash SHA-256, revogação e insignia de Engenheiro.
- Registrar no servidor MCP apenas tools do domínio `challenging` relacionadas a criação e gestão de desafios.
- Criar uma tool dedicada para retornar instruções estáveis de criação de desafio.
- Expor uma tool de listagem de desafios com filtros e paginação para uso no MCP.
- Expor uma tool de exclusão de desafio com confirmação explícita do usuário.
- Permitir criar desafio via MCP sempre como rascunho e com autoria do engenheiro autenticado.
- Permitir consultar problema de desafio em cache para contexto de criação/edição.
- Permitir atualizar apenas desafios cujo autor seja o usuário autenticado pela API key, incluindo o campo `isPublic` quando enviado no payload.
- Reaproveitar `PostChallengeUseCase`, `GetChallengeUseCase` e `UpdateChallengeUseCase` no fluxo MCP.
- Reaproveitar `challengeSchema` e `idSchema` como referência para derivar schemas específicos do MCP no boundary do toolset, omitindo campos controlados pelo servidor.

## 2.2 Out-of-scope

- Criar ou alterar a UI de geração/revogação de API keys no `web`.
- Alterar os endpoints REST já existentes em `/challenging/challenges`.
- Publicar desafios diretamente como públicos pelo cliente MCP.
- Permitir acesso a desafios de outros engenheiros.
- Expor via MCP outros módulos do Stardust, como `lesson`, `manual` ou `space`.
- Criar múltiplos MCP servers, múltiplos endpoints MCP ou segmentação por servidor/domínio nesta entrega.
- Migrar o servidor inteiro para `MastraServer` ou substituir o pipeline HTTP atual do `HonoApp`.
- Incluir testes automatizados nesta spec.

---

# 3. Requisitos

## 3.1 Funcionais

- O cliente MCP deve conseguir se conectar ao Stardust usando a URL `/mcp` e o header `X-Api-Key: <apiKey>`.
- O servidor MCP deve autenticar apenas API keys válidas, não revogadas e pertencentes a usuários com insignia de Engenheiro.
- O servidor MCP deve expor uma tool de instruções antes das tools de mutação/consulta do domínio.
- A tool de instruções deve retornar regras, campos obrigatórios, formatos aceitos e exemplos suficientes para montar um desafio válido.
- A listagem via MCP deve aceitar filtros e paginação e retornar somente desafios públicos no catálogo.
- A criação via MCP deve persistir o desafio com `author.id` do engenheiro autenticado.
- A criação via MCP deve sempre salvar o desafio com `isPublic = false`.
- A listagem via MCP deve enriquecer o payload com status de conclusão para a conta autenticada quando houver `accountId` no contexto.
- A atualização via MCP deve aceitar `challengeId` e payload estruturado do desafio.
- A atualização via MCP deve permitir alterar `isPublic` quando a conta autenticada for autora do desafio.
- A exclusão via MCP deve aceitar `challengeId` e exigir confirmação explícita do usuário no payload.
- A exclusão via MCP deve responder como não encontrado quando o desafio não existir ou não pertencer à conta autenticada.
- As tools MCP devem permanecer pequenas e delegar persistência e regras de domínio ao `@stardust/core`.

## 3.2 Não funcionais

- Segurança: a API key recebida em `/mcp` deve ser comparada apenas via hash SHA-256; o segredo em texto claro nunca deve ser persistido, logado ou propagado ao banco.
- Segurança: `HonoApp.createSupabaseClient()` não deve tratar o bearer token de `/mcp` como JWT do Supabase nem executar `jwtDecode` para esse fluxo.
- Segurança: o endpoint `/mcp` deve responder com falha previsível de autenticação para key inválida, revogada ou sem permissão de engenheiro.
- Compatibilidade retroativa: `AuthMiddleware.verifyAuthentication` e as rotas REST existentes fora de `/mcp` devem manter o comportamento atual baseado em Supabase JWT.
- Compatibilidade retroativa: `ChallengesRouter` e `ApiKeysRouter` não devem ter contratos públicos alterados.
- Boundary validation: todas as tools expostas no MCP devem declarar `inputSchema` e `outputSchema` com Zod no `ChallengingToolkit`.
- Consistência de estado: a criação via MCP deve ignorar qualquer tentativa de enviar `author` ou `isPublic` no payload.
- Consistência de estado: a atualização via MCP deve ignorar qualquer tentativa de alterar `author`.

---

# 4. O que já existe?

## Hono App / REST

* **`HonoApp`** (`apps/server/src/app/hono/HonoApp.ts`) - composition root do servidor HTTP; hoje registra routers de domínio, cria o client Supabase por request e tenta decodificar qualquer `Authorization` bearer como JWT do Supabase.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - middleware atual de autenticação; hoje só delega para `SupabaseAuthService.fetchAccount()`.
* **`ProfileMiddleware.verifyUserEngineerInsignia`** (`apps/server/src/app/hono/middlewares/ProfileMiddleware.ts`) - valida insignia de Engenheiro a partir do `account.id` já presente no contexto HTTP.
* **`ChallengesRouter`** (`apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`) - fluxo REST atual de `POST /challenging/challenges` e `PUT /challenging/challenges/:challengeId`, com validação por `challengeSchema`.
* **`ApiKeysRouter`** (`apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts`) - endpoints REST atuais de listagem, criação, renomeação e revogação de API keys em `/auth/api-keys`.
* **`VerifyAuthenticationController`** (`apps/server/src/rest/controllers/auth/VerifyAuthenticationController.ts`) - referência do boundary REST atual de autenticação baseada em serviço.
* **`VerifyChallengeManagementPermissionController`** (`apps/server/src/rest/controllers/challenging/challenges/VerifyChallengeManagementPermissionController.ts`) - regra atual de autorização por autoria, retornando `ChallengeNotFoundError` quando o desafio não pertence ao usuário.
* **`PostChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/PostChallengeController.ts`) - adapta o body HTTP para `PostChallengeUseCase.execute({ challengeDto, challengeSourceId: null })`.
* **`FetchChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/FetchChallengeController.ts`) - consulta desafio por `id`, `slug` ou `starId` via `GetChallengeUseCase`.
* **`UpdateChallengeController`** (`apps/server/src/rest/controllers/challenging/challenges/UpdateChallengeController.ts`) - injeta `challengeId` da rota no payload e delega para `UpdateChallengeUseCase`.

## AI

* **`MastraMcp`** (`apps/server/src/ai/mastra/MastraMcp.ts`) - adapter local do contrato `Mcp<Input>`; expõe `getInput()` e `getAccountId()` para as tools.
* **`ChallengingToolkit`** (`apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts`) - composition root atual das tools Mastra do domínio `challenging`; já usa `createTool`, `zod`, `SupabaseChallengesRepository`, `SupabaseChallengeSourcesRepository`, `SupabaseUsersRepository` e `InngestBroker`.
* **`PostChallengeTool`** (`apps/server/src/ai/challenging/tools/PostChallengeTool.ts`) - persiste desafio via `PostChallengeUseCase` usando `accountId` do contexto MCP como autor.
* **`GetNextChallengeSourceTool`** (`apps/server/src/ai/challenging/tools/GetNextChallengeSourceTool.ts`) - referência de tool pequena que delega diretamente para um use case do core.
* **`GetChallengeProblemTool`** (`apps/server/src/ai/challenging/tools/GetChallengeProblemTool.ts`) - referência de tool server-side que encapsula uma única responsabilidade.
* **`ListChallengesTool`** (`apps/server/src/ai/challenging/tools/ListChallengesTool.ts`) - lista desafios com filtros/paginação via `ListChallengesUseCase`, aplicando `shouldIncludePrivateChallenges = false` no fluxo MCP.
* **`DeleteChallengeTool`** (`apps/server/src/ai/challenging/tools/DeleteChallengeTool.ts`) - exclui desafios apenas quando a conta autenticada é autora e o payload contém confirmação explícita.
* **`GetMdxBlocksGuideTool`** (`apps/server/src/ai/lesson/tools/GetMdxBlocksGuideTool.ts`) - referência de tool que devolve um guia textual estável a partir da codebase, sem depender de infraestrutura externa.
* **`LessonToolset`** (`apps/server/src/ai/mastra/toolsets/LessonToolset.ts`) - referência de toolset com `inputSchema` e `outputSchema` explícitos para retorno textual simples.
* **`MastraMcpServer`** (`apps/server/src/ai/mastra/MastraMcpServer.ts`) - wrapper do servidor MCP com tratamento global de erro para request e execução de tools.
* **`MastraCreateChallengeWorkflow`** (`apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`) - fluxo atual que compõe toolset + agente e já injeta `challengeSourceId` no `PostChallengeTool`.

## Core

* **`ApiKeysRepository`** (`packages/core/src/auth/interfaces/ApiKeysRepository.ts`) - contrato atual de persistência de API keys; hoje cobre `findById`, `findManyByUserId`, `add`, `replace` e `revoke`, mas ainda não possui lookup por hash.
* **`ApiKeySecretProvider`** (`packages/core/src/auth/interfaces/ApiKeySecretProvider.ts`) - contrato já existente com `generateToken(byteLength)` e `hash(value)`; o método `hash` pode ser reutilizado na autenticação do MCP, com conversão do hash para estrutura de domínio antes de consultar o repositório.
* **`ApiKey`** (`packages/core/src/auth/domain/entities/ApiKey.ts`) - entidade que já modela `keyHash`, `keyPreview`, `userId` e `revokedAt`.
* **`CreateApiKeyUseCase`** (`packages/core/src/auth/use-cases/CreateApiKeyUseCase.ts`) - referência do fluxo oficial de geração de API key com prefixo `sk_` e hash SHA-256.
* **`GetChallengeUseCase`** (`packages/core/src/challenging/use-cases/GetChallengeUseCase.ts`) - retorna `ChallengeDto` por `challengeId`, `challengeSlug` ou `starId`.
* **`PostChallengeUseCase`** (`packages/core/src/challenging/use-cases/PostChallengeUseCase.ts`) - cria o desafio, publica `ChallengePostedEvent` e opcionalmente vincula `challengeSourceId`.
* **`UpdateChallengeUseCase`** (`packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`) - atualiza o desafio preservando validações de unicidade por slug.
* **`Challenge`** (`packages/core/src/challenging/domain/entities/Challenge.ts`) - entidade que expõe `isChallengeAuthor(userId)` e serializa para `ChallengeDto`.
* **`ChallengeSource`** (`packages/core/src/challenging/domain/entities/ChallengeSource.ts`) - entidade que já carrega `additionalInstructions` e vínculo opcional com desafio.
* **`Tool` / `Mcp`** (`packages/core/src/global/interfaces/ai/Tool.ts`, `packages/core/src/global/interfaces/ai/Mcp.ts`) - contratos base da camada AI no core.

## Database

* **`SupabaseApiKeysRepository`** (`apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts`) - implementação atual do repositório de API keys; ainda não possui `findByHash(...)`.
* **`SupabaseApiKeyMapper`** (`apps/server/src/database/supabase/mappers/auth/SupabaseApiKeyMapper.ts`) - converte `key_hash`, `key_preview` e `revoked_at` entre banco e domínio.
* **`SupabaseChallengesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`) - implementa leitura, criação e atualização de desafios; escreve `user_id`, `is_public`, `slug` e `test_cases`.
* **`SupabaseChallengeSourcesRepository`** (`apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts`) - já implementa `findNextNotUsed()`, `findById()`, `replace()` e vínculo opcional com `challenge_sources.challenge_id`.
* **`SupabaseChallengeSourceMapper`** (`apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts`) - mapeia `additional_instructions` para `additionalInstructions` no domínio.

## Validation

* **`challengeSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSchema.ts`) - schema compartilhado com `title`, `description`, `author.id`, `code`, `difficultyLevel`, `categories`, `isPublic` opcional e mínimo de 3 `testCases` estruturados.
* **`challengeDraftSchema`** (`packages/validation/src/modules/challenging/schemas/challengeDraftSchema.ts`) - schema atual usado pelo workflow Mastra; omite `author` e serializa `testCases` como strings JSON.
* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - schema base para `challengeId` e `challengeSourceId`.
* **`challengeSourceSchema`** (`packages/validation/src/modules/challenging/schemas/challengeSourceSchema.ts`) - referência de contrato compartilhado para `additionalInstructions` em `challenge_sources`.

## Documentação

* **`documentation/features/auth/api-keys-manager/prd.md`** - fonte funcional estável para formato, hash e revogação de API keys.
* **`documentation/features/auth/api-keys-manager/specs/api-keys-manager-spec.md`** - referência da entrega que criou o fluxo oficial de API keys reutilizado nesta spec.
* **`documentation/features/challenging/challenge-creator-agent/specs/get-next-challenge-source-tool-spec.md`** - referência de naming e composição entre `tool`, `toolset` e workflow na camada AI.
* **`documentation/features/challenging/challenge-sources-management/specs/challenge-source-additional-instructions-spec.md`** - referência para o uso estável de `additionalInstructions` no domínio `challenging`.

---

# 5. O que deve ser criado?

## Camada Core (Use Cases)

* **Localização:** `packages/core/src/auth/use-cases/AuthenticateApiKeyUseCase.ts` (**novo arquivo**)
* **Dependências:** `ApiKeysRepository`, `ApiKeySecretProvider`
* **Dados de request:** `apiKey`
* **Dados de response:** `userId`
* **Métodos:**
  `execute({ apiKey }: { apiKey: string }): Promise<{ userId: string }>` — calcula o hash da key recebida, converte o hash para `Text`, busca a key persistida, valida revogação e devolve o `userId` dono da key autenticada.

## Pacote Core (Interfaces)

* **Localização:** `packages/core/src/global/interfaces/ai/Mcp.ts`
* **Dependências:** nenhuma
* **Métodos:**
  `getInput(): Input` — devolve o payload tipado da operação MCP.
  `getAccountId(): string` — devolve o identificador da conta autenticada da sessão MCP para consumo das tools sem acoplamento ao runtime HTTP.

## Camada AI (Constants)

* **Localização:** `apps/server/src/ai/challenging/constants/challenge-creation-instructions.ts` (**novo arquivo**)
* **Atributos:**
  `CHALLENGE_CREATION_INSTRUCTIONS: string` — conteúdo textual estável com regras de criação de desafio derivadas do PRD, de `challengeSchema` e dos contratos do domínio `challenging`, incluindo campos obrigatórios, formato de `testCases`, mínimo de 3 casos, exemplos válidos e observação explícita de que `author` e `isPublic` são controlados pelo servidor.

## Camada AI (Tools)

* **Localização:** `apps/server/src/ai/challenging/tools/GetChallengeCreationInstructionsTool.ts` (**novo arquivo**)
* **Dependências:** `CHALLENGE_CREATION_INSTRUCTIONS`
* **Dados de request:** nenhum
* **Dados de response:** `instructions`
* **Métodos:**
  `handle(mcp: Mcp<void>): Promise<{ instructions: string }>` — retorna o guia oficial de criação de desafios sem acessar banco ou serviços externos.

* **Localização:** `apps/server/src/ai/challenging/tools/UpdateChallengeTool.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Dados de request:** `challengeId`, `title`, `description`, `code`, `difficultyLevel`, `categories`, `testCases`
* **Dados de response:** `ChallengeDto` atualizado
* **Métodos:**
  `handle(mcp: Mcp<{ challengeId: string; title: string; description: string; code: string; difficultyLevel: string; categories: ChallengeDto['categories']; testCases: ChallengeDto['testCases']; isPublic?: boolean }>): Promise<ChallengeDto>` — busca o desafio atual, lê `accountId` via `mcp.getAccountId()`, valida autoria, reaproveita `author` persistido e delega a atualização para `UpdateChallengeUseCase`, permitindo atualizar `isPublic` quando fornecido.

* **Localização:** `apps/server/src/ai/challenging/tools/ListChallengesTool.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`, `UsersRepository`
* **Dados de request:** `page`, `itemsPerPage`, `title`, `categoriesIds`, `difficulty`, `upvotesCountOrder`, `downvoteCountOrder`, `completionCountOrder`, `postingOrder`, `completionStatus`, `isNewStatus`
* **Dados de response:** `items`, `totalItemsCount`, `page`, `itemsPerPage`, `totalPagesCount`
* **Métodos:**
  `handle(mcp: Mcp<ListChallengesInput>): Promise<ListChallengesOutput>` — lista desafios públicos com filtros e paginação via `ListChallengesUseCase`, usando `accountId` da sessão MCP para enriquecer status de conclusão.

* **Localização:** `apps/server/src/ai/challenging/tools/DeleteChallengeTool.ts` (**novo arquivo**)
* **Dependências:** `ChallengesRepository`
* **Dados de request:** `challengeId`, `confirmacao`
* **Dados de response:** vazio
* **Métodos:**
  `handle(mcp: Mcp<{ challengeId: string; confirmacao: true }>): Promise<void>` — valida confirmação explícita, carrega o desafio por ID, garante autoria via entidade `Challenge` e delega a exclusão para `DeleteChallengeUseCase`.

## Camada AI (MCP Server)

* **Localização:** `apps/server/src/ai/mastra/MastraMcpServer.ts` (**novo arquivo**)
* **Dependências:** `ChallengingToolkit`, runtime MCP HTTP do Mastra
* **Biblioteca:** Mastra MCP HTTP transport (`@mastra/core` / `@mastra/server` / `@mastra/hono`)
* **Métodos:**
  `getServer(): MCPServerBase` — cria sob demanda e reutiliza a única instância do servidor MCP configurada com metadata estável, o conjunto restrito de tools de gerenciamento de desafios e o contexto necessário para o `MastraMcp` concreto.

## Camada Hono App (Routes)

* **Localização:** `apps/server/src/app/hono/routers/mcp/McpRouter.ts` (**novo arquivo**)
* **Middlewares:** `AuthMiddleware.verifyApiKeyAuthentication`
* **Caminho da rota:** `/mcp`
* **Dados de schema:** Não aplicável na rota HTTP; a validação do protocolo MCP fica a cargo do runtime e a validação de payloads das operações fica no `ChallengingToolkit`.
* **Métodos:**
  `registerHttpTransportRoute(): void` — registra a rota HTTP única do servidor MCP, resolve a instância via `ChallengeManagementMcpServer.getServer()` e delega diretamente ao transporte HTTP do runtime.
  `registerRoutes(): Hono` — expõe o router base `/mcp` para o `HonoApp`.

* **Localização:** `apps/server/src/app/hono/routers/mcp/index.ts` (**novo arquivo**)
* **Métodos:**
  `export { McpRouter } from './McpRouter'` — reexporta o router para o barrel global de `routers`.

---

# 6. O que deve ser modificado?

## Hono App

* **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
* **Mudança:** Registrar `McpRouter` no `registerRoutes()` e ajustar `createSupabaseClient()` para não tratar o bearer token de `/mcp` como JWT do Supabase nem chamar `jwtDecode` nesse fluxo.
* **Justificativa:** O PRD exige autenticação por API key independente do fluxo atual de Supabase JWT; sem esse ajuste, `/mcp` quebraria ao tentar decodificar `sk_...` como JWT.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/index.ts`
* **Mudança:** Exportar `McpRouter` no barrel de routers.
* **Justificativa:** Manter o padrão de composição atual do `HonoApp`, que importa routers centrais a partir de `./routers`.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`
* **Mudança:** Adicionar `verifyApiKeyAuthentication(context, next)` reutilizando `AuthenticateApiKeyUseCase`; o middleware deve extrair `X-Api-Key`, autenticar a API key, preencher `context.set('account', ...)` com o `userId` autenticado e seguir para o próximo handler.
* **Justificativa:** O endpoint `/mcp` precisa de autenticação própria por API key, sem reaproveitar `SupabaseAuthService.fetchAccount()`.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/mcp/McpRouter.ts` (**novo arquivo**)
* **Mudança:** Após `verifyApiKeyAuthentication`, injetar `SupabaseUsersRepository` e reutilizar `ProfileMiddleware.verifyUserEngineerInsignia` ou `VerifyUserInsigniaController` para bloquear usuários sem insignia de Engenheiro; depois disso, resolver a instância única do MCP server e delegar diretamente ao transporte HTTP do runtime.
* **Justificativa:** A verificação de insignia já pertence hoje à borda do `server` e não deve ser puxada para dentro do módulo `auth` no core.
* **Camada:** `rest`

## AI

* **Arquivo:** `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`
* **Mudança:** Remover o hardcode do autor de sistema, ler `accountId` via `mcp.getAccountId()` e forçar `author.id = accountId` e `isPublic = false` no payload enviado ao `PostChallengeUseCase`; o fluxo automatizado interno deve continuar funcionando via um `Mcp` concreto que injeta um autor técnico explícito no contexto autenticado.
* **Justificativa:** O fluxo MCP precisa preservar a autoria do engenheiro autenticado, enquanto o workflow automatizado continua podendo injetar seu autor técnico na borda do toolset.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/MastraMcp.ts`
* **Mudança:** Expandir o adapter para implementar o contrato completo de `Mcp`, incluindo `getAccountId()` além de `getInput()`, e fazê-lo receber a instância do MCP server/runtime no construtor para resolver o contexto autenticado da sessão sem depender de leitura ad hoc nas tools.
* **Justificativa:** O contexto autenticado deve ser exposto por contrato do core, e o adapter concreto pode depender da instância do server/runtime para montar esse contrato sem vazar detalhes para a camada AI.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/challenging/tools/index.ts`
* **Mudança:** Exportar `GetChallengeCreationInstructionsTool`, `UpdateChallengeTool`, `ListChallengesTool` e `DeleteChallengeTool` no barrel da camada AI.
* **Justificativa:** Disponibilizar as novas tools para o `ChallengingToolkit` e para o servidor MCP.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/challenging/constants/tools-descriptions.ts`
* **Mudança:** Adicionar descrições para as novas tools MCP (incluindo exclusão com confirmação obrigatória) e diferenciar a descrição da tool de criação em rascunho da tool usada pelo workflow automatizado.
* **Justificativa:** O runtime MCP expõe essas descrições aos clientes; elas precisam refletir claramente o escopo de cada operação.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/challenging/constants/index.ts`
* **Mudança:** Exportar `CHALLENGE_CREATION_INSTRUCTIONS` no barrel de constantes do domínio `challenging`.
* **Justificativa:** Seguir a regra da camada AI de centralizar strings e textos em `constants/`.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts`
* **Mudança:** Adicionar/registrar getters para as tools MCP de instrução, criação em rascunho, listagem, atualização, exclusão, categorias e problema; derivar os `inputSchema` no boundary com Zod e montar `MastraMcp` com `input` + contexto da request para obter o `accountId` autenticado.
* **Justificativa:** O toolkit é o composition root oficial da camada AI no domínio `challenging` e é o lugar correto para validação de boundary e composição de dependências concretas.
* **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/MastraMcpServer.ts`
* **Mudança:** Incluir tratamento global de erro no `handleRequest` e no callback de execução das tools, retornando respostas MCP estruturadas com `isError` quando houver falha.
* **Justificativa:** Evitar falhas não tratadas no runtime MCP e tornar previsível o diagnóstico de erros de execução (incluindo validação).
* **Camada:** `ai`

## Core

* **Arquivo:** `packages/core/src/global/interfaces/ai/Mcp.ts`
* **Mudança:** Expandir o contrato para incluir `getAccountId(): string`.
* **Justificativa:** A identidade autenticada da sessão MCP deve ser acessada por contrato estável do core, sem acoplamento a `req.auth`, `context.mcp.extra` ou detalhes específicos do runtime Mastra/Hono.
* **Camada:** `core`

## Core

* **Arquivo:** `packages/core/src/auth/interfaces/ApiKeysRepository.ts`
* **Mudança:** Adicionar `findByHash(keyHash: Text): Promise<ApiKey | null>` ao contrato.
* **Justificativa:** O fluxo MCP autentica a API key recebida por hash, sem expor ou persistir o segredo em texto claro.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/auth/use-cases/index.ts`
* **Mudança:** Exportar `AuthenticateApiKeyUseCase` no barrel do módulo `auth`.
* **Justificativa:** Manter o padrão já adotado no módulo para descoberta e uso dos casos de uso.
* **Camada:** `core`

## Database

* **Arquivo:** `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts`
* **Mudança:** Implementar `findByHash(keyHash)` recebendo `Text` do domínio, consultar `key_hash` por `keyHash.value` e retornar `ApiKey` mapeada; manter `SupabaseApiKeyMapper` como conversão oficial.
* **Justificativa:** O adapter Supabase precisa atender o novo contrato do core usado pela autenticação do MCP.
* **Camada:** `database`

---

# 7. O que deve ser removido?

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs

* **Decisão:** Expor o servidor MCP em `/mcp` usando transporte HTTP e header `X-Api-Key`.
* **Alternativas consideradas:** usar `Authorization: Bearer <apiKey>`; usar transporte SSE com múltiplos endpoints.
* **Motivo da escolha:** o usuário explicitou que o contrato externo deve usar `X-Api-Key`; isso também evita colisão semântica com o fluxo existente do `HonoApp`, onde `Authorization` já é tratado como bearer token do Supabase JWT.
* **Impactos / trade-offs:** o middleware de autenticação do MCP precisa ler um header custom e o fluxo HTTP do MCP não pode depender dos helpers de auth do runtime Mastra baseados em bearer token.

* **Decisão:** Manter apenas um MCP server do Stardust nesta entrega.
* **Alternativas consideradas:** criar um MCP server dedicado por domínio ou múltiplos servidores/rotas no mesmo app.
* **Motivo da escolha:** o escopo funcional está restrito ao gerenciamento de desafios e o usuário explicitou que quer apenas um MCP server; um único servidor reduz superfície pública, simplifica autenticação e evita fragmentação prematura do contrato externo.
* **Impactos / trade-offs:** futuras expansões para outros domínios devem entrar no mesmo servidor ou motivar uma nova decisão arquitetural explícita, em vez de proliferar servidores agora.

* **Decisão:** Implementar a autenticação de API key em um novo `AuthenticateApiKeyUseCase`, deixando a verificação de insignia de Engenheiro na borda do `server`.
* **Alternativas consideradas:** reaproveitar o fluxo atual de `verifyAuthentication`; adicionar autenticação por API key dentro de `SupabaseAuthService`; validar insignia dentro do próprio use case de autenticação.
* **Motivo da escolha:** a autenticação da key pertence ao domínio `auth`, mas a resolução de permissões por insignia já acontece hoje no boundary do `server` com `UsersRepository` e `VerifyUserInsigniaController`; isso evita acoplamento indevido entre módulos no core.
* **Impactos / trade-offs:** o fluxo `/mcp` passa a ter duas etapas explícitas de autorização na borda: autenticação da key e validação de insignia.

* **Decisão:** Manter a validação de visibilidade/autoria no boundary do app para atualização e exclusão via MCP, reutilizando `GetChallengeUseCase`, `UpdateChallengeUseCase`, `DeleteChallengeUseCase` e a entidade `Challenge` para decidir acesso.
* **Alternativas consideradas:** criar novos use cases de core específicos para “update own challenge” e “delete own challenge”.
* **Motivo da escolha:** o padrão atual do código já concentra regras de gerenciamento por autoria no boundary HTTP (`VerifyChallengeManagementPermissionController`); repetir esse comportamento na camada AI evita expandir a API do core além do necessário para esta feature.
* **Impactos / trade-offs:** a autorização de leitura/escrita fica parcialmente duplicada entre REST e MCP, mas permanece consistente com a implementação existente, reduz o escopo da mudança no core e permite leitura de desafios públicos de qualquer autor sem abrir acesso a desafios privados de terceiros.

* **Decisão:** Fazer `MastraMcp` receber a instância do MCP server/runtime e expor `getAccountId()` pelo contrato `Mcp`.
* **Alternativas consideradas:** continuar injetando `authorId` por parâmetro nas tools; ler `context?.mcp?.extra?.authInfo` diretamente dentro de cada tool; manter um método `handleHttp` separado no wrapper do server.
* **Motivo da escolha:** o identificador da conta autenticada faz parte do contexto operacional da chamada MCP e deve ser acessado por contrato estável do core; concentrar essa adaptação em `MastraMcp` mantém as tools desacopladas e elimina a necessidade de um `handleHttp` dedicado no wrapper do server.
* **Impactos / trade-offs:** o adapter `MastraMcp` fica mais acoplado ao runtime concreto, mas esse acoplamento permanece restrito à camada AI e simplifica o entrypoint HTTP.

* **Decisão:** Armazenar as instruções de criação em `apps/server/src/ai/challenging/constants/challenge-creation-instructions.ts` e servi-las por uma tool dedicada.
* **Alternativas consideradas:** ler markdown da pasta `documentation/` em runtime; incorporar o texto diretamente no handler HTTP; depender apenas do schema Zod para instruções.
* **Motivo da escolha:** a camada AI já centraliza textos em `constants/`, e o PRD pede uma fonte estável da codebase sem acoplamento a segredos ou IO desnecessário em runtime.
* **Impactos / trade-offs:** o texto precisa ser mantido alinhado com o schema e com o PRD, mas o runtime permanece simples, determinístico e aderente ao padrão já usado por `GetMdxBlocksGuideTool`.

* **Decisão:** Criar schemas MCP derivados de `challengeSchema`, em vez de expor `challengeSchema` diretamente como contrato de entrada das tools.
* **Alternativas consideradas:** aceitar `challengeSchema` completo e sobrescrever `author` e `isPublic` na execução.
* **Motivo da escolha:** `author` e `isPublic` são campos controlados pelo servidor neste fluxo; aceitá-los no boundary adicionaria ambiguidade ao contrato externo e abriria espaço para payloads inválidos do ponto de vista do produto.
* **Impactos / trade-offs:** adiciona schemas derivados no toolset, mas deixa o contrato MCP mais estrito e alinhado ao PRD.

---

# 9. Diagramas e Referências

* **Fluxo de Dados:**

```ascii
[Cliente MCP]
      |
      | X-Api-Key: sk_...
      v
[Hono /mcp]
      |
      v
[AuthMiddleware.verifyApiKeyAuthentication]
      |
      v
[AuthenticateApiKeyUseCase]
      |
      +--> [ApiKeySecretProvider.hash]
      |
      +--> [ApiKeysRepository.findByHash]
      |
      v
context.account + auth context
      |
      v
[VerifyUserInsigniaController/ProfileMiddleware]
      |
      v
[McpRouter -> getServer()]
      |
      v
[Mastra MCP HTTP Transport]
      |
      v
[MastraMcp(server).getInput + getAccountId]
      |
      +--> get-challenge-creation-instructions-tool
      |      -> CHALLENGE_CREATION_INSTRUCTIONS
      |
      +--> post-challenge-tool
      |      -> PostChallengeTool
      |      -> PostChallengeUseCase
      |      -> SupabaseChallengesRepository.add
      |      -> InngestBroker.publish(ChallengePostedEvent)
      |
      +--> update-challenge-tool
             -> GetChallengeUseCase
             -> Challenge.isChallengeAuthor
             -> UpdateChallengeUseCase
             -> SupabaseChallengesRepository.replace
      |
      +--> delete-challenge-tool
             -> GetChallengeUseCase
             -> Challenge.isChallengeAuthor
             -> DeleteChallengeUseCase
             -> SupabaseChallengesRepository.remove
      |
      +--> list-challenges-tool
             -> ListChallengesTool
             -> ListChallengesUseCase
             -> SupabaseChallengesRepository.findMany
```

* **Fluxo Cross-app (se aplicável):** **Não aplicável**.
* **Layout (se aplicável):** **Não aplicável**.
* **Referências:**
  - `apps/server/src/app/hono/HonoApp.ts`
  - `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts`
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`
  - `apps/server/src/app/hono/routers/lesson/CodeExplanationRouter.ts`
  - `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`
  - `apps/server/src/rest/controllers/challenging/challenges/VerifyChallengeManagementPermissionController.ts`
  - `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`
  - `apps/server/src/ai/lesson/tools/GetMdxBlocksGuideTool.ts`
  - `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts`
  - `apps/server/src/ai/mastra/MastraMcpServer.ts`
  - `apps/server/src/ai/challenging/tools/ListChallengesTool.ts`
  - `apps/server/src/ai/challenging/tools/DeleteChallengeTool.ts`
  - `apps/server/src/ai/mastra/toolsets/LessonToolset.ts`
  - `packages/core/src/auth/use-cases/CreateApiKeyUseCase.ts`
  - `packages/core/src/challenging/use-cases/PostChallengeUseCase.ts`
  - `packages/core/src/challenging/use-cases/GetChallengeUseCase.ts`
  - `packages/core/src/challenging/use-cases/UpdateChallengeUseCase.ts`
  - `packages/validation/src/modules/challenging/schemas/challengeSchema.ts`
  - `documentation/features/auth/api-keys-manager/prd.md`
  - `documentation/features/auth/api-keys-manager/specs/api-keys-manager-spec.md`
  - `documentation/features/challenging/challenge-creator-agent/specs/get-next-challenge-source-tool-spec.md`

---

# 10. Pendências / Dúvidas

**Sem pendências**.
