'use client'

import { SnippetCard } from './SnippetCard'
import { useSnippetsList } from './useSnippetsList'

export function SnippetsList() {
  const { handleDeleteSnippetDelete, snippets, isLoading } = useSnippetsList()

  return (
    <div className='mx-auto mt-3 max-w-4xl'>
      <div className='grid grid-cols-2 gap-2'>
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            id={snippet.id}
            title={snippet.title.value}
            onDelete={handleDeleteSnippetDelete}
          />
        ))}
      </div>
    </div>
  )
}
