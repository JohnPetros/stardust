import { ValidationError } from '../errors'
import { Logical } from './Logical'

type InsigniaRoleValue = 'engineer'

export class InsigniaRole {
  private constructor(readonly value: InsigniaRoleValue) {}

  static create(value: string): InsigniaRole {
    if (!InsigniaRole.isInsigniaRole(value)) {
      throw new ValidationError([
        { name: 'value', messages: ['Não é um tipo de insignia válido'] },
      ])
    }

    return new InsigniaRole(value)
  }

  static isInsigniaRole(value: string): value is InsigniaRoleValue {
    return ['engineer'].includes(value)
  }

  get isEngineer(): Logical {
    return Logical.create(this.value === 'engineer')
  }
}
