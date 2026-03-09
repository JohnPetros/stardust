---
description: Prompt para criar um bug report técnico com base no relato informal do problema, no PRD, na arquitetura e na codebase existente.
---

# Prompt: Criar Bug Report Técnico

## Objetivo

Transformar um relato informal de erro em um **Bug Report Técnico** claro, acionável e orientado à correção, com base no comportamento observado, no PRD, na arquitetura e na codebase existente.

O bug report deve:

* Explicar **o que está quebrado**
* Diferenciar **comportamento observado vs esperado**
* Indicar **onde provavelmente está o problema**
* Sugerir **como corrigir**, sem inventar soluções fora dos padrões do projeto

---

## Entrada

* **Relato do problema:** descrição livre do erro observado
* **Contexto técnico (opcional):**

  * dispositivo / OS / browser
  * versão do app
  * ambiente
  * feature, fluxo ou módulo afetado
  * logs, payloads ou exemplos de dados
  * passos para reproduzir, se houver

---

## Diretrizes de Execução

### 1. Entendimento do problema

Antes de escrever o bug report:

* Interprete o relato focando em:

  * sintoma observado
  * comportamento esperado
  * impacto funcional
  * contexto de reprodução
* Elimine ambiguidades.
* **Não trate hipótese como fato.**

### 2. Contextualização técnica

* Consulte a arquitetura e as regras do projeto (ex: `documentation/architecture.md`, `documentation/rules/rules.md`).
* Se o bug estiver ligado a uma feature existente, consulte o **PRD correspondente**.
* Resuma apenas o que for necessário para entender o bug.

### 3. Investigação da codebase

Mapeie os pontos reais da codebase envolvidos no fluxo, priorizando:

* entrada da feature: page, widget, route, controller
* controle de estado: store, context, hook
* chamada remota: action, service, provider
* regra de negócio: use case, service, workflow
* persistência / integração: repository, mapper, provider
* contratos: schema, DTO, types
* origem da verdade dos dados

Sempre que possível:

* associe o problema a **arquivos reais**
* procure implementações similares
* registre **evidências**
* diferencie **fato**, **hipótese** e **proposta de correção**

### 4. Diagnóstico e correção

* Liste as **causas prováveis** com nível de confiança.
* Proponha uma correção **incremental, segura e consistente** com os padrões existentes.
* Inclua **apenas camadas realmente afetadas**.
* Se faltar informação, registre em **Pendências / Dúvidas** em vez de inventar.

### 5. Ferramentas auxiliares

* **MCP Serena:** usar para localizar arquivos relevantes
* **MCP Context7:** usar para dúvidas sobre bibliotecas específicas
* **Tool `question`:** usar quando houver lacunas críticas, incongruências ou dependência de decisão funcional/arquitetural

---

## Estrutura do Documento (Markdown)

Gere o arquivo Markdown do Bug Report seguindo **estritamente** o modelo abaixo.

### Cabeçalho (Frontmatter)

```md
---
title: <Título claro>
prd: <link para o PRD da feature afetada, quando aplicável>
apps: <server|studio|web> # listar apenas os apps afetados; se houver mais de um, separar por vírgula
status: <em_progresso|concluido>
last_updated_at: <YYYY-MM-DD>
---
```

---

# 1. Problema Identificado

[Descreva objetivamente o comportamento incorreto observado.]

Incluir, quando houver:

* o que o usuário fez
* o que aconteceu
* o que deveria ter acontecido
* onde ocorre
* em qual ambiente ocorre
* frequência percebida

> Não incluir hipótese técnica nesta seção.

---

# 2. Escopo e Impacto

## 2.1 Fluxo afetado

[Descreva a feature, tela, endpoint ou jornada afetada.]

## 2.2 Impacto funcional

[Explique o impacto real para usuário, operação ou sistema.]

## 2.3 Severidade e alcance

[Classifique a gravidade e o alcance do bug.]

---

# 3. Contexto Esperado

[Resuma o comportamento esperado com base no PRD, contratos existentes, arquitetura ou padrões da codebase.]

> Se não aplicável, escrever: **Não aplicável**.

---

# 4. Causas Prováveis

Para cada causa relevante:

* **Causa provável**
* **Evidência encontrada**
* **Nível de confiança:** alto | médio | baixo
* **Impacto no bug**

---

# 5. O que já existe?

[Liste recursos reais da codebase envolvidos no bug, reutilizados na correção ou potencialmente impactados.]

## [Nome da Camada]

* **`NomeDaClasseOuModulo`** (`caminho/relativo/do/arquivo`) - *[Responsabilidade atual e relação com o bug.]*

---

# 6. Análise Técnica por Camada

## [Nome da Camada]

* **Arquivo:** `caminho/relativo/do/arquivo`
* **Responsabilidade atual:** [Papel do arquivo no fluxo]
* **Diagnóstico:** [O que está errado, inconsistente, ausente ou frágil]
* **Evidência:** [Indício encontrado no código, contrato ou fluxo]
* **Risco associado:** [Risco de manter como está]

> Repetir para cada arquivo relevante.

---

# 7. Plano de Correção (Spec)

## 7.1 O que deve ser criado?

[Descreva novos recursos necessários **apenas se estritamente necessário**.]

### [Nome da Camada]

* **Localização:** `caminho/do/arquivo` (**novo arquivo** se aplicável)
* **Responsabilidade:** [O que será criado]
* **Justificativa:** [Por que criar é necessário]

> Se não houver criação, escrever: **Não aplicável**.

## 7.2 O que deve ser modificado?

### [Nome da Camada]

* **Arquivo:** `caminho/do/arquivo`
* **Mudança:** [Alteração específica]
* **Justificativa:** [Por que a mudança é necessária]
* **Impacto esperado:** [Efeito esperado da correção]
* **Camada:** `ui` | `core` | `rest` | `provision` | `queue` | `database` | `ai`

> Se não houver modificações, escrever: **Não aplicável**.

## 7.3 O que deve ser removido?

### [Nome da Camada]

* **Arquivo:** `caminho/do/arquivo`
* **Motivo da remoção:** [Por que remover]
* **Impacto esperado:** [Efeito da remoção]

> Se não houver remoções, escrever: **Não aplicável**.

---

# 8. Contratos, Dados e Compatibilidade

[Descreva impactos em schemas, DTOs, payloads, mapeamentos, compatibilidade e dados.]

> Se não houver impacto, escrever: **Não aplicável**.

---

# 9. Decisões Técnicas e Trade-offs

Para cada decisão importante:

* **Decisão**
* **Alternativas consideradas**
* **Motivo da escolha**
* **Impactos / trade-offs**

---

# 10. Diagramas e Referências

* **Fluxo afetado:** diagrama ASCII/text-based mostrando onde o bug acontece
* **Fluxo corrigido:** diagrama ASCII/text-based mostrando o comportamento esperado após a correção
* **Referências:** caminhos de arquivos reais com implementações similares

---

# 11. Pendências / Dúvidas

Para cada item em aberto:

* **Descrição da pendência**
* **Impacto na correção**
* **Ação sugerida**

> Se não houver pendências, escrever: **Sem pendências**.

---

## Restrições

* **Não inclua testes automatizados no bug report.**
* Todos os caminhos citados devem existir no projeto **ou** estar explicitamente marcados como **novo arquivo**.
* **Não invente** arquivos, métodos, contratos, causas ou integrações sem evidência.
* Diferencie explicitamente:
  * fato observado
  * evidência encontrada
  * hipótese diagnóstica
  * proposta de correção
* Se faltar informação suficiente, registrar em **Pendências / Dúvidas** e usar a tool `question` quando necessário.
* Se uma seção não se aplicar, preencher explicitamente com **Não aplicável**.
* Prefira correções incrementais e localizadas.
* Evite repetir a mesma informação em múltiplas seções.
* Inclua apenas camadas sustentadas por evidência.
