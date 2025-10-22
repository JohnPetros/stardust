import { mock } from 'ts-jest-mocker'
import { CreatePlanetUseCase } from '../CreatePlanetUseCase'
import type { PlanetsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'

describe('Create Planet Use Case', () => {
  let useCase: CreatePlanetUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    planetsRepository.add.mockImplementation()
    planetsRepository.findLastPlanet.mockImplementation()
    useCase = new CreatePlanetUseCase(planetsRepository)
  })

  it('should create a new planet using the next position', async () => {
    const lastPlanet = PlanetsFaker.fake({ position: 5 })
    planetsRepository.findLastPlanet.mockResolvedValue(lastPlanet)
    const planetDto = PlanetsFaker.fakeDto()

    const response = await useCase.execute({
      name: planetDto.name,
      icon: planetDto.icon,
      image: planetDto.image,
    })
    expect(planetsRepository.findLastPlanet).toHaveBeenCalledTimes(1)
    expect(planetsRepository.add).toHaveBeenCalledTimes(1)
    const createdPlanet = planetsRepository.add.mock.calls[0][0]
    expect(createdPlanet.name.value).toBe(planetDto.name)
    expect(createdPlanet.icon.value).toBe(planetDto.icon)
    expect(createdPlanet.image.value).toBe(planetDto.image)
    expect(createdPlanet.position.value).toBe(lastPlanet.position.value + 1)
    expect(createdPlanet.isAvailable.isFalse).toBe(true)
    expect(createdPlanet.completionsCount.value).toBe(0)
    expect(createdPlanet.stars).toHaveLength(0)
    expect(response).toEqual(createdPlanet.dto)
  })

  it('should throw an error when the last planet does not exist', async () => {
    const planetDto = PlanetsFaker.fakeDto()

    expect(
      useCase.execute({
        name: planetDto.name,
        icon: planetDto.icon,
        image: planetDto.image,
      }),
    ).rejects.toThrow(PlanetNotFoundError)

    expect(planetsRepository.findLastPlanet).toHaveBeenCalledTimes(1)
    expect(planetsRepository.add).not.toHaveBeenCalled()
  })
})
