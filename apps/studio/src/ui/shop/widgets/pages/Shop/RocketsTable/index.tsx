import { RocketsTableView } from './RocketsTableView'
import { useRocketsTable } from './useRocketsTable'
import type { ShopService } from '@stardust/core/shop/interfaces'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'

type Props = {
  shopService: ShopService
}

export const RocketsTable = ({ shopService }: Props) => {
  const toastProvider = useToastProvider()
  const uiProvider = useUiProvider()
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
  } = useRocketsTable({ shopService, toastProvider, uiProvider })

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
