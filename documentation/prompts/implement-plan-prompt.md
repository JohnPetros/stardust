---
description: Orquestrar um Plan com Builder, Workers, gates determinísticos e Judge independente, mantendo progresso e handoff no próprio documento.
---

# Prompt: Implementar Plano

## Objetivo

Executar um Plan derivado de Spec respeitando dependências, ownership de paths e
avaliação independente por fase. O agente que usa este prompt atua como
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
5. Retome da primeira fase não aceita cujas dependências estejam satisfeitas e,
   dentro dela, da primeira tarefa não verificada.
6. Se houver tarefa `implementing`, `validating` ou `changes_requested`, ou fase
   `awaiting_judgment` ou `evaluation_failed`, use o Estado Atual e o Histórico
   para retomar.
7. Em Plan legado, converta tarefa anteriormente `accepted` para `verified` sem
   perder sua evidência. Só derive a fase como `accepted` quando existir parecer
   integrado equivalente; caso contrário, registre os campos da fase e submeta
   o conjunto ao ciclo por fase.

Uma dependência de fase só está satisfeita quando a fase antecedente estiver
`accepted`; tarefas `verified` isoladamente não liberam a fase consumidora.

## Registro de Bloqueios

Registre a primeira ocorrência de qualquer bloqueio no Plan, sem esperar uma
segunda tentativa. Use um identificador estável (`BLK-001`, `BLK-002`...) e
inclua:

```md
### BLK-001 — <resumo>

- Gate/comando: `<gate ou comando>`
- Tipo: `ambiental`, `implementação` ou `documental`
- Erro: <mensagem observada>
- Impacto: <o que ficou impedido>
- Evidência: <saída, arquivo ou timestamp>
- Workaround: <validações alternativas, se houver>
- Próxima ação: <condição objetiva para retomar>
- Status: `open`, `blocked`, `mitigated` ou `closed`
```

Não repita automaticamente o mesmo comando. Só tente novamente quando a
condição externa tiver mudado ou quando houver uma correção concreta. Bloqueios
ambientais não devem ser enviados ao Builder como findings de implementação e
não justificam alterar o Harness para mascarar a falha. Continue tarefas
independentes e mantenha o bloqueio aberto até a evidência de resolução.

## Ordem

Implemente bottom-up:

1. Core e contratos.
2. Drivers e infraestrutura.
3. REST/RPC/queue e demais bordas.
4. UI e composição.

Nunca implemente consumidor antes do contrato consumido. Implementação e testes
do mesmo artefato formam uma única unidade de trabalho. A tarefa é verificada
por sensores determinísticos; a fase integrada é avaliada pelo Judge.

## Ciclo por Tarefa

### 1. Preparar

O Orchestrator atualiza:

- `status: in_progress` no Plan.
- `current_phase`.
- `current_task`.
- Estado da fase para `in_progress`, quando ainda estiver `pending`.
- Base da fase, quando ainda estiver `null`.
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
`documentation/agents/builder-agent.md`. Nomeie-o `Builder F<n>`; no Codex, use
`builder_f<n>` como `task_name`. Forneça apenas:

- Tarefa, camada e resultado observável.
- Spec/revisão e critérios associados.
- Paths permitidos.
- Contratos consumidos.
- Rules da camada e de teste.
- Cobertura obrigatória da mesma unidade de execução.
- Findings bloqueantes da tentativa anterior.

O Builder pode acionar no máximo dois `worker-agent` para unidades realmente
independentes. Workers não podem escrever nos mesmos paths nem criar outros
subagentes. Aguarde toda a árvore de implementação encerrar.

### Fluxo de testes durante a implementação

O Builder deve manter o ciclo local curto enquanto ainda estiver alterando o
artefato:

1. Após cada ajuste relevante, execute `codecheck`, `typecheck` e os testes
   direcionados da tarefa.
2. Quando os testes da borda estiverem coerentes, execute somente a integração
   afetada, usando `--runTestsByPath` quando o runner suportar seleção de
   arquivos.
3. Não execute a suíte completa de integração a cada alteração. O
   `contract-check --run` valida somente evidências não integradas; comandos
   `test:integration` declarados na Spec são ignorados por ele.

O resultado local não substitui o gate. Depois que o Builder encerrar, o
Implementation Gate executa uma vez os sensores de implementação e o
`contract-check` sem integração. O `quality-ratchet` não é executado nem é
bloqueante no Implementation Gate; ele fica reservado para a validação
integrada final. A integração afetada pode ser executada de forma direcionada
durante o Builder, e a suíte completa fica reservada ao Conclusion Gate. O
Conclusion Gate repete a integração completa e o CI do PR executa o
`quality-ratchet` apenas na entrega integrada final.

### 4. Integrar e inspecionar

- Confirme o diff combinado.
- Rejeite paths fora do escopo.
- Verifique se Builder/Workers alteraram Plan ou fontes normativas sem
  autorização.
- Atualize a tarefa para `validating`.
- Trate divergências documentais conforme `harness-rules.md`.

### 5. Implementation Gate

Execute com os paths da tarefa. Não informe `--workspace` neste gate: o
`quality-ratchet` é um comando separado do CI e não pertence a este fluxo:

```bash
npm run harness -- \
  gate implementation \
  --spec=<path> \
  --base=<commit-base> \
  --allowed-path=<path-ou-glob> \
  --package=<npm-package> \
  --test-path=<path-relativo-ao-pacote>
```

Repita `--package` quando a tarefa realmente tocar mais de um pacote. Use
`--test-path` apenas para os testes diretamente relacionados; quando a fase
agregar pacotes com testes diferentes, execute um gate por pacote. O
Implementation Gate exige `--package`; a validação monorepo completa fica
reservada ao Conclusion Gate e ao CI.

Adicione integração, Playwright, build, runtime, dead code e migrations conforme
a Spec. Não avance com falha causada pela implementação. Devolva a evidência ao
Builder, corrija e execute novamente. Registre apenas o resumo no Plan.

### 6. Registrar a verificação da tarefa

Depois do Implementation Gate passar:

- Marque `[x]`.
- Defina estado `verified`.
- Registre critérios e evidências resumidas.
- Zere findings bloqueantes.
- Atualize Histórico, contagem e próxima tarefa da fase.

Se o gate falhar:

- Mantenha `[ ]`.
- Mantenha `validating` enquanto houver correção concreta em curso.
- Registre findings e próxima ação.
- Reative o Builder com apenas os findings bloqueantes.
- Limite a três tentativas pelo mesmo motivo; depois escale ao usuário.

## Ciclo por Fase

### 1. Preparar a avaliação integrada

Quando todas as tarefas da fase estiverem `verified`:

- Confirme o diff integrado e a cobertura de todos os critérios da fase.
- Confirme a base da fase e registre a união dos paths e workspaces afetados.
- Execute o Implementation Gate com o escopo agregado da fase.
- Se o gate passar, defina a fase como `awaiting_judgment`.

O gate agregado não substitui os gates das tarefas. Ele detecta problemas que
só aparecem depois da integração entre elas.

### 2. Acionar Judge da implementação

1. Registre o estado do worktree.
2. Inicie subagente novo, com contexto limpo, usando
   `judge-implementation-agent`, definido em
   `documentation/agents/judge-implementation-agent.md`. Nomeie-o
   `Judge F<n>`; no Codex, use `judge_f<n>` como `task_name`.
3. Envie Spec/revisão, fase, tarefas verificadas, critérios, base da fase, diff
   integrado, paths, Rules, sensores e findings anteriores.
4. Não envie a narrativa dos Builders.
5. Compare o worktree após o Judge; qualquer edição invalida o parecer.

O Judge avalia o comportamento e a integração da fase, não cada tarefa
isoladamente. Em Plan com uma única fase, há um único julgamento integrado da
implementação antes da conclusão.

### 3. Registrar o veredito da fase

Se `accepted`:

- Defina a fase como `accepted`.
- Registre critérios e evidências resumidas.
- Zere findings bloqueantes da fase.
- Atualize Histórico, contagem e próxima fase.

Se `failed`:

- Defina a fase como `evaluation_failed`.
- Registre findings e próxima ação.
- Reabra a tarefa responsável ou crie tarefa corretiva na mesma fase quando o
  finding for transversal. A tarefa reaberta passa de `verified` para
  `changes_requested`.
- Invalide o gate integrado da fase e retome o ciclo de tarefas.
- Limite a três tentativas pelo mesmo motivo; depois escale ao usuário.

Acione um Judge antecipado antes do fim da fase somente quando a Spec declarar
um risco crítico de contrato, migration, segurança ou fronteira arquitetural.
Esse parecer é consultivo e não substitui o veredito integrado da fase.

## Paralelismo

O Orchestrator pode executar Builders em paralelo somente para tarefas que o
Plan declare independentes e que não compartilhem paths. Dentro de cada Builder,
Workers seguem a mesma regra. Aguarde todas as tarefas da fase antes de integrar
ou iniciar o Judge. O Judge nunca é filho do Builder.

## Mudanças Durante a Implementação

Não use `update-spec`. Quando Builder, Worker, Judge ou usuário identificar
divergência:

- Correção factual: Orchestrator ajusta cirurgicamente, recalcula revisão e
  registra no Plan.
- Amendment: pausa, atualiza Spec e Plan, invalida avaliações afetadas e retoma.
- PRD, Architecture ou Rule: crie tarefa documental e obtenha a decisão exigida
  por `harness-rules.md`.
- Feedback humano contra tarefa verificada ou fase aceita: estado
  `changes_requested`, finding `HR-*` e reabertura da fase afetada.

## Conclusão da Execução

Quando todas as tarefas estiverem `verified` e todas as fases estiverem
`accepted`:

- Atualize Estado Atual informando que o Plan aguarda `conclude-spec`.
- Não marque `status: completed` ainda.
- Não feche a Spec.
- Não faça commit ou PR por este prompt.

`completed` é reservado ao fluxo aceito por `judge-conclusion-agent`.

## Saída

- Tarefas verificadas e fases aceitas nesta execução.
- Builders e Workers acionados.
- Sensores executados.
- Avaliações e tentativas.
- Amendments e documentos atualizados.
- Próxima tarefa ou indicação para `conclude-spec`.
- Pendências e findings abertos.
