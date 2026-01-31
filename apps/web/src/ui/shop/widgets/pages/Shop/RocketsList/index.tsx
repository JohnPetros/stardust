'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useRocketsList } from './useRocketsList'
import { RocketsListView } from './RocketsListView'

export const RocketsList = () => {
  const { shopService } = useRestContext()
  const {
    totalRocketsCount,
    rocketsPerPage,
    rockets,
    page,
    handlePageChange,
    handlePriceOrderChange,
    handleSearchChange,
  } = useRocketsList(shopService)

  return (
    <RocketsListView
      onSearchChange={handleSearchChange}
      onPriceOrderChange={handlePriceOrderChange}
      onPageChange={handlePageChange}
      totalRocketsCount={totalRocketsCount}
      rocketsPerPage={rocketsPerPage}
      page={page}
      rockets={rockets}
    />
  )
}
