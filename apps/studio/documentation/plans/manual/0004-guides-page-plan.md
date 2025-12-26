# Página de gerenciamento de guias

## Objetivo

A página de guide deve ser agnostica a categoria de guide (mdx/lsp). Atualmente só exsite a página, mas focada somente LSP guides.

## Camada App

- Deve Substituir LspGuidesRoute por GuidesRoute importando o widget `GuidesPage`
- a rota deve ser `/manual/guides/:category`
- Caso category não seja lsp ou mdx, deve redirecionar para a rota de 404

## Camada UI

- Renomeie todos os widgets de LspGuidesPage para somente Guides

### widget `GuidesPage`

- importe o category e use-o como GuideCategory logo de cara, deve ser usado como param no hook `useGuidesPage`
- Não altere nenhuma funcionalidade do widget
- Certifique-se de que o widget `GuidesPage` seja agnostico a categoria