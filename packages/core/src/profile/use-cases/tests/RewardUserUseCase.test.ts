import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UserRewardedEvent } from '#profile/domain/events/UserRewardedEvent'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { RewardUserUseCase } from '../RewardUserUseCase'

describe('Reward User Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: RewardUserUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new RewardUserUseCase(repository, broker)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ userId: user.id.value, newXp: 50, newCoins: 25 }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repository.replace).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should reward the user and publish rewarded event after replacing it', async () => {
    const user = UsersFaker.fake({ xp: 0, coins: 10, level: 1, streak: 0 })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      userId: user.id.value,
      newXp: 50,
      newCoins: 25,
    })

    expect(repository.replace).toHaveBeenCalledWith(user)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<UserRewardedEvent>({
        name: UserRewardedEvent._NAME,
        payload: {
          userId: user.id.value,
          newXp: user.xp.value,
          newCoins: user.coins.value,
          newLevel: user.level.value.number.value,
          newStreak: user.streak.value,
          newWeekStatus: user.weekStatus.value,
        },
      }),
    )
    expect(response).toEqual({
      newLevel: user.level.value.number.value,
      newStreak: user.streak.value,
      newWeekStatus: user.weekStatus.value,
    })
  })
})
