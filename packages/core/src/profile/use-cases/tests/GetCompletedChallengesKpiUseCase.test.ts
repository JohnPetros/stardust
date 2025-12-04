import { GetCompletedChallengesKpiUseCase } from '../GetCompletedChallengesKpiUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { Integer } from '#global/domain/structures/Integer'
import { Kpi } from '#global/domain/structures/Kpi'

describe('Get Completed Challenges Kpi Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: GetCompletedChallengesKpiUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.countCompletedChallengesByMonth.mockImplementation()
    useCase = new GetCompletedChallengesKpiUseCase(repository)
  })

  it('should return the kpi of the completed challenges', async () => {
    const countCompletedChallengesByMonth = Integer.create(10)
    repository.countCompletedChallengesByMonth.mockResolvedValue(
      countCompletedChallengesByMonth,
    )
    repository.countCompletedChallengesByMonth.mockResolvedValue(
      countCompletedChallengesByMonth,
    )
    const kpi = Kpi.create(
      countCompletedChallengesByMonth.value,
      countCompletedChallengesByMonth.value,
    )

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
