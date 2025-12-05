import { GetCreatedUsersKpiUseCase } from '../GetCreatedUsersKpiUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { Integer } from '#global/domain/structures/Integer'
import { Kpi } from '#global/domain/structures/Kpi'

describe('Get Created Users Kpi Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: GetCreatedUsersKpiUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.countAll.mockImplementation()
    repository.countByMonth.mockImplementation()
    useCase = new GetCreatedUsersKpiUseCase(repository)
  })

  it('should return the kpi of the created users', async () => {
    const allUsers = Integer.create(100)
    const currentMonthUsers = Integer.create(10)
    const previousMonthUsers = Integer.create(8)

    repository.countAll.mockResolvedValue(allUsers)
    repository.countByMonth.mockResolvedValueOnce(currentMonthUsers)
    repository.countByMonth.mockResolvedValueOnce(previousMonthUsers)

    const kpi = Kpi.create({
      value: allUsers.value,
      currentMonthValue: currentMonthUsers.value,
      previousMonthValue: previousMonthUsers.value,
    })

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
