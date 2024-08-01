import { PlanetsFaker, StarsFaker } from './fakers'

describe('Planet entity', () => {
  it('should get the next star based on the given current star', () => {
    const currentStar = StarsFaker.fake({ number: 1 })
    const nextStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto, nextStar.dto] })

    expect(planet.getNextStar(currentStar.id)).toEqual(nextStar)
    expect(planet.getNextStar(nextStar.id)).toBe(null)
  })
})
