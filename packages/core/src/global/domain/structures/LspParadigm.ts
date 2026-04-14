import { StringValidation } from '../../libs'

type Value = 'both' | 'imperative' | 'infinitive'

export class LspParadigm {
  private constructor(readonly value: Value) {}

  static create(value: string) {
    if (!LspParadigm.isValid(value)) throw new Error()

    return new LspParadigm(value)
  }

  static isValid(value: string): value is Value {
    try {
      new StringValidation(value, 'Paradigm')
        .oneOf(['both', 'imperative', 'infinitive'])
        .validate()

      return true
    } catch {
      return false
    }
  }
}
