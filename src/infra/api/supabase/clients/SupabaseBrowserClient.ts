'use client'

import { createBrowserClient } from '@supabase/ssr'

import { AppError } from '@/@core/errors/global/AppError'
import { ENV } from '@/modules/global/constants'

import type { Database } from '../types/Database'

const URL = ENV.supabaseUrl
const ANON_KEY = ENV.supabaseKey

export const SupabaseBrowserClient = () => {
  if (!URL || !ANON_KEY) {
    throw new AppError('Supabase url and anon key must be provided')
  }

  return createBrowserClient<Database>(URL, ANON_KEY)
}
