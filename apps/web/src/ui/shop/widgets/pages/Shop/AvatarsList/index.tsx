'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useAvatarsList } from './useAvatarsList'
import { AvatarsListView } from './AvatarsListView'

export const AvatarsList = () => {
  const { shopService } = useRestContext()
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
