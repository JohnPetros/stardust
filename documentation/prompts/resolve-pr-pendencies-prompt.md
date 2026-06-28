---
description: Prompt para resolver pendencias (erros de CI, regressoes do quality gate e conversas nao resolvidas) de um pull request via gh CLI, em loop ate o PR ficar mergeable.
---

# Prompt: Resolver Pendências de PR

**Objetivo Principal:**
Atuar como _babysitter_ de um Pull Request: monitorar, diagnosticar e resolver **todas as pendências que impedem o merge**, em loop, até o PR ficar verde e sem conversas pendentes. As pendências são de três tipos:

1. **Erros de CI** — jobs falhando (`codecheck`, `typecheck`, `tests`, `integration-tests`, `build`).
2. **Regressões do quality gate** — métricas que pioraram em relação ao baseline (job `quality-gate`).
3. **Conversas de revisão não resolvidas** — comentários de revisores (humanos ou bots como o Copilot).

Tudo deve ser endereçado respeitando os padrões e a arquitetura do projeto.

**Entrada:**
- **Link do PR:** URL completa do Pull Request no GitHub (ex: `https://github.com/owner/repo/pull/123`).

> **Ferramenta exclusiva:** Use apenas o **GitHub CLI (`gh`)** para interagir com o GitHub. Nenhum MCP server deve ser utilizado.

---

## Diretrizes de Execução

### 1. Extração de Contexto

Identifique `owner`, `repo` e `pull_number` a partir da URL fornecida. Em seguida, obtenha os metadados do PR:

```bash
gh pr view <pull_number> --repo <owner>/<repo> --json title,headRefName,body,files,mergeable,statusCheckRollup
```

Faça checkout da branch do PR localmente para poder corrigir e dar push:

```bash
gh pr checkout <pull_number> --repo <owner>/<repo>
```

---

### 2. Diagnóstico de Pendências

Levante as pendências das **três** fontes antes de corrigir qualquer coisa.

#### 2.1 Erros de CI

**Primeiro, garanta que o CI terminou.** Não diagnostique com checks ainda em andamento — `--watch` bloqueia até todos concluírem:

```bash
# Espera todos os checks do PR concluírem (sai != 0 se algum falhar)
gh pr checks <pull_number> --repo <owner>/<repo> --watch
```

Em seguida, leia **apenas** os logs do que falhou:

```bash
# Identifique o run que falhou e leia só as etapas com falha
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

Mapeie cada job falho para a causa raiz (lint, tipo, teste unitário, teste de integração, build).

#### 2.2 Regressões do quality gate

Quando o job `quality-gate` falhar, ele publica a tabela de regressões no resumo do job e sobe o `summary.md` como artefato. Baixe e leia:

```bash
# Veja qual job quality-gate falhou
gh run view <run_id> --repo <owner>/<repo> --json jobs \
  --jq '.jobs[] | select(.name | test("[Qq]uality")) | {name, conclusion}'

# Baixe os artefatos (inclui o summary.md com a tabela métrica | baseline | atual)
gh run download <run_id> --repo <owner>/<repo>
```

A tabela diz exatamente **qual métrica piorou, o baseline e o valor atual** — use-a como lista de correções.

#### 2.3 Conversas de revisão não resolvidas

Liste **somente** as threads não resolvidas e não desatualizadas via GraphQL API:

```bash
gh api graphql -f query='
{
  repository(owner: "<owner>", name: "<repo>") {
    pullRequest(number: <pull_number>) {
      reviewThreads(first: 50) {
        nodes {
          id
          isResolved
          isOutdated
          comments(first: 1) {
            nodes { path body author { login } }
          }
        }
      }
    }
  }
}'
```

Filtre apenas os nós onde `isResolved: false` e `isOutdated: false`. Esses são os alvos.

---

### 3. Triagem

Classifique **cada pendência** (de qualquer fonte) em uma categoria:

| Categoria | Critério | Ação |
|---|---|---|
| **Corrigir** | Erro de CI, regressão de métrica, correção de código apontada por revisor | Resolver autonomamente |
| **Escalar** | Mudança arquitetural, decisão de design, conflito com Spec/PRD, baseline que precisaria ser afrouxado | Consultar o usuário antes de agir |
| **Ignorar** | Comentário meramente informativo, já endereçado no código | Pular |

> **Regra de escalada:** Qualquer item que implique mudança de arquitetura, remoção de funcionalidade, conflito com o PRD/Spec, ou **afrouxar o baseline do quality gate**, deve ser **escalado** — nunca resolvido de forma autônoma. Afrouxar o baseline (`--update-baseline` para piorar uma métrica) anula o propósito da catraca.

Apresente a triagem ao usuário antes de avançar caso haja itens **Escalar**.

---

### 4. Correção

#### 4.1 Erros de CI

Reproduza localmente, no diretório do workspace afetado, e corrija até passar:

```bash
npm run codecheck -w @stardust/<workspace>
npm run typecheck -w @stardust/<workspace>
npm run test:unit -w @stardust/<workspace>
# se o job de integração falhou:
npm run test:integration -w @stardust/<workspace>
```

#### 4.2 Regressões do quality gate

Para cada linha da tabela de regressões, aplique a correção correspondente:

| Regressão no `summary.md` | Ação |
|---|---|
| **Biome warnings** aumentou | Rode `npm run codecheck`, leia os diagnostics `warn` e corrija o código que os introduziu |
| **Escape hatches de tipo** aumentou (`any`, `@ts-ignore`) | Substitua `any` por tipo concreto/genérico; remova `@ts-ignore`/`@ts-expect-error` |
| **Arquivo cruzou o limite de linhas** | Modularize o arquivo extraindo responsabilidades, respeitando as regras da camada em `documentation/rules/` |
| **Cobertura caiu** numa camada | Escreva os testes faltantes para o código novo (siga `documentation/prompts/create-tests-prompt.md` e as regras de teste da camada) |

Confirme localmente que zerou as regressões antes de seguir:

```bash
npm run quality-gate -- --workspace=<workspace>
```

> Nunca rode `--update-baseline` para "resolver" uma regressão: isso piora o baseline. O baseline só é recongelado em melhorias intencionais, e isso é decisão do usuário (item **Escalar**).

#### 4.3 Conversas de revisão

Para cada thread **Corrigir**:

- Localize o arquivo e as linhas mencionadas no comentário.
- Aplique a alteração respeitando os padrões do projeto:
  - **Convenções de código:** `documentation/rules/code-conventions-rules.md`
  - **Arquitetura geral:** `documentation/architecture.md`
  - **Regras por camada:** conforme `documentation/rules/rules.md`

Para cada thread **Escalar**, apresente ao usuário o comentário original, o impacto e as opções, e aguarde a decisão.

---

### 5. Validação Local (obrigatória antes do push)

Rode, no(s) workspace(s) afetado(s):

```bash
npm run codecheck -w @stardust/<workspace>
npm run typecheck -w @stardust/<workspace>
npm run test:unit -w @stardust/<workspace>
npm run quality-gate -- --workspace=<workspace>
```

Corrija qualquer erro antes de prosseguir. Verifique também se as alterações permanecem aderentes ao PRD e à Spec associada ao PR.

---

### 6. Fechamento das Threads

Resolva cada thread efetivamente corrigida via GraphQL API:

```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: { threadId: "<thread_id>" }) {
    thread { id isResolved }
  }
}'
```

> Threads **Escalar** que aguardam decisão do usuário **não devem ser resolvidas** até a implementação ser confirmada.

---

### 7. Push e Re-verificação (o loop)

Depois de corrigir e validar localmente:

```bash
git add -A
git commit -m "<mensagem seguindo o padrao do repo>"
git push
```

**Aguarde o CI do commit recém-enviado — não reaproveite o resultado do run anterior.** Logo após o push, o GitHub leva alguns segundos para registrar o novo run; se você rodar `--watch` cedo demais, ele pode observar o run antigo (já verde) e retornar um falso "tudo passou". Ancore a espera no SHA do `HEAD`:

```bash
HEAD_SHA=$(git rev-parse HEAD)

# 1) Espere o run do commit atual ser registrado
until gh run list --repo <owner>/<repo> --commit "$HEAD_SHA" \
      --json databaseId --jq '.[0].databaseId' | grep -q .; do
  sleep 5
done

# 2) Agora sim, bloqueie até os checks do PR concluírem
gh pr checks <pull_number> --repo <owner>/<repo> --watch
```

**Repita o ciclo (etapas 2 → 7)** até que:
- Todos os checks de CI estejam verdes (incluindo `quality-gate`), **e**
- Não haja conversas não resolvidas restantes (exceto as **Escalar** aguardando decisão).

Quando ambas as condições forem satisfeitas, o babysit encerra.

---

### 8. Atualização da Documentação

Localize o documento de Spec ou Bug Report associado à branch do PR (`documentation/features/.../specs/...`) e, se as alterações afetarem o escopo documentado:

- Ajuste as seções impactadas para refletir as decisões finais.
- Atualize o campo `last_updated_at` no frontmatter.
- Marque itens de checklist do PRD que foram concluídos.

---

## Saída esperada

Relate o progresso no formato:

```
## Resumo de Resolucoes de PR

### CI corrigido
- [x] <job> — <causa raiz e correcao>

### Quality gate
- [x] <metrica> — baseline <x> / antes <y> / agora <z> — <correcao>

### Conversas implementadas
- [x] `caminho/do/arquivo.ts` — <descricao da mudanca>

### Aguardando decisao (escaladas)
- [ ] <item> — <motivo da escalada>

### Ignoradas
- <item> — informativa / ja enderecada

### Status final
- CI: <verde | pendente>
- Conversas: <N resolvidas, M aguardando>
```
