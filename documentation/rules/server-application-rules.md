# Para que serve?

E a aplicacao responsavel por expor as funcionalidades do StarDust Core via HTTP (API) para consumo do Web, Backoffice e outros clientes. Alem de rotas REST, a aplicacao executa tarefas assincronas e workflows baseados em eventos por meio do Inngest, integra com servicos externos (ex.: Supabase, cache, storage, telemetria e provedores de IA) e pode expor endpoints MCP autenticados quando a integracao precisar disponibilizar tools do dominio para clientes externos.

# Desenvolvimento

## Tecnologias e bibliotecas

- Framework HTTP: [Hono](https://hono.dev/) (Node)
- TypeScript runtime (dev): `tsx`
- Background jobs / workflows: [Inngest](https://www.inngest.com/)
- Validacao de dados: [Zod](https://zod.dev/)
- Banco e Auth: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- Chave API do cliente Supabase: `SUPABASE_PUBLISHABLE_KEY`; não configure chave API `secret`/`service_role` no runtime do Server. Operações administrativas de feedback usam PostgreSQL direto somente depois da autorização `God Account`.
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
pnpm install
```

**Execute a aplicacao em modo de desenvolvimento**

```bash
docker compose up -d redis inngest
pnpm run dev
```

> O servidor HTTP inicia, por padrao, em `http://localhost:3333` quando `PORT` nao esta definida. O runtime local do Inngest deve ser iniciado via `docker compose`, fica disponivel em `http://127.0.0.1:8288` e faz discovery em `http://host.docker.internal:3333/inngest`.

## Executando os testes

```bash
pnpm run test
```

> [!NOTE]
> Defina as variaveis de ambiente de desenvolvimento no arquivo `.env.local`.
> Use `apps/server/.env.example` como referencia do que precisa ser preenchido.

## Tooling

- Scripts do workspace `@stardust/server`:
  - Dev (HTTP): `pnpm --filter @stardust/server run dev`
  - Dev (HTTP, alias explicito): `pnpm --filter @stardust/server run dev:server`
  - Inngest local: `docker compose up -d ingest`
  - Build: `pnpm --filter @stardust/server run build`
  - Producao: `pnpm --filter @stardust/server run prod`
  - Qualidade: `pnpm --filter @stardust/server run check:code` (`lint` + `format`)
  - Tipos: `pnpm --filter @stardust/server run check:types`
  - Testes: `pnpm --filter @stardust/server run test:unit`
  - Banco (Supabase CLI): `pnpm --filter @stardust/server run <db:local|db:pull|db:push|db:types>`
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

## Transição aprovada: Drizzle (Issue #602)

A seção Supabase CLI e o uso de Supabase para banco acima descrevem o legado. Na entrega da Issue #602, a persistência usa Drizzle/PostgreSQL e Supabase SDK permanece para Auth. Repositories de negócio são compostos após autenticação/autorização, tanto para usuários quanto para God Account, MCP e jobs. O bootstrap de API key admite somente a consulta interna por hash necessária ao AuthenticateApiKeyUseCase, sem acesso de negócio antes da validação; não restringe PostgreSQL direto apenas ao feedback administrativo.

Os novos scripts e paths estão contratados na Spec. Supabase CLI deixa de ser o runner de migrations. Migrations Drizzle rodam no pipeline, antes da reabertura do tráfego na janela inicial coordenada, nunca no boot. A stack Supabase local continua sendo a origem de PostgreSQL/Auth para testes reais. Portas locais e credenciais seguem AGENTS.md e tooling.md.
