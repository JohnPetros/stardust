import { StringValidation } from '@/@core/lib/validation'
import { Logical } from './Logical'

type DropZoneType = 'slot' | 'bank'

type DropZoneProps = {
  index: number
  type: DropZoneType
  hasItem: Logical
}

export class DropZone {
  readonly index: number
  readonly type: 'slot' | 'bank'
  readonly hasItem: Logical

  private constructor(props: DropZoneProps) {
    this.index = props.index
    this.type = props.type
    this.hasItem = props.hasItem
  }

  static create(index: number, type: string, hasItem: boolean) {
    if (!DropZone.isDropZoneType(type)) throw new Error()

    return new DropZone({
      index,
      type,
      hasItem: Logical.create('drop zone has item?', hasItem),
    })
  }

  static isDropZoneType(type: string): type is DropZoneType {
    new StringValidation(type).oneOf(['slot', 'bank']).validate()

    return true
  }

  get isBank(): Logical {
    return Logical.create('Is drop zone type bank?', this.type === 'bank')
  }

  get isSlot(): Logical {
    return Logical.create('Is drop zone type slot?', this.type === 'slot')
  }
}
