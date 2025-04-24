import { StringValidation } from '@stardust/core/global/libs'

const ENV = {
  mode: process.env.NODE_ENV,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseCdnUrl: process.env.NEXT_PUBLIC_SUPABASE_CDN_URL ?? '',
  appHost: process.env.NEXT_PUBLIC_APP_HOST ?? '',
}

new StringValidation(ENV.mode, 'App Mode').validate()
new StringValidation(ENV.supabaseUrl, 'Supabase Url').validate()
new StringValidation(ENV.supabaseKey, 'Supabase Key').validate()
new StringValidation(ENV.supabaseCdnUrl, 'Supabase CDN Url').url().validate()
new StringValidation(ENV.appHost, 'App Url').url().validate()

export { ENV }
