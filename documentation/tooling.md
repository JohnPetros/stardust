# Tooling

Execute os comandos a partir da raiz para aproveitar o Turbo e o cache. Durante
a implementação, selecione arquivos/cenários e consumidores afetados; use
`--filter` ou `-w` para gates que precisam do contexto do workspace. Antes do PR,
valide o escopo integrado. Os catálogos de scripts não são um checklist de
execução local completa.

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

Exemplos de gates de projeto para um workspace afetado (não execute todos os
workspaces por padrão):

```bash
npm run check:code -- --filter=@stardust/core
npm run check:types -- --filter=@stardust/core
```

Os limites do dependency-cruiser ficam em `.dependency-cruiser.cjs`. Altere essa
configuração somente para representar limites legítimos, nunca para ocultar uma
regressão.

O check de complexidade usa `.code-multivitals.json` para os limites e um
baseline compartilhado em `.code-multivitals-baseline.json`. O CI executa o
check no escopo principal de cada app ou pacote (`apps/server`, `apps/web`,
`apps/studio` e `packages/core`), tolerando a dívida existente e bloqueando
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
| `build:studio`       | Compila apenas o Studio.                                                                            |
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
| `test:studio`        | Executa os testes unitários do `@stardust/studio`.                                                  |
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

### `apps/studio`

| Script            | Descrição                                                              |
| --- | --- |
| `dev`             | Inicia o servidor de desenvolvimento do Studio na porta `8000`.        |
| `build`           | Gera o build do Studio com React Router.                               |
| `start`           | Serve o arquivo estático do Studio a partir de `build/client`.         |
| `lint`            | Executa o lint de `src` com nível de diagnóstico de erro.              |
| `format`          | Formata `src` e grava as alterações.                                   |
| `check:code`      | Verifica `src` com Biome, sem aplicar correções.                       |
| `check:types`     | Gera os tipos do React Router e executa o TypeScript.                  |
| `check:complexity` | Verifica o escopo `apps/studio` contra o baseline compartilhado.       |
| `check:architecture` | Verifica as dependências arquiteturais do Studio com dependency-cruiser. |
| `test:unit`       | Executa os testes unitários do Studio.                                 |
| `test:coverage`   | Executa os testes unitários do Studio com relatório JSON de cobertura. |
| `test:unit:watch` | Executa os testes unitários do Studio em modo watch.                   |

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
O seed não usa `WEB_APP_E2E_*` ou `STUDIO_APP_E2E_*`. Inclua o UUID completo do
Studio (`00000000-0000-4000-8000-000000000002`) em `GOD_ACCOUNT_IDS` da raiz e do
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
Studio local. Não são exportados usuários, emails, sessões, hashes de senha,
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
Configure `NEXT_PUBLIC_CDN_URL` na Web e `VITE_CDN_URL` no Studio com a URL
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
Studio:

```bash
npm --workspace @stardust/web run test:integration:install
npm --workspace @stardust/web run test:integration
npm --workspace @stardust/web run test:integration:debug
```

Para uma inspeção manual autenticada, inicie a API e a Web App em terminais
separados, carregue o ambiente local com o script correspondente e valide uma
rota protegida além da tela de login. Credenciais devem permanecer em
`.env.local` e nunca ser registradas no repositório ou nos logs.

## Execução de checks por impacto

Selecione checks locais a partir do diff, comportamento contratado, boundaries
alterados e consumidores reais. Nomes semelhantes ou a presença de um arquivo
em uma aplicação não demonstram impacto em toda ela. Uma mudança de apresentação
Web não exige testes Server; uma mudança Server sem efeito observável no browser
não exige Playwright. Contratos compartilhados acrescentam os consumidores
afetados, não todos os módulos automaticamente.

| Check | Durante a implementação | Candidato integrado | Após correção |
| --- | --- | --- | --- |
| Unitário/componente | Arquivos exatos do comportamento implementado | Confirmar resultados do escopo e consumidores afetados | Reexecutar arquivos/cenários falhos ou invalidados |
| Server HTTP/persistência/jobs | Asserções de boundary e feedback unitário/estático | Agrupar seleções afetadas com serviços/fixtures reais exigidos | Reexecutar boundaries afetados, serializando uso de serviços compartilhados |
| Web Playwright | Preparar cenários afetados; feedback unitário/estático | Executar somente arquivos de cenário afetados | Reexecutar cenários invalidados |
| Tipos | Após mudanças de contratos, schemas e assinaturas | Projetos afetados e consumidores, com configuração real | Reexecutar produtores/consumidores impactados |
| Lint/formatação | Paths alterados, sem escrita | Confirmar seleção e gates configurados pertinentes | Revalidar paths/configuração alterados |
| Complexidade | Lógica alterada no escopo suportado pelo checker | Gate CodeMultiVitals dos workspaces afetados | Reexecutar escopos invalidados sem relaxar baseline |
| Arquitetura/build | Dependências, exports e composição afetados | Gates exigidos para os projetos e consumidores afetados | Reexecutar gates cujas entradas/afirmações mudaram |

Integração é um checkpoint do candidato integrado, não um ritual por edição ou
por Builder. Agrupe seleções Server para reutilizar setup e serialize comandos
que usam o mesmo Supabase local, portas ou serviços. Prepare o stack com
`npm run db:test -w @stardust/server` conforme `AGENTS.md`; não repita resets
concorrentes nem substitua o banco local pelo remoto.

Não execute suites completas locais por padrão, inclusive no preflight. Amplie
somente quando o impacto demonstrado abranger a suíte, um consumidor compartilhado
ou uma lacuna concreta de prova exigir, ou o usuário solicitar a medição. Registre
a dependência e o motivo da ampliação. Alterações de sessão/root layout, composição
global, transações ou fixtures compartilhadas podem justificar seleções maiores;
identifique seus consumidores antes de expandir.

### Seleções executáveis

Substitua placeholders por paths exatos verificados no repositório. Os paths dos
runners de workspace são relativos ao workspace; os do Biome e de scripts são
relativos à raiz. Use nomes de teste apenas depois de verificá-los no source.

| Boundary | Comando a partir da raiz |
| --- | --- |
| Core, Web, Studio ou Server unitário | `npm run test:unit -w <workspace> -- --runTestsByPath <arquivos-de-teste> --watch=false` |
| Server HTTP/persistência/jobs de integração | `npm run test:integration -w @stardust/server -- --runTestsByPath <arquivos-de-teste> --watch=false` |
| Web navegador | `npm run test:integration -w @stardust/web -- <arquivos-de-cenario>` |
| Scripts auxiliares | `node --test <arquivos-em-scripts/tests>` |
| Lint/formatação sem escrita | `npm exec -- biome check <paths-alterados>` |
| Tipos do projeto afetado | `npm run check:types -w <workspace>` |
| Arquitetura do projeto afetado | `npm run check:architecture -w <workspace>` |
| Complexidade do projeto afetado | `npm run check:complexity -w <workspace>` |

Os scripts unitários de Core, Server, Studio e Web usam Jest; o Server já seleciona
`server` para unitários e `server-integration` para integração. Os scripts sem
seletores executam categorias completas. A Web usa sua configuração Playwright,
`.env.testing` e mocks; não inicie a API real para essa suíte. Jobs e rotas Server
usam os pré-requisitos das respectivas fixtures. Não adicione `--passWithNoTests`
nem trate seleção vazia/skip como prova. Confirme quantidade e asserções executadas.

Tipos devem preservar o tsconfig e o contexto de imports do projeto. Não passe
arquivos diretamente ao `tsc` contornando essa configuração. Formatação com escrita
é uma alteração explícita, não uma etapa obrigatória de validação.

### Cobertura, complexidade e CI

O ratchet atual de `coverage-baseline.json` mede o agregado de Core, Server,
Studio e Web. `check:coverage` lê o total do relatório, não arquivos alterados.
Um relatório de testes selecionados não prova esse baseline; não reduza
`collectCoverageFrom`, thresholds ou exclusões para fazê-lo passar. Cobertura
focada é evidência apenas da seleção, deve usar um diretório separado do relatório
agregado e registrar seus limites. Este workflow não introduz um gate por arquivo.

Os workflows aplicáveis do CI continuam executando `test:coverage` e
`check:coverage` para o workspace e suas suites/gates configurados no HEAD do PR.
Localmente, reutilize uma medição agregada ainda válida; execute uma medição
completa quando o impacto, uma obrigação explícita de medição ou o usuário a
exigir, sem transformá-la em pré-requisito automático de toda edição ou conclusão.
Quando não executada localmente, registre o ratchet agregado como pendente para
o CI ou não executado localmente, nunca como aprovado por uma seleção focada.
Qualquer gate local explicitamente contratado permanece obrigatório até sua
reconciliação; não o dispense silenciosamente. Baselines não podem ser relaxados
para fazer uma entrega passar.

CodeMultiVitals possui gate quantitativo configurado por workspace, com limites
e baseline próprios. Lint, tipos e testes não o substituem. Execute o script do
workspace afetado quando sua lógica mudar, registre resultados e limitações e
não invente seletores por arquivo não suportados. Infraestrutura ou ferramenta
obrigatória indisponível é bloqueio; checks somente de source podem ser não
aplicáveis em entregas exclusivamente documentais, com justificativa.

### Evidência, reuso e entrega

Registre comandos exatos, arquivos/cenários, boundaries, quantidade de testes,
resultado, tempo de execução, candidato/ambiente e artefatos no Evaluation ou no
report da tarefa. Separe unitários, Web Playwright, Server HTTP/persistência/jobs,
smoke manual e cobertura. Exit code isolado não prova critérios de aceitação.
Preserve resultados históricos com falha e não apresente-os como prova atual.

Review, retomada e conclusão reutilizam resultados válidos. Mudanças em source,
fixtures, configuração, ambiente ou Contract invalidam somente as afirmações e
dependências afetadas. Um novo papel, commit ou edição de ledger não invalida
prova por si só. Corrija falhas e reexecute checks falhos/invalidados; justifique
qualquer ampliação adicional. O CI obrigatório continua validando o HEAD real do PR.

Frontend continua exigindo o smoke manual feliz em serviços locais conforme
`AGENTS.md`, com login/rota protegida quando aplicável e capturas atuais quando
a UI mudar. Mocks não provam autenticação, autorização ou persistência reais.
Testes automatizados cobrem erros/loading/recovery; o smoke manual não se expande
para uma matriz de estados. Use Playwright CLI para inspeção e browser real.

`check:dead-code` não faz parte dos sensores oficiais. O Hermes executa E2E de
release conforme `documentation/infrastructure.md`; não substitui seleções
automatizadas contratadas nem os checks aplicáveis do CI.

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
