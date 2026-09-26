---
name: create-chore-issue
description: Criar uma GitHub chore issue técnica para manutenção sem mudança de comportamento ou relação com PRD.
---

# Criar Chore Issue

Transforme uma tarefa de manutenção técnica em uma única issue coerente de tracking. Chore não é
produto: não possui PRD, requisito de PRD ou milestone de produto. Não implemente, crie branch,
commit, PR, Spec ou Plan.

Escreva o título, o body, as perguntas do Grilling e as justificativas em português do Brasil.
Preserve identificadores técnicos, paths, URLs e nomes oficiais de labels.

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

Depois da pesquisa factual e antes do draft, execute o **Grilling gate** definido em
[`sdd.md#grilling-gate`](../sdd.md#grilling-gate). Modele como design tree as decisões ainda abertas sobre resultado técnico,
risco mitigado, limites, contratos preservados, critérios de verificação, aplicação afetada e
metadata.

Pergunte toda a frontier disponível com recomendação e deixe decisões dependentes para rounds
posteriores. Registre decisões, alternativas descartadas, dependências e contradições. A frontier
vazia e a confirmação de entendimento compartilhado permitem preparar o draft, mas não substituem
o approval gate da versão exata a publicar.

O projeto Stardust não usa sprints. Trate sprint como não aplicável: não pergunte sobre sprint,
não inclua sprint no draft ou nos metadados da issue.

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
issue, salvo decomposição explicitamente solicitada. Estruture todo body com estes títulos, nesta
ordem:

```md
## 🎯 Objetivo

<resultado técnico pretendido e risco mitigado>

## 📦 Entregável Esperado

- <artefatos, mudanças ou resultado técnico verificável, incluindo local de registro quando aplicável>
- <validação esperada quando ajudar a definir o resultado concluído>

## ⚠️ Dependências / Restrições

- <dependências, limites técnicos, contratos a preservar ou exclusões relevantes>
- <responsável pretendido, somente quando conhecido ou definido pelo usuário>
- <paths reais da codebase relevantes, com breve justificativa>
```

Mantenha a issue em nível de delivery técnico. Inclua critérios de verificação junto ao entregável
esperado quando forem necessários para tornar o resultado observável. Registre contratos preservados,
dependências, exclusões e referências na seção Dependências / Restrições. Não invente responsável;
quando a atribuição ainda estiver pendente, registre isso apenas se for relevante para o tracking.

Não acrescente milestone, PRD, requisito de PRD, signatures, file inventory, fluxo técnico
detalhado, arquitetura nova ou tarefas especulativas.

## Approval gate

Antes de publicar, apresente o título, body, labels, milestone `None`, confirmação de que não há
relação com PRD e a justificativa técnica. Não inclua sprint nos metadados apresentados. Publique
somente após aprovação explícita da versão atual. A aprovação autoriza apenas a submissão da issue;
não autoriza implementação, branch, commit, PR, Spec ou Plan.

Depois da publicação, retorne número/URL, título, labels, milestone `None` e resumo do resultado
técnico.
