import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetCompletedChallengesKpiUseCase } from '@stardust/core/profile/use-cases'

import { FetchCompletedChallengesKpiController } from '../FetchCompletedChallengesKpiController'

describe('Fetch Completed Challenges Kpi Controller', () => {
  let http: Mock<Http>
  let repository: Mock<UsersRepository>
  let controller: FetchCompletedChallengesKpiController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchCompletedChallengesKpiController(repository)
  })

  it('should execute use case and send completed challenges kpi', async () => {
    const kpiDto = {
      value: 25,
      currentMonthValue: 15,
      previousMonthValue: 10,
    }
    const restResponse = mock<RestResponse>()

    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetCompletedChallengesKpiUseCase.prototype, 'execute')
      .mockResolvedValue(kpiDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(kpiDto)
    expect(response).toBe(restResponse)
  })
})
