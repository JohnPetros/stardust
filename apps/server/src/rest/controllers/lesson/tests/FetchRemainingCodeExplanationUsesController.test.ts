import { mock, type Mock } from 'ts-jest-mocker'

import type { CacheProvider } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { GetRemainingCodeExplanationUsesUseCase } from '@stardust/core/lesson/use-cases'

import { FetchRemainingCodeExplanationUsesController } from '../FetchRemainingCodeExplanationUsesController'

describe('Fetch Remaining Code Explanation Uses Controller', () => {
  let http: Mock<Http>
  let cacheProvider: Mock<CacheProvider>
  let controller: FetchRemainingCodeExplanationUsesController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    cacheProvider = mock()
    controller = new FetchRemainingCodeExplanationUsesController(cacheProvider)
  })

  it('should read account id, delegate to the use case and send the remaining uses', async () => {
    const accountId = 'account-id'
    const response = { remainingUses: 7 }
    const restResponse = mock<RestResponse<{ remainingUses: number }>>()

    http.getAccountId.mockResolvedValue(accountId)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetRemainingCodeExplanationUsesUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalled()
    expect(executeSpy).toHaveBeenCalledWith({ userId: accountId })
    expect(http.send).toHaveBeenCalledWith({ remainingUses: 7 })
    expect(result).toBe(restResponse)
  })
})
