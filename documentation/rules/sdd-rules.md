# Regras Operacionais do SDD

Este arquivo é um índice curto para a fonte normativa completa em
`documentation/sdd.md`.

## Fluxo

```text
Demanda → Spec → Judge Spec → Plan opcional → Judge Plan → Implementação
→ sensores → Judge Implementation → preflight → evaluation.md
→ PR / checks e build no CI → Spec concluída
```

- Plan é opcional: `implement-spec` atende Specs pequenas; `create-plan` +
  `implement-plan` atendem implementações grandes ou faseadas.
- Interfaces, ports, repositories e services criados ou alterados pela solução
  devem declarar na Spec os métodos, entradas e retornos esperados.
- `evaluation.md` é obrigatório após implementação ou julgamento e deve existir
  antes do PR.
- O fechamento não cria um novo papel de julgamento; `conclude-spec` fecha o
  fluxo.
- PRDs canônicos ficam em `documentation/prds/<module>/<english-slug>.md`; cada
  milestone deve conter somente o link correspondente na branch `main`.
- Antes de criar uma Spec, siga o único link do milestone, registre o caminho e
  a revisão do PRD consultado e não derive o PRD apenas do título, label ou path.
- Quando existir referência Pencil, ela é a fonte visual canônica: o código deve
  preservar os nodes, estados e viewports declarados; qualquer divergência exige
  decisão/amendment rastreável e aprovação. A comparação Pencil/Web independente
  é obrigatória para frontend e desvio não aprovado bloqueia o fluxo.

## Persistência imediata

O Orchestrator persiste cada descoberta assim que ela ocorre:

| Tipo | Destino |
| --- | --- |
| requisito, Contract ou escopo | `spec.md` |
| tarefa, dependência ou finding operacional | `plan.md` |
| evidência, decisão ou lição da feature | `evaluation.md` |
| regra reutilizável | `documentation/rules/` |

Se um fluxo direto precisar de tarefas operacionais, crie o `plan.md` antes de
continuar. Sem Plan, findings curtos ficam no `evaluation.md`.

## Sensores e CI

Sensores locais: `format`, `check:code`, `check:types`, `test:unit` e os testes
de arquitetura/integração aplicáveis. Os checks e o build final são executados
no CI. Build não precisa rodar a cada fase ou retry.

## Falha de check ou build no CI

Manter a Spec `in_progress`, registrar a falha em `evaluation.md`, criar
`Builder Fix CI-*`, repetir os sensores afetados e repetir o Judge apenas se a
evidência tiver sido invalidada. O `create-pr` permanece aberto e repete esse
loop até os checks e o build passarem no HEAD atual; somente então o fluxo segue
para `conclude-spec`.

Consulte `documentation/sdd.md` para contratos, estados, papéis, estrutura dos
artefatos e critérios de conclusão.
