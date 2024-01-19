import { useState } from 'react'

import { Order } from '@/@types/order'

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
