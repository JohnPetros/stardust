import { StringValidation } from '@stardust/core/global/libs'

const CLIENT_ENV = {
  mode: process.env.NODE_ENV,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseCdnUrl: process.env.NEXT_PUBLIC_SUPABASE_CDN_URL ?? '',
  appHost: process.env.NEXT_PUBLIC_APP_HOST ?? '',
}

new StringValidation(CLIENT_ENV.mode, 'App Mode').validate()
new StringValidation(CLIENT_ENV.supabaseUrl, 'Supabase Url').validate()
new StringValidation(CLIENT_ENV.supabaseKey, 'Supabase Key').validate()
new StringValidation(CLIENT_ENV.supabaseCdnUrl, 'Supabase CDN Url').url().validate()
new StringValidation(CLIENT_ENV.appHost, 'App Url').url().validate()

export { CLIENT_ENV }
