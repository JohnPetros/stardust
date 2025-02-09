import type { Logical } from './Logical'
import { List } from './List'
import { ShuffledList } from './ShuffledList'
import type { OrdinalNumber } from './OrdinalNumber'
import { AppError } from '#global/errors'

type Item = {
  originalPosition: OrdinalNumber
  label: string
}

export class SortableList {
  private constructor(readonly items: Item[]) {}

  static create(items: Item[]): SortableList {
    return new SortableList(ShuffledList.create(items).items)
    // return new SortableList(items)
  }

  static isSoratableList(list: unknown): list is SortableList {
    return list instanceof SortableList
  }

  moveItem(fromPosition: number, toPosition: number): SortableList {
    const currentItems = [...this.items]
    const fromIndex = this.getItemIndex(fromPosition)
    const toIndex = this.getItemIndex(toPosition)
    const item = currentItems.splice(fromIndex, 1)[0]
    if (!item) throw new Error()
    currentItems.splice(toIndex, 0, item)
    return new SortableList(currentItems)
  }

  getItemByPosition(position: number): Item {
    const item = this.items.find((item) => item.originalPosition.value === position)

    if (!item) throw new AppError('No item found at the given position')

    return item
  }

  isEqualTo(otherList: SortableList): Logical {
    return List.create(this.orderedItems).isEqualTo(List.create(otherList.items))
  }

  get orderedItems(): Item[] {
    const items = [...this.items]
    return items.sort((a, b) => a.originalPosition.value - b.originalPosition.value)
  }

  private getItemIndex(itemOriginalPosition: number): number {
    return this.items.findIndex(
      (item) => item.originalPosition.value === itemOriginalPosition,
    )
  }
}
