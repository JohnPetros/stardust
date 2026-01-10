# Especificação técnica de filtro de listagem de usuários por período de criação de conta

`Status`: Em desenvolvimento
`Application`: Server

## Objetivo 

Deve ser possível filtrar os usuários pelos usuários que já completaram o espaço ou que possuem determinada insígnias.

## Pacote Core

- Use a structure `SpaceCompletionStatus`, que representa o status de conclusão do espaço.
- Use a structure `InsigniaRole`, que representa o tipo de insígnia.
- Use o use case `ListUsersUseCase`, que lista os usuários.

## Pacote Validation

- Crie o schema no módulo global `dateRangeSchema`, que valida datas como string.

## Camada REST

- Modifique o schema do controller `FetchUsersListController` para receber os parâmetros `createdAtStartDate` e `createdAtEndDate`, ambos como string.

## Camada App

- Modifique o endpoint GET `/users` do UsersRouter para receber os parâmetros `createdAtStartDate` e `createdAtEndDate`, ambos `dateRangeSchema`

## Camada de banco de dados

- Modifique o método `findMany` do repositório `SupabaseUsersRepository` para receber os creationPeriod e filtrar os usuários de acordo com o intervalo de datas usando a coluna `created_at`