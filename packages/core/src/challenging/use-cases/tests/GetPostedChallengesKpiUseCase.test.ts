import { GetPostedChallengesKpiUseCase } from '../GetPostedChallengesKpiUseCase'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { Integer } from '#global/domain/structures/Integer'
import { Kpi } from '#global/domain/structures/Kpi'

describe('Get Posted Challenges Kpi Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: GetPostedChallengesKpiUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.countAll.mockImplementation()
    repository.countByMonth.mockImplementation()
    useCase = new GetPostedChallengesKpiUseCase(repository)
  })

  it('should return the kpi of the posted challenges', async () => {
    const allChallenges = Integer.create(150)
    const currentMonthChallenges = Integer.create(5)
    const previousMonthChallenges = Integer.create(3)

    repository.countAll.mockResolvedValue(allChallenges)
    repository.countByMonth.mockResolvedValueOnce(currentMonthChallenges)
    repository.countByMonth.mockResolvedValueOnce(previousMonthChallenges)

    const kpi = Kpi.create({
      value: allChallenges.value,
      currentMonthValue: currentMonthChallenges.value,
      previousMonthValue: previousMonthChallenges.value,
    })

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
