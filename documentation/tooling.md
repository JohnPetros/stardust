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
MCP do projeto. As skills de terceiros são restauradas de `skills-lock.json`
por `install-skills.mjs` (`pnpm dlx skills@1.8.1 install --frozen-lockfile`); para
adicionar ou remover uma skill, use `pnpm dlx skills add` ou `remove`, que
atualizam o lock. O lock fixa a origem e o `computedHash` do conteúdo de cada
skill, e o modo `--frozen-lockfile` recalcula esse hash e falha quando o conteúdo
baixado difere; por isso a versão da CLI fica fixada no script. Revise toda
alteração de `skills-lock.json` no PR como uma mudança de dependência. Os scripts de exportação de ambiente imprimem atribuições para
o shell atual; carregue-as com `eval`:

```bash
eval "$(node ./scripts/export-backoffice-app-e2e-env.mjs)"
eval "$(node ./scripts/export-web-app-e2e-env.mjs)"
```

## Scripts de qualidade

| Script                               | Ferramenta              | Comportamento                                                                                      |
| ------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm run format`                    | Biome                   | formata e escreve arquivos                                                                         |
| `pnpm run check:code`                | Biome                   | lint/check read-only                                                                               |
| `pnpm run check:types`               | TypeScript              | typecheck sem emissão                                                                              |
| `pnpm run check:architecture`        | dependency-cruiser      | valida dependências entre camadas/apps                                                             |
| `pnpm run check:complexity`          | CodeMultiVitals         | falha quando a mudança leva uma função acima de um limite de erro ou piora uma que já estava acima |
| `pnpm run test:unit`                 | Jest/Vitest             | executa testes unitários por workspace                                                             |
| `pnpm run test:integration`          | Jest/Playwright         | executa as integrações declaradas pelos workspaces                                                 |
| `pnpm run check:spec-implementation` | Node.js                 | valida o mapa `Path \| Change \| ...` da Spec contra Git e filesystem e valida o `plan.md` da Spec |
| `pnpm run check:web-quality`         | Lighthouse + Playwright | mede páginas em execução e exige o mínimo de cada métrica                                          |

Exemplos de ciclo curto:

```bash
pnpm run format --filter=@stardust/core
pnpm run check:code --filter=@stardust/core
pnpm run check:types --filter=@stardust/core
pnpm --filter @stardust/core run test:unit <arquivos-de-teste>
```

## Execução local escopada

Esta seção é a fonte das verificações aplicáveis a uma mudança: as Specs e os workflows de
implementação derivam dela quais checks rodar, quando e em que forma de comando.

As suítes completas não são o padrão local. Execute só as verificações que o escopo da
alteração exige: o comportamento da Spec, as fronteiras de produção alteradas e os
consumidores diretamente afetados. Determine o impacto pelo diff e pelas dependências
reais, não por arquivos de nome parecido nem pelo fato de um app ter sido tocado. Uma
mudança de apresentação na Web não exige testes do Server; uma mudança no Server sem
efeito observável no navegador não exige testes de browser. Contratos compartilhados
acrescentam os testes dos consumidores realmente afetados, não todos os módulos.

| Verificação                 | Durante a implementação                                                                                                                                                                                                              | Verificação integrada                                                                                                                                                                                                                 | Após correção                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Unit/componente             | Rode os arquivos de teste afetados conforme o comportamento ficar coerente.                                                                                                                                                          | Confirme os resultados do comportamento no escopo e dos consumidores afetados.                                                                                                                                                        | Rerrode os arquivos que falharam ou foram invalidados.              |
| Integração do Server        | Escreva as asserções de fronteira; use feedback unit e estático durante a construção.                                                                                                                                                | Agrupe os arquivos de controller, rota ou migration afetados depois da integração, com fixtures descartáveis.                                                                                                                         | Rerrode a seleção afetada em sequência.                             |
| Integração Web (Playwright) | Escreva os cenários de rota ou jornada afetados; use feedback de componente e estático durante a construção.                                                                                                                         | Rode somente os arquivos de cenário afetados.                                                                                                                                                                                         | Rerrode os cenários afetados.                                       |
| Tipos                       | Verifique depois de mudar tipos públicos, schemas, assinaturas ou consumidores.                                                                                                                                                      | Rode o typecheck dos workspaces afetados e dos consumidores, com a configuração real.                                                                                                                                                 | Rerrode os projetos produtor e consumidor impactados.               |
| Lint                        | `check:code` no workspace alterado, sem escrita.                                                                                                                                                                                     | Confirme o lint do escopo.                                                                                                                                                                                                            | Reverifique os paths editados.                                      |
| Complexidade                | `pnpm --filter @stardust/<workspace> run check:complexity` quando a lógica alterada puder aumentar a complexidade e sempre que criar ou extrair um arquivo de código novo, inclusive Views (limite de erro de 70 linhas por função). | Rode `check:complexity` em cada workspace afetado antes de publicar: ele compara a mudança com o merge base de `origin/main`. Registre o resultado, os avisos novos e os limites.                                                     | Reverifique a lógica alterada; nunca relaxe os limites para passar. |
| Arquitetura e build         | `check:architecture` quando dependências, exports ou composição mudarem.                                                                                                                                                             | Rode os gates exigidos; o build ocorre na verificação integrada, não a cada edição.                                                                                                                                                   | Rerrode os gates cujas entradas ou afirmações mudaram.              |
| Qualidade web               | Quando a mudança alterar a composição, os assets ou o carregamento de uma rota de página da Web, inclua ou mantenha a rota em `scripts/web-quality.config.json`, com os mínimos de cada preset.                                      | Rode `pnpm run check:web-quality --route <nome>` contra um build de produção em execução; rotas com `auth: true` usam o exportador `--seed`. Se a rota já existia, meça-a antes da mudança para separar regressão de dívida anterior. | Rerrode a rota afetada.                                             |

A integração é um checkpoint, não um ritual por edição. Agrupe as seleções relacionadas
do Server para reaproveitar o setup das fixtures e serialize os comandos que usam
containers, para que processos independentes não disputem portas e serviços. Checks
read-only independentes podem rodar em paralelo quando não competem por recursos; geração,
builds dependentes e a validação das suas saídas permanecem sequenciais.

Use estas formas de comando com caminhos de arquivo verificados no código. Os caminhos são
relativos ao workspace. Filtros por nome exigem nomes verificados no código; evite globs
amplos ou buscas por palavra-chave que incluam testes alheios.

| Fronteira                            | Diretório | Forma do comando                                                                                                                  |
| ------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Unit Core, Server, Backoffice ou Web | Raiz      | `pnpm --filter @stardust/<workspace> run test:unit -- <arquivos-de-teste>`                                                        |
| Rotas Hono do Server                 | Raiz      | `pnpm --filter @stardust/server run test:hono <arquivos-de-teste>`, depois de `pnpm --filter @stardust/server run db:test`        |
| Integração do Server (todas)         | Raiz      | `pnpm --filter @stardust/server run test:integration <arquivos-de-teste>`, depois de `pnpm --filter @stardust/server run db:test` |
| Integração da Web                    | Raiz      | `pnpm --filter @stardust/web run test:integration <arquivos-de-teste>`                                                            |

Os scripts completos (`test:unit`, `test:integration`, `test:coverage` e `check:coverage`)
são comandos disponíveis, não um checklist local obrigatório. Amplie a seleção só quando o
impacto demonstrado abranger a suíte, por exemplo tokens e componentes compartilhados da
Web, contratos do Core, composição global do Server, ou rota, sessão e layout raiz com
várias jornadas, ou quando o usuário pedir a medição. Registre a dependência e o motivo.

O CI executa de forma independente, para cada PR, os jobs de arquitetura, lint, complexidade,
tipos, testes com cobertura e ratchet, integração e build de cada app ou pacote, e é a prova
das suítes completas. Os testes locais escopados e o ratchet de cobertura não o substituem.
Uma seleção vazia ou ignorada não passa só porque o comando terminou com sucesso: confirme a
contagem de testes e o resultado. Registre no `evaluation.md` os arquivos e cenários, os
comandos executados, as contagens, o resultado e o candidato avaliado, mantendo separados
os resultados de unit, integração do Server e integração da Web.

Os limites do dependency-cruiser ficam em `.dependency-cruiser.cjs`. Altere essa
configuração somente para representar limites legítimos, nunca para ocultar uma
regressão.

## Gate de complexidade

O CodeMultiVitals é fixado no `package.json` da raiz e no lockfile.
`.code-multivitals.json` define os limites de aviso e de erro para complexidade
ciclomática, complexidade cognitiva, tamanho de função, profundidade de
aninhamento e volume de Halstead; um valor acima do limite atinge aquele nível.
`scripts/check-complexity.mjs` mede o código de produção com o analisador do
CodeMultiVitals, excluindo testes, `routeTree.gen.ts` e os tipos gerados do
Supabase.

O gate julga a mudança, não a base inteira. Ele mede cada arquivo alterado no
branch de destino e na mudança, na mesma execução, sem baseline versionado. As
funções são pareadas por arquivo e nome, nunca por número de linha, e a detecção
de rename do Git acompanha arquivos movidos. Cada métrica é então comparada:

| Função e métrica no branch de destino                                         | Resultado bloqueante                     |
| ----------------------------------------------------------------------------- | ---------------------------------------- |
| Função nova                                                                   | Qualquer métrica acima do limite de erro |
| Métrica no limite de erro ou abaixo dele                                      | Passa a ficar acima do limite de erro    |
| Complexidade ciclomática, cognitiva ou aninhamento já acima do limite de erro | Qualquer aumento                         |
| Tamanho de função ou volume de Halstead já acima do limite de erro            | Aumento maior que 10%                    |

Avisos não bloqueiam: a saída lista as métricas que passaram a ficar em nível de
aviso. O índice de manutenibilidade e a detecção de clones não fazem parte do
gate. Complexidade ciclomática e tamanho de função incluem as funções aninhadas,
então um novo handler com desvio dentro de um hook ou componente React também
aumenta a complexidade da função externa.

Atualize `origin` com `git fetch origin` e rode o gate em todos os workspaces ou
em um só:

```bash
pnpm run check:complexity
pnpm --filter @stardust/core run check:complexity
pnpm --filter @stardust/core run check:complexity --base <git-ref> --head <git-ref>
```

Sem `--head`, a comparação é entre a árvore de trabalho, incluindo arquivos não
rastreados, e o ponto em que o branch saiu de `origin/main`. Use `--base` para
comparar com outro branch. Um código de saída diferente de zero é um check
reprovado, nunca uma limitação aceita. Corrija os resultados bloqueantes
refatorando; nunca relaxe os limites para passar.

Limites da comparação:

- uma função renomeada ou movida para outro arquivo conta como nova;
- um arquivo cujo rename o Git não reconhece conta como novo; renomeie arquivos
  versionados com `git mv`;
- métricas de tamanho ainda podem crescer até 10% a cada PR, sem teto cumulativo;
- funções com o mesmo nome em um arquivo são pareadas pelas medidas mais
  próximas;
- o analisador lê todo arquivo como TSX e o gate falha em um arquivo alterado que
  não consiga ler, como uma arrow genérica `<T>() => {}` em `.ts`; escreva
  `<T,>() => {}`.

No CI, Core, Server, Web e Backoffice têm o job `check-code-complexity`, e o
workflow `Packages complexity CI` roda o mesmo job para `email`, `lsp` e
`validation`. Cada job roda os testes do checker, executa o gate contra o branch
de destino (`--base HEAD^1`) e grava o resultado no resumo do job. Quando há
resultado bloqueante, aviso novo ou uma mudança que não pôde ser medida, o job
também comenta no PR com `scripts/comment-complexity-report.mjs`. Cada workspace
mantém um único comentário, atualizado nas execuções seguintes, inclusive para
`PASS`. Um PR sem nada a reportar não recebe comentário, e PRs de forks não são
comentados. `--output <path>` grava o relatório publicado no comentário.

## Gates de cobertura

A cobertura tem dois gates no CI: os pisos por workspace e a cobertura das linhas
alteradas.

### Pisos por workspace

`coverage-baseline.json` guarda o piso de linhas, statements, funções e branches
de Core, Server, Backoffice e Web. `pnpm run check:coverage <workspace>` falha
quando qualquer métrica fica abaixo dele. Os pisos ficam cerca de um ponto abaixo
dos últimos resultados do CI, para absorver pequenas variações. Eleve-os quando os
resultados subirem e nunca os reduza para uma mudança passar. O Backoffice mantém
o piso anterior onde um ponto de margem o reduziria.

O Core e a Web já relatavam os arquivos de produção que nenhum teste importa. O
Server também os inclui, para que um arquivo sem teste apareça com `0%`. Ficam
fora do relatório do Server os testes, fakers, declarações, barrels `index.ts`,
pastas `types/`, `database/drizzle/DatabaseAccess.ts` e o seed de
desenvolvimento (`database/seed.ts` e `database/seeders/`). O provider V8 do
Server conta como não cobertas todas as linhas de um arquivo que nenhum teste
carrega, inclusive comentários, e todas as linhas de um arquivo só de tipos:
mantenha tipos puros em pastas `types/`. O adapter legado `database/supabase`
continua medido.

### Cobertura das linhas alteradas

Em PRs, os jobs de testes de Core, Server e Web também exigem a cobertura das
linhas alteradas. `scripts/check-changed-coverage.mjs` cruza o relatório LCOV do
workspace com as linhas que o PR adiciona ou modifica em `src/` e exige ao menos
**80% das linhas executáveis** e **70% das branches** nessas linhas. Arquivos
excluídos do relatório não são medidos, e uma mudança sem linhas executáveis
passa. Backoffice e os demais pacotes não têm esse gate.

A cobertura da Web vem apenas do Jest: cenários Playwright não contam. No Server
ela combina testes unitários e de integração, a partir do relatório consolidado
por `test:coverage:merge`.

Cada job de testes grava no resumo as métricas, os pisos e as linhas sem
cobertura e envia o resumo e o LCOV como artifact por 14 dias. O comentário de
cada workspace no PR é publicado pelo job `coverage-comment`, com
`scripts/comment-coverage-report.mjs`: só esse job tem `pull-requests: write` e
ele não instala dependências. PRs de forks não são comentados.

Para reproduzir o gate depois de gerar a cobertura de um workspace:

```bash
node scripts/check-changed-coverage.mjs core packages/core/coverage/lcov.info --base "$(git merge-base origin/main HEAD)" --working-tree
```

`--working-tree` também mede linhas não commitadas e arquivos não rastreados.
Cobertura complementa as asserções de comportamento; sozinha, não prova
aceitação, autorização, falhas ou persistência.

## Gate de mutação

Em PRs que tocam o Core, o workflow `Core mutation CI` roda testes de mutação com
o Stryker e o runner do Jest. O Stryker introduz pequenos defeitos no código e
roda os testes relacionados; um defeito que nenhum teste detecta mostra uma
asserção fraca ou ausente. Os alvos são apenas os casos de uso,
`packages/core/src/<módulo>/use-cases/*.ts`, sem o `index.ts`. Web, Server e os
demais pacotes não têm esse gate. O Core declara o `jest-environment-node` na
mesma versão do seu Jest, porque o runner do Stryker o carrega a partir do pacote.

Os testes de casos de uso devem fixar os valores dos quais o resultado depende.
Um valor aleatório do faker faz o score variar entre execuções.

O score divide os mutantes detectados (`Killed` e `Timeout`) por todos, exceto
`Ignored`, `RuntimeError` e `CompileError`. Mutantes sem cobertura contam contra
o score.

| Caso                                              | Exigência                                           |
| ------------------------------------------------- | --------------------------------------------------- |
| Módulo                                            | Ao menos **70%**; já abaixo disso, não pode cair    |
| Arquivo novo                                      | Ao menos **70%**                                    |
| Arquivo alterado que estava com 70% ou mais       | Ao menos **70%**                                    |
| Arquivo alterado que estava abaixo de 70%         | Não pode cair, ou deve atingir 70%                  |
| Arquivo não alterado                              | Não pode cair                                       |

Os scores são comparados com o branch de destino, sem arredondamento. Um arquivo
sem mutantes passa. Um relatório ou arquivo ausente reprova. Renomear um caso de
uso conta como arquivo novo.

O CI mede o branch de destino e o merge do PR em quatro partes cada. O branch de
destino usa os próprios fontes, testes, configuração do Jest e dependências, e
recebe apenas as versões do PR para o Stryker e o `jest-environment-node`, além do
harness (`stryker.config.mjs`, `scripts/test-mutation.mjs` e
`scripts/mutation-targets.mjs`). O job `Mutation score` aplica o gate com
`scripts/check-mutation-score.mjs`, grava o resultado no resumo e envia a tabela
por arquivo no artifact `core-mutation-score`. O job `mutation-comment`, o único
com `pull-requests: write`, publica no PR a tabela por módulo e os arquivos
reprovados. PRs de forks não são comentados.

Para rodar localmente:

```bash
pnpm --filter @stardust/core run test:mutation --files src/ranking/use-cases/GetRankingUseCase.ts
```

Sem argumentos, o comando seleciona os casos de uso alterados desde o ponto em
que o branch saiu de `origin/main` e todos os do módulo quando um teste de caso de
uso muda. Mudanças em configuração compartilhada exigem `--files` ou `--all`, e
`--base <ref>` troca o ponto de comparação. `--shard N/M` requer `--all` e
`--dry-run` apenas lista o escopo. Uma seleção vazia falha. Os relatórios HTML e
JSON ficam em `packages/core/reports/mutation/`. O comando local não aplica o
gate, que compara os dois lados.

Aguarde toda asserção assíncrona com `await`. Sem ele, o mutante derruba o
processo do Jest, vira `RuntimeError` e fica fora do score.

## Scripts por workspace

As descrições abaixo refletem os scripts declarados nos `package.json` atuais.
Use `pnpm --filter <workspace> run <script>` para executar um script de um workspace a
partir da raiz.

### Raiz (`stardust`)

| Script                      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup`                     | Executa `scripts/setup-project.mjs` para configurar skills, comandos e MCP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `prepare`                   | Inicializa os hooks do Husky após a instalação das dependências.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `dev`                       | Inicia os processos de desenvolvimento definidos pelos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `prod`                      | Inicia os processos de produção definidos pelos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `build`                     | Compila os workspaces e substitui imports de pacotes pelos caminhos de build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `build:server`              | Compila o Server sem cache e substitui os imports de pacotes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `build:backoffice`          | Compila apenas o Backoffice.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `dev:backoffice`            | Inicia o painel administrativo em `http://localhost:8000`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `dev:studio`                | Inicia o editor local de animações, preferindo a porta `3030`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `build:studio`              | Compila o player de animações do pacote `@stardust/studio`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `build:web`                 | Compila apenas a Web App.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `build:core`                | Compila apenas o pacote Core.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `format`                    | Formata os arquivos dos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `check:code`                | Executa as verificações Biome dos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `check:types`               | Executa os typechecks dos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `check:architecture`        | Verifica as dependências entre camadas com dependency-cruiser.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `check:complexity`          | Compara a complexidade das funções alteradas com o branch de destino, sem baseline versionado.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `test`                      | Alias para `test:unit`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `test:unit`                 | Executa os testes unitários dos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `test:coverage`             | Executa cobertura dos workspaces com ratchet habilitado.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `check:coverage`            | Compara os relatórios de cobertura com `coverage-baseline.json` e falha quando um baseline diminui.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `check:test-integrity`      | Falha quando testes são enfraquecidos ou código testável alterado não tem teste correspondente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `check:spec-implementation` | Valida o mapa canônico de paths da Spec contra o diff Git e o filesystem e, quando existe, o `plan.md` da Spec. `--plan-only` valida só o Plan contra a Spec (sem exigir paths entregues); `--require-plan` exige o Plan com todas as linhas `completed` e lê a chave `plan:` do `evaluation.md` irmão: `plan: <path>` exige o Plan, `plan: none` é o opt-out explícito de entregas anteriores ao Plan e a ausência da chave é erro; sem `evaluation.md`, o Plan continua exigido.                                                                                                                                                                                               |
| `check:web-quality`         | Mede, com Lighthouse (mediana de 3 execuções por rota e preset), as rotas de `scripts/web-quality.config.json` numa aplicação já em execução (`--base <url>`, padrão `http://localhost:3000`; não faz build nem sobe servidor) e falha quando uma métrica não atinge o mínimo declarado: pontuações de categoria (`min`) e LCP, TBT e CLS (`max`). Rotas com `auth: true` entram com `WEB_APP_E2E_EMAIL` e `WEB_APP_E2E_PASSWORD` (`eval "$(node scripts/export-web-app-e2e-env.mjs --seed)"`). Meça um build de produção; contra o servidor de desenvolvimento o script avisa que os números não valem. `--route <nome>`, `--runs <n>` e `--json <caminho>` ajustam a execução. |
| `test:spec-implementation`  | Executa os testes do checker de conformidade de Spec.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `test:scripts`              | Executa os testes de todos os scripts auxiliares em `scripts/tests/`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `test:integration`          | Executa os testes de integração declarados pelos workspaces via Turbo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `test:server`               | Executa os testes unitários do `@stardust/server`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `test:backoffice`           | Executa os testes unitários do `@stardust/backoffice`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `test:web`                  | Executa os testes unitários do `@stardust/web`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `test:core`                 | Executa os testes unitários do `@stardust/core`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

`check:test-integrity` exige um teste alterado no mesmo workspace somente para
source executável em alvos testáveis: controllers, jobs, use-cases, objetos de
domínio (`entities`, `structures`, `aggregates`), hooks, views/widgets, rotas
Web (`app/page`, `app/layout`, `app/route`), rotas Server (`tests/hono/routes`),
RPC actions e AI tools.
Barrels (`index.*`), services/repositories genéricos, constantes, interfaces,
tipos e código gerado, fixtures, mocks e a própria infraestrutura de testes
ficam fora desse pareamento; o resultado JSON lista esses caminhos em
`excludedSourcePaths`. Arquivos de teste permitidos ficam em `scripts/tests/**`
ou no diretório `tests/` da própria camada: objetos de domínio
(`domain/entities|structures|aggregates`), use-cases, controllers REST,
jobs, hooks, widgets/views, páginas/rotas Web, rotas Server, RPC actions e AI
tools. Testes colocalizados de views e hooks de `contexts`
(`ui/**/contexts/**/tests`) também são locais permitidos; testes dedicados de
constantes, providers, fixtures e clients (objetos `*Client`) continuam rejeitados. Um teste fora desses
locais aparece em `forbiddenTestPaths` e falha o CI.

### `apps/server`

| Script                | Descrição                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `dev`                 | Inicia a API em modo watch com `.env.local`.                                                               |
| `lint`                | Executa o lint de `src` com nível de diagnóstico de erro.                                                  |
| `format`              | Formata `src` e grava as alterações.                                                                       |
| `check:code`          | Verifica `src` com Biome, sem aplicar correções.                                                           |
| `check:types`         | Executa o TypeScript sem emitir arquivos.                                                                  |
| `check:complexity`    | Verifica a complexidade do código alterado em `apps/server`.                                               |
| `check:architecture`  | Verifica as dependências arquiteturais do Server com dependency-cruiser.                                   |
| `check:updates`       | Lista atualizações de dependências com `ncu`.                                                              |
| `build`               | Compila o Server com tsup.                                                                                 |
| `prod`                | Inicia o build do Server usando `.env`.                                                                    |
| `db:test`             | Inicia os serviços Supabase necessários e reinicia o banco local de testes.                                |
| `db:migrate`          | Aplica as migrations Drizzle com `tsx scripts/migrate-database.ts`, inclusive as posteriores à transição.  |
| `db:preflight`        | Verifica o estado de transição ou, com migrations posteriores, o prefixo e o journal completo no ledger.   |
| `db:prod`             | Vincula a CLI Supabase ao projeto de produção.                                                             |
| `db:dev`              | Vincula a CLI Supabase ao projeto de desenvolvimento.                                                      |
| `db:pull`             | Baixa os schemas Auth, Public, Storage e Realtime.                                                         |
| `db:push`             | Aplica migrations ao projeto Supabase vinculado.                                                           |
| `db:types`            | Gera os tipos TypeScript do banco de desenvolvimento.                                                      |
| `db:revert`           | Marca uma migration como revertida; o ID da migration é argumento posicional.                              |
| `update`              | Atualiza uma dependência específica com `ncu`; o nome da dependência é argumento posicional.               |
| `test:unit`           | Executa o projeto Jest `unit` do Server (controllers, jobs, tools e demais testes sem serviço externo).    |
| `test:coverage`       | Executa os testes unitários do Server com relatório JSON de cobertura.                                     |
| `test:coverage:merge` | Consolida a cobertura unitária e dos seis shards de integração do Server em resumo e LCOV antes dos gates. |
| `test:hono`           | Executa o projeto Jest `hono` do Server (testes de rotas HTTP; exige Supabase local).                      |
| `test:inngest`        | Executa o projeto Jest `inngest` do Server (exige Supabase local e o Inngest Dev Server).                  |
| `test:integration`    | Executa os projetos `hono` e `inngest` do Server.                                                          |

Exemplos de comandos de banco:

```bash
pnpm --filter @stardust/server run db:dev
pnpm --filter @stardust/server run db:migrate
pnpm --filter @stardust/server run db:revert 20240101000000
pnpm --filter @stardust/server run update nome-do-pacote
```

Os comandos `db:prod`, `db:push` e `db:revert` alteram estado externo ou o
histórico de migrations. Confirme o projeto e os parâmetros antes de executá-
los.

### `apps/backoffice`

| Script               | Descrição                                                                    |
| -------------------- | ---------------------------------------------------------------------------- |
| `dev`                | Inicia o servidor de desenvolvimento do Backoffice na porta `8000`.          |
| `build`              | Gera o build do Backoffice com React Router.                                 |
| `start`              | Serve o arquivo estático do Backoffice a partir de `build/client`.           |
| `lint`               | Executa o lint de `src` com nível de diagnóstico de erro.                    |
| `format`             | Formata `src` e grava as alterações.                                         |
| `check:code`         | Verifica `src` com Biome, sem aplicar correções.                             |
| `check:types`        | Gera os tipos do React Router e executa o TypeScript.                        |
| `check:complexity`   | Verifica a complexidade do código alterado em `apps/backoffice`.             |
| `check:architecture` | Verifica as dependências arquiteturais do Backoffice com dependency-cruiser. |
| `test:unit`          | Executa os testes unitários do Backoffice.                                   |
| `test:coverage`      | Executa os testes unitários do Backoffice com relatório JSON de cobertura.   |
| `test:unit:watch`    | Executa os testes unitários do Backoffice em modo watch.                     |

### `apps/web`

| Script                     | Descrição                                                                 |
| -------------------------- | ------------------------------------------------------------------------- |
| `dev`                      | Inicia a Web App em desenvolvimento na porta `3000`.                      |
| `build`                    | Gera o build de produção da Web App com Next.js.                          |
| `start`                    | Inicia o build standalone usando a porta definida em `PORT`.              |
| `check:code`               | Verifica `src` e `tests` com Biome, sem aplicar correções.                |
| `check:types`              | Executa o TypeScript sem emitir arquivos.                                 |
| `check:complexity`         | Verifica a complexidade do código alterado em `apps/web`.                 |
| `check:architecture`       | Verifica as dependências arquiteturais da Web App com dependency-cruiser. |
| `lint`                     | Executa o lint de `src` com nível de diagnóstico de erro.                 |
| `format`                   | Formata `src` e grava as alterações.                                      |
| `test:unit`                | Executa os projetos Jest `widgets`, `handlers` e `app`.                   |
| `test:widgets`             | Executa o projeto Jest `widgets` (hooks e views de `src/ui`).             |
| `test:handlers`            | Executa o projeto Jest `handlers` (actions e controllers).                |
| `test:app`                 | Executa o projeto Jest `app` (páginas, slots e rotas).                    |
| `test:coverage`            | Executa os testes unitários da Web App com relatório JSON de cobertura.   |
| `test:unit:watch`          | Executa os testes unitários da Web App em modo watch.                     |
| `test:integration`         | Executa os testes Playwright de `apps/web/tests`.                         |
| `test:integration:ui`      | Abre a interface do Playwright para os testes de integração.              |
| `test:integration:debug`   | Executa os testes Playwright em modo de depuração.                        |
| `test:integration:install` | Instala o navegador Chromium usado pela integração.                       |

### `packages/core`

| Script               | Descrição                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| `build`              | Compila o pacote Core com tsup.                                        |
| `check:types`        | Executa o TypeScript sem emitir arquivos.                              |
| `check:code`         | Verifica `src` com Biome, sem aplicar correções.                       |
| `check:complexity`   | Verifica a complexidade do código alterado em `packages/core`.         |
| `check:architecture` | Verifica as dependências arquiteturais do Core com dependency-cruiser. |
| `lint`               | Executa o lint de `src` com nível de diagnóstico de erro.              |
| `format`             | Formata `src` e grava as alterações.                                   |
| `test:unit`          | Executa os testes unitários do Core.                                   |
| `test:coverage`      | Executa os testes unitários do Core com relatório JSON de cobertura.   |
| `test:mutation`      | Roda testes de mutação nos casos de uso do Core (ver "Gate de mutação"). |

### `packages/email`

| Script             | Descrição                                                 |
| ------------------ | --------------------------------------------------------- |
| `dev`              | Inicia o editor de emails na porta `3001`.                |
| `build`            | Exporta os templates de email para `build`.               |
| `format`           | Formata os templates e partials.                          |
| `check:code`       | Verifica templates e partials com Biome.                  |
| `check:types`      | Executa o TypeScript sem emitir arquivos.                 |
| `check:complexity` | Verifica a complexidade dos templates de email alterados. |

### `packages/studio`

Ferramenta local de autoria de animações Lottie, independente do painel
administrativo em `apps/backoffice`. Use `pnpm run dev:studio` na raiz.
O Vite prefere a porta `3030` e informa outra porta se ela estiver ocupada.
Não exige Server, Supabase, credenciais ou variáveis de ambiente.

| Script        | Efeito                                                         |
| ------------- | -------------------------------------------------------------- |
| `dev`         | Inicia o editor Vite e o backend local de arquivos.            |
| `build`       | Verifica tipos e gera o player estático em `dist`.             |
| `preview`     | Serve o build estático, sem endpoints de edição.               |
| `check:code`  | Verifica UI, plugin e scripts com Biome.                       |
| `check:types` | Executa TypeScript sem emissão.                                |
| `format`      | Formata o código com Biome.                                    |
| `postinstall` | Copia o CanvasKit WASM para `public`, sem versionar o binário. |

O `pnpm run dev` geral não inicia esta ferramenta. `pnpm run build:studio`
gera seu build pela raiz. Os checks gerais de código e tipos incluem o pacote
via Turbo. O smoke manual abre uma cena, valida playback, controles e gravação
em `lottie.json`; não usa o fluxo autenticado do Backoffice administrativo.

### `packages/lsp`

| Script             | Descrição                                                     |
| ------------------ | ------------------------------------------------------------- |
| `build`            | Compila o pacote LSP com tsup.                                |
| `check:types`      | Executa o TypeScript sem emitir arquivos.                     |
| `check:code`       | Verifica `src` com Biome, sem aplicar correções.              |
| `check:complexity` | Verifica a complexidade do código alterado em `packages/lsp`. |
| `lint`             | Executa o lint dos arquivos TypeScript de `src`.              |
| `format`           | Formata os arquivos TypeScript de `src`.                      |
| `test:unit`        | Executa os testes Node do LSP com o carregador tsx.           |

### `packages/validation`

| Script             | Descrição                                                            |
| ------------------ | -------------------------------------------------------------------- |
| `build`            | Compila o pacote Validation com tsup.                                |
| `check:types`      | Executa o TypeScript sem emitir arquivos.                            |
| `check:code`       | Verifica `src` com Biome, sem aplicar correções.                     |
| `check:complexity` | Verifica a complexidade do código alterado em `packages/validation`. |
| `lint`             | Executa o lint de `src` com nível de diagnóstico de erro.            |
| `format`           | Formata `src` e grava as alterações.                                 |

## Seed local por módulo

O seed é independente de `db:test` e usa um snapshot versionado do conteúdo do
Supabase staging (`rveubqzvfbqbcpmuevnm`), exportado em 2026-10-10. Não acessa
staging durante a execução. O entry point é
`apps/server/src/database/seed.ts`; cada domínio possui seu seeder em
`apps/server/src/database/seeders/<Domínio>Seeder.ts`, com `clear()` e `run(seed)`.

Prepare o stack e aplique as migrations com `pnpm --filter @stardust/server run db:test`.
As contas locais são fixtures públicas fixas definidas em
`apps/server/src/database/seeders/seed-accounts.json`: `explorer@stardust.local`
e `studio@stardust.local`. Seus IDs terminam em `0001` e `0002`, respectivamente.
O seed não usa `WEB_APP_E2E_*` ou `BACKOFFICE_APP_E2E_*`. Inclua o UUID completo do
Backoffice (`00000000-0000-4000-8000-000000000002`) em `GOD_ACCOUNT_IDS` da raiz e do
Server local. Para o Playwright manual, carregue o exportador correspondente com
`--seed`; sem essa opção ele mantém o suporte às credenciais privadas da raiz.

```bash
# Valida configuração e snapshot sem conectar ao banco
pnpm --filter @stardust/server run db:seed --check

# Substitui dados da aplicação e usuários Auth locais
pnpm --filter @stardust/server run db:seed
```

O comando exporta a conexão local a partir do `.env.local` raiz com
`scripts/export-local-database-env.mjs` e carrega as credenciais apenas no
processo. Recusa hosts remotos, outros bancos, parâmetros de conexão que
redirecionem o destino e modo de produção. Limpeza e inserção acontecem numa
única transação, com lock para serializar execuções concorrentes. Uma falha
reverte também o reset de Auth; o pool fecha ao concluir ou falhar.

### Seed de staging

`pnpm --filter @stardust/server run db:seed:staging` (`seed.ts --environment staging`)
carrega o mesmo catálogo versionado e as contas de demonstração no projeto de staging
(`rveubqzvfbqbcpmuevnm`), sem ler o `.env.local`: `DATABASE_URL`, `SEED_EXPLORER_PASSWORD`
e `SEED_ADMIN_PASSWORD` vêm só de variáveis de ambiente (no CD, de secrets do
environment `staging`). A guarda recusa, antes de qualquer escrita, a ausência das
senhas, o host de produção (`aukqejqsiqsqowafpppb`) ou de outro projeto e `MODE=production`;
`--environment local` (o padrão de `db:seed`) mantém a guarda de loopback e as senhas
do fixture. Não rode localmente contra staging: o comando existe para o workflow
`Server app staging CD`.

`node scripts/seed-staging-assets.mjs` envia ao R2 de staging as dez imagens
`images/planets/planet-<id>-image.webp` referenciadas por `seed-catalog.json`
(`Content-Type: image/webp`, `CacheControl: no-cache`, endpoint
`https://<S3_ACCOUNT_ID>.r2.cloudflarestorage.com`) e confirma a leitura pública de cada
uma em `STAGING_CDN_URL`. Lê `S3_ACCOUNT_ID`, `S3_BUCKET_NAME`, `S3_ACCESS_KEY_ID` e
`S3_SECRET_ACCESS_KEY` (secrets) e as variables `STAGING_ASSETS_BUCKET`,
`PRODUCTION_ASSETS_BUCKET` e `STAGING_CDN_URL`. Recusa, antes de qualquer chamada ao R2,
credenciais ausentes, bucket diferente de `STAGING_ASSETS_BUCKET`, bucket igual a
`PRODUCTION_ASSETS_BUCKET`, `MODE=production`, catálogo ou imagem ausente. Nunca lista,
apaga nem altera policy, e não imprime credenciais. O teste, sem rede, é
`node --test scripts/tests/seed-staging-assets.test.mjs`. Produção não tem script:
o envio das dez imagens ao R2 de produção é um passo manual do release
(`documentation/infrastructure.md`).

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
Execute `pnpm --filter @stardust/server run storage:seed` depois de preparar o MinIO
local. O comando usa o `.env.local` da raiz, exige endpoint HTTP em
`127.0.0.1`, preserva os nomes do catálogo e publica 115 imagens (`.svg`, `.jpg`
e `.webp`), incluindo as que não são referenciadas pelo catálogo. Confirma por HTTP anônimo os 102 arquivos
referenciados pelos dez planetas, pelas 17 conquistas, pelos 55 avatares, pelos seis tiers e pelos 10 foguetes. Não altera o banco; pode ser executado novamente para atualizar os
arquivos. Remove do bucket os objetos em `images/planets/`, `images/achievements/`,
`images/avatars/`, `images/rankings/`, `images/rockets/` e `lotties/galaxies/` que não
existem mais no repositório; outras pastas, como uploads, não são tocadas. A policy existente é preservada e recebe permissão de leitura pública
somente para `images/planets/*`, `images/achievements/*`, `images/avatars/*`, `images/rankings/*`, `images/rockets/*` e `lotties/galaxies/*`. Uploads e outras pastas não recebem permissões.

O mesmo comando envia, para cada galáxia do catálogo, a cena
`packages/studio/public/projects/galaxies/<slug>/lottie.json` como
`lotties/galaxies/<animation>` com `Content-Type: application/json`, exigindo JSON com
`layers`, e confirma a leitura anônima de cada arquivo. As cenas são editadas e
visualizadas com `pnpm run dev:studio`.
Configure `NEXT_PUBLIC_CDN_URL` na Web e `VITE_CDN_URL` no Backoffice com a URL
impressa pelo comando (`http://127.0.0.1:<MINIO_API_PORT>/<MINIO_BUCKET>`).
Os avatares preservam os nomes `.jpg` do catálogo; o Content-Type corresponde
aos bytes originais (JPEG, AVIF ou WebP). As imagens principais dos oito planetas da
trilha são `planet-<id>-image.webp` (512 × 512, fundo transparente); os ícones e o
planeta de teste continuam em SVG. A verificação HTTP compara os bytes
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
node --test scripts/tests/seed-database.test.mjs scripts/tests/seed-staging-assets.test.mjs

# Validação explícita e destrutiva, exclusivamente no banco local
eval "$(node scripts/export-local-database-env.mjs)"
STARDUST_LOCAL_SEED_TEST=1 node --env-file=.env.local --test scripts/tests/seed-database.integration.test.mjs
```

A integração recria o seed duas vezes, autentica as contas pelo GoTrue local,
verifica seus perfis e força uma falha de inserção para confirmar rollback.
Sem `STARDUST_LOCAL_SEED_TEST=1`, esse teste não altera o banco.

### Migrations posteriores à transição

O estado `server-owned` admite ledger com mais de três linhas, desde que as três
primeiras sejam exatamente as migrations da transição (`0000_baseline`,
`0001_application_objects` e `0002_server_owned_access`). Com exatamente três
linhas, `db:preflight --phase server-owned` mantém a comparação exata com o manifest
legado; com mais linhas, confirma o prefixo idêntico, que todas as entradas do
`meta/_journal.json` estão no ledger com o mesmo hash e `created_at` e que não há
caminho de acesso externo (`auditExternalExposure`). O journal aceita entradas após
as três da transição desde que tenham `idx` sequencial, `when` crescente e
`breakpoints`; qualquer outro desvio falha com `Unexpected migration journal`.
Os estados `legacy` e `adopted` não mudam.

`db:migrate --phase server-owned` aplica as migrations pendentes sob a mesma sessão e o
mesmo advisory lock e revalida o estado ao final. O rollback de acesso
(`--rollback`) recusa ledgers com mais de três linhas.

```bash
pnpm --filter @stardust/server run db:preflight --phase server-owned
pnpm --filter @stardust/server run db:migrate --phase server-owned
pnpm --filter @stardust/server run db:preflight --phase server-owned
```

O teste de integração das migrations de galáxias é opt-in e só roda no banco local
loopback já migrado. Ele executa tudo em uma transação sempre encerrada com
`ROLLBACK`; sem a variável, não altera o banco.

```bash
eval "$(node scripts/export-local-database-env.mjs)"
STARDUST_LOCAL_MIGRATION_TEST=1 node --env-file=.env.local --test scripts/tests/galaxies-migration.integration.test.mjs
```

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
pnpm --filter @stardust/server run db:test
pnpm --filter @stardust/server run test:integration
```

Os projetos Jest do Server separam os testes por tipo: `unit` (controllers, jobs e
tools, sem serviço externo), `hono` (rotas HTTP) e `inngest` (Inngest Functions
executadas por um Inngest Dev Server real). `test:integration` executa `hono` e
`inngest`; use `test:hono` ou `test:inngest` para um deles. O projeto `inngest`
exige o container `inngest` do `docker-compose.yml`, que chama o Server de volta em
`host.docker.internal:3334`. Pare o Server local antes de executá-lo, porque a
fixture ocupa essa porta fixa.

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

O Web App não consome mais `postgres_changes` do Realtime local: o sucesso do
Sign-up e das confirmações vem de polling REST (`PollingProfileChannel`). O
tenant do Realtime, a publicação `supabase_realtime` de `public.users` e o
`SELECT` para `anon`/`authenticated` permanecem somente até o follow-up de
infraestrutura que os remove. Se `/profile` retornar 500 com `Can't resolve 'apexcharts'`, reinstale as dependências na raiz.

`docker compose --env-file .env.local down` preserva os dados locais de
PostgreSQL e MinIO em `docker/volumes/`. Redis, Auth, PostgREST, Realtime,
Mailpit, Inngest, Kong e templates são descartáveis.

## Testes de integração

Os testes de integração da Web App usam Playwright, o ambiente
`apps/web/.env.testing` e o servidor de testes iniciado pela configuração da
suíte. Não aponte esse fluxo para produção nem use as credenciais reais do
Backoffice:

```bash
pnpm --filter @stardust/web run test:integration:install
pnpm --filter @stardust/web run test:integration
pnpm --filter @stardust/web run test:integration:debug
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

Os checks do PR são a composição dos checks normais. A cobertura segue os gates
descritos em [Gates de cobertura](#gates-de-cobertura).

No Server, o ratchet considera a cobertura conjunta dos testes unitários e dos
seis shards de integração, incluindo os adapters Drizzle exercitados pelas
rotas reais. Prepare o stack local, execute `test:integration:ci` e
`test:coverage` no workspace `@stardust/server`, depois `test:coverage:merge` e
`pnpm run check:coverage @stardust/server`. Nesse fluxo local, a consolidação
exige os sete relatórios completos (um unitário e seis de integração); um
relatório unitário isolado não aprova esse ratchet.
No CI do Server, cada um dos seis shards de integração roda em um job próprio
(`Integration tests (shard N/6)`), com stack local isolado, e envia seu relatório
como artifact. Os testes unitários também são divididos, em dois shards
(`Unit tests (shard N/2)`), e os testes de `scripts/tests` rodam somente no
primeiro. O job `Tests` baixa os oito relatórios, consolida com
`test:coverage:merge --unit-shards=2` e verifica o ratchet. O setup do stack
fica na action `.github/actions/prepare-server-stack`.
O CI do Server executa Node 24 para a coleta V8; a execução em Node 22 revelou
um abort nativo no inspector durante a instrumentação de cobertura. O caller de
revisão do Crew aguarda até 45 minutos pelos checks aplicáveis antes de iniciar
a revisão.

`check:dead-code` não faz parte dos sensores oficiais. Playwright MCP pode
inspecionar fluxos reais e o Hermes pode executar validações E2E de release, mas
nenhum dos dois substitui `test:integration` automatizado quando ele for
aplicável. Os workflows E2E do GitHub Actions estão descritos em
`documentation/infrastructure.md`.

## Transição aprovada: Drizzle e SSE (Issue #602)

Os scripts listados acima ainda descrevem o estado implementado. Para a entrega da Issue #602, o contrato de tooling é:

| Script Server  | Destino aprovado                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `db:generate`  | Drizzle Kit generate sobre src/database/drizzle/schema.ts agregando models; out em src/database/drizzle/migrations; execução local, sem introspecção remota implícita. |
| `db:migrate`   | Aplica migrations Drizzle pendentes; URL por ambiente, sem reset, sem execução no boot.                                                                                |
| `db:preflight` | Compara catálogo/histórico com baseline, apenas leitura; não imprime dados nem credenciais.                                                                            |
| `db:adopt`     | Adota baseline em banco existente somente após parity; nunca marca a migration de revogação como já aplicada.                                                          |
| `db:test`      | Prepara Compose com .env.local raiz, reset exclusivamente local, migrations Drizzle sem seed.                                                                          |

Scripts Supabase CLI de diff/push/pull/repair e geração de Database.ts são retirados; a Web não gera tipos de banco. pnpm/`pnpm-lock.yaml` permanecem a fonte das versões. Antes de qualquer aplicação remota, exige-se preflight de Dev e produção e ensaio de rollback em restauração isolada, com evidências no workflow SDD. A indisponibilidade desses ambientes nesta autoria não é evidência de parity. A janela inicial é coordenada, sem release intermediário compatível.

A lista de scripts passa a descrever o runtime vigente apenas após a implementação verificada; atualizar também a seção de migrations da infraestrutura nessa entrega.

## Crew

`apps/crew` é um workspace pnpm independente para revisão de PR com Mastra e
Anthropic direta. `pnpm run crew` carrega o `.env.local` raiz e inicia Crew;
`pnpm run dev` exclui esse workspace. Configure as variáveis listadas em
`apps/crew/.env.example`, incluindo `CREW_DATABASE_URL`, `CREW_PORT` e `CREW_HOST`,
para manter banco/porta/host separados dos apps de produto. Inicie o banco com
`docker compose --env-file .env.local --profile crew up -d --wait crew-db`.

Use `pnpm --filter @stardust/crew run <script>` para `check:code`, `check:types`,
`check:architecture`, `test:unit`, `test:integration` e `eval`; use
`pnpm run build:crew` para compilar. Os testes unitários usam modelos simulados;
integrações precisam de Docker; evals fazem chamadas pagas à Anthropic e ao
Composio. Node 24.11+ é recomendado para o toolchain de build. O CI próprio
valida o workspace e a imagem sem segredos de inferência.

`Crew PR review` substitui `Hermes code review`. O workflow usa
`pull_request_target`, executa `scripts/run-crew-pr-review.mjs` do base confiável
sem instalar dependências nem executar código do PR, aguarda somente os CIs
aplicáveis (incluindo Crew quando disparado) e publica resumo e comentários
inline via token do Actions. Configure os secrets `CREW_API_URL` e
`PR_REVIEWER_API_KEY` para o serviço Crew já implantado. O caller fica ativo após
ser incorporado ao `main`; não faz deploy. A primeira revisão de um PR é `full`;
os pushes seguintes são `incremental`, a partir do último commit com revisão
completa do bot, limitada ao que pertence ao PR (sem o que veio de merges de
`main`), com fallback para `full` quando o histórico foi reescrito. Os CIs
aplicáveis continuam sendo avaliados pelo PR inteiro. Revisões parciais ou bloqueadas falham
o check. Uma falha inesperada registra só um resumo seguro (classe do erro, código, comando,
status de saída e HTTP, endpoint do repositório), nunca mensagens, saídas de subprocesso nem
segredos. Como o script roda do `main`, uma correção nele só vale para os PRs seguintes. Testes determinísticos: `node --test scripts/tests/run-crew-pr-review.test.mjs`.

`Crew app CD` usa `.github/workflows/crew-app-production-cd.yaml` e
`scripts/deploy-crew.mjs` para deploys no Coolify após pushes relevantes em
`main` ou execução manual nessa branch. Configure `COOLIFY_WEBHOOK_CREW_PROD`,
`COOLIFY_API_TOKEN` e `CREW_API_URL` no GitHub; as credenciais de runtime ficam
no Coolify. O job verifica o SHA da implantação e exige `/health` com HTTP 200 e
`status: ok`, sem tratar o aceite do webhook como conclusão do deploy. Os
deploys são serializados e respeitam o ambiente `production`. O CI de Crew
também valida o script de CD: `node --test scripts/tests/deploy-crew.test.mjs`.

O exportador `scripts/export-backoffice-app-e2e-env.mjs` usa
`BACKOFFICE_APP_E2E_EMAIL` e `BACKOFFICE_APP_E2E_PASSWORD`. Durante a migração,
aceita também as chaves locais legadas `STUDIO_APP_E2E_*`, mas sempre exporta
as variáveis com o prefixo `BACKOFFICE_APP_E2E_`. As contas fixas do seed e
o namespace de sessão do navegador são preservados.
