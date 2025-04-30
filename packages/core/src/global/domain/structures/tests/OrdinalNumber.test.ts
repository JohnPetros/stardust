import { ValidationError } from '../../errors'
import { OrdinalNumber } from '../OrdinalNumber'

describe('Ordinal number structure', () => {
  it('should be create with a valid number greater than 1', () => {
    expect(() => OrdinalNumber.create(1)).not.toThrow()
    expect(() => OrdinalNumber.create(0)).toThrow(ValidationError)
    expect(() => OrdinalNumber.create(-1)).toThrow(ValidationError)
  })
})
