---
description: Prompt para transformar relatos informais em bug reports técnicos claros, acionáveis e orientados a correção.
---

# Prompt: Criar Bug Report

## Objetivo

Transformar um esboço ou relato informal de um erro em um **Bug Report profissional**, claro, acionável e tecnicamente orientado, pronto para ser consumido pela equipe de desenvolvimento sem necessidade de interpretação adicional.

O bug report deve:
- Explicar **o que está quebrado**
- Indicar **onde e por que provavelmente está quebrado**
- Indicar um **direcionamento de correção** curto, sem detalhar implementação como Spec

O resultado desta tarefa é **sempre um único arquivo Markdown** contendo apenas o **Bug Report**.

Este prompt **não cria Spec de correção**. Quando uma Spec for necessária, ela deve ser solicitada e executada em outro fluxo, usando `documentation/prompts/create-spec-prompt.md`.

> O papel desta tarefa termina quando o bug report estiver salvo, claro e acionável.
> Não crie, edite nem antecipe arquivo em `specs/` durante a execução deste prompt.

---

## Entrada

- **Esboço do Problema:** relato livre descrevendo o erro observado (sintoma)
- **Contexto Técnico (opcional):**
  - Dispositivo / OS / Browser
  - Ambiente (local, staging, produção)
  - Feature ou fluxo afetado

---

## Regras Aplicáveis

Antes de diagnosticar o bug, leia:

- `documentation/rules/rules.md` — índice para selecionar as rules das camadas envolvidas.
- `documentation/rules/code-conventions-rules.md` — referência geral para nomeação, factories, erros e eventos.
- Rules específicas das camadas citadas no diagnóstico, por exemplo:
  - `documentation/rules/core-package-rules.md`
  - `documentation/rules/database-rules.md`
  - `documentation/rules/rest-layer-rules.md`
  - `documentation/rules/rpc-layer-rules.md`
  - `documentation/rules/ui-layer-rules.md`
  - `documentation/rules/web-application-rules.md`
  - `documentation/rules/server-application-rules.md`
  - `documentation/rules/studio-appllication-rules.md`
  - `documentation/rules/ai-layer-rules.md`
  - `documentation/rules/queue-layer-rules.md`
  - `documentation/rules/realtime-rules.md`
  - `documentation/rules/validation-layer-rules.md`

Use as rules apenas para validar fronteiras e padrões técnicos; o bug report não deve virar uma spec de implementação.

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

### 4. Direcionamento de Correção

- Inclua apenas uma orientação técnica breve sobre onde a correção provavelmente deve atuar.
- Não detalhe fases, tarefas, assinaturas, novos arquivos ou lista estruturada de implementação.
- Não use seções do tipo **O que já existe**, **O que deve ser criado**, **O que deve ser modificado** ou **O que deve ser removido**; isso pertence à Spec.
- O direcionamento deve ajudar a próxima etapa, mas não substituir a Spec.

### 5. Encerramento

Após salvar o Bug Report, encerre a tarefa informando o arquivo criado ou atualizado.

- Não crie Spec.
- Não edite arquivos em `specs/`.
- Não inclua uma Spec dentro do Bug Report.
- Se o usuário pedir a Spec depois, trate como uma nova tarefa usando o prompt apropriado.

---

## Template de Saída (Estrutura Obrigatória)

Salve um único arquivo em `documentation/features/{dominio}/reports/{nome-descritivo}-bug-report.md` seguindo **estritamente** o template abaixo. Este arquivo deve conter **apenas o Bug Report**.

```md
---
title: {Titulo Curto e Descritivo}
prd: <link para o PRD ou milestone referente ao bug, se houver>
issue: <link para o issue referente ao bug>
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

## Direcionamento de Correção

{Parágrafo ou lista curta com a direção provável da correção. Deve apontar camada(s) e arquivo(s) relevantes, mas não deve detalhar tarefas de implementação como uma Spec.}
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
- Não inclua seções de planejamento de Spec, como **O que já existe**, **O que deve ser criado**, **O que deve ser modificado** ou **O que deve ser removido**.
- Não crie, edite ou atualize arquivos em `specs/` durante esta tarefa.
- Não trate a tarefa como incompleta por ausência de Spec; o entregável final é somente o Bug Report.
