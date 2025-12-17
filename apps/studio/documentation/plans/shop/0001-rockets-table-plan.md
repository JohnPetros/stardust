# Tabela de foguetes

## Objetivo

Implementar funcionalidade de listagem de foguetes existentes no sistema na
página de gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- Interface `ShopService` possui o método `fetchRocketsList` para buscar
  foguetes existentes.
- `RocketDto` é usado para representar um foguete.

## Camada App

- A rota `ShopRoute` já existe e exibe a página de gestão de loja.

### Camada UI

- O widget `ShopPage` já existe e exibe a página de gestão de loja.
- O `ShopPageView` inclui tabs que permitem alternar entre "Foguetes" e
  "Avatares".
- Use o componente `Tabs` do shadcn para implementar a navegação entre as
  tabelas.
- O widget `RocketsTable` foi criado dentro de `ShopPage` para exibir a lista de
  foguetes em formato de tabela.
- O widget `RocketsTable` é composto por:
  - `useRocketsTable.ts`: Hook que gerencia o estado de busca, ordenação e
    paginação, utilizando `useCache` com a chave `CACHE.rocketsTable.key`.
  - `RocketsTableView.tsx`: View que renderiza a tabela com os controles de
    busca e ordenação.
  - `index.tsx`: Componente que conecta o hook à view.
- A tabela deve ter as seguintes colunas:
  - Nome
  - Imagem (usando `StorageImage` com `folder='rockets'`)
  - Preço
  - Ações
- Ações:
  - Editar
  - Excluir
- Os botões de ação devem estar apenas visíveis, nada de integração com REST.
- A tabela deve estar paginada com até 10 itens por página.
- A tabela deve conter os filtros de busca (com debounce de 500ms) e ordenação
  (ascending/descending por preço).
- Use o widget `Pagination` para a paginação.
- A constante `rocketsTable` já existe em `apps/studio/src/constants/cache.ts`
  com a chave `'rockets-table'`.
