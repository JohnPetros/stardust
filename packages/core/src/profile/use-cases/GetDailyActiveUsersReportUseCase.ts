import type { UseCase } from '#global/interfaces/UseCase'
import type { DailyActiveUsersDto } from '../../main'
import type { UsersRepository } from '../interfaces'
import { Platform } from '../domain/structures'

type Request = {
  days: number
}

export class GetDailyActiveUsersReportUseCase
  implements UseCase<Request, Promise<DailyActiveUsersDto>>
{
  private static readonly WEB_PLATFORM = Platform.createAsWeb()
  private static readonly MOBILE_PLATFORM = Platform.createAsMobile()

  constructor(private readonly repository: UsersRepository) {}

  async execute({ days }: Request): Promise<DailyActiveUsersDto> {
    const dates = this.getDates(days)

    const visitCounts = await Promise.all(
      dates.map(async (date) => {
        const [webVisits, mobileVisits] = await Promise.all([
          this.repository.countVisitsByDateAndPlatform(
            date,
            GetDailyActiveUsersReportUseCase.WEB_PLATFORM,
          ),
          this.repository.countVisitsByDateAndPlatform(
            date,
            GetDailyActiveUsersReportUseCase.MOBILE_PLATFORM,
          ),
        ])

        return {
          date,
          webCount: webVisits.value,
          mobileCount: mobileVisits.value,
        }
      }),
    )

    return {
      web: visitCounts.map(({ date, webCount }) => ({ date, count: webCount })),
      mobile: visitCounts.map(({ date, mobileCount }) => ({
        date,
        count: mobileCount,
      })),
    }
  }

  private getDates(days: number): Date[] {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      return date
    }).reverse()
  }
}
