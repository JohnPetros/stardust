---
title: Navegação de Desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/16
last_updated_at: 2026-04-07
---

# PRD — Navegação de Desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

- **O que é:** Uma sidebar lateral acessível a partir da página de execução de um desafio, que permite ao usuário explorar, filtrar e navegar entre todos os desafios disponíveis na plataforma Stardust.
- **Problema que resolve:** O usuário precisa sair da página atual para encontrar o próximo desafio que deseja resolver, gerando atrito desnecessário na navegação.
- **Objetivo e valor:** Reduzir o atrito na troca de desafios e reforçar o senso de progresso, exibindo para usuários autenticados quantos desafios já foram concluídos.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/16 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Abertura da Sidebar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Abertura da Sidebar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário acessa a sidebar de navegação de desafios a partir de um botão/aba na interface da página de desafio.

##### Regras de Negócio
- **Abertura via aba de navegação:** Deve existir um botão ou aba dedicada na interface da página de desafio que, ao ser clicada, abre a sidebar.
- **Comportamento de sobreposição:** A sidebar abre sobreposta ao conteúdo da página, sem redirecionar o usuário.

##### Regras de Experiência

- **Overlay:** Ao abrir a sidebar, deve ser exibido um overlay escurecido sobre o restante da página.
- **Feedback:** A sidebar pode ser fechada clicando no overlay, em um botão de fechar explícito, ou pressionando a tecla `Esc`.

---

#### RP-02 — Listagem de Desafios

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem de Desafios.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** A sidebar exibe a lista de todos os desafios disponíveis, paginada, com as informações essenciais de cada item.

##### Regras de Negócio
- **Colunas obrigatórias:** Cada linha deve exibir: status de completude (ícone), nome do desafio e nível de dificuldade.
- **Paginação:** Exibir 20 desafios por página.
- **Indicador de paginação:** Exibir no formato "Exibindo X - Y" com botões de página anterior e próxima.
- **Botões de paginação desabilitados nos extremos:** O botão de página anterior deve ser desabilitado na primeira página; o de próxima, na última.
- **Status de completude:** Apenas exibido para usuários autenticados. Para não autenticados, a coluna de status não deve aparecer.

##### Regras de Experiência

- **Feedback:** Exibir indicador de carregamento enquanto a lista é buscada; exibir mensagem amigável quando nenhum desafio for encontrado com os filtros aplicados.
- **Desafio ativo:** O desafio atualmente aberto deve ser visualmente destacado na lista.

---

#### RP-03 — Progresso do Usuário

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Progresso do Usuário.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Para usuários autenticados, exibir o total de desafios concluídos em relação ao total disponível.

##### Regras de Negócio
- **Exibição condicional:** O contador de progresso só é exibido quando o usuário estiver logado.
- **Formato:** Exibir no formato "X/Y Resolvidos", onde X é o número de desafios concluídos e Y é o total disponível.

##### Regras de Experiência

- **Posicionamento:** O contador deve estar no cabeçalho da sidebar, visível sem necessidade de scroll.

---

#### RP-04 — Busca

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Busca.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Campo de texto para filtrar desafios por nome em tempo real.

##### Regras de Negócio
- **Filtro por nome:** A busca deve filtrar os desafios cujo nome contenha o texto digitado (case-insensitive).
- **Reset de paginação:** Ao digitar no campo de busca, a paginação deve retornar para a primeira página.

##### Regras de Experiência

- **Feedback:** Exibir placeholder sugestivo no campo, como "Buscar desafios...".

---

#### RP-05 — Filtros

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Filtros.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O usuário pode filtrar a lista de desafios por status de completude, nível de dificuldade e tags, combinando múltiplos filtros simultaneamente.

##### Regras de Negócio
- **Encapsulamento:** Todos os filtros devem estar agrupados em um único botão/popover de filtro.
- **Filtro por status de completude:** Opções: "Completado" e "Não completado". Apenas visível para usuários autenticados.
- **Filtro por dificuldade:** Opções: "Fácil", "Médio" e "Difícil". Seleção múltipla permitida.
- **Filtro por tags:** Seleção múltipla de tags disponíveis no sistema.
- **Lógica de combinação:** Todos os filtros ativos são combinados com lógica AND.
- **Reset de paginação:** Ao aplicar ou remover filtros, a paginação deve retornar para a primeira página.
- **Indicador de filtros ativos:** Quando houver filtros aplicados, o botão de filtro deve exibir um badge com a contagem de filtros ativos.

##### Regras de Experiência

- **Feedback:** O popover deve ter um botão explícito para confirmar a aplicação dos filtros e uma opção para limpar todos os filtros de uma vez.

---

#### RP-06 — Navegação Sequencial

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Navegação Sequencial.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Botões para ir ao desafio anterior e ao próximo, seguindo a ordem global de criação dos desafios, independente dos filtros ativos.

##### Regras de Negócio
- **Ordem global:** A navegação segue sempre a ordem de criação dos desafios, ignorando qualquer filtro ativo na sidebar.
- **Botão anterior desabilitado:** Quando o desafio atual for o primeiro da lista global.
- **Botão próximo desabilitado:** Quando o desafio atual for o último da lista global.
- **Navegação com dirty state:** Se o usuário possuir código não salvo, o sistema deve exibir um modal de confirmação antes de navegar.

##### Regras de Experiência

- **Feedback:** Os botões devem ter tooltip explicando que a navegação segue a ordem global e ignora filtros.

---

#### RP-07 — Desafio Aleatório

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Desafio Aleatório.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Botão para navegar para um desafio escolhido aleatoriamente dentre todos os desafios disponíveis.

##### Regras de Negócio
- **Seleção absoluta:** O desafio é escolhido aleatoriamente dentre todos os desafios disponíveis, ignorando filtros ativos.
- **Navegação com dirty state:** Se o usuário possuir código não salvo, o sistema deve exibir um modal de confirmação antes de navegar.

##### Regras de Experiência

- 🚧 Em construção — regra de experiência não explicitada no documento legado.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuário (User Flow)

#### JN-01 — rincipal — Navegar para outro desafio pela sidebar:

1. O usuário está na página de execução de um desafio.
2. O usuário clica no botão/aba de navegação de desafios.
3. A sidebar abre com a lista de desafios carregada.
4. O usuário opcionalmente busca por nome ou aplica filtros.
5. O usuário clica em um desafio da lista.
6. O sistema verifica se há dirty state (código não salvo):
   - **Sem dirty state:** Navega diretamente para o desafio selecionado.
   - **Com dirty state:** Exibe modal de confirmação. Se confirmado, navega. Se cancelado, permanece no desafio atual com a sidebar ainda aberta.

---

#### JN-02 — lternativo — Navegar via botões sequenciais ou aleatório:

1. O usuário está na página de execução de um desafio (sidebar aberta ou fechada).
2. O usuário clica em "Próximo", "Anterior" ou "Aleatório".
3. O sistema verifica dirty state e segue o mesmo fluxo de confirmação descrito acima.
4. O sistema navega para o desafio correspondente.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Edição ou exclusão de desafios pela sidebar. |
| Escopo | Filtro por linguagem de programação. |
| Escopo | Ordenação customizada da lista (ex: por dificuldade, por nome). |
| Escopo | Marcação de desafios como favoritos pela sidebar. |
| Escopo | Exibição de detalhes do desafio (preview de descrição) ao passar o mouse. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
