# PRD — Editor de História de Lição: Aba de Blocos de Texto

- **Módulo:** `lesson`
- **Milestone:** [#19 — Editor de História de Lição: Aba de Blocos de Texto](https://github.com/JohnPetros/stardust/milestone/19)
- **Status:** open
- **Atualizado em:** 2026-03-22T01:10:18Z

## Definição do produto

### 1. Visão Geral

O editor de história do Studio atualmente usa um campo de texto puro com delimitador `----` para separar os blocos narrativos de uma lição. Isso é frágil, sem feedback visual e difícil de manter. Esta feature substitui essa abordagem por um editor de blocos visual, onde cada bloco da história é uma unidade editável com tipo, conteúdo e mídias associadas. A aba de blocos de texto é a primeira de duas abas do novo editor de história e é responsável por toda a criação e edição dos blocos que compõem a narrativa da lição no Studio.

---

### 2. Requisitos

#### [ ] Carregar contexto da história da estrela

**Descrição:** O editor deve abrir a história da estrela selecionada no Studio e apresentar o contexto mínimo para edição.

##### Regras de Negócio

- **Identificação da estrela:** O sistema deve localizar a estrela a partir do `slug` informado na rota do editor.
- **Carga inicial dos blocos:** O sistema deve buscar os blocos atualmente cadastrados para a estrela antes de liberar a edição.
- **Contexto visível da estrela:** O sistema deve exibir o nome e o número da estrela em edição.
- **Permissão de edição:** A visualização exige autenticação no Studio e a persistência exige permissão administrativa.

##### Regras de UI/UX

- **Entrada no editor:** O usuário acessa o editor a partir da ação de história da estrela dentro da gestão do espaço.
- **Feedback de carregamento:** Exibir estado de loading enquanto os blocos são carregados.
- **Compatibilidade:** O fluxo deve funcionar no ambiente administrativo web suportado pelo Studio.

---

#### [ ] Listagem e gerenciamento de blocos

**Descrição:** Exibir os blocos da história em uma lista editável, permitindo criar, reordenar e remover blocos.

##### Regras de Negócio

- **Tipos de bloco suportados:** `default`, `user`, `alert`, `quote`, `code`.
- **Reordenação:** O admin deve poder reordenar os blocos via drag-and-drop.
- **Remoção:** Cada bloco pode ser removido individualmente.
- **Adição:** O admin pode adicionar um novo bloco escolhendo o tipo antes da criação. Cada bloco inserido deve entrar com conteúdo inicial editável para orientar o preenchimento.
- **Persistência:** Ao salvar, o array de blocos substitui o campo `story` (string) da lição.
- **Habilitação de salvamento:** O sistema deve permitir salvar apenas quando houver conteúdo preenchido e alguma alteração em relação ao estado carregado.
- **Reset de estado de ação:** Ao editar após sucesso ou erro, o sistema deve limpar o estado anterior da ação de salvar.

##### Regras de UI/UX

- **Lista de blocos:** Cada bloco é exibido como um card colapsado com handle de drag, badge de tipo, preview truncado do conteúdo e indicadores de mídia.
- **Indicador de imagem:** Quando o bloco tem `picture` definida, exibir thumbnail circular com ícone de avatar no card colapsado.
- **Indicador de áudio:** Quando o bloco tem `audio` definido, exibir barrinhas de onda sonora sutis no card colapsado.
- **Bloco expandido:** Ao clicar no card, ele expande inline revelando os campos de edição — sem painel lateral separado.
- **Seletor de tipo:** Ao adicionar bloco, exibir seletor de tipo antes de criar o card.
- **Resposta imediata:** A inserção do bloco deve ocorrer imediatamente após a ação do operador.

---

#### [ ] Edição de bloco por tipo

**Descrição:** Cada tipo de bloco expõe campos de edição específicos ao ser expandido.

##### Regras de Negócio

- **Bloco `user`:** Apenas campo de conteúdo (texto). Sem picture, sem áudio.
- **Bloco `code`:** Campo de conteúdo (código) e toggle `isRunnable`. Sem picture, sem áudio.
- **Blocos `default`, `alert`, `quote`:** Campo de conteúdo, seletor de picture e seletor de áudio.

##### Regras de UI/UX

- **Textarea de conteúdo:** Redimensionável verticalmente, com altura mínima adequada para leitura.
- **Textarea de código:** Fonte monospace, altura mínima maior que os demais.
- **Toggle `isRunnable`:** Exibido apenas em blocos `code`.
- **Seletores de mídia:** Picture e áudio lado a lado, com estado vazio ("Nenhuma" / "Nenhum") e estado preenchido (nome do arquivo + opção de trocar).

---

#### [ ] Seletor de imagem (picture)

**Descrição:** Permitir selecionar ou trocar a imagem associada ao bloco a partir do bucket de imagens do Supabase.

##### Regras de Negócio

- **Fonte:** Assets do bucket de imagens do Supabase.
- **Busca:** O operador deve poder pesquisar imagens pelo nome.
- **Paginação:** O sistema deve permitir carregar mais imagens quando houver mais resultados disponíveis.
- **Upload:** Permitir upload de nova imagem diretamente pelo seletor durante o fluxo de edição.
- **Valor salvo:** URL pública do arquivo no bucket.
- **Remoção:** Permitir remover a imagem do bloco.

##### Regras de UI/UX

- **Abertura:** Clicar no seletor abre um modal dedicado de busca e escolha.
- **Preview da seleção:** O seletor deve mostrar qual imagem está atualmente selecionada no card expandido.
- **Grid de imagens:** Cada imagem exibe thumbnail no grid do modal.
- **Upload no modal:** Botão de upload dentro do modal para adicionar novas imagens ao bucket.
- **Feedback de vazio:** Quando nenhuma imagem for encontrada, informar claramente a ausência de resultados.
- **Estado vazio:** Exibir placeholder sem thumbnail quando nenhuma imagem selecionada.

---

#### [ ] Seletor de áudio

**Descrição:** Permitir selecionar ou trocar o áudio associado ao bloco a partir do bucket de áudios do Supabase.

##### Regras de Negócio

- **Fonte:** Assets do bucket de áudios do Supabase.
- **Busca:** O operador deve poder pesquisar áudios pelo nome.
- **Paginação:** O sistema deve permitir carregar mais áudios quando houver mais resultados disponíveis.
- **Upload:** Permitir upload de novo áudio diretamente pelo seletor durante o fluxo de edição.
- **Valor salvo:** URL pública do arquivo no bucket.
- **Remoção:** Permitir remover o áudio do bloco.

##### Regras de UI/UX

- **Abertura:** Clicar no seletor abre um modal com lista de áudios disponíveis.
- **Player inline:** Cada áudio exibe player inline no modal para ouvir antes de selecionar.
- **Upload no modal:** Botão de upload dentro do modal para adicionar novos áudios ao bucket.
- **Feedback de vazio:** Quando nenhum áudio for encontrado, informar claramente a ausência de resultados.
- **Estado vazio:** Exibir placeholder sem ícone ativo quando nenhum áudio selecionado.

---

#### [ ] Preview MDX em tempo real

**Descrição:** Exibir ao lado da lista de blocos um preview renderizado da história, simulando como os blocos aparecerão na Lesson Page.

##### Regras de Negócio

- **Atualização em tempo real:** O preview deve refletir as alterações nos blocos imediatamente, sem necessidade de salvar.
- **Renderização por tipo:** Cada tipo de bloco é renderizado com visual distinto — balão de diálogo para `default`/`alert`/`quote`, balão invertido para `user`, bloco de código para `code`.

##### Regras de UI/UX

- **Layout:** Lista de blocos à esquerda, preview à direita, em duas colunas de largura igual.
- **Avatar no preview:** Blocos com `picture` exibem ícone de avatar; sem picture exibem avatar genérico.
- **Scroll independente:** Lista e preview têm scroll independente.

---

#### [ ] Salvar os blocos da história

**Descrição:** O editor deve persistir o array de blocos da história da estrela quando o operador confirmar a ação.

##### Regras de Negócio

- **Persistência por estrela:** O salvamento deve atualizar os blocos vinculados a uma estrela específica.
- **Atualização explícita:** A persistência deve acontecer apenas quando o operador acionar o comando de salvar.
- **Resposta de sucesso:** Em caso de sucesso, o sistema deve exibir feedback visual de conclusão.
- **Resposta de falha:** Em caso de erro, o sistema deve manter o operador no editor e comunicar a falha.

##### Regras de UI/UX

- **Ação principal visível:** O botão de salvar deve permanecer destacado no cabeçalho da página.
- **Feedback de loading:** O sistema deve indicar quando o salvamento está em andamento.
- **Performance:** O retorno da ação de salvar deve ser percebido de forma imediata, sem ambiguidade sobre o estado da requisição.

---

### 3. Fluxo de Usuário

**Acessar o editor:**

1. O usuário acessa a gestão de estrelas no Studio.
2. O usuário aciona a ação de abrir a história de uma estrela.
3. O sistema valida o identificador da estrela:
   - **Sucesso:** Carrega nome, número e blocos atuais da estrela no editor.
   - **Falha:** Interrompe o acesso ao editor.

**Adicionar e editar blocos:**

1. O usuário clica em "Adicionar bloco" e escolhe o tipo.
2. O sistema cria o card expandido ao final da lista.
3. O usuário preenche o conteúdo e, quando aplicável, seleciona picture e áudio.
4. O preview à direita atualiza em tempo real.

**Reordenar blocos:**

1. O usuário arrasta um bloco pelo handle.
2. O sistema reordena a lista em tempo real.
3. O preview reflete a nova ordem imediatamente.

**Salvar a história:**

1. O usuário aciona o botão de salvar no cabeçalho.
2. O sistema valida a solicitação:
   - **Sucesso:** Persiste os blocos da estrela e exibe feedback de sucesso.
   - **Falha:** Mantém o usuário no editor e exibe feedback de erro.

---

### 4. Fora do Escopo

- Aba de vídeo e sincronização de markers.
- Campo de marker por bloco.
- Migração dos dados existentes de `story` (string) para array de blocos — tratado em spec separada.
- Suporte a novos tipos de bloco além dos cinco existentes (`default`, `user`, `alert`, `quote`, `code`).
- Edição das questões da lição no mesmo fluxo.
- Gestão de metadados da estrela (nome, número, disponibilidade).
- Workflow editorial de aprovação, publicação agendada ou controle de versões.
- Colaboração simultânea entre múltiplos operadores.
- Alterações na Lesson Page fora da manutenção do conteúdo narrativo.

---

Os pontos incorporados do PRD antigo foram: busca por nome e paginação nos seletores de mídia, regra de habilitação do botão salvar com base em alteração, reset de estado após ação, feedback de vazio nos modais e o fluxo de acesso pelo contexto de gestão de estrelas.

Quer gerar o arquivo agora ou revisar mais alguma coisa antes?
