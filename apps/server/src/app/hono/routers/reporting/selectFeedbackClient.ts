import type { SupabaseClient } from '@supabase/supabase-js'

export const selectFeedbackClient = (
  isGodAccount: boolean,
  requestClient: SupabaseClient,
  adminClient: SupabaseClient,
): SupabaseClient => (isGodAccount ? adminClient : requestClient)
