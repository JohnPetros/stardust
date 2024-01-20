import { cache } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { Database } from '../types/database'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const createClient = cache(() => {
  if (!URL || !ANON_KEY) {
    throw new Error('Supabase url and anon key must be provided')
  }

  const cookie = cookies()
  return createServerClient<Database>(URL, ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookie.get(name)?.value
      },
    },
  })
})

export { createClient as createServerClient }
