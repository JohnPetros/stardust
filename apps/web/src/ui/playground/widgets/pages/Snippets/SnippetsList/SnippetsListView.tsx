import type { Snippet } from '@stardust/core/playground/entities'

import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { SnippetCard } from './SnippetCard'
import { SnippetCardsSkeleton } from '../SnippetCardsSkeleton'

type Props = {
  snippets: Snippet[]
  page: number
  itemsPerPage: number
  totalItemsCount: number
  isLoading: boolean
  onDeleteSnippet: (deletedSnippetId: string) => void
  onPaginationPageChange: (page: number) => void
}

export const SnippetsListView = ({
  snippets,
  page,
  itemsPerPage,
  totalItemsCount,
  isLoading,
  onDeleteSnippet,
  onPaginationPageChange,
}: Props) => {
  return (
    <div className='mx-auto mt-3 w-full max-w-4xl px-6 md:px-0'>
      <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        {isLoading && <SnippetCardsSkeleton />}

        {!isLoading &&
          snippets.map((snippet) => (
            <li key={snippet.id.value}>
              <SnippetCard
                snippetId={snippet.id.value}
                snippetTitle={snippet.title.value}
                onDeleteSnippet={onDeleteSnippet}
              />
            </li>
          ))}

        {!isLoading && snippets.length === 0 && (
          <p className='col-span-2 text-center text-gray-500 text-lg font-medium'>
            Você não criou nenhum snippet ainda 😢.
          </p>
        )}
      </ul>
      <Pagination
        page={page}
        itemsPerPage={itemsPerPage}
        totalItemsCount={totalItemsCount}
        onPageChange={onPaginationPageChange}
      />
    </div>
  )
}
