import { DraggableItemsFaker } from './fakers'

describe('DraggableItem struct', () => {
  it('should set its drop zone index', () => {
    const draggableItem = DraggableItemsFaker.fake({
      dropZoneIndex: 1,
    })

    expect(draggableItem.dropZoneIndex.value).toBe(1)

    const newDraggableItem = draggableItem.setDropZone(2)

    expect(newDraggableItem.dropZoneIndex.value).toBe(2)
  })

  it('should be "dropped" if its drop zone index is different than its original drop zone index', () => {
    let isDropped = DraggableItemsFaker.fake({
      dropZoneIndex: 1,
      originalDropZoneIndex: 2,
    }).isDropped

    expect(isDropped.isTrue).toBeTruthy()

    isDropped = DraggableItemsFaker.fake({
      dropZoneIndex: 1,
      originalDropZoneIndex: 1,
    }).isDropped

    expect(isDropped.isFalse).toBeTruthy()
  })
})
