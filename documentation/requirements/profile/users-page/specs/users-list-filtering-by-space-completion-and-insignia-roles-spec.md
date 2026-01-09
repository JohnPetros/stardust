# Especificação técnica de filtro de listagem de usuários por status de espaço e insígnias

`Status`: ✅ Concluído
`Application`: Server

## Objetivo 

Deve ser possível filtrar os usuários pelos usuários que já completaram o espaço ou que possuem determinada insígnias.

## Pacote Core

- Use a structure `SpaceCompletionStatus`, que representa o status de conclusão do espaço.
- Use a structure `InsigniaRole`, que representa o tipo de insígnia.
- Use o use case `ListUsersUseCase`, que lista os usuários.

## Pacote Validation

- Crie o schema no módulo profile `spaceCompletionStatusSchema`, que valida o status de conclusão do espaço ('all', 'completed', 'not-completed').
- Crie o schema no módulo global `insigniaRoleSchema`, que valida o tipo de insígnia ('engineer')

## Camada REST

- Modifique o schema do controller `FetchUsersListController` para receber os parâmetros `spaceCompletionStatus` e `insigniaRoles`

## Camada App

- Modifique o endpoint GET `/users` do UsersRouter para receber os parâmetros `spaceCompletionStatus` e `insigniaRoles`

## Camada de banco de dados

- Modifique o método `findMany` do repositório `SupabaseUsersRepository` para receber os parâmetros `spaceCompletionStatus` e `insigniaRoles` e filtrar os usuários de acordo com os parâmetros
  - Filtro por status de conclusão: usa a coluna virtual `verify_user_space_completion`
  - Filtro por insígnias: usa `.in('insignias.role', insigniaRoleValues)`
