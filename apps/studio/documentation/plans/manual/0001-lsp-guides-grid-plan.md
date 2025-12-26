# Grid de Guias LSP

## Objetivo

Criar uma página para fazer o gerenciamento de alto nível de guias do LSP, com a lista de guides em forma de grid.

Status: ✅ Concluído (Estrutura base e listagem)

módulos de infra: Rest, UI
app: studio

## Core

- [x] `Guide`, entidade que representa um guide
- [x] `ManualService`, interface para efetuar as requisições REST de guides
- [x] `ToastProvider`, interface para exibir toasts
- [x] `RestResponse`, classe que representa a resposta de uma requisição REST

## Camada REST

- [x] Implemente a interface `ManualService` no arquivo `apps/studio/src/rest/services/ManualService.ts`

## Camada App

### `RestContext` / `useRest`

- [x] Registre o service `ManualService` no hook `useRest`

### Constante `ROUTES`

- [x] Adicione um grupo de rotas para o módulo `manual` na constante `ROUTES`
- [x] Adicione as rotas `lspGuides` e `mdxGuides` no objeto `routes` do react-router através da constante `ROUTES`

### `LspGuidesRoute`

- [x] Crie o arquivo `apps/studio/src/app/routes/LspGuidesRoute.tsx`
- [x] Renderize o widget `LspGuidesPage`

## Camada UI

### Widget `LspGuidesPage`

- [x] Crie o widget `LspGuidesPage` em `apps/studio/src/ui/manual/widgets/pages/LspGuidesPage`
- [x] Faça o fetching utilizando o hook `useCache` no `useLspGuidesPage.ts`
- [x] Implemente o loading state com esqueletos (Skeletons) na `LspGuidesPageView.tsx`

### Widget `LspGuidesGrid`

- [x] Crie o widget `LspGuidesGrid` dentro do diretório do `LspGuidesPage`
- [x] Utilize o widget `SortableGrid` para implementar a grid com drag and drop (reordenamento)
- [x] Implemente a função `handleDragEnd` no `useLspGuidesPage.ts` para persistir a nova ordem

### Widget `LspGuidesCard`

- [x] Crie o widget `LspGuidesCard` dentro do diretório do `LspGuidesGrid`
- [x] Exiba o título do guia
- [ ] Insira um link no card de guide para a rota de edição (Ex: `/manual/guides/lsp/:guideId`) -> *Pendente: Rota de edição ainda não existe*
- [ ] Implementar as ações de edição e deleção (botões estão presentes mas desabilitados)

### Widget `Sidebar`

- [x] Adicione o grupo de rotas "Manual" com os links "Guias lsp" e "Guias mdx" na `SidebarView.tsx`
