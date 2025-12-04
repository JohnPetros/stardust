import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { KpiDto } from '#global/domain/structures/dtos/KpiDto'
import type { UseCase } from '#global/interfaces/UseCase'
import { Kpi } from '#global/domain/structures/Kpi'
import { Month } from '#global/domain/structures/Month'

export class GetCreatedUsersKpiUseCase implements UseCase<void, Promise<KpiDto>> {
  constructor(private readonly repository: UsersRepository) {}

  async execute() {
    const currentMonth = Month.create()
    const previousMonth = currentMonth.previousMonth
    const [currentMonthUsers, previousMonthUsers] = await Promise.all([
      this.repository.countUsersByMonth(currentMonth),
      this.repository.countUsersByMonth(previousMonth),
    ])
    const kpi = Kpi.create(currentMonthUsers.value, previousMonthUsers.value)
    return kpi.dto
  }
}
