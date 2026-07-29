import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { NextRestClient } from './NextRestClient'
import { handleRestError } from './utils/handleRestError'

jest.mock('./utils/handleRestError', () => ({
  handleRestError: jest.fn(),
}))

function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  const status = init.status ?? 200
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...init.headers,
  })

  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => body,
  } as Response
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

describe('NextRestClient', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    globalThis.fetch = fetchMock
    jest.mocked(handleRestError).mockReset()
  })

  function createClient() {
    const client = NextRestClient({ isCacheEnabled: false })
    client.setBaseUrl('https://stardust.test')
    return client
  }

  it('should consume query params before fetching common and paginated responses', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse([], {
          headers: {
            [HTTP_HEADERS.xPaginationResponse]: 'true',
            [HTTP_HEADERS.xTotalItemsCount]: '0',
            [HTTP_HEADERS.xItemsPerPage]: '10',
            [HTTP_HEADERS.xPage]: '1',
          },
        }),
      )
      .mockResolvedValueOnce(createJsonResponse({ ok: true }))

    const client = createClient()
    client.setQueryParam('search', '')
    client.setQueryParam('page', '1')
    client.setQueryParam('itemsPerPage', '10')

    const paginatedResponse = await client.get('/conversation/chats')
    const commonResponse = await client.get('/health')

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://stardust.test/conversation/chats?search=&page=1&itemsPerPage=10',
    )
    expect(fetchMock.mock.calls[1][0]).toBe('https://stardust.test/health')
    expect(paginatedResponse.statusCode).toBe(200)
    expect(paginatedResponse.body).toMatchObject({
      items: [],
      itemsPerPage: 10,
      page: 1,
    })
    expect(commonResponse.body).toEqual({ ok: true })
  })

  it('should retry a 401 with the original URL while another operation consumes params', async () => {
    const refreshDeferred = createDeferred<void>()
    jest
      .mocked(handleRestError)
      .mockImplementation(async (_response, retryRequest, onRefreshSuccess) => {
        await refreshDeferred.promise
        onRefreshSuccess?.({ accessToken: 'fresh-token' } as never)
        return await retryRequest()
      })
    fetchMock
      .mockResolvedValueOnce(createJsonResponse(null, { status: 401 }))
      .mockResolvedValueOnce(createJsonResponse({ operation: 'other' }))
      .mockResolvedValueOnce(createJsonResponse([]))

    const client = createClient()
    client.setQueryParam('search', '')
    client.setQueryParam('page', '1')
    client.setQueryParam('itemsPerPage', '10')
    const chatsRequest = client.get('/conversation/chats')

    await Promise.resolve()
    await Promise.resolve()
    expect(handleRestError).toHaveBeenCalledTimes(1)

    client.setQueryParam('operation', 'other')
    await client.get('/other-operation')

    refreshDeferred.resolve()
    await chatsRequest

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://stardust.test/conversation/chats?search=&page=1&itemsPerPage=10',
    )
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://stardust.test/other-operation?operation=other',
    )
    expect(fetchMock.mock.calls[2][0]).toBe(fetchMock.mock.calls[0][0])
    expect(fetchMock.mock.calls[2][1]?.headers).toMatchObject({
      [HTTP_HEADERS.authorization]: 'Bearer fresh-token',
    })
  })
})
