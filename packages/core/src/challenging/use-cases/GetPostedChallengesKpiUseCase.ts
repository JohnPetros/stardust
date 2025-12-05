import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import type { KpiDto } from '#global/domain/structures/dtos/KpiDto'
import type { UseCase } from '#global/interfaces/UseCase'
import { Kpi } from '#global/domain/structures/Kpi'
import { Month } from '#global/domain/structures/Month'

export class GetPostedChallengesKpiUseCase implements UseCase<void, Promise<KpiDto>> {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute() {
    const currentMonth = Month.create()
    const previousMonth = currentMonth.previousMonth
    const [allChallenges, currentMonthChallenges, previousMonthChallenges] =
      await Promise.all([
        this.repository.countAll(),
        this.repository.countByMonth(currentMonth),
        this.repository.countByMonth(previousMonth),
      ])
    const kpi = Kpi.create({
      value: allChallenges.value,
      currentMonthValue: currentMonthChallenges.value,
      previousMonthValue: previousMonthChallenges.value,
    })
    return kpi.dto
  }
}
