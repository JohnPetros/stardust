import { Name, OrdinalNumber, Logical } from '#global/domain/structures/index'
import { Star } from '../Star'
import { StarsFaker } from './fakers/StarsFaker'

describe('Star Entity', () => {
  it('should create a star', () => {
    const star = StarsFaker.fake()
    expect(star).toBeDefined()
  })

  it('should set a new name and slug', () => {
    const star = StarsFaker.fake()
    const newName = Name.create('New Name')
    star.name = newName
    expect(star.name).toEqual(newName)
    expect(star.slug).toEqual(newName.slug)
  })

  it('should set a new number', () => {
    const star = StarsFaker.fake()
    const newNumber = OrdinalNumber.create(10)
    star.number = newNumber
    expect(star.number).toEqual(newNumber)
  })

  it('should set a new isChallenge', () => {
    const star = StarsFaker.fake()
    const newIsChallenge = Logical.create(true)
    star.isChallenge = newIsChallenge
    expect(star.isChallenge).toEqual(newIsChallenge)
  })

  it('should set a new isAvailable', () => {
    const star = StarsFaker.fake()
    const newIsAvailable = Logical.create(true)
    star.isAvailable = newIsAvailable
    expect(star.isAvailable).toEqual(newIsAvailable)
  })

  it('should expose the description when present', () => {
    const star = StarsFaker.fake({ description: 'Estrela de história sobre variáveis.' })
    expect(star.description?.value).toBe('Estrela de história sobre variáveis.')
    expect(star.dto.description).toBe('Estrela de história sobre variáveis.')
  })

  it('should have a null description when it is absent or null', () => {
    expect(StarsFaker.fake({ description: null }).description).toBeNull()
    const { description: _description, ...dtoWithoutDescription } = StarsFaker.fakeDto()
    expect(Star.create(dtoWithoutDescription).dto.description).toBeNull()
  })

  it('should return a dto', () => {
    const star = StarsFaker.fake()
    const dto = star.dto
    expect(dto).toEqual({
      id: star.id.value,
      name: star.name.value,
      number: star.number.value,
      slug: star.slug.value,
      isChallenge: star.isChallenge.value,
      isAvailable: star.isAvailable.value,
      unlockCount: star.unlockCount.value,
      userCount: star.userCount.value,
      description: star.description?.value ?? null,
    })
  })
})
