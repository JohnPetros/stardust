import type { Database } from './Database'

export type SupabaseFeedbackReport =
  Database['public']['Tables']['feedback_reports']['Row'] & {
    admin_message_count?: number
    feedback_messages?: { count: number }[]
    users?: {
      name: string
      email?: string
      slug: string
      avatar: {
        image: string
        name: string
      } | null
    } | null
    preview?: string
    is_unread?: boolean
    author_email?: string
    author_read_at?: string | null
  }
