---
name: create-feat-issue
description: Criar uma GitHub feature issue de produto no Stardust a partir de milestone, PRD ou pedido aprovado, com approval e Project 2.
---

# Criar Feature Issue

Transforme uma capacidade ou resultado de produto em uma única issue coerente. Não implemente,
crie branch, commit, PR, Spec ou Plan.

Escreva o título, o body, as perguntas do Grilling e as justificativas em português do Brasil.
Preserve identificadores técnicos, paths, URLs e nomes oficiais de labels.

## Autoridade

Leia `AGENTS.md`, `documentation/rules/rules.md`, `documentation/modules.md` e a milestone de
produto informada. Quando a milestone vincular o PRD canônico em `documentation/prds/`, leia ambos. Leia Architecture e
Rules das camadas somente quando uma restrição material precisar ser preservada; detalhes de
paths, declarations, runtime e comandos pertencem à Spec.

Consuma a estrutura real da autoridade:

- PRDs novos: Outcome, Actors, Consumes, Provides, Capabilities, Experience e User Journeys;
- PRDs/milestones legados: descrição, requisitos, regras de negócio, UI/UX, critérios, fluxos e
  fora de escopo.

Não trate dependency graph ou ordem textual como implementação. Preserve checkboxes/status. Se
milestone, PRD, código e pedido conflitarem materialmente, esclareça antes do draft.

## Gate obrigatório de PRD

Antes do draft:

1. derive módulo, atores, outcome, capacidades e lifecycle solicitados;
2. pesquise o PRD canônico em `documentation/prds/*.md` e os PRDs de feature em `documentation/**/prd.md`;
3. pesquise milestones abertas e fechadas via GitHub e siga seus links de PRD;
4. compare candidatos pelo contrato completo e pelos User Journeys/fluxos, não apenas pelo
   título ou proximidade de paths;
5. selecione exatamente um PRD principal e o `RP-*` mais específico que cobre a issue;
6. não trate a milestone como PRD; se nenhum PRD canônico em `documentation/prds/` governar o outcome,
   encaminhe primeiro para `create-prd`.

Uma feature issue não pode chegar ao approval gate com PRD desconhecido. Se nenhum candidato
governar o outcome, encaminhe primeiro para `create-prd` ou amendment. Se dois candidatos forem
materialmente equivalentes ou conflitantes, peça decisão antes de redigir.

## Gate obrigatório de Grilling

Siga integralmente o **Grilling gate** definido em
[`sdd.md#grilling-gate`](../sdd.md#grilling-gate). Este prompt apenas
aplica o protocolo ao contexto de uma Feature Issue; não duplique nem crie regras paralelas.

Depois da pesquisa factual e antes do draft, modele como design tree as decisões ainda abertas
sobre outcome, atores, escopo, critérios observáveis, fora do escopo, milestone e prioridade, sem
antecipar o Technical Contract da Spec. Recompute a frontier por round, pergunte todas as decisões
disponíveis com resposta recomendada e aguarde a confirmação de entendimento compartilhado antes
de preparar o draft. Essa confirmação não substitui o approval gate da versão exata a publicar.

## Metadata GitHub

- repository: `JohnPetros/stardust`;
- label obrigatória: `feature`;
- adicione `web`, `server` e/ou `studio` quando confirmadas;
- use `infra` ou `documentation` somente quando forem parte real do entregável;
- use apenas labels existentes;
- associe exatamente uma milestone de produto;
- depois de criada, adicione ao Project 2, defina `Status: Todo` e a prioridade aprovada
  (`HIGH`, `MEDIUM` ou `LOW`), consultando IDs atuais via GraphQL em vez de hardcode.

Se milestone ou prioridade não estiverem disponíveis, obtenha-as antes do approval final.

## Título e body

Use título nominal, sem prefixo de commit e orientado ao outcome, seguindo o padrão atual do
repositório.

```md
## 🎯 Objetivo

<resultado para usuário ou negócio>

## 📦 Escopo da Entrega

- <comportamento/capacidade incluída>
- <restrição material de produto, Design ou integração>
- <referência Pencil exata quando fornecida>

## ✅ Critérios de Aceitação

- <sucesso observável>
- <validação/erro observável>
- <autorização/tenant quando aplicável>
- <responsividade/acessibilidade quando aplicável>
- <critério adicional observável>

## 🧪 Validação

Backend (quando afetado):

- <comandos e testes relevantes para os contratos do servidor>

Frontend (quando afetado):

- <comandos e testes relevantes para as aplicações de interface>

Evidências esperadas:

- <testes automatizados, validação manual ou E2E relevantes>
- <validação visual, responsiva e de acessibilidade quando aplicável>

## 🔗 Rastreabilidade

- PRD principal: <path do PRD canônico em documentation/prds/ e versão>
- PRD complementar: <path e versão ou Não aplicável>
- Requisitos: <RP-* principal e requisitos complementares aplicáveis>
- Jornadas: <JN-* aplicáveis ou Não aplicável>
- Issue/User Story de origem: <identificador existente ou Não aplicável>
- Design: <arquivo e node/frame exatos ou Não aplicável>
- Spec: <status ou Pendente conforme o processo>
- PR: <URL ou Pendente — será vinculada pelo workflow create-pr>
- Milestone: <URL>

## 🚫 Fora de Escopo

- <comportamento ou capacidade explicitamente excluído>
- <alteração adjacente que não pertence a esta entrega>
```

Não inclua sprint: o projeto Stardust não usa sprints. O campo Requisito deve conter a
referência do requisito principal selecionado, e somente requisitos complementares
aplicáveis devem ser listados como suporte.

Mantenha a issue em nível de product delivery. Não inclua signatures, file inventory, fluxo
técnico detalhado ou decisões novas de arquitetura. Preserve paths/Node IDs Pencil exatamente
quando fornecidos.

## Approval gate

Antes de publicar, apresente título, body, labels, milestone, PRD/requisito selecionado,
justificativa de relevância, Project, Status e prioridade exatos. Publique somente após aprovação
explícita da versão atual. Approval não autoriza implementação, branch, commit, PR ou Spec.

Depois da publicação, retorne número/URL, título, milestone, PRD/requisito, labels,
Project/Status/Priority e resumo do escopo.

## Restrições

- uma issue salvo decomposição explicitamente solicitada;
- preserve boundaries dos módulos e backend authority para permissões, economia e tenancy;
- sem cleanup, dependências ou comportamento especulativo;
- não publique feature issue sem um PRD principal identificado;
- não altere checkbox/status de requisito;
- não invente metadata, milestone, project field ou evidência.
