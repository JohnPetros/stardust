import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUnlockedStarsKpiUseCase } from '@stardust/core/profile/use-cases'

import { FetchUnlockedStarsKpiController } from '../FetchUnlockedStarsKpiController'

describe('Fetch Unlocked Stars Kpi Controller', () => {
  let http: Mock<Http>
  let repository: Mock<UsersRepository>
  let controller: FetchUnlockedStarsKpiController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchUnlockedStarsKpiController(repository)
  })

  it('should execute use case and send unlocked stars kpi', async () => {
    const kpiDto = {
      value: 40,
      currentMonthValue: 22,
      previousMonthValue: 18,
    }
    const restResponse = mock<RestResponse>()

    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetUnlockedStarsKpiUseCase.prototype, 'execute')
      .mockResolvedValue(kpiDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(kpiDto)
    expect(response).toBe(restResponse)
  })
})
