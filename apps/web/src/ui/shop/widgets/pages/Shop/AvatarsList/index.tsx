'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAvatarsList } from './useAvatarsList'
import { AvatarsListView } from './AvatarsListView'

export const AvatarsList = () => {
  const { shopService } = useRest()
  const {
    page,
    avatars,
    totalAvatarsCount,
    avatarsPerPage,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  } = useAvatarsList(shopService)

  return (
    <AvatarsListView
      totalAvatarsCount={totalAvatarsCount}
      avatarsPerPage={avatarsPerPage}
      page={page}
      avatars={avatars}
      onSearchChange={handleSearchChange}
      onPriceOrderChange={handlePriceOrderChange}
      onPageChange={handlePageChange}
    />
  )
}
