import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import { RevokeApiKeyUseCase } from '@stardust/core/auth/use-cases'
import { RevokeApiKeyController } from '../RevokeApiKeyController'

describe('Revoke Api Key Controller', () => {
  let http: Mock<Http<{ routeParams: { apiKeyId: string } }>>
  let repository: Mock<ApiKeysRepository>
  let controller: RevokeApiKeyController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new RevokeApiKeyController(repository)
    http.statusNoContent.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract params, call the use case and return no content status', async () => {
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ apiKeyId: 'api-key-id' })
    http.getAccountId.mockResolvedValue('account-id')
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(RevokeApiKeyUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      apiKeyId: 'api-key-id',
      userId: 'account-id',
    })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith()
    expect(result).toBe(restResponse)
  })
})
