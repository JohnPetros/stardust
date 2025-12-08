import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Integer } from '#global/domain/structures/Integer'
import type { Platform } from '#profile/domain/structures/Platform'
import { GetDailyActiveUsersReportUseCase } from '../GetDailyActiveUsersReportUseCase'

describe('Get Daily Active Users Report Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: GetDailyActiveUsersReportUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.countVisitsByDateAndPlatform.mockImplementation()
    useCase = new GetDailyActiveUsersReportUseCase(repository)
  })

  it('should return the daily active users report with correct structure', async () => {
    const days = 3

    repository.countVisitsByDateAndPlatform.mockImplementation(
      async (date: Date, platform: Platform) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateToCompare = new Date(date)
        dateToCompare.setHours(0, 0, 0, 0)
        const dayIndex = Math.floor(
          (today.getTime() - dateToCompare.getTime()) / (1000 * 60 * 60 * 24),
        )
        const baseValue = (dayIndex + 1) * 10

        if (platform.name === 'web') {
          return Integer.create(baseValue)
        }
        return Integer.create(baseValue + 5)
      },
    )

    const response = await useCase.execute({ days })

    expect(Array.isArray(response)).toBe(true)
    expect(response).toHaveLength(days)
    expect(response[0]).toHaveProperty('date')
    expect(response[0]).toHaveProperty('web')
    expect(response[0]).toHaveProperty('mobile')
  })

  it('should return visit counts for web and mobile platforms', async () => {
    const days = 2

    repository.countVisitsByDateAndPlatform.mockImplementation(
      async (_date: Date, platform: Platform) => {
        if (platform.name === 'web') {
          return Integer.create(100)
        }
        return Integer.create(50)
      },
    )

    const response = await useCase.execute({ days })

    expect(response[0].web).toBe(100)
    expect(response[0].mobile).toBe(50)
    expect(response[1].web).toBe(100)
    expect(response[1].mobile).toBe(50)
  })

  it('should return dates in chronological order from oldest to newest', async () => {
    const days = 3

    repository.countVisitsByDateAndPlatform.mockResolvedValue(Integer.create(0))

    const response = await useCase.execute({ days })

    for (let i = 1; i < response.length; i++) {
      const previousDate = response[i - 1].date.getTime()
      const currentDate = response[i].date.getTime()
      expect(currentDate).toBeGreaterThan(previousDate)
    }
  })

  it('should return correct visit counts for different dates', async () => {
    const days = 3

    repository.countVisitsByDateAndPlatform.mockImplementation(
      async (date: Date, platform: Platform) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateToCompare = new Date(date)
        dateToCompare.setHours(0, 0, 0, 0)
        const dayIndex = Math.floor(
          (today.getTime() - dateToCompare.getTime()) / (1000 * 60 * 60 * 24),
        )

        const webValues: Record<number, number> = {
          0: 30, // today
          1: 20, // yesterday
          2: 10, // 2 days ago
        }
        const mobileValues: Record<number, number> = {
          0: 35, // today
          1: 25, // yesterday
          2: 15, // 2 days ago
        }

        if (platform.name === 'web') {
          return Integer.create(webValues[dayIndex] || 0)
        }
        return Integer.create(mobileValues[dayIndex] || 0)
      },
    )

    const response = await useCase.execute({ days })

    expect(response[0].web).toBe(10)
    expect(response[1].web).toBe(20)
    expect(response[2].web).toBe(30)
    expect(response[0].mobile).toBe(15)
    expect(response[1].mobile).toBe(25)
    expect(response[2].mobile).toBe(35)
  })

  it('should return empty arrays when days is 0', async () => {
    repository.countVisitsByDateAndPlatform.mockResolvedValue(Integer.create(0))

    const response = await useCase.execute({ days: 0 })

    expect(response).toHaveLength(0)
  })

  it('should call repository with correct platform for each date', async () => {
    const days = 2

    repository.countVisitsByDateAndPlatform.mockResolvedValue(Integer.create(0))

    await useCase.execute({ days })

    expect(repository.countVisitsByDateAndPlatform).toHaveBeenCalledTimes(days * 2)

    const calls = repository.countVisitsByDateAndPlatform.mock.calls
    const webCalls = calls.filter(([, platform]) => platform.name === 'web')
    const mobileCalls = calls.filter(([, platform]) => platform.name === 'mobile')

    expect(webCalls).toHaveLength(days)
    expect(mobileCalls).toHaveLength(days)
  })
})
