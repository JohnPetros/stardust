import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { _RewardUserUseCase } from '../_RewardUserUseCase'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UsersRepositoryMock } from '#profile/interfaces/mocks/UsersRepositoryMock'

let usersRepositoryMock: UsersRepository
let useCase: _RewardUserUseCase

describe('Reward user use case', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock()
    useCase = new _RewardUserUseCase(usersRepositoryMock)
  })

  it('should make the user earn xp, coins and update today status', async () => {
    const newCoins = 5
    const newXp = 10
    const user = UsersFaker.fake({ xp: 0, coins: 0 })
    usersRepositoryMock.add(user)

    await useCase.do({ newCoins, newXp, userDto: user.dto })

    const updatedUser = await usersRepositoryMock.findById(user.id)

    expect(updatedUser?.xp.value).toBe(newXp)
    expect(updatedUser?.coins.value).toBe(newCoins)
    expect(updatedUser?.weekStatus.todayStatus).toBe('done')
  })

  it('should return the new level, streak and week status if the user achieved them', async () => {
    let response = await useCase.do({
      newCoins: 0,
      newXp: 10000,
      userDto: UsersFaker.fakeDto({ streak: 0, xp: 0, coins: 0 }),
    })

    expect(response.newLevel).not.toBeNull()
    expect(response.newStreak).not.toBeNull()
    expect(response.newWeekStatus).not.toBeNull()

    response = await useCase.do({
      newCoins: 0,
      newXp: 0,
      userDto: UsersFaker.fakeDto({
        streak: 0,
        xp: 0,
        coins: 0,
        weekStatus: ['done', 'done', 'done', 'done', 'done', 'done', 'done'],
      }),
    })

    expect(response.newLevel).toBeNull()
    expect(response.newStreak).toBeNull()
    expect(response.newWeekStatus).toBeNull()
  })
})
