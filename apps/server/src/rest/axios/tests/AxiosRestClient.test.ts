import axios from 'axios'

import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { AxiosRestClient } from '../AxiosRestClient'

jest.mock('axios', () => {
  const create = jest.fn()
  const isAxiosError = jest.fn()

  return {
    __esModule: true,
    default: {
      create,
      isAxiosError,
    },
    create,
    isAxiosError,
  }
})

describe('AxiosRestClient', () => {
  const axiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(axios.create as jest.Mock).mockReturnValue(axiosInstance)
    ;(axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false)
  })

  it('should create paginated responses for GET requests', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    client.setQueryParam('page', '2')
    client.setQueryParam('tags', ['a', 'b'])
    axiosInstance.get.mockResolvedValue({
      data: [{ id: 1 }],
      status: 200,
      headers: {
        [HTTP_HEADERS.xPaginationResponse.toLowerCase()]: 'true',
        [HTTP_HEADERS.xTotalItemsCount]: '10',
        [HTTP_HEADERS.xItemsPerPage]: '5',
      },
    })

    const response = await client.get<Array<{ id: number }>>('/users')

    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.stardust.dev/users?page=2&tags=a&tags=b',
    )
    expect(response.body).toMatchObject({
      items: [{ id: 1 }],
      totalItemsCount: 10,
      itemsPerPage: 5,
    })
  })

  it('should build files from arraybuffer responses', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    axiosInstance.get.mockResolvedValue({
      data: new Uint8Array([1, 2, 3]),
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="report.pdf"',
      },
    })

    const response = await client.getFile('/reports/latest')

    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.stardust.dev/reports/latest',
      { responseType: 'arraybuffer' },
    )
    expect(response.body?.name).toBe('report.pdf')
    expect(response.body?.type).toBe('application/pdf')
  })

  it('should post, put, patch and delete payloads', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    axiosInstance.post.mockResolvedValue({ data: { ok: true }, status: 201, headers: {} })
    axiosInstance.put.mockResolvedValue({ data: { ok: true }, status: 200, headers: {} })
    axiosInstance.patch.mockResolvedValue({
      data: { ok: true },
      status: 200,
      headers: {},
    })
    axiosInstance.delete.mockResolvedValue({
      data: { ok: true },
      status: 200,
      headers: {},
    })

    await client.post('/users', { name: 'Ada' })
    await client.postFormData('/upload', new FormData())
    await client.put('/users/1', { name: 'Grace' })
    await client.patch('/users/1', { active: true })
    await client.delete('/users/1', { hardDelete: true })

    expect(axiosInstance.post).toHaveBeenCalledWith('https://api.stardust.dev/users', {
      name: 'Ada',
    })
    expect(axiosInstance.post).toHaveBeenCalledWith(
      'https://api.stardust.dev/upload',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    expect(axiosInstance.put).toHaveBeenCalled()
    expect(axiosInstance.patch).toHaveBeenCalled()
    expect(axiosInstance.delete).toHaveBeenCalledWith(
      'https://api.stardust.dev/users/1',
      { data: { hardDelete: true } },
    )
  })

  it('should update headers and authorization when configured', async () => {
    const client = new AxiosRestClient()

    client.setBaseUrl('https://api.stardust.dev')
    client.setHeader('x-test', 'value')
    client.setAuthorization('token-123')

    expect(axios.create).toHaveBeenLastCalledWith({
      baseURL: 'https://api.stardust.dev',
      headers: {
        'Content-Type': 'application/json',
        'x-test': 'value',
        [HTTP_HEADERS.authorization]: 'Bearer token-123',
      },
    })
  })

  it('should convert axios string errors into rest responses', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    ;(axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true)
    axiosInstance.get.mockRejectedValue({
      message: 'Request failed',
      response: {
        status: 404,
        data: 'Missing resource',
        headers: {
          'content-type': 'application/json',
        },
      },
    })

    const response = await client.get('/missing')

    expect(response.statusCode).toBe(404)
    expect(response.errorMessage).toBe('Missing resource')
  })

  it('should convert axios object errors into rest responses', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    ;(axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true)
    axiosInstance.get.mockRejectedValue({
      message: 'Request failed',
      response: {
        status: 400,
        data: { message: 'Validation failed' },
        headers: {
          'x-custom-header': ['a', 'b'],
        },
      },
    })

    const response = await client.get('/invalid')

    expect(response.statusCode).toBe(400)
    expect(response.errorMessage).toBe('Validation failed')
    expect(response.headers).toEqual({ 'x-custom-header': 'a,b' })
  })

  it('should convert non-axios errors into rest responses', async () => {
    const client = new AxiosRestClient('https://api.stardust.dev')
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    axiosInstance.get.mockRejectedValue(new Error('Boom'))

    const response = await client.get('/boom')

    expect(response.statusCode).toBe(500)
    expect(response.errorMessage).toBe('Boom')
    expect(consoleSpy).toHaveBeenCalledWith('Axios error', expect.any(Error))
  })
})
