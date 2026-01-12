# Spec para uso de query string nas páginas da loja

`Status`: ✅ Concluído
`Application`: Studio

## Objetivo

Aplicar o estado dos filtros por query string nas páginas de gerenciamento da loja (Foguetes e Avatars).
Isso permitirá que os usuários compartilhem URLs com filtros ativos e que o estado da página persista após recarregamentos.

## Implementação

### Camada UI

#### useAvatarsTable ✅

O hook `useAvatarsTable` já foi refatorado para utilizar hooks de query string.

**Estados migrados para query strings:**
- ✅ `search`: Texto de busca (parâmetro `q`)
- ✅ `priceOrder`: Ordenação por preço (parâmetro `order`)
- ✅ `page`: Número da página atual (parâmetro `page`)
- ✅ `itemsPerPage`: Quantidade de itens por página (parâmetro `limit`)

#### useRocketsTable ✅

O hook `useRocketsTable` foi refatorado para utilizar hooks de query string em vez de `useState`.

**Estados migrados para query strings:**
- ✅ `search`: Texto de busca (parâmetro `q`)
- ✅ `priceOrder`: Ordenação por preço (parâmetro `priceOrder`)
- ✅ `page`: Número da página atual (parâmetro `page`)
- ✅ `itemsPerPage`: Quantidade de itens por página (parâmetro `limit`)

### Hooks Utilizados

**useQueryStringParam**
Hook para sincronizar estados do tipo string com a URL.
Assinatura: `useQueryStringParam(key: string, initialValue: string)`

**useQueryNumberParam**
Hook para sincronizar estados numéricos com a URL.
Assinatura: `useQueryNumberParam(key: string, initialValue: number)`

## Referência de Implementação

### useChallengesPage

O hook `useChallengesPage` serve como referência (template) para a refatoração.

**Padrões a seguir:**
- Uso de `useQueryStringParam` para busca e filtros simples
- Uso de `useQueryNumberParam` para paginação
- Lógica de resetar a página para 1 (`setPage(1)`) sempre que um filtro é alterado
- Uso de `useDebounce` em conjunto com o parâmetro de busca da URL

## Mapeamento de Parâmetros na URL

### Página de Avatars

| Estado (Variable) | Parâmetro URL | Hook Utilizado | Valor Default | Status |
| :--- | :--- | :--- | :--- | :---: |
| `search` | `q` | `useQueryStringParam` | `''` | ✅ |
| `page` | `page` | `useQueryNumberParam` | `1` | ✅ |
| `itemsPerPage` | `limit` | `useQueryNumberParam` | `10` | ✅ |
| `priceOrder` | `order` | `useQueryStringParam` | `'ascending'` | ✅ |

### Página de Rockets

| Estado (Variable) | Parâmetro URL | Hook Utilizado | Valor Default | Status |
| :--- | :--- | :--- | :--- | :---: |
| `search` | `q` | `useQueryStringParam` | `''` | ✅ |
| `page` | `page` | `useQueryNumberParam` | `1` | ✅ |
| `itemsPerPage` | `limit` | `useQueryNumberParam` | `10` | ✅ |
| `priceOrder` | `priceOrder` | `useQueryStringParam` | `'ascending'` | ✅ |

## Regras de Comportamento

### 1. Reset de Paginação
- Ao alterar `search` ou `priceOrder`, a página deve ser resetada para `1`
- Implementado através dos handlers de mudança de estado

### 2. Debounce
- `useDebounce` (ou `useDebounceValue`) deve ser aplicado ao estado `search` retornado pelo hook de query string
- Delay de 500ms recomendado

### 3. Compatibilidade
- A interface pública dos hooks (funções retornadas) deve permanecer compatível com os componentes de visualização (`AvatarsTableView`, `RocketsTableView`)

