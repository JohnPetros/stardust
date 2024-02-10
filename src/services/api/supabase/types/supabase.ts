import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './Database'

export type Supabase = SupabaseClient<Database>
