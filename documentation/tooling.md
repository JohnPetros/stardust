# Tooling

Este documento consolida comandos e rotinas de desenvolvimento no monorepo.

> 💡 Regra geral: prefira rodar scripts na raiz para aproveitar Turbo e cache.

## Padroes de Qualidade

- Lint/format: Biome (via scripts `lint`, `format`, `codecheck`).
- Typecheck: TypeScript (`tsc`).
- Testes: Jest para suites unitarias/composicao e Playwright para fluxos reais de navegador quando a app web expuser suites em `apps/web/src/app/tests/**`.
- Quality gate: catraca de metricas em `scripts/quality-gate/` (ver secao abaixo).

## Quality Gate (catraca de metricas)

Catraca que congela metricas de qualidade por workspace e falha o PR se alguma piorar. So permite empatar ou melhorar — nunca regredir.

Metricas congeladas:

- **Biome warnings**: diagnostics `warn` que o `lint` (com `--diagnostic-level=error`) nao mostra.
- **Escape hatches de tipo**: ocorrencias de `any`, `as any`, `@ts-ignore`, `@ts-expect-error` em codigo de producao.
- **Tamanho de arquivo**: arquivos acima de 300 linhas (offenders congelados; nenhum novo pode cruzar o limite nem crescer).
- **Cobertura por camada** (so onde `measureCoverage` esta ativo): `lines`/`branches` por camada arquitetural, via `coverage-summary.json` do Jest.

Workspaces cobertos (`scripts/quality-gate/config.ts`):

- **`@stardust/core`** (Fase 1): todas as metricas, com cobertura por camada DDD (`domain`, `use-cases`, `factories`, `other`).
- **`@stardust/server`** (Fase 2): metricas estaticas + cobertura. A cobertura roda so a suite unitaria (mocks, sem Supabase) via `coverageJestArgs`, ignorando os testes de rota (`src/tests/routes`) e de integracao (routers). Por isso so ratcheia as camadas que os testes unitarios exercem — `ai`, `queue`, `rest` (e `other`); `app`, `database` e `provision` ficam fora (so cobertas por integracao). O `Database.ts` gerado pelo `db:types` e excluido via `isIgnored`.
- **`@stardust/web`** (Fase 3): so metricas estaticas. Cobertura desabilitada (suite unitaria roda em jsdom e depende de env de teste). O `isIgnored` exclui o `Database.ts` gerado e o `src/mocks/` (conteudo/seed de licoes, dado autoral e nao logica).
- **`@stardust/studio`** (Fase 4): so metricas estaticas. Cobertura desabilitada (poucos testes, so de UI — baixo sinal). O `isIgnored` exclui `src/ui/shadcn/` (primitivos de UI vendorizados).

Comandos:

```bash
# Verificar o PR contra o baseline (usado no CI; sai com codigo 1 se piorar)
npm run quality-gate -- --workspace=core
npm run quality-gate -- --workspace=server
npm run quality-gate -- --workspace=web
npm run quality-gate -- --workspace=studio

# Recongelar o baseline (apos refatoracao que melhora as metricas)
npm run quality-gate -- --workspace=core --update-baseline
```

O baseline fica em `scripts/quality-gate/baselines/<workspace>.json` e e versionado. Cada CI roda o gate apenas para o seu workspace, comenta o sumario no `GITHUB_STEP_SUMMARY` e bloqueia o `build` se houver regressao.

## Comandos Globais (na raiz)

```bash
npm run codecheck
npm run typecheck
npm run test:unit
```

> `npm run test` na raiz e um alias de `test:unit` (roda apenas os testes unitarios via Turbo).

## Comandos por Workspace

```bash
npm run dev -w <workspace>
npm run build -w <workspace>
npm run codecheck -w <workspace>
npm run typecheck -w <workspace>
npm run test:unit -w <workspace>
```

> Cada workspace expoe `test:unit` (Jest) e, quando aplicavel, `test:integration`.
> Nos workspaces nao existe mais um script `test` generico — use `test:unit`.

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
