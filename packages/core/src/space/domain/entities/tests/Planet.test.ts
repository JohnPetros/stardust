import { Id } from '#global/domain/structures/Id'
import { StarNotFoundError } from '../../errors'
import { PlanetsFaker, StarsFaker } from './fakers'

describe('Planet Entity', () => {
  it('should get the next star based on the given current star', () => {
    const currentStar = StarsFaker.fake({ number: 1 })
    const nextStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto, nextStar.dto] })

    expect(planet.getNextStar(currentStar)).toEqual(nextStar)
    expect(planet.getNextStar(nextStar)).toBe(null)
  })

  it('should get the first star', () => {
    const firstStar = StarsFaker.fake({ number: 1 })
    const secondStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [firstStar.dto, secondStar.dto] })

    expect(planet.firstStar).toEqual(firstStar)
  })

  it('should add a new star', () => {
    const planet = PlanetsFaker.fake({ stars: [] })
    planet.addStar()
    expect(planet.starsCount.value).toBe(1)
    expect(planet.lastStar.number.value).toBe(1)
  })

  it('should remove a star', () => {
    const star1 = StarsFaker.fake({ number: 1 })
    const star2 = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [star1.dto, star2.dto] })

    planet.removeStar(star1.id)

    expect(planet.starsCount.value).toBe(1)
    expect(planet.firstStar.id.value).toBe(star2.id.value)
    expect(planet.lastStar.id.value).toBe(star2.id.value)
    expect(planet.firstStar.number.value).toBe(1)
  })

  it('should throw an error when trying to remove a star that does not exist', () => {
    const planet = PlanetsFaker.fake({ stars: [] })
    expect(() => planet.removeStar(Id.create())).toThrow(StarNotFoundError)
  })

  it('should reorder stars', () => {
    const star1 = StarsFaker.fake({ number: 1 })
    const star2 = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [star1.dto, star2.dto] })

    planet.reorderStars([star2.id, star1.id])

    expect(planet.firstStar.id.value).toBe(star2.id.value)
    expect(planet.lastStar.id.value).toBe(star1.id.value)
    expect(planet.firstStar.number.value).toBe(1)
    expect(planet.lastStar.number.value).toBe(2)
  })

  it('should throw an error when trying to reorder stars with an invalid id', () => {
    const planet = PlanetsFaker.fake({ stars: [] })
    expect(() => planet.reorderStars([Id.create()])).toThrow(StarNotFoundError)
  })
})
