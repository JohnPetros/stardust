'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useSnippetsList } from './useSnippetsList'
import { SnippetsListView } from './SnippetsListView'

export const SnippetsList = () => {
  const { playgroundService } = useRestContext()
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
