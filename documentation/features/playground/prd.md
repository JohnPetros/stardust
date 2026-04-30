### 1. Visão Geral

O Playground de Snippets e um ambiente livre para escrever, executar, salvar e organizar codigos curtos dentro da plataforma.

Ele resolve a necessidade de praticar logica fora do fluxo de desafios estruturados, permitindo que o usuario experimente ideias, mantenha uma colecao pessoal de snippets e compartilhe snippets publicos com outros usuarios.

O objetivo principal e oferecer um sandbox persistente com gestao basica de snippets, incluindo edicao, exclusao, controle de visibilidade, compartilhamento por link e visualizacao de snippets publicos de terceiros dentro das regras definidas para a feature.

---

### 2. Requisitos

#### REQ-01 Acessar o hub de snippets

- [x] **Acessar o hub de snippets**

**Descricao:** O usuario deve conseguir entrar na area principal do playground para visualizar sua colecao de snippets e iniciar a criacao de um novo item, mantendo separado desse hub o consumo de snippets publicos de terceiros por link direto.

##### Regras de Negocio

- **Ponto de entrada:** A funcionalidade comeca na listagem de snippets do playground.
- **Colecao pessoal:** A listagem exibida no hub pertence ao proprio usuario autenticado.
- **Paginacao:** A listagem deve ser apresentada em paginas com quantidade fixa de itens por pagina.
- **Estado vazio:** Quando nao houver snippets cadastrados, o sistema deve informar que o usuario ainda nao criou nenhum snippet.
- **Separacao de contextos:** O hub de snippets nao se confunde com a visualizacao de snippets publicos de terceiros por link direto.
- **Acesso autenticado:** A rota principal `/playground/snippets` exige sessao autenticada validada server-side antes da renderizacao da pagina.

##### Regras de UI/UX

- **CTA principal:** Deve existir uma acao clara para criar um novo snippet.
- **Feedback de carregamento:** A listagem deve apresentar estado de loading durante a busca dos itens.
- **Feedback de vazio:** O usuario deve receber uma mensagem explicita quando sua colecao estiver vazia.
- **Responsividade:** A listagem deve funcionar em mobile e desktop.
- **Acessibilidade:** Os controles de navegacao e paginacao devem ser acionaveis por teclado.
- **Feedback:** O usuario deve perceber claramente carregamento, ausencia de itens e mudanca de pagina.
- **Performance:** A troca de pagina deve responder sem recarregamento manual da tela.
- **Confiabilidade:** Falhas de autenticacao devem impedir a exibicao da colecao protegida.
- **Compatibilidade:** A experiencia deve funcionar nos navegadores suportados pela aplicacao web.

#### REQ-02 Criar e editar um snippet no playground

- [x] **Criar e editar um snippet no playground**

**Descricao:** O usuario deve conseguir abrir um editor livre, preencher titulo e codigo, executar o trecho digitado, aplicar exemplos prontos localmente e preparar o snippet para salvamento manual.

##### Regras de Negocio

- **Novo snippet:** Um novo snippet deve iniciar com um titulo padrao quando nenhum titulo tiver sido definido.
- **Edicao livre:** O usuario pode alterar titulo e codigo antes de salvar.
- **Execucao local:** O codigo digitado pode ser executado diretamente no playground.
- **Catalogo de exemplos:** O editor deve oferecer uma acao manual `Exemplos`, fechada por padrao, com 10 exemplos iniciais para acelerar o preenchimento do editor.
- **Aplicacao local:** Ao selecionar um exemplo, o sistema preenche titulo e codigo apenas no estado local do editor, sem salvar automaticamente.
- **Confirmacao de substituicao:** Se titulo ou codigo ja tiverem alteracoes locais, o sistema deve solicitar confirmacao antes de substituir o conteudo atual.
- **Persistencia protegida:** Se o usuario tentar salvar sem estar autenticado, o sistema deve solicitar login antes de concluir a persistencia.
- **Retorno ao hub:** O usuario deve conseguir voltar para a listagem de snippets a partir do editor.

##### Regras de UI/UX

- **Editor:** A tela deve oferecer campo de titulo e editor de codigo no mesmo fluxo.
- **Barra de acoes:** O usuario deve ter acesso a acoes de voltar, executar, salvar e abrir o catalogo de exemplos.
- **Sem assistente de codigo:** O editor de snippets nao deve exibir o botao do assistente de codigo nesse contexto.
- **Confirmacao acessivel:** A substituicao de conteudo deve usar dialogo confirmatorio acionavel por teclado.
- **Responsividade:** O editor deve ocupar a area util da tela em diferentes tamanhos de viewport.
- **Acessibilidade:** Campos e botoes devem possuir rotulos compreensiveis e navegacao por teclado.
- **Feedback:** O sistema deve exibir feedback visual para salvar com sucesso, erro ou processamento em andamento.
- **Performance:** A abertura do catalogo de exemplos deve ser local e imediata, sem requisicoes adicionais.
- **Confiabilidade:** Cancelar a substituicao de um exemplo nao deve apagar o conteudo atual.
- **Compatibilidade:** O fluxo deve funcionar em mobile e desktop.

#### REQ-03 Salvar e atualizar snippets

- [x] **Salvar e atualizar snippets**

**Descricao:** O usuario autenticado deve conseguir persistir um novo snippet e atualizar snippets ja existentes, incluindo titulo, codigo e visibilidade.

##### Regras de Negocio

- **Criacao autenticada:** Apenas usuarios autenticados podem salvar um novo snippet.
- **Atualizacao de snippet existente:** Um snippet salvo pode ser reeditado e salvo novamente.
- **Titulo minimo:** O titulo do snippet deve conter pelo menos 3 caracteres.
- **Campos persistidos:** O sistema deve persistir titulo, codigo e status de visibilidade do snippet.
- **Validacao de formulario:** Quando houver erro de validacao, o sistema deve associar a mensagem ao campo correspondente.
- **Status de salvamento:** O sistema deve informar estados de sucesso, falha e processamento durante o salvamento.

##### Regras de UI/UX

- **Estados do salvar:** O botao de salvar deve refletir os estados padrao, em execucao, sucesso e erro.
- **Mensagens de erro:** Erros de titulo e codigo devem aparecer no contexto do formulario.
- **Responsividade:** O fluxo de salvamento deve permanecer utilizavel em telas menores.
- **Acessibilidade:** Mensagens de erro e sucesso devem ser perceptiveis para tecnologias assistivas.
- **Feedback:** O usuario deve receber confirmacao imediata quando a operacao terminar.
- **Performance:** O salvamento deve ocorrer em uma unica interacao, sem etapas adicionais obrigatorias.
- **Confiabilidade:** Falhas nao devem apagar automaticamente o conteudo digitado.
- **Compatibilidade:** O mesmo fluxo deve valer para criacao e edicao.

#### REQ-04 Gerenciar snippets salvos

- [x] **Gerenciar snippets salvos**

**Descricao:** O usuario deve conseguir administrar sua colecao de snippets pela listagem, incluindo abrir, renomear e excluir itens salvos.

##### Regras de Negocio

- **Abertura do snippet:** Cada item da listagem deve permitir abrir o snippet correspondente no editor.
- **Renomeacao rapida:** O usuario deve conseguir alterar o titulo de um snippet diretamente a partir da listagem.
- **Exclusao confirmada:** O sistema deve exigir confirmacao antes de excluir um snippet.
- **Atualizacao da colecao:** Depois de excluir um item, a listagem deve refletir o estado mais recente da colecao.

##### Regras de UI/UX

- **Acoes por item:** Cada card deve expor acoes de abrir, editar titulo e excluir.
- **Confirmacao destrutiva:** A exclusao deve usar um passo de confirmacao explicita.
- **Responsividade:** Os cards devem se reorganizar adequadamente em grade para diferentes larguras.
- **Acessibilidade:** Acoes dos cards devem estar acessiveis por teclado.
- **Feedback:** Falhas em renomeacao ou exclusao devem retornar mensagem clara ao usuario.
- **Performance:** A remocao de um item deve atualizar a listagem sem recarregamento manual.
- **Confiabilidade:** A exclusao nao deve ocorrer sem confirmacao do usuario.
- **Compatibilidade:** O comportamento de gerenciamento deve ser consistente em toda a colecao.

#### REQ-05 Controlar visibilidade e compartilhamento

- [x] **Controlar visibilidade e compartilhamento**

**Descricao:** O usuario deve conseguir definir se um snippet e publico ou privado e, quando permitido, copiar um link direto para esse snippet.

##### Regras de Negocio

- **Controle de visibilidade:** O autor pode marcar o snippet como publico ou privado.
- **Compartilhamento permitido:** Apenas snippets publicos podem expor acao de compartilhamento.
- **Restricao do privado:** Snippets privados nao devem disponibilizar compartilhamento por link.
- **Acesso por link:** Usuarios podem acessar snippets de outros usuarios quando eles estiverem publicos.
- **Acesso negado:** Quando o usuario nao puder acessar um snippet por visibilidade, o sistema deve exibir uma mensagem de indisponibilidade e direcionar para criacao do proprio playground.

##### Regras de UI/UX

- **Toggle de visibilidade:** O autor deve ter um controle simples para alternar entre publico e privado.
- **Compartilhamento:** O compartilhamento deve copiar a URL direta do snippet.
- **Feedback de copia:** O sistema deve confirmar quando a URL tiver sido copiada.
- **Responsividade:** O controle de visibilidade e a acao de compartilhar devem permanecer acessiveis em diferentes tamanhos de tela.
- **Acessibilidade:** Toggle e dialogo de compartilhamento devem funcionar com teclado.
- **Feedback:** O usuario deve diferenciar claramente quando um snippet pode ou nao pode ser compartilhado.
- **Performance:** Copiar o link deve ser uma acao imediata.
- **Confiabilidade:** O sistema deve evitar expor acoes de share para itens privados.
- **Compatibilidade:** O comportamento de visibilidade deve ser consistente entre listagem e editor.

#### REQ-06 Visualizar snippets publicos de terceiros

- [x] **Visualizar snippets publicos de terceiros**

**Descricao:** O usuario deve conseguir abrir, por link direto, snippets publicos criados por outros usuarios, sem transformar esse acesso em permissao de gerenciamento.

##### Regras de Negocio

- **Acesso por link direto:** Um snippet marcado como publico pode ser aberto por outros usuarios por meio de sua URL direta.
- **Separacao de propriedade:** Visualizar um snippet publico de terceiro nao torna o visitante autor nem concede controle sobre o item.
- **Restricao de gerenciamento:** Usuarios visitantes nao podem renomear, excluir, alterar visibilidade ou sobrescrever snippets de terceiros.
- **Indisponibilidade do privado:** Quando o snippet nao for publico e o visitante nao for o autor, o sistema deve bloquear o acesso.

##### Regras de UI/UX

- **Leitura do snippet:** O usuario deve conseguir abrir o snippet publico e visualizar seu conteudo no editor.
- **Ausencia de acoes de dono:** A interface nao deve induzir o visitante a acreditar que pode gerenciar um snippet de terceiro.
- **Responsividade:** A visualizacao por link deve funcionar em mobile e desktop.
- **Acessibilidade:** O acesso ao conteudo e aos controles disponiveis deve funcionar por teclado.
- **Feedback:** Quando o acesso nao for permitido, o sistema deve comunicar isso de forma explicita.
- **Performance:** Abrir um snippet publico por link deve ocorrer em fluxo direto, sem navegacao intermediaria obrigatoria.
- **Confiabilidade:** O sistema deve respeitar a visibilidade configurada pelo autor.
- **Compatibilidade:** O comportamento deve ser consistente para qualquer snippet publico compartilhado.

---

### 3. Fluxo de Usuario (User Flow)

**Fluxo 1 - Criar um novo snippet:** O usuario inicia um novo experimento no playground.

1. O usuario acessa a listagem de snippets do playground autenticado.
2. O usuario aciona a criacao de um novo snippet.
3. O usuario preenche titulo e codigo no editor ou aplica um exemplo pronto pelo catalogo `Exemplos`.
4. Se houver conteudo local e um novo exemplo for escolhido, o sistema pede confirmacao antes de substituir.
5. O usuario executa o codigo, se desejar validar o conteudo antes de salvar.
6. O usuario tenta salvar:
   - **Sucesso:** O snippet e persistido com titulo, codigo e visibilidade definidos.
   - **Falha:** O sistema apresenta erro de validacao ou solicita login para concluir a persistencia.

**Fluxo 2 - Gerenciar snippets existentes:** O usuario administra sua colecao ja salva.

1. O usuario acessa a listagem de snippets.
2. O usuario escolhe um item da colecao.
3. O usuario realiza uma acao:
   - **Abrir:** O sistema leva o usuario ao editor do snippet.
   - **Renomear:** O sistema solicita um novo titulo e atualiza o item.
   - **Excluir:** O sistema pede confirmacao antes de remover o snippet.
4. O sistema valida a acao:
   - **Sucesso:** A colecao e atualizada com o novo estado.
   - **Falha:** O sistema exibe a mensagem de erro correspondente.

**Fluxo 3 - Controlar visibilidade e compartilhamento:** O usuario define como o snippet pode ser tratado fora da edicao.

1. O usuario abre um snippet salvo.
2. O usuario ajusta a visibilidade do snippet.
3. O sistema valida a configuracao:
   - **Sucesso:** O snippet permanece salvo com o novo status de visibilidade.
   - **Falha:** O sistema informa o erro e preserva o conteudo.
4. Quando o snippet puder ser compartilhado, o usuario copia o link direto.
5. O sistema valida o acesso ao link:
   - **Sucesso:** O usuario acessa diretamente o snippet publico.
   - **Falha:** Um usuario sem permissao recebe a mensagem de indisponibilidade.

**Fluxo 4 - Visualizar snippet publico de terceiro:** O usuario consome um snippet compartilhado sem assumir controle sobre ele.

1. O usuario recebe ou acessa a URL direta de um snippet.
2. O sistema verifica a visibilidade e a autoria do snippet.
3. O sistema valida o acesso:
   - **Sucesso:** O snippet publico e exibido para visualizacao e uso no editor.
   - **Falha:** O sistema exibe a mensagem de indisponibilidade quando o snippet nao puder ser acessado.
4. O usuario navega pelo conteudo visivel do snippet.
5. O sistema preserva as restricoes de gerenciamento:
   - **Sucesso:** O visitante apenas visualiza o snippet.
   - **Falha:** Qualquer tentativa de acao reservada ao autor deve permanecer indisponivel.

---

### 4. Fora do Escopo (Out of Scope)

- Galeria publica ou exemplos definidos para usuarios nao autenticados fora do fluxo autenticado do playground.
- Compartilhamento de snippets privados.
- Edicao de snippets de terceiros, mesmo quando eles forem publicos.
- Galeria navegavel de snippets publicos de outros usuarios dentro do hub principal.
- Persistencia automatica ao aplicar exemplos.
