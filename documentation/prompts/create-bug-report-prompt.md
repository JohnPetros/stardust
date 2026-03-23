---
description: Prompt para transformar relatos informais em bug reports tecnicos claros, acionaveis e orientados a correcao.
---

# Prompt: Criar Bug Report

## Objetivo

Transformar um esboço ou relato informal de um erro em um **Bug Report profissional**, claro, acionável e tecnicamente orientado, pronto para ser consumido pela equipe de desenvolvimento sem necessidade de interpretação adicional.

O bug report deve:
- Explicar **o que está quebrado**
- Indicar **onde e por que provavelmente está quebrado**
- Sugerir **como corrigir**, respeitando a arquitetura do projeto

---

## Entrada

- **Esboço do Problema:** relato livre descrevendo o erro observado (sintoma)
- **Contexto Técnico (opcional):**
  - Dispositivo / OS / Browser
  - Ambiente (local, staging, produção)
  - Feature ou fluxo afetado

---

## Diretrizes de Execução

### 1. Análise do Relato

- Interprete o problema focando em **comportamento observado vs comportamento esperado**.
- Elimine ambiguidades do relato original.

### 2. Diagnóstico

- Identifique causas prováveis com base na arquitetura descrita em `documentation/architecture.md`.
- Se o bug estiver associado a uma funcionalidade existente, consulte o PRD correspondente em `documentation/features/<dominio>/`.
- Identifique o **ponto de verdade** dos dados afetados: fonte (DB, API, cache), contratos (schemas/DTOs), normalização (mapeamentos entre camadas).
- Localize os nós críticos no código:
  - Onde a feature é iniciada (page/widget/route)
  - Onde o estado é controlado (store/context)
  - Onde a chamada remota acontece (action/service)
  - Onde regras são aplicadas (use case)
  - Onde persistência/integração é feita (driver/repo)
- Procure implementações similares na codebase para identificar padrões de validação, erro e loading já estabelecidos.

### 3. Mapeamento de Camadas

- Determine quais camadas estão envolvidas direta ou indiretamente.
- Sempre que possível, associe o problema a **arquivos reais** da codebase.

### 4. Plano de Correção

- Proponha uma solução técnica **incremental e segura**, separada por camadas.
- O plano deve ser claro o suficiente para servir como base de implementação.

---

## Template de Saída (Estrutura Obrigatória)

Salve o arquivo em `documentation/features/{dominio}/bug-reports/{nome-descritivo}-bug-report.md` seguindo **estritamente** o template abaixo. Não adicione seções extras nem altere os títulos.

```md
---
title: {Titulo Curto e Descritivo}
apps: {web|server|studio}
status: {open|closed}
last_updated_at: {YYYY-MM-DD}
---

# Bug Report: {Titulo Curto e Descritivo}

## Problema Identificado

{Descrição objetiva do comportamento incorreto observado. Evite suposições técnicas nesta seção.}

## Causas

{Lista concisa das causas técnicas prováveis. Exemplo: validação ausente, estado inconsistente, contrato quebrado, erro de mapeamento.}

## Contexto e Análise

### {Nome da Camada} (ex: Camada UI, Camada Core, Camada REST, Camada Banco de Dados)

<!-- Repita o bloco abaixo para cada camada afetada -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto, incluindo falhas de responsabilidade, fluxo, estado ou contrato.}

## Plano de Correção

### 1. O que já existe?

Liste recursos existentes da codebase que estão envolvidos no bug, serão reutilizados na correção ou podem ser impactados indiretamente.

- **{Camada}**
  - `{Nome do Recurso}` — {Responsabilidade atual e relação com o bug}

### 2. O que deve ser criado?

Descreva novos recursos necessários **apenas se estritamente necessários**.

- **{Camada}**
  - `{Nome do Recurso}` — {Nova responsabilidade introduzida}

### 3. O que deve ser modificado?

Liste mudanças pontuais em código existente, explicando o motivo da alteração.

- **{Camada}**
  - `{Nome do Recurso}` — {Descrição clara da modificação}

### 4. O que deve ser removido?

Liste código redundante, legado ou incorreto que deve ser eliminado como parte da correção.

- **{Camada}**
  - `{Nome do Recurso}` — {Motivo da remoção}
```

---

## Restrições

- Não invente caminhos de arquivo, métodos ou contratos sem evidência na codebase.
- Cite sempre o arquivo do problema — sem diagnósticos genéricos sem localização.
- Separe fato (evidência encontrada no código) de hipótese (suspeita sem confirmação).
- Não proponha correções que violem os contratos entre camadas definidos em `documentation/rules/`.