import type { SupabaseClient } from '@supabase/supabase-js'

import { InngestFunctions } from './InngestFunctions'

export class ManualFunctions extends InngestFunctions {
  getFunctions(_supabase: SupabaseClient) {
    return []
  }
}
