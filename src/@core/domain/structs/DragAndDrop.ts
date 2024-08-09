import type { DragglableItemDTO } from '@/@core/dtos'
import { DraggableItem } from './DraggableItem'
import type { DropZone } from './DropZone'
import { ShuffledList } from './ShuffledList'
import { AppError } from '@/@core/errors/global/AppError'

type DragAndDropProps = {
  items: DraggableItem[]
}

export class DragAndDrop {
  static readonly FIRST_ORIGINAL_DROP_ZONE_INDEX = 100
  readonly items: DraggableItem[]

  private constructor(props: DragAndDropProps) {
    this.items = props.items
  }

  static create(itemsDTO: DragglableItemDTO[]): DragAndDrop {
    const shuffledList = ShuffledList.create(itemsDTO)

    const items = shuffledList.items.map((item, index) => {
      const originalDropZoneIndex = DragAndDrop.FIRST_ORIGINAL_DROP_ZONE_INDEX + index

      return DraggableItem.create({
        index: item.index,
        label: item.label,
        dropZoneIndex: originalDropZoneIndex,
        originalDropZoneIndex: originalDropZoneIndex,
      })
    })

    return new DragAndDrop({ items })
  }

  dragItem(item: DraggableItem, dropZone: DropZone): DragAndDrop {
    if (dropZone.isBank.isTrue) {
      const updatedItem = item.setDropZone(item.originalDropZoneIndex.value)
      return this.updateItem(updatedItem)
    }

    if (dropZone.isSlot.isTrue && dropZone.hasItem.isTrue) {
      const dropZoneItem = this.getItemByDropZone(dropZone.index.value)

      if (!dropZoneItem) return this.clone()

      if (item.isDropped.isFalse) {
        return this.swapItems(item, dropZoneItem)
      }

      return this.swapItemsDropZone(item, dropZoneItem)
    }

    const updatedItem = item.setDropZone(dropZone.index.value)
    return this.updateItem(updatedItem)
  }

  getItemByIndex(index: number): DraggableItem {
    const item = this.items.find((item) => item.index.value === index) ?? null
    if (!item) throw new AppError('Drag and Drop item not found')
    return item
  }

  getItemByDropZone(dropZoneindex: number): DraggableItem {
    const item = this.items.find((item) => item.dropZoneIndex.value === dropZoneindex)
    if (!item) throw new AppError('Drag and Drop item not found')
    return item
  }

  getItemDropZoneIndexes(): number[] {
    return this.items.map((item) => item.dropZoneIndex.value)
  }

  private swapItems(firstItem: DraggableItem, secondItem: DraggableItem): DragAndDrop {
    const updatedFirstItem = firstItem.setDropZone(secondItem.dropZoneIndex.value)
    const updatedSecondItem = secondItem.setDropZone(
      secondItem.originalDropZoneIndex.value,
    )

    return this.updateItem(updatedFirstItem).updateItem(updatedSecondItem)
  }

  private swapItemsDropZone(
    firstItem: DraggableItem,
    secondItem: DraggableItem,
  ): DragAndDrop {
    const updatedFirstItem = firstItem.setDropZone(secondItem.dropZoneIndex.value)
    const updatedSecondItem = secondItem.setDropZone(firstItem.dropZoneIndex.value)

    return this.updateItem(updatedFirstItem).updateItem(updatedSecondItem)
  }

  private updateItem(item: DraggableItem): DragAndDrop {
    return this.clone({
      items: this.items.map((currentItem) =>
        currentItem.index === item.index ? item : currentItem,
      ),
    })
  }

  private clone(props?: Partial<DragAndDropProps>): DragAndDrop {
    return new DragAndDrop({ items: this.items, ...props })
  }
}
