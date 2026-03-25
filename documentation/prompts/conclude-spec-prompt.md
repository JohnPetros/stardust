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

**1.1.1 Cobertura de Testes**

Com base no diff injetado no contexto e nas regras em
`documentation/rules/domain-objects-testing-rules.md`,
`documentation/rules/use-cases-testing-rules.md`,
`documentation/rules/handlers-testing-rules.md` e
`documentation/rules/widget-tests-rules.md`, verifique se os novos
comportamentos introduzidos pela Spec possuem testes correspondentes.
No StarDust, **so e permitido criar testes para objetos de dominio, use cases,
widgets e handlers** (`controller`, `job`, `action`, `tool`).
**Nao crie testes novos** para adapters, repositories, providers, services,
clients, mappers, gateways, configs, factories, arquivos de composicao ou
qualquer outro tipo fora dessa lista. Quando a Spec alterar essas camadas,
valide o comportamento indiretamente pelos testes permitidos da camada de
dominio, handler ou widget que as consome.
Considere como caminhos críticos que exigem cobertura:

- Lógica de negócio nova ou modificada em `packages/core` (Use Cases,
  Entidades, Structures, Aggregates, erros de domínio)
- Casos de erro e edge cases relevantes (exceções de domínio, validações)
- Contratos HTTP/RPC novos ou alterados (payloads, redirects, validações,
  traduções entre camadas)
- Widgets, hooks e fluxos de UI alterados em `apps/web` ou `apps/studio`
- Integracoes novas ou alteradas que impactem objetos de dominio, use cases,
  handlers ou widgets, sempre validando por meio dos tipos de teste permitidos

Ao final desta etapa, produza um relatório de cobertura no seguinte formato:
```markdown
## Cobertura de Testes

- [x] <Comportamento A> — coberto em `tests/caminho/do/test_arquivo.py`
- [x] <Comportamento B> — coberto em `tests/caminho/do/test_arquivo.py`
- [ ] <Comportamento C> — **sem cobertura** (detalhe o que está faltando)
```

**1.1.2 Criação de Testes para Componentes sem Cobertura**

Caso existam itens sem cobertura no relatório acima, acione um **subagent**
para criá-los antes de avançar para a Fase 2.

Antes de acionar o subagent, filtre a lista e mantenha **somente** componentes
permitidos: objetos de dominio, use cases, widgets e handlers
(`controller`, `job`, `action`, `tool`). Se a lacuna estiver em outro tipo de
arquivo, nao crie teste direto para ele; registre a restricao no relatorio e
enderece a cobertura pelo componente permitido mais proximo.

O subagent deve receber como contexto:

- O prompt `documentation/prompts/create-tests-prompt.md` como instrução base.
- A lista de componentes sem cobertura identificados no relatório (1.1.1),
  com os caminhos reais dos arquivos fonte (`apps/...` ou `packages/...`).
- O caminho da Spec técnica, para referência de contratos e comportamentos
  esperados.

> O subagent é responsável por criar os arquivos de teste, seguir as regras de
> nomenclatura e estrutura do projeto, e garantir que `npm run test` passe ao
> final. Não avance para a Fase 2 enquanto o subagent não concluir sem falhas.
> Ele tambem deve respeitar estritamente a politica de escopo de testes do
> projeto: apenas objetos de dominio, use cases, widgets e handlers.

**1.2 Lint e Formatação**

Execute `npm run codecheck` na raiz do projeto. O comando roda os checks do
monorepo (Biome e validações configuradas por app/pacote). Nenhum warning ou
erro deve restar. Caso existam, liste-os explicitamente e corrija antes de
prosseguir.

**1.3 Checagem de Tipos**

Execute `npm run typecheck` na raiz do projeto. O TypeScript deve retornar zero
erros. Liste qualquer violação de tipo explicitamente e corrija antes de
prosseguir.

**1.4 Cobertura de Requisitos**

Com base no diff real injetado no contexto, compare cada componente descrito na
Spec (seções "O que deve ser criado" e "O que deve ser modificado") contra o
código implementado. Ao final desta etapa, produza um **checklist de validação**
no seguinte formato:
```markdown
## Checklist de Validação

- [x] <Requisito A> — implementado em `packages/core/...` ou `apps/...`
- [x] <Requisito B> — implementado em `packages/core/...` ou `apps/...`
- [ ] <Requisito C> — **ausente ou incompleto** (detalhe o gap)
```

**1.5 Conformidade Arquitetural e de Padrões**

Leia `documentation/rules/rules.md` para identificar quais documentos de regras
são acionados pelas camadas impactadas pela Spec. Em seguida, leia cada um dos
docs relevantes e valide o código implementado contra eles.

Verifique obrigatoriamente os documentos acionados pelas camadas impactadas.
Em geral, os mais comuns no StarDust são:

- `documentation/rules/core-package-rules.md` — `packages/core` puro: sem
  dependência de framework, banco, HTTP ou SDK externo
- `documentation/rules/database-rules.md` — persistência, mapeamento e
  repositórios sem regra de negócio indevida
- `documentation/rules/rest-layer-rules.md` — services/adapters REST finos,
  traduzindo contrato e delegando comportamento
- `documentation/rules/rpc-layer-rules.md` — actions finas, adaptando `Call` e
  delegando para use cases
- `documentation/rules/ui-layer-rules.md` — padrão Widget (View + Hook + Index)
  e organização da camada de UI
- `documentation/rules/web-application-rules.md` e
  `documentation/rules/studio-appllication-rules.md` — convenções por app
- `documentation/rules/server-application-rules.md` — organização da aplicação
  server e seus adapters
- `documentation/rules/code-conventions-rules.md` — nomenclatura, organização
  de módulos e padrões de código

Para cada regra violada, reporte:

- **Arquivo:** caminho relativo do arquivo com o desvio
- **Regra violada:** referência ao doc e à regra específica
- **Desvio encontrado:** descrição objetiva do problema
- **Correção necessária:** o que deve ser ajustado

Corrija todos os desvios encontrados antes de avançar para a Fase 2.

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

Atualize o PRD associado à Spec. Ele está localizado no nível acima do diretório
da spec — ex.: se a spec está em
`documentation/features/<modulo>/specs/<nome>-spec.md`, o PRD está em
`documentation/features/<modulo>/prd.md`.

Marque como concluídos os itens endereçados pela implementação. A audiência aqui
é de produto — traduza o impacto técnico para linguagem de negócio.

> 💡 Não copie conteúdo técnico de baixo nível para o PRD — sintetize o valor
> entregue.

**Divergência spec → PRD:** Caso a implementação concluída introduza algum
aspecto que contradiga ou não esteja coberto pelo PRD (ex: regra de negócio
refinada, escopo ampliado ou reduzido, comportamento diferente do especificado),
atualize o PRD para refletir a realidade entregue. Registre a divergência no
campo **"O que mudou em relação à Spec original"** do resumo de conclusão da spec (seção 3.1).

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

<Desvios ou refinamentos ocorridos durante a implementação, incluindo
divergências que implicaram atualização do PRD. Se nenhum, declarar
explicitamente "Nenhum desvio em relação à Spec original.">

## Pontos de atenção para o revisor

<Riscos, áreas sensíveis, dependências externas ou decisões que merecem revisão
cuidadosa. Inclua migrações de banco pendentes, mudanças de contrato REST/RPC,
DTOs compartilhados, side effects em jobs/eventos ou impactos entre apps do
monorepo. Se nenhum, declare explicitamente "Nenhum ponto de atenção
identificado.">

## Checklist

- [ ] `npm run codecheck` passou sem warnings
- [ ] `npm run typecheck` retornou zero erros
- [ ] `npm run test` passou sem falhas (ou regressões pré-existentes devidamente sinalizadas)
- [ ] Cobertura de testes verificada e lacunas críticas endereçadas
- [ ] Limites arquiteturais validados
- [ ] Spec atualizada com status `closed` e data
- [ ] PRD atualizado com os itens concluídos (e divergências registradas, se houver)
- [ ] `architecture.md` atualizado (se aplicável)
- [ ] Rules atualizadas (se novos padrões foram introduzidos)
```

---

## Saídas Esperadas

Ao final da execução, devem ter sido produzidos:

1. **Relatório de cobertura de testes** (Fase 1.1.1)
2. **Testes criados pelo subagent** para componentes sem cobertura (Fase 1.1.2, quando aplicável)
3. **Checklist de validação** de requisitos (Fase 1.4)
4. **Spec atualizada** com status `closed` e data (Fase 2.1)
5. **PRD atualizado** com itens marcados como concluídos e divergências registradas, se houver (Fase 2.2)
6. **Resumo de conclusão da spec** com estrutura completa (Fase 3.1)
