import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { Kpi } from '#global/domain/structures/Kpi'
import { Month } from '#global/domain/structures/Month'

export class GetPostedChallengesUseCase {
  constructor(private readonly repository: ChallengesRepository) {}

  async execute() {
    const currentMonth = Month.create()
    const previousMonth = currentMonth.previousMonth
    const [currentMonthChallenges, previousMonthChallenges] = await Promise.all([
      this.repository.countChallengesByMonth(currentMonth),
      this.repository.countChallengesByMonth(previousMonth),
    ])
    const kpi = Kpi.create(currentMonthChallenges.value, previousMonthChallenges.value)
    return kpi.dto
  }
}
