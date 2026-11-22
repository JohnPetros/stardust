import { mock, type Mock } from 'ts-jest-mocker'

import type { PlanetsRepository } from '#space/interfaces/index'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetLockedError } from '#space/domain/errors/PlanetLockedError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { GetPlanetOpeningUseCase } from '../GetPlanetOpeningUseCase'

describe('Get Planet Opening Use Case', () => {
  let planetsRepository: Mock<PlanetsRepository>
  let useCase: GetPlanetOpeningUseCase

  const first = PlanetsFaker.fake({
    position: 1,
    stars: [StarsFaker.fakeDto({ number: 1 })],
  })
  const second = PlanetsFaker.fake({
    position: 2,
    stars: [StarsFaker.fakeDto({ number: 1 })],
  })

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    planetsRepository.findAllByGalaxy.mockResolvedValue([first, second])
    useCase = new GetPlanetOpeningUseCase(planetsRepository)
  })

  it('should throw when the planet does not exist', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        planetId: Id.create().value,
        completedStarsIds: [],
        openedPlanetsIds: [],
      }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should accept a liberated planet', async () => {
    planetsRepository.findById.mockResolvedValue(first)

    const response = await useCase.execute({
      planetId: first.id.value,
      completedStarsIds: [],
      openedPlanetsIds: [],
    })

    expect(response).toEqual({ planetId: first.id.value, isAlreadyOpened: false })
  })

  it('should flag an already opened planet', async () => {
    planetsRepository.findById.mockResolvedValue(first)

    const response = await useCase.execute({
      planetId: first.id.value,
      completedStarsIds: [],
      openedPlanetsIds: [first.id.value],
    })

    expect(response.isAlreadyOpened).toBe(true)
  })

  it('should throw PlanetLockedError for a locked planet', async () => {
    planetsRepository.findById.mockResolvedValue(second)

    await expect(
      useCase.execute({
        planetId: second.id.value,
        completedStarsIds: [],
        openedPlanetsIds: [],
      }),
    ).rejects.toThrow(PlanetLockedError)
  })

  it('should liberate the next planet after the previous one is completed', async () => {
    planetsRepository.findById.mockResolvedValue(second)

    const response = await useCase.execute({
      planetId: second.id.value,
      completedStarsIds: [first.stars[0].id.value],
      openedPlanetsIds: [first.id.value],
    })

    expect(response.isAlreadyOpened).toBe(false)
  })
})
