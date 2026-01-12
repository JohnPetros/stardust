# Spec para uso de query string na página de desafios

`Status`: ✅ Concluído
`Application`: Studio

## Objetivo

Aplicar o estado dos filtros por query string na página de gestão de desafios.
Isso permitirá que os usuários compartilhem URLs com filtros ativos e que o estado da página persista após recarregamentos.

## Implementação Realizada

### Camada UI

#### useChallengesPage ✅

O hook `useChallengesPage` foi refatorado para utilizar hooks de query string em vez de `useState`, permitindo sincronização completa do estado com a URL.

**Estados migrados para query strings:**
- ✅ `search`: Texto de busca (parâmetro `q`)
- ✅ `difficulty`: Filtro de dificuldade (parâmetro `difficulty`)
- ✅ `visibility`: Filtro de visibilidade (parâmetro `visibility`)
- ✅ `selectedCategories`: Lista de IDs de categorias selecionadas (parâmetro `categories`)
- ✅ `page`: Número da página atual (parâmetro `page`)
- ✅ `itemsPerPage`: Quantidade de itens por página (parâmetro `limit`)
- ✅ `upvotesCountOrder`: Ordenação por votos positivos (parâmetro `upvotesCountOrder`)
- ✅ `downvoteCountOrder`: Ordenação por votos negativos (parâmetro `downvoteCountOrder`)
- ✅ `completionCountOrder`: Ordenação por número de conclusões (parâmetro `completionCountOrder`)
- ✅ `postingOrder`: Ordenação por data de postagem (parâmetro `postingOrder`)

#### ChallengesPageView ✅

O componente de visualização **não precisou de alterações**, pois a interface do hook (`filters`, `pagination`, `orders`) foi mantida compatível.

#### Hooks Utilizados

**useQueryStringParam** ✅
Hook para sincronizar estados do tipo string com a URL.
Assinatura: `useQueryStringParam(key: string, initialValue: string)`

**useQueryNumberParam** ✅
Hook para sincronizar estados numéricos com a URL.
Assinatura: `useQueryNumberParam(key: string, initialValue: number)`

**useQueryStringArrayParam** ✅
Hook para sincronizar arrays de strings com a URL. Utilizado para o filtro de `categories`.
Assinatura: `useQueryStringArrayParam(key: string, initialValue: string[])`

## Referência de Implementação

### useUsersPage

O hook `useUsersPage` foi usado como referência (template) para a refatoração, seguindo o mesmo padrão de implementação.

**Padrões seguidos do `useUsersPage`:**
- ✅ Uso de `useQueryStringParam` para busca ('q') e filtros simples
- ✅ Uso de `useQueryNumberParam` para paginação ('page', 'limit')
- ✅ Uso de `useQueryStringArrayParam` para listas ('categories')
- ✅ Lógica de resetar a página para 1 (`setPage(1)`) sempre que um filtro é alterado
- ✅ Uso de `useDebounce` em conjunto com o parâmetro de busca da URL

## Mapeamento de Parâmetros na URL

| Estado (Variable) | Parâmetro URL | Hook Utilizado | Valor Default | Status |
| :--- | :--- | :--- | :--- | :---: |
| `search` | `q` | `useQueryStringParam` | `''` | ✅ |
| `page` | `page` | `useQueryNumberParam` | `1` | ✅ |
| `itemsPerPage` | `limit` | `useQueryNumberParam` | `25` | ✅ |
| `difficulty` | `difficulty` | `useQueryStringParam` | `'any'` | ✅ |
| `visibility` | `visibility` | `useQueryStringParam` | `'all'` | ✅ |
| `selectedCategories` | `categories` | `useQueryStringArrayParam` | `[]` | ✅ |
| `upvotesCountOrder` | `upvotesCountOrder` | `useQueryStringParam` | `'any'` | ✅ |
| `downvoteCountOrder` | `downvoteCountOrder` | `useQueryStringParam` | `'any'` | ✅ |
| `completionCountOrder`| `completionCountOrder`| `useQueryStringParam` | `'any'` | ✅ |
| `postingOrder` | `postingOrder` | `useQueryStringParam` | `'descending'` | ✅ |

## Regras de Comportamento Implementadas

### 1. Reset de Paginação ✅
- Ao alterar `search`, `difficulty`, `visibility` ou `selectedCategories`, a página é resetada para `1`
- Ao alterar a ordenação de qualquer coluna, a página é resetada para `1`
- Implementado através dos handlers `handleSearchChange`, `handleDifficultyChange`, `handleVisibilityChange`, `handleCategoriesChange` e `handleOrderChange`

### 2. Debounce ✅
- `useDebounce` aplicado ao estado `search` retornado pelo hook de query string
- `debouncedSearch` é derivado do `search` e usado nas dependências do `useCache`
- Delay de 500ms mantido para evitar requisições excessivas

### 3. Compatibilidade ✅
- Todas as funções exportadas pelo hook (`handleSearchChange`, `toggleCategory`, etc.) continuam funcionando
- Os novos estados baseados em URL são atualizados através dos setters retornados pelos hooks de query string
- Interface pública do hook permanece inalterada

## Benefícios Alcançados

✅ **Persistência**: Estado persiste após recarregar a página  
✅ **Compartilhamento**: URLs podem ser compartilhadas com filtros ativos  
✅ **Navegação**: Botões voltar/avançar do browser funcionam corretamente  
✅ **UX**: Experiência do usuário melhorada com estado preservado  
✅ **Compatibilidade**: Nenhuma alteração necessária nos componentes consumidores
