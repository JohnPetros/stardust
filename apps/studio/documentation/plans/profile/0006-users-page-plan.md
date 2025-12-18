# Página de usuários

## Objetivo

Implementar a página de gestão de usuários na aplicação studio.

módulo: `profile`

status: `Concluído`

## Core

- `User`, entidade que representa um usuário.
- `UserDto`, dto que serve para cria um usuário.
- `ProfileService`, service que serve para interagir com as rotas backend relacionadas ao módulo `profile`.
- `NavigationProvider`, interface responsável em fazer a navegação de ui
- `RestResponse`, objeto que serve para representar a resposta de uma requisição rest.
- `PaginationResponse`, objeto que serve para representar a resposta de uma requisição rest paginada.

## Camada App

### `UsersRoute`

- [x] Crie a rota  para renderizar a página de usuários chamada `UsersRoute`.
- [x] Não precisa de loader ou action.
- [x] Deve renderizar o widget `UsersPage`.
- [x] Adicione o path para rote (`/profile/users`) na constant `ROUTES`.

## Constantes

- [x] Adicione o path para rote (`/profile/users`) na constant `ROUTES`, cuja propriedade seja `profile.users`.
- [x] Adicione a propriedade `webAppUrl` na constant `ENV`, cujo valor seja `VITE_WEB_APP_URL`.

## Camada UI

### `UsersPage`

- [x] Crie o widget `UsersPage`.
- [x] no hook do `UsersPage` faça o fetching dos dados de usuários usando o service `profileService` via método `fetchUsersList`, vindo do hook `useRest`.
- [x] Coloque um text input para filtrar os usuários por nome.
- [x] O filtro por nome deve conter um debounce de 500ms.

### `UsersTable`

- [x] Transforme o widget `UsersTable` em um widget global chamado `UsersTable` e o use-o no widget `UsersPage` e no widget de `DashboardPage`.
- [x] Adicione a coluna de link que servirá para redirecionar para a página de perfil do usuário na aplicação `web` (`${webAppUrl}/profile/${user.slug.value}`).
- [x] A tabela de usuários deve estar paginada e com no máximo 10 itens por página.
- [x] Use o widget global de paginação `Pagination` para paginar os usuários.

### `useNavigationProvider`

- [x] Implemente o método `openExternal` para redirecionar para aplicações externas.

## Fluxo de usuário

### Testes Manuais

1. [x] **Navegação**:
    - Acessar a rota `/profile/users`.
    - Verificar se a página carrega corretamente.

2. [x] **Listagem**:
    - Verificar se a tabela exibe os usuários retornados pela API.
    - Testar paginação: mudar de página e verificar se novos dados são carregados.

3. [x] **Filtro**:
    - Digitar um nome no campo de busca.
    - Verificar se a lista é atualizada com os resultados filtrados.

4. [x] **Link Externo**:
    - Clicar no link/botão para o perfil do usuário.
    - Verificar se abre uma nova aba com a URL correta (`webAppUrl/profile/slug`).

5. [x] **Dashboard**:
    - Verificar se a tabela "Recent Users" no Dashboard continua funcionando corretamente após a refatoração do componente de tabela.
