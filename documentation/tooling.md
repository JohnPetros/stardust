# Tooling

Este documento consolida comandos e rotinas de desenvolvimento no monorepo.

> 💡 Regra geral: prefira rodar scripts na raiz para aproveitar Turbo e cache.

## Padroes de Qualidade

- Lint/format: Biome (via scripts `lint`, `format`, `codecheck`).
- Typecheck: TypeScript (`tsc`).
- Testes: Jest.

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
npm run db:sync -w @stardust/server
npm run db:migrate -w @stardust/server
npm run db:pull -w @stardust/server
npm run db:push -w @stardust/server
npm run db:types -w @stardust/server
```

## Hooks

- Husky e commitlint sao usados na raiz (ver `package.json`).
