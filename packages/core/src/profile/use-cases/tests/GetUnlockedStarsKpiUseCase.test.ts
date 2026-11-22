import { GetUnlockedStarsKpiUseCase } from '../GetUnlockedStarsKpiUseCase'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { mock, type Mock } from 'ts-jest-mocker'
import { Integer } from '#global/domain/structures/Integer'
import { Kpi } from '#global/domain/structures/Kpi'

describe('Get Unlocked Stars Kpi Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: GetUnlockedStarsKpiUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.countAllCompletedStars.mockImplementation()
    repository.countCompletedStarsByMonth.mockImplementation()
    useCase = new GetUnlockedStarsKpiUseCase(repository)
  })

  it('should return the kpi of the unlocked stars', async () => {
    const allUnlockedStars = Integer.create(500)
    const currentMonthUnlockedStars = Integer.create(25)
    const previousMonthUnlockedStars = Integer.create(20)

    repository.countAllCompletedStars.mockResolvedValue(allUnlockedStars)
    repository.countCompletedStarsByMonth.mockResolvedValueOnce(currentMonthUnlockedStars)
    repository.countCompletedStarsByMonth.mockResolvedValueOnce(
      previousMonthUnlockedStars,
    )

    const kpi = Kpi.create({
      value: allUnlockedStars.value,
      currentMonthValue: currentMonthUnlockedStars.value,
      previousMonthValue: previousMonthUnlockedStars.value,
    })

    const response = await useCase.execute()

    expect(response).toEqual(kpi.dto)
  })
})
