import { useState } from 'react'

import type { Order } from '@/services/api/types/Order'

type PriceOrder = 'Menor preço' | 'Maior preço'

export function useSorters(onPriceOrderChange: (order: Order) => void) {
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('Menor preço')

  function handlePriceOrderSelectChange(order: Order) {
    setPriceOrder(order === 'ascending' ? 'Menor preço' : 'Maior preço')
    onPriceOrderChange(order)
  }

  return {
    priceOrder,
    handlePriceOrderSelectChange,
  }
}
