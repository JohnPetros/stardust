import { BooleanValidation } from '../../libs'

export class Logical {
  readonly value: boolean

  private constructor(value: boolean) {
    this.value = value
  }

  static create(value: boolean, key = 'Valor lógico'): Logical {
    new BooleanValidation(value, key).validate()

    return new Logical(value)
  }

  static createAsTrue(): Logical {
    return new Logical(true)
  }

  static createAsFalse(): Logical {
    return new Logical(false)
  }

  and(logical: Logical) {
    return new Logical(this.value && logical.value)
  }

  or(logical: Logical) {
    return new Logical(this.value || logical.value)
  }

  invertValue() {
    return new Logical(!this.value)
  }

  becomeTrue() {
    return new Logical(true)
  }

  becomeFalse() {
    return new Logical(false)
  }

  get isTrue() {
    return this.value
  }

  get isFalse() {
    return !this.value
  }
}
