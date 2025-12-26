import { RocketsTableView } from './RocketsTableView'
import { useRocketsTable } from './useRocketsTable'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useRest } from '@/ui/global/hooks/useRest'

export const RocketsTable = () => {
  const toastProvider = useToastProvider()
  const { shopService, storageService } = useRest()
  const {
    rockets,
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
    handleCreateRocket,
    handleUpdateRocket,
    handleDeleteRocket,
  } = useRocketsTable({ shopService, storageService, toastProvider })

  return (
    <RocketsTableView
      rockets={rockets}
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
      onCreateRocket={handleCreateRocket}
      onUpdateRocket={handleUpdateRocket}
      onDeleteRocket={handleDeleteRocket}
    />
  )
}
