import { AppError } from '@/@core/errors/global/AppError'

import { DragAndDrop } from '../DragAndDrop'
import { DraggableItem } from '../DraggableItem'
import { DraggableItemsFaker, DropZoneFaker } from './fakers'

describe('DragAndDrop struct', () => {
  it('should get item by index if the item exists', () => {
    const fakeItemsDTO = [
      DraggableItemsFaker.fakeDTO({ index: 1 }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
    ]

    const dragAndDrop = DragAndDrop.create(fakeItemsDTO)

    const item = dragAndDrop.getItemByIndex(2)

    expect(item instanceof DraggableItem).toBeTruthy()
    expect(item?.index.value).toEqual(2)

    expect(dragAndDrop.getItemByIndex(4)).toBe(null)
  })

  it('should get item by drop zone index if the item exists', () => {
    const fakeItemsDTO = [
      DraggableItemsFaker.fakeDTO({ index: 1, originalDropZoneIndex: 1 }),
      DraggableItemsFaker.fakeDTO({ index: 2, originalDropZoneIndex: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3, originalDropZoneIndex: 3 }),
    ]

    const dragAndDrop = DragAndDrop.create(fakeItemsDTO)

    let item = dragAndDrop.getItemByIndex(2)
    if (!item) return

    item = dragAndDrop.getItemByDropZone(item.dropZoneIndex.value)

    expect(item instanceof DraggableItem).toBeTruthy()
    expect(item?.index.value).toEqual(2)

    expect(dragAndDrop.getItemByIndex(4)).toBe(null)
  })

  it('should make the current and origianl drop zone index are the same of all items on create', () => {
    const dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: 1 }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
      DraggableItemsFaker.fakeDTO({ index: 4 }),
    ])

    for (const item of dragAndDrop.items) {
      expect(item.dropZoneIndex.value).toBe(item.originalDropZoneIndex.value)
    }
  })

  it('should set item drop zone index to target drop zone index on drag', () => {
    const itemIndex = 1
    const targeDropZoneIndex = 1

    let dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: itemIndex }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
      DraggableItemsFaker.fakeDTO({ index: 4 }),
    ])

    let item = dragAndDrop.getItemByIndex(itemIndex)
    if (!item) return
    const dropZone = DropZoneFaker.fake({ type: 'slot', index: targeDropZoneIndex })

    dragAndDrop = dragAndDrop.dragItem(item, dropZone)
    item = dragAndDrop.getItemByIndex(itemIndex)
    if (!item) return

    expect(item.dropZoneIndex.value).toBe(targeDropZoneIndex)
  })

  it('should set item to its original drop zone index if the drop zone is a bank on drag', () => {
    const itemIndex = 1
    const targedropZoneIndex = 1

    let dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: itemIndex }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
      DraggableItemsFaker.fakeDTO({ index: 4 }),
    ])

    let item = dragAndDrop.getItemByIndex(itemIndex)
    if (!item) return
    let dropZone = DropZoneFaker.fake({ type: 'slot', index: targedropZoneIndex })

    dragAndDrop = dragAndDrop.dragItem(item, dropZone)
    if (!item) return
    item = dragAndDrop.getItemByIndex(itemIndex)
    if (!item) return
    const originalDropZoneIndex = item.originalDropZoneIndex
    expect(item.dropZoneIndex.value).toBe(targedropZoneIndex)

    dropZone = DropZoneFaker.fake({ type: 'bank' })

    dragAndDrop = dragAndDrop.dragItem(item, dropZone)
    item = dragAndDrop.getItemByIndex(itemIndex)
    if (!item) return
    expect(item.dropZoneIndex.value).toBe(originalDropZoneIndex.value)
  })

  it('should set the dropped item, that is the item in the target drop zone to its original drop zone index if the item that is being dragging is not in a slot drop zone on drag', () => {
    const itemIndex = 1
    const droppedItemIndex = 2
    const targedropZoneIndex = 1

    let dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: itemIndex }),
      DraggableItemsFaker.fakeDTO({ index: droppedItemIndex }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
      DraggableItemsFaker.fakeDTO({ index: 4 }),
    ])

    let item = dragAndDrop.getItemByIndex(itemIndex)
    let droppedItem = dragAndDrop.getItemByIndex(droppedItemIndex)
    let dropZone = DropZoneFaker.fake({ type: 'slot', index: targedropZoneIndex })
    if (!item || !droppedItem) return
    const droppedItemOriginalDropZoneIndex = droppedItem.originalDropZoneIndex

    dragAndDrop = dragAndDrop.dragItem(droppedItem, dropZone)
    item = dragAndDrop.getItemByIndex(itemIndex)
    droppedItem = dragAndDrop.getItemByIndex(droppedItemIndex)
    if (!item || !droppedItem) return

    expect(item.dropZoneIndex.value).not.toBe(targedropZoneIndex)
    expect(droppedItem.dropZoneIndex.value).toBe(targedropZoneIndex)

    dropZone = DropZoneFaker.fake({
      type: 'slot',
      index: targedropZoneIndex,
      hasItem: true,
    })

    dragAndDrop = dragAndDrop.dragItem(item, dropZone)
    item = dragAndDrop.getItemByIndex(itemIndex)
    droppedItem = dragAndDrop.getItemByIndex(droppedItemIndex)
    if (!item || !droppedItem) return

    expect(item.dropZoneIndex.value).toBe(targedropZoneIndex)
    expect(droppedItem.dropZoneIndex.value).toBe(droppedItemOriginalDropZoneIndex.value)
  })

  it('should swap the drop zone indexes if the item and the target drop zone\'s item are both "dropped" on drag', () => {
    const itemIndex = 1
    const dropZoneIndex = 1
    const targeDropZoneItemIndex = 2
    const targeDropZoneIndex = 2

    let dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: itemIndex }),
      DraggableItemsFaker.fakeDTO({ index: targeDropZoneItemIndex }),
    ])

    let item = dragAndDrop.getItemByIndex(itemIndex)
    let targeDropZoneItem = dragAndDrop.getItemByIndex(targeDropZoneItemIndex)
    if (!item || !targeDropZoneItem) return

    dragAndDrop = dragAndDrop
      .dragItem(
        item,
        DropZoneFaker.fake({ type: 'slot', index: dropZoneIndex, hasItem: false }),
      )
      .dragItem(
        targeDropZoneItem,
        DropZoneFaker.fake({ type: 'slot', index: targeDropZoneIndex, hasItem: false }),
      )

    item = dragAndDrop.getItemByIndex(itemIndex)
    targeDropZoneItem = dragAndDrop.getItemByIndex(targeDropZoneItemIndex)
    if (!item || !targeDropZoneItem) return

    expect(item.dropZoneIndex.value).toBe(dropZoneIndex)
    expect(targeDropZoneItem.dropZoneIndex.value).toBe(targeDropZoneIndex)

    dragAndDrop = dragAndDrop.dragItem(
      item,
      DropZoneFaker.fake({ type: 'slot', index: targeDropZoneItemIndex, hasItem: true }),
    )

    item = dragAndDrop.getItemByIndex(itemIndex)
    targeDropZoneItem = dragAndDrop.getItemByIndex(targeDropZoneItemIndex)
    if (!item || !targeDropZoneItem) return

    expect(item.dropZoneIndex.value).toBe(targeDropZoneIndex)
    expect(targeDropZoneItem.dropZoneIndex.value).toBe(dropZoneIndex)
  })

  it('should only get the indexes of dropped items', () => {
    let dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: 1 }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
    ])

    let item = dragAndDrop.getItemByIndex(1)
    if (!item) return

    dragAndDrop = dragAndDrop.dragItem(
      item,
      DropZoneFaker.fake({ type: 'slot', index: 1, hasItem: false }),
    )

    item = dragAndDrop.getItemByIndex(3)
    if (!item) return

    dragAndDrop = dragAndDrop.dragItem(
      item,
      DropZoneFaker.fake({ type: 'slot', index: 3, hasItem: false }),
    )

    expect(dragAndDrop.getDroppedItemDropZoneIndexes()).toEqual([1, 3])
  })
})
