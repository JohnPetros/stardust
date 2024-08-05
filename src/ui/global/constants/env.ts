import { StringValidation } from '@/@core/lib/validation'

const ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  url:
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000',
}

new StringValidation(ENV.supabaseUrl, 'Supabase Url').validate()
new StringValidation(ENV.supabaseKey, 'Supabase Key').validate()
new StringValidation(ENV.cdnUrl, 'CDN Url').url().validate()
new StringValidation(ENV.cdnUrl, 'App Url').url().validate()

export { ENV }
