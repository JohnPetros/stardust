import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { ApiKeysRepository } from '@stardust/core/auth/interfaces'
import { ListResponse } from '@stardust/core/global/responses'
import { ListApiKeysUseCase } from '@stardust/core/auth/use-cases'
import { FetchApiKeysListController } from '../FetchApiKeysListController'

describe('Fetch Api Keys List Controller', () => {
  let http: Mock<Http>
  let repository: Mock<ApiKeysRepository>
  let controller: FetchApiKeysListController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new FetchApiKeysListController(repository)
    http.statusOk.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract the account id, call the use case and return ok status', async () => {
    const restResponse = mock<RestResponse>()
    const response = new ListResponse({
      items: [
        {
          id: 'api-key-id',
          name: 'Minha chave',
          keyPreview: 'sk_123...cdef',
          createdAt: new Date('2026-04-18T12:00:00Z'),
        },
      ],
    })

    http.getAccountId.mockResolvedValue('account-id')
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(ListApiKeysUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId: 'account-id' })
    expect(http.statusOk).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
