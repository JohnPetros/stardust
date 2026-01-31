import type { Database } from './Database'

export type SupabaseFeedbackReport =
  Database['public']['Tables']['feedback_reports']['Row'] & {
    users: {
      name: string
      slug: string
      avatar: {
        image: string
        name: string
      } | null
    }
  }
