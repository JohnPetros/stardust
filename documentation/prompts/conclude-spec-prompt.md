---
description: Concluir uma Spec após verificação integrada independente, consolidando Plan, PRD, Architecture, Rules, commit e PR.
---

# Prompt: Concluir Spec

## Objetivo

Formalizar o encerramento de uma implementação já aceita por tarefa ou pelo modo
direto. Este prompt é um release gate documental e operacional; não é um fluxo
de implementação ou correção.

## Entrada

- Spec implementada.
- Plan associado, quando a execução foi planejada.
- Evidência de `judge-implementation-agent: accepted` para execução direta.

## Regras Aplicáveis

Leia:

- `documentation/rules/harness-rules.md`.
- `documentation/agents/orchestrator-agent.md`.
- `documentation/agents/judge-conclusion-agent.md`.
- Spec e Plan completos.
- PRD referenciado pela Spec.
- `documentation/architecture.md`.
- `documentation/rules/rules.md` e Rules das camadas afetadas.

## Fase 1 — Pré-condições

### Execução planejada

Confirme:

- Todas as tarefas estão `[x]` e `accepted`.
- Não existe `pending`, `implementing`, `validating`, `evaluation_failed`,
  `changes_requested` ou `blocked`.
- Não há finding bloqueante.
- A `spec_revision` do Plan corresponde ao hash atual da Spec.
- Cada tarefa possui sensores e avaliação registrados.

### Execução direta

Confirme:

- Revisão da Spec avaliada.
- Sensores oficiais aprovados.
- `judge-implementation-agent: accepted`.
- Nenhum finding humano ou automático aberto.

Se qualquer pré-condição falhar, interrompa a conclusão e devolva o trabalho ao
workflow de implementação correto.

## Fase 2 — Conclusion Gate

Execute sobre o diff integrado, informando todos os paths e workspaces afetados:

```bash
npm run harness -- \
  gate conclusion \
  --spec=<path> \
  --base=<commit-base> \
  --allowed-path=<path-ou-glob> \
  --workspace=<workspace>
```

Inclua testes de integração, builds, Playwright/browser, runtime, dead code e
migrations pelas opções explícitas do runner conforme a Spec.

Nenhuma regressão pode permanecer. Não use `--update-baseline` para contornar o
quality ratchet. Falha de código reabre tarefa; `conclude-spec` não implementa a
correção.

## Fase 3 — Consolidação Antes do Julgamento

### Spec

- Confirme que todo comportamento entregue está refletido na Spec.
- Não altere conteúdo técnico tardiamente; divergência material reabre a
  implementação.
- Mantenha `status: open` até o Judge da conclusão aprovar.

### PRD

- A milestone do GitHub é a única fonte de verdade.
- Atualize comportamento, escopo, limitação ou critério de produto refinado.
- Não crie ou edite `documentation/features/**/prd.md`.
- Ainda não marque a entrega como concluída antes do veredito final.

### Architecture

Confirme ou atualize novos fluxos, módulos, padrões de integração, fronteiras ou
responsabilidades estruturais. Se não se aplicar, registre no resumo.

### Rules

Confirme que novos padrões aprovados foram documentados e indexados em
`documentation/rules/rules.md`. Não altere Rule para legitimar violação de
código. Se não se aplicar, registre no resumo.

## Fase 4 — Judge da Conclusão

1. Registre o estado do worktree.
2. Inicie subagente novo com contexto limpo usando `judge-conclusion-agent`,
   definido em `documentation/agents/judge-conclusion-agent.md`.
3. Envie Spec/revisão, Plan, commit-base, diff integral, sensores finais, PRD,
   Architecture, Rules e histórico de findings.
4. Não envie narrativa do Builder.
5. Compare o worktree depois; qualquer edição feita pelo Judge invalida o
   parecer.

Se o veredito for `failed`:

- Não feche Spec ou Plan.
- Registre findings no Plan quando existir.
- Reabra ou crie as tarefas indicadas.
- Retorne a `implement-plan` ou `implement-spec`.

Se for `accepted`, prossiga.

## Fase 5 — Fechamento

- Atualize a Spec para `status: closed` e a data final.
- No Plan, defina `status: completed`, `current_task: null`, atualize Conclusão,
  Estado Atual e Histórico.
- Marque no PRD os requisitos entregues.
- Registre zero findings bloqueantes e o veredito do Judge.

## Fase 6 — Comunicação

Produza:

```md
## O que foi feito

<resumo técnico>

## Por que foi feito assim

<decisões e trade-offs>

## O que mudou em relação à Spec original

<amendments ou "Nenhum desvio">

## Execução do harness

- Tarefas aceitas: <n>/<n>
- Tentativas relevantes: <resumo>
- Findings resolvidos: <resumo>
- Judge da conclusão: accepted

## Cobertura e validação

<sensores, testes, quality ratchets e browser>

## Pontos de atenção para o revisor

<migrations, contratos, side effects e dependências externas>

## Checklist final

- [ ] Sensores finais passando
- [ ] Quality gates passando
- [ ] Judge da conclusão: accepted
- [ ] Spec fechada
- [ ] Plan concluído, quando aplicável
- [ ] PRD atualizado
- [ ] Architecture verificada
- [ ] Rules verificadas
```

## Fase 7 — Commit e Pull Request

Somente depois do checklist completo:

1. Execute `commit-code` incluindo apenas alterações da Spec atual.
2. Execute `create-pr` usando o resumo de conclusão.

Alterações preexistentes ou de outras features não entram nos commits.

## Restrições

- Não crie testes, não corrija código e não implemente findings neste prompt.
- Não simule `judge-conclusion-agent` no Orchestrator.
- Não feche documentos antes do veredito `accepted`.
- Não reescreva histórico de tentativas ou revisões humanas.
