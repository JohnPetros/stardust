import { notFound } from 'next/navigation'

import { SnippetPage } from '@/ui/playground/widgets/pages/Snippet'
import type { NextParams } from '@/server/next/types'
import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabasePlaygroundService } from '@/api/supabase/services'

export default async function Page({ params }: NextParams<{ snippetId: string }>) {
  const supabase = SupabaseServerClient()
  const playgroundService = SupabasePlaygroundService(supabase)
  const response = await playgroundService.fetchSnippetById(params.snippetId)
  if (response.isFailure) return notFound()
  const snippetDto = response.body

  return <SnippetPage snippetDto={snippetDto} />
}
