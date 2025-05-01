import { NumberValidation } from '@/global/libs'
import { Logical } from './Logical'

export class Integer {
  private constructor(readonly value: number) {}

  static create(value: number, key = 'Número inteiro') {
    new NumberValidation(value, key).min(0).validate()

    return new Integer(value)
  }

  plus(integer: Integer) {
    return new Integer(this.value + integer.value)
  }

  minus(integer: Integer) {
    return new Integer(this.value - integer.value)
  }

  multiply(integer: Integer) {
    return new Integer(this.value * integer.value)
  }

  isEqualTo(integer: Integer) {
    return Logical.create(this.value === integer.value)
  }

  increment() {
    return new Integer(this.value + 1)
  }

  dencrement() {
    return new Integer(this.value - 1)
  }
}
