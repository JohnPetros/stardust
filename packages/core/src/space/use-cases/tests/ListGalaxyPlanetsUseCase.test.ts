import { mock, type Mock } from 'ts-jest-mocker'

import type { GalaxiesRepository, PlanetsRepository } from '../../interfaces'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { PlanetsFaker } from '../../domain/entities/fakers/PlanetsFaker'
import { GalaxyNotFoundError } from '../../domain/errors'
import { ListGalaxyPlanetsUseCase } from '../ListGalaxyPlanetsUseCase'

describe('List Galaxy Planets Use Case', () => {
  let galaxiesRepository: Mock<GalaxiesRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let useCase: ListGalaxyPlanetsUseCase

  beforeEach(() => {
    galaxiesRepository = mock<GalaxiesRepository>()
    planetsRepository = mock<PlanetsRepository>()
    galaxiesRepository.findBySlug.mockImplementation()
    planetsRepository.findAllByGalaxy.mockImplementation()
    useCase = new ListGalaxyPlanetsUseCase(galaxiesRepository, planetsRepository)
  })

  it('should return the planets of the published galaxy', async () => {
    const galaxy = GalaxiesFaker.fake({ status: 'published' })
    const planets = PlanetsFaker.fakeMany(3)
    galaxiesRepository.findBySlug.mockResolvedValue(galaxy)
    planetsRepository.findAllByGalaxy.mockResolvedValue(planets)

    const response = await useCase.execute({ galaxySlug: galaxy.slug.value })

    expect(planetsRepository.findAllByGalaxy).toHaveBeenCalledWith(galaxy.id)
    expect(response).toEqual(planets.map((planet) => planet.dto))
  })

  it.each(['announced', 'unpublished'] as const)(
    'should throw GalaxyNotFoundError when the galaxy is %s',
    async (status) => {
      const galaxy = GalaxiesFaker.fake({ status })
      galaxiesRepository.findBySlug.mockResolvedValue(galaxy)

      await expect(useCase.execute({ galaxySlug: galaxy.slug.value })).rejects.toThrow(
        GalaxyNotFoundError,
      )
      expect(planetsRepository.findAllByGalaxy).not.toHaveBeenCalled()
    },
  )

  it('should throw GalaxyNotFoundError when the galaxy does not exist', async () => {
    galaxiesRepository.findBySlug.mockResolvedValue(null)

    await expect(useCase.execute({ galaxySlug: 'inexistente' })).rejects.toThrow(
      GalaxyNotFoundError,
    )
    expect(planetsRepository.findAllByGalaxy).not.toHaveBeenCalled()
  })
})
