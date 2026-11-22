import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'
import { UpdatePlanetUseCase } from '../UpdatePlanetUseCase'
import type { PlanetsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'

describe('Update Planet Use Case', () => {
  let useCase: UpdatePlanetUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    planetsRepository.findById.mockImplementation()
    planetsRepository.replace.mockImplementation()
    useCase = new UpdatePlanetUseCase(planetsRepository)
  })

  it('should update all provided fields in the planet', async () => {
    const planet = PlanetsFaker.fake()
    const updatedPlanetDto = PlanetsFaker.fakeDto()
    planetsRepository.findById.mockResolvedValue(planet)

    const response = await useCase.execute({
      planetId: planet.id.value,
      name: updatedPlanetDto.name,
      image: updatedPlanetDto.image,
    })

    expect(planetsRepository.findById).toHaveBeenCalledTimes(1)
    expect(planetsRepository.findById).toHaveBeenCalledWith(planet.id)
    expect(planetsRepository.replace).toHaveBeenCalledTimes(1)
    expect(planetsRepository.replace).toHaveBeenCalledWith(planet)
    expect(planet.name.value).toBe(updatedPlanetDto.name)
    expect(planet.image.value).toBe(updatedPlanetDto.image)
    expect(response).toEqual(planet.dto)
    expect(response).not.toHaveProperty('icon')
  })

  it('should update only provided properties, leaving others untouched', async () => {
    const originalPlanet = PlanetsFaker.fake()
    const updatedPlanet = PlanetsFaker.fake()
    const previousName = originalPlanet.name.value
    const previousPosition = originalPlanet.position.value
    const newImage = updatedPlanet.image.value

    planetsRepository.findById.mockResolvedValue(originalPlanet)
    planetsRepository.replace.mockResolvedValue()

    await useCase.execute({ planetId: originalPlanet.id.value, image: newImage })

    expect(originalPlanet.image.value).toBe(newImage)
    expect(originalPlanet.name.value).toBe(previousName)
    expect(originalPlanet.position.value).toBe(previousPosition)
  })

  it('should throw when the planet does not exist', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ planetId: faker.string.uuid(), name: faker.person.firstName() }),
    ).rejects.toThrow(PlanetNotFoundError)
  })
})
