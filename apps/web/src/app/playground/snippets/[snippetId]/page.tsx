import type { NextParams } from '@/rpc/next/types'
import { playgroundActions } from '@/rpc/next-safe-action'
import { SnippetPage } from '@/ui/playground/widgets/pages/Snippet'
import { NotPublicSnippetPage } from '@/ui/playground/widgets/pages/NotPublicPlayground'

export const dynamic = 'force-dynamic'

const Page = async ({ params }: NextParams<'snippetId'>) => {
  const { snippetId } = await params
  const response = await playgroundActions.accessSnippetPage({
    snippetId,
  })
  if (!response?.data) return
  const { snippet, isPageNotPublic } = response.data

  if (isPageNotPublic) return <NotPublicSnippetPage />
  return <SnippetPage snippetDto={snippet} />
}

export default Page
