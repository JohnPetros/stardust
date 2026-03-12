---
description: Prompt para concluir um report de qualquer tipo (performance, security, bug report), verificando correções no código, atualizando o status dos itens e fechando o documento.
---

# Prompt: Conclude Report

## Objetivo

Finalizar um report — de diagnóstico (performance, segurança) ou bug report — verificando as correções aplicadas no código, consolidando o estado de cada item identificado e atualizando o documento com o registro da resolução.

---

## Entrada

- **Report:** Caminho do documento a ser concluído
  - Diagnóstico: `documentation/reports/{nome}.md`
  - Bug report: `documentation/features/{dominio}/bug-reports/{nome}.md`
- **Itens resolvidos:** IDs ou descrição do que foi corrigido (ex: `ISSUE-01, ISSUE-03` ou `"bug principal corrigido"`)
- **Itens descartados (opcional):** O que foi avaliado e não será corrigido, com justificativa
- **Novas descobertas (opcional):** Problemas encontrados durante a implementação que não estavam no report original

---

## Passo 1: Identificar o Tipo e o App

Leia o frontmatter do documento:

| Campo | Diagnóstico | Bug Report |
|-------|-------------|------------|
| Localização | `documentation/reports/` | `documentation/features/.../bug-reports/` |
| `type` | `performance` \| `security` | ausente |
| `apps` | ex: `web`, `server` | ex: `web`, `server` |
| `last_updated_at` | ✓ | ausente — usa `last_updated` |

Use o campo `apps` para montar os comandos de qualidade. Se houver múltiplos apps (ex: `web, server`), execute os comandos para cada um.

O fluxo de execução diverge conforme o tipo identificado.

---

## Fluxo A — Diagnóstico (performance, security)

### A1: Classificar os Issues

Leia todos os issues do documento. Para cada um, defina o estado com base nas entradas recebidas:

- `resolved` — corrigido e validado no código
- `open` — ainda não tratado
- `discarded` — avaliado e descartado com justificativa

### A2: Verificar as Correções no Código

Para cada issue `resolved`:

- Localize o arquivo e linha apontados como **Evidência** no issue original.
- Confirme que o trecho problemático foi alterado.
- Se a abordagem real diferir da recomendada, documente a diferença — não reescreva o issue original.
- Se não for possível verificar no código, marque como `resolved (não verificado)` e registre nas pendências da seção de Resolução Final.

### A3: Executar o Checklist de Qualidade

Execute para cada app afetado e registre o resultado:

```bash
npm run test -w @stardust/{APP}
npm run typecheck -w @stardust/{APP}
npm run codecheck -w @stardust/{APP}
```

Se algum comando falhar, **não feche o report** — registre a falha no checklist e mantenha `status: open`.

### A4: Registrar Novas Descobertas

Se houver novas descobertas:

- Adicione-as ao report com IDs sequenciais a partir do último existente (ex: se o último era `ISSUE-16`, a nova começa em `ISSUE-17`).
- Use o mesmo formato dos issues originais do documento.
- Classifique como `open`.

### A5: Atualizar o Documento

Faça as seguintes edições no arquivo:

1. **Frontmatter:** Atualize `last_updated_at`. Mude `status` para `closed` **somente** se não houver nenhum issue `open` sem justificativa de descarte.
2. **Status por issue:** Adicione `- **Status:** resolved | open | discarded` ao final de cada bloco de issue.
3. **Justificativa de descarte:** Nos issues `discarded`, adicione `- **Justificativa do descarte:** {MOTIVO}`.
4. **Checklist de Verificação:** Preencha o checklist já existente no documento com `[x]` para passou e `[ ]` para falhou.
5. **Seção de Resolução Final:** Adicione ao final do documento, antes de `## Referencias`.

---

### Template: Seção de Resolução Final (Diagnóstico)

```md
## Resolucao Final

**Data de conclusao:** {DATA}

### Itens Resolvidos

| ID | Titulo | Abordagem Adotada |
|----|--------|-------------------|
| ISSUE-01 | {TITULO} | Conforme recomendacao original |
| ISSUE-03 | {TITULO} | Abordagem alternativa: {DESCRICAO} |

### Itens Descartados

| ID | Titulo | Justificativa |
|----|--------|---------------|
| ISSUE-05 | {TITULO} | {MOTIVO} |

### Itens em Aberto

| ID | Titulo | Proximo Passo |
|----|--------|---------------|
| ISSUE-07 | {TITULO} | {ACAO_PENDENTE} |

### Novas Descobertas

| ID | Titulo | Impacto | Status |
|----|--------|---------|--------|
| ISSUE-17 | {TITULO} | {IMPACTO} | open |

### Observacoes

{OBSERVACOES_SOBRE_A_CONDUCAO_DAS_CORRECOES — omitir secao se nao houver}
```

---

## Fluxo B — Bug Report

### B1: Verificar a Correção no Código

Leia a seção **Plano de Correção** do documento (subseções "O que deve ser criado", "O que deve ser modificado", "O que deve ser removido"). Para cada item:

- Confirme no código se a alteração foi de fato aplicada.
- Se a abordagem real diferir do plano, documente a divergência — não reescreva o plano original.
- Se um item do plano não foi implementado, ele é um item `open` — não feche o report.

### B2: Executar o Checklist de Qualidade

Execute para cada app afetado e registre o resultado:

```bash
npm run test -w @stardust/{APP}
npm run typecheck -w @stardust/{APP}
npm run codecheck -w @stardust/{APP}
```

Além dos comandos gerais, verifique:

- Existe **teste unitário cobrindo o cenário específico que causou o bug**? Se não existir, adicione antes de fechar.
- Os testes de regressão do módulo afetado continuam passando?

Se algum comando falhar ou o teste do caso específico estiver ausente, **não feche o report**.

### B3: Registrar Novas Descobertas

Se durante a correção foram encontrados problemas adicionais não cobertos pelo bug report original:

- Avalie se merecem um **novo bug report separado** (problema distinto, camada diferente) ou podem ser registrados como observação no atual (variação do mesmo problema).
- Se criar bug report separado, registre o caminho na seção de Resolução Final.

### B4: Atualizar o Documento

Faça as seguintes edições no arquivo:

1. **Frontmatter:** Atualize `last_updated` (sem `_at`, padrão do bug report). Mude `status` para `closed` **somente** se todos os itens do plano foram implementados e os testes passam.
2. **Seção de Resolução Final:** Adicione ao final do documento.

---

### Template: Seção de Resolução Final (Bug Report)

```md
## Resolucao Final

**Data de conclusao:** {DATA}

### Causa Raiz Confirmada

{Descricao da causa raiz real. Se diferiu do diagnostico original, registre a divergencia aqui.}

### Abordagem Adotada

{Resumo do que foi efetivamente implementado.}

**Divergencias do plano original:**
- {Item do plano original} → {O que foi feito de diferente e por que}

### Novas Descobertas

{Problemas encontrados durante a correcao que nao estavam no report original. Omitir secao se nao houver.}

- Bug report separado criado: {sim — `documentation/features/{dominio}/bug-reports/{nome}.md` | nao}

### Resultado do Checklist

- [ ] Comportamento incorreto nao ocorre mais
- [ ] Teste unitario cobre o cenario especifico do bug
- [ ] `npm run test -w @stardust/{APP}` — passou | falhou
- [ ] `npm run typecheck -w @stardust/{APP}` — passou | falhou
- [ ] `npm run codecheck -w @stardust/{APP}` — passou | falhou

### Observacoes

{Observacoes livres sobre a conducao da correcao — omitir secao se nao houver}
```

---

## Restrições

- Não altere o conteúdo original dos issues, diagnósticos ou do plano de correção — apenas acrescente campos de status, justificativas e a seção de Resolução Final.
- Não marque um item como `resolved` sem verificar a correção no código ou receber confirmação explícita.
- Não altere `status` para `closed` no frontmatter enquanto houver itens `open` sem justificativa de descarte.
- Se a causa raiz real diferir da identificada originalmente, registre a divergência — nunca reescreva o histórico do documento.
- Em bug reports, não feche sem confirmar a existência de teste unitário para o cenário específico do bug.