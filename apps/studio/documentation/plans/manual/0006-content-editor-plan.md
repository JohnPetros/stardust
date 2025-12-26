# Editor de conteúdo

Status: Concluído

## Objetivo
 
O widget `TextEditor` deve ser usado como base para um widget que seja possível adicionar blocos de texto prontos para o `TextEditor` em si.

## Camada UI

### `ContentEditorView`

- Renderiza o widget `TextEditor` com uma pré-visualização MDX lateral.
- Acima do `TextEditor` foi adicionada uma barra de ferramentas (`Toolbar`), que inclui botões para adicionar blocos de texto prontos para o valor do `TextEditor`.
- Utiliza o `insertWidget` do context `TextEditorContext` para inserir os blocos de texto.
- A toolbar contém os seguintes botões:
    - title ('Título principal') - Com lógica inteligente para alternar entre níveis de 1 a 6 ou remover o título.
    - textBlock ('Bloco de texto') - Insere a tag `<Text>`.
    - quoteTextBlock ('Bloco de texto destacado') - Insere a tag `<Quote>`.
    - alertTextBlock ('Bloco de texto de alerta') - Insere a tag `<Alert>`.
    - orderedList ('Lista numérica') - Transforma a linha atual em item de lista numerada ou remove a numeração.
    - unorderedList ('Lista') - Transforma a linha atual em item de lista ou remove o marcador.
    - codeLine ('Inserir trecho de código') - Envolve o texto selecionado em crases.
    - codeBlock ('Inserir trecho de código não executável') - Insere a tag `<Code>`.
    - link ('Inserir link') - Insere a tag `<Link>` com URL padrão do Delégua.

### `GuidePageView`

- O widget `TextEditor` foi substituído pelo `ContentEditor`, centralizando a edição e a pré-visualização.
- O layout foi simplificado para utilizar o componente `ContentEditor` que já gerencia a grade de edição/visualização.
