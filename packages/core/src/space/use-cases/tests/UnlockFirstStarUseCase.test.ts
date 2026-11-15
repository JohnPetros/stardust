import { mock, type Mock } from 'ts-jest-mocker'

import { UnlockFirstStarUseCase } from '../UnlockFirstStarUseCase'
import type { Broker } from '#global/interfaces/Broker'
import type { GalaxiesRepository, PlanetsRepository } from '../../interfaces'
import { GalaxiesFaker } from '#space/domain/entities/fakers/GalaxiesFaker'
import { FirstStarUnlockedEvent } from '#space/domain/events/FirstStarUnlockedEvent'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

describe('Unlock First Star Use Case', () => {
  let repository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  const galaxy = GalaxiesFaker.fake({ position: 1 })
  let Broker: Mock<Broker>
  let useCase: UnlockFirstStarUseCase

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    Broker = mock<Broker>()
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findFirst.mockResolvedValue(galaxy)
    repository.findByPosition.mockImplementation()
    Broker.publish.mockImplementation()
    useCase = new UnlockFirstStarUseCase(repository, galaxiesRepository, Broker)
  })

  it('should throw an error if the first planet is not found', async () => {
    const user = UsersFaker.fake()
    repository.findByPosition.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: user.id.value,
        userName: user.name.value,
        userEmail: user.email.value,
      }),
    ).rejects.toThrow(PlanetNotFoundError)
    expect(repository.findByPosition).toHaveBeenCalledWith(
      OrdinalNumber.create(1),
      galaxy.id,
    )
  })

  it('should publish an event when the first star is unlocked', async () => {
    const user = UsersFaker.fake()
    const firstStar = StarsFaker.fakeDto({ number: 1 })
    const firstPlanet = PlanetsFaker.fake({
      stars: [
        firstStar,
        StarsFaker.fakeDto({ number: 2 }),
        StarsFaker.fakeDto({ number: 3 }),
      ],
    })
    repository.findByPosition.mockResolvedValue(firstPlanet)

    await useCase.execute({
      userId: user.id.value,
      userName: user.name.value,
      userEmail: user.email.value,
    })

    expect(repository.findByPosition).toHaveBeenCalledWith(
      OrdinalNumber.create(1),
      galaxy.id,
    )
    expect(Broker.publish).toHaveBeenCalledWith(
      new FirstStarUnlockedEvent({
        user: {
          id: user.id.value,
          name: user.name.value,
          email: user.email.value,
        },
        firstUnlockedStarId: String(firstStar.id),
      }),
    )
  })

  it('should unlock the first star of the first galaxy of the catalog', async () => {
    const user = UsersFaker.fake()
    const firstPlanet = PlanetsFaker.fake({
      galaxyId: galaxy.id.value,
      stars: [StarsFaker.fakeDto({ number: 1 })],
    })
    repository.findByPosition.mockResolvedValue(firstPlanet)

    await useCase.execute({
      userId: user.id.value,
      userName: user.name.value,
      userEmail: user.email.value,
    })

    expect(galaxiesRepository.findFirst).toHaveBeenCalledTimes(1)
    expect(repository.findByPosition).toHaveBeenCalledWith(
      OrdinalNumber.create(1),
      galaxy.id,
    )
  })

  it('should throw PlanetNotFoundError when there is no first galaxy', async () => {
    const user = UsersFaker.fake()
    galaxiesRepository.findFirst.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: user.id.value,
        userName: user.name.value,
        userEmail: user.email.value,
      }),
    ).rejects.toThrow(PlanetNotFoundError)
    expect(repository.findByPosition).not.toHaveBeenCalled()
    expect(Broker.publish).not.toHaveBeenCalled()
  })
})
