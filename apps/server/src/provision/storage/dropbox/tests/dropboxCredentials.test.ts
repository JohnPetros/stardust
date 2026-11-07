const mockEnv: Record<string, string | undefined> = {}

jest.mock('@/constants', () => ({ ENV: mockEnv }))

import {
  buildDropboxTokenRequestBody,
  getDropboxCredentials,
} from '../dropboxCredentials'

describe('Dropbox credentials', () => {
  beforeEach(() => {
    mockEnv.dropboxRefreshToken = 'refresh-token'
    mockEnv.dropboxAppKey = 'app-key'
    mockEnv.dropboxAppSecret = 'app-secret'
  })

  it('should return the credentials from ENV when all of them are set', () => {
    expect(getDropboxCredentials()).toEqual({
      dropboxRefreshToken: 'refresh-token',
      dropboxAppKey: 'app-key',
      dropboxAppSecret: 'app-secret',
    })
  })

  it('should name every missing variable in the error message', () => {
    mockEnv.dropboxRefreshToken = undefined
    mockEnv.dropboxAppSecret = undefined

    expect(() => getDropboxCredentials()).toThrow(
      'Dropbox storage is not configured: DROPBOX_REFRESH_TOKEN is required, DROPBOX_APP_SECRET is required',
    )
  })

  it('should never turn a missing value into the string "undefined"', () => {
    mockEnv.dropboxAppKey = undefined

    expect(() => getDropboxCredentials()).toThrow(/DROPBOX_APP_KEY is required/)
  })

  it('should build the token request as a form-urlencoded body', () => {
    const body = buildDropboxTokenRequestBody(getDropboxCredentials())

    expect(Object.fromEntries(new URLSearchParams(body))).toEqual({
      grant_type: 'refresh_token',
      refresh_token: 'refresh-token',
      client_id: 'app-key',
      client_secret: 'app-secret',
    })
  })
})
