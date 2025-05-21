import { mock, type Mock } from 'ts-jest-mocker'

import { Integer } from '#global/domain/structures/Integer'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { RocketAggregatesFaker } from '#profile/domain/aggregates/fakers/RocketAggregatesFaker'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { AcquireRocketUseCase } from '../AcquireRocketUseCase'
import type { UsersRepository } from '../../interfaces'

describe('Acquire Rocket Use Case', () => {
  let usersRepository: Mock<UsersRepository>
  let useCase: AcquireRocketUseCase

  beforeEach(() => {
    usersRepository = mock<UsersRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.replace.mockImplementation()
    usersRepository.addAcquiredRocket.mockImplementation()
    useCase = new AcquireRocketUseCase(usersRepository)
  })

  it('should throw an error if the user is not found', () => {
    const user = UsersFaker.fake()
    const rocket = RocketAggregatesFaker.fake()
    usersRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        userId: user.id.value,
        rocketId: rocket.id.value,
        rocketName: rocket.name.value,
        rocketImage: rocket.image.value,
        rocketPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should add the acquire rocket to the repository', async () => {
    const user = UsersFaker.fake()
    user.buyRocket = jest.fn()
    const rocket = RocketAggregatesFaker.fake()
    const rocketPrice = Integer.create(0)
    usersRepository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      rocketId: rocket.id.value,
      rocketName: rocket.name.value,
      rocketImage: rocket.image.value,
      rocketPrice: 0,
    })

    expect(user.buyRocket).toHaveBeenCalledWith(rocket, rocketPrice)
    expect(usersRepository.addAcquiredRocket).toHaveBeenCalledWith(rocket, user.id)
  })
})
