import { NumberValidation } from '#global/libs/index'
import { Logical } from './Logical'

export class Integer {
  private constructor(readonly value: number) {}

  static create(value: number, key = 'Número inteiro') {
    new NumberValidation(value, key).min(0).validate()

    return new Integer(value)
  }

  plus(integer: Integer) {
    return Integer.create(this.value + integer.value)
  }

  minus(integer: Integer) {
    return Integer.create(this.value - integer.value)
  }

  multiply(integer: Integer) {
    return Integer.create(this.value * integer.value)
  }

  isEqualTo(integer: Integer) {
    return Logical.create(this.value === integer.value)
  }

  increment() {
    return Integer.create(this.value + 1)
  }

  decrement() {
    return Integer.create(this.value - 1)
  }

  isGreaterThan(integer: Integer) {
    return Logical.create(this.value > integer.value)
  }

  isGreaterThanOrEqualTo(integer: Integer) {
    return Logical.create(this.value >= integer.value)
  }

  isLessThan(integer: Integer) {
    return Logical.create(this.value < integer.value)
  }

  isLessOrEqualTo(integer: Integer) {
    return Logical.create(this.value <= integer.value)
  }

  isDifferentFrom(integer: Integer) {
    return Logical.create(this.value !== integer.value)
  }

  get isZero() {
    return Logical.create(this.value === 0)
  }
}
