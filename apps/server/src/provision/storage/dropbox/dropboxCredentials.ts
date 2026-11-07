import { ENV } from '@/constants'

const REQUIRED_VARIABLES = [
  'DROPBOX_REFRESH_TOKEN',
  'DROPBOX_APP_KEY',
  'DROPBOX_APP_SECRET',
]

export function assertDropboxCredentials(): void {
  const missing = REQUIRED_VARIABLES.filter((name) => !process.env[name])
  if (missing.length === 0) return

  throw new Error(
    `Dropbox storage is not configured. Missing environment variables: ${missing.join(', ')}`,
  )
}

export function getDropboxTokenParams(): Record<string, string> {
  assertDropboxCredentials()

  return {
    refresh_token: String(ENV.dropboxRefreshToken),
    client_id: String(ENV.dropboxAppKey),
    client_secret: String(ENV.dropboxAppSecret),
  }
}
