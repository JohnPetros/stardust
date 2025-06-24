import type { Logical } from './Logical'
import { List } from './List'
import { ShuffledList } from './ShuffledList'
import { AppError } from '../errors'
import type { Integer } from './Integer'
import type { Text } from './Text'

type Item = {
  originalPosition: Integer
  label: Text
}

export class SortableList {
  private constructor(readonly items: Item[]) {}

  static create(items: Item[]): SortableList {
    return new SortableList(ShuffledList.create(items).items)
  }

  static isSoratableList(list: unknown): list is SortableList {
    return list instanceof SortableList
  }

  moveItem(fromPosition: Integer, toPosition: Integer): SortableList {
    const currentItems = [...this.items]
    const fromIndex = this.getItemIndex(fromPosition)
    const toIndex = this.getItemIndex(toPosition)
    const item = currentItems.splice(fromIndex, 1)[0]
    if (!item) throw new Error()
    currentItems.splice(toIndex, 0, item)
    return new SortableList(currentItems)
  }

  getItemByPosition(position: Integer): Item {
    const item = this.items.find(
      (item) => item.originalPosition.isEqualTo(position).isTrue,
    )

    if (!item) throw new AppError('No item found at the given position')

    return item
  }

  isEqualTo(otherList: SortableList): Logical {
    return List.create(
      this.orderedItems.map((item) => item.label.value),
    ).isStrictlyEqualTo(List.create(otherList.items.map((item) => item.label.value)))
  }

  get orderedItems(): Item[] {
    const items = [...this.items]
    return items.sort((a, b) => a.originalPosition.value - b.originalPosition.value)
  }

  private getItemIndex(itemOriginalPosition: Integer): number {
    return this.items.findIndex(
      (item) => item.originalPosition.isEqualTo(itemOriginalPosition).isTrue,
    )
  }
}
