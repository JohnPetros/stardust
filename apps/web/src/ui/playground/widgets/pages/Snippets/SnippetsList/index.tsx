'use client'

import { SnippetCard } from './SnippetCard'
import { useSnippetsList } from './useSnippetsList'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { SnippetCardsSkeleton } from '../SnippetCardsSkeleton'

export function SnippetsList() {
  const {
    snippets,
    page,
    itemsPerPage,
    totalItemsCount,
    isLoading,
    handleDeleteSnippetDelete,
    handlePaginationPageChange,
  } = useSnippetsList()

  return (
    <div className='mx-auto mt-3 max-w-4xl'>
      <ul className='grid grid-cols-2 gap-2'>
        {isLoading && <SnippetCardsSkeleton />}

        {!isLoading &&
          snippets.map((snippet) => (
            <li key={snippet.id}>
              <SnippetCard
                id={snippet.id}
                title={snippet.title.value}
                onDelete={handleDeleteSnippetDelete}
              />
            </li>
          ))}

        {!isLoading && snippets.length === 0 && (
          <p className='text-gray-500 text-center text-lg font-medium'>
            Você não criou nenhum snippet ainda 😢.
          </p>
        )}
      </ul>
      <Pagination
        page={page}
        itemsPerPage={itemsPerPage}
        totalItemsCount={totalItemsCount}
        onPageChange={handlePaginationPageChange}
      />
    </div>
  )
}
