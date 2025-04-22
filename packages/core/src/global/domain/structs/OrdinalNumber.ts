import { NumberValidation } from '../../libs'
import { Logical } from './Logical'

type OrdinalNumberProps = {
  key: string
  value: number
}

export class OrdinalNumber {
  readonly key: string
  readonly value: number

  private constructor(props: OrdinalNumberProps) {
    this.key = props.key
    this.value = props.value
  }

  static create(value: number, key = 'Número ordinal') {
    new NumberValidation(value, key).min(1).validate()

    return new OrdinalNumber({ key, value })
  }

  incrementOne() {
    return new OrdinalNumber({ key: this.key, value: this.value + 1 })
  }

  decrementOne() {
    return new OrdinalNumber({ key: this.key, value: this.value - 1 })
  }

  isGreaterThan(ordinalNumber: OrdinalNumber) {
    return Logical.create(this.value > ordinalNumber.value)
  }

  isLessThan(ordinalNumber: OrdinalNumber) {
    return Logical.create(this.value < ordinalNumber.value)
  }
}
