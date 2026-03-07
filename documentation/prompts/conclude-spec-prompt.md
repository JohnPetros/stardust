---
description: Prompt para concluir uma spec com validação final, atualização de documentação e geração de resumo estruturado para PR.
---

# Prompt: Conclude Spec

**Objetivo:** Finalizar e consolidar a implementação de uma Spec técnica,
garantindo que o código esteja polido, documentado e validado — produzindo ao
final um checklist de validação, os documentos atualizados e um rascunho
estruturado para o Pull Request.

---

## Entradas Esperadas

- **Spec Técnica:** O documento que guiou a implementação (`documentation/features/.../specs/...`), injetado integralmente no contexto.

---

## Fase 1 — Verificação

Esta fase é analítica e deve ser concluída antes de qualquer atualização de
documento.

**1.1 Análise Estática e Formatação**

Execute `npm run codecheck` na raiz do monorepo. Nenhum warning ou erro deve
restar. Caso existam, liste-os explicitamente e aguarde correção antes de
prosseguir.

**1.2 Testes Unitários**

Execute `npm run test` na raiz do monorepo. Todos os testes — novos e
existentes — devem estar passando. Caso algum falhe, interrompa e reporte.

**1.3 Cobertura de Requisitos**

Com base no diff real injetado no contexto, compare cada componente descrito na
Spec (seções "O que deve ser criado" e "O que deve ser modificado") contra o
código implementado. Ao final desta etapa, produza um **checklist de validação**
no seguinte formato:
```markdown
## Checklist de Validação

- [x] <Requisito A> — implementado em `caminho/do/arquivo.ts`
- [x] <Requisito B> — implementado em `caminho/do/arquivo.ts`
- [ ] <Requisito C> — **ausente ou incompleto** (detalhe o gap)
```

---

## Fase 2 — Consolidação de Documentos

Esta fase é de síntese. Execute-a somente após a Fase 1 estar completa e sem
pendências.

**2.1 Atualização da Spec Técnica**

Refine o documento da Spec para refletir decisões de design tomadas durante a
implementação ou desvios de caminho. A audiência é técnica — mantenha o nível
de detalhe de engenharia. Atualize também:

- **Status:** `concluído`
- **Última atualização:** `{{ today }}`

**2.2 Atualização do PRD**

Atualize o PRD associado à Spec com as mudanças implementadas. A audiência aqui
é de produto — traduza o impacto técnico para linguagem de negócio. Marque como
concluídos os itens que foram endereçados pela implementação.

> 💡 Trate Spec e PRD como documentos separados com propósitos distintos. Não
> copie conteúdo técnico de baixo nível para o PRD — sintetize o valor entregue.

---

## Fase 3 — Comunicação

Esta fase produz o artefato final para facilitar a abertura do Pull Request.

**3.1 Rascunho do Pull Request**

Gere um rascunho de descrição de PR com a seguinte estrutura obrigatória:
```markdown
## O que foi feito

<Descrição objetiva das mudanças implementadas, em linguagem técnica>

## Por que foi feito assim

<Decisões de design relevantes e tradeoffs considerados>

## O que mudou em relação à Spec original

<Desvios ou refinamentos ocorridos durante a implementação. Se nenhum, declare
explicitamente "Nenhum desvio em relação à Spec original.">

## Pontos de atenção para o revisor

<Riscos, áreas sensíveis, dependências externas ou decisões que merecem revisão
cuidadosa. Se nenhum, declare explicitamente "Nenhum ponto de atenção
identificado.">

## Checklist

- [ ] `npm run codecheck` passou sem warnings
- [ ] `npm run test` passou sem falhas
- [ ] Spec atualizada e marcada como concluída
- [ ] PRD atualizado com os itens concluídos
```

---

## Saídas Esperadas

Ao final da execução, devem ter sido produzidos:

1. **Checklist de validação** de requisitos (Fase 1.3)
2. **Spec atualizada** com status `concluído` e data de atualização (Fase 2.1)
3. **PRD atualizado** com itens marcados como concluídos (Fase 2.2)
4. **Rascunho de PR** com estrutura completa (Fase 3.1)