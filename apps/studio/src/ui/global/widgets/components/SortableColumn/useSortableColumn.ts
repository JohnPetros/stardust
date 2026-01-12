import { ListingOrder } from '@stardust/core/global/structures'

type Params = {
  order: ListingOrder
  onOrderChange: (order: ListingOrder) => void
}

export const useSortableColumn = ({ order, onOrderChange }: Params) => {
  function handleOrderChange(value: string) {
    onOrderChange(ListingOrder.create(value))
  }

  const currentValue = order.isAscending.value
    ? 'ascending'
    : order.isDescending.value
      ? 'descending'
      : 'any'

  return {
    handleOrderChange,
    currentValue,
  }
}
