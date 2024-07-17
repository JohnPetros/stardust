import { BooleanValidation } from '@/@core/lib/validation'

export class Logical {
  readonly value: boolean

  constructor(value: boolean) {
    this.value = value
  }

  static create(key: string, value: boolean): Logical {
    new BooleanValidation(value, key).validate()

    return new Logical(value)
  }

  invertValue() {
    return new Logical(!this.value)
  }

  get true() {
    return this.value
  }

  get false() {
    return !this.value
  }
}
