import { BooleanValidation } from '#libs'

export class Logical {
  readonly value: boolean

  private constructor(value: boolean) {
    this.value = value
  }

  static create(key: string, value: boolean): Logical {
    new BooleanValidation(value, key).validate()

    return new Logical(value)
  }

  invertValue() {
    return new Logical(!this.value)
  }

  makeTrue() {
    return new Logical(true)
  }

  makeFalse() {
    return new Logical(false)
  }

  get isTrue() {
    return this.value
  }

  get isFalse() {
    return !this.value
  }
}
