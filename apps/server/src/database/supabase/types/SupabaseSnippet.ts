import type { Database } from './Database'

export type SupabaseSnippet = Database['public']['Views']['snippets_view']['Row']
export type SupabaseSnippetPayload = Database['public']['Tables']['snippets']['Insert']
