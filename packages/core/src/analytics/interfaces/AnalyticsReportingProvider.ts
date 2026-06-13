import type { Integer } from '#global/domain/structures/index'
import type { DailyActiveUsersDto } from '#profile/domain/entities/dtos/index'

export interface AnalyticsReportingProvider {
  getDailyActiveUsers(days: Integer): Promise<DailyActiveUsersDto>
}
