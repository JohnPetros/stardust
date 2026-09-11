---
name: create-chore-issue
description: Criar uma GitHub chore issue técnica para manutenção sem mudança de comportamento ou relação com PRD.
---

# Criar Chore Issue

Transforme uma tarefa de manutenção técnica em uma única issue coerente de tracking. Chore não é
produto: não possui PRD, requisito de PRD ou milestone de produto. Não implemente, crie branch,
commit, PR, Spec ou Plan.

## Classificação

Use este workflow somente quando o resultado não alterar comportamento de usuário, regras de
negócio, permissões, tenancy, contratos públicos, semântica de API ou outcome de produto.

- mudança de comportamento ou capacidade → `create-feat-issue`;
- falha observada → `create-bug-issue`;
- refatoração estrutural behavior-preserving → `create-refactor-issue`;
- manutenção técnica independente de produto → continue neste workflow.

Não reclassifique uma tarefa como chore apenas para evitar esclarecimento de produto ou trabalho
de Spec.

## Autoridade e pesquisa

Leia `AGENTS.md`, `documentation/architecture.md`, `documentation/tooling.md`,
`documentation/rules/rules.md`, `documentation/modules.md` e as Rules aplicáveis aos paths reais.
Inspecione implementação, testes, configuração e dependências somente o suficiente para descrever
o problema técnico com evidência.

Não pesquise, selecione, mencione ou associe PRDs, requisitos de PRD ou milestones de produto.
Não invente contexto de produto para justificar a manutenção. Pesquise issues abertas e fechadas
do repositório para evitar duplicação e verifique labels existentes antes do draft.

## Gate obrigatório de Grilling

Depois da pesquisa factual e antes do draft, execute o protocolo de Grilling definido em
`documentation/sdd.md`. Modele como design tree as decisões ainda abertas sobre resultado técnico,
risco mitigado, limites, contratos preservados, critérios de verificação, aplicação afetada e
metadata.

Pergunte toda a frontier disponível com recomendação e deixe decisões dependentes para rounds
posteriores. Registre decisões, alternativas descartadas, dependências e contradições. A frontier
vazia e a confirmação de entendimento compartilhado permitem preparar o draft, mas não substituem
o approval gate da versão exata a publicar.

## Metadata GitHub

- repository: `JohnPetros/stardust`;
- use somente labels existentes, como `refactor`, `infra`, `documentation`, `web`, `server` e
  `studio`, quando realmente aplicáveis;
- não use `feature` ou `bug`;
- milestone: `None`;
- não associe a PRD, requisito de PRD ou milestone de produto;
- não adicione ao Project 2 por inferência de produto.

## Título e body

Use título nominal, sem prefixo de commit, descrevendo o resultado técnico. Crie exatamente uma
issue, salvo decomposição explicitamente solicitada.

```md
## Objetivo

<resultado técnico e risco mitigado>

## Escopo

- <mudança de manutenção incluída>
- <restrição técnica ou contrato preservado>
- **Fora do escopo:** <comportamento, cleanup ou mudança adjacente excluída>

## Critérios de verificação

- [ ] <resultado técnico observável>
- [ ] <contrato ou comportamento preservado>
- [ ] <validação automatizada, estática ou manual aplicável>

## Referências na codebase

- `<path real>` — <evidência e relevância>
```

Mantenha a issue em nível de delivery técnico. Não inclua PRD, requisito de PRD, milestone,
signatures, file inventory, fluxo técnico detalhado, arquitetura nova ou tarefas especulativas.

## Approval gate

Antes de publicar, apresente o título, body, labels, milestone `None`, confirmação de que não há
relação com PRD e a justificativa técnica. Publique somente após aprovação explícita da versão
atual. A aprovação autoriza apenas a submissão da issue; não autoriza implementação, branch,
commit, PR, Spec ou Plan.

Depois da publicação, retorne número/URL, título, labels, milestone `None` e resumo do resultado
técnico.
