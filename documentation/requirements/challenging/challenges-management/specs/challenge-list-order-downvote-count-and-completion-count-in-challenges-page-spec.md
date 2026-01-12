# Spec para ordenação de desafios por quantidade de downvotes e usuários que completaram o desafio na página de gestão de desafios

`Application`: Studio
`Status`: ✅ Concluído

## Objetivo

Adicionar novos meios de ordenação na lista de desafios, sendo por quantidade de downvotes (`downvoteCountOrder`) e por quantidade de usuários que completaram o desafio (`completionCountOrder`).

## O que já existia

### Pacote Core

- ✅ `ChallengingService`, interface que define o contrato para fazer requisições para o serviço de desafios.
- ✅ `ListChallengesUseCase`, caso de uso que já suporta os parâmetros de ordenação `downvoteCountOrder` e `completionCountOrder`.

### Camada REST

- ✅ `FetchChallengesListController`, controlador que já aceita e repassa os parâmetros de ordenação para o caso de uso.

### Camada UI

- ✅ `SortableColumn`, componente que define como deve ser feito a ordenação de uma coluna.

## O que foi implementado

### Camada UI

#### ChallengesTableView

- ✅ Adicionadas propriedades `orders` e `onOrderChange` ao componente.
- ✅ Substituídos os cabeçalhos estáticos por `SortableColumn`:
  - ✅ **Upvotes** - Ordenação por quantidade de upvotes
  - ✅ **Downvotes** - Ordenação por quantidade de downvotes
  - ✅ **Qtd. de usuários que completaram** - Ordenação por quantidade de conclusões
  - ✅ **Data de Postagem** - Ordenação por data de criação
- ✅ Atualizado tipo `Props.orders` para incluir:
  ```typescript
  orders: {
    upvotesCount: ListingOrder
    downvoteCount: ListingOrder
    completionCount: ListingOrder
    posting: ListingOrder
  }
  ```

#### useChallengesPage

- ✅ Adicionados estados para gerenciar a ordenação:
  - `upvotesCountOrder` (padrão: 'any')
  - `downvoteCountOrder` (padrão: 'any')
  - `completionCountOrder` (padrão: 'any')
  - `postingOrder` (padrão: 'descending')
- ✅ Implementada função `handleOrderChange` que atualiza os estados de ordenação
- ✅ Atualizada a chamada `service.fetchChallengesList` para enviar os parâmetros de ordenação
- ✅ Criado objeto `orders` usando `useMemo` com instâncias de `ListingOrder` para cada coluna
- ✅ Expostos `orders` e `handleOrderChange` no retorno do hook

#### ChallengesPageView

- ✅ Consumidos `orders` e `handleOrderChange` do hook `useChallengesPage`
- ✅ Passadas essas propriedades para o componente `ChallengesTableView`
- ✅ Adicionado filtro de visibilidade com opções:
  - **Todos** - Mostra desafios públicos e privados
  - **Público** - Mostra apenas desafios públicos
  - **Privado** - Mostra apenas desafios privados

## Funcionalidades Extras Implementadas

Além do objetivo principal, foram implementadas as seguintes funcionalidades:

1. **Ordenação por Upvotes** - Coluna adicional ordenável
2. **Ordenação por Data de Postagem** - Permite ordenar por mais recentes/antigos
3. **Filtro de Visibilidade** - Permite filtrar desafios por público/privado/todos

## Padrão Utilizado

A implementação seguiu o padrão de `UsersPageView` e `UsersTableView`, garantindo consistência na arquitetura da aplicação.

## Resumo

✅ **4 colunas ordenáveis implementadas**:
- Upvotes
- Downvotes  
- Quantidade de Conclusões
- Data de Postagem

✅ **Filtros implementados**:
- Busca por título
- Dificuldade (Fácil, Médio, Difícil)
- Visibilidade (Público, Privado, Todos)
- Categorias (seleção múltipla)

✅ **Paginação funcional** com reset ao alterar filtros

✅ **Código seguindo padrões do projeto**:
- Function declarations ao invés de arrow functions
- Uso de `useMemo` para otimização
- Separação de responsabilidades (hook + view)
