# Regras da Camada AI

> 💡 **Objetivo**: padronizar a camada `AI` como um **adaptador de aplicacao** (orquestracao + integracao com `LLM`), mantendo **regras de negocio** e **contratos de dominio** no `@stardust/core`.

## Visao geral

### Escopo

- **O que e**: camada de orquestracao de `agents`, `prompts`, `toolsets` e `workflows` para integrar runtimes de `LLM` ao sistema.
- **O que nao e**: uma camada de dominio. Nenhuma regra/validacao de negocio deve morar aqui.

### Responsabilidades

- **Prompts e instrucoes**
  - Definir e centralizar texto/strings (ex: `apps/server/src/ai/constants/agents-instructions.ts`, `apps/web/src/ai/constants/manual-prompts.ts`).
- **Contratos e adaptadores**
  - Implementar `Tool<Input, Output>`.
  - Fornecer adaptadores de `Mcp<Input>` por `runtime` (ex: `apps/server/src/ai/mastra/MastraMcp.ts`, `apps/web/src/ai/vercel/VercelMcp.ts`).
- **Composition root por app**
  - Compor dependencias concretas para ferramentas e fluxos (ex: `RestClient`, `Repository`, `Broker`, `CacheProvider`).
- **Integracao via contratos do core**
  - Integrar com o sistema por interfaces (ex: `ManualWorkflow`, `CreateChallengeWorkflow`).

### Limites (guardrails)

- **Deve conter**: adaptacao (formatos), orquestracao (sequencia de steps) e chamadas a `tools`.
- **Nao deve conter**: regras de negocio; use-cases/entidades/validacoes devem viver no `@stardust/core`.

## Estrutura de diretorios

| Area | Caminho | Papel |
| --- | --- | --- |
| Server AI | `apps/server/src/ai/` | Integracao com runtime Mastra, `toolsets`, `workflows` e ferramentas server-side |
| Web AI | `apps/web/src/ai/` | Integracao com Vercel AI SDK (`ai`), `toolsets`, `workflows` e ferramentas web-side |
| Core (contratos) | `packages/core/src/global/interfaces/ai/` | Interfaces `Tool` e `Mcp` (referencia, nao implementacao) |
| Core (workflows) | `packages/core/src/manual/interfaces/ManualWorkflow.ts` | Contrato de `ManualWorkflow` |
| Core (workflows) | `packages/core/src/challenging/interfaces/CreateChallengeWorkflow.ts` | Contrato de `CreateChallengeWorkflow` |

### Responsabilidade por diretorio

- `constants/`
  - **Deve** conter apenas texto/strings (prompts, descricoes).
  - **Nao deve** instanciar services nem importar infraestrutura.
- `tools/`
  - Implementacoes pequenas e testaveis, com **uma** responsabilidade (um efeito/consulta por `tool`).
- `toolsets/`
  - Encapsulam adaptacao ao `runtime` (Mastra/Vercel) + composicao de dependencias.
- `workflows/`
  - Orquestram steps e definem a sequencia de execucao.

### Convencoes de organizacao e nomeacao

- **Tools**: `VerboSubstantivoTool` (ex: `GetMdxGuideTool`, `PostChallengeTool`).
- **Toolsets**: nome por dominio (ex: `ChallengingToolset`) e exports estaveis.
- **Prompts**: centralizar e exportar via `index.ts` (ex: `apps/server/src/ai/constants/index.ts`, `apps/web/src/ai/constants/index.ts`).

## Principios fundamentais

### Deve conter

- **Contratos claros e tipados**
  - Toda `tool` implementa `Tool<Input, Output>` (ex: `packages/core/src/global/interfaces/ai/Tool.ts`).
  - Todo `runtime` fornece `Mcp<Input>` com `getInput()`.
- **Validacao no boundary**
  - `toolsets` validam entrada/saida no boundary do runtime (ex: `zod` em `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts` e `apps/web/src/ai/vercel/toolsets/*.ts`).
- **Orquestracao no app, dominio no core**
  - `tools` delegam regras de negocio para use-cases/entidades do core (ex: `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`).
- **Limites de execucao**
  - `agents` e `workflows` configuram limites explicitos de iteracoes/steps quando suportado (ex: `stopWhen: stepCountIs(3)` em `apps/web/src/ai/vercel/agents/manualAgents.ts`).

### Nao deve conter

- **Regras de dominio duplicadas**: a camada `AI` adapta formatos e orquestra chamadas; regras de negocio permanecem no core.
- **Acesso direto indevido a infraestrutura (principalmente na Web)**
  - `apps/web/src/ai/**` nao acessa `database`, `queue` ou providers diretamente; usa `RestClient` e services em `apps/web/src/rest/services`.
- **Prompts acoplados a implementacao**
  - Prompts nao dependem de URLs, chaves, IDs internos, ou detalhes de infraestrutura; prompts nao importam codigo executavel.
- **Efeitos colaterais fora de `tools`/`workflows`**
  - Escrita em banco, publicacao de eventos e `IO` externo ficam encapsulados em `tools` acionadas por `workflows`.

> ⚠️ Se voce precisar repetir uma validacao de negocio no prompt para guiar a resposta do modelo, isso **nao substitui** a validacao no core.

## Padroes de projeto

### Tool pattern (core)

- Uma `tool` e um adaptador pequeno e composavel: recebe `Mcp<Input>`, extrai input, chama services/use-cases e retorna output tipado.
- Exemplo real: `apps/web/src/ai/tools/manual/SearchGuidesTool.ts`.

### Composition root via toolset

- `toolsets` sao o ponto onde dependencias concretas sao criadas e conectadas.
- Server/Mastra: `apps/server/src/ai/mastra/toolsets/ChallengingToolset.ts` cria `SupabaseChallengesRepository`, `InngestBroker`, `UpstashCacheProvider`.
- Web/Vercel: `apps/web/src/ai/vercel/toolsets/*.ts` cria `NextServerRestClient()` e services (ex: `ManualService`, `StorageService`, `ChallengingService`).

### Workflow orchestration

- `workflows` encadeiam steps pequenos e substituiveis.
- Exemplo real: `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts` (get problem -> gerar desafio -> persistir).

### Agent/team pattern

- `agents` recebem instrucoes via `constants` e expõem ferramentas explicitamente.
- Exemplos reais: `apps/server/src/ai/mastra/teams/ChallengingTeam.ts`, `apps/web/src/ai/vercel/agents/manualAgents.ts`.

## Padroes de uso aplicados

### Fluxos comuns

1. **Criacao automatica de desafios (server)**
   - **Entrada**: job cron `CreateChallengeJob` em `apps/server/src/queue/jobs/challenging/CreateChallengeJob.ts`.
   - **Orquestracao**: `MastraCreateChallengeWorkflow` em `apps/server/src/ai/mastra/workflows/MastraCreateChallengeWorkflow.ts`.
   - **Persistencia**: `PostChallengeTool` delega para `PostChallengeUseCase` em `apps/server/src/ai/challenging/tools/PostChallengeTool.ts`.
2. **Assistente de manual/conteudo (web)**
   - **Entrada**: rota `POST` em `apps/web/src/app/api/conversation/chats/[chatId]/assistant/route.ts`.
   - **Orquestracao**: `AskAssistantController` + `VercelManualWorkflow` em `apps/web/src/rest/controllers/conversation/AskAssistantController.ts` e `apps/web/src/ai/vercel/workflows/VercelManualWorkflow.ts`.
   - **Ferramentas**: `manualToolset` e `challengingToolset` em `apps/web/src/ai/vercel/toolsets`.

### Exemplo de implementacao correta (tool)

```ts
import type { Tool, Mcp } from '@stardust/core/global/interfaces'

type Input = { query: string }
type Output = string[]

export const ExampleTool = (service: SomeService): Tool<Input, Output> => {
  return {
    async handle(mcp: Mcp<Input>) {
      const { query } = mcp.getInput()
      return await service.search(query)
    },
  }
}
```

### Erros comuns

- `toolset` com logica de negocio: deve apenas compor dependencias e acionar `tool.handle(mcp)`.
- `agent` sem limites: deve configurar `stop conditions`/`step limits` quando suportado pelo runtime.
- Prompt sem restricoes de saida: deve declarar formato, idioma e restricoes de conteudo (ex: `apps/web/src/ai/constants/manual-prompts.ts`).

## Regras de integracao com outras camadas

### Dependencias (permitido vs proibido)

| Regra | Status | Detalhe |
| --- | --- | --- |
| `apps/*/src/ai/**` importa contratos do core | Permitido | `@stardust/core/**` |
| `apps/*/src/ai/**` usa schemas de validacao | Permitido | `@stardust/validation/**` |
| `apps/server/src/ai/**` compoe infra quando necessario | Permitido | `database`/`queue`/providers no server |
| `apps/web/src/ai/**` acessa dados/efeitos via `rest` | Obrigatorio | `RestClient` + services em `apps/web/src/rest/**` |
| `packages/core/**` importa `apps/**` | Proibido | dependency rule |
| `apps/web/src/ai/**` importa `apps/server/**` | Proibido | sem acoplamento cross-app |
| `apps/web/src/ai/**` acessa `apps/server/src/database/**` | Proibido | sem acesso direto a infra server |

### Contratos de comunicacao

- `Tool<Input, Output>` + `Mcp<Input>` em `packages/core/src/global/interfaces/ai/`.
- `CreateChallengeWorkflow` (server) e `ManualWorkflow` (web) definidos no core.

### Direcao de dependencia e acoplamento

- A camada `AI` e um adaptador: depende do core e de infraestrutura local da app.
- Integracoes (routes/jobs/controllers) devem referenciar `workflows`/`tools` por interfaces quando possivel (ex: `CreateChallengeJob` depende de `CreateChallengeWorkflow`).

## Checklist rapido para novas features

### Antes de abrir PR

- A feature usa contratos do core (`Tool`, `ManualWorkflow`, `CreateChallengeWorkflow`) em vez de acoplamento direto ao runtime.
- Entrada/saida do boundary validada com `zod` no `toolset`.
- A `tool` e pequena (uma responsabilidade) e nao contem regra de negocio (delegou para service/use-case do core).
- Dependencias concretas criadas no `composition root` (toolset/controller/job), nao dentro do core.
- `agent`/`workflow` com limites de execucao (steps/iteracoes) e caminho de erro previsivel.

### Criterios minimos de conformidade

- Web: `tools` acessam dados apenas via `RestClient`/services (sem acesso direto a `DB`/`queue`).
- Server: escrita em `DB`/eventos passa por use-cases do core ou interfaces do core.

### Sinais de alerta

- Prompt exige IDs internos/segredos para funcionar.
- `toolset` instancia dependencias que deveriam ser injetadas por um `composition root` superior (ex: rota/job).
- `agent` faz loops de `tools` sem limite.
- Duplicacao de regra de negocio no prompt/`tool`.

## Observacoes e pendencias

### Premissas

- A camada `AI` e implementada como adaptadores em duas stacks: Mastra no server e Vercel AI SDK na web.

### Lacunas de documentacao

- Configuracao de credenciais/modelos (ex: chaves do provedor OpenAI/Google) nao esta descrita.
- Estrategia de observabilidade (logs/metrics/tracing) para chamadas de `LLM` nao esta descrita.

### Proximos passos

- Definir convencoes de teste para `tools`/`workflows` e exemplos de `mocks` de `Mcp`.
- Documentar limites de custo/latencia e politicas de fallback por runtime (Mastra/Vercel).
