import type { ListingOrder } from '@stardust/core/global/types'
import { useState } from 'react'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function usePriceOrderSelect(
  onPriceOrderChange: (listingOrder: ListingOrder) => void,
) {
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('Menor preço')

  function handleListingOrderSelectChange(listingOrder: ListingOrder) {
    setPriceOrder(listingOrder === 'ascending' ? 'Menor preço' : 'Maior preço')
    onPriceOrderChange(listingOrder)
  }

  return {
    priceOrder,
    handleListingOrderSelectChange,
  }
}
