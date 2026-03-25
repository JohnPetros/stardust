import type { Database } from './Database'

export type SupabaseChallengeSource =
  Database['public']['Tables']['challenge_sources']['Row'] & {
    additional_instructions?: string | null
    challenges?: {
      id: string
      title: string
      slug: string
    } | null
  }
