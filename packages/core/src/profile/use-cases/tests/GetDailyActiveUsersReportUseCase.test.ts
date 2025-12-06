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
        const dayIndex = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        const baseValue = (dayIndex + 1) * 10

        if (platform.name === 'web') {
          return Integer.create(baseValue)
        }
        return Integer.create(baseValue + 5)
      },
    )

    const response = await useCase.execute({ days })

    expect(response).toHaveProperty('web')
    expect(response).toHaveProperty('mobile')
    expect(response.web).toHaveLength(days)
    expect(response.mobile).toHaveLength(days)
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

    expect(response.web[0].count).toBe(100)
    expect(response.mobile[0].count).toBe(50)
    expect(response.web[1].count).toBe(100)
    expect(response.mobile[1].count).toBe(50)
  })

  it('should return dates in chronological order from oldest to newest', async () => {
    const days = 3

    repository.countVisitsByDateAndPlatform.mockResolvedValue(Integer.create(0))

    const response = await useCase.execute({ days })

    for (let i = 1; i < response.web.length; i++) {
      const previousDate = response.web[i - 1].date.getTime()
      const currentDate = response.web[i].date.getTime()
      expect(currentDate).toBeGreaterThan(previousDate)
    }

    for (let i = 1; i < response.mobile.length; i++) {
      const previousDate = response.mobile[i - 1].date.getTime()
      const currentDate = response.mobile[i].date.getTime()
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
          0: 30, // hoje
          1: 20, // ontem
          2: 10, // 2 dias atrás
        }
        const mobileValues: Record<number, number> = {
          0: 35, // hoje
          1: 25, // ontem
          2: 15, // 2 dias atrás
        }

        if (platform.name === 'web') {
          return Integer.create(webValues[dayIndex] || 0)
        }
        return Integer.create(mobileValues[dayIndex] || 0)
      },
    )

    const response = await useCase.execute({ days })

    expect(response.web[0].count).toBe(10)
    expect(response.web[1].count).toBe(20)
    expect(response.web[2].count).toBe(30)
    expect(response.mobile[0].count).toBe(15)
    expect(response.mobile[1].count).toBe(25)
    expect(response.mobile[2].count).toBe(35)
  })

  it('should return empty arrays when days is 0', async () => {
    repository.countVisitsByDateAndPlatform.mockResolvedValue(Integer.create(0))

    const response = await useCase.execute({ days: 0 })

    expect(response.web).toHaveLength(0)
    expect(response.mobile).toHaveLength(0)
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
