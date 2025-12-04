import { GetPostedChallengesUseCase } from '../GetPostedChallengesUseCase'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { Integer } from '#global/domain/structures/Integer'
import { Kpi } from '#global/domain/structures/Kpi'

describe('Get Posted Challenges Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: GetPostedChallengesUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.countChallengesByMonth.mockImplementation()
    useCase = new GetPostedChallengesUseCase(repository)
  })

  it('should return the kpi of the posted challenges', async () => {
    const countChallengesByMonth = Integer.create(10)
    repository.countChallengesByMonth.mockResolvedValue(countChallengesByMonth)
    repository.countChallengesByMonth.mockResolvedValue(countChallengesByMonth)
    const kpi = Kpi.create(countChallengesByMonth.value, countChallengesByMonth.value)

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
