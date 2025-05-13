import type { Database } from './Database'

export type SupabaseComment = Omit<
  Database['public']['Views']['comments_view']['Row'],
  'parent_comment_id'
>
