import { Integer, Logical, Text } from '#global/structs'
import type { DragglableItemDto } from '#lesson/dtos'

type DraggableItemProps = {
  index: Integer
  label: Text
  dropZoneIndex: Integer
  originalDropZoneIndex: Integer
}

export class DraggableItem {
  readonly index: Integer
  readonly label: Text
  readonly dropZoneIndex: Integer
  readonly originalDropZoneIndex: Integer

  constructor(props: DraggableItemProps) {
    this.index = props.index
    this.label = props.label
    this.dropZoneIndex = props.dropZoneIndex
    this.originalDropZoneIndex = props.originalDropZoneIndex
  }

  static create(dto: DragglableItemDto): DraggableItem {
    return new DraggableItem({
      index: Integer.create(dto.index, 'Dragglabe index'),
      dropZoneIndex: Integer.create(dto.dropZoneIndex, 'Dragglabe drop zone index'),
      label: Text.create(dto.label),
      originalDropZoneIndex: Integer.create(
        dto.originalDropZoneIndex,
        'Dragglabe original drop zone index',
      ),
    })
  }

  setDropZone(dropZoneIndex: number): DraggableItem {
    return this.clone({ dropZoneIndex: Integer.create(dropZoneIndex, 'Drop zone index') })
  }

  get isDropped(): Logical {
    return Logical.create(this.dropZoneIndex.value !== this.originalDropZoneIndex.value)
  }

  private clone(props?: Partial<DraggableItemProps>) {
    return new DraggableItem({
      index: this.index,
      originalDropZoneIndex: this.originalDropZoneIndex,
      dropZoneIndex: this.dropZoneIndex,
      label: this.label,
      ...props,
    })
  }
}
