# PRD - Notas Privadas do Usuario

---

### 1. Visao Geral

- A funcionalidade oferece um espaco privado de anotacoes para o usuario autenticado, acessivel tanto nos fluxos de `lesson` e `challenge` quanto por uma area dedicada de notas.
- Ela resolve a necessidade de registrar insights, resumos e rascunhos durante o estudo, sem misturar esse conteudo com recursos publicos ou colaborativos.
- O objetivo principal e permitir criar, consultar, editar e excluir notas pessoais com experiencia rapida, contextual, persistida e reutilizavel em diferentes momentos da jornada.

---

### 2. Requisitos

#### REQ-01 [Acessar notas privadas a partir da navegacao e do estudo]

- [x] **Acessar notas privadas a partir da navegacao e do estudo**

**Descricao:** O usuario autenticado deve conseguir acessar suas notas pessoais tanto pelos fluxos de estudo quanto por uma entrada dedicada de navegacao autenticada.

##### Regras de Negocio

- **Acesso multi-contexto:** O acesso a notas existe nos fluxos de `lesson` e `challenge`, e tambem em uma pagina dedicada acessivel pela navegacao autenticada.
- **Acesso autenticado:** O atalho de notas aparece somente para usuarios autenticados.
- **Area privada dedicada:** A plataforma deve oferecer uma area privada de gerenciamento de notas para quem precisa consultar ou editar anotacoes fora do contexto imediato da aula.

##### Regras de UI/UX

- **Abertura contextual:** O drawer continua abrindo a partir de um atalho visual no cabecalho da tela atual.
- **Navegacao dedicada:** A navegacao autenticada deve expor uma entrada `Notas` para acesso rapido ao workspace completo.
- **Responsividade:** O acesso dedicado precisa funcionar bem em desktop e mobile sem quebrar a navegacao principal.

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

#### REQ-05 [Gerenciar notas em uma pagina dedicada]

- [x] **Gerenciar notas em uma pagina dedicada**

**Descricao:** O usuario autenticado deve conseguir abrir uma area exclusiva para notas privadas, com lista, busca, edicao e exclusao sem depender do contexto de uma aula ou desafio.

##### Regras de Negocio

- **Workspace privado:** A pagina dedicada mostra apenas notas do proprio usuario autenticado.
- **Busca por titulo:** O usuario pode localizar notas pelo titulo sem perder a ordenacao por atualizacao mais recente.
- **Mesma base de dados:** A experiencia dedicada reutiliza o mesmo recurso de notas ja usado no drawer, sem criar um fluxo paralelo.

##### Regras de UI/UX

- **Desktop em duas colunas:** No desktop, a pagina deve exibir lista lateral e editor ao mesmo tempo.
- **Fluxo mobile em uma tela por vez:** No mobile, a experiencia alterna entre lista e editor sem mudar de rota.
- **Edicao sem friccao:** Criacao, selecao, salvamento e exclusao devem acontecer no mesmo workspace, com confirmacao para descarte e exclusao.

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

- Compartilhamento de notas entre usuarios.
- Organizacao por tags, pastas, busca global ou historico de versoes.
- Vinculo das notas a estrelas, desafios especificos, questoes ou comentarios.
- Autosave, edicao offline ou sincronizacao local fora do salvamento manual.
