---
name: conclude-spec
description: Concluir uma Spec com sensores integrados e Judge Conclusion na task atual, até o PR ficar mergeable.
---

# Concluir Spec

O Orchestrator conduz a conclusão na task atual. Não crie uma thread/task de
conclusion.

## Pré-condições e sensores

- Spec `open`, implementação direta aceita ou todas as fases aceitas.
- Plan, quando existir, sem tarefa ou finding pendente.
- revisão da Spec correspondente ao diff.

Execute `check:code`, `check:types`, `test:unit`, `check:architecture` e
`check:dead-code` no escopo integrado. Execute `test:integration` quando
declarado pela Spec ou aplicável. `format` deve ocorrer antes dos checks; build
permanece como job final do CI.

## Judge Conclusion

Acione `judge-conclusion-agent` como subagente `Judge Conclusion` read-only na
task atual. Envie Spec/revisão, Plan, PRD, diff integral, Architecture, Rules,
vereditos anteriores e evidências dos sensores. Não envie narrativa do Builder.

O Judge verifica integração global, matriz `RF-*`/`CA-*`/`RN-*`, regressões,
documentação e segurança proporcional ao risco. Para autenticação, autorização,
dados sensíveis, upload, execução de código, pagamentos ou integrações externas,
exija revisão de segurança dedicada.

Se `failed`, reabra fases/tarefas e encaminhe findings ao Builder; depois
reexecute sensores e Judges invalidados. Se `accepted`, atualize e feche Spec,
Plan, PRD, Architecture, Rules e overview conforme os fatos.

Crie commits e PR, solicite Codex Review e aguarde Quality Gate, testes e build
do `HEAD` atual. Encerre somente com CI verde, conversas bloqueantes resolvidas
e PR mergeable. Nenhuma dessas etapas cria nova thread.
