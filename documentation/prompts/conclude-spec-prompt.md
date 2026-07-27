---
description: Concluir uma Spec após verificação integrada independente, consolidando documentação, commit, PR, Codex Review e CI até a entrega ficar mergeable.
---

# Prompt: Concluir Spec

## Objetivo

Formalizar e entregar uma implementação cujas fases já foram aceitas, ou que foi
aceita pelo modo direto. O workflow só termina depois de consolidar a
documentação, obter o Judge final, criar commits e PR, solicitar Codex Review e
aguardar CI e pendências do PR até a entrega ficar mergeable.

## Entrada

- Spec implementada.
- Plan associado, quando a execução foi planejada.
- Evidência de `judge-implementation-agent: accepted` para execução direta.

## Regras Aplicáveis

Leia:

- `documentation/rules/harness-rules.md`.
- `documentation/agents/orchestrator-agent.md`.
- `documentation/agents/judge-conclusion-agent.md`.
- `documentation/prompts/commit-code-prompt.md`.
- `documentation/prompts/create-pr-prompt.md`.
- `documentation/prompts/resolve-pr-pendencies-prompt.md`.
- Spec e Plan completos.
- PRD referenciado pela Spec.
- `documentation/architecture.md`.
- `documentation/rules/rules.md` e Rules das camadas afetadas.

## Fase 1 — Pré-condições

### Execução planejada

Confirme:

- Todas as tarefas estão `[x]` e `verified`.
- Todas as fases estão `accepted`.
- Não existe tarefa ou fase em `pending`, `implementing`, `validating`,
  `awaiting_judgment`, `evaluation_failed`, `changes_requested` ou `blocked`.
- Não há finding bloqueante.
- A `spec_revision` do Plan corresponde ao hash atual da Spec.
- Cada tarefa possui sensores registrados e cada fase possui avaliação
  registrada.

### Execução direta

Confirme:

- Revisão da Spec avaliada.
- Sensores oficiais aprovados.
- `judge-implementation-agent: accepted`.
- Nenhum finding humano ou automático aberto.

Se qualquer pré-condição falhar, interrompa a conclusão e devolva o trabalho ao
workflow de implementação correto.

## Fase 2 — Conclusion Gate

Execute sobre o diff integrado, informando todos os paths afetados:

```bash
npm run harness -- \
  gate conclusion \
  --spec=<path> \
  --base=<commit-base> \
  --allowed-path=<path-ou-glob>
```

Inclua testes de integração, builds, Playwright/browser, runtime, dead code e
migrations pelas opções explícitas do runner conforme a Spec. Não execute o
`quality-ratchet` localmente: o job obrigatório do PR é a evidência oficial
desse sensor.

Nenhuma regressão pode permanecer. Não use `--update-baseline` para contornar o
quality ratchet. Falha de código reabre a fase e a tarefa afetadas;
`conclude-spec` não implementa a correção.

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
   definido em `documentation/agents/judge-conclusion-agent.md`. Nomeie-o
   `Judge Conclusion`; no Codex, use `judge_conclusion` como `task_name`.
3. Envie Spec/revisão, Plan, commit-base, diff integral, sensores finais, PRD,
   Architecture, Rules, vereditos das fases e histórico de findings.
4. Não envie narrativa do Builder.
5. Compare o worktree depois; qualquer edição feita pelo Judge invalida o
   parecer.

Se o veredito for `failed`:

- Não feche Spec ou Plan.
- Registre findings no Plan quando existir.
- Reabra a fase afetada e as tarefas indicadas, ou crie tarefas corretivas.
- Retorne a `implement-plan` ou `implement-spec`.

Se for `accepted`, prossiga.

## Fase 5 — Fechamento

- Atualize a Spec para `status: closed` e a data final.
- No Plan, defina `status: completed`, `current_phase: null`,
  `current_task: null`, atualize Conclusão, Estado Atual e Histórico.
- Marque no PRD os requisitos entregues.
- Registre zero findings bloqueantes e o veredito do Judge.

## Fase 6 — Commit e Pull Request

Depois do fechamento documental:

1. Execute `commit-code` incluindo apenas alterações da Spec atual.
2. Confirme que o worktree não contém alterações pendentes do escopo.
3. Faça `push` da branch.
4. Execute `create-pr` usando o resumo de conclusão.
5. Registre URL, número e `HEAD` atual do PR.
6. Confirme que `create-pr` solicitou o Codex Review com o comentário exato
   `@codex review`.

Alterações preexistentes ou de outras features não entram nos commits.

## Fase 7 — Aguardar Codex Review e CI

Execute `resolve-pr-pendencies` com a URL do PR e permaneça no workflow até:

- Todos os checks obrigatórios do `HEAD` atual estarem concluídos e verdes.
- O job de `quality-ratchet` do CI estar aprovado nos workspaces afetados.
- O Codex ter publicado review para o `HEAD` atual.
- Não existir finding bloqueante ou conversa de review não resolvida.
- O PR estar `mergeable`.

Se CI ou review exigir mudança:

1. Classifique a pendência conforme `resolve-pr-pendencies`.
2. Reabra a fase e as tarefas afetadas, ou a implementação direta.
3. Aplique a correção pelo workflow de implementação correspondente.
4. Reexecute gates e Judges invalidados pela mudança.
5. Crie commit, faça `push` e solicite novo `@codex review`.
6. Reinicie a espera para o novo `HEAD`.

Não considere review de commit anterior como evidência do `HEAD` atual. Não
encerre apenas porque o CI passou se o Codex Review ainda estiver pendente, nem
apenas porque o Codex aprovou se houver check pendente.

## Fase 8 — Comunicação Final

Produza:

```md
## O que foi feito

<resumo técnico>

## Por que foi feito assim

<decisões e trade-offs>

## O que mudou em relação à Spec original

<amendments ou "Nenhum desvio">

## Execução do harness

- Tarefas verificadas: <n>/<n>
- Fases aceitas: <n>/<n>
- Tentativas relevantes: <resumo>
- Findings resolvidos: <resumo>
- Judge da conclusão: accepted
- PR: <URL>
- Codex Review: completed no HEAD <sha>
- CI: passed
- Quality ratchet: passed no CI
- Mergeable: yes

## Cobertura e validação

<sensores, testes, quality ratchets e browser>

## Pontos de atenção para o revisor

<migrations, contratos, side effects e dependências externas>

## Checklist final

- [ ] Sensores finais passando
- [ ] Quality gates passando
- [ ] Judge da conclusão: accepted
- [ ] Commits e push concluídos
- [ ] PR criado
- [ ] Codex Review concluído para o HEAD atual
- [ ] CI e quality ratchet verdes
- [ ] PR mergeable e sem conversas bloqueantes
- [ ] Spec fechada
- [ ] Plan concluído, quando aplicável
- [ ] PRD atualizado
- [ ] Architecture verificada
- [ ] Rules verificadas
```

## Restrições

- Não crie testes, não corrija código e não implemente findings neste prompt.
- Não simule `judge-conclusion-agent` no Orchestrator.
- Não feche documentos antes do veredito `accepted`.
- Não reescreva histórico de tentativas ou revisões humanas.
- Não use o Judge da conclusão para repetir a avaliação detalhada de cada fase;
  ele verifica integração entre fases, critérios globais e fechamento
  documental. Em Plan de fase única, concentre-o em regressões finais e
  coerência de encerramento.
- Não reporte conclusão enquanto o PR não satisfizer todas as condições da
  Fase 7.
- Se uma correção remota alterar código ou contrato, invalide os pareceres
  afetados; não trate o CI ou o Codex Review como substitutos dos Judges do SDD.
