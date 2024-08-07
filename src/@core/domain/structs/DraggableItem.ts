import { Integer } from './Integer'
import { Logical } from './Logical'
import { Text } from './Text'

type DraggableItemDTO = {
  index: number
  label: string
  dropZoneIndex: number
  originalDropZoneIndex: number
}

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

  static create(dto: DraggableItemDTO): DraggableItem {
    return new DraggableItem({
      index: Integer.create('Dragglabe index', dto.index),
      dropZoneIndex: Integer.create('Dragglabe drop zone index', dto.dropZoneIndex),
      label: Text.create(dto.label),
      originalDropZoneIndex: Integer.create(
        'Dragglabe original drop zone index',
        dto.originalDropZoneIndex,
      ),
    })
  }

  setDropZone(dropZoneIndex: Integer): DraggableItem {
    return this.clone({ dropZoneIndex })
  }

  get isDropped(): Logical {
    return Logical.create(
      'Is draggable item dropped?',
      this.dropZoneIndex.value !== this.originalDropZoneIndex.value,
    )
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
