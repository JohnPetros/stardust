---
description: Criar um prompt genérico (meta-prompt) para gerar prompts consistentes e reutilizáveis
---

# Prompt: Criar Prompt Genérico

**Objetivo:** Criar um **prompt genérico e reutilizável** (meta-prompt) que sirva como base para gerar prompts de alta qualidade para diferentes tarefas (ex: spec técnica, PRD, checklist, plano de refatoração, roteiro de implementação). O resultado deve ser claro, modular, e fácil de adaptar trocando apenas variáveis.

**Entrada:**

- Tema/tarefa principal que o prompt genérico deve cobrir (ex: “gerar spec técnica”, “gerar PRD”, “gerar plano de testes”).
- Restrições e preferências (ex: “não incluir testes”, “usar markdown”, “seguir arquitetura em camadas”).
- Fontes disponíveis (ex: PRDs, guidelines, codebase, links, docs internas).

**Diretrizes de Execução:**

1. **Pesquisa e Contextualização (Chain of Thought):**
   - **Entenda o objetivo final:** Qual artefato o prompt genérico vai gerar e para quê.
   - **Defina variáveis (placeholders):** Liste campos parametrizáveis (ex: `{TAREFA}`, `{CONTEXTO}`, `{STACK}`, `{REGRAS}`, `{SAÍDA}`).
   - **Mapeie o fluxo de trabalho:** Quais entradas viram quais saídas e em qual ordem.
   - **Identifique dependências:** Quais documentos/arquivos/regras o modelo deve consultar antes de escrever.
   - **Evite ambiguidade:** Inclua critérios de completude e como lidar com falta de informação (ex: “assumir X”, “registrar pendências”).

2. **Uso de Ferramentas Auxiliares:**
   - **Ferramenta de busca no repositório (opcional):** Se existir, instruir a IA a localizar arquivos e exemplos similares.
   - **Ferramenta de documentação (opcional):** Se existir, instruir a IA a consultar docs oficiais quando houver dúvida de lib/framework.
   - **Modo sem ferramentas:** Se não houver ferramentas, a IA deve solicitar ao usuário os trechos relevantes (PRD, guidelines, exemplos).

3. **Estruturação do Documento:** Gere o arquivo Markdown do **prompt genérico** seguindo estritamente o modelo abaixo (o output é um prompt, não o documento final da tarefa):

   Cabeçalho (Frontmatter):
   - description: [Descrição curta do que o prompt genérico gera]

   # Prompt: [Nome do Prompt Genérico]

   **Objetivo:**
   - [Explique em 2–4 linhas o que esse meta-prompt fará ao ser usado.]

   **Entrada:**
   - [Liste as entradas obrigatórias e opcionais.]
   - [Explique o formato esperado (ex: bullets, links, trechos de arquivo).]

   **Diretrizes de Execução:**
   1. [Etapa 1 — entendimento do contexto e validação de entradas]
   2. [Etapa 2 — levantamento do que já existe (se aplicável)]
   3. [Etapa 3 — geração da estrutura final com seções]
   4. [Etapa 4 — checagens finais de qualidade/consistência]

   **Template de Saída (Estrutura Obrigatória):**
   - [Defina os títulos de primeiro nível (#) que a saída deve ter.]
   - [Inclua subitens esperados dentro de cada seção.]
   - [Use placeholders `{...}` quando for variável.]

4. Regras:
  - [Liste regras fixas e restrições do meta-prompt.]
  - [Ex: “Não inclua testes automatizados”, “Não invente caminhos de arquivo”, “Use Markdown”, “Não omita seções obrigatórias”.]
---
description: Criar um prompt genérico (meta-prompt) para gerar prompts consistentes e reutilizáveis
---

# Prompt: Criar Prompt Genérico

**Objetivo:** Criar um **prompt genérico e reutilizável** (meta-prompt) que sirva como base para gerar prompts de alta qualidade para diferentes tarefas (ex: spec técnica, PRD, checklist, plano de refatoração, roteiro de implementação). O resultado deve ser claro, modular, e fácil de adaptar trocando apenas variáveis.

**Entrada:**

- Tema/tarefa principal que o prompt genérico deve cobrir (ex: “gerar spec técnica”, “gerar PRD”, “gerar plano de testes”).
- Público-alvo e contexto (ex: time, stack, produto, maturidade).
- Restrições e preferências (ex: “não incluir testes”, “usar markdown”, “seguir arquitetura em camadas”).
- Fontes disponíveis (ex: PRDs, guidelines, codebase, links, docs internas).

**Diretrizes de Execução:**

1. **Pesquisa e Contextualização (Chain of Thought):**
   - **Entenda o objetivo final:** Qual artefato o prompt genérico vai gerar e para quê.
   - **Defina variáveis (placeholders):** Liste campos parametrizáveis (ex: `{TAREFA}`, `{CONTEXTO}`, `{STACK}`, `{REGRAS}`, `{SAÍDA}`).
   - **Mapeie o fluxo de trabalho:** Quais entradas viram quais saídas e em qual ordem.
   - **Identifique dependências:** Quais documentos/arquivos/regras o modelo deve consultar antes de escrever.
   - **Evite ambiguidade:** Inclua critérios de completude e como lidar com falta de informação (ex: “assumir X”, “registrar pendências”).

2. **Uso de Ferramentas Auxiliares:**
   - **Ferramenta de busca no repositório (opcional):** Se existir, instruir a IA a localizar arquivos e exemplos similares.
   - **Ferramenta de documentação (opcional):** Se existir, instruir a IA a consultar docs oficiais quando houver dúvida de lib/framework.
   - **Modo sem ferramentas:** Se não houver ferramentas, a IA deve solicitar ao usuário os trechos relevantes (PRD, guidelines, exemplos).

3. **Estruturação do Documento:** Gere o arquivo Markdown do **prompt genérico** seguindo estritamente o modelo abaixo (o output é um prompt, não o documento final da tarefa):

   Cabeçalho (Frontmatter):
   - description: [Descrição curta do que o prompt genérico gera]

   # Prompt: [Nome do Prompt Genérico]

   **Objetivo:**
   - [Explique em 2–4 linhas o que esse meta-prompt fará ao ser usado.]

   **Entrada:**
   - [Liste as entradas obrigatórias e opcionais.]
   - [Explique o formato esperado (ex: bullets, links, trechos de arquivo).]

   **Diretrizes de Execução:**
   1. [Etapa 1 — entendimento do contexto e validação de entradas]
   2. [Etapa 2 — levantamento do que já existe (se aplicável)]
   3. [Etapa 3 — geração da estrutura final com seções]
   4. [Etapa 4 — checagens finais de qualidade/consistência]

   **Template de Saída (Estrutura Obrigatória):**
   - [Defina os títulos de primeiro nível (#) que a saída deve ter.]
   - [Inclua subitens esperados dentro de cada seção.]
   - [Use placeholders `{...}` quando for variável.]

4. Regras:
  - [Liste regras fixas e restrições do meta-prompt.]
  - [Ex: “Não inclua testes automatizados”, “Não invente caminhos de arquivo”, “Use Markdown”, “Não omita seções obrigatórias”.]
