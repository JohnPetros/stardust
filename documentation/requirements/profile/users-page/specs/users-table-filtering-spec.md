# Especificação técnica de filtragem da tabela de usuários

Status: `Concluído`
Application: `studio`

## Objetivo

Deve ser acrescentado a filtragem de lista de usuários pelas seguintes
propriedades:

- unlockedStarCountSorter (Número de Estrelas Desbloqueadas)
- unlockedAchievementCountSorter (Número de Conquistas Desbloqueadas)
- completedChallengeCountSorter (Número de Desafios Completados)

Também deve ser possível filtrar os usuários pelo status que verifica que se o usuário já completou o espaço ou não.
Também deve ser possível filtrar os usuário pela seleção de insígnias.
Também deve ser possível filtrar os usuários pelo periodo que engloba a data de criação dos usuários.


## Pacote Core

- Use a interface `ProfileService`, responsável em receber os parâmetros de filtragem e retornar os usuários filtrados da API REST.
- Use `User`, entidade que representa um usuário.
- Use `PaginationResponse`, entidade que representa uma resposta de paginação.
- Use a structure `Sorter`.

## Pacote REST

- Modifique o método `fetchUsersList` do service `ProfileService` para ser possível enviar os parâmetros de filtragem para a API REST.  

## Camada UI

### SortableColumn

- Crie o widget no módulo global `SortableColumn` como componente, que deve ser responsável em executar callback quando clicado. 
- Deve possuir um status como icone que deve indicar se a coluna está ordenada em ordem crescente ou decrescente (setas), ou nada quando não estiver aplicando ordenação
- Modifique o widget `Icon`, acrecentando setas de ordenação

### Widget UsersTable

- Modifique o cabeçalhos das colunas acrescentando o widget `SortableColumn`
- Cada `SortableColumn` deve receber o callback de uma função handler, que, por sua vez, deve refazer o fetching de usuários com `ProfileService`

### Widget UsersTableSkeleton

- Crie o componente `UsersTableSkeleton` em `UsersTable`
- Deve simular a tabela original com pelo menos 10 linhas e todas as colunas
- Deve ser usado quando a tabela estiver em estado de carregamento

### Widget PeriodPicker

- Modifique para seja possível coletar as datas de início e fim (startDate e endDate)
- Adicione-o no widget de `UsersPage`

## Widget InsigniaRolesSelect

- Crie o widget dento de `UsersPage` usando o componente do Shadcn `DropdownMenu` como base
- Deve ser possível selecionar/remover uma ou mais insígnias como checkbox
- Adicione um callback para filtrar os usuários em `UsersPage`

### Widget Pagination

- Modifique para seja possível paginar em número de página especifico
- Modifique para seja possível selecionar o número de itens por página
- Adcione callbacks para as duas propriedades acima

