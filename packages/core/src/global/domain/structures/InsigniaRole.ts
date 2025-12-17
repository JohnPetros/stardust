import { ValidationError } from '../errors'
import { Logical } from './Logical'

export type InsigniaRoleValue = 'engineer' | 'god'

export class InsigniaRole {
  private constructor(readonly value: InsigniaRoleValue) {}

  static create(value: string): InsigniaRole {
    if (!InsigniaRole.isInsigniaRole(value)) {
      throw new ValidationError([
        { name: 'value', messages: ['Não é um tipo de insígnia válido'] },
      ])
    }

    return new InsigniaRole(value)
  }

  static createAsEngineer(): InsigniaRole {
    return InsigniaRole.create('engineer')
  }

  static createAsGod(): InsigniaRole {
    return InsigniaRole.create('god')
  }

  static isInsigniaRole(value: string): value is InsigniaRoleValue {
    return ['engineer', 'god'].includes(value)
  }

  get isEngineer(): Logical {
    return Logical.create(this.value === 'engineer')
  }

  get isGod(): Logical {
    return Logical.create(this.value === 'god')
  }
}
