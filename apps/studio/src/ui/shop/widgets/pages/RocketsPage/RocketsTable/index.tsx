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
    priceOrder,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    handleSearchChange,
    handlePriceOrderChange,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreateRocket,
    handleUpdateRocket,
    handleDeleteRocket,
  } = useRocketsTable({ shopService, storageService, toastProvider })

  return (
    <RocketsTableView
      rockets={rockets}
      isLoading={isLoading}
      searchInput={searchInput}
      priceOrder={priceOrder}
      page={page}
      totalPages={totalPages}
      totalItemsCount={totalItemsCount}
      itemsPerPage={itemsPerPage}
      onSearchChange={handleSearchChange}
      onPriceOrderChange={handlePriceOrderChange}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      onCreateRocket={handleCreateRocket}
      onUpdateRocket={handleUpdateRocket}
      onDeleteRocket={handleDeleteRocket}
    />
  )
}
