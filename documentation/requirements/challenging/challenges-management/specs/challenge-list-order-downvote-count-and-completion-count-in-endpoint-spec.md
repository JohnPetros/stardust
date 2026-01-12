# Spec para ordenação de desafios por quantidade de downvotes e usuários que completaram o desafio

`Application`: Server
`Status`: ✅ Concluído

## Objetivo

Adicionar novos meios de ordenação na lista de desafios, sendo por quantidade de downvotes (`downvoteCountOrder`) e por quantidade de usuários que completaram o desafio (`completionCountOrder`).

## Pacote Validation

### listingOrderSchema

- ✅ Criado o schema `listingOrderSchema` com valores `['ascending', 'descending', 'any']` e default `'any'`.
- ✅ Exportado em `/packages/validation/src/modules/global/schemas/index.ts`.

## Pacote Core

### ListChallengesUseCase

- ✅ O usecase já recebia os parâmetros `downvoteCountOrder` e `completionCountOrder` no seu request.
- ✅ Os parâmetros são corretamente instanciados como `ListingOrder` e passados para o método `findMany` do repositório.

### ChallengesListParams

- ✅ O tipo já incluía `downvoteCountOrder: ListingOrder` e `completionCountOrder: ListingOrder`.

## Camada REST

### FetchChallengesListController

- ✅ Atualizado o `Schema` do controller para incluir `downvoteCountOrder: string` e `completionCountOrder: string` no objeto `queryParams`.
- ✅ No método `handle`, as propriedades são extraídas de `http.getQueryParams()` e passadas para o `ListChallengesUseCase`.

## Camada App

### ChallengesRouter

- ✅ Importado `listingOrderSchema` de `@stardust/validation/global/schemas`.
- ✅ Na rota `registerFetchChallengesListRoute` (`/list`), atualizado o schema de validação:
  - ✅ Adicionado `downvoteCountOrder: listingOrderSchema`.
  - ✅ Adicionado `completionCountOrder: listingOrderSchema`.
  - ✅ Também atualizado `upvotesCountOrder` e `postingOrder` para usar `listingOrderSchema` (consistência).

## Camada de Banco de dados

### SupabaseChallengesRepository

- ✅ Atualizada a assinatura do método `findMany` para aceitar `downvoteCountOrder` e `completionCountOrder`.
- ✅ Na construção da query:
  - ✅ Verificação se `downvoteCountOrder` não é `any`. Se não for, aplica `.order('downvotes_count', { ascending: downvoteCountOrder.isAscending.isTrue })`.
  - ✅ Verificação se `completionCountOrder` não é `any`. Se não for, aplica `.order('completions_count', { ascending: completionCountOrder.isAscending.isTrue })`.
  - ✅ Removida duplicação do bloco de ordenação por `upvotesCountOrder`.

## Resumo da Implementação

A funcionalidade foi implementada com sucesso em todas as camadas:

1. **Validation**: Criado e exportado `listingOrderSchema`.
2. **Core**: Tipos já suportavam os novos parâmetros.
3. **REST**: Controller atualizado para receber e passar os parâmetros.
4. **App**: Router atualizado com validação usando `listingOrderSchema`.
5. **Database**: Repositório atualizado para aplicar ordenação por `downvotes_count` e `completions_count`.

Os endpoints agora suportam ordenação por:
- `upvotesCountOrder` - Quantidade de upvotes
- `downvoteCountOrder` - Quantidade de downvotes
- `completionCountOrder` - Quantidade de usuários que completaram
- `postingOrder` - Data de postagem

Todos usando os valores: `ascending`, `descending`, ou `any` (padrão).