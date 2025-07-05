import { Integer } from '#global/domain/structures/Integer'
import { Level } from '../Level'

describe('Level struct', () => {
  it('should up number only when the new xp is greater than or equal to the minimum required', () => {
    const level = Level.create(1)

    let newLevel = level.up(Integer.create(0), Integer.create(10))
    expect(newLevel.value.number.value).toBe(1)

    newLevel = level.up(Integer.create(0), Integer.create(50))
    expect(newLevel.value.number.value).toBe(2)

    newLevel = newLevel.up(Integer.create(50), Integer.create(10))
    expect(newLevel.value.number.value).toBe(2)

    newLevel = newLevel.up(Integer.create(50), Integer.create(25))
    expect(newLevel.value.number.value).toBe(3)
  })

  it('should indicate that its value was up', () => {
    const level = Level.create(1)

    expect(level.didUp.isFalse).toBeTruthy()
    const newLevel = level.up(Integer.create(0), Integer.create(50))
    expect(newLevel.didUp.isTrue).toBeTruthy()
  })
})
