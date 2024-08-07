import { DragAndDrop } from '../DragAndDrop'
import { DraggableItemsFaker, DropZoneFaker } from './fakers'

describe('DragAndDrop struct', () => {
  it('should get item by index', () => {
    const dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ index: 1 }),
      DraggableItemsFaker.fakeDTO({ index: 2 }),
      DraggableItemsFaker.fakeDTO({ index: 3 }),
    ])

    expect(dragAndDrop.getIemByIndex(2)).toEqual(dragAndDrop.items[1])
  })

  it('should get item by drop zone index', () => {
    const dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({ dropZoneIndex: 1 }),
      DraggableItemsFaker.fakeDTO({ dropZoneIndex: 2 }),
      DraggableItemsFaker.fakeDTO({ dropZoneIndex: 3 }),
    ])

    expect(
      dragAndDrop.getItemByDropZone(dragAndDrop.items[1].dropZoneIndex.value),
    ).toEqual(dragAndDrop.items[1])
  })

  it('should set item drop zone index to over drop zone index', () => {
    const overDropZoneIndex = 10

    const dragAndDrop = DragAndDrop.create([
      DraggableItemsFaker.fakeDTO({
        index: 1,
        dropZoneIndex: 1,
        originalDropZoneIndex: 1,
      }),
    ])

    const dropZone = DropZoneFaker.fake({ type: 'slot', index: overDropZoneIndex })

    const newDragAndDrop = dragAndDrop.dragItem(dragAndDrop.items[0], dropZone)

    newDragAndDrop.getIemByIndex(1)

    expect(newDragAndDrop.getIemByIndex(1)?.dropZoneIndex).toEqual(overDropZoneIndex)
  })
})
