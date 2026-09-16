---
description: Prompt para criar um PRD com detecção de modo (prospectivo/retrospectivo), discovery, clarificação e estrutura padronizada de requisitos e fluxos.
---

# Prompt: Criar PRD

**Objetivo:** Padronizar a criação de Product Requirements Documents (PRDs),
garantindo clareza de produto e alinhamento entre as equipes — tanto para
features novas quanto para features já implementadas.

## Fonte de Verdade do Produto

Neste projeto, o PRD canônico de produto é mantido no repositório, em
`documentation/prds/<module>/<slug>.md`. O arquivo versionado é a fonte de
verdade do produto; não há dependência de Confluence.

Use a seguinte ordem de precedência como fonte de verdade:

1. PRD canônico local em `documentation/prds/` informado pelo usuário.
2. Confirmações explícitas do usuário durante a conversa.
3. Milestone e Issues do GitHub associadas.
4. Comportamento observável da codebase.
5. Screenshots e descrições complementares fornecidas no contexto.

Se houver conflito entre comportamento implementado e milestone, **não invente
uma reconciliação**: registre a divergência de forma explícita.

**Entradas possíveis (Inputs):**

- Path ou referência do PRD canônico em `documentation/prds/`, quando disponível.
- URL ou número da milestone no GitHub — obtenha os dados por ferramenta estruturada (`gh`/API), não por scraping HTML.
- Esboço, rascunho ou descrição da funcionalidade.
- Informações de contexto, código relevante ou screenshots.
- Parte da codebase que já implementa a feature.

Se o usuário pedir um PRD prospectivo para uma feature que deve ser orientada por produto e nenhuma fonte de produto for informada, interrompa o fluxo e solicite a referência do PRD canônico em `documentation/prds/` ou a confirmação explícita de que se trata de um pedido direto ainda não publicado.

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

Execute o **Grilling gate** definido em [`sdd.md#grilling-gate`](../sdd.md#grilling-gate) nos modos prospectivo e
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

Quando não houver PRD canônico no modo retrospectivo, a codebase passa a ser a
principal evidência do comportamento implementado. Nesse caso, o documento
gerado descreve a feature observada, mas permanece um rascunho local até ser
validado e publicado no Confluence.

---

### ETAPA 2: ESCRITA DO PRD

Após receber as respostas, esvaziar a frontier e obter confirmação explícita do entendimento
compartilhado, gere o documento completo seguindo estritamente o template abaixo.

No **Modo Retrospectivo**, a seção "Decisões descartadas durante a definição"
deve incluir também os itens descartados durante a implementação. Divergências
observadas devem ser registradas em "Problema e Oportunidade" ou nas
premissas, sem criar uma seção fora da estrutura canônica.

---

## TEMPLATE DO PRD (Estrutura de Saída)

Use exatamente a estrutura canônica definida em
`documentation/prompts/create-prd-prompt.md`:

1. Cabeçalho com título, `Disponibiliza para` e `Navegação`;
2. `Resumo Executivo`;
3. `Problema e Oportunidade`, com `Base de fontes e autoridade`;
4. `Público-alvo`, contexto de uso e Jobs to Be Done;
5. `Objetivos e Métricas de Sucesso`, com limites e premissas;
6. `Requisitos de Produto`, com conceitos/responsabilidades e blocos `RP-*`;
7. `Grafo de Dependências do Produto`;
8. `Jornadas`, com blocos `JN-*`;
9. `Fora do Escopo`, com decisões descartadas.

O cabeçalho deve registrar o PRD canônico, sua revisão, as fontes auxiliares,
os `RP-*` e os `JN-*`. Cada `RP-*` deve conter necessidades do usuário,
resultado, atores, regras de negócio e regras de experiência. Não use `RF-*`,
`CA-*`, `VM-*` ou `EV-*` no PRD; esses IDs pertencem à Spec/Evaluation.

## Restrições para o PRD

- Foco exclusivo em **funcionalidades e comportamento de produto** — sem entrar
  em arquitetura de software ou decisões detalhadas de código, exceto quando uma
  limitação técnica afetar diretamente o comportamento documentado.
- Não invente detalhes: marque como `🚧 Em construção` ou sinalize como
  "Assunção" quando uma informação não foi confirmada.
- A seção "Descartado durante a implementação" só deve aparecer no
  **Modo Retrospectivo**.
