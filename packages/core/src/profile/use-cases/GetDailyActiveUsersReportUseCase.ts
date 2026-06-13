import type { UseCase } from '#global/interfaces/UseCase'
import { Integer } from '#global/domain/structures/Integer'
import type { AnalyticsReportingProvider } from '../../analytics/interfaces'

import type { DailyActiveUsersDto } from '../domain/entities/dtos'

type Request = {
  days: number
}

export class GetDailyActiveUsersReportUseCase
  implements UseCase<Request, Promise<DailyActiveUsersDto>>
{
  constructor(private readonly analyticsReportingProvider: AnalyticsReportingProvider) {}

  async execute({ days }: Request): Promise<DailyActiveUsersDto> {
    return await this.analyticsReportingProvider.getDailyActiveUsers(Integer.create(days))
  }
}
