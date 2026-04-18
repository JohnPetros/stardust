import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import { RenameApiKeyUseCase } from '@stardust/core/auth/use-cases'
import { RenameApiKeyController } from '../RenameApiKeyController'

describe('Rename Api Key Controller', () => {
  let http: Mock<Http<{ routeParams: { apiKeyId: string }; body: { name: string } }>>
  let repository: Mock<ApiKeysRepository>
  let controller: RenameApiKeyController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new RenameApiKeyController(repository)
    http.statusOk.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract body and params, call the use case and return ok status', async () => {
    const restResponse = mock<RestResponse>()
    const response = {
      id: 'api-key-id',
      name: 'Nome novo',
      keyPreview: 'sk_123...cdef',
      createdAt: new Date('2026-04-18T12:00:00Z'),
    }

    http.getBody.mockResolvedValue({ name: 'Nome novo' })
    http.getRouteParams.mockReturnValue({ apiKeyId: 'api-key-id' })
    http.getAccountId.mockResolvedValue('account-id')
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(RenameApiKeyUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      apiKeyId: 'api-key-id',
      name: 'Nome novo',
      userId: 'account-id',
    })
    expect(http.statusOk).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
