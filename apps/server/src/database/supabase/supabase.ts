import { createClient } from '@supabase/supabase-js'

import { ENV } from '@/constants'

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey)

export const supabaseAdmin = ENV.supabaseServiceRole
  ? createClient(ENV.supabaseUrl, ENV.supabaseServiceRole)
  : ENV.mode === 'test'
    ? supabase
    : (() => {
        throw new Error('SUPABASE_SERVICE_ROLE is required outside test mode')
      })()
