---
description: Orquestrar a implementação direta de uma Spec pequena com Builder, gates determinísticos e Judge independente, sem criar Plan.
---

# Prompt: Implementar Spec

## Objetivo

Executar uma Spec pequena em uma única sessão pelo fluxo:

```text
Orchestrator → Readiness Gate → Builder → Implementation Gate → Judge da implementação
```

Este é o modo leve do harness. A ausência de Plan não elimina separação de
papéis nem avaliação independente.

## Entrada

- Spec aceita em `documentation/features/**/specs/*-spec.md`.
- Escopo opcional dentro da Spec.
- Restrições adicionais do usuário.

Se o caminho não for informado, descubra pela conversa, por candidato único da
feature ou pela Spec relacionada mais recente. Havendo ambiguidade, peça o
caminho.

## Elegibilidade

Use este fluxo somente quando:

- Existe uma única entrega observável.
- A sequência de edições é curta e evidente.
- Poucos arquivos e um fluxo simples são afetados.
- Não há migration relevante ou contrato novo entre apps.
- Não há mudança de PRD, Architecture ou Rule.
- Não é necessário handoff entre sessões.

Promova para `create-plan` + `implement-plan` antes de continuar quando surgir:

- Múltiplas tarefas ou dependências relevantes.
- Paralelismo que justifique Workers.
- Amendment contratual amplo.
- Mais de uma reprovação material.
- Mudança de PRD, Architecture ou Rule.
- Necessidade de retomar em outra sessão.

## Regras Aplicáveis

Leia:

- A Spec inteira.
- `documentation/rules/harness-rules.md`.
- `documentation/agents/orchestrator-agent.md`.
- `documentation/agents/builder-agent.md`.
- `documentation/agents/judge-implementation-agent.md`.
- `documentation/rules/rules.md`.
- `documentation/rules/code-conventions-rules.md`, quando aplicável.
- Rules das camadas e testes afetados.

Calcule a revisão da Spec com `git hash-object <spec>` e registre o commit-base e
o estado inicial do worktree. Preserve mudanças preexistentes do usuário.

## Execução

### 1. Readiness Gate

Execute antes do Builder:

```bash
npm run harness -- \
  gate readiness \
  --spec=<path> \
  --revision=<hash>
```

Não prossiga com drift de revisão ou finding determinístico.

### 2. Acionar Builder

Inicie um subagente separado e instrua-o a usar `builder-agent`, definido em
`documentation/agents/builder-agent.md`. Envie somente:

- Spec e revisão.
- Escopo direto.
- Critérios associados.
- Resultado observável.
- Paths permitidos.
- Rules aplicáveis.
- Findings de tentativa anterior, se houver.

No modo direto, o Builder implementa sem Workers. Se identificar paralelismo
material, ele deve reportar e a execução deve ser promovida para Plan.

### 3. Inspecionar o resultado

Após o Builder encerrar:

- Confirme arquivos alterados e diff contra o estado inicial.
- Rejeite mudanças fora dos paths permitidos.
- Confirme que Spec e documentos normativos não foram alterados sem protocolo.
- Trate divergências conforme `harness-rules.md`.

### 4. Implementation Gate

Execute com todos os paths e workspaces autorizados:

```bash
npm run harness -- \
  gate implementation \
  --spec=<path> \
  --base=<commit-base> \
  --allowed-path=<path-ou-glob> \
  --workspace=<workspace>
```

Inclua `--extra-command-json`, runtime, dead code ou configuração de migration
conforme a seção Gates Aplicáveis da Spec. Se o gate falhar pela implementação,
devolva a evidência ao Builder antes de acionar o Judge.

### 5. Acionar Judge da implementação

Com o Implementation Gate aprovado, registre o estado do worktree e inicie um novo subagente
com contexto limpo usando `judge-implementation-agent`, definido em
`documentation/agents/judge-implementation-agent.md`. Envie Spec/revisão, critérios,
commit-base, diff, paths, Rules e sensores.

O Judge não recebe a narrativa do Builder. Compare o worktree antes e depois;
qualquer alteração feita pelo Judge invalida o parecer.

### 6. Processar o veredito

- `accepted`: a implementação direta está apta para `conclude-spec`.
- `failed`: envie somente findings bloqueantes ao Builder e repita.
- Segunda reprovação material ou expansão de escopo: promova para Plan.
- Decisão humana pendente: pare e pergunte ao usuário.

## Atualizações da Spec

Não use `update-spec`. Correções factuais e amendments ocorrem neste workflow
segundo `harness-rules.md`. Atualize `last_updated_at`, recalcule a revisão e
invalide avaliações anteriores afetadas. Amendment amplo promove para Plan.

## Saída

- Resumo do que foi implementado.
- Spec e revisão avaliadas.
- Arquivos principais alterados.
- Sensores oficiais e resultados.
- Veredito do `judge-implementation-agent`.
- Tentativas e findings resolvidos.
- Atualizações documentais ou promoção para Plan.
- Pendências.

## Restrições

- Não crie Plan retroativo após concluir; promova assim que a complexidade for
  descoberta.
- Não permita que Builder avalie o próprio trabalho.
- Não simule Judge no agente principal.
- Não encerre com gate ou finding bloqueante aberto.
