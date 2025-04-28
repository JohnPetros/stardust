import { ValidationError } from '../../errors'
import { Percentage } from '../Percentage'

describe('Percentage structure', () => {
  it('should be created from two valid numbers', () => {
    expect(() => Percentage.create(1, 1)).not.toThrow(ValidationError)
    expect(() => Percentage.create(1, 'invalid number' as unknown as number)).toThrow(
      ValidationError,
    )
    expect(() => Percentage.create('invalid number' as unknown as number, 1)).toThrow(
      ValidationError,
    )
  })

  it('should calculate the percentage value given the part and total', () => {
    expect(Percentage.create(40, 80).value).toBe(50)
    expect(Percentage.create(25, 100).value).toBe(25)
    expect(Percentage.create(3, 5).value).toBe(60)

    expect(Percentage.create(0, 100).value).toBe(0)
    expect(Percentage.create(0, 1).value).toBe(0)

    expect(Percentage.create(100, 100).value).toBe(100)
    expect(Percentage.create(50, 50).value).toBe(100)

    expect(Percentage.create(500, 1000).value).toBe(50)
    expect(Percentage.create(999, 1000).value).toBe(99.9)

    expect(Percentage.create(1, 1000).value).toBe(0.1)
    expect(Percentage.create(1, 10).value).toBe(10)

    expect(Percentage.create(-40, 80).value).toBe(-50)
    expect(Percentage.create(40, -80).value).toBe(-50)

    expect(Percentage.create(120, 100).value).toBe(120)
  })
})
