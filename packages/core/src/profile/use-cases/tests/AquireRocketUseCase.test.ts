import { AquireRocketUseCase } from '../AquireRocketUseCase'
import type { UsersRepository } from '../../interfaces'
import { mock, type Mock } from 'ts-jest-mocker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { RocketAggregatesFaker } from '#profile/domain/aggregates/fakers/RocketAggregatesFaker'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { Integer } from '#global/domain/structures/Integer'

describe('Aquire Rocket Use Case', () => {
  let usersRepository: Mock<UsersRepository>
  let useCase: AquireRocketUseCase

  beforeEach(() => {
    usersRepository = mock<UsersRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.replace.mockImplementation()
    usersRepository.addAcquiredRocket.mockImplementation()
    useCase = new AquireRocketUseCase(usersRepository)
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
    user.acquireRocket = jest.fn()
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

    expect(user.acquireRocket).toHaveBeenCalledWith(rocket, rocketPrice)
    expect(usersRepository.addAcquiredRocket).toHaveBeenCalledWith(rocket, user.id)
  })
})
