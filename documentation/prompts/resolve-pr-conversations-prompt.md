---
description: Prompt para resolver conversas pendentes de um pull request com analise, implementacao e fechamento de threads via gh CLI.
---

# Prompt: Resolver Conversas de PR

**Objetivo Principal:**
Analisar, implementar e resolver todas as conversas **não resolvidas** em um Pull Request (PR) específico do GitHub. O foco é garantir que todos os pontos de melhoria, correções de bugs e sugestões de design levantadas pelos revisores sejam devidamente endereçados no código, respeitando os padrões e a arquitetura do projeto.

**Entrada:**
- **Link do PR:** URL completa do Pull Request no GitHub (ex: `https://github.com/owner/repo/pull/123`).

> ⚠️ **Ferramenta exclusiva:** Use apenas o **GitHub CLI (`gh`)** para interagir com o GitHub. Nenhum MCP server deve ser utilizado.

---

## Diretrizes de Execução

### 1️⃣ Extração de Contexto

Identifique `owner`, `repo` e `pull_number` a partir da URL fornecida. Em seguida, obtenha os metadados do PR:

```bash
gh pr view <pull_number> --repo <owner>/<repo> --json title,headRefName,body,files
```

---

### 2️⃣ Listagem de Conversas Não Resolvidas

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

### 3️⃣ Triagem das Threads

Classifique cada thread não resolvida em uma das categorias:

| Categoria | Critério | Ação |
|---|---|---|
| **Implementar** | Correção de código, ajuste de padrão, bug apontado | Implementar autonomamente |
| **Escalar** | Mudança arquitetural, decisão de design, conflito com Spec/PRD | Consultar o usuário antes de agir |
| **Ignorar** | Comentário meramente informativo, já endereçado no código | Pular |

> ⚠️ **Regra de escalada:** Qualquer comentário que implique mudança de arquitetura, remoção de funcionalidade ou conflito com o PRD/Spec associado deve ser **escalado** — nunca implementado de forma autônoma.

Apresente a lista classificada ao usuário antes de avançar caso haja itens na categoria **Escalar**.

---

### 4️⃣ Implementação

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

### 5️⃣ Validação das Alterações

Após implementar todas as correções:

```bash
npm run codecheck
npm run typecheck
npm run test
```

Corrija eventuais erros antes de prosseguir. Verifique também se as alterações permanecem aderentes ao PRD e à Spec associada ao PR.

---

### 6️⃣ Fechamento das Threads

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

### 7️⃣ Atualização da Documentação

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
```

### Passo 2 — Diagnóstico e Triagem

Para cada thread não resolvida, identifique e classifique:
- Arquivo afetado e linhas envolvidas.
- Problema descrito pelo revisor.
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
## Resumo de Resoluções

### ✅ Implementadas
- [x] `caminho/do/arquivo.ts` — [descrição da mudança realizada]

### ⏳ Aguardando decisão
- [ ] `caminho/do/arquivo.ts` — [comentário do revisor] → [motivo da escalada]

### ⏭️ Ignoradas
- `caminho/do/arquivo.ts` — thread meramente informativa / já endereçada
```

### Passo 6 — Atualização da Documentação

Analise o documento de Spec ou Bug Report relacionado e atualize-o caso as alterações implementadas impactem o escopo ou as decisões de design documentadas.