import { Integer, Logical } from '#global/structs'
import type { DropZoneDto } from '../../dtos'
import { StringValidation } from '../../../global/libs'

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
      index: Integer.create(dto.index, 'Índice da zona de drop'),
      hasItem: Logical.create(dto.hasItem, 'Zona de drop possui algum item'),
    })
  }

  static isDropZoneType(type: string): type is DropZoneType {
    new StringValidation(type).oneOf(['slot', 'bank']).validate()

    return true
  }

  get isBank(): Logical {
    return Logical.create(this.type === 'bank')
  }

  get isSlot(): Logical {
    return Logical.create(this.type === 'slot')
  }
}
