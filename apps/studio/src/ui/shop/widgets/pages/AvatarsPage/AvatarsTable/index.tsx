import { AvatarsTableView } from './AvatarsTableView'
import { useAvatarsTable } from './useAvatarsTable'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useRest } from '@/ui/global/hooks/useRest'

export const AvatarsTable = () => {
  const toastProvider = useToastProvider()
  const { shopService, storageService } = useRest()
  const {
    avatars,
    isLoading,
    searchInput,
    order,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    handleSearchChange,
    handleOrderChange,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreateAvatar,
    handleUpdateAvatar,
    handleDeleteAvatar,
  } = useAvatarsTable({ shopService, toastProvider, storageService })

  return (
    <AvatarsTableView
      avatars={avatars}
      isLoading={isLoading}
      searchInput={searchInput}
      order={order}
      page={page}
      totalPages={totalPages}
      totalItemsCount={totalItemsCount}
      itemsPerPage={itemsPerPage}
      onSearchChange={handleSearchChange}
      onOrderChange={handleOrderChange}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      onCreateAvatar={handleCreateAvatar}
      onUpdateAvatar={handleUpdateAvatar}
      onDeleteAvatar={handleDeleteAvatar}
    />
  )
}
