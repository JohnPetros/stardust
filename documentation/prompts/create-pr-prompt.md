---
description: Prompt para criar pull requests padronizados via gh com titulo, body e checklist de validacao.
---

# Prompt: Criar PRD

**Objetivo:** Padronizar a criação de Pull Requests (PRs), garantindo descrições
claras que facilitem a revisão de código e o rastreamento de tarefas. O foco é
utilizar exclusivamente a **GitHub CLI (gh)** para manter a integridade do fluxo
de trabalho.

---

## Entrada

- Uma Spec (especificação) devidamente implementada e validada.
- Uma Bug Report (relatório de bug) devidamente implementada e validada.
- Uma branch de funcionalidade (`feature/`), correção (`fix/`) ou refatoração
  (`refactor/`) com as alterações comitadas.

---

## Diretrizes de Execução

### 1. Análise do Contexto

- Revise a Spec implementada e o changelog das alterações realizadas.
- Identifique:

  - impactos técnicos
  - decisões de design tomadas
  - riscos e efeitos colaterais

---

### 2. Definição do Título

- Deve ser:

  - curto
  - direto
  - em PT-BR
  - refletir a essência da alteração

Exemplos:

- Implementação da listagem de produtos
- Correção do erro de carregamento de imagem
- Correção de navegação para tela de catálogo

⚠️ Não incluir prefixos no título:

```
feat/
fix/
refactor/
```

---

### 3. Estrutura da Descrição (Body)

O corpo do PR deve seguir o template abaixo.

**Regras de formatação:**

- usar Markdown
- não usar título principal `#`
- usar `##` e níveis abaixo

---

## Objetivo (obrigatório)

Explique por que este PR foi criado e qual seu propósito central.

## Issues relacionadas (opcional)

Vincule tarefas/bugs usando **exclusivamente** a palavra-chave `resolve`:

```
resolve #123
resolve #456
```

⚠️ Não usar `resolves`, `closes`, `fixes` ou qualquer outra variação. Apenas `resolve`.

---

## Causa do bug (opcional — apenas fix)

Descreva a causa técnica raiz.

---

## Changelog (obrigatório)

Lista técnica das mudanças:

- arquivos alterados
- comportamento modificado
- regras adicionadas
- refatorações feitas

---

## Como testar (obrigatório)

Passo a passo claro para o revisor validar:

1. …
2. …
3. …

---

## Observações (opcional)

- decisões de arquitetura
- limitações conhecidas
- tradeoffs
- próximos passos

---

### 4. Criação via gh CLI

⚠️ Não usar GitHub MCP. ⚠️ Não usar APIs MCP. Usar exclusivamente **gh**.

Comando padrão:

```
gh pr create \
  --repo owner/repo \
  --base main \
  --head <nome-da-branch> \
  --title "<Titulo do PR>" \
  --body-file pr_body.md
```

Ou inline:

```
gh pr create \
  --base main \
  --head <branch> \
  --title "<Titulo>" \
  --body "<Descrição formatada>"
```

---

### 5. Retorno

Após criação:

```
gh pr view --web
```

ou

```
gh pr view --json url
```

Retornar:

- link do PR criado
- título final
- resumo do body gerado