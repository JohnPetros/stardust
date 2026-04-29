import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetDailyActiveUsersReportUseCase } from '@stardust/core/profile/use-cases'

import { FetchDailyActiveUsersReportController } from '../FetchDailyActiveUsersReportController'

describe('Fetch Daily Active Users Report Controller', () => {
  let http: Mock<Http<{ queryParams: { days: number } }>>
  let repository: Mock<UsersRepository>
  let controller: FetchDailyActiveUsersReportController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchDailyActiveUsersReportController(repository)
  })

  it('should execute daily active users report use case using days and return response through http.send', async () => {
    const days = 7
    const useCaseResponse = [
      { date: new Date('2026-01-01'), web: 12, mobile: 8 },
      { date: new Date('2026-01-02'), web: 15, mobile: 10 },
    ]
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue({ days })
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetDailyActiveUsersReportUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ days })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
