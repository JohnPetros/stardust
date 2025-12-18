# Páginas de loja

## Objetivo

Separar os gerenciadores de cada item de loja em páginas separadas. Atualmente, todos os gerenciadores estão na mesma página. Todas as operações de gestão da loja já estão funcionais.

módulo: `shop`

## Status: Em andamento

## Camada App

- Crie a rota para a página de insígnias com o path `/shop/insignias` na constante `ROUTES`.
- Crie a rota para a página de foguetes com o path `/shop/rockets` na constante `ROUTES`.
- Crie a rota para a página de avatares com o path `/shop/avatars` na constante `ROUTES`.

## Camada UI

### InsigniasPage

- Crie o widget `InsigniasPage` que representa a página de insígnias.
- Coloque o `InsigniasTable` dentro do `InsigniasPage`, mantendo todas as operações de CRUD de insígnias intactas.

### RocketsPage

- Crie o widget `RocketsPage` que representa a página de foguetes.
- Coloque o `RocketsTable` dentro do `RocketsPage`, mantendo todas as operações de CRUD de foguetes intactas.

### AvatarsPage 

- Crie o widget `AvatarsPage` que representa a página de avatares.
- Coloque o `AvatarsTable` dentro do `AvatarsPage`, mantendo todas as operações de CRUD de avatares intactas.

### Sidebar

- Atualize os links para cada página criada. Atualmente há apenas um link para a página de loja.
