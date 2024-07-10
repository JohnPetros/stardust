'use client'

import { createBrowserClient } from '@supabase/ssr'

import { ENV } from '@/modules/global/constants'

import type { Database } from '../types/Database'

export const SupabaseBrowserClient = () => {
  return createBrowserClient<Database>(ENV.supabaseUrl, ENV.supabaseKey)
}
