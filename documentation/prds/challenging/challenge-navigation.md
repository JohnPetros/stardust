# PRD — Navegação de Desafios

- **Módulo:** `challenging`
- **Milestone:** [#16 — Navegação de Desafios](https://github.com/JohnPetros/stardust/milestone/16)
- **Status:** open
- **Atualizado em:** 2026-04-07T19:14:22Z

## Definição do produto

### 1. Visão Geral

- **O que é:** Uma sidebar lateral acessível a partir da página de execução de um desafio, que permite ao usuário explorar, filtrar e navegar entre todos os desafios disponíveis na plataforma Stardust.
- **Problema que resolve:** O usuário precisa sair da página atual para encontrar o próximo desafio que deseja resolver, gerando atrito desnecessário na navegação.
- **Objetivo e valor:** Reduzir o atrito na troca de desafios e reforçar o senso de progresso, exibindo para usuários autenticados quantos desafios já foram concluídos.

---

### 2. Requisitos

_Liste as funcionalidades. Use IDs curtos (`REQ-01`, `REQ-02`...) para
permitir rastreabilidade com issues e tickets. Use checkboxes para acompanhamento._

#### REQ-01 Abertura da Sidebar

- [x] **Abertura da Sidebar**

**Descrição:** O usuário acessa a sidebar de navegação de desafios a partir de um botão/aba na interface da página de desafio.

##### Regras de Negócio

- **Abertura via aba de navegação:** Deve existir um botão ou aba dedicada na interface da página de desafio que, ao ser clicada, abre a sidebar.
- **Comportamento de sobreposição:** A sidebar abre sobreposta ao conteúdo da página, sem redirecionar o usuário.

##### Regras de UI/UX (se houver)

- **Overlay:** Ao abrir a sidebar, deve ser exibido um overlay escurecido sobre o restante da página.
- **Feedback:** A sidebar pode ser fechada clicando no overlay, em um botão de fechar explícito, ou pressionando a tecla `Esc`.

---

#### REQ-02 Listagem de Desafios

- [x] **Listagem de Desafios**

**Descrição:** A sidebar exibe a lista de todos os desafios disponíveis, paginada, com as informações essenciais de cada item.

##### Regras de Negócio

- **Colunas obrigatórias:** Cada linha deve exibir: status de completude (ícone), nome do desafio e nível de dificuldade.
- **Paginação:** Exibir 20 desafios por página.
- **Indicador de paginação:** Exibir no formato "Exibindo X - Y" com botões de página anterior e próxima.
- **Botões de paginação desabilitados nos extremos:** O botão de página anterior deve ser desabilitado na primeira página; o de próxima, na última.
- **Status de completude:** Apenas exibido para usuários autenticados. Para não autenticados, a coluna de status não deve aparecer.

##### Regras de UI/UX (se houver)

- **Feedback:** Exibir indicador de carregamento enquanto a lista é buscada; exibir mensagem amigável quando nenhum desafio for encontrado com os filtros aplicados.
- **Desafio ativo:** O desafio atualmente aberto deve ser visualmente destacado na lista.

---

#### REQ-03 Progresso do Usuário

- [x] **Progresso do Usuário**

**Descrição:** Para usuários autenticados, exibir o total de desafios concluídos em relação ao total disponível.

##### Regras de Negócio

- **Exibição condicional:** O contador de progresso só é exibido quando o usuário estiver logado.
- **Formato:** Exibir no formato "X/Y Resolvidos", onde X é o número de desafios concluídos e Y é o total disponível.

##### Regras de UI/UX (se houver)

- **Posicionamento:** O contador deve estar no cabeçalho da sidebar, visível sem necessidade de scroll.

---

#### REQ-04 Busca

- [x] **Busca**

**Descrição:** Campo de texto para filtrar desafios por nome em tempo real.

##### Regras de Negócio

- **Filtro por nome:** A busca deve filtrar os desafios cujo nome contenha o texto digitado (case-insensitive).
- **Reset de paginação:** Ao digitar no campo de busca, a paginação deve retornar para a primeira página.

##### Regras de UI/UX (se houver)

- **Feedback:** Exibir placeholder sugestivo no campo, como "Buscar desafios...".

---

#### REQ-05 Filtros

- [x] **Filtros**

**Descrição:** O usuário pode filtrar a lista de desafios por status de completude, nível de dificuldade e tags, combinando múltiplos filtros simultaneamente.

##### Regras de Negócio

- **Encapsulamento:** Todos os filtros devem estar agrupados em um único botão/popover de filtro.
- **Filtro por status de completude:** Opções: "Completado" e "Não completado". Apenas visível para usuários autenticados.
- **Filtro por dificuldade:** Opções: "Fácil", "Médio" e "Difícil". Seleção múltipla permitida.
- **Filtro por tags:** Seleção múltipla de tags disponíveis no sistema.
- **Lógica de combinação:** Todos os filtros ativos são combinados com lógica AND.
- **Reset de paginação:** Ao aplicar ou remover filtros, a paginação deve retornar para a primeira página.
- **Indicador de filtros ativos:** Quando houver filtros aplicados, o botão de filtro deve exibir um badge com a contagem de filtros ativos.

##### Regras de UI/UX (se houver)

- **Feedback:** O popover deve ter um botão explícito para confirmar a aplicação dos filtros e uma opção para limpar todos os filtros de uma vez.

---

#### REQ-06 Navegação Sequencial

- [x] **Navegação Sequencial**

**Descrição:** Botões para ir ao desafio anterior e ao próximo, seguindo a ordem global de criação dos desafios, independente dos filtros ativos.

##### Regras de Negócio

- **Ordem global:** A navegação segue sempre a ordem de criação dos desafios, ignorando qualquer filtro ativo na sidebar.
- **Botão anterior desabilitado:** Quando o desafio atual for o primeiro da lista global.
- **Botão próximo desabilitado:** Quando o desafio atual for o último da lista global.
- **Navegação com dirty state:** Se o usuário possuir código não salvo, o sistema deve exibir um modal de confirmação antes de navegar.

##### Regras de UI/UX (se houver)

- **Feedback:** Os botões devem ter tooltip explicando que a navegação segue a ordem global e ignora filtros.

---

#### REQ-07 Desafio Aleatório

- [x] **Desafio Aleatório**

**Descrição:** Botão para navegar para um desafio escolhido aleatoriamente dentre todos os desafios disponíveis.

##### Regras de Negócio

- **Seleção absoluta:** O desafio é escolhido aleatoriamente dentre todos os desafios disponíveis, ignorando filtros ativos.
- **Navegação com dirty state:** Se o usuário possuir código não salvo, o sistema deve exibir um modal de confirmação antes de navegar.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo principal — Navegar para outro desafio pela sidebar:**

1. O usuário está na página de execução de um desafio.
2. O usuário clica no botão/aba de navegação de desafios.
3. A sidebar abre com a lista de desafios carregada.
4. O usuário opcionalmente busca por nome ou aplica filtros.
5. O usuário clica em um desafio da lista.
6. O sistema verifica se há dirty state (código não salvo):
   - **Sem dirty state:** Navega diretamente para o desafio selecionado.
   - **Com dirty state:** Exibe modal de confirmação. Se confirmado, navega. Se cancelado, permanece no desafio atual com a sidebar ainda aberta.

---

**Fluxo alternativo — Navegar via botões sequenciais ou aleatório:**

1. O usuário está na página de execução de um desafio (sidebar aberta ou fechada).
2. O usuário clica em "Próximo", "Anterior" ou "Aleatório".
3. O sistema verifica dirty state e segue o mesmo fluxo de confirmação descrito acima.
4. O sistema navega para o desafio correspondente.

---

### 4. Fora do Escopo (Out of Scope)

_O que NÃO faz parte desta versão, para evitar scope creep._

- Edição ou exclusão de desafios pela sidebar.
- Filtro por linguagem de programação.
- Ordenação customizada da lista (ex: por dificuldade, por nome).
- Marcação de desafios como favoritos pela sidebar.
- Exibição de detalhes do desafio (preview de descrição) ao passar o mouse.
