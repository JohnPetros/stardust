# Spec para a coluna de ordenação na tabela de itens da loja

`Application`: Studio
`Status`: Concluído

## Objetivo

Adicionar a coluna de ordenação na coluna de preço na tabela de itens da loja (foguetes e avatares).

## O que já existe?

### Camada REST

- `ShopService`, service que lida com requisições de itens da loja.

### Camada UI

- `RocketsTable`, widget que renderiza a tabela de itens da loja.
- `SortableColumn`, componente que renderiza a coluna de ordenação.


## Usar como base

- `ChallengesTable`, widget que renderiza a tabela de desafios com colunas de ordenação.

## Alterações Realizadas

### Pacote Core

- ✅ Atualizado o `ListRocketsUseCase` para aceitar o parâmetro `priceOrder` (ListingOrder) no request ao invés de `order` genérico.
- ✅ Atualizado o tipo `ShopItemsListingParams` para incluir `priceOrder: ListingOrder` ao invés de `SortingParams`.
- ✅ Atualizados os testes unitários do `ListRocketsUseCase` para usar `priceOrder` em todas as chamadas do use case.

### Pacote Validation

- ✅ O schema `listingOrderSchema` já existia e foi reutilizado para validar o parâmetro `priceOrder`.

### Camada App

- ✅ Atualizado o `RocketsRouter` para importar e usar `listingOrderSchema` na validação do parâmetro `priceOrder` no endpoint GET `/rockets`.

### Camada REST

- ✅ Atualizado o `FetchRocketsListController` para receber `priceOrder` ao invés de `order` no schema.

### Camada de Banco de Dados

- ✅ Atualizado o método `findMany` do `SupabaseRocketsRepository` para:
  - Receber `priceOrder` ao invés de `order`
  - Aplicar ordenação apenas quando `priceOrder` não for `'any'`
  - Usar `priceOrder.isAscending.value` para determinar a direção da ordenação

### Camada UI (Studio)

#### `useRocketsTable`

- ✅ Renomeado o estado de `order` para `priceOrder`.
- ✅ Renomeado o handler de `handleOrderChange` para `handlePriceOrderChange`.
- ✅ Atualizado o retorno do hook para expor `priceOrder` e `handlePriceOrderChange`.
- ✅ Atualizada a chamada ao `shopService.fetchRocketsList` para passar `priceOrder`.

#### `RocketsTableView`

- ✅ Importado o componente `SortableColumn`.
- ✅ Substituído o `TableHead` da coluna "Preço" pelo componente `SortableColumn`.
- ✅ Passadas as props `label='Preço'`, `order={priceOrder}`, e `onOrderChange={onPriceOrderChange}` para o `SortableColumn`.
- ✅ Removido o componente `Select` de ordenação que estava no topo da tabela.
- ✅ Removidos os imports não utilizados (`Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`).
- ✅ Atualizado o tipo `Props` para usar `priceOrder` e `onPriceOrderChange`.

## Resultado

A tabela de foguetes agora possui uma coluna de preço ordenável, permitindo ao usuário ordenar os foguetes por preço de forma ascendente, descendente ou sem ordenação, diretamente através do cabeçalho da coluna, seguindo o mesmo padrão da tabela de desafios.
