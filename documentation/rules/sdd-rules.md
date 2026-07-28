# Regras de execução do SDD

## Uma task, múltiplos subagentes

Todo o fluxo de Spec, Plan opcional, implementação, validação e conclusão ocorre
na task/thread atual. O Orchestrator pode e deve criar Builder, Workers e Judges
como subagentes nessa mesma task. Não use `create_thread`, fork, handoff para
outra thread ou uma task separada para implementation ou conclusion.

## Papéis

- **Orchestrator:** mantém Spec/Plan, despacha subagentes, executa sensores e
  controla transições.
- **Builder:** implementa o escopo e integra Workers.
- **Worker:** executa uma tarefa atômica com paths independentes.
- **Judge:** avalia read-only contra Contract, Rules, diff e evidências.

O Judge é irmão do Builder, nunca seu filho. Workers pertencem ao Builder. O
modo direto usa `Builder Direct` e `Judge Direct`; Specs e conclusões usam
`Judge Spec` e `Judge Conclusion`.

## Estados

Uma Spec usa `draft`, `open` e `completed`. Ela muda para `open` após o
`Judge Spec: accepted`; muda para `completed` somente após implementação,
sensores e `Judge Conclusion: accepted`.

Quando existir, um Plan usa `pending`, `in_progress`, `blocked` e `completed`.
Tarefas usam `pending`, `implementing`, `validating` e `verified`. Um checkbox só
é marcado quando código e evidências daquela tarefa foram verificados pelo
Orchestrator.

## Sensores oficiais

Os sensores são package scripts da raiz:

| Script | Finalidade | Momento recomendado |
| --- | --- | --- |
| `format` | aplicar formatação | após editar e antes dos checks |
| `check:code` | lint e consistência estática, sem escrever | ciclo curto e conclusão |
| `check:types` | validar contratos TypeScript | ciclo curto e conclusão |
| `check:architecture` | validar fronteiras de dependência | fase e conclusão |
| `check:dead-code` | detectar código/dependências sem uso | fim da fase e conclusão |
| `test:unit` | validar unidades e comportamento isolado | ciclo curto e conclusão |
| `test:integration` | validar integrações e fluxos reais | quando aplicável e conclusão |

`format` não é gate porque altera arquivos. `build` não é sensor do SDD; roda no
CI como validação final do artefato. Os checks podem ser filtrados por workspace
durante o ciclo curto e devem cobrir o escopo integrado antes da conclusão.

## Contract e evidências

Use `RF-*`, `CA-*` e `RN-*`. Cada critério deve indicar sua evidência esperada.
Na conclusão, mantenha ou atualize uma tabela critério → evidência na Spec ou no
resumo da execução. Não use comentários `harness:evidence`, comandos de gate,
baselines ou arquivos de relatório gerados por ferramenta própria.

## Avaliação

A avaliação é feita por Judge independente, dentro da mesma task, depois dos
sensores. Ela deve cobrir:

- aderência ao Contract e às Rules;
- comportamento integrado e regressões;
- adequação dos testes;
- arquitetura e código morto;
- segurança proporcional ao risco.

Finding bloqueante precisa citar critério ou regra, evidência concreta e ação
necessária. O Orchestrator devolve o finding ao Builder e reexecuta os sensores
afetados antes de acionar novo Judge. Após três falhas pelo mesmo motivo,
apresente o histórico e peça uma decisão ao usuário.

## Mudanças de escopo

- Correção factual: atualize a Spec de forma cirúrgica.
- Mudança de Contract: pause, atualize PRD/Spec e revalide o trabalho afetado.
- Novo padrão arquitetural: atualize Architecture ou Rules explicitamente.
- Revisão humana: reabra as tarefas e evidências impactadas.

Não use o Plan para encobrir divergências entre fontes normativas.
