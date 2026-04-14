import { StringValidation } from '../../libs'

type Value = 'preserve' | 'single' | 'double'

export class TextDelimiter {
  private constructor(readonly value: Value) {}

  static create(value: string) {
    if (!TextDelimiter.isValid(value)) throw new Error()

    return new TextDelimiter(value)
  }

  static isValid(value: string): value is Value {
    try {
      new StringValidation(value, 'Text delimiter')
        .oneOf(['preserve', 'single', 'double'])
        .validate()

      return true
    } catch {
      return false
    }
  }
}
