import type { Sorter } from '@stardust/core/global/structures'
import { SortableColumnView } from './SortableColumnView'
import { useSortableColumn } from './useSortableColumn'

type Props = {
  label: string
  sorter: Sorter
  onSort: (sorter: Sorter) => void
}

export const SortableColumn = (props: Props) => {
  const sortableColumn = useSortableColumn(props)

  return <SortableColumnView {...props} {...sortableColumn} />
}
