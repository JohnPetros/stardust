import { Sorter } from '@stardust/core/global/structures'

type Params = {
  sorter: Sorter
  onSort: (sorter: Sorter) => void
}

export const useSortableColumn = ({ sorter, onSort }: Params) => {
  function handleSortChange(value: string) {
    onSort(Sorter.create(value))
  }

  const currentValue = sorter.isAscending.value
    ? 'ascending'
    : sorter.isDescending.value
      ? 'descending'
      : 'none'

  return {
    handleSortChange,
    currentValue,
  }
}
