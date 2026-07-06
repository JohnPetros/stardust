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

> **Princípio operacional:** antes de tentar qualquer modo "watch", polling por SHA ou inspeção detalhada de runs, leia primeiro o estado **atual** do PR. Se `statusCheckRollup` já mostrar tudo `COMPLETED` com `SUCCESS`/`SKIPPED`, `mergeable` estiver favorável e não houver threads abertas, encerre sem etapas extras.

Faça checkout da branch do PR localmente para poder corrigir e dar push:

```bash
gh pr checkout <pull_number> --repo <owner>/<repo>
```

---

### 2. Diagnóstico de Pendências

Levante as pendências das **três** fontes antes de corrigir qualquer coisa.

#### 2.1 Erros de CI

**Primeiro, leia o estado atual do PR.** Use `gh pr checks` sem assumir suporte a `--watch`:

```bash
# Lista o estado atual dos checks do PR
gh pr checks <pull_number> --repo <owner>/<repo>
```

Se todos os checks já estiverem concluídos, use esse resultado como fonte de verdade e **não** tente observar runs em loop.

**Só se ainda houver checks em andamento**, aguarde a conclusão. Prefira um polling simples e compatível com versões antigas do `gh`:

```bash
# Releia os checks até nenhum status ficar pendente
while gh pr checks <pull_number> --repo <owner>/<repo> | grep -Eq '\b(pending|in_progress)\b'; do
  sleep 10
done
```

Em seguida, leia **apenas** os logs do que falhou, usando o `detailsUrl`/run visível no próprio PR ou em `gh pr checks`:

```bash
# Identifique o run que falhou e leia só as etapas com falha
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

Mapeie cada job falho para a causa raiz (lint, tipo, teste unitário, teste de integração, build).

#### 2.2 Regressões do quality gate

Quando o job `quality-gate` falhar, tente primeiro obter a regressão pelo próprio resumo/log do run. Nem toda versão do `gh` suporta `--json jobs`, e nem todo run expõe artefatos baixáveis.

Fluxo preferencial:

```bash
# 1) Leia o resumo textual do run
gh run view <run_id> --repo <owner>/<repo>

# 2) Leia os logs das etapas com falha
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

Se o run expuser artefatos úteis, baixe-os:

```bash
gh run download <run_id> --repo <owner>/<repo>
```

Se nem o resumo nem os artefatos trouxerem a tabela, **reproduza localmente** o quality gate do workspace afetado para obter a métrica exata:

```bash
npm run quality-gate -- --workspace=<workspace>
```

Use a tabela ou a saída local como lista de correções.

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

> **Regra de eficiência:** se, após a triagem inicial, o PR já estiver com CI verde, sem threads não resolvidas e `mergeable`, pare. Não continue investigando runs antigos nem tentando provar novamente um estado que o PR já mostra.

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

Se `npm run test:unit` falhar por problema **preexistente ou ambiental** não relacionado à alteração (por exemplo, infraestrutura local instável), registre isso explicitamente, valide o escopo alterado com testes focados e siga apenas se o CI remoto do PR continuar sendo a fonte de verdade para esse trecho.

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

**Após o push, releia primeiro o estado atual do PR.** Não assuma suporte a flags como `gh pr checks --watch` ou `gh run list --commit`; o prompt deve funcionar mesmo em versões mais limitadas do `gh`.

Fluxo padrão após o push:

```bash
# 1) Leia os checks atuais do PR
gh pr checks <pull_number> --repo <owner>/<repo>

# 2) Releia os metadados consolidados do PR
gh pr view <pull_number> --repo <owner>/<repo> --json mergeable,statusCheckRollup
```

Se houver checks pendentes, faça polling simples no PR:

```bash
while gh pr checks <pull_number> --repo <owner>/<repo> | grep -Eq '\b(pending|in_progress)\b'; do
  sleep 10
done
```

**Só tente ancorar em run ou SHA** se houver evidência concreta de que `gh pr checks` está mostrando um estado stale ou inconsistente. Mesmo nesse caso, use apenas comandos comprovadamente suportados pela versão local do `gh`.

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
