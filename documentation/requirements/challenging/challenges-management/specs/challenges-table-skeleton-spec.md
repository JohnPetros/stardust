# Spec para o skeleton da tabela de desafios

`Application`: Studio
`Status`: ✅ Concluído

## Objetivo

Renderizar um estado de carregamento da tabela de desafios em formato de skeleton, contendo 10 linhas de desafios, substituindo o loader circular atual.

## O que já existe?

### Camada UI

#### ChallengesPage
Página que consome o `useChallengesPage` e renderiza a `ChallengesTable`.

#### ChallengesTable
Atualmente, quando a propriedade `isLoading` é verdadeira, exibe apenas um componente de `Loading` centralizado.
Localização: `apps/studio/src/ui/global/widgets/components/ChallengesTable/ChallengesTableView.tsx`

## O que deve ser feito?

### 1. Criar o widget `ChallengesTableSkeleton`
Criar o diretório e arquivo: `apps/studio/src/ui/global/widgets/components/ChallengesTable/ChallengesTableSkeleton/ChallengesTableSkeletonView.tsx`.

Este widget deve replicar a estrutura da `ChallengesTable` (cabeçalhos e colunas), mas preenchendo as células com componentes `Skeleton` do shadcn/ui.

**Estrutura da Tabela:**
- Deve conter os mesmos cabeçalhos:
  - Título
  - Autor
  - Dificuldade
  - Data de Postagem
  - Visibilidade
  - Downvotes
  - Upvotes
  - Qtd. de usuários que completaram
  - Link

**Conteúdo do Skeleton (para cada uma das 10 linhas):**

| Coluna | Componente Skeleton Sugerido |
| :--- | :--- |
| **Título** | `<Skeleton className='h-4 w-48' />` |
| **Autor** | Flex container com: `<Skeleton className='w-8 h-8 rounded-full' />` (Avatar) e `<Skeleton className='h-4 w-24' />` (Nome) |
| **Dificuldade** | `<Skeleton className='h-5 w-16 rounded-full' />` |
| **Data de Postagem** | `<Skeleton className='h-4 w-36' />` |
| **Visibilidade** | `<Skeleton className='h-5 w-16 rounded-full' />` |
| **Downvotes** | `<Skeleton className='h-4 w-8' />` |
| **Upvotes** | `<Skeleton className='h-4 w-8' />` |
| **Qtd. de usuários...** | `<Skeleton className='h-4 w-8' />` |
| **Link** | `<Skeleton className='h-8 w-8 rounded-md' />` |

### 2. Atualizar `ChallengesTable`
No arquivo `ChallengesTableView.tsx`:
- Importar o `ChallengesTableSkeletonView`.
- Substituir a renderização condicional do `isLoading`. Ao invés de exibir o `div` com `<Loading />`, deve exibir `<ChallengesTableSkeletonView />`.

## Usar como base

#### UsersPage
Exemplo de página que gerencia estados de loading.

#### UsersTable
Exemplo de tabela que implementa o padrão de skeleton.
- Arquivo: `apps/studio/src/ui/global/widgets/components/UsersTable/UsersTableSkeleton/UsersTableSkeletonView.tsx`

#### UsersTableSkeleton
Componente de referência para a estrutura e uso das classes do `Skeleton`.
