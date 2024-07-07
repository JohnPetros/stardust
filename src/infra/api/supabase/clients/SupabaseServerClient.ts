import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { AppError } from '@/@core/errors/global/AppError'
import { ENV } from '@/modules/global/constants'

import type { Database } from '../types/Database'

const URL = ENV.supabaseUrl
const ANON_KEY = ENV.supabaseKey

export const SupabaseServerClient = () => {
  if (!URL || !ANON_KEY) {
    throw new AppError('Supabase url and anon key must be provided')
  }

  const cookie = cookies()
  return createServerClient<Database>(URL, ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookie.get(name)?.value
      },
    },
  })
}
