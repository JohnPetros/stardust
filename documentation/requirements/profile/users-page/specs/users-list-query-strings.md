# Spec de uso de Query Strings para filtragem de usuários

Status: `Concluído`
Application: `studio`

## Objetivo

Implementar a persistencia dos filtros, paginação e ordenações na listagem de usuários por meio de query strings. Isso permitirá que os usuários compartilhem links com filtros específicos aplicados e mantenham o estado ao recarregar a página.

## Camada UI

### Hooks de Query String

Utilize os seguintes hooks para gerenciar o estado da aplicação em sincronia com a URL:

-   `useQueryStringParam`: Para estados do tipo string.
-   `useQueryNumberParam`: Para estados do tipo number.
-   `useQueryStringArrayParam`: Para estados do tipo array de strings.

### Widget UsersPage (useUsersPage.ts)

Refatore o hook `useUsersPage` para substituir o uso de `useState` pelos hooks de query string acima para os seguintes estados:

| Estado | Query Param Key | Tipo (Hook) | Valor Default |
| :--- | :--- | :--- | :--- |
| `search` | `q` | `useQueryStringParam` | `''` |
| `page` | `page` | `useQueryNumberParam` | `1` |
| `itemsPerPage` | `limit` | `useQueryNumberParam` | `10` |
| `spaceCompletionStatus` | `status` | `useQueryStringParam` | `'all'` |
| `insigniaRoles` | `roles` | `useQueryStringArrayParam` | `[]` |
| `creationPeriod.startDate` | `startDate` | `useQueryStringParam` | `''` |
| `creationPeriod.endDate` | `endDate` | `useQueryStringParam` | `''` |

#### Ordenação (Sorters)

Para os ordenadores, cada campo de ordenação deve ter seu próprio parâmetro de query string. Utilize `useQueryStringParam` para cada um, com valor default `'none'`.

| Estado (Sorter) | Query Param Key | Valores Possíveis |
| :--- | :--- | :--- |
| `sorters.level` | `levelSort` | `'asc'`, `'desc'`, `'none'` |
| `sorters.weeklyXp` | `xpSort` | `'asc'`, `'desc'`, `'none'` |
| `sorters.unlockedStarCount` | `starsSort` | `'asc'`, `'desc'`, `'none'` |
| `sorters.unlockedAchievementCount` | `achievementsSort` | `'asc'`, `'desc'`, `'none'` |
| `sorters.completedChallengeCount` | `challengesSort` | `'asc'`, `'desc'`, `'none'` |

### Observações

-   Certifique-se de que a alteração de qualquer filtro reset a página para 1 (exceto quando o próprio parâmetro `page` for alterado).
-   Integre as datas (`startDate` e `endDate`) corretamente com o objeto `Period` e o componente `PeriodPicker`.
-   Garanta que o `Debounce` continue funcionando para o campo de busca, atualizando a query string apenas após o delay.
