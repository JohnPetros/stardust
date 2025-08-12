import { StringValidation } from '@stardust/core/global/libs'

const CLIENT_ENV = {
  mode: process.env.NODE_ENV,
  supabaseCdnUrl: process.env.NEXT_PUBLIC_SUPABASE_CDN_URL ?? '',
  webAppUrl: process.env.NEXT_PUBLIC_WEB_APP_URL ?? '',
  serverAppUrl: process.env.NEXT_PUBLIC_SERVER_APP_URL ?? '',
}

new StringValidation(CLIENT_ENV.mode, 'App Mode').validate()
new StringValidation(CLIENT_ENV.supabaseCdnUrl, 'Supabase CDN Url').url().validate()
new StringValidation(CLIENT_ENV.webAppUrl, 'App Url').url().validate()
new StringValidation(CLIENT_ENV.serverAppUrl, 'Server App Url').url().validate()

export { CLIENT_ENV }
