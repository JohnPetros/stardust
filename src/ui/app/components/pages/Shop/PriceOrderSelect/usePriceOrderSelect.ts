import { useState } from 'react'

import type { ListingOrder } from '@/@core/types'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function usePriceOrderSelect(
  onPriceOrderChange: (listingOrder: ListingOrder) => void
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
