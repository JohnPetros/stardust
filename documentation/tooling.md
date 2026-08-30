# Tooling

Execute os comandos a partir da raiz para aproveitar o Turbo e o cache. Durante
a implementação, use `--filter` ou `-w` para limitar o feedback ao workspace
alterado; antes do PR, valide o escopo integrado.

Os scripts auxiliares do projeto são módulos ES e devem ser executados com
Node.js:

```bash
node ./scripts/setup-project.mjs
node ./scripts/create-worktree.mjs feature/exemplo
node ./scripts/sync-agents.mjs
```

O script `setup-project.mjs` configura as skills, os comandos e a configuração
MCP do projeto. Os scripts de exportação de ambiente imprimem atribuições para
o shell atual; carregue-as com `eval`:

```bash
eval "$(node ./scripts/export-studio-app-e2e-env.mjs)"
eval "$(node ./scripts/export-web-app-e2e-env.mjs)"
```

## Scripts de qualidade

| Script | Ferramenta | Comportamento |
| --- | --- | --- |
| `npm run format` | Biome | formata e escreve arquivos |
| `npm run check:code` | Biome | lint/check read-only |
| `npm run check:types` | TypeScript | typecheck sem emissão |
| `npm run check:architecture` | dependency-cruiser | valida dependências entre camadas/apps |
| `npm run test:unit` | Jest/Vitest | executa testes unitários por workspace |
| `npm run test:integration` | Jest/Playwright | executa as integrações declaradas pelos workspaces |

Exemplos de ciclo curto:

```bash
npm run format -- --filter=@stardust/core
npm run check:code -- --filter=@stardust/core
npm run check:types -- --filter=@stardust/core
npm run test:unit -- --filter=@stardust/core
```

Os limites do dependency-cruiser ficam em `.dependency-cruiser.cjs`. Altere essa
configuração somente para representar limites legítimos, nunca para ocultar uma
regressão.

## Scripts por workspace

As descrições abaixo refletem os scripts declarados nos `package.json` atuais.
Use `npm run <script> -w <workspace>` para executar um script de um workspace a
partir da raiz.

### Raiz (`stardust`)

| Script | Descrição |
| --- | --- |
| `setup` | Executa `scripts/setup-project.mjs` para configurar skills, comandos e MCP. |
| `prepare` | Inicializa os hooks do Husky após a instalação das dependências. |
| `dev` | Inicia os processos de desenvolvimento definidos pelos workspaces via Turbo. |
| `prod` | Inicia os processos de produção definidos pelos workspaces via Turbo. |
| `build` | Compila os workspaces e substitui imports de pacotes pelos caminhos de build. |
| `build:server` | Compila o Server sem cache e substitui os imports de pacotes. |
| `build:studio` | Compila apenas o Studio. |
| `build:web` | Compila apenas a Web App. |
| `build:core` | Compila apenas o pacote Core. |
| `format` | Formata os arquivos dos workspaces via Turbo. |
| `check:code` | Executa as verificações Biome dos workspaces via Turbo. |
| `check:types` | Executa os typechecks dos workspaces via Turbo. |
| `check:architecture` | Verifica as dependências entre camadas com dependency-cruiser. |
| `test` | Alias para `test:unit`. |
| `test:unit` | Executa os testes unitários dos workspaces via Turbo. |
| `test:integration` | Executa os testes de integração declarados pelos workspaces via Turbo. |
| `test:server` | Executa os testes unitários do `@stardust/server`. |
| `test:studio` | Executa os testes unitários do `@stardust/studio`. |
| `test:web` | Executa os testes unitários do `@stardust/web`. |
| `test:core` | Executa os testes unitários do `@stardust/core`. |

### `apps/server`

| Script | Descrição |
| --- | --- |
| `dev` | Inicia a API em modo watch com `.env.development`. |
| `lint` | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format` | Formata `src` e grava as alterações. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |
| `check:updates` | Lista atualizações de dependências com npm-check-updates. |
| `build` | Compila o Server com tsup. |
| `prod` | Inicia o build do Server usando `.env`. |
| `db:test` | Inicia os serviços Supabase necessários e reinicia o banco local de testes. |
| `db:migrate` | Gera uma migration com `supabase db diff`, usando `npm_config_schema_file`. |
| `db:prod` | Vincula a CLI Supabase ao projeto de produção. |
| `db:dev` | Vincula a CLI Supabase ao projeto de desenvolvimento. |
| `db:pull` | Baixa os schemas Auth, Public, Storage e Realtime. |
| `db:push` | Aplica migrations ao projeto Supabase vinculado. |
| `db:types` | Gera os tipos TypeScript do banco de desenvolvimento. |
| `db:revert` | Marca uma migration como revertida, usando `npm_config_migration_id`. |
| `update` | Atualiza uma dependência específica com npm-check-updates, usando `npm_config_dep_name`. |
| `test:unit` | Executa os testes unitários do projeto Server. |
| `test:integration` | Executa os testes de integração do Server. |

Exemplos de comandos de banco:

```bash
npm run db:dev -w @stardust/server
npm run db:migrate -w @stardust/server --schema-file=nome_da_tabela
npm run db:revert -w @stardust/server --migration-id=20240101000000
npm run update -w @stardust/server --dep-name=nome-do-pacote
```

Os comandos `db:prod`, `db:push` e `db:revert` alteram estado externo ou o
histórico de migrations. Confirme o projeto e os parâmetros antes de executá-
los.

### `apps/studio`

| Script | Descrição |
| --- | --- |
| `dev` | Inicia o servidor de desenvolvimento do Studio na porta `8000`. |
| `build` | Gera o build do Studio com React Router. |
| `start` | Serve o arquivo estático do Studio a partir de `build/client`. |
| `lint` | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format` | Formata `src` e grava as alterações. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `check:types` | Gera os tipos do React Router e executa o TypeScript. |
| `test:unit` | Executa os testes unitários do Studio. |
| `test:unit:watch` | Executa os testes unitários do Studio em modo watch. |

### `apps/web`

| Script | Descrição |
| --- | --- |
| `dev` | Inicia a Web App em desenvolvimento na porta `3000`. |
| `queue` | Inicia o Inngest CLI local apontando para `/api/serverless`. |
| `build` | Gera o build de produção da Web App com Next.js. |
| `start` | Inicia o build standalone usando a porta definida em `PORT`. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |
| `lint` | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format` | Formata `src` e grava as alterações. |
| `db:types` | Gera os tipos TypeScript do banco usado pela Web App. |
| `test:unit` | Executa os testes unitários da Web App. |
| `test:unit:watch` | Executa os testes unitários da Web App em modo watch. |
| `test:integration` | Executa os testes Playwright com a configuração de integração. |
| `test:integration:ui` | Abre a interface do Playwright para os testes de integração. |
| `test:integration:debug` | Executa os testes Playwright em modo de depuração. |
| `test:integration:install` | Instala o navegador Chromium usado pela integração. |

### `packages/core`

| Script | Descrição |
| --- | --- |
| `build` | Compila o pacote Core com tsup. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `lint` | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format` | Formata `src` e grava as alterações. |
| `test:unit` | Executa os testes unitários do Core. |

### `packages/email`

| Script | Descrição |
| --- | --- |
| `dev` | Inicia o editor de emails na porta `3001`. |
| `build` | Exporta os templates de email para `build`. |
| `format` | Formata os templates e partials. |
| `check:code` | Verifica templates e partials com Biome. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |

### `packages/lsp`

| Script | Descrição |
| --- | --- |
| `build` | Compila o pacote LSP com tsup. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `lint` | Executa o lint dos arquivos TypeScript de `src`. |
| `format` | Formata os arquivos TypeScript de `src`. |
| `test:unit` | Executa os testes Node do LSP com o carregador tsx. |

### `packages/validation`

| Script | Descrição |
| --- | --- |
| `build` | Compila o pacote Validation com tsup. |
| `check:types` | Executa o TypeScript sem emitir arquivos. |
| `check:code` | Verifica `src` com Biome, sem aplicar correções. |
| `lint` | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format` | Formata `src` e grava as alterações. |

### `packages/typescript-config`

Este pacote não declara scripts próprios; ele fornece configurações TypeScript
compartilhadas para os demais workspaces.

## Testes de integração

Os testes de integração da Web App usam Playwright, o ambiente
`apps/web/.env.testing` e o servidor de testes iniciado pela configuração da
suíte. Não aponte esse fluxo para produção nem use as credenciais reais do
Studio:

```bash
npm --workspace @stardust/web run test:integration:install
npm --workspace @stardust/web run test:integration
npm --workspace @stardust/web run test:integration:debug
```

Para uma inspeção manual autenticada, inicie a API e a Web App em terminais
separados, carregue o ambiente local com o script correspondente e valide uma
rota protegida além da tela de login. Credenciais devem permanecer em
`.env.development` e nunca ser registradas no repositório ou nos logs.

## Ordem recomendada

1. `format`, `check:code`, `check:types` e `test:unit` durante o ciclo curto.
2. `check:architecture` quando a estrutura/imports estabilizarem.
3. `test:integration` para mudanças de integração ou antes da conclusão quando
   declarado na Spec.
4. Validação manual no navegador para mudanças de frontend, UI ou rotas
   client-side.
5. Preflight local com todos os sensores aplicáveis antes do PR.
6. Checks no CI, incluindo `check:architecture`, integração e os checks
   aplicáveis do preflight.
7. Build no CI, depois dos checks aplicáveis.

Os checks do PR são a composição dos checks normais. Não existe baseline ou
quality ratchet próprio.

`check:dead-code` não faz parte dos sensores oficiais. Playwright MCP pode
inspecionar fluxos reais e o Hermes pode executar validações E2E de release, mas
nenhum dos dois substitui `test:integration` automatizado quando ele for
aplicável. Os workflows E2E do GitHub Actions estão descritos em
`documentation/infrastructure.md`.
