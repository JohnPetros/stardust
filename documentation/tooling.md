# Tooling

Este documento consolida comandos e rotinas de desenvolvimento no monorepo.

> 💡 Regra geral: prefira rodar scripts na raiz para aproveitar Turbo e cache.

## Padroes de Qualidade

- Lint/format: Biome (via scripts `lint`, `format`, `codecheck`).
- Typecheck: TypeScript (`tsc`).
- Testes: Jest para suites unitarias/composicao e Playwright para fluxos reais de navegador quando a app web expuser suites em `apps/web/src/app/tests/**`.

## Comandos Globais (na raiz)

```bash
npm run codecheck
npm run typecheck
npm run test
```

## Comandos por Workspace

```bash
npm run dev -w <workspace>
npm run build -w <workspace>
npm run codecheck -w <workspace>
npm run typecheck -w <workspace>
npm run test -w <workspace>
```

Para a app web, a suite de integracao com navegador fica disponivel separadamente:

```bash
npm run test:integration -w @stardust/web
npm run test:integration:ui -w @stardust/web
npm run test:integration:debug -w @stardust/web
npm run test:integration:install -w @stardust/web
```

Notas para a suite Playwright da web:

- `apps/web/.env.testing` deve conter apenas URLs e tokens fake/locais suficientes para satisfazer `CLIENT_ENV` e `SERVER_ENV`.
- Nunca versione segredos reais no arquivo `.env.testing`.
- Durante a suite, `NEXT_PUBLIC_STARDUST_SERVER_URL` deve apontar para o backend fake test-only da propria app web (`/api/tests/server`).

Workspaces comuns:

- `@stardust/web`
- `@stardust/studio`
- `@stardust/server`

## Server (API + Queue)

```bash
npm run dev -w @stardust/server
npm run dev:queue -w @stardust/server
```

## Database (workspace `@stardust/server`)

```bash
npm run db:local -w @stardust/server
npm run db:dev -w @stardust/server
npm run db:prod -w @stardust/server
npm run db:sync -w @stardust/server
npm run db:migrate -w @stardust/server
npm run db:pull -w @stardust/server
npm run db:push -w @stardust/server
npm run db:types -w @stardust/server
```

Notas:
- A fonte de verdade da Supabase CLI do server é `apps/server/supabase/`.
- Em produção, as migrations devem rodar no workflow de deploy antes do release da aplicação.

## Hooks

- Husky e commitlint sao usados na raiz (ver `package.json`).
