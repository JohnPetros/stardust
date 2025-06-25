import { notFound } from 'next/navigation'

import { SnippetPage } from '@/ui/playground/widgets/pages/Snippet'
import type { NextParams } from '@/rpc/next/types'
import { NotPublicSnippetPage } from '@/ui/playground/widgets/pages/NotPublicPlayground'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { PlaygroundService } from '@/rest/services'

export const Page = async ({ params }: NextParams<'snippetId'>) => {
  // const restClient = await NextServerRestClient()
  // const playgroundService = PlaygroundService(restClient)
  // const playgroundResponse = await playgroundService.fetchSnippetById(params.snippetId)
  // if (playgroundResponse.isFailure) return notFound()
  // const snippetDto = playgroundResponse.body
  // const authService = SupabaseAuthService(supabase)
  // const authResponse = await authService.fetchUserId()
  // if (authResponse.isFailure) authResponse.throwError()
  // const userId = authResponse.body
  // if (snippetDto.author.id !== userId && !snippetDto.isPublic)
  //   return <NotPublicSnippetPage />
  // return <SnippetPage snippetDto={snippetDto} />
}
