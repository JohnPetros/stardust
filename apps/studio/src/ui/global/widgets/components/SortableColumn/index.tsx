import type { ListingOrder } from '@stardust/core/global/structures'
import { SortableColumnView } from './SortableColumnView'
import { useSortableColumn } from './useSortableColumn'

type Props = {
  label: string
  order: ListingOrder
  onOrderChange: (order: ListingOrder) => void
}

export const SortableColumn = (props: Props) => {
  const sortableColumn = useSortableColumn(props)

  return <SortableColumnView {...props} {...sortableColumn} />
}
