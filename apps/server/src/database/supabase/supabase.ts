import { createClient } from '@supabase/supabase-js'

import { ENV } from '@/constants'

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey)
