import { DraggableItem } from './DraggableItem'
import type { DropZone } from './DropZone'
import { ShuffledList } from './ShuffledList'

type ItemDTO = {
  index: number
  label: string
}

export class DragAndDrop {
  private constructor(readonly items: DraggableItem[]) {}

  static create(itemsDTO: ItemDTO[]): DragAndDrop {
    const shuffledList = ShuffledList.create(itemsDTO)

    return new DragAndDrop(
      shuffledList.items.map((item, index) =>
        DraggableItem.create({
          index: item.index,
          label: item.label,
          dropZoneIndex: index,
          originalDropZoneIndex: index,
        }),
      ),
    )
  }

  dragItem(item: DraggableItem, dropZone: DropZone): DragAndDrop {
    if (dropZone.isBank.isTrue) {
      const updatedItem = item.setDropZone(item.originalDropZoneIndex)
      return this.updateItem(updatedItem)
    }

    if (dropZone.isSlot.isTrue && dropZone.hasItem.isTrue) {
      const dropZoneItem = this.getItemByDropZone(dropZone.index)

      if (!dropZoneItem) return this.clone()

      if (item.isDropped.isFalse) return this.swapItemsDropZone(item, dropZoneItem)

      return this.swapItems(item, dropZoneItem)
    }

    const updatedItem = item.setDropZone(dropZone.index)
    return this.updateItem(updatedItem)
  }

  getIemByIndex(index: number): DraggableItem | null {
    return this.items.find((item) => item.index === index) ?? null
  }

  getItemByDropZone(dropZoneindex: number): DraggableItem | null {
    return this.items.find((item) => item.dropZoneIndex === dropZoneindex) ?? null
  }

  private swapItemsDropZone(
    firstItem: DraggableItem,
    secondItem: DraggableItem,
  ): DragAndDrop {
    const updatedFirstItem = firstItem.setDropZone(secondItem.dropZoneIndex)
    const updatedSecondItem = secondItem.setDropZone(firstItem.dropZoneIndex)

    return this.updateItem(updatedFirstItem).updateItem(updatedSecondItem)
  }

  private swapItems(firstItem: DraggableItem, secondItem: DraggableItem): DragAndDrop {
    const updatedFirstItem = firstItem.setDropZone(secondItem.dropZoneIndex)
    const updatedSecondItem = secondItem.setDropZone(secondItem.originalDropZoneIndex)

    return this.updateItem(updatedFirstItem).updateItem(updatedSecondItem)
  }

  private updateItem(item: DraggableItem): DragAndDrop {
    return this.clone(
      this.items.map((currentItem) =>
        currentItem.index === item.index ? item : currentItem,
      ),
    )
  }

  private clone(items: DraggableItem[] = []): DragAndDrop {
    return new DragAndDrop([...this.items, ...items])
  }
}
