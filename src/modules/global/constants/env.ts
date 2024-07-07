export const ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  siteURl: process?.env?.NEXT_PUBLIC_SITE_URL,
  url:
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000',
}
