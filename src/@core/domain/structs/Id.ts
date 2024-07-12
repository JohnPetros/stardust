import { StringValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type IdProps = {
  value: string
}

export class Id extends BaseStruct<IdProps> {
  readonly value: string

  private constructor(props: IdProps) {
    super(props)
    this.value = props.value
  }

  static create(value: string) {
    new StringValidation(value, 'Id').id()

    return new Id({ value })
  }
}
