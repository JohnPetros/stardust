import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './database'

export type Supabase = SupabaseClient<Database>
