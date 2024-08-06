import { Logical } from './Logical'

type DraggableItemProps = {
  index: number
  label: string
  dropZoneIndex: number
  originalDropZoneIndex: number
}

export class DraggableItem {
  readonly index: number
  readonly label: string
  readonly dropZoneIndex: number
  readonly originalDropZoneIndex: number

  constructor(props: DraggableItemProps) {
    this.index = props.index
    this.label = props.label
    this.dropZoneIndex = props.dropZoneIndex
    this.originalDropZoneIndex = props.originalDropZoneIndex
  }

  static create(props: DraggableItemProps): DraggableItem {
    return new DraggableItem(props)
  }

  setDropZone(dropZoneIndex: number): DraggableItem {
    return this.clone({ dropZoneIndex })
  }

  get isDropped(): Logical {
    return Logical.create('Is draggable item dropped?', this.dropZoneIndex !== null)
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
