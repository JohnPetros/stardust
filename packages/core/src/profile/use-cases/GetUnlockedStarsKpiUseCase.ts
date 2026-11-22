import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { KpiDto } from '#global/domain/structures/dtos/KpiDto'
import type { UseCase } from '#global/interfaces/UseCase'
import { Kpi } from '#global/domain/structures/Kpi'
import { Month } from '#global/domain/structures/Month'

export class GetUnlockedStarsKpiUseCase implements UseCase<void, Promise<KpiDto>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute() {
    const currentMonth = Month.create()
    const previousMonth = currentMonth.previousMonth
    const [allUnlockedStars, currentMonthUnlockedStars, previousMonthUnlockedStars] =
      await Promise.all([
        this.repository.countAllCompletedStars(),
        this.repository.countCompletedStarsByMonth(currentMonth),
        this.repository.countCompletedStarsByMonth(previousMonth),
      ])
    const kpi = Kpi.create({
      value: allUnlockedStars.value,
      currentMonthValue: currentMonthUnlockedStars.value,
      previousMonthValue: previousMonthUnlockedStars.value,
    })
    return kpi.dto
  }
}
