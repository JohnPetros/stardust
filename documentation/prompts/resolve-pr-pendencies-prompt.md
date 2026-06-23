---
description: Prompt para resolver conversas pendentes e erros de CI/CD de um pull request com analise, implementacao e fechamento de threads via gh CLI.
---

# Prompt: Resolver Pendências de PR

**Objetivo Principal:**
Analisar, implementar e resolver todas as conversas **não resolvidas** e **erros de GitHub Actions** em um Pull Request (PR) específico do GitHub. O foco é garantir que todos os pontos de melhoria, correções de bugs, sugestões de design levantadas pelos revisores e falhas de CI/CD sejam devidamente endereçados no código, respeitando os padrões e a arquitetura do projeto.

**Entrada:**
- **Link do PR:** URL completa do Pull Request no GitHub (ex: `https://github.com/owner/repo/pull/123`).

> **Ferramenta exclusiva:** Use apenas o **GitHub CLI (`gh`)** para interagir com o GitHub. Nenhum MCP server deve ser utilizado.

---

## Diretrizes de Execução

### 1. Extração de Contexto

Identifique `owner`, `repo` e `pull_number` a partir da URL fornecida. Em seguida, obtenha os metadados do PR:

```bash
gh pr view <pull_number> --repo <owner>/<repo> --json title,headRefName,body,files
```

---

### 2. Listagem de Conversas Não Resolvidas

Liste **somente** os comentários de revisão não resolvidos via GitHub API:

```bash
gh api repos/<owner>/<repo>/pulls/<pull_number>/comments \
  --jq '[.[] | select(.in_reply_to_id == null) | {id: .id, path: .path, line: .line, body: .body, user: .user.login}]'
```

> A flag `select(.in_reply_to_id == null)` garante que apenas comentários raiz (início de thread) sejam listados, evitando duplicatas de replies.

Para verificar quais threads já estão resolvidas, use a GraphQL API:

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
            nodes {
              path
              body
              author { login }
            }
          }
        }
      }
    }
  }
}'
```

Filtre apenas os nós onde `isResolved: false` e `isOutdated: false`. Esses são os alvos deste prompt.

---

### 3. Verificação de Erros do GitHub Actions

Verifique o status dos checks (CI/CD) associados ao PR:

```bash
gh pr checks <pull_number> --repo <owner>/<repo>
```

Se houver checks com status **fail**, obtenha os logs do workflow com falha:

```bash
# Listar os runs associados ao PR
gh run list --repo <owner>/<repo> --branch <head_branch> --status failure --limit 5 --json databaseId,name,conclusion,event

# Obter os logs detalhados do run com falha
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

> **Dica:** O `--log-failed` retorna apenas os logs dos steps que falharam, facilitando a análise. Se o output for muito grande, foque nos últimos 100 linhas do step com falha.

Para cada falha identificada, extraia:
- **Workflow e job** que falhou.
- **Mensagem de erro** principal.
- **Arquivo e linha** afetados (quando disponível no log).
- **Causa raiz** provável.

---

### 4. Triagem das Threads e Erros de CI

Classifique cada thread não resolvida **e cada erro de CI** em uma das categorias:

| Categoria | Critério | Ação |
|---|---|---|
| **Implementar** | Correção de código, ajuste de padrão, bug apontado, erro de lint/type/test no CI | Implementar autonomamente |
| **Escalar** | Mudança arquitetural, decisão de design, conflito com Spec/PRD, falha de CI relacionada a infra/config de workflow | Consultar o usuário antes de agir |
| **Ignorar** | Comentário meramente informativo, já endereçado no código, falha de CI transiente (timeout de rede, flaky test já conhecido) | Pular |

> **Regra de escalada:** Qualquer comentário ou erro de CI que implique mudança de arquitetura, remoção de funcionalidade, alteração de configuração de workflow/infra ou conflito com o PRD/Spec associado deve ser **escalado** — nunca implementado de forma autônoma.

> **Erros de CI:** Erros de typecheck, lint, testes unitários/integração e build são tratados como itens **Implementar**. Erros de configuração de workflow (permissões, secrets, versão de runner) são **Escalar**.

Apresente a lista classificada ao usuário antes de avançar caso haja itens na categoria **Escalar**.

---

### 5. Implementação

Para cada thread categorizada como **Implementar**:

- Localize o arquivo e as linhas mencionadas no comentário.
- Analise a sugestão ou problema apontado pelo revisor.
- Aplique as alterações necessárias respeitando os padrões do projeto:
  - **Convenções de código:** `documentation/rules/code-conventions-rules.md`
  - **Arquitetura geral:** `documentation/architecture.md`
  - **Regras por camada:** conforme `documentation/rules/rules.md`

Para cada thread categorizada como **Escalar**:

- Apresente ao usuário:
  - O comentário original do revisor.
  - O impacto identificado e por que é uma decisão não trivial.
  - As opções disponíveis, se houver.
- Aguarde a decisão antes de prosseguir.

---

### 6. Validação das Alterações

Após implementar todas as correções:

```bash
npm run codecheck
npm run typecheck
npm run test
```

Corrija eventuais erros antes de prosseguir. Verifique também se as alterações permanecem aderentes ao PRD e à Spec associada ao PR.

---

### 7. Fechamento das Threads

Resolva cada thread implementada via GraphQL API:

```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: { threadId: "<thread_id>" }) {
    thread {
      id
      isResolved
    }
  }
}'
```

> Threads escaladas que aguardam decisão do usuário **não devem ser resolvidas** até que a implementação seja confirmada.

---

### 8. Atualização da Documentação

Localize o documento de Spec ou Bug Report associado à branch do PR (`documentation/features/.../specs/...`) e, se as alterações implementadas afetarem o escopo documentado:

- Ajuste as seções impactadas para refletir as decisões finais.
- Atualize o campo `last_updated_at` no frontmatter.
- Se o PRD associado tiver itens de checklist impactados, marque-os como concluídos.

---

## Fluxo de Trabalho

### Passo 1 — Coleta de Dados

```bash
# Metadados do PR
gh pr view <pull_number> --repo <owner>/<repo> --json title,headRefName,body,files

# Threads de revisão (filtrando não resolvidas e não outdated)
gh api graphql -f query='{ repository(owner:"<owner>", name:"<repo>") { pullRequest(number:<pull_number>) { reviewThreads(first:50) { nodes { id isResolved isOutdated comments(first:1) { nodes { path body author { login } } } } } } } }'

# Status dos checks de CI/CD
gh pr checks <pull_number> --repo <owner>/<repo>

# Logs de workflows com falha (se houver)
gh run list --repo <owner>/<repo> --branch <head_branch> --status failure --limit 5 --json databaseId,name,conclusion
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

### Passo 2 — Diagnóstico e Triagem

Para cada thread não resolvida e cada erro de CI, identifique e classifique:
- Arquivo afetado e linhas envolvidas.
- Problema descrito pelo revisor ou mensagem de erro do CI.
- Solução proposta.
- Categoria: **Implementar**, **Escalar** ou **Ignorar**.

Apresente a triagem ao usuário antes de avançar se houver itens **Escalar**.

### Passo 3 — Execução

- Implemente as correções das threads **Implementar**.
- Para threads **Escalar**, aguarde a decisão do usuário.

### Passo 4 — Validação

```bash
npm run codecheck
npm run typecheck
npm run test
```

### Passo 5 — Conclusão

Relate o progresso com o seguinte formato:

```
## Resumo de Resolucoes

### Conversas Implementadas
- [x] `caminho/do/arquivo.ts` — [descricao da mudanca realizada]

### Erros de CI Corrigidos
- [x] `workflow/job` — [descricao do erro e da correcao aplicada]

### Aguardando decisao
- [ ] `caminho/do/arquivo.ts` — [comentario do revisor ou erro de CI] -> [motivo da escalada]

### Ignoradas
- `caminho/do/arquivo.ts` — thread meramente informativa / ja enderecada / falha transiente de CI
```

### Passo 6 — Atualização da Documentação

Analise o documento de Spec ou Bug Report relacionado e atualize-o caso as alterações implementadas impactem o escopo ou as decisões de design documentadas.