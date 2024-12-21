import { ValidationError } from '@/@core/errors/lib'
import { Id } from '../global/Id'

describe('Id Struct', () => {
  it('should not be created if its value is not a valid uuid', () => {
    expect(() => Id.create('invalid uuid')).toThrow(ValidationError)
  })

  it('should be created', () => {
    const uuid = '767445cc-58dd-462a-9641-1b9cd0da7c1f'
    const id = Id.create(uuid)

    expect(id).toHaveProperty('value', uuid)
  })
})
