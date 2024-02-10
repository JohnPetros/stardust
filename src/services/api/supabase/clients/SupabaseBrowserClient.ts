'use client'

import { createBrowserClient } from '@supabase/ssr'

import { Database } from '../types/Database'

export const SupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
