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
eval "$(node ./scripts/export-backoffice-app-e2e-env.mjs)"
eval "$(node ./scripts/export-web-app-e2e-env.mjs)"
```

## Scripts de qualidade

| Script                       | Ferramenta         | Comportamento                                      |
| --- | --- | --- |
| `npm run format`             | Biome              | formata e escreve arquivos                         |
| `npm run check:code`         | Biome              | lint/check read-only                               |
| `npm run check:types`        | TypeScript         | typecheck sem emissão                              |
| `npm run check:architecture` | dependency-cruiser | valida dependências entre camadas/apps             |
| `npm run check:complexity`   | CodeMultiVitals    | falha quando a complexidade ou a qualidade piora em relação ao baseline |
| `npm run test:unit`          | Jest/Vitest        | executa testes unitários por workspace             |
| `npm run test:integration`   | Jest/Playwright    | executa as integrações declaradas pelos workspaces |
| `npm run check:spec-implementation` | Node.js       | valida o mapa `Path | Change | ...` da Spec contra Git e filesystem |

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

O check de complexidade usa `.code-multivitals.json` para os limites e um
baseline compartilhado em `.code-multivitals-baseline.json`. O CI executa o
check no escopo principal de cada app ou pacote (`apps/server`, `apps/web`,
`apps/backoffice` e `packages/core`), tolerando a dívida existente e bloqueando
novas violações. Para atualizar o baseline, execute:

```bash
npm run update:complexity-baseline
```

A atualização deve ser feita somente quando a mudança de complexidade for
intencional e estiver revisada. A detecção de clones fica desabilitada no
ratchet atual para evitar ruído e custo desproporcional no monorepo; o gate é
centrado nas métricas por função.

## Scripts por workspace

As descrições abaixo refletem os scripts declarados nos `package.json` atuais.
Use `npm run <script> -w <workspace>` para executar um script de um workspace a
partir da raiz.

### Raiz (`stardust`)

| Script               | Descrição                                                                                           |
| --- | --- |
| `setup`              | Executa `scripts/setup-project.mjs` para configurar skills, comandos e MCP.                         |
| `prepare`            | Inicializa os hooks do Husky após a instalação das dependências.                                    |
| `dev`                | Inicia os processos de desenvolvimento definidos pelos workspaces via Turbo.                        |
| `prod`               | Inicia os processos de produção definidos pelos workspaces via Turbo.                               |
| `build`              | Compila os workspaces e substitui imports de pacotes pelos caminhos de build.                       |
| `build:server`       | Compila o Server sem cache e substitui os imports de pacotes.                                       |
| `build:backoffice`       | Compila apenas o Backoffice.                                                                            |
| `dev:backoffice` | Inicia o painel administrativo em `http://localhost:8000`. |
| `dev:studio` | Inicia o editor local de animações, preferindo a porta `3030`. |
| `build:studio` | Compila o player de animações do pacote `@stardust/studio`. |
| `build:web`          | Compila apenas a Web App.                                                                           |
| `build:core`         | Compila apenas o pacote Core.                                                                       |
| `format`             | Formata os arquivos dos workspaces via Turbo.                                                       |
| `check:code`         | Executa as verificações Biome dos workspaces via Turbo.                                             |
| `check:types`        | Executa os typechecks dos workspaces via Turbo.                                                     |
| `check:architecture` | Verifica as dependências entre camadas com dependency-cruiser.                                      |
| `check:complexity` | Verifica complexidade e manutenibilidade contra `.code-multivitals-baseline.json`. |
| `update:complexity-baseline` | Atualiza o baseline compartilhado após uma revisão explícita das alterações de complexidade. |
| `test`               | Alias para `test:unit`.                                                                             |
| `test:unit`          | Executa os testes unitários dos workspaces via Turbo.                                               |
| `test:coverage`      | Executa cobertura dos workspaces com ratchet habilitado.                                            |
| `check:coverage`     | Compara os relatórios de cobertura com `coverage-baseline.json` e falha quando um baseline diminui. |
| `check:test-integrity` | Falha quando testes são enfraquecidos ou código testável alterado não tem teste correspondente. |
| `check:spec-definition` | Valida a estrutura, rastreabilidade e mapa de paths de uma Spec. |
| `check:plan-definition` | Valida a estrutura, ownership, DAG e estado de execução de um Plan. |
| `check:spec-implementation` | Valida o mapa canônico de paths da Spec contra o diff Git e o filesystem. |
| `test:spec-implementation` | Executa os testes do checker de conformidade de Spec.                                               |
| `test:scripts`       | Executa os testes de todos os scripts auxiliares em `scripts/tests/`.                               |
| `test:integration`   | Executa os testes de integração declarados pelos workspaces via Turbo.                              |
| `test:server`        | Executa os testes unitários do `@stardust/server`.                                                  |
| `test:backoffice`        | Executa os testes unitários do `@stardust/backoffice`.                                                  |
| `test:web`           | Executa os testes unitários do `@stardust/web`.                                                     |
| `test:core`          | Executa os testes unitários do `@stardust/core`.                                                    |

`check:test-integrity` exige um teste alterado no mesmo workspace somente para
source executável em alvos testáveis: controllers, jobs, use-cases, objetos de
domínio (`entities`, `structures`, `aggregates`), hooks, views/widgets, rotas
Web (`app/page`, `app/layout`, `app/route`), rotas Server (`tests/routes`),
RPC actions e AI tools.
Barrels (`index.*`), services/repositories genéricos, constantes, interfaces,
tipos e código gerado, fixtures, mocks e a própria infraestrutura de testes
ficam fora desse pareamento; o resultado JSON lista esses caminhos em
`excludedSourcePaths`. Arquivos de teste permitidos ficam em `scripts/tests/**`
ou no diretório `tests/` da própria camada: objetos de domínio
(`domain/entities|structures|aggregates`), use-cases, controllers REST,
jobs, hooks, widgets/views, páginas/rotas Web, rotas Server, RPC actions e AI
tools. Um teste fora desses locais aparece em `forbiddenTestPaths` e falha o CI.

### `apps/server`

| Script             | Descrição                                                                                |
| --- | --- |
| `dev`              | Inicia a API em modo watch com `.env.local`.                                       |
| `lint`             | Executa o lint de `src` com nível de diagnóstico de erro.                                |
| `format`           | Formata `src` e grava as alterações.                                                     |
| `check:code`       | Verifica `src` com Biome, sem aplicar correções.                                         |
| `check:types`      | Executa o TypeScript sem emitir arquivos.                                                |
| `check:complexity` | Verifica o escopo `apps/server` contra o baseline compartilhado.                          |
| `check:architecture` | Verifica as dependências arquiteturais do Server com dependency-cruiser.               |
| `check:updates`    | Lista atualizações de dependências com npm-check-updates.                                |
| `build`            | Compila o Server com tsup.                                                               |
| `prod`             | Inicia o build do Server usando `.env`.                                                  |
| `db:test`          | Inicia os serviços Supabase necessários e reinicia o banco local de testes.              |
| `db:migrate`       | Gera uma migration com `supabase db diff`, usando `npm_config_schema_file`.              |
| `db:prod`          | Vincula a CLI Supabase ao projeto de produção.                                           |
| `db:dev`           | Vincula a CLI Supabase ao projeto de desenvolvimento.                                    |
| `db:pull`          | Baixa os schemas Auth, Public, Storage e Realtime.                                       |
| `db:push`          | Aplica migrations ao projeto Supabase vinculado.                                         |
| `db:types`         | Gera os tipos TypeScript do banco de desenvolvimento.                                    |
| `db:revert`        | Marca uma migration como revertida, usando `npm_config_migration_id`.                    |
| `update`           | Atualiza uma dependência específica com npm-check-updates, usando `npm_config_dep_name`. |
| `test:unit`        | Executa os testes unitários do projeto Server.                                           |
| `test:coverage`    | Executa os testes unitários do Server com relatório JSON de cobertura.                   |
| `test:integration` | Executa os testes de integração do Server.                                               |

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

### `apps/backoffice`

| Script            | Descrição                                                              |
| --- | --- |
| `dev`             | Inicia o servidor de desenvolvimento do Backoffice na porta `8000`.        |
| `build`           | Gera o build do Backoffice com React Router.                               |
| `start`           | Serve o arquivo estático do Backoffice a partir de `build/client`.         |
| `lint`            | Executa o lint de `src` com nível de diagnóstico de erro.              |
| `format`          | Formata `src` e grava as alterações.                                   |
| `check:code`      | Verifica `src` com Biome, sem aplicar correções.                       |
| `check:types`     | Gera os tipos do React Router e executa o TypeScript.                  |
| `check:complexity` | Verifica o escopo `apps/backoffice` contra o baseline compartilhado.       |
| `check:architecture` | Verifica as dependências arquiteturais do Backoffice com dependency-cruiser. |
| `test:unit`       | Executa os testes unitários do Backoffice.                                 |
| `test:coverage`   | Executa os testes unitários do Backoffice com relatório JSON de cobertura. |
| `test:unit:watch` | Executa os testes unitários do Backoffice em modo watch.                   |

### `apps/web`

| Script                     | Descrição                                                               |
| --- | --- |
| `dev`                      | Inicia a Web App em desenvolvimento na porta `3000`.                    |
| `queue`                    | Inicia o Inngest CLI local apontando para `/api/serverless`.            |
| `build`                    | Gera o build de produção da Web App com Next.js.                        |
| `start`                    | Inicia o build standalone usando a porta definida em `PORT`.            |
| `check:code`               | Verifica `src` com Biome, sem aplicar correções.                        |
| `check:types`              | Executa o TypeScript sem emitir arquivos.                               |
| `check:complexity`         | Verifica o escopo `apps/web` contra o baseline compartilhado.           |
| `check:architecture`       | Verifica as dependências arquiteturais da Web App com dependency-cruiser. |
| `lint`                     | Executa o lint de `src` com nível de diagnóstico de erro.               |
| `format`                   | Formata `src` e grava as alterações.                                    |
| `db:types`                 | Gera os tipos TypeScript do banco usado pela Web App.                   |
| `test:unit`                | Executa os testes unitários da Web App.                                 |
| `test:coverage`            | Executa os testes unitários da Web App com relatório JSON de cobertura. |
| `test:unit:watch`          | Executa os testes unitários da Web App em modo watch.                   |
| `test:integration`         | Executa os testes Playwright com a configuração de integração.          |
| `test:integration:ui`      | Abre a interface do Playwright para os testes de integração.            |
| `test:integration:debug`   | Executa os testes Playwright em modo de depuração.                      |
| `test:integration:install` | Instala o navegador Chromium usado pela integração.                     |

### `packages/core`

| Script          | Descrição                                                            |
| --- | --- |
| `build`         | Compila o pacote Core com tsup.                                      |
| `check:types`   | Executa o TypeScript sem emitir arquivos.                            |
| `check:code`    | Verifica `src` com Biome, sem aplicar correções.                     |
| `check:complexity` | Verifica o escopo `packages/core` contra o baseline compartilhado. |
| `check:architecture` | Verifica as dependências arquiteturais do Core com dependency-cruiser. |
| `lint`          | Executa o lint de `src` com nível de diagnóstico de erro.            |
| `format`        | Formata `src` e grava as alterações.                                 |
| `test:unit`     | Executa os testes unitários do Core.                                 |
| `test:coverage` | Executa os testes unitários do Core com relatório JSON de cobertura. |

### `packages/email`

| Script        | Descrição                                   |
| --- | --- |
| `dev`         | Inicia o editor de emails na porta `3001`.  |
| `build`       | Exporta os templates de email para `build`. |
| `format`      | Formata os templates e partials.            |
| `check:code`  | Verifica templates e partials com Biome.    |
| `check:types` | Executa o TypeScript sem emitir arquivos.   |
| `check:complexity` | Verifica os templates de email contra o baseline compartilhado. |

### `packages/studio`

Ferramenta local de autoria de animações Lottie, independente do painel
administrativo em `apps/backoffice`. Use `npm run dev:studio` na raiz.
O Vite prefere a porta `3030` e informa outra porta se ela estiver ocupada.
Não exige Server, Supabase, credenciais ou variáveis de ambiente.

| Script | Efeito |
| --- | --- |
| `dev` | Inicia o editor Vite e o backend local de arquivos. |
| `build` | Verifica tipos e gera o player estático em `dist`. |
| `preview` | Serve o build estático, sem endpoints de edição. |
| `check:code` | Verifica UI, plugin e scripts com Biome. |
| `check:types` | Executa TypeScript sem emissão. |
| `format` | Formata o código com Biome. |
| `postinstall` | Copia o CanvasKit WASM para `public`, sem versionar o binário. |

O `npm run dev` geral não inicia esta ferramenta. `npm run build:studio`
gera seu build pela raiz. Os checks gerais de código e tipos incluem o pacote
via Turbo. O smoke manual abre uma cena, valida playback, controles e gravação
em `lottie.json`; não usa o fluxo autenticado do Backoffice administrativo.

### `packages/lsp`

| Script        | Descrição                                           |
| --- | --- |
| `build`       | Compila o pacote LSP com tsup.                      |
| `check:types` | Executa o TypeScript sem emitir arquivos.           |
| `check:code`  | Verifica `src` com Biome, sem aplicar correções.    |
| `check:complexity` | Verifica o escopo `packages/lsp` contra o baseline compartilhado. |
| `lint`        | Executa o lint dos arquivos TypeScript de `src`.    |
| `format`      | Formata os arquivos TypeScript de `src`.            |
| `test:unit`   | Executa os testes Node do LSP com o carregador tsx. |

### `packages/validation`

| Script        | Descrição                                                 |
| --- | --- |
| `build`       | Compila o pacote Validation com tsup.                     |
| `check:types` | Executa o TypeScript sem emitir arquivos.                 |
| `check:code`  | Verifica `src` com Biome, sem aplicar correções.          |
| `check:complexity` | Verifica o escopo `packages/validation` contra o baseline compartilhado. |
| `lint`        | Executa o lint de `src` com nível de diagnóstico de erro. |
| `format`      | Formata `src` e grava as alterações.                      |

## Seed local por módulo

O seed é independente de `db:test` e usa um snapshot versionado do conteúdo do
Supabase staging (`rveubqzvfbqbcpmuevnm`), exportado em 2026-10-10. Não acessa
staging durante a execução. O entry point é
`apps/server/src/database/seed.ts`; cada domínio possui seu seeder em
`apps/server/src/database/seeders/<Domínio>Seeder.ts`, com `clear()` e `run(seed)`.

Prepare o stack e aplique as migrations com `npm run db:test -w @stardust/server`.
As contas locais são fixtures públicas fixas definidas em
`apps/server/src/database/seeders/seed-accounts.json`: `explorer@stardust.local`
e `studio@stardust.local`. Seus IDs terminam em `0001` e `0002`, respectivamente.
O seed não usa `WEB_APP_E2E_*` ou `BACKOFFICE_APP_E2E_*`. Inclua o UUID completo do
Backoffice (`00000000-0000-4000-8000-000000000002`) em `GOD_ACCOUNT_IDS` da raiz e do
Server local. Para o Playwright manual, carregue o exportador correspondente com
`--seed`; sem essa opção ele mantém o suporte às credenciais privadas da raiz.

```bash
# Valida configuração e snapshot sem conectar ao banco
npm run db:seed -w @stardust/server -- --check

# Substitui dados da aplicação e usuários Auth locais
npm run db:seed -w @stardust/server
```

O comando exporta a conexão local a partir do `.env.local` raiz com
`scripts/export-local-database-env.mjs` e carrega as credenciais apenas no
processo. Recusa hosts remotos, outros bancos, parâmetros de conexão que
redirecionem o destino e modo de produção. Limpeza e inserção acontecem numa
única transação, com lock para serializar execuções concorrentes. Uma falha
reverte também o reset de Auth; o pool fecha ao concluir ou falhar.

O snapshot contém 55 avatares, 10 foguetes, 2 insígnias, 6 tiers, 17 conquistas,
8 planetas, 39 estrelas, 27 desafios públicos ou associados a estrelas,
60 vínculos de categorias, 10 categorias e 10 guias. Textos, histórias e questões
embutidos nas estrelas são aplicados pelo `LessonSeeder`; a tabela de questões
separada está vazia em staging. Autoria dos desafios é substituída pela conta
Backoffice local. Não são exportados usuários, emails, sessões, hashes de senha,
API keys, desafios privados sem estrela nem histórico de atividade de staging.
Roadmaps de staging não fazem parte do schema local atual e não são importados.

As duas contas locais recebem perfil, itens iniciais e primeira estrela
desbloqueada. Ranking, nota, snippet, comentário, conversa e feedback são
ficcionais. O seed não publica eventos, envia mensagens nem gera arquivos;
nomes e referências de imagens/áudios do catálogo são preservados, mas seus
arquivos não são copiados pelo comando de banco. Os seeders persistem diretamente
no PostgreSQL na borda administrativa; não adicionam métodos de reset aos ports
do Core nem se tornam dependências das rotas ou dos jobs.

As imagens dos planetas, conquistas, avatares, tiers e foguetes estão versionadas em
`seeders/assets/images/planets/`, `seeders/assets/images/achievements/` e
`seeders/assets/images/avatars/`, `seeders/assets/images/rankings/` e
`seeders/assets/images/rockets/`.
Execute `npm run db:seed:assets -w @stardust/server` depois de preparar o MinIO
local. O comando usa o `.env.local` da raiz, exige endpoint HTTP em
`127.0.0.1`, preserva os nomes do catálogo e publica 110 imagens, incluindo seis
extras. Confirma por HTTP anônimo os 104 arquivos referenciados pelos oito
planetas, pelas 17 conquistas, pelos 55 avatares, pelos seis tiers e pelos 10 foguetes. Não altera o banco; pode ser executado novamente para atualizar os
arquivos. A policy existente é preservada e recebe permissão de leitura pública
somente para `images/planets/*`, `images/achievements/*`, `images/avatars/*`, `images/rankings/*` e `images/rockets/*`. Uploads e outras pastas não recebem permissões.
Configure `NEXT_PUBLIC_CDN_URL` na Web e `VITE_CDN_URL` no Backoffice com a URL
impressa pelo comando (`http://127.0.0.1:<MINIO_API_PORT>/<MINIO_BUCKET>`).
Os avatares preservam os nomes `.jpg` do catálogo; o Content-Type corresponde
aos bytes originais (JPEG, AVIF ou WebP). A verificação HTTP compara os bytes
recebidos com o arquivo versionado. Arquivos de outros itens ainda precisam ser
fornecidos.

Para atualizar o snapshot em `seeders/data/seed-catalog.json`, exporte somente
as tabelas de catálogo listadas em `seed-data.ts` por consultas read-only no
Supabase Dev. Filtre desafios por `is_public OR star_id IS NOT NULL`, mantenha
apenas vínculos dos desafios incluídos e substitua `user_id` por
`00000000-0000-4000-8000-000000000002` antes de salvar. Atualize `exportedAt`,
revise conteúdo e referências e execute as validações locais. Nunca versione
um dump de Auth ou de tabelas pessoais.

```bash
node --test scripts/tests/seed-database.test.mjs

# Validação explícita e destrutiva, exclusivamente no banco local
eval "$(node scripts/export-local-database-env.mjs)"
STARDUST_LOCAL_SEED_TEST=1 node --env-file=.env.local --test scripts/tests/seed-database.integration.test.mjs
```

A integração recria o seed duas vezes, autentica as contas pelo GoTrue local,
verifica seus perfis e força uma falha de inserção para confirmar rollback.
Sem `STARDUST_LOCAL_SEED_TEST=1`, esse teste não altera o banco.

## Supabase local

O root Docker Compose é a única origem do Supabase local. Configure as
variáveis locais no `.env.local` da raiz e mantenha esse arquivo ignorado pelo
Git. Passe-o ao Compose com `--env-file`; não carregue o arquivo com `source`.
Os valores nunca devem ser copiados para comandos versionados, documentação ou
logs.

Suba os serviços persistentes e aguarde os health checks. Em seguida, execute
o inicializador one-shot do MinIO; ele cria o bucket local de forma idempotente:

```bash
docker compose --env-file .env.local up -d --wait \
  inngest redis supabase-postgres supabase-mailpit supabase-templates minio \
  supabase-auth supabase-rest supabase-realtime supabase-kong
docker compose --env-file .env.local run --rm minio-init
```

`supabase-role-init` é iniciado como dependência do Auth, PostgREST e Realtime.
Ele prepara as roles locais, inclusive quando `docker/volumes/postgres/` já
contém dados. Para limpar o Auth e o schema público e reaplicar as migrations
versionadas, execute o reset one-shot; ele não aplica seed:

```bash
docker compose --env-file .env.local --profile test run --rm supabase-db-reset
```

O fluxo de integração do Server prepara o mesmo stack e reseta o banco antes
da suíte:

```bash
npm run db:test -w @stardust/server
npm run test:integration -w @stardust/server
```

As portas host padrão são Kong `54321`, PostgreSQL `54322`, Mailpit HTTP
`54324`/SMTP `54325`, Redis `6379` e MinIO API `9000`/console `9001`, sempre
publicadas em loopback. Quando outro stack ocupar esses ports, configure no
`.env.local` raiz `SUPABASE_API_PORT`, `SUPABASE_DATABASE_PORT`,
`SUPABASE_MAILPIT_HTTP_PORT`, `SUPABASE_MAILPIT_SMTP_PORT`, `REDIS_PORT`,
`MINIO_API_PORT` e `MINIO_CONSOLE_PORT`. Os apps devem usar as mesmas portas
nas URLs de `.env.local`; `apps/server/.env.testing` deve apontar para a API e
PostgreSQL da stack de teste. Os valores padrão continuam válidos quando os
overrides forem omitidos. Os guards aceitam qualquer porta somente em loopback
e com o protocolo local esperado. O bucket MinIO usa o nome configurável
localmente, com `stardust-bucket-local` como padrão. Não coloque os valores de
acesso do MinIO no Git.

GoTrue envia mensagens para o Mailpit e carrega os templates versionados de
cadastro e recuperação pelo serviço interno `supabase-templates`. O serviço
não publica uma porta no host. Para OAuth Google e GitHub, mantenha IDs e
secrets somente no `.env.local` da raiz e registre nos provedores o callback
local `http://127.0.0.1:<SUPABASE_API_PORT>/auth/v1/callback` (porta padrão
`54321`).

`docker compose --env-file .env.local down` preserva os dados locais de
PostgreSQL e MinIO em `docker/volumes/`. Redis, Auth, PostgREST, Realtime,
Mailpit, Inngest, Kong e templates são descartáveis.

## Testes de integração

Os testes de integração da Web App usam Playwright, o ambiente
`apps/web/.env.testing` e o servidor de testes iniciado pela configuração da
suíte. Não aponte esse fluxo para produção nem use as credenciais reais do
Backoffice:

```bash
npm --workspace @stardust/web run test:integration:install
npm --workspace @stardust/web run test:integration
npm --workspace @stardust/web run test:integration:debug
```

Para uma inspeção manual autenticada, inicie a API e a Web App em terminais
separados, carregue o ambiente local com o script correspondente e valide uma
rota protegida além da tela de login. Credenciais devem permanecer em
`.env.local` e nunca ser registradas no repositório ou nos logs.

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

Os checks do PR são a composição dos checks normais. A cobertura possui um
quality ratchet por workspace para Core, Server, Backoffice e Web; os thresholds
versionados em `coverage-baseline.json` nunca podem diminuir sem uma alteração
revisada desse arquivo.

`check:dead-code` não faz parte dos sensores oficiais. Playwright MCP pode
inspecionar fluxos reais e o Hermes pode executar validações E2E de release, mas
nenhum dos dois substitui `test:integration` automatizado quando ele for
aplicável. Os workflows E2E do GitHub Actions estão descritos em
`documentation/infrastructure.md`.

## Transição aprovada: Drizzle e SSE (Issue #602)

Os scripts listados acima ainda descrevem o estado implementado. Para a entrega da Issue #602, o contrato de tooling é:

| Script Server | Destino aprovado |
| --- | --- |
| `db:generate` | Drizzle Kit generate sobre src/database/drizzle/schema.ts agregando models; out em src/database/drizzle/migrations; execução local, sem introspecção remota implícita. |
| `db:migrate` | Aplica migrations Drizzle pendentes; URL por ambiente, sem reset, sem execução no boot. |
| `db:preflight` | Compara catálogo/histórico com baseline, apenas leitura; não imprime dados nem credenciais. |
| `db:adopt` | Adota baseline em banco existente somente após parity; nunca marca a migration de revogação como já aplicada. |
| `db:test` | Prepara Compose com .env.local raiz, reset exclusivamente local, migrations Drizzle sem seed. |

Scripts Supabase CLI de diff/push/pull/repair e geração de Database.ts são retirados; a Web não gera tipos de banco. npm/package-lock permanecem a fonte das versões. Antes de qualquer aplicação remota, exige-se preflight de Dev e produção e ensaio de rollback em restauração isolada, com evidências no workflow SDD. A indisponibilidade desses ambientes nesta autoria não é evidência de parity. A janela inicial é coordenada, sem release intermediário compatível.

A lista de scripts passa a descrever o runtime vigente apenas após a implementação verificada; atualizar também a seção de migrations da infraestrutura nessa entrega.

## Crew

`apps/crew` é um workspace npm independente para revisão de PR com Mastra e
Anthropic direta. `npm run crew` carrega o `.env.local` raiz e inicia Crew;
`npm run dev` exclui esse workspace. Configure as variáveis listadas em
`apps/crew/.env.example`, incluindo `CREW_DATABASE_URL`, `CREW_PORT` e `CREW_HOST`,
para manter banco/porta/host separados dos apps de produto. Inicie o banco com
`docker compose --env-file .env.local --profile crew up -d --wait crew-db`.

Use `npm run <script> -w @stardust/crew` para `check:code`, `check:types`,
`check:architecture`, `test:unit`, `test:integration` e `eval`; use
`npm run build:crew` para compilar. Os testes unitários usam modelos simulados;
integrações precisam de Docker; evals fazem chamadas pagas à Anthropic e ao
Composio. Node 24.11+ é recomendado para o toolchain de build. O CI próprio
valida o workspace e a imagem sem segredos de inferência. Detalhes e limites de
evidência estão em `apps/crew/README.md`.

O exportador `scripts/export-backoffice-app-e2e-env.mjs` usa
`BACKOFFICE_APP_E2E_EMAIL` e `BACKOFFICE_APP_E2E_PASSWORD`. Durante a migração,
aceita também as chaves locais legadas `STUDIO_APP_E2E_*`, mas sempre exporta
as variáveis com o prefixo `BACKOFFICE_APP_E2E_`. As contas fixas do seed e
o namespace de sessão do navegador são preservados.
