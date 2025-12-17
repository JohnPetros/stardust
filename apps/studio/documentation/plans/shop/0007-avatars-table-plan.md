# Tabela de avatares

## Objetivo

Implementar funcionalidade de listagem de avatares existentes no sistema na página de gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- Interface `ShopService` possui o método `fetchAvatarsList` para buscar avatares existentes.
- `AvatarDto` é usado para representar um avatar.

## Camada App

- A rota `ShopRoute` já existe e exibe a página de gestão de loja.

### Camada UI

- O widget `ShopPage` já existe e exibe a página de gestão de loja.
- Atualize o `ShopPageView` para incluir tabs que permitam alternar entre "Foguetes" e "Avatares".
- Use o componente `Tabs` do shadcn para implementar a navegação entre as tabelas.
- Crie o widget `AvatarsTable` dentro de `ShopPage` para exibir a lista de avatares em formato de tabela.
- O widget `AvatarsTable` deve ser composto por:
  - `useAvatarsTable.ts`: Hook que gerencia o estado de busca, ordenação e paginação, utilizando `useCache` com a chave `CACHE.avatarsTable.key`.
  - `AvatarsTableView.tsx`: View que renderiza a tabela com os controles de busca e ordenação.
  - `index.tsx`: Componente que conecta o hook à view.
- A tabela deve ter as seguintes colunas:
  - Nome
  - Imagem (usando `StorageImage` com `folder='avatars'`)
  - Preço
  - Ações
- Ações:
  - Editar
  - Excluir
- Os botões de ação devem estar apenas visíveis, nada de integração com REST.
- A tabela deve estar paginada com até 10 itens por página.
- A tabela deve conter os filtros de busca (com debounce de 500ms) e ordenação (ascending/descending por preço).
- Use o widget `Pagination` para a paginação.
- Adicione a constante `avatarsTable` em `apps/studio/src/constants/cache.ts` com a chave `'avatars-table'`.