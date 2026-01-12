# Especificação técnica de ordenação de listagem de usuários

`Status`: Concluído 
`App`: Server

## Objetivo

Deve ser acrescentado a ordenação de lista de usuários pelas seguintes
propriedades:

- Level (Nível)
- Weekly XP (XP Semanal)
- Unlocked Star Count (Número de Estrelas Desbloqueadas)
- Unlocked Achievement Count (Número de Conquistas Desbloqueadas)
- Completed Challenge Count (Número de Desafios Completados)

## Pacote Core

- Use a structure `Sorter`, que representa o tipo de ordenação.
- Use o use case `ListUsersUseCase`, que lista os usuários.
- Atualize os testes unitários do `ListUsersUseCase` para incluir os parâmetros
  de ordenação (`levelOrder`, `weeklyXpOrder`, `unlockedStarCountOrder`,
  `unlockedAchievementCountOrder`, `completedChallengeCountOrder`) nas
  chamadas do use case.

## Pacote Validation

- Crie o global schema `sorterSchema`, que valida o tipo de ordenação ('none',
  'ascending', 'descending').

## Camada App

- Adicione ao schema do endpoint GET `/users`, do UsersRouter o sorteSchema.

## Camada REST

- Adicione as propriedades `levelOrder`, `weeklyXpOrder`,
  `unlockedStarCountOrder`, `unlockedAchievementCountOrder`,
  `completedChallengeCountOrder` ao schema do controller `ListUsersController`.

## Camada de banco de dados

- Modifique o método `findMany` do repositório `SupabaseUsersRepository` para
  receber os parâmetros de ordenação utilizando o client `supabase`.
