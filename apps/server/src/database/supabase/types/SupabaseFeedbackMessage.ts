import type { Database } from './Database'

export type SupabaseFeedbackMessage =
  Database['public']['Tables']['feedback_messages']['Row'] & {
    feedback_message_attachments?: Array<
      Database['public']['Tables']['feedback_message_attachments']['Row']
    >
  }
