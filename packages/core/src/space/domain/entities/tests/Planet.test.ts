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
})
