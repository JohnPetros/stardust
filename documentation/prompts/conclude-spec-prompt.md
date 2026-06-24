---
description: Prompt para concluir uma spec com validação final, atualização de documentação e geração de resumo estruturado para PR.
---

# Prompt: Conclude Spec

**Objetivo:** Finalizar e consolidar a implementação de uma Spec técnica no
StarDust, garantindo que o código esteja polido, documentado e validado no
contexto do monorepo — produzindo ao final um checklist de validação, os
documentos atualizados e um resumo estruturado para PR.

---

## Entradas Esperadas

- **Spec Técnica:** O documento que guiou a implementação
  (`documentation/features/<modulo>/specs/<nome>-spec.md`), injetado
  como caminho para o arquivo no contexto.

---

## Fase 1 — Verificação

Esta fase é analítica e deve ser concluída antes de qualquer atualização de
documento.

**1.1 Testes**

Execute `npm run test` na raiz do projeto. Todos os testes — novos e
existentes — devem estar passando. Caso algum falhe, interrompa e reporte.

Se a Spec impactar apenas uma parte do monorepo, você pode executar primeiro o
escopo mais específico para feedback rápido (`npm run test:core`,
`npm run test:server`, `npm run test:web` ou `npm run test:studio`), mas a
validação final deve considerar o comando raiz.

> Falhas pré-existentes fora do escopo da Spec devem ser sinalizadas
> explicitamente, indicando que são regressões anteriores e não introduzidas
> pela implementação atual.

**1.1.1 Verificação de Cobertura de Testes**

O plano de implementação (`documentation/plan.md`) inclui tarefas de teste
(sufixo `t`) intercaladas com tarefas de implementação. Nesta etapa, verifique
que essas tarefas foram concluídas:

1. Inspecione o `plan.md` e confirme que todas as tarefas de teste estão
   marcadas como `[x]`.
2. Para cada tarefa de teste concluída, confirme que o arquivo de teste existe
   na codebase e que os cenários descritos no resultado observável estão
   cobertos.
3. Produza o relatório de cobertura no formato abaixo.

```markdown
## Cobertura de Testes

### Tarefas de teste do plano
- [x] T1.1t — <descrição> — coberto em `packages/core/.../tests/NomeArtefato.test.ts`
- [x] T1.2t — <descrição> — coberto em `packages/core/.../tests/NomeUseCase.test.ts`
- [x] T2.2t — <descrição> — coberto em `apps/server/.../tests/NomeController.test.ts`

### Cobertura adicional (se aplicável)
- [ ] <Comportamento Y> — **sem cobertura** (detalhe o que está faltando)
```

No StarDust, **só é permitido criar testes para objetos de domínio, use cases,
widgets e handlers** (`controller`, `job`, `action`, `tool`).
**Não crie testes novos** para adapters, repositories, providers, services,
clients, mappers, gateways, configs, factories, arquivos de composição ou
qualquer outro tipo fora dessa lista. Quando a Spec alterar essas camadas,
valide o comportamento indiretamente pelos testes permitidos da camada de
domínio, handler ou widget que as consome.

Considere como caminhos críticos que exigem cobertura:

- Lógica de negócio nova ou modificada em `packages/core` (Use Cases,
  Entidades, Structures, Aggregates, erros de domínio)
- Casos de erro e edge cases relevantes (exceções de domínio, validações)
- Contratos HTTP/RPC novos ou alterados (payloads, redirects, validações,
  traduções entre camadas)
- Widgets, hooks e fluxos de UI alterados em `apps/web` ou `apps/studio`
- Integrações novas ou alteradas que impactem objetos de domínio, use cases,
  handlers ou widgets, sempre validando por meio dos tipos de teste permitidos

**1.1.2 Criação de Testes para Lacunas Residuais**

Se o relatório acima identificar comportamentos sem cobertura que **não estavam
previstos como tarefas de teste no plano** (ex: a spec foi atualizada durante a
implementação via `update-spec-prompt` e introduziu artefatos novos), acione um
**subagent** para criá-los antes de avançar para a Fase 2.

Antes de acionar o subagent, filtre a lista e mantenha **somente** componentes
permitidos: objetos de domínio, use cases, widgets e handlers
(`controller`, `job`, `action`, `tool`). Se a lacuna estiver em outro tipo de
arquivo, não crie teste direto para ele; registre a restrição no relatório e
endereçe a cobertura pelo componente permitido mais próximo.

O subagent deve receber como contexto:

- O prompt `documentation/prompts/create-tests-prompt.md` como instrução base.
- A lista de componentes sem cobertura identificados no relatório (1.1.1),
  com os caminhos reais dos arquivos fonte (`apps/...` ou `packages/...`).
- O caminho da Spec técnica, para referência de contratos e comportamentos
  esperados.

> O subagent é responsável por criar os arquivos de teste, seguir as regras de
> nomenclatura e estrutura do projeto, e garantir que `npm run test` passe ao
> final. Não avance para a Fase 2 enquanto o subagent não concluir sem falhas.
> Ele também deve respeitar estritamente a política de escopo de testes do
> projeto: apenas objetos de domínio, use cases, widgets e handlers.

**1.2 Lint e Formatação**

Execute `npm run codecheck` na raiz do projeto. O comando roda os checks do
monorepo (Biome e validações configuradas por app/pacote). Nenhum warning ou
erro deve restar. Caso existam, liste-os explicitamente e corrija antes de
prosseguir.

**1.3 Typecheck**

Execute `npm run typecheck` na raiz do projeto. Nenhum erro de tipo deve
restar. Caso existam, liste-os e corrija.

**1.4 Validação de Requisitos**

Releia a Spec técnica e o PRD (milestone do GitHub referenciado no campo `prd:`
da spec). Verifique que cada requisito mapeado na spec foi implementado
corretamente. Se houver divergências, registre-as explicitamente — não as
reconcilie por suposição.

**1.5 Validação de Limites Arquiteturais**

Com base nas regras em `documentation/rules/`, verifique que a implementação
respeita os limites de cada camada tocada. Atenção especial a:

- Core agnóstico a framework
- Repositories não vazando tipos do Supabase
- Controllers sem lógica de negócio
- UI consumindo contratos, não implementações
- Jobs com idempotência quando aplicável

Se encontrar violações, corrija-as e execute novamente os passos 1.1 a 1.3.

**1.6 Revisão de Qualidade de Código**

Revise o código produzido buscando:

- Nomeação inconsistente com padrões existentes
- Duplicação de lógica
- Imports desnecessários ou circulares
- `any` em pontos de entrada
- `console.log` residual
- Tratamento de erro ausente

Após aplicar as correções, execute `npm run test` novamente para garantir que
nenhuma alteração introduziu regressão.

> Esta etapa é complementar à 1.5: enquanto a 1.5 valida aderência a regras
> arquiteturais do projeto, a 1.6 avalia a qualidade intrínseca do código
> produzido, independente de convenções formais.

---

## Fase 2 — Consolidação de Documentos

Esta fase é de síntese. Execute-a somente após a Fase 1 estar completa e sem
pendências.

**2.1 Atualização da Spec Técnica**

Atualize apenas os metadados da Spec para refletir a conclusão da implementação:

- **Status:** `closed`
- **Última atualização:** `{{ today }}`

Não altere o conteúdo técnico da spec nesta fase — desvios de implementação
devem ter sido capturados pelo `update-spec-prompt` durante o desenvolvimento.

**2.2 Atualização do PRD**

Atualize o PRD associado à Spec **sempre no milestone do GitHub** referenciado
no campo `prd:` da spec.

- No StarDust, o milestone do GitHub é a **única fonte de verdade** do PRD.
- **Nunca** crie, edite ou assuma a existência de `documentation/features/**/prd.md`.
- Se a implementação concluir ou refinar requisitos, atualize a **descrição do
  milestone** com os itens entregues e as divergências de produto relevantes.

> 💡 Regra obrigatória: PRD local não deve existir. PRD vive no milestone.

Marque como concluídos os itens endereçados pela implementação. A audiência aqui
é de produto — traduza o impacto técnico para linguagem de negócio.

> 💡 Não copie conteúdo técnico de baixo nível para o PRD — sintetize o valor
> entregue.

**Divergência spec → PRD:** Caso a implementação concluída introduza algum
aspecto que contradiga ou não esteja coberto pelo PRD (ex: regra de negócio
refinada, escopo ampliado ou reduzido, comportamento diferente do especificado),
atualize o PRD para refletir a realidade entregue. Registre a divergência no
campo **"O que mudou em relação à Spec original"** do resumo de conclusão da
spec (seção 3.1).

**2.3 Atualização da Arquitetura (se aplicável)**

Caso a implementação tenha introduzido novo fluxo de dados, nova camada, novo
padrão de integração ou mudança relevante na estrutura de diretórios, atualize
`documentation/architecture.md` para refletir a realidade atual do projeto.

**2.4 Atualização de Rules (se aplicável)**

Caso a implementação tenha introduzido um padrão de projeto novo, não mapeado
nas rules existentes, atualize o arquivo de regras correspondente com o novo
padrão e exemplos práticos.

---

## Fase 3 — Comunicação

Esta fase produz o artefato final para facilitar a abertura do Pull Request.

**3.1 Resumo de conclusão da spec**

Gere um resumo de conclusão com a seguinte estrutura obrigatória:

```markdown
## O que foi feito

<Descrição objetiva das mudanças implementadas, em linguagem técnica>

## Por que foi feito assim

<Decisões de design relevantes e tradeoffs considerados>

## O que mudou em relação à Spec original

<Desvios ou refinamentos ocorridos durante a implementação.
Se nenhum desvio ocorreu, registre "Nenhum desvio em relação à spec original.">

## Cobertura de testes

<Resumo das tarefas de teste concluídas e eventuais lacunas residuais
identificadas e endereçadas durante a revisão>

## Pontos de atenção para o revisor

<Migrations, contratos novos, decisões irreversíveis, side effects,
dependências externas — tudo que o revisor precisa saber antes de aprovar>

## Checklist final

- [ ] Testes passando (`npm run test`)
- [ ] Sem erros de lint (`npm run codecheck`)
- [ ] Sem erros de tipo (`npm run typecheck`)
- [ ] Spec atualizada para `status: closed`
- [ ] PRD atualizado na milestone do GitHub
- [ ] Architecture atualizado (se aplicável)
- [ ] Rules atualizadas (se aplicável)
```

---

## Fase 4 — Commit e Pull Request

Esta fase só deve ser executada após a Fase 3 estar completa e o checklist final sem pendências.

**4.1 Commit das alterações**

Execute o skill `/commit-code` para commitar todas as alterações da implementação. O skill agrupa os arquivos por responsabilidade semântica e cria os commits com mensagens padronizadas.

> Atenção: apenas arquivos relacionados à spec atual devem ser commitados. Alterações pré-existentes de outras features não devem entrar neste PR.

**4.2 Criação do Pull Request**

Após os commits, execute o skill `/create-pr` para abrir o PR com título e descrição padronizados, usando o resumo de conclusão gerado na Fase 3 como base para o body.