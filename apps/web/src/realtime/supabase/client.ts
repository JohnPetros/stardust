import { createBrowserClient } from '@supabase/ssr'

import { CLIENT_ENV } from '@/constants'

export const SupabaseClient = () => {
  return createBrowserClient(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey)
}
