# Tooling e Scripts do Monorepo

Este documento descreve os scripts `package.json` do projeto **StarDust**, como eles se conectam no monorepo e quando usar cada comando.

## Stack de Tooling

- **Monorepo orchestration:** TurboRepo (`turbo`)
- **Package manager/workspaces:** NPM Workspaces (`npm@10.9.3`)
- **Linguagem e tipagem:** TypeScript (`tsc`)
- **Lint e formatação:** Biome
- **Testes:** Jest
- **Build de libs/apps TS:** `tsup`
- **Banco local/migrações/tipagem:** Supabase CLI
- **Fila/Jobs local:** Inngest CLI
- **Atualização de dependências:** `npm-check-updates` (`ncu`)

## Convenções gerais de scripts

O monorepo segue um padrão consistente em quase todos os workspaces:

- `build`: gera artefatos de produção.
- `typecheck`: valida tipos TypeScript sem emitir arquivos.
- `lint`: executa análise estática com Biome.
- `format`: aplica formatação com Biome.
- `codecheck`: normalmente `lint + format`.
- `test`: executa suíte de testes.

## Scripts da raiz (`/package.json`)

Scripts da raiz orquestram múltiplos workspaces com Turbo:

- `npm run dev` -> `turbo dev`
  - Sobe ambientes de desenvolvimento dos pacotes/apps que tiverem pipeline `dev`.
- `npm run prod` -> `turbo prod`
  - Executa pipeline de produção definida no Turbo.
- `npm run build:server` -> `turbo build --filter=@stardust/server --no-cache && /bin/sh ./scripts/replace-packages-imports.sh`
  - Build focado no servidor + pós-processamento de imports.
- `npm run build:web` -> `turbo build --filter=@stardust/web`
- `npm run build:studio` -> `turbo build --filter=@stardust/studio`
- `npm run lint` -> `turbo lint`
- `npm run test` -> `turbo test`
- `npm run typecheck` -> `turbo typecheck`
- `npm run codecheck` -> `turbo codecheck`
- `npm run release` -> `./scripts/release.sh`
- `npm run changelog` -> `./scripts/update-changelog.sh`

## Scripts por workspace

### `apps/server` (`@stardust/server`)

**Desenvolvimento e execução**

- `npm run dev:server`: inicia API com `tsx watch` usando `.env.development`.
- `npm run dev:queue`: inicia Inngest CLI local apontando para `/inngest` da API.
- `npm run dev`: executa `dev:server` e `dev:queue` em paralelo.
- `npm run prod`: executa build gerado com `node --env-file .env build/main.js`.

**Qualidade e build**

- `npm run build`: build com `tsup`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run lint`: Biome em `src` com nível de erro.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.
- `npm run test`: Jest.

**Banco de dados (Supabase CLI)**

- `npm run db:local`: inicia stack local Supabase.
- `npm run db:migrate`: gera diff de migração (`$npm_schema_file`).
- `npm run db:sync`: aplica migrações pendentes.
- `npm run db:dev`: linka projeto Supabase de desenvolvimento.
- `npm run db:prod`: linka projeto Supabase de produção.
- `npm run db:pull`: baixa schema remoto.
- `npm run db:push`: envia mudanças locais de schema.
- `npm run db:revert`: marca migração como revertida (`$npm_config_migration_id`).
- `npm run db:types`: gera tipos TypeScript do banco em `src/database/supabase/types/Database.ts`.

**Dependências**

- `npm run check-updates`: lista atualizações com `ncu`.
- `npm run update --dep_name=<nome>`: atualiza dependência específica via `ncu -u -f`.

### `apps/web` (`@stardust/web`)

- `npm run dev`: `next dev`.
- `npm run queue`: Inngest CLI local apontando para `/api/serverless`.
- `npm run build`: `next build`.
- `npm run start`: inicia modo standalone (`.next/standalone/apps/web/server.js`).
- `npm run typecheck`: `tsc --noEmit`.
- `npm run lint`: Biome em `src`.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.
- `npm run db:types`: gera tipos Supabase em `src/api/supabase/types/Database.ts`.
- `npm run test`: Jest.
- `npm run test:watch`: Jest em watch mode.

### `apps/studio` (`@stardust/studio`)

- `npm run dev`: `react-router dev --port 8000`.
- `npm run build`: build da aplicação com React Router.
- `npm run start`: serve build estático (`serve -s ./build/client/index.html`).
- `npm run typecheck`: `react-router typegen && tsc`.
- `npm run lint`: Biome em `src`.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.
- `npm run test`: Jest.
- `npm run test:watch`: Jest em watch mode.

### `packages/core` (`@stardust/core`)

- `npm run build`: build da lib com `tsup`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run lint`: Biome em `src`.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.
- `npm run test`: Jest.

### `packages/validation` (`@stardust/validation`)

- `npm run build`: build com `tsup`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run lint`: Biome em `src`.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.

### `packages/lsp` (`@stardust/lsp`)

- `npm run build`: build com `tsup`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run lint`: Biome em `src`.
- `npm run format`: Biome format em `src`.
- `npm run codecheck`: `lint` + `format`.

### `packages/email` (`@stardust/email`)

- `npm run dev`: sobe ambiente de preview com React Email (`email dev --port 3001`).
- `npm run build`: exporta templates para `./build`.
- `npm run typecheck`: `tsc --noEmit`.

### `packages/typescript-config` (`@stardust/typescript-config`)

Este pacote atualmente **não define scripts**; ele funciona como pacote de configuração compartilhada.

## Comandos recomendados por cenário

### Desenvolvimento diário

- Full monorepo: `npm run dev` (na raiz).
- Backend: `npm run dev -w @stardust/server`.
- Frontend web: `npm run dev -w @stardust/web`.
- Studio: `npm run dev -w @stardust/studio`.

### Qualidade de código

- Tudo via Turbo: `npm run codecheck` (raiz).
- Workspace específico: `npm run codecheck -w @stardust/server` (exemplo).
- Apenas tipagem geral: `npm run typecheck` (raiz).

### Build e validação de entrega

- Build global via Turbo (pipeline): `npm run build:web`, `npm run build:studio` ou `npm run build:server`.
- Build de pacote isolado: `npm run build -w @stardust/core`.
- Testes globais: `npm run test` (raiz).

## Variáveis e parâmetros usados em scripts

- `PORT`: usado no `start` da web.
- `$npm_schema_file`: nome/arquivo da migração no `db:migrate` (server).
- `$npm_config_migration_id`: id de migração em `db:revert` (server).
- `$npm_config_dep_name`: nome da dependência em `update` (server).

## Observações importantes

- O projeto exige **Node >= 22**.
- O gerenciador padronizado é **npm 10.9.3**.
- Scripts de banco no server assumem Supabase CLI instalado/configurado.
- Os scripts de Inngest (`dev:queue` e `queue`) usam `npx inngest-cli@latest`, sem dependência fixa no lockfile do workspace.
