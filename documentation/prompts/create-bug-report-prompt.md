# Prompt: Criar Bug Report

**Objetivo:**
Transformar um esboço ou relato informal de um erro em um **Bug Report Profissional**, claro, acionável e tecnicamente orientado, pronto para ser consumido pela equipe de desenvolvimento **sem necessidade de interpretação adicional**.

O bug report deve:
- Explicar **o que está quebrado**
- Indicar **onde e por que provavelmente está quebrado**
- Sugerir **como corrigir**, respeitando a arquitetura do projeto

---

**Entrada:**
* **Esboço do Problema:** relato livre descrevendo o erro observado (sintoma)
* **Contexto Técnico (Opcional):**
  - Dispositivo / OS / Browser
  - Versão do app
  - Ambiente (local, staging, produção)
  - Feature ou fluxo afetado

---

**Diretrizes de Execução:**

1. **Análise do Relato**
   - Interprete o problema descrito focando em **comportamento observado vs comportamento esperado**.
   - Elimine ambiguidades do relato original.

2. **Compreensão Arquitetural**
   - Entenda a arquitetura do projeto e as responsabilidades de cada camada.

3. **Diagnóstico**
   - Identifique causas prováveis com base na arquitetura descrita em `documentation/architecture.md`.
   - Se o bug estiver associado a uma funcionalidade existente, consulte o **PRD correspondente**, localizado no diretório `bug-reports/` (nível acima do report).
   - Identifique o **ponto de verdade** dos dados afetados:
     - Fonte (DB, API externa, cache, storage)
     - Contratos (schemas/DTOs)
     - Normalização (mapeamentos entre camadas)
   - Localize rapidamente os “nós críticos” no código:
     - Onde a feature é iniciada (page/widget/route)
     - Onde o estado é controlado (store/context)
     - Onde a chamada remota acontece (action/service)
     - Onde regras são aplicadas (use case)
     - Onde persistência/integração é feita (driver/repo)
   - Procure implementações similares na codebase:
     - Features do mesmo módulo (ex: space/planet/star/lesson)
     - Fluxos de CRUD parecidos
     - Padrões repetidos de validação, erro e loading

4. **Mapeamento de Camadas**
   - Determine **quais camadas estão envolvidas** direta ou indiretamente.
   - Sempre que possível, associe o problema a **arquivos reais da codebase**.

5. **Plano de Correção**
   - Proponha uma solução técnica **incremental e segura**, separada por camadas.
   - O plano deve ser claro o suficiente para servir como base de implementação (mini-spec).

---

**Formato de Saída Obrigatório:**

Gere a resposta **exclusivamente** dentro de um bloco de código Markdown, seguindo **estritamente** o template abaixo.
Não adicione seções extras nem altere títulos.

```markdown
## 🐛 Bug Report: [Título Curto e Descritivo]

**Problema Identificado:**
[Descrição objetiva do comportamento incorreto observado.
Evite suposições técnicas nesta seção.]

**Causas:**
[Lista concisa das causas técnicas prováveis.
Exemplo: validação ausente, estado inconsistente, contrato quebrado, erro de mapeamento, etc.]

**Contexto e Análise:**

### [Nome da Camada (ex: Camada UI, Camada Core, Camada REST, Camada Drivers)]

<!-- Repita o bloco abaixo para cada camada afetada -->
- Arquivo: `[caminho/relativo/do/arquivo]`
- Diagnóstico: [Explique exatamente o que está errado neste ponto,
  incluindo falhas de responsabilidade, fluxo, estado ou contrato]

---

**Plano de Correção (Spec):**

### 1. O que já existe? (Contexto/Impacto)
Liste recursos existentes da codebase que:
- Estão envolvidos no bug
- Serão reutilizados na correção
- Podem ser impactados indiretamente

- **[Camada]**
  - `[Nome do Recurso]` — [Responsabilidade atual e relação com o bug]
  - `[Nome do Recurso]` — [Responsabilidade atual e relação com o bug]

---

### 2. O que deve ser criado?
Descreva novos recursos necessários **apenas se estritamente necessários**.

- **[Camada]**
  - `[Nome do Recurso]` — [Nova responsabilidade introduzida]

---

### 3. O que deve ser modificado?
Liste mudanças pontuais em código existente, explicando o motivo da alteração.

- **[Camada]**
  - `[Nome do Recurso]` — [Descrição clara da modificação]

---

### 4. O que deve ser removido?
Liste código redundante, legado ou incorreto que deve ser eliminado como parte da correção.

- **[Camada]**
  - `[Nome do Recurso]` — [Motivo da remoção ou limpeza]
