import { NumberValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type IntegerProps = {
  value: number
}

export class Integer extends BaseStruct<IntegerProps> {
  readonly value: number

  private constructor(props: IntegerProps) {
    super(props)
    this.value = props.value
  }

  static create(key: string, value: number) {
    new NumberValidation(value, key)

    return new Integer({ value })
  }

  increment(value: number) {
    return new Integer({ ...this.props, value: this.value + value })
  }
}
