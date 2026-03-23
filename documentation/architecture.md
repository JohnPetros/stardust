# Arquitetura do StarDust

## Visão Geral

O StarDust usa uma arquitetura **Hexagonal (Ports and Adapters)** onde o pacote `@stardust/core` atua como núcleo agnóstico a frameworks, e as aplicações (`web`, `server`, `studio`) atuam como adaptadores. É um monorepo gerenciado pelo TurboRepo com frontend em Next.js e backend em Hono/Node.js.

## Apps e Pacotes

- **Web (`apps/web/`)**: Frontend principal em Next.js 15 com React Server Components. UI organizada por domínio seguindo o padrão Widget (View + Hook + Index).
- **Server (`apps/server/`)**: API REST em Hono/Node.js. Processa requisições via Actions (RPC) e jobs assíncronos via Inngest.
- **Studio (`apps/studio/`)**: Aplicação administrativa interna em React Router v7.
- **Core (`packages/core/`)**: Regras de negócio puras com DDD tático. Sem dependência de frameworks. Contém Entities, Structures, Aggregates, Use Cases e Interfaces.
- **Validation (`packages/validation/`)**: Schemas de validação com Zod, compartilhados entre as apps.
- **Email (`packages/email/`)**: Templates de e-mail construidos com React Email para envio de e-mails.
- **LSP (`packages/lsp/`)**: Implementação da Linguagem de Programação Delegua para análise e execução de código.

## Injeção de Dependências

O `@stardust/core` define interfaces (Repositories, Gateways, Jobs). As apps implementam e injetam essas interfaces em runtime — nunca o Core conhece as implementações.

## Fluxo de Dados (resumo)

**RPC**: Route/Controller → Action.execute(call) → Use Case → call.redirect() ou call.json()

**REST**: Service → RestClient (Axios/Fetch) → API externa → RestResponse\<T\>

**Queue**: Event Dispatcher → Inngest → Job.handle(amqp) → Use Case

## Padrões Principais

- **Widget** na UI para separar View (renderização), Hook (lógica/estado) e Index (integração).
- **Action/RPC** para conectar rotas ao domínio sem acoplar o framework ao Core.
- **RestClient** como adapter sobre Axios/Fetch para chamadas HTTP externas.
- **Job** para tarefas assíncronas, agendadas ou falháveis (e-mail, relatórios).
- **Factory Functions** no lugar de `new Class()` para Serviços e Controllers.

## Decisões Arquiteturais

- O Core permanece puro: sem Next.js, Hono ou Axios — apenas interfaces e lógica de domínio.
- Dependências apontam sempre para dentro: Apps importam Core, nunca o contrário.
- TurboRepo garante compartilhamento de código e orquestração de scripts entre as apps.
- TypeScript estrito em todo o projeto para máxima segurança de tipos.

## Armadilhas a Evitar

1. Importar código de Apps dentro do Core.
2. Chamar banco de dados ou APIs diretamente em Use Cases (use interfaces/gateways).
3. Lógica de negócio fora do `core/`.
4. Usar `new Class()` diretamente — prefira Factory Functions.
5. Dependências circulares entre pacotes do monorepo.

## Stack Tecnológica

| Tecnologia | Pacote/Ferramenta | Finalidade |
| :--- | :--- | :--- |
| **Linguagem** | TypeScript 5.8+ | Tipagem estática em todo o projeto |
| **Frontend** | Next.js 15, React 19 | Server Components e UI principal |
| **Backend** | Hono, Node.js | API REST leve e rápida |
| **App Interno** | React Router v7 | Ferramentas administrativas |
| **Banco de Dados** | Supabase (PostgreSQL) | Persistência relacional e BaaS |
| **Fila/Jobs** | Inngest | Background jobs e workflows assíncronos |
| **Estilização** | Tailwind CSS, Radix UI | Utility-first CSS e primitivos acessíveis |
| **Validação** | Zod | Schemas compartilhados entre apps |
| **Monorepo** | TurboRepo, NPM | Orquestração e gerenciamento de dependências |
| **Linter/Formatter** | Biome | Qualidade e padronização de código |
| **Testes** | Jest | Testes unitários e de integração |

## Estrutura de Diretórios

```
stardust/
├── apps/
│   ├── web/
│   ├── server/
│   └── studio/
└── packages/
    ├── core/
    ├── validation/
    ├── email/
    └── lsp/
```