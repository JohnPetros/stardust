# Para que serve?

E a aplicacao responsavel por expor as funcionalidades do StarDust Core via HTTP (API) para consumo do Web, Studio e outros clientes. Alem de rotas REST, a aplicacao executa tarefas assincronas e workflows baseados em eventos por meio do Inngest, integra com servicos externos (ex.: Supabase, cache, storage, telemetria e provedores de IA) e pode expor endpoints MCP autenticados quando a integracao precisar disponibilizar tools do dominio para clientes externos.

# Desenvolvimento

## Tecnologias e bibliotecas

- Framework HTTP: [Hono](https://hono.dev/) (Node)
- TypeScript runtime (dev): `tsx`
- Background jobs / workflows: [Inngest](https://www.inngest.com/)
- Validacao de dados: [Zod](https://zod.dev/)
- Banco e Auth: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- Cache / vetor: Upstash (Redis / Vector)
- Telemetria: Sentry (`@sentry/node`)
- IA: Vercel AI SDK (`ai`) e Mastra
- HTTP client: Axios
- Qualidade: Biome (lint/format)
- Testes: Jest
- Build: `tsup`

> Para mais detalhes sobre as dependencias e versoes, consulte o arquivo [package.json](https://github.com/JohnPetros/stardust/blob/main/apps/server/package.json).

## Executando a aplicacao

**Navegue ate a pagina da aplicacao server**

```bash
cd ./stardust/apps/server
```

**Instale as dependencias**

```bash
npm install
```

**Execute a aplicacao em modo de desenvolvimento**

```bash
docker compose up -d redis inngest
npm run dev
```

> O servidor HTTP inicia, por padrao, em `http://localhost:3333` quando `PORT` nao esta definida. O runtime local do Inngest deve ser iniciado via `docker compose`, fica disponivel em `http://127.0.0.1:8288` e faz discovery em `http://host.docker.internal:3333/inngest`.

## Executando os testes

```bash
npm run test
```

> [!NOTE]
> Defina as variaveis de ambiente de desenvolvimento no arquivo `.env.development`.
> Use `apps/server/.env.example` como referencia do que precisa ser preenchido.

## Tooling

- Scripts do workspace `@stardust/server`:
  - Dev (HTTP): `npm run dev -w @stardust/server`
  - Dev (HTTP, alias explicito): `npm run dev:server -w @stardust/server`
  - Inngest local: `docker compose up -d ingest`
  - Build: `npm run build -w @stardust/server`
  - Producao: `npm run prod -w @stardust/server`
  - Qualidade: `npm run codecheck -w @stardust/server` (`lint` + `format`)
  - Tipos: `npm run typecheck -w @stardust/server`
  - Testes: `npm run test:unit -w @stardust/server`
  - Banco (Supabase CLI): `npm run db:local|db:pull|db:push|db:types -w @stardust/server`
- Referencia geral: `documentation/tooling.md`.

## Supabase CLI

- A configuracao da CLI fica em `apps/server/supabase/config.toml`.
- Migrations SQL ficam em `apps/server/supabase/migrations`.
- O deploy de producao deve aplicar migrations no pipeline antes do release da app, nao no boot do servidor.

## Estruturacao de pastas

```
Server
├─ src
│  ├─ ai
│  │  └─ mastra
│  │     └─ toolkits
│  ├─ app
│  │  └─ hono
│  │     ├─ middlewares
│  │     ├─ routers
│  │     └─ types
│  ├─ constants
│  ├─ database
│  │  └─ supabase
│  ├─ provision
│  ├─ queue
│  │  └─ inngest
│  ├─ rest
│  └─ main.ts
└─ supabase
```

## Convencoes relevantes da app

- Endpoints MCP HTTP devem ficar em `src/app/hono/routers/mcp`.
- A autenticacao e autorizacao do MCP devem acontecer na borda da app antes da execucao das tools.
- Toolkits MCP devem viver em `src/ai/mastra/toolkits` e concentrar schemas Zod e composicao de dependencias concretas.
- Tools MCP devem delegar regra de negocio para `use cases` e entidades do `@stardust/core`.
