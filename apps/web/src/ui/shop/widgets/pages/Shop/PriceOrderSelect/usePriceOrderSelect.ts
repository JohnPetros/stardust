import type { ListOrder } from '@stardust/core/global/types'
import { useState } from 'react'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function usePriceOrderSelect(onPriceOrderChange: (listOrder: ListOrder) => void) {
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('Menor preço')

  function handleListOrderSelectChange(listOrder: ListOrder) {
    setPriceOrder(listOrder === 'ascending' ? 'Menor preço' : 'Maior preço')
    onPriceOrderChange(listOrder)
  }

  return {
    priceOrder,
    handleListOrderSelectChange,
  }
}
