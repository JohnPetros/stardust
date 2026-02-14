# Para que serve?

E a aplicacao responsavel por expor as funcionalidades do StarDust Core via HTTP (API) para consumo do Web, Studio e outros clientes. Alem de rotas REST, a aplicacao executa tarefas assincronas e workflows baseados em eventos por meio do Inngest, e integra com servicos externos (ex.: Supabase, cache, storage, telemetria e provedores de IA).

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
npm run dev
```

> O servidor HTTP inicia, por padrao, na porta definida em `PORT` (ex.: http://localhost:3333). O dev server do Inngest tambem e iniciado pelo script.

## Executando os testes

```bash
npm run test
```

> [!NOTE]
> Defina as variaveis de ambiente de desenvolvimento no arquivo `.env.development`.
> Use `apps/server/.env.example` como referencia do que precisa ser preenchido.

## Tooling

- Scripts do workspace `@stardust/server`:
  - Dev (server + Inngest): `npm run dev -w @stardust/server`
  - Dev (apenas HTTP): `npm run dev:server -w @stardust/server`
  - Dev (apenas Inngest local): `npm run dev:queue -w @stardust/server`
  - Build: `npm run build -w @stardust/server`
  - Producao: `npm run prod -w @stardust/server`
  - Qualidade: `npm run codecheck -w @stardust/server` (`lint` + `format`)
  - Tipos: `npm run typecheck -w @stardust/server`
  - Testes: `npm run test -w @stardust/server`
  - Banco (Supabase CLI): `npm run db:local|db:pull|db:push|db:types -w @stardust/server`
- Referencia geral: `documentation/tooling.md`.

## Estruturacao de pastas

```
Server
├─ src
│  ├─ ai
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
