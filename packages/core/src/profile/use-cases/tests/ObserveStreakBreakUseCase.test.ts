import { mock, type Mock } from 'ts-jest-mocker'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { ObserveStreakBreakUseCase } from '../ObserveStreakBreakUseCase'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'

describe('Observe Streak Break Use Case', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-03-15')) // saturday

  let usersRepositoryMock: Mock<UsersRepository>
  let useCase: ObserveStreakBreakUseCase

  beforeAll(() => {
    usersRepositoryMock = mock<UsersRepository>()
    usersRepositoryMock.findAll.mockImplementation()
    usersRepositoryMock.replaceMany.mockImplementation()
    useCase = new ObserveStreakBreakUseCase(usersRepositoryMock)
  })

  it('should break streak only the users that did not complete the task yesterday', async () => {
    const breakStreakMock = jest.fn()
    const lazyUsers = UsersFaker.fakeMany(5, {
      weekStatus: ['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'],
    }).map((user) => {
      user.breakStreak = breakStreakMock
      return user
    })
    const regularUsers = UsersFaker.fakeMany(3, {
      weekStatus: ['done', 'done', 'done', 'done', 'done', 'done', 'todo'],
    }).map((user) => {
      user.breakStreak = breakStreakMock
      return user
    })
    usersRepositoryMock.findAll.mockResolvedValue([...lazyUsers, ...regularUsers])

    await useCase.execute()

    expect(breakStreakMock).toHaveBeenCalledTimes(lazyUsers.length)
    expect(usersRepositoryMock.replaceMany).toHaveBeenCalledWith(lazyUsers)
  })
})
