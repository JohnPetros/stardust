# PRD — Notas do Usuário

- **Módulo:** `profile`
- **Milestone:** [#30 — Notas do Usuário](https://github.com/JohnPetros/stardust/milestone/30)
- **Status:** open
- **Atualizado em:** 2026-05-11T17:08:31Z

## Definição do produto

### 1. Visão Geral

**Notas do Usuário** é uma funcionalidade que permite ao aluno criar, editar e rever anotações pessoais de texto rico enquanto navega pela plataforma — durante uma lição, um desafio, ou em qualquer outra tela.

**Problema que resolve:** O aluno aprende conteúdo técnico denso (narrativas, blocos de código, enunciados de desafios) mas não tem onde registrar insights, dúvidas ou sínteses sem sair do contexto de aprendizado. Sem esse espaço, o conhecimento produzido durante a sessão se perde.

**Objetivo principal:** Prover um bloco de notas pessoal e persistente, acessível de qualquer tela da plataforma via botão fixo no layout, com editor de texto WYSIWYG leve e página dedicada para revisão e gerenciamento das notas.

**Valor entregue:** Redução da fricção entre aprender e registrar; aumento da retenção do aluno via revisão ativa; e um motivo concreto para retornar à plataforma (rever as próprias notas).

---

### 2. Requisitos

#### Criar Nota

- [ ] **Criar Nota**

**Descrição:** O usuário pode criar uma nova nota com título e corpo, a partir do painel de notas acessível em qualquer tela da plataforma.

##### Regras de Negócio

- **Título obrigatório:** A nota só pode ser salva se o título estiver preenchido com pelo menos 1 caractere.
- **Corpo opcional no momento da criação:** O corpo pode estar vazio ao salvar; o usuário pode completar depois.
- **Autenticação obrigatória:** Apenas usuários autenticados podem criar notas.
- **Sem limite de notas:** Não há limite de quantidade de notas por usuário nesta versão.
- **Persistência imediata:** A nota é salva no servidor ao confirmar, não existe rascunho local.

##### Regras de UI/UX

- **Editor de corpo:** Utilizar um editor WYSIWYG leve (Tiptap ou similar), com suporte a formatação essencial: negrito, itálico, código inline, bloco de código e listas. O corpo é persistido em Markdown. Não há tab de preview separada — o que o usuário vê enquanto digita é o resultado final.
- **Feedback de salvamento:** Exibir indicador de loading durante o salvamento e toast de sucesso ou erro ao concluir.
- **Acessibilidade:** Campo de título e editor de corpo devem ser navegáveis por teclado; o botão de salvar deve ter `aria-label` explícito.
- **Responsividade:** O painel de criação deve funcionar em mobile e desktop; em mobile, o editor ocupa tela cheia dentro do drawer.

---

#### Listar Notas

- [ ] **Listar Notas**

**Descrição:** O usuário visualiza todas as suas notas na página dedicada `/notes`, ordenadas da mais recente para a mais antiga.

##### Regras de Negócio

- **Escopo pessoal:** Cada usuário vê apenas as próprias notas; notas são privadas e nunca compartilhadas.
- **Ordenação padrão:** Notas ordenadas por `updated_at` decrescente (mais recentes no topo).
- **Autenticação obrigatória:** Usuários não autenticados são redirecionados para a tela de login ao tentar acessar `/notes`.

##### Regras de UI/UX

- **Estado vazio:** Quando o usuário não possui nenhuma nota, exibir mensagem amigável com CTA para criar a primeira nota.
- **Card de nota:** Cada nota na lista exibe título, preview truncado do corpo (máximo 120 caracteres) e data de última atualização formatada.
- **Loading:** Exibir skeletons enquanto as notas carregam, sem spinner central.
- **Responsividade:** Lista deve funcionar em coluna única no mobile e em grid ou lista no desktop.

---

#### Editar Nota

- [ ] **Editar Nota**

**Descrição:** O usuário pode editar título e corpo de uma nota existente, tanto pelo painel flutuante quanto pela página `/notes`.

##### Regras de Negócio

- **Título obrigatório:** As mesmas restrições da criação se aplicam à edição.
- **Atualização de `updated_at`:** Toda edição salva deve atualizar o timestamp da nota.
- **Sem histórico de versões:** Apenas o estado atual da nota é mantido; versões anteriores não são preservadas nesta versão.
- **Apenas o autor edita:** O usuário só pode editar as próprias notas.

##### Regras de UI/UX

- **Edição inline ou em painel:** Ao clicar em uma nota na lista, o usuário entra no modo de edição no mesmo painel/tela, sem navegação adicional.
- **Botão de salvar explícito:** A edição não é salva automaticamente; o usuário confirma clicando em "Salvar".
- **Indicação de alterações não salvas:** Se o usuário tentar fechar o painel com edições não salvas, exibir confirmação antes de descartar.
- **Feedback de salvamento:** Toast de sucesso ou erro ao concluir.

---

#### Excluir Nota

- [ ] **Excluir Nota**

**Descrição:** O usuário pode excluir uma nota existente, tanto pelo painel flutuante quanto pela página `/notes`.

##### Regras de Negócio

- **Exclusão permanente:** A nota é removida permanentemente do banco; não há lixeira nem desfazer.
- **Apenas o autor exclui:** O usuário só pode excluir as próprias notas.
- **Confirmação obrigatória:** A exclusão exige uma confirmação explícita do usuário antes de ser executada.

##### Regras de UI/UX

- **Diálogo de confirmação:** Exibir `AlertDialog` com título, descrição do risco e botões "Cancelar" e "Excluir" (destrutivo).
- **Feedback de exclusão:** Toast de sucesso ou erro ao concluir; a nota desaparece da lista imediatamente após confirmação (otimismo com rollback em caso de falha).

---

#### Acesso Global pelo Layout

- [ ] **Acesso Global pelo Layout**

**Descrição:** Um botão fixo no layout principal da `web` abre um drawer de notas, disponível em qualquer tela da plataforma (lição, desafio, espaço, etc.), sem redirecionar o usuário.

##### Regras de Negócio

- **Visibilidade:** O botão é exibido apenas para usuários autenticados.
- **Contexto preservado:** Abrir e fechar o drawer não altera a rota nem o estado da tela atual.
- **Funcionalidade completa no drawer:** O usuário consegue criar, listar, editar e excluir notas diretamente pelo drawer, sem precisar navegar até `/notes`.

##### Regras de UI/UX

- **Posição do botão:** Ícone fixo na barra de navegação global da `web` (header ou nav lateral), com tooltip "Notas" e `aria-label` explícito.
- **Drawer:** Abre como painel lateral (direito) usando o componente `Drawer` (`vaul`) já adotado na plataforma. Fecha por overlay, botão dedicado ou tecla `Esc`.
- **Largura do drawer:** Largura fixa em desktop; tela cheia em mobile.
- **Estado 1 — criar nota (padrão ao abrir):** O drawer exibe diretamente o formulário de nova nota com campo de título, toolbar de formatação e editor de corpo. Um botão "Ver notas" no cabeçalho abre o estado 2.
- **Estado 2 — listagem de notas (modal):** Ao clicar em "Ver notas", um modal centralizado é exibido sobre o drawer com a lista de notas existentes. Cada item exibe título, preview truncado e data relativa. O botão "Nova nota" no cabeçalho do modal fecha-o e retorna ao estado 1. O "X" fecha o modal sem alterar o estado do drawer.
- **Retorno ao formulário após salvar ou cancelar:** Ao concluir ou cancelar a criação no drawer, o estado retorna ao formulário de nova nota (estado 1).
- **Responsividade:** O botão permanece visível e acessível em mobile e desktop.

---

#### Página Dedicada de Notas (`/notes`)

- [ ] **Página Dedicada de Notas**

**Descrição:** Página dedicada para o usuário gerenciar todas as suas notas, acessível pelo link no drawer ou pela navegação principal.

##### Regras de Negócio

- **Acesso autenticado:** Redirecionar para login se o usuário não estiver autenticado.
- **Mesmas operações do drawer:** Criar, editar e excluir notas disponíveis na página.

##### Regras de UI/UX

- **Layout duas colunas (desktop):** Sidebar esquerda retrátil com a lista de notas; coluna direita ocupa o restante com o editor da nota selecionada.
- **Sidebar expandida:** Exibe título "Minhas notas", botão `+` para nova nota e botão de recolher no cabeçalho. Cada card exibe título, preview truncado do corpo e data relativa. A nota ativa fica destacada visualmente.
- **Sidebar recolhida:** A sidebar colapsa para uma coluna estreita (~44px) exibindo apenas ícones de expandir e nova nota no topo, seguidos de miniaturas quadradas representando cada nota (com tooltip do título ao hover). O editor permanece visível ocupando o restante da tela.
- **Editor da nota selecionada:** Cabeçalho com campo de título inline editável, botão "Excluir" (destrutivo) e botão "Salvar" posicionados à direita do título. Abaixo, toolbar de formatação (negrito, itálico, código inline, bloco de código, listas). Corpo ocupa o restante da altura disponível. Footer exibe timestamp de última edição.
- **Estado vazio do editor:** Quando nenhuma nota está selecionada (ex: lista vazia ou após exclusão), a coluna direita exibe mensagem amigável com CTA para criar a primeira nota.
- **Responsividade:** Em mobile, layout de coluna única — a lista ocupa a tela inteira; ao selecionar uma nota, o editor ocupa a tela inteira com botão de voltar à lista.
- **Acessibilidade:** Navegação por teclado entre os cards da lista e dentro do editor; botões de ação com `aria-label` explícitos.

---

### 3. Fluxo de Usuário (User Flow)

**Criar uma nota durante a lição ou desafio:**

1. O usuário está em qualquer tela da plataforma (lição, desafio, espaço).
2. O usuário clica no ícone de notas fixo no layout.
3. O drawer de notas abre diretamente no formulário de nova nota, com campo de título e editor MDX do corpo.
4. O usuário preenche o título e (opcionalmente) o corpo.
5. O usuário clica em "Salvar".
6. O sistema valida o título:
   - **Sucesso:** Nota é salva, toast de sucesso é exibido, painel retorna para a lista com a nova nota no topo.
   - **Falha (título vazio):** Campo de título é destacado com mensagem de validação; nenhuma requisição é enviada.
   - **Falha (erro de servidor):** Toast de erro é exibido; o formulário permanece aberto para nova tentativa.

**Editar uma nota existente:**

1. O usuário abre o drawer de notas ou acessa `/notes`.
2. O usuário clica em uma nota da lista.
3. O painel exibe o formulário com título e corpo preenchidos.
4. O usuário edita os campos desejados.
5. O usuário clica em "Salvar".
6. O sistema valida e persiste:
   - **Sucesso:** Toast de sucesso; a nota atualizada sobe para o topo da lista.
   - **Falha:** Toast de erro; o formulário permanece aberto.

**Excluir uma nota:**

1. O usuário localiza a nota na lista (drawer ou `/notes`).
2. O usuário clica no ícone de exclusão da nota.
3. O sistema exibe o `AlertDialog` de confirmação.
4. O usuário confirma a exclusão:
   - **Confirmado:** Nota é removida da lista imediatamente (otimismo); toast de sucesso. Em caso de falha no servidor, a nota retorna e toast de erro é exibido.
   - **Cancelado:** Diálogo fecha; nenhuma ação é tomada.

**Revisar notas pela página `/notes`:**

1. O usuário acessa `/notes` pelo link no drawer ou pela navegação principal.
2. O sistema valida autenticação:
   - **Autenticado:** Carrega e exibe a lista de notas com skeletons durante o fetch.
   - **Não autenticado:** Redireciona para a tela de login.
3. O usuário seleciona uma nota para editar ou usa o botão de nova nota.

---

### 4. Fora do Escopo (Out of Scope)

- Compartilhamento de notas entre usuários.
- Histórico de versões ou desfazer edições.
- Busca ou filtro de notas por texto.
- Organização de notas em pastas, tags ou categorias.
- Vinculação de uma nota a uma estrela, desafio ou questão específica.
- Exportação de notas (PDF, Markdown, etc.).
- Notas para usuários não autenticados (rascunho local).
- Limite de tamanho do corpo da nota nesta versão.
- Acesso administrativo às notas dos usuários no Studio.
