import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetPostedChallengesKpiUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { FetchPostedChallengesKpiController } from '../FetchPostedChallengesKpiController'

describe('Fetch Posted Challenges Kpi Controller', () => {
  let http: Mock<Http>
  let repository: Mock<ChallengesRepository>
  let controller: FetchPostedChallengesKpiController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchPostedChallengesKpiController(repository)
  })

  it('should fetch posted challenges kpi and send response', async () => {
    const kpiDto = {
      value: 30,
      currentMonthValue: 18,
      previousMonthValue: 12,
    }
    const restResponse = mock<RestResponse>()

    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetPostedChallengesKpiUseCase.prototype, 'execute')
      .mockResolvedValue(kpiDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(kpiDto)
    expect(response).toBe(restResponse)
  })
})
