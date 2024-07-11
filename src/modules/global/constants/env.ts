import { AppError } from '@/@core/errors/global/AppError'

const ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  siteURl: process?.env?.NEXT_PUBLIC_SITE_URL,
  cdnURl: process?.env?.NEXT_PUBLIC_CDN_URL,
  url:
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000',
}

if (!ENV.supabaseUrl || !ENV.supabaseKey) {
  throw new AppError('Enviroment variables must be provided')
}

export { ENV }
