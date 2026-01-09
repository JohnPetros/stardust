# Especificação técnica de ordenação de listagem de usuários

## Objetivo

Deve ser acrescentado a ordenação de lista de usuários pelas seguintes
propriedades:

- Level (Nível)
- Weekly XP (XP Semanal)
- Unlocked Star Count (Número de Estrelas Desbloqueadas)
- Unlocked Achievement Count (Número de Conquistas Desbloqueadas)
- Completed Challenge Count (Número de Desafios Completados)

`Status`: Concluído
`App`: Server

## Pacote Core

- Use a structure `Sorter`, que representa o tipo de ordenação.
- Use o use case `ListUsersUseCase`, que lista os usuários.

## Pacote Validation

- Crie o global schema `sorterSchema`, que valida o tipo de ordenação ('none', 'ascending', 'descending').

## Camada App

- Adicione ao schema do endpoint GET `/users`, do UsersRouter o sorteSchema.

## Camada REST

- Adicione as propriedades `levelSorter`, `weeklyXpSorter`, `unlockedStarCountSorter`, `unlockedAchievementCountSorter`, `completedChallengeCountSorter` ao schema do controller `ListUsersController`.

## Camada de banco de dados

- Modifique o método `findMany` do repositório `SupabaseUsersRepository` para receber os parâmetros de ordenação utilizando o client `supabase`. 