import type { ListingOrder } from '@stardust/core/global/types'
import { useState } from 'react'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function usePriceOrderSelect(
  onPriceOrderChange: (ListingOrder: ListingOrder) => void,
) {
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('Menor preço')

  function handleListingOrderSelectChange(ListingOrder: ListingOrder) {
    setPriceOrder(ListingOrder === 'ascending' ? 'Menor preço' : 'Maior preço')
    onPriceOrderChange(ListingOrder)
  }

  return {
    priceOrder,
    handleListingOrderSelectChange,
  }
}
