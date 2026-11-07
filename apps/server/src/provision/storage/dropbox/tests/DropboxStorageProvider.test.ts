const mockEnv: Record<string, string | undefined> = {}

jest.mock('dropbox', () => ({ Dropbox: jest.fn() }))
jest.mock('@/constants', () => ({ ENV: mockEnv }))

import type { RestClient } from '@stardust/core/global/interfaces'

import { DropboxStorageProvider } from '../DropboxStorageProvider'

describe('Dropbox storage provider', () => {
  const restClient = {
    setBaseUrl: jest.fn(),
    setHeader: jest.fn(),
    setQueryParam: jest.fn(),
    post: jest.fn(),
  }
  const createProvider = () =>
    new DropboxStorageProvider(restClient as unknown as RestClient)

  beforeEach(() => {
    mockEnv.mode = 'production'
    mockEnv.dropboxRefreshToken = undefined
    mockEnv.dropboxAppKey = undefined
    mockEnv.dropboxAppSecret = undefined
    jest.clearAllMocks()
  })

  it('should be instantiated without Dropbox credentials', () => {
    expect(() => createProvider()).not.toThrow()
    expect(restClient.setBaseUrl).toHaveBeenCalledWith('https://api.dropbox.com')
  })

  it('should fail with a clear message only when an access token is requested', async () => {
    const provider = createProvider()

    await expect(provider['fetchAccessToken']()).rejects.toThrow(
      'Dropbox storage is not configured: DROPBOX_REFRESH_TOKEN is required, DROPBOX_APP_KEY is required, DROPBOX_APP_SECRET is required',
    )
    expect(restClient.post).not.toHaveBeenCalled()
  })

  it('should request the access token with a form-urlencoded body', async () => {
    mockEnv.dropboxRefreshToken = 'refresh-token'
    mockEnv.dropboxAppKey = 'app-key'
    mockEnv.dropboxAppSecret = 'app-secret'
    restClient.post.mockResolvedValue({ body: { access_token: 'access-token' } })
    const provider = createProvider()

    const accessToken = await provider['fetchAccessToken']()

    const [route, body] = restClient.post.mock.calls[0]
    expect(accessToken).toBe('access-token')
    expect(restClient.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded',
    )
    expect(route).toBe('/oauth2/token')
    expect(Object.fromEntries(new URLSearchParams(String(body)))).toEqual({
      grant_type: 'refresh_token',
      refresh_token: 'refresh-token',
      client_id: 'app-key',
      client_secret: 'app-secret',
    })
    expect(restClient.setQueryParam).not.toHaveBeenCalled()
  })
})
