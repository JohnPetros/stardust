---
title: Migração do gerenciador de pacotes de npm para pnpm
status: in_progress
revision: 4
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/632
scope:
  - package.json
  - pnpm-workspace.yaml
  - pnpm-lock.yaml
  - package-lock.json
  - apps
  - packages
  - .husky
  - .github
  - scripts
  - Dockerfile.web
  - Dockerfile.server
  - Dockerfile.studio
  - Dockerfile.crew
  - Dockerfile.crew.dockerignore
  - documentation
  - AGENTS.md
  - README.md
last_updated_at: 2026-11-07
---

# Context and scope

## Origem e limites

A [Issue #632](https://github.com/JohnPetros/stardust/issues/632) (`chore`, sem PRD nem milestone de produto) substitui o npm pelo pnpm como gerenciador de pacotes do monorepo. Não há mudança de comportamento de produto, regra de negócio, contrato público ou semântica de API. O objetivo é um único gerenciador para instalação, workspaces e lockfile, com `node_modules` estrito que exponha dependências não declaradas, mantendo CI, builds Docker e fluxo local reproduzíveis.

Esta Spec é originada de uma issue `chore`; isso foi autorizado pela atualização de `documentation/prompts/create-spec-prompt.md` e `documentation/sdd.md` feita junto com esta autoria (a Spec pode vir de issues `chore` e `refactor` sem PRD). Não há fonte visual: não existe UI nova, Penpot nem Playwright de comparação visual.

Fora de escopo: specs, plans, evaluations e reports históricos em `documentation/features/**` e `documentation/reports/**`, `CHANGELOG.md`, `.github/dependabot.yml` (permanece `package-ecosystem: npm`), `turbo.json`, `scripts/create-worktree.mjs` (já detecta `pnpm-lock.yaml`), código de produto e a descrição semântica dos scripts Supabase CLI.

## Baseline verificado

| Fato | Evidência | Efeito no Contract |
| --- | --- | --- |
| `packageManager` é `npm@11.13.0`, há `workspaces` (`apps/*`, `packages/*`) e `overrides` (15 entradas, incluindo `@ai-sdk/ui-utils` e `tsup` aninhados; 13 migram, ver D-11) no `package.json` raiz | `package.json` | migrar para `pnpm-workspace.yaml` |
| pnpm 11 lê `overrides` somente de `pnpm-workspace.yaml` e recusa instalar se `pnpm.overrides` existir no `package.json` | documentação oficial do pnpm 11 (`MIGRATED_PNPM_FIELD_KEYS`) | desvio aprovado do texto da Issue: overrides vão para `pnpm-workspace.yaml` |
| dependências entre workspaces usam `"*"` (e `@stardust/lsp@^0.1.0` no studio) | `apps/*/package.json`, `packages/*/package.json` | `pnpm import` falha com 404 no registry; exigem `workspace:*` (verificado em cópia de scratch) |
| `pnpm import` não preserva todas as versões diretas: `typescript` (`^5.8.3`) vai de 5.8.3 a 5.9.2 em server e studio; `@radix-ui/react-slot` de 1.3.3 a 1.5.0 em web e studio; o alias `@ai-sdk/provider-utils-v5` de 5.0.5 a 5.0.28; cerca de 4% dos `name@version` transitivos diferem | comparação de `package-lock.json` com o `pnpm-lock.yaml` importado | pinar os especificadores divergentes; reportar drift transitivo |
| dependências usadas mas não declaradas, hoje resolvidas por hoisting (varredura estática de imports) | ver tabela de pins abaixo | declarar no workspace importador |
| `packages/core/.../tests/Code.test.ts` importa `@stardust/lsp`, que depende de `@stardust/core`; declarar a dependência cria ciclo e o Turbo 2.10.8 recusa executar | execução do Turbo em cópia de scratch | remover o caso de teste e o import (decisão do usuário) |
| `pnpm run x -- --flag` anexa o `--` à linha de comando do script; `npm_config_*` não é lido pelo pnpm 11 | execução de sonda com pnpm 11.28.11 e documentação de migração | remover qualquer `--` separador; reescrever `db:revert` e `update` |
| scripts do Server: `db:migrate` já é `tsx scripts/migrate-database.ts` (sem `npm_config_*`); só `db:revert` e `update` dependem de `$npm_config_*` | `apps/server/package.json` | a Issue está parcialmente desatualizada; `tooling.md` descreve `db:migrate` como `supabase db diff` (incorreto) |
| pnpm 11 recusa instalar com build scripts não aprovados (`strictDepBuilds`); pacotes com install script no lockfile: `esbuild`, `@swc/core`, `unrs-resolver`, `core-js`, `protobufjs`, `cpu-features`, `ssh2`, `@tsparticles/engine`, `fsevents` | `package-lock.json` (`hasInstallScript`) | `allowBuilds` explícito |
| pnpm 11 exige Node `>=22.13`; `engines.node` é `>=22` e as imagens usam `node:22-alpine` e `node:24-alpine` | `npm view pnpm@11` | `engines` mantido por decisão da Issue; imagens resolvem a última 22.x |
| versão mais recente 11.x é `11.28.11` (a tag `latest` já é 12.x) | registry | `packageManager` fixado em `pnpm@11.28.11`, conforme a Issue |
| o `package-lock.json` não aplicou todas as `overrides`: `@ai-sdk/provider-utils` coexiste nas versões 4.0.35, 5.0.14 e 5.0.28 (`apps/web` e `node_modules` raiz), apesar da override `5.0.5`; com a override aplicada, o pnpm colapsa tudo em 5.0.5 e `build:web` falha com `Export ... doesn't exist in target module` | `package-lock.json` e execução de `pnpm run build:web` com e sem a override, no passo de implementação | as duas overrides de `@ai-sdk/provider-utils` não migram (D-11) |
| `apps/server/jest.config.ts` usa `transformIgnorePatterns: ['node_modules/(?!(...p-map...)/)']`; no layout do pnpm os pacotes ESM ficam em `node_modules/.pnpm/<pkg>@<v>/node_modules/<pkg>` e `startNodeServer.test.ts` falha com `Unexpected token 'export'` | execução de `test:unit` do Server com pnpm | ajuste mínimo do padrão (D-12) |
| `check:test-integrity` falha quando `Code.test.ts` perde um caso ou uma asserção (10 < 11 casos, 35 < 36 asserções); o sensor não tem mecanismo de dispensa | execução do sensor contra o commit-base | a remoção do caso com `DeleguaProvedorLsp` real é compensada (D-13) |
| `packages/email` usa `tsc` sem declarar `typescript`; o npm resolvia o binário hoisted 5.8.3 e o pnpm cai no `tsc` global do host | `check:types` do Email com pnpm | declarar `typescript` `5.8.3` no Email (passo 5, mesma regra dos pins) |
| `Dockerfile.server` copia `node_modules` raiz e por pacote para o runner; `Dockerfile.crew` instala o pnpm via `npm install --global "$packageManager"` e usa `npm ci --ignore-scripts` | Dockerfiles | layout simbólico do pnpm precisa ser validado em runtime |
| no commit-base, `Dockerfile.web` e `Dockerfile.studio` já não constroem: o web não copia `tsconfig.base.json` nem `tsconfig.nextjs.json` (`TS5083`), e web e studio exigem variáveis de build (`NEXT_PUBLIC_*`, `VITE_*`) que o Coolify injeta; `@stardust/email` falha em `email export` com `space-y-5 cannot be inlined` em Docker e localmente, tanto com npm quanto com pnpm, mas passa no CI do GitHub | builds do commit-base em worktree de scratch e log do CI | `Dockerfile.web` e `Dockerfile.studio` passam a copiar os `tsconfig` raiz; a validação das imagens usa cópias de scratch com `ENV` de build fictícios, e o bloqueio do `email export` local é registrado como limitação ambiental pré-existente |

## Decisões registradas

| ID | Decisão | Alternativas descartadas | Motivo e trade-off |
| --- | --- | --- | --- |
| D-01 | Spec originada de issue `chore`, em `documentation/features/global/pnpm-migration/spec.md`, com a Issue como única fonte | fluxo direto sem Spec | várias frentes (CI, Docker, lockfile, docs); precedente em `documentation/features/global/` |
| D-02 | `overrides` em `pnpm-workspace.yaml`, preservando o alias `npm:@ai-sdk/provider-utils` | `pnpm.overrides` no `package.json` | único local lido pelo pnpm 11; desvio documentado da Issue |
| D-03 | Versões diretas idênticas ao lockfile npm, pinando os especificadores divergentes; drift transitivo permitido e reportado em `evaluation.md` | aceitar qualquer drift dentro do range; lockfile idêntico (inviável com `pnpm import`) | critério mensurável sem reescrever o lockfile; os pins resolvem para as versões anteriores |
| D-04 | `allowBuilds` permite `esbuild`, `@swc/core`, `unrs-resolver`, `cpu-features`, `ssh2` e `fsevents`; nega `core-js`, `protobufjs` e `@tsparticles/engine` | permitir todos; negar todos | permite binários nativos necessários e bloqueia scripts que só imprimem mensagens ou checam versão |
| D-05 | `dependabot-lockfile.yaml` adaptado para pnpm e revisitado após o primeiro PR do Dependabot | remover agora | não é verificável antes do merge se o Dependabot atualiza um `pnpm-lock.yaml` 11 sozinho |
| D-06 | Validação Docker: `docker build` das 4 imagens mais smoke de runtime | somente build | o deploy via Coolify depende das imagens; o build não detecta symlink quebrado |
| D-07 | Corrigir minimamente a linha e o exemplo de `db:migrate` em `tooling.md` | só converter formas de comando | evita documentar um comando pnpm inexistente |
| D-08 | Remover o caso de teste com `DeleguaProvedorLsp` real e o import de `@stardust/lsp` em `Code.test.ts` | mover para `packages/lsp`; mock; `moduleNameMapper` | ciclo `core` ↔ `lsp` inválido no Turbo; decisão do usuário. Se o ratchet de cobertura de `core` falhar, a decisão é reaberta |
| D-09 | `db:revert` e `update` mantêm o nome e recebem o argumento como posicional (`pnpm --filter @stardust/server run update <dependência>`) | renomear scripts | preserva a interface pública; `run` evita colisão com o comando nativo `pnpm update` |
| D-11 | Não migrar as overrides `@ai-sdk/provider-utils` e `@ai-sdk/ui-utils>@ai-sdk/provider-utils` (13 de 15 migram) | migrar as 15; pinar a faixa das duas | o lockfile npm nunca as aplicou (coexistem 4.0.35, 5.0.14 e 5.0.28) e o pnpm as aplica de fato, quebrando `build:web`; remover reproduz as versões do lockfile npm (RF-03) |
| D-12 | Tornar o `transformIgnorePatterns` de `apps/server/jest.config.ts` ciente do layout `.pnpm` (aceita `node_modules/.pnpm/` além dos pacotes ESM permitidos) | `nodeLinker=hoisted`; `publicHoistPattern`; mapear `p-map` | hoisting global é proibido por RF-01; a mudança é só de configuração de teste |
| D-13 | Mover a cobertura do `DeleguaProvedorLsp` real para `packages/lsp/src/DeleguaProvedorLsp.test.ts` (runner `node:test`, sem ciclo) e acrescentar um caso de imutabilidade em `Code.test.ts` | apenas remover o caso (viola `check:test-integrity`); dispensar o sensor | o sensor exige que casos e asserções de `Code.test.ts` não diminuam e não admite dispensa; o usuário decidiu remover o caso real, mantido por D-08 |
| D-14 | Fixar `@react-email/tailwind>tailwindcss` e `react-email>tailwindcss` em `4.1.18` | deixar o `pnpm import` resolver | o lockfile npm entregava `tailwindcss` 4.1.18 a ambos; o `pnpm import` os ligou a 4.3.3, que não inlina `space-y-5` e quebra `email export` no CI |
| D-10 | CI usa `pnpm/action-setup@v6` (versão lida de `packageManager`) e `actions/setup-node@v7` com `cache: pnpm`; Docker usa `corepack enable` para obter o pnpm de `packageManager` | duplicar a versão em workflows e Dockerfiles | versão única em `package.json` |

# Implementation Contract

## Requisitos

| RF | Requisito |
| --- | --- |
| RF-01 | O `package.json` raiz fixa `packageManager` em `pnpm@11.28.11`, mantém `engines.node >=22` e remove `workspaces` e `overrides`. `pnpm-workspace.yaml` declara `packages` (`apps/*`, `packages/*`), as 13 entradas de `overrides` convertidas (o `tsup` aninhado passa à forma `tsup>esbuild`; as duas overrides de `@ai-sdk/provider-utils` não migram, D-11) e `allowBuilds` conforme D-04, sem `nodeLinker=hoisted`, `publicHoistPattern` ou `hoistPattern`. `package-lock.json` é removido e `pnpm-lock.yaml` é gerado a partir dele. |
| RF-02 | Toda dependência `@stardust/*` entre workspaces usa `workspace:*`. Toda dependência importada e não declarada é declarada no workspace importador com a versão que o npm resolvia para ele (tabela de pins). O caso de teste com `DeleguaProvedorLsp` real e o import de `@stardust/lsp` saem de `Code.test.ts`, sem criar ciclo `core` ↔ `lsp`; o comportamento coberto passa a um teste em `packages/lsp` e `Code.test.ts` ganha um caso de imutabilidade para manter o `check:test-integrity` (D-13). |
| RF-03 | As versões diretas de todos os workspaces são idênticas às do `package-lock.json` anterior; os especificadores divergentes são pinados para as versões anteriores. O drift transitivo é listado em `evaluation.md`. |
| RF-04 | Cada ocorrência de `npm run`, `-w`, `--workspace`, `npm exec`, `npx` e `$npm_config_*` nos `package.json`, `.husky/*` e `scripts/` é substituída por equivalente pnpm (`pnpm`, `--filter`, `pnpm exec`, `pnpm dlx`), sem o separador `--`. `db:revert` e `update` do Server funcionam com o argumento posicional. |
| RF-05 | Os workflows de CI/CD e a action `prepare-server-stack` instalam pnpm, usam cache pnpm e `pnpm install --frozen-lockfile`, substituem todos os comandos npm (sem `--` separador, inclusive as fases de migration do CD de produção) e filtram `paths` por `pnpm-lock.yaml` e `pnpm-workspace.yaml` no lugar de `package-lock.json`. |
| RF-06 | `dependabot-lockfile.yaml` regenera e commita `pnpm-lock.yaml` com pnpm quando o autor do PR é o Dependabot; `.github/dependabot.yml` permanece com `package-ecosystem: npm`. |
| RF-07 | `Dockerfile.web`, `Dockerfile.server`, `Dockerfile.studio` e `Dockerfile.crew` (e `Dockerfile.crew.dockerignore`) usam pnpm, mantendo o fluxo multi-stage com `turbo prune --docker` nas três imagens que o usam. |
| RF-08 | As docs vivas (`AGENTS.md`, `README.md`, READMEs de apps/pacotes, `documentation/{tooling,architecture,infrastructure,sdd}.md`, Rules, prompts e agents) descrevem somente comandos pnpm, incluindo o novo comando dos scripts reescritos e a correção de `db:migrate` em `tooling.md`. Documentos históricos permanecem intactos. |
| RF-09 | A migração não altera comportamento: nenhum código de produto muda, todos os sensores aplicáveis passam e nenhum baseline (`coverage-baseline.json`, complexidade) é rebaixado. |

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | clone limpo da branch | executar `pnpm install --frozen-lockfile` | conclui sem erro; `package-lock.json` não existe; o `package.json` raiz não tem `workspaces` nem `overrides`; as 13 overrides constam no `pnpm-lock.yaml` | EV-01 |
| CA-02 | RF-01 | `pnpm-workspace.yaml` com `allowBuilds` | instalar do zero | nenhum `ERR_PNPM_IGNORED_BUILDS`; o arquivo não contém `nodeLinker`, `publicHoistPattern` nem `hoistPattern`; os pacotes de D-04 aparecem com o valor decidido | EV-01 |
| CA-03 | RF-02 | manifests migrados | inspecionar dependências e executar `turbo run build --dry=json` | nenhuma dependência `@stardust/*` usa `*` ou `^0.1.0`; todas são `workspace:*` e viram `link:` nos importers; o grafo não tem ciclo | EV-02 |
| CA-04 | RF-02 | linker estrito instalado | executar `check:types`, `test:unit`, `build` e a varredura estática de imports | todos passam; a varredura não encontra import não declarado por workspace; `Code.test.ts` não importa `@stardust/lsp` | EV-02 |
| CA-05 | RF-03 | `package-lock.json` anterior (via Git) e `pnpm-lock.yaml` novo | comparar a versão resolvida de cada dependência direta de cada importer | zero diferenças; os `name@version` transitivos presentes só em um dos lockfiles são listados | EV-03 |
| CA-06 | RF-04 | manifests, hooks e `scripts/` migrados | buscar `npm run`, `npm exec`, `npx`, ` -w `, `--workspace` e `npm_config` nesses arquivos e executar sondas de argumento | a busca não encontra ocorrências; `pnpm run check:spec-definition <spec>`, o forward de flags (`--shard`, `--filter`) e os posicionais de `db:revert` e `update` chegam ao comando sem `--` | EV-04 |
| CA-07 | RF-04 | hooks Husky migrados | validar uma mensagem de commit inválida e uma válida com `pnpm exec commitlint` e executar o pre-commit | a inválida é rejeitada, a válida aceita e `pnpm run check:code` roda no pre-commit | EV-04 |
| CA-08 | RF-05 | workflows migrados | buscar `npm`, `package-lock.json` e `cache: npm` em `.github/workflows` e `.github/actions` e abrir o PR | a busca não encontra ocorrências; os jobs aplicáveis passam no HEAD do PR com cache pnpm | EV-05 |
| CA-09 | RF-05 | CD de produção do Server migrado | comparar os comandos de `db:preflight`, `db:adopt` e `db:migrate` com os anteriores | flags e fases idênticas (`--environment`, `--phase`, `--rollback`), sem `--` separador; a workflow é validada por lint estático e não é executada contra produção | EV-05 |
| CA-10 | RF-05 | action `prepare-server-stack` migrada | executar o job de integração do Server no PR | a stack local sobe, as migrations aplicam e a suíte conclui | EV-05 |
| CA-11 | RF-06 | PR do Dependabot hipotético | ler `dependabot-lockfile.yaml` e `dependabot.yml` | a workflow usa pnpm, os `paths` incluem `pnpm-lock.yaml` e `pnpm-workspace.yaml`, o commit adiciona `pnpm-lock.yaml`; `dependabot.yml` mantém `package-ecosystem: npm` | EV-05 |
| CA-12 | RF-07 | Dockerfiles migrados | executar `docker build` das quatro imagens | as quatro concluem com sucesso; nenhuma usa `npm` ou `npx` | EV-06 |
| CA-13 | RF-07 | as quatro imagens construídas | executar o smoke de runtime de VM-01 | server resolve `@stardust/core`, `@stardust/validation`, `@stardust/lsp` e uma dependência de runtime; web e server iniciam com env local; studio responde `200` no nginx; crew inicia sem erro de resolução de módulo | EV-06 |
| CA-14 | RF-08 | docs migradas | buscar, sem diferenciar maiúsculas, `npm`, `npx`, `package-lock` e `npm_config` nas docs vivas e comparar o diff dos históricos | só restam menções explicitamente históricas ou ao ecossistema `npm` do Dependabot; `tooling.md` traz os comandos de `db:revert`, `update` e a linha correta de `db:migrate`; `documentation/features/**`, `documentation/reports/**` e `CHANGELOG.md` não mudam | EV-07 |
| CA-15 | RF-09 | candidato integrado | executar `check:code`, `check:types`, `test:unit`, `check:architecture`, `test:integration`, `test:coverage`, `check:coverage` e `check:test-integrity` | todos passam via pnpm; os baselines não são rebaixados; o diff fica restrito ao mapa de paths | EV-08 |
| CA-16 | RF-09 | Server e Web locais com Supabase local | exercitar o caminho feliz de VM-02 e VM-03 | login, rota protegida e endpoints essenciais retornam `2xx`; nenhum erro de resolução de módulo no console | EV-09 |

# Technical Contract

## Fluxo de execução da migração

1. Aplicar as mudanças de manifesto: `packageManager`, remoção de `workspaces`/`overrides`, `pnpm-workspace.yaml`, `workspace:*`, pins de D-03 e declarações da tabela de pins.
2. Gerar o lockfile com `pnpm import` (lê o `package-lock.json` ainda presente) e remover `package-lock.json`. Rodar `pnpm install --frozen-lockfile` para confirmar.
3. Rodar a comparação de versões diretas (CA-05) e corrigir pins faltantes sem alterar além dos especificadores divergentes.
4. Reescrever scripts, hooks, workflows, action e Dockerfiles.
5. Rodar os sensores; qualquer import não declarado revelado por `check:types`, `build` ou pelos testes (inclusive em configs como `jest.config.ts`, `tsup.config.ts` e plugins) é declarado no workspace importador, no mesmo padrão da tabela de pins, e listado em `evaluation.md`.
6. Atualizar as docs vivas; construir as imagens e executar os smokes; validar no PR.

## Pins e declarações de dependências

Versões abaixo são as resolvidas pelo npm para o workspace; o gerenciador decide o campo (`dependencies` ou `devDependencies`) conforme o uso atual.

| Workspace | Mudança | Especificador |
| --- | --- | --- |
| raiz | adicionar (uso em `scripts/*.mjs`) | `postgres` `3.4.9`, `drizzle-orm` `0.45.3`, `@aws-sdk/client-s3` `3.1097.0` |
| raiz | pin do alias | `@ai-sdk/provider-utils-v5`: `npm:@ai-sdk/provider-utils@5.0.5` |
| `@stardust/studio` | adicionar | `dependency-cruiser` `^18.1.0`, `ts-jest-mocker` `^1.3.0`, `uuid` `11.1.1`, `@dnd-kit/utilities` `3.2.2` |
| `@stardust/studio` | pin | `typescript` `5.8.3`, `@radix-ui/react-slot` `1.3.3` |
| `@stardust/crew` | adicionar | `hono` `4.13.1` |
| `@stardust/server` | adicionar | `dependency-cruiser` `^18.1.0`, `@modelcontextprotocol/sdk` `1.32.2` |
| `@stardust/server` | pin | `typescript` `5.8.3` |
| `@stardust/web` | adicionar | `dependency-cruiser` `^18.1.0`, `framer-motion` `12.43.0`, `@tiptap/core` `3.29.2`, `@dnd-kit/utilities` `3.2.2`, `@tsparticles/basic` `3.9.1` |
| `@stardust/web` | pin | `@radix-ui/react-slot` `1.3.3` |
| `@stardust/core` | adicionar | `dependency-cruiser` `^18.1.0` |
| `@stardust/email` | adicionar | `react` `19.2.8`, `@react-email/html` `0.0.12`, `typescript` `5.8.3` (devDependency, usado por `tsc` em `check:types`) |

## Mapa canônico de paths afetados

### Raiz e lockfile

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `package.json` | Modify | `packageManager`, `workspaces`, `overrides`, scripts, `dependencies` e `devDependencies` | `packageManager` = `pnpm@11.28.11`; sem `workspaces`/`overrides`; scripts `test` = `pnpm run test:unit`, `check:architecture` encadeia `pnpm --filter @stardust/crew run check:architecture`, `crew` = `pnpm --filter @stardust/crew run dev`, `build:crew`, `dev:studio` e `dev:studio` análogos; alias `@ai-sdk/provider-utils-v5` pinado; `postgres`, `drizzle-orm` e `@aws-sdk/client-s3` declarados | pnpm, Turbo | CA-01, CA-05, CA-06 |
| `pnpm-workspace.yaml` | Create | `packages`, `overrides`, `allowBuilds` | `packages: [apps/*, packages/*]`; as 13 overrides mais `@react-email/tailwind>tailwindcss` e `react-email>tailwindcss` fixadas em `4.1.18` (D-14) (`@types/react`, `hono`, `monaco-editor`, `react`, `react-dom`, `esbuild`, `tsup>esbuild`, `uuid`, `vite`, `react-router`, `@react-router/express`, `@react-router/node`, `@react-router/serve`) com os mesmos valores; sem as overrides de `@ai-sdk/provider-utils` (D-11); `allowBuilds` de D-04; sem chaves de hoisting | pnpm 11 | CA-01, CA-02 |
| `pnpm-lock.yaml` | Generate | fonte `package-lock.json`; comando `pnpm import` seguido de `pnpm install --frozen-lockfile` | lockfile v9; versões diretas idênticas às do lockfile npm (D-03); não editar à mão | pnpm 11 | CA-01, CA-05 |
| `package-lock.json` | Remove | lockfile npm | removido depois do `pnpm import`; as versões anteriores permanecem acessíveis via Git para a comparação | Git | CA-01 |

### Manifests dos workspaces e teste do Core

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/studio/package.json` | Modify | dependências `@stardust/core`, `@stardust/lsp`, `@stardust/validation`; pins; declarações | `workspace:*` nos três `@stardust/*`; pins de `typescript` e `@radix-ui/react-slot`; adições da tabela de pins | pnpm | CA-03, CA-04, CA-05 |
| `apps/crew/package.json` | Modify | `hono` | declara `hono` `4.13.1` usado por `src/controllers/tests/crew-rest-fixture.ts` | pnpm | CA-04 |
| `apps/server/package.json` | Modify | scripts `db:test`, `db:test:ci`, `db:revert`, `update`, `test:integration:ci`; dependências | `db:test` e `db:test:ci` terminam em `pnpm run db:migrate`; `db:revert` = `supabase migration repair --status reverted` (o ID é argumento posicional); `update` = `ncu -u -f` (a dependência é argumento posicional); `test:integration:ci` encadeia `pnpm run test:integration --shard=N/4 ...` sem `--`; `workspace:*` em core, email, lsp, validation; pin de `typescript`; adições da tabela | pnpm, Supabase CLI, npm-check-updates | CA-03, CA-06 |
| `apps/web/package.json` | Modify | script `queue`; dependências | `queue` = `pnpm dlx inngest-cli@latest dev --no-discovery -u http://localhost:3000/api/serverless`; `workspace:*` em core, lsp, validation; pin de `@radix-ui/react-slot`; adições da tabela | pnpm | CA-03, CA-06 |
| `packages/core/package.json` | Modify | `devDependencies` | declara `dependency-cruiser`; não declara `@stardust/lsp` | pnpm | CA-03, CA-04 |
| `packages/email/package.json` | Modify | `dependencies` | declara `react` e `@react-email/html` | pnpm | CA-04 |
| `packages/lsp/package.json` | Modify | `dependencies` | `@stardust/core` passa a `workspace:*` | pnpm | CA-03 |
| `packages/validation/package.json` | Modify | `dependencies` | `@stardust/core` passa a `workspace:*` | pnpm | CA-03 |
| `apps/server/jest.config.ts` | Modify | `transformIgnorePatterns` | `'node_modules/(?!(\\.pnpm/|(@mastra|@sindresorhus|escape-string-regexp|p-map|@workflow|tokenx|ai|@ai-sdk)/))'`; nenhuma outra opção muda | Jest | CA-04 (`startNodeServer.test.ts` passa) |
| `packages/lsp/src/DeleguaProvedorLsp.test.ts` | Create | suite `DeleguaProvedorLsp` com `node:test` | `new DeleguaProvedorLsp().addInputs([2], 'var num = numero(leia())')` retorna `'var num = numero(2)'` | `node:test`, `node:assert` | CA-04, CA-15 |
| `packages/core/src/global/domain/structures/tests/Code.test.ts` | Modify | caso `should replace only the leia call when adding inputs with a real DeleguaProvedorLsp` e `import { DeleguaProvedorLsp } from '@stardust/lsp'` | ambos removidos; novo caso `should return a new Code and keep the original value when adding inputs` (provider simulado com `ts-jest-mocker`, asserta que o retorno não é a instância original e que `code.value` não muda); os demais casos permanecem inalterados | Jest, `ts-jest-mocker` | CA-04, CA-15 (`check:coverage -- @stardust/core` não rebaixa o baseline) |

### Hooks e scripts

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `.husky/pre-commit` | Modify | comando do hook | `pnpm run check:code` | pnpm, Husky | CA-07 |
| `.husky/commit-msg` | Modify | comando do hook | `pnpm exec commitlint --edit ${1}` (equivalente a `--no-install`) | pnpm, commitlint | CA-07 |
| `scripts/check-plan-definition.mjs` | Modify | mensagens de uso | cita `pnpm run check:plan-definition <plan.md> [--json]` | Node.js | CA-06 |
| `scripts/check-spec-definition.mjs` | Modify | mensagens de uso | cita `pnpm run check:spec-definition <spec.md> [--json]` | Node.js | CA-06 |
| `scripts/check-spec-implementation.mjs` | Modify | mensagens de uso | cita `pnpm run check:spec-implementation <spec> [--base <git-ref>] [--json]` | Node.js | CA-06 |
| `scripts/check-test-integrity.mjs` | Modify | mensagens de uso | cita `pnpm run check:test-integrity [--base <git-ref>] [--json]` | Node.js | CA-06 |
| `scripts/check-complexity.mjs` | Modify | mensagens de erro | cita `pnpm install --frozen-lockfile` e `pnpm run update:complexity-baseline` | Node.js | CA-06 |
| `scripts/install-skills.mjs` | Modify | chamada `run('npx', ['skills', 'add', skill])` | usa `run('pnpm', ['dlx', 'skills', 'add', skill])` | pnpm | CA-06 |

### CI/CD

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `.github/actions/prepare-server-stack/action.yaml` | Modify | passos de setup e instalação | `pnpm/action-setup@v6`, `actions/setup-node@v7` com `cache: pnpm`, `pnpm install --frozen-lockfile`, `pnpm --filter @stardust/lsp run build`, `pnpm --filter @stardust/server run db:test:ci` | pnpm | CA-10 |
| `.github/workflows/studio-app-ci.yaml` | Modify | `paths`, setup, comandos | `paths` por `pnpm-lock.yaml` e `pnpm-workspace.yaml`; todos os jobs usam pnpm; `check:coverage` recebe `@stardust/studio` sem `--` | pnpm | CA-08 |
| `.github/workflows/core-package-ci.yaml` | Modify | `paths`, setup, comandos | idem para `@stardust/core` | pnpm | CA-08 |
| `.github/workflows/crew-app-ci.yaml` | Modify | `paths`, setup, comandos | idem para `@stardust/crew` | pnpm | CA-08 |
| `.github/workflows/server-app-ci.yaml` | Modify | `paths`, setup, comandos | idem para `@stardust/server`, `test:integration` com `--shard` sem `--` e `test:scripts` via pnpm | pnpm | CA-08 |
| `.github/workflows/server-app-production-cd.yml` | Modify | setup e passos de migration | `db:preflight`, `db:adopt` e `db:migrate` via `pnpm --filter @stardust/server run <script> --environment prod --phase <fase>` preservando `--rollback` | pnpm | CA-09 |
| `.github/workflows/web-app-ci.yaml` | Modify | `paths`, setup, retries de instalação, Playwright | `pnpm install --frozen-lockfile --prefer-offline` nos loops de retry; `pnpm --filter @stardust/web exec playwright install --with-deps chromium` | pnpm | CA-08 |
| `.github/workflows/dependabot-lockfile.yaml` | Modify | `paths`, setup, regeneração | `pnpm/action-setup@v6`; `pnpm install --lockfile-only --ignore-scripts`; `git add pnpm-lock.yaml`; `paths` com `pnpm-lock.yaml` e `pnpm-workspace.yaml`; sem `NPM_VERSION` | pnpm | CA-11 |

### Docker

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `Dockerfile.web` | Modify | estágios `builder`, `installer` | `corepack enable`; Turbo instalado com `pnpm add --global turbo`; `pnpm install --frozen-lockfile`; build por `pnpm exec turbo run build --filter=@stardust/web`; `ENV PNPM_HOME=/pnpm` e `PATH=$PNPM_HOME/bin:$PATH` no `builder`; `turbo prune` preserva `pnpm-workspace.yaml` e `pnpm-lock.yaml` (verificado); o installer copia `tsconfig.base.json` e `tsconfig.nextjs.json` antes do build | Docker, Turbo | CA-12, CA-13 |
| `Dockerfile.server` | Modify | estágios `builder`, `installer`, `runner` | idem, mais `ENV PNPM_HOME=/pnpm` e `PATH=$PNPM_HOME/bin:$PATH` no `builder` para o `pnpm add --global`; `pnpm run build:server`; o `COPY` do `runner` mantém `node_modules` raiz e por pacote preservando a estrutura de links | Docker, Turbo | CA-12, CA-13 |
| `Dockerfile.studio` | Modify | estágios `builder`, `installer` | idem, Turbo pinado em `2.10.2` como hoje; build por `pnpm --filter @stardust/studio run build` | Docker, Turbo | CA-12, CA-13 |
| `Dockerfile.crew` | Modify | estágio `build` | copia `pnpm-lock.yaml` e `pnpm-workspace.yaml` no lugar de `package-lock.json`; `corepack enable`; `pnpm install --frozen-lockfile --ignore-scripts`; `pnpm run build:crew`; mantém `HUSKY=0` | Docker | CA-12, CA-13 |
| `Dockerfile.crew.dockerignore` | Modify | allowlist | troca `!package-lock.json` por `!pnpm-lock.yaml` e `!pnpm-workspace.yaml` | Docker | CA-12 |

### Documentação viva

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `AGENTS.md` | Modify | comandos npm | todos viram pnpm (`pnpm --filter @stardust/web run ...`, `pnpm exec playwright ...`, `pnpm run check:code`) | pnpm | CA-14 |
| `README.md` | Modify | instalação e scripts | `pnpm install`, `pnpm run dev`, `pnpm run test`, `pnpm run test:core` | pnpm | CA-14 |
| `apps/studio/README.md` | Modify | comandos | `pnpm install`, `pnpm run dev`, `pnpm run build`; lista de lockfiles coerente | pnpm | CA-14 |
| `documentation/tooling.md` | Modify | comandos e tabela de scripts do Server | todos os comandos em pnpm; `db:revert` (`pnpm --filter @stardust/server run db:revert <id>`) e `update` (`pnpm --filter @stardust/server run update <dependência>`) documentados; `db:migrate` descrito como `tsx scripts/migrate-database.ts` e o exemplo `--schema-file` removido | pnpm | CA-14 |
| `documentation/infrastructure.md` | Modify | descrição das imagens | `pnpm install` nos estágios `installer` | Docker | CA-14 |
| `documentation/architecture.md` | Modify | linha 49 (`npm run db:test -w @stardust/server`) e linha 84 (tabela de stack, `TurboRepo, NPM`) | comando em pnpm e stack `TurboRepo, pnpm` | pnpm | CA-14 |
| `documentation/sdd.md` | Modify | comandos dos sensores e do preflight | comandos em pnpm, preservando a frase de elegibilidade de issues `chore` e `refactor` já adicionada | pnpm | CA-14 |
| `documentation/agents/implementation-reviewer-agent.md` | Modify | exemplo de tabela de sensores | `pnpm run check:types` | pnpm | CA-14 |
| `documentation/rules/studio-appllication-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/code-conventions-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/core-package-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/domain-objects-testing-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/handlers-testing-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/server-application-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/server-routes-testing-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/ui-layer-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/use-cases-testing-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/web-app-routes-testing-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/web-application-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/rules/widget-tests-rules.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/conclude-bug-report-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/conclude-report-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/conclude-spec-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/create-evaluation-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/create-performance-report-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/create-plan-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/create-security-report-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/create-spec-prompt.md` | Modify | comandos e elegibilidade | comandos em pnpm, preservando a elegibilidade de issues `chore` e `refactor` já adicionada | pnpm | CA-14 |
| `documentation/prompts/create-tests-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/implement-bug-fix-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/implement-plan-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/implement-spec-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/increase-test-coverage-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |
| `documentation/prompts/judge-plan-prompt.md` | Modify | comandos | formas pnpm | pnpm | CA-14 |

## Restrições técnicas e riscos

- **Argumentos**: use `pnpm run <script> <args>` e `pnpm --filter <ws> run <script> <args>`; nunca `--` separador. Cada chamada com argumentos (CD de produção, `check:coverage`, `test:integration --shard`, checkers de Spec) é coberta por CA-06 e CA-09.
- **Entradas de runtime**: no runner do Server, links de workspace cujo destino não é copiado (por exemplo `@stardust/email`, embutido por `noExternal`) ficam pendentes sem efeito; o smoke confirma que nada em runtime os resolve.
- **Peer dependencies e configs**: conflitos de peer revelados pela instalação estrita são tratados no `pnpm-workspace.yaml` apenas com justificativa por escrito em `evaluation.md`; hoisting global não é permitido sem decisão registrada.
- **Node**: pnpm 11 exige Node `>=22.13`; ambientes locais e CI com Node 22 abaixo disso falham na instalação e devem atualizar.
- **Cobertura de core**: a remoção do caso de teste pode reduzir a cobertura de `Code`. Se `check:coverage -- @stardust/core` falhar, a execução para e a decisão D-08 é reaberta; o baseline não é rebaixado. O `check:test-integrity` é atendido pelo caso de imutabilidade (D-13).
- **Pacotes públicos**: `@stardust/core` e `@stardust/lsp` têm `private: false` e `publishConfig`; após a migração `@stardust/lsp` declara `@stardust/core` como `workspace:*`. Não existe workflow de publicação no repositório; qualquer publicação manual deve usar `pnpm publish`, que reescreve `workspace:*` (o `npm publish` o deixaria sem resolução).
- **Validação local das imagens**: o `email export` do Email falha localmente e em Docker com `space-y-5 cannot be inlined`, tanto no commit-base (npm) quanto com pnpm, e passa no CI do GitHub. A imagem do Server é validada com uma cópia de scratch do Dockerfile que constrói `core`, `validation` e `lsp`, executa `tsup` do Server e `replace-packages-imports.mjs` sem o `email export` (o Server embute o Email por `noExternal`); `build:server` no CI do PR continua sendo a prova do build completo. As imagens web e studio usam cópias de scratch com as variáveis de build que o Coolify injeta. Nenhuma cópia de scratch é versionada.
- **Server integration**: o ambiente local compartilha portas e dados com o stack Supabase já em execução; a suíte `test:integration` do Server não é executada contra esse stack compartilhado e é comprovada pelo job de integração do CI do PR (CA-10), registrado como pendente até o HEAD do PR.
- **Dependabot**: o comportamento real com `pnpm-lock.yaml` 11 só é observável em um PR do Dependabot; `evaluation.md` registra o item como pendente pós-merge.

# Validation Contract

## Sensores

`pnpm install --frozen-lockfile`, `pnpm run format`, `pnpm run check:code`, `pnpm run check:types`, `pnpm run test:unit`, `pnpm run check:architecture`, `pnpm run test:integration` (Server após `pnpm --filter @stardust/server run db:test`; Web conforme `AGENTS.md`), `pnpm run test:coverage` e `pnpm run check:coverage <workspace>` para `@stardust/core`, `@stardust/server`, `@stardust/studio` e `@stardust/web`, `pnpm run check:test-integrity`, `pnpm run check:spec-definition documentation/features/global/pnpm-migration/spec.md` e `pnpm run check:spec-implementation documentation/features/global/pnpm-migration/spec.md --base <commit-base>`. Checks do PR e build são validações finais de CI no HEAD do PR.

## Procedimentos de evidência

| ID | Procedimento | Evidência esperada |
| --- | --- | --- |
| EV-01 | `pnpm install --frozen-lockfile` em clone limpo; inspeção do `pnpm-workspace.yaml` e do `pnpm-lock.yaml` (overrides, `allowBuilds`, ausência de hoisting) | instalação sem erro, sem build script ignorado |
| EV-02 | inspeção das dependências `@stardust/*`; `turbo run build --dry=json`; varredura estática dos imports de cada workspace contra o `package.json` do próprio workspace; `check:types`, `test:unit` e `build` | zero `*`, zero ciclo, zero import não declarado, sensores verdes |
| EV-03 | para cada importer, comparar a versão resolvida de cada dependência direta no `package-lock.json` da base (`git show <base>:package-lock.json`, resolvendo primeiro `node_modules` aninhado do workspace e depois a raiz) com o importer do `pnpm-lock.yaml`; listar `name@version` exclusivos de cada lockfile | zero diferenças diretas; drift transitivo listado em `evaluation.md` |
| EV-04 | busca textual nos manifests, hooks e `scripts/`; sondas: `pnpm run check:spec-definition <spec>`, `pnpm --filter @stardust/server run update <dependência inexistente>` (não altera manifesto), `pnpm --filter @stardust/server run db:revert --help` (mostra o comando resolvido com o posicional), `pnpm exec commitlint` com mensagem válida e inválida | zero ocorrências npm; argumentos chegam sem `--`; hooks funcionam |
| EV-05 | busca textual em `.github/`; leitura comparativa do CD de produção; lint estático das workflows; execução dos jobs do PR | zero npm; CD preserva flags; jobs verdes no HEAD |
| EV-06 | `docker build` das quatro imagens (web e studio por cópia de scratch do Dockerfile com `ENV` de build fictícios, não versionada); smoke de VM-01 | quatro builds e smokes aprovados |
| EV-07 | busca textual nas docs vivas e `git diff --stat` dos históricos | só menções históricas; históricos sem diff |
| EV-08 | execução dos sensores acima no candidato integrado | todos aprovados, baselines intactos |
| EV-09 | resumo de app/rota, resultado e status dos endpoints essenciais de VM-02 e VM-03 | caminhos felizes aprovados, `2xx` |

## Validação manual

| ID | Procedimento | Resultado esperado |
| --- | --- | --- |
| VM-01 | Para cada imagem: Server — `docker run` com um comando `node -e` que resolve `@stardust/core`, `@stardust/validation`, `@stardust/lsp` e uma dependência de runtime, e depois inicia `node apps/server/build/main.js` com o `.env.local` da raiz; Web — inicia `node apps/web/server.js` com env local; Studio — `curl` na porta do nginx retorna `200`; Crew — o container permanece em execução por pelo menos 10 s sem `Cannot find module` nem `ERR_MODULE_NOT_FOUND` nos logs | nenhuma falha de resolução de módulo; valores de env nunca impressos |
| VM-02 | Com Server local (`http://localhost:3334`) e Web local (`http://localhost:3000`) iniciados via pnpm, entrar com a conta demo do seed pelo Playwright CLI, aguardar `/space` e confirmar `GET /auth/account` e `GET /space/planets` com `2xx` | login, rota protegida e endpoints essenciais aprovados |
| VM-03 | Com o Server local e o Studio local iniciados via pnpm, entrar no Studio com a conta do seed e acessar `/profile/users` | heading `Usuários` visível e listagem `2xx` |

VM-01 a VM-03 exercitam apenas caminhos felizes; estados de erro, loading e recovery não são explorados. Credenciais vêm somente das variáveis de ambiente e dos exportadores `export-*-app-e2e-env.mjs --seed`, nunca de arquivos versionados ou logs. Após uma correção, repita apenas o caminho afetado.

# Documentation alignment and revision history

Esta entrega atualiza `AGENTS.md`, `README.md`, os READMEs dos apps e pacotes, `documentation/{tooling,architecture,infrastructure,sdd}.md`, as Rules, os prompts e o agent listados no mapa. `documentation/prompts/create-spec-prompt.md` e `documentation/sdd.md` já receberam, na autoria desta Spec, a elegibilidade de issues `chore` e `refactor` para originar uma Spec. O Rule Pack aplicável é `documentation/rules/rules.md`, `documentation/sdd.md` e `documentation/rules/crew-app-rules.md` (por `Dockerfile.crew` e pelo CI do Crew), além de `documentation/rules/core-package-rules.md` e `documentation/rules/domain-objects-testing-rules.md` por causa de `Code.test.ts`, `documentation/rules/lsp-layer-rules.md` por causa do novo teste em `packages/lsp` e `documentation/rules/server-application-rules.md` por causa de `apps/server/jest.config.ts`. Nenhuma outra Rule de camada de produto é afetada. Depois de implementada, recomenda-se `create-plan` seguido de `implement-spec`: há múltiplas frentes com ownership distinto (manifests/lockfile, CI, Docker, docs) e necessidade de ledger de recuperação.

| Revision | Date | Status | Change |
| --- | --- | --- | --- |
| 1 | 2026-11-07 | draft | Criada a partir da Issue #632 após Grilling (D-01 a D-10). |
| 1 | 2026-11-07 | open | `check:spec-definition` passou. Spec Reviewer da revisão 1: clear. Observações não bloqueantes verificadas e incorporadas (citação das linhas 49 e 84 de `architecture.md`, busca de CA-14 sem diferenciar maiúsculas, restrição sobre publicação dos pacotes públicos e Rule Pack ampliado); nova confirmação do mesmo Reviewer após o amendment: clear. |
| 2 | 2026-11-07 | draft | Amendment durante `implement-spec` (achados reais): D-11 (overrides de `@ai-sdk/provider-utils` não migram), D-12 (Jest do Server ciente do layout `.pnpm`), D-13 (teste real movido para `packages/lsp` e caso de imutabilidade no Core), declaração de `typescript` no Email e ajustes de Docker. Spec Reviewer da revisão 2: clear (observação sobre o Rule Pack incorporada). |
| 3 | 2026-11-07 | in_progress | Rebase sobre `origin/main`: o workspace `apps/backoffice` passa a `apps/studio` (`Dockerfile.studio`, `studio-app-ci.yaml`, `studio-appllication-rules.md`); `apps/crew/README.md`, `packages/studio/README.md` e `crew-app-production-cd.yaml` não existem mais em `main` e saem do mapa. Contract de comportamento inalterado; evidências anteriores do workspace renomeado são reverificadas ou reportadas como pendentes de CI no `evaluation.md`. |
| 4 | 2026-11-08 | in_progress | Correções de CI-01/CI-02 do PR: D-14 (override de `tailwindcss` 4.1.18 para `@react-email/tailwind` e `react-email`, preservando a resolução do npm); `@types/jest`/`@types/node` declarados em Core, LSP e Validation (o linker estrito do pnpm não os expõe). Comportamento do Contract inalterado. |
