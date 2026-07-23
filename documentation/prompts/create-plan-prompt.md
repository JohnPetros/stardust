---
description: Criar um plano de implementação que também funciona como ledger de progresso, handoff e findings ativos.
---

# Prompt: Criar Plano

## Objetivo

Transformar uma Spec aceita em fases e tarefas atômicas, com dependências,
critérios rastreáveis e estado operacional suficiente para execução por agentes
separados. O Plan é a única fonte de verdade de progresso da implementação.

## Entrada

- Spec em `documentation/features/**/specs/*-spec.md`.
- Veredito `accepted` do `judge-spec-agent`.

Bug report não é entrada direta: crie primeiro uma Spec de correção. Se a Spec
estiver incompleta, não tiver sido aceita ou contiver pendência bloqueante, não
crie o Plan.

## Regras Aplicáveis

Leia integralmente:

- `documentation/rules/harness-rules.md`.
- `documentation/agents/orchestrator-agent.md`.
- `documentation/rules/rules.md`.
- `documentation/rules/code-conventions-rules.md`.
- Rules das camadas e dos tipos de teste citados pela Spec.

## Construção do Plan

### 1. Fixar o contrato

- Registre o caminho da Spec.
- Calcule a revisão com `git hash-object <spec>`; não use apenas a data.
- Inicie o Plan como `pending`, sem commit-base até a implementação começar.
- Copie somente os IDs dos requisitos e critérios; não replique o conteúdo da
  Spec.

### 2. Definir fases

- F1 é `core` quando houver impacto de domínio, structures ou use cases.
- Crie fases apenas para apps realmente tocados: F2 `server`, F3 `web`, F4
  `studio`.
- Fases consumidoras dependem dos contratos que consomem.
- Fases independentes podem rodar em paralelo somente depois das dependências
  comuns.
- Não crie fase vazia apenas para preservar numeração; quando a ausência de
  impacto for importante, registre-a na estratégia.

### 3. Definir tarefas

Cada tarefa deve ter:

- Uma responsabilidade atômica.
- Dependências reais.
- Resultado observável.
- IDs `REQ-*`, `AC-*` e `AR-*` associados.
- Camada.
- Paths permitidos.
- Rules obrigatórias.
- Estado inicial `pending`.
- Próxima ação inequívoca.

Reserve mudanças em arquivos compartilhados, como barrel files e composição,
para tarefas de integração. Tarefas que escrevem no mesmo arquivo não são
paralelas.

### 4. Implementação e teste como unidade de avaliação

Inclua a implementação e seus testes na mesma tarefa sempre que o artefato for
testável:

- Objetos de domínio.
- Use cases.
- Handlers (`controller`, `job`, `action`, `tool`).
- Widgets (`view`, `hook`).
- Rotas HTTP do server e rotas/pages web conforme as Rules.

Uma tarefa testável só pode receber `accepted` quando implementação e testes
estiverem completos e passarem pelo Implementation Gate e pelo Judge. Não crie uma tarefa
de teste dependente da implementação: isso permitiria avaliar um contrato
parcial e bloquearia a própria dependência necessária para concluí-lo.

Não crie teste direto para repository, service, provider, gateway, client,
mapper, factory, config, adapter ou composição. Cubra-os indiretamente pelo
artefato permitido mais próximo e registre essa cobertura na tarefa que testa o
comportamento público.

Toda tarefa com cobertura obrigatória declara a Rule de teste aplicável:

| Tipo | Rule |
| --- | --- |
| Domínio | `documentation/rules/domain-objects-testing-rules.md` |
| Use case | `documentation/rules/use-cases-testing-rules.md` |
| Handler | `documentation/rules/handlers-testing-rules.md` |
| Rota server | `documentation/rules/server-routes-testing-rules.md` |
| Rota/page web | `documentation/rules/web-app-routes-testing-rules.md` |
| Widget | `documentation/rules/widget-tests-rules.md` |

### 5. Tarefas documentais

Quando a Spec introduzir mudança aprovada de Architecture ou Rule, crie tarefa
documental explícita no mesmo Plan. Não adie novo padrão para `conclude-spec`.

## Localização

Salve ao lado da feature:

- Spec: `documentation/features/{dominio}/{feature}/specs/{nome}-spec.md`
- Plan: `documentation/features/{dominio}/{feature}/plans/{nome}-plan.md`

Preserve subdiretórios intermediários, substitua apenas `specs` por `plans` e
`-spec.md` por `-plan.md`.

## Template

```md
---
title: <título do plano>
spec: <caminho relativo da spec>
spec_revision: <hash de git hash-object>
status: pending
current_task: null
base_commit: null
last_updated_at: <YYYY-MM-DD>
---

# Plano — <nome>

## Estado Atual

- **Tarefa ativa:** nenhuma
- **Estado:** `pending`
- **Última ação:** Plan criado a partir da Spec aceita.
- **Próxima ação:** iniciar a primeira tarefa sem dependências.
- **Bloqueios:** nenhum
- **Workspaces afetados:** <lista>

## Pendências

Sem pendências.

## Dependências de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | <objetivo> | - | - |
| F2 | <objetivo> | F1 | F3 |

**Estratégia de paralelismo:** <explicação baseada em dependências e ownership de paths>.

## F1 — <nome>

**Objetivo:** <resultado da fase>.

### Tarefas

- [ ] **T1.1** — <responsabilidade atômica>
  - **Estado:** `pending`
  - **Depende de:** -
  - **Critérios da Spec:** REQ-01, AC-01, AR-01
  - **Resultado observável:** <condição verificável>
  - **Camada:** `core`
  - **Paths permitidos:**
    - `<path ou diretório>`
    - `<path de testes>`
  - **Rules:**
    - `documentation/rules/<rule>.md`
    - `documentation/rules/domain-objects-testing-rules.md`
  - **Cobertura obrigatória:** <cenários que devem ser testados, ou `não se aplica` com justificativa>
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

## Amendments da Spec

Nenhum.

## Histórico de Execução

Nenhuma execução registrada.

## Conclusão

- **Estado:** pending
- **Tarefas aceitas:** 0/<total>
- **Findings bloqueantes:** 0
- **Sensores finais:** pending
- **Judge da conclusão:** pending
```

## Regras de Mutação

- Somente o Orchestrator atualiza estado, tentativas, gates, findings ativos,
  histórico e checkboxes.
- Pareceres completos dos Judges permanecem no chat; o Plan registra apenas
  veredito resumido, finding ativo e próxima ação.
- `[x]` significa `accepted` pelo `judge-implementation-agent`.
- Builder e Worker não editam o Plan.
- Não apague tentativas anteriores; resuma-as no histórico.
- Saída bruta de comandos não entra no documento.
