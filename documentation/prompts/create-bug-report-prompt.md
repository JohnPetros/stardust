---
description: Prompt para transformar relatos informais em bug reports técnicos claros, acionáveis e orientados a correção.
---

# Prompt: Criar Bug Report

## Objetivo

Transformar um esboço ou relato informal de um erro em um **Bug Report profissional**, claro, acionável e tecnicamente orientado, pronto para ser consumido pela equipe de desenvolvimento sem necessidade de interpretação adicional.

O bug report deve:
- Explicar **o que está quebrado**
- Indicar **onde e por que provavelmente está quebrado**
- Sugerir **como corrigir**, respeitando a arquitetura do projeto

O resultado desta tarefa é **sempre um único arquivo Markdown** contendo apenas o **Bug Report**.

Quando o bug exigir planejamento de correção formal, a **Spec de correção** deve ser criada em **fluxo separado**, consumindo o bug report como insumo e seguindo `documentation/prompts/create-spec-prompt.md`.

> A Spec derivada de Bug Report **não faz parte da mesma entrega** e **não deve coexistir no mesmo arquivo**.
> O papel desta tarefa termina quando o bug report estiver salvo, claro e acionável.
> A criação da Spec acontece depois, em arquivo próprio dentro de `specs/`.

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
- Se o bug estiver associado a uma funcionalidade existente, consulte o PRD correspondente na milestone do GitHub que representa a fonte de verdade do produto.
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
- Use exclusivamente as camadas definidas abaixo:
  - `core` — Use Cases
  - `rest` — Controllers e Services HTTP
  - `database` — Repositories, Mappers e Types
  - `provision` — Providers e integrações externas
  - `rpc` — Actions
  - `ui` — Widgets, Stores e Contexts
  - `ai` — Workflows e Tools
  - `queue` — Inngest Functions
  - `web` — Pages e Layouts Next.js
  - `studio` — Pages e Layouts React Router

### 4. Plano de Correção

- Proponha uma solução técnica **incremental e segura**, separada por camadas.
- O plano deve ser claro o suficiente para servir como base de implementação.

### 5. Encaminhamento para Spec de Correção

Após salvar o Bug Report, o agente deve deixar explícito se o próximo passo recomendado é criar uma Spec de correção em fluxo separado.

- A criação da Spec **não acontece nesta tarefa**.
- O **esboço da tarefa** da futura Spec é o próprio Bug Report gerado.
- O **PRD de referência** da futura Spec é a milestone do GitHub da feature afetada.
- As seções **O que já existe**, **O que deve ser criado**, **O que deve ser modificado** e **O que deve ser removido** do bug report devem facilitar a criação posterior da Spec, sem duplicá-la.
- Quando a correção exigir Spec formal, ela deve ser salva separadamente em `documentation/features/{dominio}/specs/{nome-descritivo}-fix-spec.md`.

---

## Template de Saída (Estrutura Obrigatória)

Salve um único arquivo em `documentation/features/{dominio}/reports/{nome-descritivo}-bug-report.md` seguindo **estritamente** o template abaixo. Este arquivo deve conter **apenas o Bug Report**.

```md
---
title: {Titulo Curto e Descritivo}
prd: <link para o PRD referente ao bug e à spec, sendo uma milestone do GitHub>
issue: <link para o issue referente ao bug, servindo como esboço para a spec>
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

### Camada Core (Use Cases)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada REST (Controllers)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada REST (Services)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Banco de Dados (Repositories)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Banco de Dados (Mappers)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Banco de Dados (Types)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Provision (Providers)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada RPC (Actions)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada UI (Widgets)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada UI (Stores)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada UI (Contexts)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada AI (Workflows)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada AI (Tools)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Inngest App (Functions)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada Next.js App (Pages, Layouts)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

### Camada React Router App (Pages, Layouts)
<!-- Incluir apenas se aplicável -->
- **Arquivo:** `{caminho/relativo/do/arquivo}`
- **Diagnóstico:** {Explique o que está errado neste ponto.}

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
- Use apenas as camadas listadas na seção 3. Mapeamento de Camadas — não crie camadas arbitrárias.
- Omita do template as camadas que não forem aplicáveis ao bug em questão.
- Não incorpore Spec de correção no arquivo do bug report.
- Quando houver necessidade de Spec formal, ela deve ser criada em fluxo separado e em arquivo próprio dentro de `specs/`.
- A futura Spec de correção não pode contradizer o Bug Report; ela deve derivar dele.
