export class Name {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  static create(value: string) {
    return new Name(value)
  }

  removeAccentuation() {
    const newValue = this._value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return Name.create(newValue)
  }

  get value() {
    return this._value
  }
}
