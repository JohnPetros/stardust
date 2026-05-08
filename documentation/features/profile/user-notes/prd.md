# PRD - Notas Privadas do Usuario em Lesson e Challenge

---

### 1. Visao Geral

- A funcionalidade adiciona um espaco privado de anotacoes dentro dos fluxos de `lesson` e `challenge`, sem exigir troca de pagina.
- Ela resolve a necessidade de registrar insights, resumos e rascunhos durante o estudo, mantendo esse conteudo vinculado apenas ao proprio usuario.
- O objetivo principal e permitir criar, consultar, editar e excluir notas pessoais com experiencia rapida, contextual e persistida.

---

### 2. Requisitos

#### REQ-01 [Acessar o drawer de notas durante o estudo]

- [x] **Acessar o drawer de notas durante o estudo**

**Descricao:** O usuario autenticado deve conseguir abrir um drawer de notas pessoais diretamente nas paginas de licao e desafio, sem sair do fluxo atual.

##### Regras de Negocio

- **Escopo do atalho:** O acesso a notas existe apenas nos fluxos de `lesson` e `challenge`.
- **Acesso autenticado:** O atalho de notas aparece somente para usuarios autenticados.
- **Sem navegacao adicional:** Abrir notas nao altera rota nem desmonta o estado principal da tela.

##### Regras de UI/UX

- **Abertura contextual:** O drawer deve abrir a partir de um atalho visual no cabecalho da tela atual.
- **Fluxo inicial:** Ao abrir o drawer, o usuario encontra imediatamente o formulario de nova nota.
- **Responsividade:** O drawer deve ocupar toda a largura no mobile e manter largura fixa no desktop.

#### REQ-02 [Criar e editar notas privadas]

- [x] **Criar e editar notas privadas**

**Descricao:** O usuario deve conseguir escrever e atualizar notas pessoais com titulo obrigatorio e corpo em Markdown editado por interface rica.

##### Regras de Negocio

- **Titulo obrigatorio:** Toda nota precisa de um titulo com pelo menos 1 caractere.
- **Corpo opcional:** O conteudo da nota pode estar vazio.
- **Persistencia individual:** Cada nota e salva como registro proprio, separado do cadastro geral do usuario.
- **Atualizacao de data:** Toda edicao deve atualizar a data da ultima modificacao.

##### Regras de UI/UX

- **Editor rico:** O drawer deve oferecer edicao com formatacao basica e persistencia em Markdown.
- **Feedback de formulario:** Erros de validacao e estados de salvamento devem ser visiveis durante a interacao.
- **Continuidade do estudo:** O usuario pode continuar na pagina principal enquanto salva a nota.

#### REQ-03 [Consultar e reencontrar notas]

- [x] **Consultar e reencontrar notas**

**Descricao:** O usuario deve conseguir abrir uma listagem sobre o drawer para localizar notas existentes e retomar a edicao rapidamente.

##### Regras de Negocio

- **Listagem privada:** O sistema retorna apenas notas do usuario autenticado.
- **Ordenacao:** As notas devem ser listadas por atualizacao mais recente primeiro.
- **Busca por titulo:** O usuario pode filtrar a listagem por texto no titulo.
- **Paginacao:** A listagem deve usar resposta paginada para suportar crescimento da colecao.

##### Regras de UI/UX

- **Preview da nota:** Cada item deve exibir titulo, trecho do conteudo e data relativa de atualizacao.
- **Busca sob demanda:** A listagem deve ser carregada quando o usuario abrir o modal de notas.
- **Estado vazio e erro:** A interface deve informar ausencia de notas e falhas de carregamento com acao de recuperacao.

#### REQ-04 [Excluir notas com seguranca]

- [x] **Excluir notas com seguranca**

**Descricao:** O usuario deve conseguir remover uma nota propria mediante confirmacao explicita, sem risco de afetar notas de outros usuarios.

##### Regras de Negocio

- **Ownership obrigatorio:** Update e delete devem validar que a nota pertence ao usuario autenticado.
- **Exclusao definitiva:** Ao confirmar a exclusao, a nota deve ser removida do repositorio persistido.
- **Privacidade do recurso:** O backend nao deve aceitar campos controlados pelo servidor nos payloads de entrada.

##### Regras de UI/UX

- **Confirmacao explicita:** O fluxo de exclusao deve depender de confirmacao do usuario.
- **Atualizacao imediata:** A lista local deve refletir create, update e delete sem exigir recarregamento completo.
- **Feedback:** O usuario deve receber retorno claro em caso de sucesso ou erro.

---

### 3. Fluxo de Usuario (User Flow)

**Fluxo 1 - Registrar uma nova anotacao durante o estudo:**

1. O usuario autenticado acessa uma pagina de `lesson` ou `challenge`.
2. O usuario abre o drawer de notas pelo atalho do cabecalho.
3. O usuario preenche titulo e conteudo da anotacao.
4. O sistema valida e salva a nota:
   - **Sucesso:** a nota e persistida e permanece disponivel para edicao futura.
   - **Falha:** a interface exibe erro e preserva o conteudo digitado.

**Fluxo 2 - Reabrir e editar uma nota existente:**

1. O usuario abre o drawer de notas.
2. O usuario escolhe `Ver notas`.
3. O sistema carrega a listagem privada com busca e paginacao.
4. O usuario seleciona uma nota existente.
5. O sistema preenche o formulario com os dados da nota:
   - **Sucesso:** a nota volta ao modo de edicao no mesmo drawer.
   - **Falha:** a interface informa o erro e oferece nova tentativa.

**Fluxo 3 - Excluir uma anotacao:**

1. O usuario abre uma nota existente no drawer.
2. O usuario aciona a exclusao.
3. O sistema solicita confirmacao explicita.
4. O sistema valida a operacao:
   - **Sucesso:** a nota e removida e a lista local e reconciliada.
   - **Falha:** a nota e restaurada na interface e o erro e exibido.

---

### 4. Fora do Escopo (Out of Scope)

- Pagina dedicada de notas fora dos fluxos de `lesson` e `challenge`.
- Compartilhamento de notas entre usuarios.
- Organizacao por tags, pastas, busca global ou historico de versoes.
- Vinculo das notas a estrelas, desafios especificos, questoes ou comentarios.
- Autosave, edicao offline ou sincronizacao local fora do salvamento manual.
