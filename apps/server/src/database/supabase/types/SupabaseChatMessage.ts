import type { Database } from './Database'

export type SupabaseChatMessage = Database['public']['Tables']['chat_messages']['Row']
