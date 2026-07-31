# Regras Operacionais do SDD

Este arquivo é um índice curto para a fonte normativa completa em
`documentation/sdd.md`.

## Fluxo

```text
Demanda → Spec → Judge Spec → Plan opcional → Implementação
→ sensores → Judge Implementation → preflight → evaluation.md
→ PR / Quality Gate / build no CI → Spec concluída
```

- Plan é opcional: `implement-spec` atende Specs pequenas; `create-plan` +
  `implement-plan` atendem implementações grandes ou faseadas.
- `evaluation.md` é obrigatório após implementação ou julgamento e deve existir
  antes do PR.
- O fechamento não cria um novo papel de julgamento; `conclude-spec` fecha o
  fluxo.

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
de arquitetura/integração aplicáveis. Quality Gate e build final são do CI.
Build não precisa rodar a cada fase ou retry.

## Falha do Quality Gate

Manter a Spec `in_progress`, registrar a falha em `evaluation.md`, criar
`Builder Fix QG-*`, repetir os sensores afetados e repetir o Judge apenas se a
evidência tiver sido invalidada. O `create-pr` permanece aberto e repete esse
loop até Quality Gate e build passarem no HEAD atual; somente então o fluxo
segue para `conclude-spec`.

Consulte `documentation/sdd.md` para contratos, estados, papéis, estrutura dos
artefatos e critérios de conclusão.
