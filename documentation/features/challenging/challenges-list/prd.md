# PRD — Listagem de Desafios

---

### 1. Visão Geral

A **Listagem de Desafios** é a página central do módulo Challenging que permite
aos usuários explorar, filtrar e acessar desafios de programação disponíveis na
plataforma StarDust.

**Problema que resolve:** Sem um ponto de acesso organizado, os usuários não
teriam como descobrir, buscar ou filtrar os desafios de código disponíveis para
prática — ficando limitados apenas à trilha principal de aprendizado (planetas e
estrelas).

**Objetivo principal:** Oferecer uma interface de navegação eficiente para que
os usuários encontrem desafios relevantes ao seu nível e interesse, promovendo a
prática deliberada de programação fora da trilha obrigatória.

**Valor entregue:**

- Autonomia para o usuário escolher o que praticar.
- Filtragem por múltiplos critérios (dificuldade, status, categorias, título).
- URL compartilhável com estado dos filtros preservado.
- Paginação infinita para navegação fluida.

---

### 2. Requisitos

#### REQ-01 Listagem Paginada de Desafios

- [x] **Listagem Paginada de Desafios**

**Descrição:** O sistema deve exibir os desafios de programação disponíveis em
uma lista paginada com scroll infinito.

##### Regras de Negócio

- **Paginação:** A lista carrega 20 desafios por página. Novas páginas são
  carregadas sob demanda quando o usuário clica em "Mostrar mais".
- **Ordenação padrão:** Os desafios são ordenados por nível de dificuldade
  crescente (fácil → médio → difícil).
- **Visibilidade de desafios públicos:** Apenas desafios marcados como públicos
  são exibidos para usuários comuns.
- **Visibilidade para administradores (God):** Usuários com permissão `god`
  visualizam também desafios privados e desafios vinculados a estrelas (star
  challenges).
- **Desafios do autor:** Desafios criados pelo próprio autor são sempre
  visíveis para ele, independentemente do status de publicação.
- **Revalidação:** A lista é automaticamente revalidada quando o usuário
  retorna à aba/janela (refetch on focus).

##### Regras de UI/UX

- **Card do desafio:** Cada desafio é exibido como um card contendo:
  - Badge de dificuldade com cor correspondente (verde = fácil, amarelo =
    médio, vermelho = difícil).
  - Título do desafio como link para a página do desafio.
  - Informações complementares: ícone de status de conclusão, taxa de
    aceitação (upvotes/total de votos), número de conclusões e link para o
    perfil do autor.
  - Lista de categorias como chips.
- **Animação de entrada:** Cada card entra com animação de escala e opacidade
  (framer-motion) com delay progressivo baseado na posição.
- **Estado de carregamento:** Exibe 4 skeletons com animação pulse durante o
  carregamento.
- **Estado vazio:** Exibe a mensagem "Nenhum desafio encontrado" quando não há
  resultados.
- **Botão "Mostrar mais":** Exibido ao final da lista enquanto houver mais
  páginas. Oculto quando todos os itens foram carregados.

---

#### REQ-02 Filtro por Título

- [x] **Filtro por Título**

**Descrição:** O usuário pode buscar desafios digitando parte do título em um
campo de busca.

##### Regras de Negócio

- **Busca parcial:** A busca é feita por substring (contém), case-insensitive.
- **Sincronização com URL:** O termo de busca é persistido no query parameter
  `title`, permitindo compartilhamento da busca via URL.
- **Reatividade:** A lista é automaticamente atualizada quando o valor do
  filtro muda.

##### Regras de UI/UX

- **Campo de busca:** Input com ícone de lupa, posicionado acima da lista.
- **Debounce:** O campo aplica debounce de 200ms para evitar requisições
  excessivas durante a digitação.

---

#### REQ-03 Filtro por Nível de Dificuldade

- [x] **Filtro por Nível de Dificuldade**

**Descrição:** O usuário pode filtrar desafios por nível de dificuldade.

##### Regras de Negócio

- **Opções disponíveis:** Todos (padrão), Fácil, Médio, Difícil.
- **Seleção única:** Apenas um nível pode estar ativo por vez.
- **Sincronização com URL:** O valor é persistido no query parameter
  `difficultyLevel`.
- **Valor padrão:** `all` (exibe todos os níveis).

##### Regras de UI/UX

- **Componente:** Select dropdown com label colorido por nível:
  - Todos: cinza.
  - Fácil: verde.
  - Médio: amarelo.
  - Difícil: vermelho.
- **Tag visual:** Ao selecionar um nível diferente de "Todos", uma tag com o
  nome do nível aparece na área de filtros ativos. Clicar no "x" da tag
  reseta o filtro para "Todos".

---

#### REQ-04 Filtro por Status de Conclusão

- [x] **Filtro por Status de Conclusão**

**Descrição:** Usuários autenticados podem filtrar desafios pelo status de
conclusão pessoal.

##### Regras de Negócio

- **Opções disponíveis:** Todos (padrão), Resolvido, Não Resolvido.
- **Seleção única:** Apenas um status pode estar ativo por vez.
- **Sincronização com URL:** O valor é persistido no query parameter `status`.
- **Valor padrão:** `all` (exibe todos).
- **Lógica de filtragem:** O backend cruza os IDs dos desafios com a lista de
  desafios completados pelo usuário para determinar o status.
- **Restrição de acesso:** Este filtro só é exibido para usuários autenticados.

##### Regras de UI/UX

- **Componente:** Select dropdown com ícones por status:
  - Todos: ícone traço (cinza).
  - Resolvido: ícone check (verde).
  - Não Resolvido: ícone unchecked (vermelho).
- **Tag visual:** Mesmo comportamento do filtro de dificuldade — tag na área
  de filtros ativos com opção de remoção.
- **Visibilidade condicional:** O dropdown só aparece quando o usuário está
  autenticado.

---

#### REQ-05 Filtro por Categorias

- [x] **Filtro por Categorias**

**Descrição:** O usuário pode filtrar desafios por uma ou mais categorias
temáticas.

##### Regras de Negócio

- **Seleção múltipla:** O usuário pode selecionar várias categorias
  simultaneamente.
- **Carregamento SSR:** As categorias disponíveis são carregadas no servidor
  (Server Component) e passadas como props à página.
- **Sincronização com URL:** Os IDs das categorias selecionadas são persistidos
  no query parameter `categoriesIds` como lista separada por vírgula.
- **Lógica de filtragem:** Desafios que pertencem a qualquer uma das categorias
  selecionadas são exibidos (lógica OR).

##### Regras de UI/UX

- **Componente:** Dropdown com busca interna (campo de pesquisa dentro do
  dropdown) e itens clicáveis (checkbox visual) para cada categoria.
- **Tags visuais:** Cada categoria selecionada gera uma tag na área de filtros
  ativos. Clicar no "x" remove a categoria da seleção.

---

#### REQ-06 Tags de Filtros Ativos

- [x] **Tags de Filtros Ativos**

**Descrição:** Todos os filtros ativos (exceto "Todos") são exibidos como tags
visuais removíveis, proporcionando visibilidade sobre quais filtros estão
aplicados.

##### Regras de Negócio

- **Adição automática:** Tags são criadas automaticamente ao selecionar
  filtros.
- **Remoção por tipo:** Ao remover uma tag:
  - Tags de dificuldade resetam `difficultyLevel` para `all`.
  - Tags de status resetam `completionStatus` para `all`.
  - Tags de categorias removem o ID correspondente do array
    `categoriesIds`.
- **Substituição:** Se o usuário muda o valor de um filtro de seleção única
  (dificuldade ou status), a tag anterior é substituída pela nova.

##### Regras de UI/UX

- **Animação:** Tags entram e saem com animação slide-down/slide-up
  (framer-motion `AnimatePresence`).
- **Layout:** Exibidas em linha abaixo dos filtros, com o nome do filtro e um
  botão "x" para remoção.

---

#### REQ-07 Mensagem de Aviso de Pré-requisito

- [x] **Mensagem de Aviso de Pré-requisito**

**Descrição:** Exibe uma mensagem informativa para usuários que ainda não
completaram todos os planetas da trilha principal.

##### Regras de Negócio

- **Condição de exibição:** Exibida quando `user.hasCompletedSpace` é `false`.
- **Natureza informativa:** O aviso NÃO bloqueia o acesso aos desafios. É
  apenas uma recomendação.
- **Visibilidade:** Exibido apenas para usuários autenticados (o componente
  retorna `null` se não houver usuário logado).

##### Regras de UI/UX

- **Texto:** "É recomendado que você complete todos os planetas antes de
  prosseguir para fazer desafios de código."
- **Estilo:** Parágrafo com borda tracejada amarela e texto amarelo, dentro de
  um container arredondado com padding.

---

#### REQ-08 Navegação Contextual (Back Link)

- [x] **Navegação Contextual (Back Link)**

**Descrição:** Exibe um link de navegação no topo da página cujo comportamento
varia conforme o estado de autenticação.

##### Regras de Negócio

- **Usuário autenticado:** Exibe um ícone de seta para a esquerda que
  redireciona para a página do espaço (`/space`).
- **Usuário não autenticado:** Exibe um link estilizado com a mensagem
  "Acessar a sua conta", redirecionando para a página de login.

##### Regras de UI/UX

- **Autenticado:** Ícone `arrow-left` em verde.
- **Não autenticado:** Link com borda estilizada (`StarBorder`), texto verde,
  alinhado à direita.

---

#### REQ-09 Link para Criação de Desafios

- [x] **Link para Criação de Desafios**

**Descrição:** Usuários com permissão de engenheiro podem acessar a criação de
novos desafios diretamente da página de listagem.

##### Regras de Negócio

- **Condição de exibição:** Exibido apenas quando `user.hasEngineerRole` é
  `true`.
- **Destino:** Redireciona para a página de criação/edição de desafios.

##### Regras de UI/UX

- **Texto:** "Criar seu próprio desafio para outros usuários".
- **Estilo:** Link com borda estilizada (`StarBorder`), ícone de seta à
  direita, texto verde, alinhado à direita.

---

#### REQ-10 Edição de Desafios (Administradores)

- [x] **Edição de Desafios (Administradores)**

**Descrição:** Usuários com permissão `god` podem acessar a edição de qualquer
desafio diretamente a partir do card na listagem.

##### Regras de Negócio

- **Condição de exibição:** Ícone de edição visível apenas para usuários `god`.
- **Destino:** Redireciona para a página de edição do desafio correspondente
  (`/challenging/challenge/{slug}`).

##### Regras de UI/UX

- **Componente:** Ícone de edição exibido no canto do card do desafio.

---

### 3. Fluxo de Usuário (User Flow)

**Explorar desafios disponíveis:**

1. O usuário acessa a rota `/challenging/challenges`.
2. O sistema carrega as categorias no servidor (SSR) e renderiza a página.
3. A lista de desafios é carregada client-side via REST com os filtros padrão
   (todos os níveis, todos os status, sem categoria específica).
4. O usuário visualiza os primeiros 20 desafios ordenados por dificuldade
   crescente.

**Filtrar desafios:**

1. O usuário seleciona um nível de dificuldade no dropdown (ex: "Médio").
2. Uma tag "Médio" aparece na área de filtros ativos.
3. A lista é automaticamente recarregada, exibindo apenas desafios de
   dificuldade média.
4. O usuário adiciona uma categoria (ex: "Laços") no dropdown de categorias.
5. Uma tag "Laços" aparece ao lado da tag "Médio".
6. A lista é refinada para desafios médios da categoria "Laços".
7. O usuário digita "fibonacci" no campo de busca.
8. A lista é refinada para desafios médios, da categoria "Laços", cujo título
   contenha "fibonacci".

**Remover filtro ativo:**

1. O usuário clica no "x" da tag "Médio".
2. A tag é removida com animação e o filtro de dificuldade volta para "Todos".
3. A lista é recarregada sem o filtro de dificuldade, mantendo os demais
   filtros.

**Carregar mais desafios:**

1. O usuário rola até o final da lista e clica em "Mostrar mais".
2. O sistema carrega os próximos 20 desafios e os adiciona à lista.
3. Quando não há mais desafios, o botão "Mostrar mais" desaparece.

**Acessar um desafio:**

1. O usuário clica no título de um desafio.
2. O sistema redireciona para a página do desafio
   (`/challenging/challenges/{slug}/challenge`).

**Usuário não autenticado:**

1. O usuário acessa `/challenging/challenges` sem estar logado.
2. O filtro de status de conclusão não é exibido.
3. Um link "Acessar a sua conta" é exibido no topo da página.
4. O usuário pode navegar e filtrar desafios normalmente, mas sem filtro de
   conclusão.

---

### 4. Fora do Escopo (Out of Scope)

- Filtros de ordenação na UI (por data de publicação, upvotes, número de
  conclusões) — os parâmetros existem no backend, mas foram intencionalmente
  omitidos da interface.
- Busca full-text avançada (fuzzy search, stemming).
- Filtro por autor do desafio.
- Sistema de favoritos/bookmarks de desafios.
- Modo de visualização alternativo (grid).
- Filtro por linguagem de programação.
- Recomendação inteligente de desafios baseada no perfil do usuário.

---
