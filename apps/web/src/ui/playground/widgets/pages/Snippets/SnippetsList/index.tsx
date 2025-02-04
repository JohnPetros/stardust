'use client'

import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { SnippetCard } from './SnippetCard'
import { useSnippetsList } from './useSnippetsList'
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
    <div className='mx-auto mt-3 w-full max-w-4xl px-6 md:px-0'>
      <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        {isLoading && <SnippetCardsSkeleton />}

        {!isLoading &&
          snippets.map((snippet) => (
            <>
              <li key={snippet.id}>
                <SnippetCard
                  id={snippet.id}
                  title={snippet.title.value}
                  onDelete={handleDeleteSnippetDelete}
                />
              </li>
              <li key={snippet.id}>
                <SnippetCard
                  id={snippet.id}
                  title={snippet.title.value}
                  onDelete={handleDeleteSnippetDelete}
                />
              </li>
            </>
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
        onPageChange={handlePaginationPageChange}
      />
    </div>
  )
}
