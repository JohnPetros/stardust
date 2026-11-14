---
title: Layout de desafio
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/17
last_updated_at: 2026-07-16
---

# PRD — Layout de desafio

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Challenge Layout** é o layout principal da tela de resolução de desafios
de programação na plataforma StarDust. Ele organiza a interface onde o usuário
interage com a descrição do desafio, o editor de código, os resultados da
execução, comentários da comunidade, soluções de outros usuários e um
assistente de IA.

**Problema que resolve:** Proporcionar uma experiência de resolução de desafios
de código que permita ao usuário visualizar simultaneamente (desktop) ou
alternar (mobile) entre informação contextual (descrição, resultados) e a área
de trabalho (editor de código), maximizando a produtividade sem perder o
contexto.

**Objetivo principal:** Oferecer um ambiente de trabalho responsivo,
redimensionável e persistente que adapta a disposição dos painéis
conforme o dispositivo (mobile/desktop), integrando conteúdo educacional,
editor de código e assistente de IA em uma experiência coesa.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/17 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Layout Responsivo com Dois Modos

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Layout Responsivo com Dois Modos.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O layout deve adaptar-se ao dispositivo do usuário, exibindo
uma experiência otimizada para cada formato de tela.

##### Regras de Negócio
- **Modo Desktop (>= md breakpoint):** Os conteúdos são organizados em painéis
  horizontais redimensionáveis, permitindo visualização simultânea de múltiplos
  conteúdos.
- **Modo Mobile (< md breakpoint):** Os conteúdos são organizados em slides
  navegáveis (um por vez), com navegação via barra de botões fixa no topo.
- **Exclusividade de modo:** Apenas um modo é renderizado por vez — o modo
  mobile é ocultado no desktop e vice-versa.

##### Regras de Experiência

- **Responsividade:** O breakpoint `md` do Tailwind CSS (768px) define a
  transição entre mobile e desktop. Abaixo de `md`, o slider é exibido; acima,
  os painéis redimensionáveis.
- **Performance:** O componente do slider mobile é carregado via `next/dynamic`
  com `ssr: false` para evitar renderização no servidor.

---

#### RP-02 — Painéis Redimensionáveis (Desktop)

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Painéis Redimensionáveis (Desktop).

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** No modo desktop, o layout organiza o conteúdo em painéis
horizontais que o usuário pode redimensionar arrastando handles entre eles.

##### Regras de Negócio
- **Painéis base:** O layout sempre exibe dois painéis obrigatórios:
  1. **Painel de Tabs** (ordem 1): exibe o conteúdo textual (descrição,
     resultado, comentários, soluções).
  2. **Painel do Editor de Código** (ordem 2): exibe o editor de código do
     desafio.
- **Painel do Assistente (condicional):** Quando o assistente está habilitado
  (`isAssistantEnabled = true`), um terceiro painel é adicionado à direita
  (ordem 3) com tamanho mínimo de 30%.
- **Tamanho mínimo:** Cada painel obrigatório tem tamanho mínimo de 1% para
  garantir que nunca desapareça completamente.
- **Persistência do layout:** Quando o usuário redimensiona os painéis, as
  proporções (tabs e editor) são salvas em cookie
  (`challengePanelsOffset`) para restauração na próxima visita.
- **Layout padrão:** Se não houver cookie salvo, os painéis iniciam com
  distribuição 50%/50% entre tabs e editor.

##### Regras de Experiência

- **Handle de redimensionamento:** Barra vertical de 8px com indicador visual
  central (barra de 4px de largura e 16px de altura). Efeito de hover com
  redução de opacidade.
- **Feedback:** O redimensionamento é fluido e sem delay perceptível, com
  transição CSS de 100ms no handle.

---

#### RP-03 — Slider de Navegação (Mobile)

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Slider de Navegação (Mobile).

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** No modo mobile, o conteúdo é organizado em 4 slides navegáveis
com uma barra de navegação fixa no topo.

##### Regras de Negócio
- **Slides fixos:** O slider contém exatamente 4 slides na seguinte ordem:
  1. **Slide 0 — Conteúdo Dinâmico:** Exibe o conteúdo ativo
     (Descrição, Comentários ou Soluções). Quando o conteúdo ativo é
     "Resultado", este slide exibe a Descrição do desafio como fallback.
  2. **Slide 1 — Código:** Exibe o editor de código.
  3. **Slide 2 — Resultado:** Exibe o resultado da execução do código.
  4. **Slide 3 — Assistente:** Exibe o chatbot assistente de IA.
- **Label dinâmico:** O label do Slide 0 muda conforme o conteúdo ativo
  (`Descrição`, `Comentários`, `Soluções` ou `Resultado`).
- **Navegação programática:** O sistema pode navegar automaticamente para
  slides específicos via `TabHandler` (ex: ao submeter código, navegar para o
  slide de Resultado).
- **Touch desabilitado:** O swipe por toque está desabilitado
  (`simulateTouch: false`, `allowTouchMove: false`). A navegação ocorre
  exclusivamente via botões.

##### Regras de Experiência

- **Barra de navegação:** Grid de 4 colunas com botões de texto. O botão ativo
  é destacado em verde (`text-green-400`), os inativos em branco
  (`text-gray-100`).
- **Indicador animado:** Uma barra horizontal verde de 2px acompanha o slide
  ativo com animação linear de 200ms.
- **Altura:** O slider ocupa `100vh - 5.2rem` (altura total menos header e
  barra de navegação).

---

#### RP-04 — Sistema de Abas de Conteúdo (Desktop)

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Sistema de Abas de Conteúdo (Desktop).

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** No painel de tabs do desktop, o conteúdo textual é organizado
em abas que permitem alternar entre diferentes tipos de informação sobre o
desafio.

##### Regras de Negócio
- **Abas disponíveis:** Descrição, Resultado, Comentários e Soluções.
- **Aba padrão:** A aba "Descrição" é selecionada por padrão ao abrir o
  desafio.
- **Comentários — regra de visibilidade:** A aba de Comentários possui
  controle de acesso:
  - Se `canShowComments` for `false`, a aba aparece como bloqueada e ao clicar
    exibe um `BlockedCommentsAlertDialog` explicando a restrição.
  - Se `canShowComments` for `true`, a aba funciona normalmente.
- **Soluções — regra de acesso e monetização:**
  - **Usuário não autenticado:** Um botão "Soluções" com ícone de cadeado é
    exibido. Ao clicar, um `AccountRequirementAlertDialog` informa que é
    necessário acessar a conta.
  - **Usuário autenticado + soluções bloqueadas (`canShowSolutions = false`):**
    A aba aparece como bloqueada. Ao clicar, um `BlockedSolutionsAlertDialog`
    oferece a opção de desbloquear pagando **10 starcoins**.
  - **Usuário autenticado + soluções desbloqueadas (`canShowSolutions = true`):**
    A aba funciona normalmente e redireciona para a rota de listagem de
    soluções do desafio.
- **Custo de desbloqueio de soluções:** O preço é fixo em **10 starcoins**
  (definido em `ChallengeCraftsVisibility.solutionsVisibilityPrice`). O valor
  é debitado diretamente das moedas do usuário. Caso o usuário não possua
  saldo suficiente, um toast de erro é exibido.

##### Regras de Experiência

- **Feedback de bloqueio:** Abas bloqueadas exibem indicação visual
  (ícone de cadeado) e diálogos de alerta ao clicar.
- **Feedback de saldo insuficiente:** Toast "Você não possui moedas
  suficiente" quando o usuário tenta desbloquear sem saldo.
- **Animação de transição:** Ao trocar de aba, o conteúdo entra com animação
  de slide horizontal (da direita para a esquerda, com fade, via
  `motion/react`).
- **Scroll automático:** Ao navegar para uma nova rota dentro do conteúdo da
  aba, o scroll é resetado para o topo com delay de 500ms.

---

#### RP-05 — Animação de Transição de Página

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Animação de Transição de Página.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Ao acessar a tela de um desafio, uma animação de transição de
página é exibida como overlay, com dicas opcionais.

##### Regras de Negócio
- **Exibição automática:** A animação é sempre exibida ao entrar na tela do
  desafio.
- **Duração:** A animação permanece visível por **5 segundos**, após os quais
  é removida automaticamente.
- **Dicas:** A animação inclui dicas (`hasTips = true`) para o usuário
  enquanto o conteúdo carrega.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-06 — Assistente de IA (Chatbot)

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Assistente de IA (Chatbot).

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O layout integra um assistente de IA (chatbot) que auxilia o
usuário na resolução do desafio, disponível como painel lateral no desktop e
como slide dedicado no mobile.

##### Regras de Negócio
- **Disponibilidade:** O assistente está disponível para todos os usuários, sem
  restrição de plano ou feature flag.
- **Habilitação condicional (desktop):** No desktop, o painel do assistente
  só é renderizado quando `isAssistantEnabled` é `true` no estado global
  (`ChallengeStore`).
- **Habilitação incondicional (mobile):** No mobile, o slide do assistente
  está sempre presente como quarto slide.
- **Criação de chat:** O usuário pode criar uma nova conversa manualmente ou
  através do botão "Pedir para ajuda ao assistente".
- **Histórico de chats:** O usuário pode acessar conversas anteriores via
  botão de histórico. Cada chat pode ser selecionado, excluído ou ter seu nome
  editado.
- **Mensagem inicial automática:** Ao criar um chat com mensagem predefinida
  (ex: "Ajude-me com este desafio"), a primeira mensagem é enviada
  automaticamente ao assistente.
- **Contexto do desafio:** O assistente recebe o ID do desafio atual para
  contextualizar suas respostas.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

---

#### RP-07 — Contagem de Tempo

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Contagem de Tempo.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O layout inicia uma contagem de tempo enquanto o desafio não
está completado, permitindo medir o tempo de resolução do usuário.

##### Regras de Negócio
- **Condição de ativação:** O contador de segundos é ativado quando o desafio
  não está completado (`challenge.isCompleted.isFalse`).
- **Parada automática:** O contador para automaticamente quando o desafio é
  marcado como completado.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

**Entrada no desafio:**

1. O usuário acessa a URL de um desafio
   (`/challenging/challenges/[slug]/challenge`).
2. O sistema carrega o layout e exibe a animação de transição de página com
   dicas por 5 segundos.
3. O sistema lê o cookie `challengePanelsOffset` para restaurar o layout
   salvo:
   - **Sucesso:** Os painéis são posicionados conforme os valores salvos.
   - **Falha (cookie ausente):** Os painéis iniciam em 50%/50%.
4. A animação desaparece e o desafio é exibido.

**Resolução do desafio (desktop):**

1. O usuário visualiza a descrição do desafio no painel de tabs (aba
   "Descrição" ativa por padrão).
2. O usuário escreve código no painel do editor.
3. O usuário pode redimensionar os painéis arrastando o handle entre eles. As
   proporções são salvas automaticamente no cookie.
4. Ao submeter o código, o resultado é exibido na aba "Resultado".
5. Opcionalmente, o usuário acessa Comentários ou Soluções (se desbloqueados).
6. Opcionalmente, o usuário ativa o assistente de IA, que aparece como
   terceiro painel à direita.

**Resolução do desafio (mobile):**

1. O usuário visualiza a descrição do desafio no primeiro slide.
2. O usuário navega para o slide "Código" via barra de navegação no topo.
3. Ao submeter o código, o sistema navega automaticamente para o slide
   "Resultado".
4. Opcionalmente, o usuário navega para o slide "Assistente" para pedir ajuda.

**Desbloqueio de soluções (desktop):**

1. O usuário clica na aba "Soluções":
   - **Não autenticado:** Diálogo solicita login.
   - **Autenticado + bloqueado:** Diálogo oferece desbloqueio por 10
     starcoins.
     - **Sucesso (saldo suficiente):** Moedas são debitadas, aba é
       desbloqueada e o usuário é redirecionado para a listagem de soluções.
     - **Falha (saldo insuficiente):** Toast de erro é exibido.
   - **Autenticado + desbloqueado:** Navegação direta para soluções.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Lógica de execução de código do editor (pertence ao módulo de |
| Escopo | Renderização do conteúdo MDX da descrição do desafio (pertence ao módulo de |
| Escopo | Lógica de submissão e validação de código (pertence ao fluxo de resolução do |
| Escopo | Lógica de IA/NLP do assistente (pertence ao módulo de conversa). |
| Escopo | Listagem e detalhamento de soluções e comentários (pertence a seus |
| Escopo | Design visual detalhado (cores, tipografia, espaçamentos exatos) — pertence |
| Escopo | Comportamento offline ou PWA. |
| Escopo | **Nenhum item descartado:** Todas as funcionalidades planejadas foram |
| Escopo | **UX de Comentários e Soluções no mobile:** A experiência de acesso a |

### Decisões descartadas durante a definição

- **Nenhum item descartado:** Todas as funcionalidades planejadas foram
  implementadas conforme a intenção original de produto.
