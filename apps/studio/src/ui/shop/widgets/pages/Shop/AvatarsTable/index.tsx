import { AvatarsTableView } from './AvatarsTableView'
import { useAvatarsTable } from './useAvatarsTable'
import type { ShopService } from '@stardust/core/shop/interfaces'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'

type Props = {
  shopService: ShopService
}

export const AvatarsTable = ({ shopService }: Props) => {
  const toastProvider = useToastProvider()

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
    handleCreateAvatar,
  } = useAvatarsTable({ shopService, toastProvider })

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
      onCreateAvatar={handleCreateAvatar}
    />
  )
}
