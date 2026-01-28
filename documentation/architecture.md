# Arquitetura do Projeto StarDust

Este documento descreve a arquitetura de software, tecnologias, padrões e convenções adotadas no projeto **StarDust**. Ele serve como guia definitivo para o desenvolvimento, garantindo consistência, escalabilidade e manutenibilidade.

## 1. Visão Geral e Tecnologias

O **StarDust** é uma plataforma educacional para aprendizado de lógica de programação. O sistema é construído sobre uma arquitetura **Monorepo** gerenciada pelo **TurboRepo**, facilitando o compartilhamento de código e a orquestração de scripts entre diferentes aplicações e pacotes.

### Stack Tecnológico

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Gerenciamento** | TurboRepo, NPM | Orquestração do monorepo e dependências. |
| **Frontend (Web)** | Next.js 15, React 19 | Framework React moderno com Server Components. |
| **Estilização** | Tailwind CSS, Radix UI | Utility-first CSS e primitivos de UI acessíveis. |
| **Backend (Server)** | Node.js, Hono | Runtime JavaScript e framework web leve/rápido. |
| **Fila/Jobs** | Inngest | Orquestração de background jobs e workflows. |
| **App Interno (Studio)**| React Router v7 | Aplicação administrativa, migrando para RR v7. |
| **Banco de Dados** | Supabase (PostgreSQL) | Banco de dados relacional e serviços de backend as a service. |
| **Linguagem** | TypeScript 5.8+ | Tipagem estática rigorosa em todo o projeto. |
| **Qualidade** | Biome, Jest | Linter/Formatter de alta performance e framework de testes. |

---

## 2. Estrutura do Projeto

O projeto segue a estrutura padrão de workspaces do TurboRepo:

```
stardust/
├── apps/                  # Aplicações executáveis
│   ├── web/               # Frontend principal (Next.js)
│   ├── server/            # Backend API (Hono/Node)
│   └── studio/            # Ferramentas internas (React Router)
├── packages/              # Bibliotecas compartilhadas
│   ├── core/              # Regras de Negócio e Domínio (DDD)
│   ├── validation/        # Schemas de validação (Zod)
│   ├── email/             # Serviços de Email
│   ├── lsp/               # Language Server Protocol (Lógica)
│   └── typescript-config/ # Configurações base de TS
└── documentation/         # Documentação centralizada
```

---

## 3. Arquitetura do Core (`@stardust/core`)

O coração do sistema reside no pacote `core`. Ele é agnóstico a frameworks (Next.js, Hono, etc.) e encapsula a lógica de negócio pura, seguindo princípios de **Domain-Driven Design (DDD)** tático e **Object Calisthenics**.

### Elementos do Domínio

1.  **Entidade (Entity)**: Objetos com identidade única (`id`) e mutáveis.
    *   *Regra*: Construtor privado, Factory estática `create(dto)`, encapsulamento forte.
2.  **Estrutura (Structure/Value Object)**: Objetos definidos por seus atributos, imutáveis.
    *   *Regra*: Propriedades `readonly`, métodos retornam novas instâncias.
3.  **Agregado (Aggregate)**: Encapsula relações 1:1 entre entidades.
    *   *Regra*: Referencia a `Entity` agregada e mantém consistência.
4.  **Casos de Uso (Use Cases)**: Orquestram a lógica da aplicação.
    *   *Regra*: Método único `execute()`, recebem DTOs, retornam Responses, sem dependência direta de infraestrutura.
5.  **Interfaces**: Contratos para inversão de dependência (Gateways, Repositories).
6.  **Fakers**: Geradores de dados falsos para testes, vivendo junto ao domínio.

---

## 4. Design System e Camada de UI

A interface do usuário (`apps/web`) é organizada por módulos de domínio, mas a construção dos componentes segue o padrão **Widget**.

### O Padrão Widget

Cada componente visual reutilizável é tratado como um **Widget**, composto por três partes fundamentais para separar responsabilidades: Lógica (Hook), Renderização (View) e Integração (Index).

#### Diagrama do Design System (ASCII)

```ascii
+-----------------------------------------------------------------------+
|                        DESIGN SYSTEM (Widget Pattern)                 |
+-----------------------------------------------------------------------+
|                                                                       |
|   1. External Usage                                                   |
|      <WidgetName prop={...} />                                        |
|             |                                                         |
|             v                                                         |
|   +---------------------------+                                       |
|   |       INDEX (.tsx)        |  "O Maestro"                          |
|   | ------------------------- |                                       |
|   | - Ponto de Entrada        |                                       |
|   | - Integra View e Hook     |                                       |
|   | - Não contém lógica       |                                       |
|   +-------------+-------------+                                       |
|                 |                                                     |
|        (Props + Hook Data)                                            |
|                 |                                                     |
|    +------------v------------+      +---------------------------+     |
|    |      VIEW (.tsx)        |      |      HOOK (.ts)           |     |
|    | ----------------------- |      | ------------------------- |     |
|    | - Apenas Renderização   | <--- | - Regras de Interface     |     |
|    | - "Burra" (sem lógica)  |      | - Gestão de Estado        |     |
|    | - Recebe dados via Props|      | - Chamadas de Serviço     |     |
|    | - Dispara eventos da UI |      | - Retorna Data & Handlers |     |
|    +-------------------------+      +---------------------------+     |
|                                                                       |
+-----------------------------------------------------------------------+
```

*   **View**: Componente React puro. Sufixo `View` (ex: `CheckboxView`).
*   **Hook**: Lógica de estado e efeitos. Prefixo `use` (ex: `useCheckbox`).
*   **Index**: Exporta o componente final. Nome do Widget (ex: `Checkbox`).

---

## 5. Padrões e Convenções de Código

### Nomenclatura

*   **Idioma**: Inglês (obrigatório).
*   **CamelCase**: `variables`, `properties`, `functions`, `methods`, `arguments`.
*   **PascalCase**: `Classes`, `Interfaces`, `Types`, `Components`, `FactoryFunctions`.
*   **UpperSnakeCase**: `CONSTANTS`.
*   **Arquivos**: Seguem o nome do objeto exportado (ex: `UserProfileView.tsx`, `useAuth.ts`), exceto constantes (`kebab-case`).

### Boas Práticas

*   **Variáveis Booleanas**: Prefixos `is`, `has`, `can`, `should` (ex: `isVisible`, `hasAccess`).
*   **Coleções**: Plural (ex: `users`, `items`).
*   **Números**: Sufixo `count` (ex: `attemptsCount`) exceto grandezas naturais (`height`, `width`).
*   **Factory Functions**: Em vez de `new Class()`, utilize factories funcionais (funções que retornam objetos) para Serviços e Controllers, favorecendo o paradigma funcional do React/TS moderno.
*   **Barrel Files**: Utilize `index.ts` para agrupar exportações de módulos (exceto pastas de UI/Widgets).

### Testes

*   **Framework**: Jest.
*   **Localização**: Pastas `tests/` próximas ao código fonte (`entities`, `use-cases`, etc.).
*   **Mocks/Fakers**: Utilize sufixos `Mock` e `Faker`. Evite interagir com infraestrutura real nos testes unitários do core.
*   **Comando**: `npm run test` (na raiz ou pacote).

---

## 6. Design System de Comunicação e Integração

Este capítulo detalha os padrões arquiteturais que regem a comunicação entre as diferentes aplicações (`apps`) e pacotes (`packages`) do ecossistema **StarDust**, bem como o fluxo de dados entre as camadas de software.

O objetivo é garantir que o fluxo de informações seja unidirecional, previsível e desacoplado, respeitando os limites arquiteturais estabelecidos pelo Domain-Driven Design (DDD).

### 6.1. Visão Geral da Comunicação

O sistema opera sob uma arquitetura **Hexagonal (Ports and Adapters)**, onde o pacote `@stardust/core` atua como o núcleo agnóstico a frameworks, e as aplicações (`web`, `server`, `studio`) atuam como adaptadores que plugam nesse núcleo.

#### Diagrama de Integração Global (ASCII)

```ascii
+-------------------------------------------------------------+
|                     EXTERNAL WORLD                          |
|  (Browsers, Mobile Apps, 3rd Party APIs, Cron Jobs)         |
+---------------+-----------------------------+---------------+
                |                             |
       HTTP/REST|                    Events/MQ|
                v                             v
+-----------------------------+   +---------------------------+
|      APPS (Adaptadores)     |   |    INFRA (Adaptadores)    |
|                             |   |                           |
|  +-------+    +-------+     |   |  +-------+    +-------+   |
|  |  WEB  |<-->| SERVER|     |   |  |  DB   |    | QUEUE |   |
|  | (Next)|REST| (Hono)|     |   |  | (Pg)  |    | (Ing) |   |
|  +---+---+    +---+---+     |   |  +---+---+    +---+---+   |
|      |            |         |   |      ^            ^       |
+------+------------+---------+   +------+------------+-------+
       |            |                    |            |
       | RPC/Call   | RPC/Call           | Repository | Amqp
       v            v                    v            v
+-------------------------------------------------------------+
|                 CORE PACKAGE (@stardust/core)               |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                 USE CASES (Application)             |   |
|   |    (Orquestração, Regras de Aplicação, Log)         |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|   +--------------------------v--------------------------+   |
|   |                 DOMAIN (Enterprise)                 |   |
|   |    (Entities, Structures, Aggregates, Events)       |   |
|   +-----------------------------------------------------+   |
|                                                             |
+-------------------------------------------------------------+
```

### 6.2. Padrões de Comunicação por Camada

A comunicação interna obedece a regras estritas para manter a integridade do domínio. Abaixo, detalhamos os três principais mecanismos de tráfego de dados.

#### 6.2.1. RPC Layer (Remote Procedure Call)
**Propósito**: Conectar a camada de entrada (Controllers, Routes, Server Components) ao Domínio, sem acoplar o framework ao core.

*   **Onde vive**: Nas aplicações (`apps/web/src/rpc`, `apps/server/src/rpc`).
*   **Padrão**: **Factory Functions** que geram **Actions**.
*   **Interface**: `Call<Request>` (abstrai `Request/Response` do HTTP).

##### Fluxo de Dados RPC
```ascii
[Route/Controller] 
       |
       v
  (Instancia Action via Factory)
       |
       v
[Action.execute(call)]
       | 1. call.getFormData() -> Extrai DTO
       v
[Doamain/Service] -> Executa Use Case ou Método de Domínio
       | 2. Retorna Response
       v
[Action] -> Valida Response (isFailure?)
       | 3. call.redirect() ou call.json()
       v
[Route/Controller] -> Retorna para o cliente
```

#### 6.2.2. REST Layer (HTTP Client)
**Propósito**: Comunicação síncrona entre serviços ou com APIs externas.

*   **Onde vive**: Nas aplicações (`apps/web/src/rest`, etc) e declarado como Interface no Core.
*   **Padrão**: **RestClient** (Wrapper em torno do Axios/Fetch) injetado via Dependência.
*   **Interface**: `RestClient` (definida no Core).

##### Fluxo de Dados REST
```ascii
[Service/Factory Function]
       |
       v
[RestClient.get/post(url, body)]
       |
       +---> [Axios/Fetch Adapter] ---> (HTTP Request) ---> [External API]
                                                                  |
[RestResponse<T>] <--- (HTTP Response) <--------------------------+
       |
       v
[Service] -> Trata erro/sucesso e retorna para quem chamou
```

#### 6.2.3. Queue Layer (Assíncrono)
**Propósito**: Processamento em background, jobs agendados e desacoplamento via eventos.

*   **Onde vive**: Definido no Core (`interfaces/job.ts`) e implementado na Infra (`apps/server/src/queue`).
*   **Padrão**: **Job Class** + **Amqp Protocol**.
*   **Infraestrutura**: Inngest (atualmente).

##### Fluxo de Dados Queue
```ascii
[Event Dispatcher] ---> (Event: "user.created")
                              |
v ----------------------------+ (Async Boundary)
[Queue Provider (Inngest)]
       |
       v
[Job Handler (Class)]
       | 1. Instancia Job(Dependencies)
       v
[Job.handle(amqp)]
       | 2. amqp.getPayload()
       | 3. amqp.run("step_name", () => UseCase.execute())
       v
[Use Case] -> Executa lógica de negócio
```

### 6.3. Contratos e Interfaces (The Core Law)

Para que esse sistema funcione, o `@stardust/core` deve permanecer puro. Ele não conhece Next.js, Hono ou Axios. Ele conhece apenas **Interfaces**.

| Conceito | Responsabilidade | Quem Define (Core) | Quem Implementa (App) |
| :--- | :--- | :--- | :--- |
| **Call** | Abstração de Request/Response | `interface Call<T>` | `RemixCall`, `NextCall`, `HonoCall` |
| **Repository** | Persistência de Dados | `interface UsersRepo` | `SupabaseUsersRepo` |
| **Gateway** | APIs Externas (Pagamento, Email) | `interface Mailer` | `ResendMailer` |
| **Job** | Tarefa em Background | `interface Job<T>` | `SendEmailJob` |

#### Regra de Ouro (Dependency Rule)
As dependências de código fonte só podem apontar para dentro.
*   ❌ Core importa código de Apps/Web.
*   ✅ Apps/Web impota código de Core.
*   ✅ Apps/Web injeta implementações nas interfaces do Core.

### 6.4. Guia de Decisão: Qual padrão usar?

1.  **Preciso responder ao usuário imediatamente?**
    *   Use **RPC (Action)**. Conecta a rota diretamente ao serviço.
    
2.  **Preciso consultar dados de outro microserviço/API?**
    *   Use **REST (RestClient)**. Crie um Service que encapsula a chamada HTTP.

3.  **A tarefa demora mais de 2 segundos ou pode falhar (email, relatório)?**
    *   Use **Queue (Job)**. Dispare um evento ou agende um job.

4.  **Preciso compartilhar lógica entre Web e Mobile?**
    *   Coloque a lógica no **Core** (Use Case ou Domain Service). As apps apenas consomem.
