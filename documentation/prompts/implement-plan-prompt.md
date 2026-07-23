---
description: Orquestrar um Plan com Builder, Workers, gates determinísticos e Judge independente, mantendo progresso e handoff no próprio documento.
---

# Prompt: Implementar Plano

## Objetivo

Executar um Plan derivado de Spec respeitando dependências, ownership de paths e
avaliação independente por tarefa. O agente que usa este prompt atua como
Orchestrator: coordena, registra e decide transições, mas não substitui Builder
ou Judge.

## Entrada

- Caminho de `documentation/features/**/plans/*-plan.md`.

Se não for informado, descubra o Plan relacionado à Spec ou feature da conversa.
Não use `documentation/plan.md`. Havendo mais de um candidato plausível, peça
confirmação.

## Regras Aplicáveis

Leia integralmente:

- O Plan.
- A Spec referenciada no frontmatter.
- `documentation/rules/harness-rules.md`.
- `documentation/agents/orchestrator-agent.md`.
- `documentation/agents/builder-agent.md`.
- `documentation/agents/worker-agent.md`.
- `documentation/agents/judge-implementation-agent.md`.
- `documentation/rules/rules.md`.
- Rules das camadas afetadas.
- Rule de teste indicada em cada tarefa testável.

## Pre-check

1. Recalcule `git hash-object <spec>` e compare com `spec_revision`.
2. Se divergir, classifique a mudança e atualize o Plan antes de implementar.
3. Registre `base_commit` e o estado inicial do worktree sem sobrescrever
   mudanças preexistentes.
4. Leia todas as fases, dependências, paths e pendências.
5. Retome da primeira tarefa não aceita cujas dependências estejam satisfeitas.
6. Se houver tarefa `implementing`, `validating`, `evaluation_failed` ou
   `changes_requested`, use o Estado Atual e o Histórico para retomar.

## Ordem

Implemente bottom-up:

1. Core e contratos.
2. Drivers e infraestrutura.
3. REST/RPC/queue e demais bordas.
4. UI e composição.

Nunca implemente consumidor antes do contrato consumido. Implementação e testes
do mesmo artefato formam uma única unidade de trabalho e de avaliação; uma
tarefa testável não pode ser julgada nem aceita com cobertura pendente.

## Ciclo por Tarefa

### 1. Preparar

O Orchestrator atualiza:

- `status: in_progress` no Plan.
- `current_task`.
- Estado da tarefa para `implementing`.
- Tentativa e próxima ação.
- Estado Atual e Histórico.

### 2. Readiness Gate

Execute:

```bash
npm run harness -- \
  gate readiness \
  --spec=<path> \
  --revision=<hash> \
  --plan=<path> \
  --task=<ID>
```

Não acione o Builder enquanto o gate falhar.

### 3. Acionar Builder

Inicie um subagente separado usando `builder-agent`, definido em
`documentation/agents/builder-agent.md`. Forneça apenas:

- Tarefa, camada e resultado observável.
- Spec/revisão e critérios associados.
- Paths permitidos.
- Contratos consumidos.
- Rules da camada e de teste.
- Cobertura obrigatória da mesma unidade de avaliação.
- Findings bloqueantes da tentativa anterior.

O Builder pode acionar no máximo dois `worker-agent` para unidades realmente
independentes. Workers não podem escrever nos mesmos paths nem criar outros
subagentes. Aguarde toda a árvore de implementação encerrar.

### 4. Integrar e inspecionar

- Confirme o diff combinado.
- Rejeite paths fora do escopo.
- Verifique se Builder/Workers alteraram Plan ou fontes normativas sem
  autorização.
- Atualize a tarefa para `validating`.
- Trate divergências documentais conforme `harness-rules.md`.

### 5. Implementation Gate

Execute com os paths e workspaces da tarefa:

```bash
npm run harness -- \
  gate implementation \
  --spec=<path> \
  --base=<commit-base> \
  --allowed-path=<path-ou-glob> \
  --workspace=<workspace>
```

Adicione integração, Playwright, build, runtime, dead code e migrations conforme
a Spec. Não avance com falha causada pela implementação. Devolva a evidência ao
Builder, corrija e execute novamente. Registre apenas o resumo no Plan.

### 6. Acionar Judge da implementação

Depois do Implementation Gate passar:

1. Registre o estado do worktree.
2. Inicie subagente novo, com contexto limpo, usando
   `judge-implementation-agent`, definido em
   `documentation/agents/judge-implementation-agent.md`.
3. Envie Spec/revisão, tarefa, critérios, commit-base, diff, paths, Rules,
   sensores e findings anteriores.
4. Não envie a narrativa do Builder.
5. Compare o worktree após o Judge; qualquer edição invalida o parecer.

O Judge avalia implementação e testes como uma única unidade. Não solicite
veredito enquanto algum cenário obrigatório da tarefa estiver pendente.

### 7. Registrar o veredito

Se `accepted`:

- Marque `[x]`.
- Defina estado `accepted`.
- Registre critérios e evidências resumidas.
- Zere findings bloqueantes.
- Atualize Histórico, contagem e próxima tarefa.

Se `failed`:

- Mantenha `[ ]`.
- Defina `evaluation_failed`.
- Registre findings e próxima ação.
- Reative o Builder com apenas os findings bloqueantes.
- Limite a três tentativas pelo mesmo motivo; depois escale ao usuário.

## Paralelismo

O Orchestrator pode executar Builders em paralelo somente para tarefas que o
Plan declare independentes e que não compartilhem paths. Dentro de cada Builder,
Workers seguem a mesma regra. Aguarde todos antes de integrar ou iniciar um
Judge. O Judge nunca é filho do Builder.

## Mudanças Durante a Implementação

Não use `update-spec`. Quando Builder, Worker, Judge ou usuário identificar
divergência:

- Correção factual: Orchestrator ajusta cirurgicamente, recalcula revisão e
  registra no Plan.
- Amendment: pausa, atualiza Spec e Plan, invalida avaliações afetadas e retoma.
- PRD, Architecture ou Rule: crie tarefa documental e obtenha a decisão exigida
  por `harness-rules.md`.
- Feedback humano contra tarefa aceita: estado `changes_requested`, finding
  `HR-*` e reabertura.

## Conclusão da Execução

Quando todas as tarefas estiverem `accepted`:

- Atualize Estado Atual informando que o Plan aguarda `conclude-spec`.
- Não marque `status: completed` ainda.
- Não feche a Spec.
- Não faça commit ou PR por este prompt.

`completed` é reservado ao fluxo aceito por `judge-conclusion-agent`.

## Saída

- Tarefas aceitas nesta execução.
- Builders e Workers acionados.
- Sensores executados.
- Avaliações e tentativas.
- Amendments e documentos atualizados.
- Próxima tarefa ou indicação para `conclude-spec`.
- Pendências e findings abertos.
