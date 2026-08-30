---
description: Criar Pull Requests de release de main para production, com SemVer, PRDs afetados, validação E2E da Web App em staging e publicação pós-merge.
---

# Prompt: Criar PR de Release

## Objetivo

Padronizar a criação de Pull Requests de release de `main` para `production`.
O PR deve identificar exatamente as mudanças e os PRDs incluídos na versão,
permitir a validação do `head SHA` em staging e fornecer as notas usadas na
GitHub Release após o merge.

Use exclusivamente a GitHub CLI (`gh`) para interações com o GitHub. Esta
tarefa não exige nem deve criar uma Spec.

## Entrada

- Versão alvo opcional no formato `vX.Y.Z`.
- Branch `main` contendo as mudanças candidatas à produção.
- Branch `production` representando a versão atualmente publicada.
- PRs normais incorporados em `main`, cada um com um PRD explicitamente
  relacionado ou marcado como `Não aplicável`.

Quando nenhuma versão for informada, determine a próxima versão SemVer pelas
mudanças desde a última release publicada.

## Responsabilidades

Este prompt é responsável por:

1. preparar e criar o PR de release;
2. identificar e registrar os PRDs afetados;
3. registrar o `head SHA` que deve ser implantado e validado em staging;
4. acompanhar os checks da release sem executar diretamente o deploy ou os
   testes E2E;
5. fornecer notas compatíveis com a criação posterior da tag e da GitHub
   Release.

O workflow `.github/workflows/hermes-e2e-testing.yaml` é responsável por:

- implantar o `head SHA` da Web App em staging;
- executar na Web App em staging os testes E2E dos PRDs afetados com o perfil
  `e2e-tester` do Hermes e o servidor MCP `playwright`;
- publicar a matriz de requisitos e as referências das evidências no PR;

O workflow `.github/workflows/create-release.yaml` é responsável por:

- criar a tag e a GitHub Release após o merge em `production`;

Os workflows `*-production-cd.yaml` são responsáveis por:

- disparar o deploy de produção.

## Regras obrigatórias

- O PR de release deve usar `main` como `head` e `production` como `base`.
- Não crie uma branch intermediária de release.
- Não faça commit de alterações locais pendentes.
- Não abra mais de um PR de release para o mesmo `head SHA`.
- Use o SHA exato de `origin/main` durante todo o processo.
- Não trate caminhos alterados como fonte de verdade para associação de PRD.
- Não invente PRDs, requisitos, evidências, resultados de CI ou validações.
- Não inclua segredos, credenciais ou URLs internas no PR.
- A aprovação final da release continua sendo humana.

## Workflow

### 1. Verificar o estado do repositório

1. Execute `git status --short` e interrompa se houver alterações locais.
2. Atualize as referências remotas de `main`, `production` e tags.
3. Confirme que `origin/main` e `origin/production` existem.
4. Registre:
   - o SHA atual de `origin/main` como `head SHA`;
   - o SHA atual de `origin/production` como `base SHA`;
   - a árvore Git correspondente a cada SHA.
5. Confirme que `main` contém mudanças ainda não presentes em `production`.
6. Verifique se existe PR de release aberto com `main` como `head` e
   `production` como `base`.

Interrompa quando:

- não houver mudanças para publicar;
- as branches estiverem ausentes ou divergirem de forma incompatível;
- houver conflitos de merge;
- já existir um PR de release para o mesmo `head SHA`.

### 2. Identificar os PRs incluídos

Liste os commits presentes em `origin/main` e ausentes em
`origin/production`. Para cada commit, identifique o PR incorporado que o
introduziu.

Produza uma lista deduplicada contendo:

- número e URL do PR;
- título;
- merge commit ou commits associados;
- issues relacionadas;
- valor declarado na seção `## PRD`.

Não considere como parte da release um PR que não introduziu commits no
intervalo comparado.

### 3. Identificar os PRDs afetados

A seção `## PRD` dos PRs normais é a fonte principal de rastreabilidade. Ela
deve conter uma ou mais URLs de milestones do repositório ou o valor
`Não aplicável`.

Para cada PR incluído:

1. leia a seção `## PRD`;
2. valide que cada URL pertence a uma milestone existente do Stardust;
3. deduplique as milestones pelo número;
4. registre quais PRs originaram cada associação;
5. registre separadamente os PRs marcados como `Não aplicável`.

Quando um PR histórico não tiver a seção `## PRD`, use apenas como fallback:

1. milestones das issues relacionadas;
2. campo `prd:` de Specs ou reports alterados pelo PR.

Se o fallback não produzir uma associação inequívoca, interrompa e solicite
classificação humana. Não assuma que um PR técnico possui ou não possui PRD.

### 4. Montar o manifesto da release

Monte um manifesto lógico associado ao `head SHA`, contendo no mínimo:

```json
{
  "head_sha": "<sha de origin/main>",
  "base_sha": "<sha de origin/production>",
  "head_branch": "main",
  "base_branch": "production",
  "pull_requests": [123, 124],
  "affected_prds": [
    {
      "milestone": 40,
      "url": "https://github.com/JohnPetros/stardust/milestone/40",
      "source_pull_requests": [123]
    }
  ],
  "pull_requests_without_prd": [124]
}
```

O manifesto pode ser reproduzido no corpo do PR e persistido como artifact do
workflow. Não crie ou versione um arquivo no repositório apenas para armazená-lo.

### 5. Determinar a versão

Inspecione a última GitHub Release, a tag correspondente e todas as mudanças
posteriores. Escolha o maior incremento aplicável:

- **major:** mudança incompatível que exige adaptação;
- **minor:** funcionalidade compatível adicionada;
- **patch:** correção, performance, refatoração, documentação, testes, build,
  CI ou manutenção.

Use `v0.1.0` na primeira release, salvo instrução explícita diferente.

Interrompa se:

- a versão ou tag já existir para outro commit;
- a versão informada não for maior que a última versão publicada;
- as mudanças exigirem um incremento maior que o solicitado.

### 6. Registrar validações existentes

Leia os resultados reais dos workflows executados nos PRs incluídos e no
`head SHA`. Não execute novamente toda a CI normal durante a criação do PR de
release e não declare como aprovado um check ausente ou pendente.

Registre separadamente:

- CI dos PRs normais;
- deploy do `head SHA` da Web App em staging;
- health check da Web App em staging;
- validação E2E da release.

Os três últimos itens permanecem pendentes até os workflows do release PR.

### 7. Criar o PR

Crie o PR diretamente de `main` para `production`:

```bash
gh pr create \
  --base production \
  --head main \
  --title "Release vX.Y.Z" \
  --body-file <arquivo-temporario>
```

O título deve seguir exatamente:

```text
Release vX.Y.Z
```

A versão declarada no título será usada pelo workflow pós-merge para criar a
tag e a GitHub Release.

## Corpo do PR

O corpo também será usado como base para as notas da GitHub Release. Não use um
título de nível `#`, afirmações especulativas ou seções vazias.

```markdown
## Objetivo

Explique o resultado entregue pela versão.

## Versão

- Versão: `vX.Y.Z`
- Base SHA: `<production SHA>`
- Head SHA validado: `<main SHA>`

## Principais mudanças

### Web
- Mudanças relevantes de frontend.

### Server
- Mudanças relevantes de API, persistência e jobs.

### Studio
- Mudanças relevantes da aplicação administrativa.

### Core e packages
- Mudanças relevantes em domínio e packages compartilhados.

### Infraestrutura
- Mudanças relevantes de Docker, Coolify, CI/CD ou tooling.

## Correções

- Correções incluídas ou `Nenhuma correção específica nesta versão.`

## PRs incluídos

- #123 — título do PR.
- #124 — título do PR.

## PRDs afetados

| PRD | PRs de origem | Status E2E |
| --- | --- | --- |
| [Milestone 40](https://github.com/JohnPetros/stardust/milestone/40) | #123 | Pendente |

## PRs sem PRD

- #124 — alteração técnica sem PRD associado.

## Migrações e deploy

- Migrações, variáveis de ambiente, ordem de execução e cuidados de deploy.

## Breaking changes

- Incompatibilidades e adaptações necessárias ou `Nenhum breaking change identificado.`

## Issues relacionadas

resolve #456
```

Omita `## Issues relacionadas` quando nenhuma issue for conhecida. Omita
`## PRDs afetados` somente quando todos os PRs estiverem explicitamente
marcados como `Não aplicável`. Omita `## PRs sem PRD` quando todos os PRs
possuírem PRD.

## Validação E2E da release

Depois da abertura ou atualização do PR, o workflow de release deve:

1. validar que o PR usa `main` como `head` e `production` como `base`;
2. implantar exatamente o `head SHA` da Web App em staging;
3. aguardar o health check da Web App em staging;
4. criar uma execução paralela do perfil `e2e-tester` do Hermes para cada PRD
   afetado;
5. fornecer a cada execução o conteúdo completo de `AGENTS.md`, o release PR,
   o `head SHA`, a milestone e os requisitos atribuídos;
6. usar exclusivamente o servidor MCP `playwright`, conectado ao Chromium
   isolado via CDP, para exercitar a Web App em staging em um navegador real;
7. reutilizar o bootstrap seguro de autenticação do Playwright MCP, sem expor
   credenciais ao modelo ou enviá-las em prompts e argumentos de ferramentas;
8. carregar a milestone pelo GitHub MCP e identificar seus requisitos
   `REQ-*`;
9. validar os requisitos daquele PRD que forem aplicáveis à Web App e puderem
   ser exercitados pelo ambiente de staging disponível;
10. coletar screenshots, estado visível final, console, falhas de página,
    requisições de rede e demais evidências disponibilizadas pelo Playwright;
11. armazenar screenshots e demais arquivos no volume persistente do Hermes,
    organizados por PR, SHA, milestone e requisito;
12. retornar no JSON os paths locais das evidências sem afirmar que foram
    transferidas ao GitHub;
13. armazenar o manifesto e os resultados JSON em GitHub Actions Artifacts;
14. publicar ou atualizar uma única matriz consolidada no release PR.

O Playwright MCP do perfil `e2e-tester` é o executor dos E2E agentic de
aceitação da release. Ele deve usar somente a Web App em staging, manter a
sessão autenticada preparada pelo bootstrap do perfil e produzir evidências
associadas ao PRD, requisito e `head SHA` da execução.

A Runs API do Hermes não expõe os arquivos gerados no contêiner. Enquanto não
existir um endpoint autenticado de transferência, o workflow deve publicar
somente os resultados estruturados e as referências locais. Nunca apresente
um arquivo local como artifact ou link acessível pelo GitHub.

Os testes Playwright versionados no repositório continuam pertencendo à CI
normal. Eles são determinísticos, repetíveis e orientados a regressão técnica.
A execução do Hermes com Playwright MCP é orientada aos requisitos dos PRDs
afetados e não substitui nem deve duplicar desnecessariamente a suíte
versionada.

Nesta primeira versão, o agente não deve acessar o Studio de produção nem
executar validação E2E diretamente no Server. Requisitos exclusivos de Studio,
Server ou outro ambiente devem ser classificados como `não aplicável ao escopo
Web staging`, com justificativa. Essa classificação não pode ser apresentada
como requisito validado.

Cada requisito deve receber exatamente um resultado:

- `passou`;
- `falhou`;
- `bloqueado`;
- `não aplicável`.

Resultados `falhou` ou `bloqueado` devem falhar o check da release. A decisão
de merge permanece humana mesmo quando todos os requisitos passarem.

Quando nenhum PRD for afetado, o workflow deve concluir com sucesso, registrar
que não há E2E de produto aplicável e não iniciar sessões de navegador.

## Atualizações e reexecuções

Ao receber um novo commit em `main`:

1. cancele execuções anteriores do mesmo release PR;
2. recalcule os PRs e PRDs afetados;
3. gere um novo manifesto para o novo `head SHA`;
4. faça um novo deploy em staging;
5. execute novamente os E2E aplicáveis;
6. atualize a conclusão existente em vez de publicar comentários duplicados.

Nunca reutilize evidências produzidas para outro SHA.

## Pós-merge: tag, GitHub Release e produção

Após o merge do release PR em `production`, o workflow pós-merge deve:

1. confirmar que o PR incorporado tinha `main` como `head` e `production` como
   `base`;
2. extrair e validar `vX.Y.Z` do título `Release vX.Y.Z`;
3. registrar o `head SHA` validado em staging e o merge commit SHA;
4. confirmar que o merge commit possui a mesma árvore Git do `head SHA`
   validado;
5. verificar se a tag ou a GitHub Release já existem;
6. criar uma tag anotada `vX.Y.Z` apontando para o merge commit em
   `production`;
7. criar a GitHub Release com título `Release vX.Y.Z` e notas derivadas do
   corpo do PR;
8. disparar o deploy de produção;
9. publicar no PR os links da tag, da GitHub Release e do deploy.

O processo deve ser idempotente. Se a tag ou a release já existirem, confirme
que apontam para o commit correto e não crie duplicatas. Interrompa se
apontarem para outro commit.

## Retorno

Depois de criar o PR, retorne:

- URL e número do release PR;
- versão escolhida;
- base SHA e head SHA;
- PRs incluídos;
- PRDs afetados;
- PRs sem PRD;
- checks ainda pendentes.

Não declare a release publicada antes do merge, da criação da tag, da GitHub
Release e da confirmação do deploy de produção.
