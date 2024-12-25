// deno-lint-ignore-file
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { ENV } from 'constants/Env'

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey)
