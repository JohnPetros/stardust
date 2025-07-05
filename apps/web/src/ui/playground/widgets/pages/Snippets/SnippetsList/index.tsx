'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRest } from '@/ui/global/hooks/useRest'
import { useSnippetsList } from './useSnippetsList'
import { SnippetsListView } from './SnippetsListView'

export const SnippetsList = () => {
  const { playgroundService } = useRest()
  const {
    snippets,
    page,
    itemsPerPage,
    totalItemsCount,
    isLoading,
    handleDeleteSnippet,
    handlePaginationPageChange,
  } = useSnippetsList(playgroundService)

  return (
    <SnippetsListView
      snippets={snippets}
      page={page}
      itemsPerPage={itemsPerPage}
      totalItemsCount={totalItemsCount}
      isLoading={isLoading}
      onDeleteSnippet={handleDeleteSnippet}
      onPaginationPageChange={handlePaginationPageChange}
    />
  )
}
