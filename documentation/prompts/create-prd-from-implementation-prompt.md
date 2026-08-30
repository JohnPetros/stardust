---
description: Prompt para criar um PRD com detecção de modo (prospectivo/retrospectivo), discovery, clarificação e estrutura padronizada de requisitos e fluxos.
---

# Prompt: Criar PRD

**Objetivo:** Padronizar a criação de Product Requirements Documents (PRDs),
garantindo clareza de produto e alinhamento entre as equipes — tanto para
features novas quanto para features já implementadas.

## Fonte de Verdade do Produto

Neste projeto, **milestones do GitHub funcionam como PRDs na prática**.

Use a seguinte ordem de precedência como fonte de verdade:

1. Milestone do GitHub informada pelo usuário.
2. Confirmações explícitas do usuário durante a conversa.
3. Comportamento observável da codebase.
4. Screenshots e descrições complementares fornecidas no contexto.

Se houver conflito entre comportamento implementado e milestone, **não invente
uma reconciliação**: registre a divergência de forma explícita.

**Entradas possíveis (Inputs):**

- URL ou número da milestone no GitHub — obtenha os dados por ferramenta estruturada (`gh`/API), não por scraping HTML.
- Esboço, rascunho ou descrição da funcionalidade.
- Informações de contexto, código relevante ou screenshots.
- Parte da codebase que já implementa a feature.

Se o usuário pedir um PRD prospectivo para uma feature que deve ser orientada por produto e nenhuma milestone for informada, interrompa o fluxo e solicite a milestone antes de redigir.

---

## Regras Aplicáveis

PRD é documento de produto; portanto, não há rule de camada obrigatória para todo caso.

Use rules apenas nestas situações:

- `documentation/rules/rules.md` — quando o PRD retrospectivo precisar validar se o comportamento implementado respeita camadas existentes.
- `documentation/rules/web-application-rules.md`, `documentation/rules/studio-appllication-rules.md` ou `documentation/rules/server-application-rules.md` — quando uma limitação técnica de app afetar diretamente o comportamento de produto.
- `documentation/rules/ui-layer-rules.md` — quando requisitos de UI/UX dependerem de widgets, estados ou composição já existentes.

Não transforme o PRD em spec técnica. Use as rules apenas para não documentar comportamento impossível ou desalinhado com a arquitetura atual.

---

## INSTRUÇÕES DE EXECUÇÃO

**Você deve seguir rigorosamente este processo de três etapas:**

### Skill obrigatória: Grilling

Execute o protocolo de Grilling definido em `documentation/sdd.md` nos modos prospectivo e
retrospectivo depois de pesquisar milestone, documentação, codebase, design e demais fatos
disponíveis. Modele as decisões pendentes como uma design tree e pergunte, em cada round, toda a
frontier cujos pré-requisitos já estiverem resolvidos. Cada pergunta deve trazer a resposta
recomendada no formato canônico do protocolo; decisões dependentes pertencem a rounds posteriores.

Não pergunte fatos pesquisáveis. Somente avance para a escrita quando a frontier estiver vazia e
o usuário confirmar explicitamente o entendimento compartilhado.

---

### ETAPA 0: DETECÇÃO DE MODO (OBRIGATÓRIO)

Antes de qualquer coisa, identifique em qual modo operar com base nos inputs
fornecidos:

| Modo              | Quando usar                                                                     | Foco do processo                                                          |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Prospectivo**   | Feature ainda não implementada ou milestone ainda sem implementação consolidada | Discovery de requisitos futuros                                           |
| **Retrospectivo** | Feature já implementada (codebase, screenshots ou comportamento descrito)       | Auditoria do que foi construído em relação a milestone/comportamento real |

> Se houver ambiguidade, pergunte explicitamente ao usuário antes de continuar.

---

### ETAPA 1A — MODO PROSPECTIVO: DISCOVERY E CLARIFICAÇÃO

**NÃO GERE O PRD IMEDIATAMENTE.** Analise o pedido e faça perguntas para
preencher lacunas. Organize em:

1. **Negócio:** Objetivos, métricas de sucesso, prioridade.
2. **UX/Design:** Público-alvo, jornada, dores atuais.
3. **Técnico:** Plataformas, integrações, performance, dados.

**→ Use os rounds e o formato obrigatório do protocolo de Grilling.**

**→ Pergunte toda a frontier atual e aguarde as respostas antes de continuar.**

**→ Recompute a design tree e faça rounds adicionais até esvaziar a frontier.**

---

### ETAPA 1B — MODO RETROSPECTIVO: AUDITORIA DA IMPLEMENTAÇÃO

**NÃO GERE O PRD IMEDIATAMENTE.** Analise os inputs disponíveis (milestone,
código, screenshots, descrições de comportamento) e use-os conforme a ordem de
precedência definida neste prompt.

Em seguida, faça perguntas para validar e preencher lacunas. Organize em:

1. **Milestone vs. Implementação:** O comportamento atual reflete a milestone,
   ou representa uma limitação/adaptação técnica?
2. **Casos não cobertos:** Existem cenários de uso que a implementação atual
   não cobre mas deveria?
3. **Decisões descartadas:** Houve comportamentos ou requisitos considerados
   durante o desenvolvimento mas deixados de fora? Por quê?
4. **Restrições conhecidas:** Existem bugs, débitos técnicos ou limitações
   conhecidas que afetam o comportamento documentado?

**→ Use os rounds e o formato obrigatório do protocolo de Grilling.**

**→ Pergunte toda a frontier atual e aguarde as respostas antes de continuar.**

**→ Recompute a design tree e faça rounds adicionais até esvaziar a frontier.**

Quando não houver milestone no modo retrospectivo, a codebase passa a ser a principal evidência de comportamento implementado. Nesse caso, o documento gerado descreve a feature observada, mas não substitui a necessidade de uma milestone oficial posterior quando o projeto precisar de uma referência formal de produto.

---

### ETAPA 2: ESCRITA DO PRD

Após receber as respostas, esvaziar a frontier e obter confirmação explícita do entendimento
compartilhado, gere o documento completo seguindo estritamente o template abaixo.

No **Modo Retrospectivo**, a seção "Fora do Escopo" deve incluir também os
itens descartados durante a implementação (ver template). Quando houver
milestone, o documento gerado deve tratá-la como **referência oficial de
produto**.

---

## TEMPLATE DO PRD (Estrutura de Saída)

# PRD — {Nome da Funcionalidade}

**Referência de produto:** {URL ou número da milestone no GitHub, quando houver}

---

### 1. Visão Geral

_Descreva de forma clara e concisa:_

- O que é a funcionalidade/produto.
- Qual problema resolve.
- Qual o objetivo principal e valor entregue.

---

### 2. Requisitos

_Liste as funcionalidades. Use IDs curtos (`RF-01`, `RF-02`...) e critérios de
aceitação (`CA-01`, `CA-02`...) para permitir rastreabilidade até a Spec e as
evidências. Use checkboxes para acompanhamento._

#### RF-01 [Nome do Requisito]

- [ ] **[Nome do Requisito]**

**Descrição:** Breve contexto do requisito.

##### Critérios de Aceitação

_Defina os comportamentos observáveis que determinam se o requisito foi
atendido. A Spec deve preservar o significado destes critérios e acrescentar
as evidências técnicas._

| ID      | Critério observável                               |
| ------- | ------------------------------------------------- |
| `CA-01` | Dado [contexto], quando [ação], então [resultado] |

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

_(Repita o bloco `RF-XX` para todos os requisitos)_

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

### 5. Divergências entre Milestone e Implementação _(somente quando houver)_

_Registre de forma objetiva os pontos em que a implementação atual diverge da
milestone ou ainda não cobre integralmente o comportamento esperado._

- **[Ponto de divergência]:** O que a milestone define, o que a implementação faz hoje e impacto percebido.
- **[Ponto de divergência]:** O que falta ou foi adaptado.

---

## Restrições para o PRD

- Foco exclusivo em **funcionalidades e comportamento de produto** — sem entrar
  em arquitetura de software ou decisões detalhadas de código, exceto quando uma
  limitação técnica afetar diretamente o comportamento documentado.
- Não invente detalhes: marque como `🚧 Em construção` ou sinalize como
  "Assunção" quando uma informação não foi confirmada.
- A seção "Descartado durante a implementação" só deve aparecer no
  **Modo Retrospectivo**.
- A seção "Divergências entre Milestone e Implementação" só deve aparecer
  quando houver milestone informada ou inferida com segurança.
