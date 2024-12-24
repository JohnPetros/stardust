import type { DropZoneDto } from '#dtos'
import { StringValidation } from '#libs'
import { Logical } from '../../../modules/global/domain/structs/Logical'
import { Integer } from '../../../modules/global/domain/structs/Integer'

type DropZoneType = 'slot' | 'bank'

type DropZoneProps = {
  index: Integer
  type: DropZoneType
  hasItem: Logical
}

export class DropZone {
  readonly index: Integer
  readonly type: 'slot' | 'bank'
  readonly hasItem: Logical

  private constructor(props: DropZoneProps) {
    this.index = props.index
    this.type = props.type
    this.hasItem = props.hasItem
  }

  static create(dto: DropZoneDto) {
    if (!DropZone.isDropZoneType(dto.type)) throw new Error()

    return new DropZone({
      type: dto.type,
      index: Integer.create('Drop zone index', dto.index),
      hasItem: Logical.create('Drop zone has item?', dto.hasItem),
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
