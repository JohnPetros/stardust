import { ValidationError } from '../../errors'
import { Integer } from '../Integer'

describe('Integer structure', () => {
  it('should not be created if value is not a number', () => {
    // @ts-expect-error
    expect(() => Integer.create('not a number')).toThrow(ValidationError)
  })

  it('should not be created if value is not a positive number', () => {
    expect(() => Integer.create(-1)).toThrow(ValidationError)
  })

  it('should return true if the integer value is equal to another integer value', () => {
    expect(Integer.create(1).isEqualTo(Integer.create(1)).isTrue).toBeTruthy()
    expect(Integer.create(1).isEqualTo(Integer.create(2)).isTrue).toBeFalsy()
  })

  it('should increment the integer value by one', () => {
    const integer = Integer.create(1).increment()
    expect(integer.value).toBe(2)
  })

  it('should decrement the integer value by one', () => {
    const integer = Integer.create(1).decrement()
    expect(integer.value).toBe(0)
  })

  it('should plus another integer to the current integer', () => {
    const integer = Integer.create(1).plus(Integer.create(1))
    expect(integer.value).toBe(2)
  })

  it('should minus another integer to the current integer', () => {
    const integer = Integer.create(1).minus(Integer.create(1))
    expect(integer.value).toBe(0)
  })

  it('should multiply another integer to the current integer', () => {
    const integer = Integer.create(2).multiply(Integer.create(10))
    expect(integer.value).toBe(20)
  })

  it('should determini if it is greater than another integer', () => {
    expect(Integer.create(1).isGreaterThan(Integer.create(2)).isFalse).toBeTruthy()
    expect(Integer.create(2).isGreaterThan(Integer.create(1)).isTrue).toBeTruthy()
    expect(Integer.create(2).isGreaterThan(Integer.create(2)).isFalse).toBeTruthy()
  })

  it('should determini if it is less than another integer', () => {
    expect(Integer.create(1).isLessThan(Integer.create(2)).isTrue).toBeTruthy()
    expect(Integer.create(2).isLessThan(Integer.create(1)).isFalse).toBeTruthy()
    expect(Integer.create(2).isLessThan(Integer.create(2)).isFalse).toBeTruthy()
  })
})
