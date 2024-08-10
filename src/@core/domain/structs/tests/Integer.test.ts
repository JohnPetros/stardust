import { ValidationError } from '@/@core/errors/lib'
import { Integer } from '../Integer'

describe('Integer struct', () => {
  it('should not be created if value is not a number', () => {
    // @ts-expect-error
    expect(() => Integer.create('', 'not a number')).toThrow(ValidationError)
  })

  it('should not be created if value is not a positive number', () => {
    expect(() => Integer.create('', -1)).toThrow(ValidationError)
  })

  it('should increment value', () => {
    const integer = Integer.create('', 1).increment(10)

    expect(integer.value).toBe(11)
  })

  it('should decrement value', () => {
    const integer = Integer.create('', 11).dencrement(10)

    expect(integer.value).toBe(1)
  })
})
