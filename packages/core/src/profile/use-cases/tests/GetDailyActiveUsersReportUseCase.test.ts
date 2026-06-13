import { mock, type Mock } from 'ts-jest-mocker'

import type { AnalyticsReportingProvider } from '../../../analytics/interfaces/AnalyticsReportingProvider'
import { GetDailyActiveUsersReportUseCase } from '../GetDailyActiveUsersReportUseCase'

describe('Get Daily Active Users Report Use Case', () => {
  let analyticsReportingProvider: Mock<AnalyticsReportingProvider>
  let useCase: GetDailyActiveUsersReportUseCase

  beforeEach(() => {
    analyticsReportingProvider = mock<AnalyticsReportingProvider>()
    analyticsReportingProvider.getDailyActiveUsers.mockImplementation()
    useCase = new GetDailyActiveUsersReportUseCase(analyticsReportingProvider)
  })

  it('should return the daily active users report with correct structure', async () => {
    const days = 3

    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([
      { date: new Date('2026-06-09T00:00:00.000Z'), web: 10, mobile: 15 },
      { date: new Date('2026-06-10T00:00:00.000Z'), web: 20, mobile: 25 },
      { date: new Date('2026-06-11T00:00:00.000Z'), web: 30, mobile: 35 },
    ])

    const response = await useCase.execute({ days })

    expect(Array.isArray(response)).toBe(true)
    expect(response).toHaveLength(days)
    expect(response[0]).toHaveProperty('date')
    expect(response[0]).toHaveProperty('web')
    expect(response[0]).toHaveProperty('mobile')
  })

  it('should return visit counts for web and mobile platforms', async () => {
    const days = 2

    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([
      { date: new Date('2026-06-10T00:00:00.000Z'), web: 100, mobile: 50 },
      { date: new Date('2026-06-11T00:00:00.000Z'), web: 100, mobile: 50 },
    ])

    const response = await useCase.execute({ days })

    expect(response[0].web).toBe(100)
    expect(response[0].mobile).toBe(50)
    expect(response[1].web).toBe(100)
    expect(response[1].mobile).toBe(50)
  })

  it('should return dates in chronological order from oldest to newest', async () => {
    const days = 3

    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([
      { date: new Date('2026-06-09T00:00:00.000Z'), web: 0, mobile: 0 },
      { date: new Date('2026-06-10T00:00:00.000Z'), web: 0, mobile: 0 },
      { date: new Date('2026-06-11T00:00:00.000Z'), web: 0, mobile: 0 },
    ])

    const response = await useCase.execute({ days })

    for (let i = 1; i < response.length; i++) {
      const previousDate = response[i - 1].date.getTime()
      const currentDate = response[i].date.getTime()
      expect(currentDate).toBeGreaterThan(previousDate)
    }
  })

  it('should return correct visit counts for different dates', async () => {
    const days = 3

    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([
      { date: new Date('2026-06-09T00:00:00.000Z'), web: 10, mobile: 15 },
      { date: new Date('2026-06-10T00:00:00.000Z'), web: 20, mobile: 25 },
      { date: new Date('2026-06-11T00:00:00.000Z'), web: 30, mobile: 35 },
    ])

    const response = await useCase.execute({ days })

    expect(response[0].web).toBe(10)
    expect(response[1].web).toBe(20)
    expect(response[2].web).toBe(30)
    expect(response[0].mobile).toBe(15)
    expect(response[1].mobile).toBe(25)
    expect(response[2].mobile).toBe(35)
  })

  it('should return empty arrays when days is 0', async () => {
    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([])

    const response = await useCase.execute({ days: 0 })

    expect(response).toHaveLength(0)
  })

  it('should call provider with the requested number of days', async () => {
    const days = 2

    analyticsReportingProvider.getDailyActiveUsers.mockResolvedValue([])

    await useCase.execute({ days })

    expect(analyticsReportingProvider.getDailyActiveUsers).toHaveBeenCalledTimes(1)
    expect(analyticsReportingProvider.getDailyActiveUsers).toHaveBeenCalledWith(
      expect.objectContaining({ value: days }),
    )
  })
})
