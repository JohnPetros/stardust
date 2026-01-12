# Spec para skeleton loading nas tabelas da loja

`Status`: ✅ Concluído
`Application`: Studio

## Objetivo

Renderizar um estado de carregamento da tabela de foguetes e avatares em formato de skeleton, contendo 10 linhas de itens, substituindo o loader circular atual.

## O que já existe?

### Camada UI

- `RocketsPage`, página que gerencia a listagem de foguetes.
- `RocketsTable`, widget responsável por renderizar a tabela de foguetes.
- `AvatarsPage`, página que gerencia a listagem de avatares.
- `AvatarsTable`, widget responsável por renderizar a tabela de avatares.

Atualmente, quando `isLoading` é verdadeiro, ambas as tabelas exibem um `div` com o componente `Loading` centralizado.

Localização:
- `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketsTableView.tsx`
- `apps/studio/src/ui/shop/widgets/pages/AvatarsPage/AvatarsTable/AvatarsTableView.tsx`

## O que deve ser feito?

### 1. Criar o widget `RocketsTableSkeleton`

Criar o diretório e arquivo: `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketsTableSkeleton/RocketsTableSkeletonView.tsx`.

Este widget deve replicar a estrutura da `RocketsTable`, preenchendo as células com componentes `Skeleton`.

**Estrutura da Tabela:**
- Cabeçalhos: Nome, Imagem, Preço, Adquirido por padrão, Selecionado por padrão, Ações.

**Conteúdo do Skeleton (para cada uma das 10 linhas):**

| Coluna | Componente Skeleton Sugerido |
| :--- | :--- |
| **Nome** | `<Skeleton className='h-4 w-32' />` |
| **Imagem** | `<Skeleton className='w-12 h-12 rounded' />` |
| **Preço** | `<Skeleton className='h-4 w-12' />` |
| **Adquirido por padrão** | `<Skeleton className='h-5 w-10 rounded-full' />` |
| **Selecionado por padrão** | `<Skeleton className='h-5 w-10 rounded-full' />` |
| **Ações** | Flex container com: `<Skeleton className='h-8 w-16 rounded-md' />` e `<Skeleton className='h-8 w-16 rounded-md' />` |

### 2. Criar o widget `AvatarsTableSkeleton`

Criar o diretório e arquivo: `apps/studio/src/ui/shop/widgets/pages/AvatarsPage/AvatarsTable/AvatarsTableSkeleton/AvatarsTableSkeletonView.tsx`.

Este widget deve replicar a estrutura da `AvatarsTable`, similar ao `RocketsTableSkeleton` pois as colunas são idênticas.

**Estrutura da Tabela:**
- Cabeçalhos: Nome, Imagem, Preço, Adquirido por padrão, Selecionado por padrão, Ações.

**Conteúdo do Skeleton (para cada uma das 10 linhas):**
Mesmo padrão da tabela de foguetes.

### 3. Atualizar `RocketsTable` e `AvatarsTable`

Nos arquivos `RocketsTableView.tsx` e `AvatarsTableView.tsx`:
- Importar os respectivos componentes Skeleton (`RocketsTableSkeletonView`, `AvatarsTableSkeletonView`).
- Substituir a renderização condicional do loader. Exibir o componente Skeleton quando `isLoading` for `true`.

## Usar como referência

- `ChallengesTableSkeletonView`, widget responsável por renderizar a tabela de desafios em formato de skeleton.
- `UsersTableSkeletonView`, outro exemplo de implementação de skeleton em tabelas.

## Alterações Realizadas

### Camada UI (Studio)

#### `RocketsTableSkeleton`

- ✅ Criado o diretório `apps/studio/src/ui/shop/widgets/pages/RocketsPage/RocketsTable/RocketsTableSkeleton/`.
- ✅ Criado o arquivo `RocketsTableSkeletonView.tsx` com a estrutura da tabela e 10 linhas de skeleton.
- ✅ Criado o arquivo `index.tsx` para exportar o componente.
- ✅ Implementados os skeletons para todas as 6 colunas conforme especificado.

#### `AvatarsTableSkeleton`

- ✅ Criado o diretório `apps/studio/src/ui/shop/widgets/pages/AvatarsPage/AvatarsTable/AvatarsTableSkeleton/`.
- ✅ Criado o arquivo `AvatarsTableSkeletonView.tsx` com a estrutura da tabela e 10 linhas de skeleton.
- ✅ Criado o arquivo `index.tsx` para exportar o componente.
- ✅ Implementados os skeletons para todas as 6 colunas conforme especificado.

#### `RocketsTableView`

- ✅ Importado o componente `RocketsTableSkeleton`.
- ✅ Removido o import não utilizado de `Loading`.
- ✅ Substituída a renderização condicional do `isLoading` para exibir `<RocketsTableSkeleton />` ao invés do `div` com `<Loading />`.

#### `AvatarsTableView`

- ✅ Importado o componente `AvatarsTableSkeleton`.
- ✅ Removido o import não utilizado de `Loading`.
- ✅ Substituída a renderização condicional do `isLoading` para exibir `<AvatarsTableSkeleton />` ao invés do `div` com `<Loading />`.

### Pacote Core

#### Testes

- ✅ Atualizado o teste `ListAvatarsUseCase.test.ts` para usar `priceOrder` ao invés de `order`, corrigindo a falha de teste.

## Resultado

As tabelas de foguetes e avatares agora exibem um skeleton loading com 10 linhas durante o carregamento, proporcionando uma melhor experiência de usuário ao mostrar a estrutura da tabela enquanto os dados são carregados, ao invés de apenas um spinner centralizado.

