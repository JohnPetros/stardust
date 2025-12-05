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
    repository.countAllCompletedChallenges.mockImplementation()
    repository.countCompletedChallengesByMonth.mockImplementation()
    useCase = new GetCompletedChallengesKpiUseCase(repository)
  })

  it('should return the kpi of the completed challenges', async () => {
    const allCompletedChallenges = Integer.create(200)
    const currentMonthCompletedChallenges = Integer.create(15)
    const previousMonthCompletedChallenges = Integer.create(12)

    repository.countAllCompletedChallenges.mockResolvedValue(allCompletedChallenges)
    repository.countCompletedChallengesByMonth.mockResolvedValueOnce(
      currentMonthCompletedChallenges,
    )
    repository.countCompletedChallengesByMonth.mockResolvedValueOnce(
      previousMonthCompletedChallenges,
    )

    const kpi = Kpi.create({
      value: allCompletedChallenges.value,
      currentMonthValue: currentMonthCompletedChallenges.value,
      previousMonthValue: previousMonthCompletedChallenges.value,
    })

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
