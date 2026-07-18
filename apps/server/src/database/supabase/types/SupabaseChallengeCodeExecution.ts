import type { Database } from './Database'

export type SupabaseChallengeCodeExecution =
  Database['public']['Tables']['challenge_code_executions']['Row']
