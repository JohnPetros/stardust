---
description: Prompt para criar um PRD com detecção de modo (prospectivo/retrospectivo), discovery, clarificação e estrutura padronizada de requisitos e fluxos.
---

# Prompt: Criar PRD

**Objetivo:** Padronizar a criação de Product Requirements Documents (PRDs),
garantindo clareza técnica e alinhamento entre as equipes de produto, design e
desenvolvimento — tanto para features novas quanto para features já implementadas.

**Entradas possíveis (Inputs):**

- URL da milestone no Github — use a tool `webfetch` para obter os dados da página.
- Esboço, rascunho ou descrição da funcionalidade.
- Informações de contexto, código relevante ou screenshots.
- Documentação de referência (se houver).
- Parte da codebase que já implementa a feature.

---

## INSTRUÇÕES DE EXECUÇÃO

**Você deve seguir rigorosamente este processo de três etapas:**

---

### ETAPA 0: DETECÇÃO DE MODO (OBRIGATÓRIO)

Antes de qualquer coisa, identifique em qual modo operar com base nos inputs
fornecidos:

| Modo | Quando usar | Foco do processo |
|---|---|---|
| **Prospectivo** | Feature ainda não implementada | Discovery de requisitos futuros |
| **Retrospectivo** | Feature já implementada (codebase, screenshots ou comportamento descrito) | Auditoria do que foi construído |

> Se houver ambiguidade, pergunte explicitamente ao usuário antes de continuar.

---

### ETAPA 1A — MODO PROSPECTIVO: DISCOVERY E CLARIFICAÇÃO

**NÃO GERE O PRD IMEDIATAMENTE.** Analise o pedido e faça perguntas para
preencher lacunas. Organize em:

1. **Negócio:** Objetivos, métricas de sucesso, prioridade.
2. **UX/Design:** Público-alvo, jornada, dores atuais.
3. **Técnico:** Plataformas, integrações, performance, dados.

**→ Use a tool `question` para gerar as perguntas.**  
**→ Pare e aguarde as respostas antes de continuar.**  
**→ Se necessário, faça rodadas adicionais de perguntas.**

---

### ETAPA 1B — MODO RETROSPECTIVO: AUDITORIA DA IMPLEMENTAÇÃO

**NÃO GERE O PRD IMEDIATAMENTE.** Analise os inputs disponíveis (código,
screenshots, descrições de comportamento) e use-os como fonte de verdade primária.

Em seguida, faça perguntas para validar e preencher lacunas. Organize em:

1. **Intenção vs. Implementação:** O comportamento atual reflete a intenção
   original de produto, ou representa uma limitação/adaptação técnica?
2. **Casos não cobertos:** Existem cenários de uso que a implementação atual
   não cobre mas deveria?
3. **Decisões descartadas:** Houve comportamentos ou requisitos considerados
   durante o desenvolvimento mas deixados de fora? Por quê?
4. **Restrições conhecidas:** Existem bugs, débitos técnicos ou limitações
   conhecidas que afetam o comportamento documentado?

**→ Use a tool `question` para gerar as perguntas.**  
**→ Pare e aguarde as respostas antes de continuar.**  
**→ Se necessário, faça rodadas adicionais de perguntas.**

---

### ETAPA 2: ESCRITA DO PRD

Após receber as respostas, gere o documento completo seguindo estritamente o
template abaixo.

No **Modo Retrospectivo**, a seção "Fora do Escopo" deve incluir também os
itens descartados durante a implementação (ver template).

---

## TEMPLATE DO PRD (Estrutura de Saída)

# PRD — {Nome da Funcionalidade}

---

### 1. Visão Geral

_Descreva de forma clara e concisa:_

- O que é a funcionalidade/produto.
- Qual problema resolve.
- Qual o objetivo principal e valor entregue.

---

### 2. Requisitos

_Liste as funcionalidades. Use IDs curtos (`REQ-01`, `REQ-02`...) para
permitir rastreabilidade com issues e tickets. Use checkboxes para acompanhamento._

#### REQ-01 [Nome do Requisito]

- [ ] **[Nome do Requisito]**

**Descrição:** Breve contexto do requisito.

##### Regras de Negócio

_Liste as regras lógicas e comportamentais (Backend/Lógica)._

- **[Nome da Regra]:** Descrição detalhada do comportamento, validações,
  condições, gatilhos e cálculos.
- **[Nome da Regra]:** Descrição detalhada...

##### Regras de UI/UX (se houver)

_Especifique aspectos visuais e de interação (Frontend)._

- **[Elemento Visual]:** Especificação (Cores, Tipografia, Estados).
- **Responsividade:** Comportamento em mobile/desktop.
- **Acessibilidade:** Regras de contraste e navegação por teclado.
- **Feedback:** Mensagens de erro, sucesso e estados de loading.
- **Performance:** Tempo de carregamento, resposta.
- **Confiabilidade:** Tratamento de erros, fallbacks.
- **Compatibilidade:** Navegadores, dispositivos.

_(Repita o bloco `REQ-XX` para todos os requisitos)_

---

### 3. Fluxo de Usuário (User Flow)

_Descreva o caminho passo a passo que o usuário percorre. Divida em fluxos
menores se necessário._

**[Nome do fluxo]:** Breve contexto do fluxo.

1. O usuário acessa [Tela/Local].
2. O usuário realiza [Ação].
3. O sistema valida [Condição]:
   - **Sucesso:** Ocorre X.
   - **Falha:** Ocorre Y.

---

### 4. Fora do Escopo (Out of Scope)

_O que NÃO faz parte desta versão, para evitar scope creep._

- [Item fora do escopo]
- [Item fora do escopo]

#### Descartado durante a implementação _(somente Modo Retrospectivo)_

_Comportamentos ou requisitos considerados mas não entregues, com justificativa._

- **[Item descartado]:** Motivo pelo qual foi deixado de fora.
- **[Item descartado]:** Motivo...

---

## Restrições para o PRD

- Foco exclusivo em **funcionalidades** — sem tópicos de design visual,
  arquitetura de software, design de interação ou decisões de código.
- Não invente detalhes: marque como `🚧 Em construção` ou sinalize como
  "Assunção" quando uma informação não foi confirmada.
- A seção "Descartado durante a implementação" só deve aparecer no
  **Modo Retrospectivo**.