import { StringValidation } from '../../libs'

type Value = 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' | 'CAIXA_ALTA'

export class NamingConvention {
  private constructor(readonly value: Value) {}

  static create(value: string) {
    if (!NamingConvention.isValid(value)) throw new Error()

    return new NamingConvention(value)
  }

  static isValid(value: string): value is Value {
    try {
      new StringValidation(value, 'Naming convention')
        .oneOf(['caixaCamelo', 'caixa_cobra', 'CaixaPascal', 'CAIXA_ALTA'])
        .validate()

      return true
    } catch {
      return false
    }
  }
}
