import { notFound } from 'next/navigation'

import { SnippetPage } from '@/ui/playground/widgets/pages/Snippet'
import type { NextParams } from '@/rpc/next/types'
import { SupabaseServerClient } from '@/rest/supabase/clients'
import { SupabaseAuthService, SupabasePlaygroundService } from '@/rest/supabase/services'
import { NotPublicSnippetPage } from '@/ui/playground/widgets/pages/NotPublicPlayground'

export default async function Page({ params }: NextParams<{ snippetId: string }>) {
  const supabase = SupabaseServerClient()
  const playgroundService = SupabasePlaygroundService(supabase)
  const playgroundResponse = await playgroundService.fetchSnippetById(params.snippetId)
  if (playgroundResponse.isFailure) return notFound()
  const snippetDto = playgroundResponse.body

  const authService = SupabaseAuthService(supabase)
  const authResponse = await authService.fetchUserId()
  if (authResponse.isFailure) authResponse.throwError()
  const userId = authResponse.body

  if (snippetDto.author.id !== userId && !snippetDto.isPublic)
    return <NotPublicSnippetPage />

  return <SnippetPage snippetDto={snippetDto} />
}
