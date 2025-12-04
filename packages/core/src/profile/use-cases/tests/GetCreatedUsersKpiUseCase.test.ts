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
    repository.countUsersByMonth.mockImplementation()
    useCase = new GetCreatedUsersKpiUseCase(repository)
  })

  it('should return the kpi of the created users', async () => {
    const countUsersByMonth = Integer.create(10)
    repository.countUsersByMonth.mockResolvedValue(countUsersByMonth)
    repository.countUsersByMonth.mockResolvedValue(countUsersByMonth)
    const kpi = Kpi.create(countUsersByMonth.value, countUsersByMonth.value)

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
