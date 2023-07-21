import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/types/supabase'

export const createClient = () =>
  createServerComponentClient<Database>({ cookies })
