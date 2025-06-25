import type { ListingOrder } from '@stardust/core/global/structures'
import { useState } from 'react'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function usePriceOrderSelect(
  onPriceOrderChange: (ListingOrder: ListingOrder) => void,
) {
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('Menor preço')

  function handleListingOrderSelectChange(ListingOrder: ListingOrder) {
    setPriceOrder(ListingOrder.isAscending.isTrue ? 'Menor preço' : 'Maior preço')
    onPriceOrderChange(ListingOrder)
  }

  return {
    priceOrder,
    handleListingOrderSelectChange,
  }
}
