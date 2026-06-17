import type { AnalyticsReportingProvider } from '@stardust/core/analytics/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import { HTTP_HEADERS } from '@stardust/core/global/constants'
import { AppError } from '@stardust/core/global/errors'
import { Integer } from '@stardust/core/global/structures'
import type { DailyActiveUsersDto } from '@stardust/core/profile/entities/dtos'

import { ENV } from '@/constants'

type PostHogQueryResponse = {
  results?: Array<[string, string, number]>
}

export class PostHogAnalyticsReportingProvider implements AnalyticsReportingProvider {
  constructor(private readonly restClient: RestClient) {
    this.restClient.setBaseUrl(ENV.posthogHost)
    this.restClient.setHeader(
      HTTP_HEADERS.authorization,
      `Bearer ${ENV.posthogPersonalApiKey}`,
    )
  }

  async getDailyActiveUsers(days: Integer): Promise<DailyActiveUsersDto> {
    if (days.isZero.isTrue) return []

    if (ENV.mode === 'test') {
      return this.normalizeReport(days, [])
    }

    const response = await this.restClient.post<PostHogQueryResponse>(
      `/api/projects/${ENV.posthogProjectId}/query/`,
      {
        query: {
          kind: 'HogQLQuery',
          query: this.buildQuery(days),
        },
        name: 'fetch daily active users report',
      },
    )

    if (response.isFailure) {
      throw new AppError(
        response.errorMessage,
        'PostHog Analytics Reporting Provider Error',
      )
    }

    return this.normalizeReport(days, response.body.results ?? [])
  }

  private buildQuery(days: Integer): string {
    return `
      SELECT
        toDate(timestamp) AS day,
        properties.platform AS platform,
        count(DISTINCT distinct_id) AS users_count
      FROM events
      WHERE event = '$pageview'
        AND timestamp >= toStartOfDay(now() - INTERVAL ${days.value - 1} day)
        AND properties.platform IN ['web', 'mobile']
      GROUP BY day, platform
      ORDER BY day ASC
    `
  }

  private normalizeReport(
    days: Integer,
    rows: Array<[string, string, number]>,
  ): DailyActiveUsersDto {
    const countsByDay = new Map<string, { web: number; mobile: number }>()

    for (const [date, platform, count] of rows) {
      const key = this.normalizeDateKey(date)
      const dailyCounts = countsByDay.get(key) ?? { web: 0, mobile: 0 }

      if (platform === 'mobile') {
        dailyCounts.mobile = count
      } else {
        dailyCounts.web = count
      }

      countsByDay.set(key, dailyCounts)
    }

    return Array.from({ length: days.value }, (_, index) => {
      const date = this.createUtcDateOffset(days.value - index - 1)
      const key = this.normalizeDateKey(date)
      const dailyCounts = countsByDay.get(key) ?? { web: 0, mobile: 0 }

      return {
        date,
        web: dailyCounts.web,
        mobile: dailyCounts.mobile,
      }
    })
  }

  private normalizeDateKey(value: Date | string) {
    const date = new Date(value)
    date.setUTCHours(0, 0, 0, 0)
    return date.toISOString().slice(0, 10)
  }

  private createUtcDateOffset(daysAgo: number) {
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    date.setUTCDate(date.getUTCDate() - daysAgo)
    return date
  }
}
