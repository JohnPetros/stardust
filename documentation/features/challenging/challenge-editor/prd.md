# PRD — Editor de Desafios

**Referência de produto:** https://github.com/JohnPetros/stardust/milestone/4

---

### 1. Visão Geral

O Editor de Desafios permite que uma pessoa autenticada crie desafios de
programação e que autores ou administradores autorizados atualizem e excluam
desafios existentes.

A funcionalidade concentra a definição do enunciado, da forma de avaliação,
dos casos de teste, das categorias e da dificuldade. Seu objetivo é garantir
que cada desafio tenha informações suficientes e consistentes para ser
apresentado e avaliado na experiência de resolução.

Novos desafios são privados por padrão. A tela não oferece controle de
publicação, não permite editar manualmente o código inicial e restringe a
edição de desafios existentes ao autor original ou a um administrador com a
permissão aplicável.

---

### 2. Requisitos

#### RF-01 Acessar o editor conforme a permissão do usuário

- [x] **Controlar o acesso à criação e ao gerenciamento de desafios**

**Descrição:** A criação depende de uma conta autenticada. A edição e a
exclusão de um desafio existente ficam disponíveis ao autor original ou a um
administrador autorizado. A existência do desafio não deve ser revelada para
usuários sem permissão.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-01` | Dado um usuário autenticado, quando ele acessa a rota de criação, então o editor é apresentado com um formulário vazio. |
| `CA-02` | Dado o autor de um desafio, quando ele acessa a rota de edição correspondente, então o formulário é preenchido com os dados atuais do desafio. |
| `CA-03` | Dado um administrador autorizado, quando ele acessa o desafio de outro autor, então o editor é apresentado com um aviso de contexto administrativo. |
| `CA-04` | Dado um usuário que não é autor nem administrador autorizado, quando ele tenta acessar a edição, então recebe uma resposta equivalente a conteúdo não encontrado. |
| `CA-05` | Dado um administrador editando um desafio alheio, quando salva as mudanças, então a autoria original é preservada. |

##### Regras de Negócio

- **Autenticação:** Somente uma conta autenticada pode utilizar o editor.
- **Propriedade:** O autor pode editar e excluir o próprio desafio.
- **Administração:** Um usuário com a permissão administrativa aplicável pode
  editar e excluir desafios de terceiros.
- **Mascaramento de acesso:** Tentativas não autorizadas de edição não devem
  revelar a existência do desafio.
- **Preservação da autoria:** A edição administrativa não transfere o desafio
  para o administrador.

##### Regras de UI/UX

- **Contexto administrativo:** A tela informa quando o administrador está
  editando o desafio de outro autor.
- **Retorno:** Um controle identificado como “Voltar” retorna à localização
  anterior.
- **Ausência de sessão:** O conteúdo do editor não é renderizado sem usuário
  autenticado disponível.

#### RF-02 Definir as informações editoriais do desafio

- [x] **Informar título, descrição, categorias e dificuldade**

**Descrição:** O desafio deve conter informações editoriais suficientes para
ser identificado, compreendido, classificado e encontrado pelos usuários.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-06` | Dado um título com menos de 3 ou mais de 100 caracteres, quando o formulário é validado, então uma mensagem de erro é exibida. |
| `CA-07` | Dado um título que gere o mesmo identificador textual de outro desafio, quando a disponibilidade é consultada, então o editor informa que o título já está em uso. |
| `CA-08` | Dada uma descrição com menos de 3 ou mais de 5.000 caracteres, quando o formulário é validado, então uma mensagem de erro é exibida. |
| `CA-09` | Dado que nenhuma categoria foi selecionada, quando o formulário é validado, então o desafio não pode ser salvo. |
| `CA-10` | Dadas as categorias disponíveis, quando o usuário seleciona ou remove uma categoria, então ela muda entre as listas de categorias selecionadas e disponíveis. |
| `CA-11` | Dado o campo de dificuldade, quando o usuário o preenche, então pode escolher entre fácil, médio e difícil. |

##### Regras de Negócio

- **Título obrigatório:** Deve conter de 3 a 100 caracteres.
- **Título não duplicado:** O identificador derivado do título não pode
  conflitar com outro desafio; o título atual é aceito durante a edição sem
  gerar conflito consigo mesmo.
- **Descrição obrigatória:** Deve conter de 3 a 5.000 caracteres.
- **Categoria obrigatória:** Deve haver pelo menos uma categoria.
- **Dificuldade obrigatória:** Deve ser fácil, média ou difícil. Quando um
  desafio antigo não possui dificuldade específica, o editor adota “fácil”
  como valor inicial.

##### Regras de UI/UX

- **Descrição:** É editada em um editor de conteúdo rico.
- **Categorias:** Categorias selecionadas permanecem destacadas e podem ser
  removidas; as demais continuam disponíveis para seleção.
- **Feedback:** Erros de validação são associados aos respectivos campos e
  também podem ser resumidos no topo do formulário.

#### RF-03 Escolher a forma de avaliação

- [x] **Alternar entre avaliação pelo retorno da função e pela saída do console**

**Descrição:** O autor define se a resposta do participante será avaliada pelo
valor retornado por uma função ou pelo conteúdo produzido no console.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-12` | Dado o modo de avaliação por função, quando o editor é exibido, então os campos de nome e parâmetros da função ficam visíveis. |
| `CA-13` | Dado o modo de avaliação pela saída do console, quando o editor é exibido, então os campos de metadados da função ficam ocultos. |
| `CA-14` | Dado que o usuário alterna o modo de avaliação, quando a mudança ocorre, então o formulário passa a exigir somente os campos aplicáveis ao modo selecionado. |
| `CA-15` | Dado o modo por função sem nome válido ou sem parâmetros, quando o formulário é validado, então o desafio não pode ser salvo. |
| `CA-16` | Dado o modo por função, quando nome ou parâmetros são alterados, então o código inicial é gerado com a assinatura correspondente. |

##### Regras de Negócio

- **Modo padrão:** Novos desafios usam avaliação pelo retorno da função.
- **Função obrigatória:** No modo por função, o nome deve ser um identificador
  de código válido e deve existir pelo menos um parâmetro.
- **Parâmetros tipados:** Cada parâmetro possui nome e tipo de dado.
- **Console sem função:** No modo por saída do console, metadados de função não
  são obrigatórios e os casos de teste não recebem entradas de parâmetros.
- **Código inicial:** No modo por função, a assinatura é derivada dos metadados
  da função. No modo por console, um código já existente é preservado durante a
  edição, mas não pode ser alterado por esta tela.

##### Regras de UI/UX

- **Seletor de modo:** O controle informa o modo ativo com os textos “Avaliar
  pelo retorno da função” ou “Avaliar pela saída do console”.
- **Parâmetros dinâmicos:** O usuário pode adicionar e remover parâmetros.
- **Tipos disponíveis:** Texto, número, lógico e lista estão disponíveis como
  tipos de dados; o valor indefinido funciona como estado sem tipo definido.

#### RF-04 Configurar os casos de teste

- [x] **Definir entradas, saídas esperadas e visibilidade dos casos de teste**

**Descrição:** Os casos de teste determinam os exemplos usados para avaliar a
solução e podem ser visíveis ou ocultos para quem resolve o desafio.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-17` | Dado um desafio com menos de três casos de teste, quando o formulário é validado, então o editor exige pelo menos três casos. |
| `CA-18` | Dado o modo por função, quando os parâmetros são alterados, então as entradas de cada caso acompanham a quantidade e os tipos definidos para a função. |
| `CA-19` | Dado um novo parâmetro sem valor correspondente no caso de teste, quando a entrada é criada, então recebe o valor padrão do tipo escolhido. |
| `CA-20` | Dado um caso de teste, quando o usuário altera o tipo da saída esperada, então o valor é reinicializado com o padrão desse tipo. |
| `CA-21` | Dado um caso de teste, quando o usuário marca ou desmarca sua visibilidade, então o caso é persistido respectivamente como visível ou oculto. |
| `CA-22` | Dado um valor de entrada ou saída, quando o usuário o edita, então pode representar texto, número, lógico ou uma lista composta recursivamente por esses tipos. |
| `CA-23` | Dada a lista de casos, quando o usuário adiciona ou remove um item, então a numeração e a posição persistida acompanham a ordem exibida. |

##### Regras de Negócio

- **Quantidade mínima:** Todo desafio deve possuir pelo menos três casos de
  teste.
- **Ordem:** A posição persistida de cada caso começa em 1 e segue a ordem do
  formulário.
- **Entradas por função:** Cada caso possui uma entrada para cada parâmetro da
  função, na mesma ordem.
- **Saída esperada:** Todo caso define um valor esperado.
- **Visibilidade:** Casos podem ser visíveis ou bloqueados para o participante.
- **Listas:** Valores em lista podem conter itens de tipos diferentes e listas
  aninhadas.

##### Regras de UI/UX

- **Gerenciamento dinâmico:** Casos e itens de listas podem ser adicionados e
  removidos diretamente no formulário.
- **Tipos legíveis:** Valores lógicos são apresentados como “Verdadeiro” e
  “Falso”.
- **Orientação:** Quando não há parâmetros disponíveis, a área de entradas
  orienta o usuário a definir os parâmetros primeiro.

#### RF-05 Criar ou atualizar o desafio

- [x] **Validar e persistir o formulário**

**Descrição:** O editor deve impedir envios incompletos, diferenciar criação de
atualização e comunicar o andamento e o resultado da ação.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-24` | Dado um novo desafio com campos obrigatórios incompletos, quando o usuário tenta prosseguir, então a ação de postar permanece desabilitada. |
| `CA-25` | Dado um desafio existente sem alterações, quando o editor é exibido, então a ação de atualizar permanece desabilitada. |
| `CA-26` | Dado um formulário válido e alterado, quando o usuário envia, então a ação apresenta estados de confirmação, execução, sucesso ou falha conforme o resultado. |
| `CA-27` | Dada uma criação bem-sucedida, quando a persistência termina, então o usuário é direcionado ao novo desafio com indicação de que ele acabou de ser criado. |
| `CA-28` | Dada uma atualização bem-sucedida, quando a persistência termina, então o usuário é direcionado ao desafio atualizado. |
| `CA-29` | Dada uma falha de criação ou atualização, quando a persistência termina, então o editor permanece disponível e apresenta estado de erro. |

##### Regras de Negócio

- **Autoria na criação:** O desafio é associado ao usuário autenticado.
- **Autoria na atualização:** O autor existente é mantido, inclusive em edição
  administrativa.
- **Completude:** Título, descrição, dificuldade, categoria e casos de teste
  válidos são obrigatórios; nome e parâmetros de função são adicionais no modo
  por função.
- **Alteração necessária:** Um desafio existente só pode ser atualizado após
  alguma mudança no formulário.

##### Regras de UI/UX

- **Ação contextual:** O botão principal usa “postar” na criação e “atualizar”
  na edição.
- **Estados da ação:** A interface distingue confirmação, execução, sucesso e
  falha.
- **Redirecionamento:** Após o sucesso, a navegação ocorre depois de uma breve
  confirmação visual.

#### RF-06 Manter o desafio privado pelo editor

- [x] **Criar desafios privados e preservar a visibilidade existente**

**Descrição:** A tela do editor não inclui um fluxo de publicação. Sua
responsabilidade é criar o desafio como privado e manter a visibilidade já
definida por outros fluxos ao editar.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-30` | Dado um novo desafio, quando ele é criado pelo editor, então é persistido como privado. |
| `CA-31` | Dado um desafio existente, quando ele é atualizado pelo editor, então sua condição pública ou privada é preservada. |
| `CA-32` | Dado o formulário do editor, quando o usuário o utiliza, então nenhum controle de publicação ou visibilidade é oferecido. |

##### Regras de Negócio

- **Privacidade padrão:** Todo desafio criado nesta tela nasce privado.
- **Preservação de visibilidade:** A edição não altera a visibilidade existente.
- **Publicação externa:** Tornar um desafio público depende de outro fluxo de
  produto.

##### Regras de UI/UX

- **Sem controle de publicação:** A interface não apresenta seletor público ou
  privado.

#### RF-07 Excluir um desafio existente

- [x] **Confirmar e executar a exclusão**

**Descrição:** Autores e administradores autorizados podem excluir um desafio
existente após confirmação explícita da ação destrutiva.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-33` | Dado um desafio existente, quando o usuário aciona “Deletar”, então uma confirmação informa que os dados serão perdidos. |
| `CA-34` | Dado o autor no diálogo de confirmação, quando a ação é exibida, então o texto identifica a exclusão do próprio desafio. |
| `CA-35` | Dado um administrador editando o desafio de terceiro, quando a confirmação é exibida, então o texto explicita que o desafio pertence a outro autor. |
| `CA-36` | Dada uma exclusão bem-sucedida, quando a operação termina, então o usuário é direcionado à lista de desafios. |
| `CA-37` | Dada uma falha de exclusão, quando a operação termina, então o usuário permanece na tela e recebe a mensagem de erro. |

##### Regras de Negócio

- **Disponibilidade:** A exclusão só existe para desafios já persistidos.
- **Permissão:** Apenas o autor ou um administrador autorizado pode excluir.
- **Confirmação:** A exclusão requer confirmação explícita.

##### Regras de UI/UX

- **Alerta destrutivo:** O diálogo diferencia a exclusão do próprio desafio da
  exclusão administrativa de um desafio de terceiro.
- **Cancelamento seguro:** O usuário pode cancelar o diálogo sem alterar o
  desafio.
- **Feedback de falha:** Erros de exclusão são apresentados por notificação.

#### RF-08 Proteger alterações não salvas ao sair do editor

- [ ] **Solicitar confirmação antes de descartar alterações pendentes**

**Descrição:** O editor deve detectar divergências entre os dados exibidos e o
último estado persistido. Quando o usuário tentar sair com alterações
pendentes, a interface deve impedir a navegação imediata e informar que os
dados não salvos serão perdidos.

##### Critérios de Aceitação

| ID | Critério observável |
|---|---|
| `CA-38` | Dado um desafio carregado sem alterações, quando o usuário sai do editor, então a navegação ocorre sem aviso. |
| `CA-39` | Dado que qualquer campo editável foi alterado, quando o usuário navega para outra rota, aciona “Voltar” ou usa o histórico do navegador, então o diálogo “Sair sem salvar?” é exibido antes da navegação. |
| `CA-40` | Dado o diálogo de alterações não salvas, quando o usuário escolhe “continuar editando” ou fecha o diálogo, então permanece no editor com todos os valores preenchidos preservados. |
| `CA-41` | Dado o diálogo de alterações não salvas, quando o usuário escolhe “sair sem salvar”, então a navegação solicitada é concluída e as alterações locais são descartadas. |
| `CA-42` | Dado que existem alterações não salvas, quando o usuário tenta recarregar ou fechar a aba, então o navegador apresenta sua confirmação nativa de saída. |
| `CA-43` | Dada uma criação ou atualização bem-sucedida, quando o sistema redireciona o usuário, então a navegação ocorre sem o aviso de alterações não salvas. |
| `CA-44` | Dada uma falha ao criar ou atualizar o desafio, quando o usuário tenta sair, então as alterações continuam marcadas como pendentes e o aviso permanece ativo. |

##### Regras de Negócio

- **Referência persistida:** O estado é considerado alterado quando diverge do
  último conjunto de dados carregado ou salvo com sucesso.
- **Escopo integral:** A detecção inclui todos os campos editáveis do desafio,
  inclusive categorias, casos de teste, solução oficial e playback.
- **Carregamento inicial:** O preenchimento do formulário com dados persistidos
  não deve ser interpretado como alteração do usuário.
- **Persistência bem-sucedida:** Uma criação ou atualização concluída redefine
  a referência persistida e desativa a proteção de saída.
- **Falha de persistência:** Uma tentativa de salvar que falha não descarta os
  dados locais nem desativa a proteção.
- **Saída confirmada:** A confirmação para sair sem salvar libera somente a
  navegação que originou o aviso, sem desativar permanentemente a proteção.

##### Regras de UI/UX

- **Diálogo de navegação:** Nas navegações controladas pelo Studio, o diálogo
  usa o título “Sair sem salvar?” e informa que as alterações feitas no desafio
  serão perdidas.
- **Ação segura:** “Continuar editando” é a ação principal e mantém o usuário no
  editor.
- **Ação destrutiva:** “Sair sem salvar” é apresentada como ação destrutiva e
  conclui a navegação solicitada.
- **Fechamento seguro:** Fechar o diálogo equivale a continuar editando.
- **Limitação do navegador:** Recarregar ou fechar a aba utiliza o aviso nativo
  do navegador, cujo texto pode variar conforme o ambiente.

---

### 3. Fluxo de Usuário (User Flow)

**Criar desafio:** Uma pessoa autenticada configura e salva os dados iniciais
de um novo desafio privado.

1. O usuário acessa a rota de criação do desafio.
2. O sistema carrega as categorias disponíveis e apresenta o formulário vazio.
3. O usuário informa título, descrição, dificuldade e categorias.
4. O usuário escolhe a forma de avaliação:
   - **Retorno da função:** Define nome, ao menos um parâmetro e seus tipos.
   - **Saída do console:** Prossegue sem metadados de função ou entradas.
5. O usuário cria pelo menos três casos de teste, define as saídas esperadas e
   escolhe quais casos serão visíveis.
6. O sistema valida o formulário:
   - **Sucesso:** Habilita a ação de postar.
   - **Falha:** Mantém a ação desabilitada e apresenta os erros aplicáveis.
7. O usuário confirma a postagem.
8. O sistema cria o desafio como privado e preserva o usuário como autor:
   - **Sucesso:** Exibe confirmação e direciona ao novo desafio.
   - **Falha:** Mantém o editor aberto e sinaliza o erro.

**Editar desafio próprio:** O autor altera um desafio existente.

1. O autor acessa a rota de edição.
2. O sistema valida a permissão e preenche o formulário com os dados atuais.
3. O autor altera um ou mais campos.
4. O sistema valida os dados e habilita a atualização somente após uma mudança
   válida.
5. O autor confirma a atualização:
   - **Sucesso:** O sistema preserva autoria e visibilidade e direciona ao
     desafio atualizado.
   - **Falha:** O editor permanece aberto e apresenta estado de erro.

**Editar desafio como administrador:** Um administrador gerencia um desafio de
outro autor.

1. O administrador acessa a rota de edição do desafio.
2. O sistema valida sua permissão administrativa.
3. A tela informa que o desafio pertence a outro autor.
4. O administrador altera e salva os dados.
5. O sistema preserva a autoria original e a visibilidade existente.

**Tentar sair com alterações não salvas:** Um autor ou administrador inicia
uma navegação antes de persistir as mudanças.

1. O usuário altera qualquer campo do desafio.
2. O usuário tenta sair pela navegação do Studio, pelo controle “Voltar” ou
   pelo histórico do navegador.
3. O sistema apresenta o diálogo “Sair sem salvar?”.
4. O usuário decide:
   - **Continuar editando:** O diálogo é fechado, a navegação é cancelada e os
     dados locais permanecem no formulário.
   - **Sair sem salvar:** O sistema conclui a navegação solicitada e descarta as
     alterações locais.
5. Se a tentativa de saída ocorrer ao recarregar ou fechar a aba, o navegador
   apresenta sua confirmação nativa.
6. Depois de uma criação ou atualização bem-sucedida, o redirecionamento ocorre
   sem apresentar o aviso.

**Excluir desafio:** O autor ou administrador remove um desafio existente.

1. O usuário autorizado acessa a edição e aciona “Deletar”.
2. O sistema apresenta uma confirmação contextualizada pela autoria.
3. O usuário decide:
   - **Cancelar:** O diálogo é fechado e nenhum dado é alterado.
   - **Confirmar:** O sistema solicita a exclusão.
4. O sistema conclui a operação:
   - **Sucesso:** Direciona à lista de desafios.
   - **Falha:** Mantém a tela e apresenta a mensagem de erro.

**Tentar editar sem permissão:** Um usuário autenticado tenta acessar o editor
de um desafio alheio.

1. O usuário acessa diretamente a rota de edição.
2. O sistema verifica que ele não é autor nem administrador autorizado.
3. O acesso é encerrado como conteúdo não encontrado, sem revelar detalhes do
   desafio.

---

### 4. Fora do Escopo (Out of Scope)

- Alterar a visibilidade pública ou privada pela tela do editor.
- Publicar, revisar ou aprovar desafios por um workflow editorial nesta tela.
- Editar manualmente o código inicial do desafio.
- Criar funções avaliadas por retorno sem nenhum parâmetro.
- Definir entradas de parâmetros no modo de avaliação pela saída do console.
- Permitir que usuários sem autoria ou permissão administrativa gerenciem um
  desafio existente.
- Listagem, descoberta, resolução e execução dos desafios pelos participantes.

#### Descartado durante a implementação

Nenhum comportamento ou requisito descartado foi informado ou identificado
como decisão de produto durante a auditoria retrospectiva.
