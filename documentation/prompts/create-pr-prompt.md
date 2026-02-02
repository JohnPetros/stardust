# Prompt: Resolve PR Conversations (usando gh CLI)

**Objetivo Principal** Analisar, implementar e resolver todas as conversas e
feedbacks pendentes em um Pull Request (PR) específico do GitHub. O foco é
garantir que todos os pontos de melhoria, correções de bugs e sugestões de
design levantadas pelos revisores sejam devidamente endereçados no código.

## Diretrizes de Execução

### 1️⃣ Extração de Contexto

- Identifique o `owner`, `repo` e `pullNumber` a partir da URL fornecida.
- Utilize o **gh CLI** para obter os detalhes do PR.

Exemplo:

```
gh pr view <pullNumber> --repo owner/repo --comments
```

---

### 2️⃣ Mapeamento de Conversas

- Liste todos os comentários de revisão do PR.

Comandos possíveis:

```
gh pr view <pullNumber> --repo owner/repo --json reviewThreads
```

ou via API:

```
gh api repos/owner/repo/pulls/<pullNumber>/comments
```

- Filtre as conversas:

  - não resolvidas
  - com change request
  - com sugestões de alteração de código

---

### 3️⃣ Análise e Implementação

Para cada comentário:

- Identifique:

  - arquivo afetado
  - trecho de código
  - sugestão do revisor

- Aplique as alterações no código local usando ferramentas de edição de arquivo:

  - replace_file_content
  - multi_replace_file_content

- Garanta conformidade com:

```
documentation/code-conventions-guidelines.md
documentation/architecture.md
```

---

### 4️⃣ Validação das Alterações

Após implementar:

Rodar analyzer:

```
flutter analyze
```

Rodar testes:

```
flutter test
```

---

### 5️⃣ Finalização

Fornecer resumo detalhado:

- quais conversas foram resolvidas
- quais arquivos foram alterados
- quais padrões foram ajustados
- quais bugs foram corrigidos

---

## FLUXO DE TRABALHO (Workflow)

### ✅ Passo 1 — Coleta de Dados

Listar comentários do PR:

```
gh api repos/owner/repo/pulls/<pullNumber>/comments
```

ou

```
gh pr view <pullNumber> --comments
```

---

### ✅ Passo 2 — Diagnóstico

Para cada thread:

- arquivo afetado
- problema descrito
- solução proposta

---

### ✅ Passo 3 — Execução

Modificar arquivos locais conforme necessário.

Se o comentário for ambíguo → pedir esclarecimento antes de alterar.

---

### ✅ Passo 4 — Conclusão

Relatório de progresso:

```
[x] Arquivo X — comentário Y resolvido (descrição)
[x] Arquivo Z — ajuste de padrão aplicado
```

---

### ✅ Passo 5 — Validação

Executar:

```
flutter analyze
flutter test
```

---

### ✅ Passo 6 — Atualização da Documentação

Atualizar, se necessário:

- Spec
- Bug Report
- PRD relacionado
