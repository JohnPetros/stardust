'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useRocketsList } from './useRocketsList'
import { RocketsListView } from './RocketsListView'

export const RocketsList = () => {
  const { shopService } = useRest()
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
