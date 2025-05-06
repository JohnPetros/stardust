import { createBrowserClient } from '@supabase/ssr'

import { CLIENT_ENV } from '@/constants'

import type { Database } from '../types/Database'

export const SupabaseBrowserClient = () => {
  return createBrowserClient<Database>(CLIENT_ENV.supabaseUrl, CLIENT_ENV.supabaseKey)
}
