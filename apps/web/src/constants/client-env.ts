import { StringValidation } from '@stardust/core/global/libs'

const CLIENT_ENV = {
  mode: process.env.NODE_ENV,
  supabaseCdnUrl: process.env.NEXT_PUBLIC_SUPABASE_CDN_URL ?? '',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  stardustWebUrl: process.env.NEXT_PUBLIC_WEB_APP_URL ?? '',
  stardustServerUrl: process.env.NEXT_PUBLIC_SERVER_APP_URL ?? '',
}

new StringValidation(CLIENT_ENV.mode, 'App Mode').validate()
new StringValidation(CLIENT_ENV.supabaseCdnUrl, 'Supabase CDN Url').url().validate()
new StringValidation(CLIENT_ENV.supabaseUrl, 'Supabase Url').url().validate()
new StringValidation(CLIENT_ENV.supabaseKey, 'Supabase Key').validate()
new StringValidation(CLIENT_ENV.stardustWebUrl, 'App Url').url().validate()
new StringValidation(CLIENT_ENV.stardustServerUrl, 'StarDust Server Url').url().validate()

export { CLIENT_ENV }
