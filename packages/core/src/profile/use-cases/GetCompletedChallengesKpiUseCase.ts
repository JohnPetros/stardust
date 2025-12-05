import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { KpiDto } from '#global/domain/structures/dtos/KpiDto'
import type { UseCase } from '#global/interfaces/UseCase'
import { Kpi } from '#global/domain/structures/Kpi'
import { Month } from '#global/domain/structures/Month'

export class GetCompletedChallengesKpiUseCase implements UseCase<void, Promise<KpiDto>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute() {
    const currentMonth = Month.create()
    const previousMonth = currentMonth.previousMonth
    const [
      allCompletedChallenges,
      currentMonthCompletedChallenges,
      previousMonthCompletedChallenges,
    ] = await Promise.all([
      this.repository.countAllCompletedChallenges(),
      this.repository.countCompletedChallengesByMonth(currentMonth),
      this.repository.countCompletedChallengesByMonth(previousMonth),
    ])
    const kpi = Kpi.create({
      value: allCompletedChallenges.value,
      currentMonthValue: currentMonthCompletedChallenges.value,
      previousMonthValue: previousMonthCompletedChallenges.value,
    })
    return kpi.dto
  }
}
