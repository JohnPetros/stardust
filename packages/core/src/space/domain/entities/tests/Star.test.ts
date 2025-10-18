import { Name, OrdinalNumber, Logical } from '#global/domain/structures/index'
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
    })
  })
})
