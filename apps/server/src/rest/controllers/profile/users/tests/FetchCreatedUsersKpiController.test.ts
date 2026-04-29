import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetCreatedUsersKpiUseCase } from '@stardust/core/profile/use-cases'

import { FetchCreatedUsersKpiController } from '../FetchCreatedUsersKpiController'

describe('Fetch Created Users Kpi Controller', () => {
  let http: Mock<Http>
  let repository: Mock<UsersRepository>
  let controller: FetchCreatedUsersKpiController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchCreatedUsersKpiController(repository)
  })

  it('should execute use case and send users kpi', async () => {
    const kpiDto = {
      value: 10,
      currentMonthValue: 6,
      previousMonthValue: 4,
    }
    const restResponse = mock<RestResponse>()

    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetCreatedUsersKpiUseCase.prototype, 'execute')
      .mockResolvedValue(kpiDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(kpiDto)
    expect(response).toBe(restResponse)
  })
})
