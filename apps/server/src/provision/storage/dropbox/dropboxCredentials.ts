import { z } from 'zod'

import { ENV } from '@/constants'

const dropboxCredentialsSchema = z.object({
  dropboxRefreshToken: z.string({ required_error: 'DROPBOX_REFRESH_TOKEN is required' }),
  dropboxAppKey: z.string({ required_error: 'DROPBOX_APP_KEY is required' }),
  dropboxAppSecret: z.string({ required_error: 'DROPBOX_APP_SECRET is required' }),
})

export type DropboxCredentials = z.infer<typeof dropboxCredentialsSchema>

export function getDropboxCredentials(): DropboxCredentials {
  const result = dropboxCredentialsSchema.safeParse(ENV)
  if (result.success) return result.data

  const reasons = result.error.issues.map((issue) => issue.message).join(', ')
  throw new Error(`Dropbox storage is not configured: ${reasons}`)
}

export function buildDropboxTokenRequestBody(credentials: DropboxCredentials): string {
  return new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: credentials.dropboxRefreshToken,
    client_id: credentials.dropboxAppKey,
    client_secret: credentials.dropboxAppSecret,
  }).toString()
}
