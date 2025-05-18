import { type Mock, mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { ResetWeekStatusForAllUsersUseCase } from '../ResetWeekStatusForAllUsersUseCase'

describe('Reset Week Status For All Users Use Case', () => {
  let usersRepositoryMock: Mock<UsersRepository>
  let useCase: ResetWeekStatusForAllUsersUseCase

  beforeAll(() => {
    usersRepositoryMock = mock<UsersRepository>()
    usersRepositoryMock.findAll.mockImplementation()
    usersRepositoryMock.replaceMany.mockImplementation()
    useCase = new ResetWeekStatusForAllUsersUseCase(usersRepositoryMock)
  })

  it('should reset the week status for all users', async () => {
    const resetWeekStatusMock = jest.fn()
    const users = UsersFaker.fakeMany(3, {
      weekStatus: ['done', 'done', 'done', 'done', 'done', 'done', 'done'],
    }).map((user) => {
      user.resetWeekStatus = resetWeekStatusMock
      return user
    })
    usersRepositoryMock.findAll.mockResolvedValue(users)

    await useCase.execute()

    expect(resetWeekStatusMock).toHaveBeenCalledTimes(users.length)
    expect(usersRepositoryMock.replaceMany).toHaveBeenCalledTimes(1)
    expect(usersRepositoryMock.replaceMany).toHaveBeenCalledWith(users)
  })
})
