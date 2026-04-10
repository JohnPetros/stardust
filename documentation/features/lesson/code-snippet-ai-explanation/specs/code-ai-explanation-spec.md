---
title: Explicacao de Blocos de Codigo por IA na Lesson Page
prd: https://github.com/JohnPetros/stardust/milestone/25
issue: https://github.com/JohnPetros/stardust/issues/382
apps: server, web, studio
status: em_progresso
last_updated_at: 2026-04-07
---

# 1. Objetivo

Adicionar suporte de explicacao por IA aos blocos de codigo da Lesson Page no app `web`, com botao dedicado no `CodeSnippet`, dialog de explicacao em duas colunas, controle de uso diario no `server` via Upstash e cache local persistente apenas para blocos da `Story`. A implementacao deve reutilizar os contratos de `lesson`, seguir o padrao Hono + REST + Mastra ja existente no projeto e manter compatibilidade de compilacao no `studio` ao expandir o contrato compartilhado de `LessonService`.

---

# 2. Escopo

## 2.1 In-scope

* Exibir botao de IA no `CodeSnippet` quando o widget for usado pela Lesson Page.
* Permitir explicacao em blocos de codigo da `Story` e do `Quiz` no `web`.
* Persistir cache local apenas para blocos da `Story`, usando `lesson:code-explanation:{chunkIndex}`.
* Consultar saldo diario sob demanda via `GET /lesson/code-explanation/remaining-uses`.
* Gerar explicacao via `POST /lesson/code-explanation` no `server`.
* Limitar o uso a 10 geracoes novas por dia por usuario autenticado.
* Resetar o contador no fim do dia em UTC do servidor, usando o padrao ja existente de `Datetime().getEndOfDay()`.
* Implementar workflow Mastra, tool de IA, controllers REST e rotas Hono necessarios para a feature.
* Expandir o contrato compartilhado de `LessonService` e adaptar a implementacao correspondente do `studio` para manter typecheck valido.

## 2.2 Out-of-scope

* Expor o botao de IA fora da Lesson Page.
* Expor a funcionalidade na UI do `studio`.
* Persistir historico de explicacoes geradas.
* Criar configuracao de limite por plano, perfil ou feature flag.
* Alterar o contrato atual de rewarding.
* Explicar respostas montadas pelo usuario em questoes drag-and-drop.
* Introduzir timezone por usuario para o reset do contador.

---

# 3. Requisitos

## 3.1 Funcionais

* O `CodeSnippet` deve exibir um botao de IA ao lado das acoes existentes quando receber sinalizacao explicita da Lesson Page.
* Em `Story`, ao clicar no botao, o widget deve verificar primeiro o cache local por `chunkIndex`; em cache HIT, o dialog abre sem request e sem consumir saldo.
* Em `Quiz`, o botao deve existir, mas nao deve persistir cache local entre aberturas da pagina.
* Em cache MISS da `Story` ou em qualquer uso no `Quiz`, o `web` deve consultar o saldo atual antes de abrir o aviso de consumo.
* Se `remainingUses = 0`, o `web` deve abrir aviso de bloqueio e impedir a geracao.
* Se `remainingUses > 0`, o `web` deve abrir aviso de consumo e so gerar apos confirmacao.
* O `server` deve derivar o usuario a partir da autenticacao da request; o `userId` nao deve ser enviado pelo `web` no body do POST.
* O `server` deve retornar `{ remainingUses: number }` no endpoint de consulta.
* O `server` deve retornar `{ explanation: string }` no endpoint de geracao quando houver saldo.
* O `server` deve retornar HTTP `403` quando o saldo estiver esgotado no momento da geracao.
* O `server` deve decrementar o saldo apenas apos geracao bem-sucedida da explicacao.
* O `server` deve considerar chave ausente no cache como saldo cheio (`10`).
* O `web` deve salvar/substituir a explicacao no cache local da `Story` apos geracao bem-sucedida, incluindo `Retry`.
* O `web` deve manter `remainingUses` apenas em estado local de interface a partir do `GET /lesson/code-explanation/remaining-uses`, sem depender do POST para esse valor.
* Quando o dialog tiver sido aberto a partir de cache HIT da `Story`, o primeiro `Retry` deve buscar o saldo atual antes de exibir o aviso de consumo.
* Em `Retry`, se o POST retornar `403`, o dialog de explicacao deve fechar e o aviso de bloqueio deve ser exibido.

## 3.2 Nao funcionais

* **Seguranca:** o controle de saldo deve usar o usuario autenticado obtido no `server`; o body do POST nao pode definir identidade de consumo.
* **Compatibilidade retroativa:** a feature deve ser opt-in no `CodeSnippet`; usos fora da Lesson Page devem manter o comportamento atual.
* **Observabilidade funcional:** requests de consulta e geracao devem usar contratos REST tipados via `LessonService`, preservando `RestResponse` no cliente.
* **Resiliencia:** falhas do workflow de IA nao devem decrementar saldo nem persistir explicacao parcial no cache local.
* **Acessibilidade:** o botao de IA, o `AlertDialog` de aviso/bloqueio e o dialog de explicacao devem ser acionaveis por teclado e manter foco previsivel.
* **Latencia percebida:** em cache HIT da `Story`, a abertura do dialog deve ocorrer sem roundtrip ao `server`.

---

# 4. O que ja existe?

## Core

* **`ExplainCodeWorkflow`** (`packages/core/src/lesson/interfaces/ExplainCodeWokflow.ts`) - contrato existente para executar explicacao de codigo via workflow, ainda nao exportado pelo barrel de `lesson/interfaces`.
* **`LessonService`** (`packages/core/src/lesson/interfaces/LessonService.ts`) - contrato REST compartilhado entre apps para operacoes de lesson; hoje ainda nao contem endpoints de explicacao por IA.
* **`Story`** (`packages/core/src/lesson/domain/structures/Story.ts`) - estrutura que transforma a narrativa em `chunks[]` e fornece o indice usado no fluxo da `Story`.
* **`Tool`** (`packages/core/src/global/interfaces/ai/Tool.ts`) - interface base para tools de IA no core.
* **`Mcp`** (`packages/core/src/global/interfaces/ai/Mcp.ts`) - contrato de entrada usado pelas tools de IA.
* **`CacheProvider`** (`packages/core/src/global/interfaces/provision/CacheProvider.ts`) - contrato compartilhado para leitura/escrita no cache com suporte a `expiresAt`.
* **`IncrementAssistantChatMessageCountUseCase`** (`packages/core/src/conversation/use-cases/IncrementAssistantChatMessageCountUseCase.ts`) - referencia concreta de contador diario em cache com reset no fim do dia.

## Validation

* **`textBlockSchema`** (`packages/validation/src/modules/lesson/schemas/textBlockSchema.ts`) - schema compartilhado de blocos de texto, incluindo `type: 'code'` e `isRunnable`.

## Server AI

* **`MastraCreateChallengeWorkflow`** (`apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`) - referencia de workflow Mastra com `createWorkflow`, `createStep` e `commit()`.
* **`ChallengingToolset`** (`apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts`) - referencia de composition root para tools Mastra no `server`.
* **`AGENTS_INSTRUCTIONS`** (`apps/server/src/ai/constants/agents-instructions.ts`) - centraliza instrucoes textuais usadas na camada AI.
* **`TOOLS_DESCRIPTIONS`** (`apps/server/src/ai/constants/tools-descriptions.ts`) - centraliza descricoes das tools usadas pelo Mastra.
* **`MastraMcp`** (`apps/server/src/ai/mastra/MastraMcp.ts`) - adapter que conecta input do workflow/toolset ao contrato `Mcp<Input>` do core.

## Server REST / Hono / Provision

* **`LessonRouter`** (`apps/server/src/app/hono/routers/lesson/LessonRouter.ts`) - roteador agregador do modulo `lesson` no Hono.
* **`TextBlocksRouter`** (`apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`) - referencia concreta de rota Hono com `verifyAuthentication`, `ValidationMiddleware` e controller REST.
* **`FetchTextBlocksController`** (`apps/server/src/rest/controllers/lesson/FetchTextBlocksController.ts`) - referencia de controller REST em `lesson` usando repository e `HonoHttp`.
* **`HonoHttp`** (`apps/server/src/app/hono/HonoHttp.ts`) - adapter HTTP que transforma `RestResponse` em `Response` real no Hono.
* **`UpstashCacheProvider`** (`apps/server/src/provision/cache/UpstashCacheProvider.ts`) - provider atual de cache com `get`, `set`, `delete` e suporte a expiracao por data.

## Web UI / REST

* **`CodeSnippet`** (`apps/web/src/ui/global/widgets/components/CodeSnippet/index.tsx`) - entry point do widget de bloco de codigo, hoje sem integracao com lesson ou IA.
* **`useCodeSnippet`** (`apps/web/src/ui/global/widgets/components/CodeSnippet/useCodeSnippet.ts`) - hook atual com copy, reload, run e calculo de altura do editor.
* **`CodeSnippetView`** (`apps/web/src/ui/global/widgets/components/CodeSnippet/CodeSnippetView.tsx`) - view atual da toolbar e do editor.
* **`Mdx`** (`apps/web/src/ui/global/widgets/components/Mdx/index.tsx`) - widget que transforma MDX da `Story` em componentes React.
* **`MdxView`** (`apps/web/src/ui/global/widgets/components/Mdx/MdxView.tsx`) - ponto em que o override do componente `Code` e conectado ao pipeline MDX.
* **`CodeView`** (`apps/web/src/ui/global/widgets/components/Mdx/Code/CodeView.tsx`) - converte o bloco MDX para `CodeSnippet`.
* **`StoryStageView`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`) - renderiza `story.readChunks` e e o melhor ponto para propagar `chunkIndex` ate o `CodeSnippet`.
* **`StoryChunk`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/index.tsx`) - encapsula cada chunk lido da narrativa.
* **`SelectionQuestion`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/SelectionQuestion/index.tsx`) - usa `CodeSnippet` para questoes com codigo no quiz.
* **`CheckboxQuestion`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/CheckboxQuestion/index.tsx`) - usa `CodeSnippet` para questoes com codigo no quiz.
* **`OpenQuestion`** (`apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/OpenQuestion/index.tsx`) - usa `CodeSnippet` para questoes abertas com codigo no quiz.
* **`AlertDialog`** (`apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`) - componente acessivel ja usado na Lesson Page para avisos e bloqueios.
* **`Dialog`** (`apps/web/src/ui/global/widgets/components/Dialog/index.tsx`) - base para o dialog de explicacao.
* **`LessonService`** (`apps/web/src/rest/services/LessonService.ts`) - adapter REST que consome `/lesson/**` a partir do `web`.
* **`useLocalStorage`** (`apps/web/src/ui/global/hooks/useLocalStorage.ts`) - helper atual para persistencia no browser.
* **`STORAGE`** (`apps/web/src/constants/storage.ts`) - centraliza chaves de `localStorage` no `web`.
* **`RestContextProvider`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - injeta `lessonService` em widgets client-side via contexto.

## Studio REST

* **`LessonService`** (`apps/studio/src/rest/services/LessonService.ts`) - segunda implementacao do contrato compartilhado de lesson; sera impactada se o contrato for expandido.

---

# 5. O que deve ser criado?

## Camada Core (Use Cases)

* **Localizacao:** `packages/core/src/lesson/use-cases/GetRemainingCodeExplanationUsesUseCase.ts` - **novo arquivo**
  **Dependencias:** `CacheProvider`
  **Dados de request:** `userId: string`
  **Dados de response:** `remainingUses: number`
  **Metodos:** `execute(request: { userId: string }): Promise<{ remainingUses: number }>` - le o contador atual no cache, aplica o fallback de `10` quando a chave nao existir e retorna o saldo sem criar a chave.

* **Localizacao:** `packages/core/src/lesson/use-cases/RegisterCodeExplanationUsageUseCase.ts` - **novo arquivo**
  **Dependencias:** `CacheProvider`
  **Dados de request:** `userId: string`
  **Dados de response:** `remainingUses: number`
  **Metodos:** `execute(request: { userId: string }): Promise<{ remainingUses: number }>` - valida o saldo diario, decrementa o contador apenas apos confirmacao de geracao bem-sucedida pela borda REST e grava a expiracao para o fim do dia em UTC do servidor.

## Camada Core (Errors)

* **Localizacao:** `packages/core/src/lesson/domain/errors/CodeExplanationLimitExceededError.ts` - **novo arquivo**
  **Props:** sem props adicionais alem da mensagem padrao
  **Responsabilidade:** representar a regra de negocio de limite diario esgotado para traducao explicita em HTTP `403` na borda REST.

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/lesson/schemas/codeExplanationSchema.ts` - **novo arquivo**
  **Atributos:**
  `explainCodeRequestSchema` valida `code: string` usando a mesma regra minima de conteudo adotada pelo projeto.
  `remainingCodeExplanationUsesSchema` valida `remainingUses: number` inteiro entre `0` e `10`.
  `codeExplanationResponseSchema` valida `explanation: string`.

## Camada AI (Teams)

* **Localizacao:** `apps/server/src/ai/mastra/teams/LessonTeam.ts` - **novo arquivo**
  **Dependencias:** `EXPLAIN_CODE_INSTRUCTION`, modelo configurado com a mesma familia usada em `ChallengingTeam`
  **Metodos:** `static get codeExplainerAgent(): Agent` - expoe um agent Mastra especializado em explicar codigo em pt-BR com saida estruturada `{ explanation: string }`.

## Camada AI (Workflows)

* **Localizacao:** `apps/server/src/ai/mastra/workflows/MastraExplainCodeWorkflow.ts` - **novo arquivo**
  **Dependencias:** `LessonTeam`
  **Entrada/Saida:** entrada `code: string`; saida `string`
  **Metodos:** `run(code: string): Promise<string>` - executa um workflow Mastra de um passo usando `LessonTeam.codeExplainerAgent` como step estruturado e retorna a string final de explicacao.

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/lesson/FetchRemainingCodeExplanationUsesController.ts` - **novo arquivo**
  **Dependencias:** `CacheProvider`
  **Dados de request:** usuario autenticado obtido via `http.getAccountId()`
  **Dados de response:** `remainingUses: number`
  **Metodos:** `handle(http: Http): Promise<RestResponse>` - executa `GetRemainingCodeExplanationUsesUseCase` e responde com JSON tipado.

* **Localizacao:** `apps/server/src/rest/controllers/lesson/ExplainCodeController.ts` - **novo arquivo**
  **Dependencias:** `CacheProvider`, `ExplainCodeWorkflow`
  **Dados de request:** usuario autenticado obtido via `http.getAccountId()`, body `{ code: string }`
  **Dados de response:** `explanation: string`
  **Metodos:** `handle(http: Http<{ body: { code: string } }>): Promise<RestResponse>` - valida saldo atual, executa `MastraExplainCodeWorkflow` diretamente, registra o consumo apenas em sucesso via `RegisterCodeExplanationUsageUseCase`, traduz `CodeExplanationLimitExceededError` para `HTTP 403` e retorna a explicacao em sucesso.

## Camada Hono App (Routes)

* **Localizacao:** `apps/server/src/app/hono/routers/lesson/CodeExplanationRouter.ts` - **novo arquivo**
  **Middlewares:** `AuthMiddleware.verifyAuthentication`, `ValidationMiddleware.validate('json', explainCodeRequestSchema)` no POST
  **Caminho da rota:** `/lesson/code-explanation` e `/lesson/code-explanation/remaining-uses`
  **Dados de schema:** `explainCodeRequestSchema`, `remainingCodeExplanationUsesSchema`, `codeExplanationResponseSchema`

## Camada UI (Widgets)

* **Localizacao:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/index.tsx` - **novo arquivo**
  **Props:** `isOpen`, `code`, `explanation`, `isLoading`, `onRetry`, `onClose`
  **Estados (Client Component):** `Loading` mostra painel de explicacao com estado de carregamento; `Error` nao se aplica como estado proprio do widget, pois erros bloqueantes sao tratados no alert dialog; `Empty` nao renderiza conteudo quando fechado; `Content` exibe codigo e explicacao lado a lado.
  **View:** `CodeExplanationDialogView` em `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/CodeExplanationDialogView.tsx`
  **Hook:** `useCodeExplanationDialog` em `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/useCodeExplanationDialog.ts`
  **Index:** usa `Dialog`, `PlaygroundCodeEditor` ou `CodeEditor` em modo leitura e callbacks recebidos do `CodeSnippet`
  **Widgets internos:** Nao aplicavel

* **Localizacao:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/index.tsx` - **novo arquivo**
  **Props:** `isOpen`, `mode`, `remainingUses`, `isLoading`, `onConfirm`, `onClose`
  **Estados (Client Component):** `Loading` desabilita a acao principal durante confirmacao; `Error` nao se aplica como estado proprio do widget; `Empty` nao renderiza conteudo quando fechado; `Content` exibe aviso de consumo ou bloqueio conforme `mode`.
  **View:** `CodeExplanationAlertDialogView` em `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/CodeExplanationAlertDialogView.tsx`
  **Hook:** `useCodeExplanationAlertDialog` em `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/useCodeExplanationAlertDialog.ts`
  **Index:** usa `AlertDialog` global e callbacks recebidos do `CodeSnippet`
  **Widgets internos:** Nao aplicavel
  **Estrutura de pastas:**
  `apps/web/src/ui/global/widgets/components/CodeSnippet/`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/index.tsx`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/CodeExplanationDialogView.tsx`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/useCodeExplanationDialog.ts`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/index.tsx`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/CodeExplanationAlertDialogView.tsx`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/useCodeExplanationAlertDialog.ts`

---

# 6. O que deve ser modificado?

## Core

* **Arquivo:** `packages/core/src/lesson/interfaces/LessonService.ts`
  **Mudanca:** adicionar `fetchRemainingCodeExplanationUses(): Promise<RestResponse<{ remainingUses: number }>>` e `explainCode(code: string): Promise<RestResponse<{ explanation: string }>>`.
  **Justificativa:** manter o contrato REST de `lesson` como ponto unico de consumo para os endpoints do modulo.
  **Camada:** `rest`

* **Arquivo:** `packages/core/src/lesson/interfaces/index.ts`
  **Mudanca:** exportar `ExplainCodeWorkflow` pelo barrel de interfaces de `lesson`.
  **Justificativa:** permitir consumo consistente do contrato pelo `server` sem import direto por caminho interno.
  **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/use-cases/index.ts`
  **Mudanca:** exportar `GetRemainingCodeExplanationUsesUseCase` e `RegisterCodeExplanationUsageUseCase`.
  **Justificativa:** expor os novos casos de uso pelo barrel publico do modulo.
  **Camada:** `core`

* **Arquivo:** `packages/core/src/lesson/domain/errors/index.ts`
  **Mudanca:** exportar `CodeExplanationLimitExceededError`.
  **Justificativa:** padronizar o acesso ao novo erro de negocio via barrel do modulo.
  **Camada:** `core`

## Validation

* **Arquivo:** `packages/validation/src/modules/lesson/schemas/index.ts`
  **Mudanca:** exportar os schemas de explicacao de codigo.
  **Justificativa:** disponibilizar os novos contratos de validacao para o `server` e futuros consumidores.
  **Camada:** `rest`

## Server AI

* **Arquivo:** `apps/server/src/ai/constants/agents-instructions.ts`
  **Mudanca:** exportar a constante nomeada `EXPLAIN_CODE_INSTRUCTION` e, se necessario para manter o padrao do arquivo, agrega-la ao objeto `AGENTS_INSTRUCTIONS`.
  **Justificativa:** centralizar a instrucao do modelo no mesmo ponto ja adotado por `challenging`, preservando um contrato explicito para o novo agent.
  **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/teams/index.ts` - **novo arquivo**
  **Mudanca:** exportar `LessonTeam` pelo barrel de teams.
  **Justificativa:** alinhar a organizacao da camada AI ao novo fluxo de lesson baseado em agent.
  **Camada:** `ai`

* **Arquivo:** `apps/server/src/ai/mastra/workflows/index.ts`
  **Mudanca:** exportar `MastraExplainCodeWorkflow`.
  **Justificativa:** permitir injecao consistente do workflow na borda REST.
  **Camada:** `ai`

## Server REST / Hono

* **Arquivo:** `apps/server/src/rest/controllers/lesson/index.ts`
  **Mudanca:** exportar `FetchRemainingCodeExplanationUsesController` e `ExplainCodeController`.
  **Justificativa:** manter o barrel de controllers de `lesson` completo.
  **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/lesson/LessonRouter.ts`
  **Mudanca:** registrar `CodeExplanationRouter` junto das rotas ja existentes de `lesson`.
  **Justificativa:** manter a feature dentro do modulo REST ja exposto em `/lesson`.
  **Camada:** `rest`

## Web REST

* **Arquivo:** `apps/web/src/rest/services/LessonService.ts`
  **Mudanca:** implementar os novos metodos do contrato, chamando `GET /lesson/code-explanation/remaining-uses` e `POST /lesson/code-explanation`.
  **Justificativa:** permitir que o `CodeSnippet` client-side consuma a feature via `RestContext` sem criar novo adapter paralelo.
  **Camada:** `rest`

## Studio REST

* **Arquivo:** `apps/studio/src/rest/services/LessonService.ts`
  **Mudanca:** implementar os novos metodos adicionados ao contrato compartilhado de `LessonService`, mantendo o adapter compativel mesmo sem expor a feature na UI.
  **Justificativa:** evitar quebra de typecheck em `studio` ao expandir o contrato compartilhado do modulo `lesson`.
  **Camada:** `rest`

## Web UI

* **Arquivo:** `apps/web/src/constants/storage.ts`
  **Mudanca:** adicionar uma factory de chave para `lesson:code-explanation:{chunkIndex}`.
  **Justificativa:** evitar chave hardcoded no widget e manter o padrao centralizado de `localStorage`.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/index.tsx` - **novo arquivo**
  **Mudanca:** criar widget interno responsavel por renderizar o dialog principal de explicacao em duas colunas.
  **Justificativa:** isolar a composicao visual e os contratos do dialog fora do `CodeSnippetView`, conforme a regra definida para esta feature.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/CodeExplanationDialogView.tsx` - **novo arquivo**
  **Mudanca:** criar a view do dialog de explicacao com cabecalho, acao de `Retry`, painel de codigo e painel de explicacao.
  **Justificativa:** separar apresentacao da logica do widget interno.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationDialog/useCodeExplanationDialog.ts` - **novo arquivo**
  **Mudanca:** criar hook do widget interno para tratar estados visuais derivados do dialog de explicacao.
  **Justificativa:** manter o padrao de widget `index/view/hook` usado no projeto.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/index.tsx` - **novo arquivo**
  **Mudanca:** criar widget interno responsavel pelos avisos de consumo e bloqueio.
  **Justificativa:** desacoplar a logica de confirmacao/bloqueio do dialog principal de explicacao.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/CodeExplanationAlertDialogView.tsx` - **novo arquivo**
  **Mudanca:** criar a view do `AlertDialog` para os estados `confirm` e `blocked`.
  **Justificativa:** separar a apresentacao da logica do widget interno.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeExplanationAlertDialog/useCodeExplanationAlertDialog.ts` - **novo arquivo**
  **Mudanca:** criar hook do widget interno para derivar titulo, descricao e labels dos botoes conforme o estado do aviso.
  **Justificativa:** manter o padrao de widget `index/view/hook` usado no projeto.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/index.tsx`
  **Mudanca:** adicionar prop opt-in da feature da lesson, resolver `lessonService` via `useRestContext()` no entry point e repassar as dependencias para o hook.
  **Justificativa:** manter a integracao com REST no entry point do widget, preservando o padrao de UI do projeto.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/useCodeSnippet.ts`
  **Mudanca:** incorporar o estado local da explicacao, cache da `Story`, consulta de saldo, fluxo de confirmacao, bloqueio e retry, mantendo `remainingUses` sincronizado pelo `GET` e decrementando-o localmente apos POST bem-sucedido.
  **Justificativa:** concentrar a logica de interface da feature no hook do proprio widget sem criar store global nova.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/CodeSnippet/CodeSnippetView.tsx`
  **Mudanca:** renderizar o botao de IA quando habilitado e compor os widgets internos `CodeExplanationDialog` e `CodeExplanationAlertDialog`.
  **Justificativa:** manter `CodeSnippetView` como casca de composicao do widget, delegando dialogs complexos para widgets internos dedicados.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/index.tsx`
  **Mudanca:** aceitar props opcionais a serem propagadas para o `CodeSnippet` quando o MDX estiver sendo renderizado pela `Story` da lesson.
  **Justificativa:** permitir que o `chunkIndex` da `Story` alcance o bloco de codigo sem quebrar os outros usos do widget `Mdx`.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/MdxView.tsx`
  **Mudanca:** repassar a configuracao da lesson ao override do componente `Code`.
  **Justificativa:** manter a propagacao de contexto no ponto em que o MDX e convertido em componentes React.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/global/widgets/components/Mdx/Code/CodeView.tsx`
  **Mudanca:** encaminhar a configuracao da lesson para `CodeSnippet`.
  **Justificativa:** conectar a cadeia `Story -> Mdx -> CodeSnippet` sem acoplar a camada global a detalhes do `server`.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`
  **Mudanca:** propagar o `chunkIndex` do `map(story.readChunks)` para cada `StoryChunk`.
  **Justificativa:** o cache local da `Story` depende do indice do chunk lido.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/index.tsx`
  **Mudanca:** aceitar `chunkIndex` como prop e repassa-lo para a view.
  **Justificativa:** manter o widget como ponte entre a stage e o MDX do chunk.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryChunk/StoryChunkView.tsx`
  **Mudanca:** passar a configuracao `lessonCodeExplanation={{ source: 'story', chunkIndex }}` para `Mdx`.
  **Justificativa:** habilitar cache local apenas na `Story` sem alterar o conteudo MDX persistido.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/SelectionQuestion/index.tsx`
  **Mudanca:** passar `lessonCodeExplanation={{ source: 'quiz' }}` ao `CodeSnippet`.
  **Justificativa:** habilitar o botao de IA no quiz sem cache persistente.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/CheckboxQuestion/index.tsx`
  **Mudanca:** passar `lessonCodeExplanation={{ source: 'quiz' }}` ao `CodeSnippet`.
  **Justificativa:** manter o mesmo comportamento para questoes checkbox com codigo.
  **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/lesson/widgets/pages/Lesson/QuizStage/OpenQuestion/index.tsx`
  **Mudanca:** passar `lessonCodeExplanation={{ source: 'quiz' }}` ao `CodeSnippet`.
  **Justificativa:** manter o mesmo comportamento para questoes abertas com codigo.
  **Camada:** `ui`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao:** expandir o contrato existente de `LessonService` em vez de criar um service paralelo so para explicacao de codigo.
  **Alternativas consideradas:** criar `CodeExplanationService` separado apenas para `web`; usar API route local do Next em vez do adapter REST do modulo `lesson`.
  **Motivo da escolha:** o modulo ja possui `LessonService` como ponto unico de consumo REST em `web` e `studio`, e a feature pertence ao mesmo bounded context.
  **Impactos / trade-offs:** o `studio` precisa adaptar seu adapter para manter typecheck, mesmo sem expor a feature na interface.

* **Decisao:** derivar `userId` no `server` a partir de `http.getAccountId()`.
  **Alternativas consideradas:** enviar `userId` no body do POST conforme rascunho do issue.
  **Motivo da escolha:** segue o padrao atual de autenticacao do Hono e evita spoofing do usuario que consome o saldo.
  **Impactos / trade-offs:** o contrato REST fica ligeiramente diferente do rascunho inicial do issue, mas mais aderente a seguranca e aos adapters existentes.

* **Decisao:** retornar `HTTP 403` explicitamente na controller quando o limite diario estiver esgotado.
  **Alternativas consideradas:** lancar `NotAllowedError`; reutilizar `AuthError` ou `ConflictError`.
  **Motivo da escolha:** `HonoApp` hoje traduz `NotAllowedError` para `405`, portanto a controller precisa devolver `RestResponse` com status `403` para preservar o contrato exigido pelo PRD.
  **Impactos / trade-offs:** a traducao do erro fica localizada na borda REST desta feature, em vez de depender do handler global atual.

* **Decisao:** nao usar workflow de IA dentro de use case do core.
  **Alternativas consideradas:** encapsular geracao e decremento no mesmo use case do core.
  **Motivo da escolha:** segue a regra arquitetural definida para esta feature: controllers REST executam workflows diretamente, e use cases do core permanecem responsaveis apenas por regras de dominio e controle de saldo.
  **Impactos / trade-offs:** a orquestracao da geracao fica mais concentrada na borda REST, com menos encapsulamento em um unico use case.

* **Decisao:** usar um `LessonTeam.codeExplainerAgent` como step do workflow, sem `ExplainCodeTool` dedicada.
  **Alternativas consideradas:** criar `ExplainCodeTool` e `LessonToolset` para encapsular a chamada ao LLM.
  **Motivo da escolha:** reduz camadas desnecessarias para um fluxo de um unico prompt e fica mais alinhado ao uso nativo de agent como step do Mastra.
  **Impactos / trade-offs:** a customizacao futura via tools especializadas fica menos preparada, mas a implementacao atual fica menor e mais direta.

* **Decisao:** persistir cache local apenas na `Story`.
  **Alternativas consideradas:** cachear tambem no `Quiz`; criar chave posicional especifica para o quiz.
  **Motivo da escolha:** decisao validada com produto durante a elaboracao da spec; o `Quiz` nao possui `chunkIndex` e nao deve persistir explicacao entre sessoes.
  **Impactos / trade-offs:** o usuario pode regenerar a mesma explicacao do `Quiz` em novas aberturas da pagina, consumindo saldo novamente.

* **Decisao:** em cache HIT da `Story`, buscar saldo no primeiro `Retry` se o dialog nao tiver `remainingUses` em memoria.
  **Alternativas consideradas:** persistir `remainingUses` junto do cache local; omitir o valor `N` no aviso.
  **Motivo da escolha:** decisao validada com produto durante a elaboracao da spec e evita alterar o payload persistido no browser.
  **Impactos / trade-offs:** o primeiro retry apos abrir de cache faz um GET extra antes da confirmacao.

* **Decisao:** manter a feature como opt-in no `CodeSnippet` via prop de contexto da lesson.
  **Alternativas consideradas:** habilitar o botao globalmente em todos os usos do `CodeSnippet`; criar um widget de codigo totalmente separado para lesson.
  **Motivo da escolha:** reduz risco de regressao em `playground`, `challenging`, MDX global e respostas do assistant.
  **Impactos / trade-offs:** exige encadear a prop pela cadeia `StoryStage -> StoryChunk -> Mdx -> CodeView -> CodeSnippet`.

* **Decisao:** usar fim do dia em UTC do servidor para o reset diario.
  **Alternativas consideradas:** timezone do usuario.
  **Motivo da escolha:** o core ja possui `Datetime().getEndOfDay()` em UTC e nao ha timezone de usuario disponivel nesse fluxo.
  **Impactos / trade-offs:** o conceito de “dia” segue UTC do servidor, nao o fuso local do aluno.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
StoryStage/QuizQuestion
  -> CodeSnippet (lessonCodeExplanation)

[Story cache HIT]
  -> localStorage['lesson:code-explanation:{chunkIndex}']
  -> abre Dialog de explicacao
  -> Retry sem remainingUses em memoria
     -> GET /lesson/code-explanation/remaining-uses

[Story cache MISS ou Quiz]
  -> GET /lesson/code-explanation/remaining-uses
  -> FetchRemainingCodeExplanationUsesController
  -> GetRemainingCodeExplanationUsesUseCase
  -> CacheProvider.get(...)
  -> { remainingUses }

[remainingUses = 0]
  -> AlertDialog de bloqueio

[remainingUses > 0]
  -> AlertDialog de aviso
  -> POST /lesson/code-explanation { code }
  -> ExplainCodeController
  -> valida saldo atual
  -> MastraExplainCodeWorkflow
  -> LessonTeam.codeExplainerAgent
  -> LLM
  -> RegisterCodeExplanationUsageUseCase
  -> CacheProvider.set(..., expiresAt=endOfDayUtc)
  -> { explanation }
  -> Story: salva localStorage['lesson:code-explanation:{chunkIndex}']
  -> UI decrementa remainingUses em memoria
  -> Quiz: mantem apenas estado em memoria
  -> abre/atualiza Dialog de explicacao
```

* **Fluxo Cross-app:**

```text
apps/web
  CodeSnippet
    -> LessonService (RestContext)
    -> REST

apps/server
  Hono /lesson/code-explanation/*
    -> REST Controllers
    -> Core Use Cases de saldo
    -> UpstashCacheProvider
    -> MastraExplainCodeWorkflow
    -> OpenAI/LLM

packages/core
  ExplainCodeWorkflow
  LessonService
  GetRemainingCodeExplanationUsesUseCase
  RegisterCodeExplanationUsageUseCase

apps/studio
  LessonService adapter
    -> apenas compatibilidade de contrato
```

* **Layout:**

```text
CodeSnippet toolbar
+--------------------------------------------------------------+
| [IA] [Resetar?] [Copiar?] [Executar?]                        |
+--------------------------------------------------------------+
| editor de codigo                                             |
+--------------------------------------------------------------+

Dialog de explicacao
+-------------------------------------------------------------------+
| Header: Explicacao do codigo                         [Retry] [X]   |
+--------------------------------+----------------------------------+
| Codigo (somente leitura)       | Explicacao gerada pela IA        |
| CodeEditor / PlaygroundEditor  | texto rolavel em pt-BR           |
+--------------------------------+----------------------------------+
```

* **Referencias:**
  `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`
  `apps/server/src/ai/mastra/teams/ChallengingTeam.ts`
  `apps/server/src/provision/cache/UpstashCacheProvider.ts`
  `packages/core/src/conversation/use-cases/IncrementAssistantChatMessageCountUseCase.ts`
  `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`
  `apps/server/src/rest/controllers/lesson/FetchTextBlocksController.ts`
  `apps/web/src/ui/global/widgets/components/CodeSnippet/index.tsx`
  `apps/web/src/ui/global/widgets/components/Mdx/MdxView.tsx`
  `apps/web/src/ui/global/widgets/components/CodeEditorToolbar/GuidesDialog/GuidesDialogView.tsx`
  `apps/web/src/ui/lesson/widgets/pages/Lesson/StoryStage/StoryStageView.tsx`

---

# 10. Pendencias / Duvidas

**Sem pendencias**.
