# Spec de uso de Query Strings para filtragem de desafios

Status: `Em desenvolvimento`
Application: `studio`

## Objetivo

Implementar a persistencia dos filtros e paginação na listagem de desafios por meio de query strings. Isso permitirá que os usuários compartilhem links com filtros específicos aplicados e mantenham o estado ao recarregar a página.

## Camada UI

### Hooks de Query String

Utilize os seguintes hooks para gerenciar o estado da aplicação em sincronia com a URL:

-   `useQueryStringParam`: Para estados do tipo string.
-   `useQueryNumberParam`: Para estados do tipo number.
-   `useQueryStringArrayParam`: Para estados do tipo array de strings.

### Widget ChallengesPage (ou useChallengesPage.ts)

Refatore (ou implemente) o hook `useChallengesPage` para utilizar os hooks de query string acima para os seguintes estados, garantindo compatibilidade com os filtros visuais existentes (`Search`, `Select` de Dificuldade e `Dropdown` de Categorias):

| Estado | Query Param Key | Tipo (Hook) | Valor Default |
| :--- | :--- | :--- | :--- |
| `search` | `q` | `useQueryStringParam` | `''` |
| `page` | `page` | `useQueryNumberParam` | `1` |
| `itemsPerPage` | `limit` | `useQueryNumberParam` | `10` |
| `difficulty` | `difficulty` | `useQueryStringParam` | `'any'` |
| `selectedCategories` | `categories` | `useQueryStringArrayParam` | `[]` |

### Observações

-   Certifique-se de que a alteração de qualquer filtro reset a página para 1 (exceto quando o próprio parâmetro `page` for alterado).
-   Garanta que o `Debounce` continue funcionando para o campo de busca, atualizando a query string apenas após o delay.
-   Para o filtro `difficulty`, os valores esperados podem ser `'easy'`, `'medium'`, `'hard'`, ou `'any'`.
-   Para o filtro `selectedCategories`, trata-se de um array de IDs de categorias selecionadas.
-   A tabela de desafios deve estar compatível com o widget `Pagination` recentemente refatorado, passando corretamente as props:
    -   `page`: página atual.
    -   `totalPages`: total de páginas disponíveis.
    -   `totalItemsCount`: total de itens disponíveis.
    -   `itemsPerPage`: itens por página.
    -   `itemsPerPageOptions`: opções de itens por página.
    -   `onPrevPage`: função para ir para a página anterior.
    -   `onNextPage`: função para ir para a próxima página.
    -   `onPageChange`: função para alterar diretamente a página.
    -   `onItemsPerPageChange`: função para alterar a quantidade de itens por página.
