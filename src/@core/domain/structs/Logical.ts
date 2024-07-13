import { BooleanValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type LogicalProps = {
  value: boolean
}

export class Logical extends BaseStruct<LogicalProps> {
  readonly value: boolean

  constructor(props: LogicalProps) {
    super(props)
    this.value = props.value
  }

  static create(key: string, value: boolean): Logical {
    new BooleanValidation(value, key).validate()

    return new Logical({ value })
  }

  get true() {
    return this.value
  }

  get false() {
    return !this.value
  }
}
