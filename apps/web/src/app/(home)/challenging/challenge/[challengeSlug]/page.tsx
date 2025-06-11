import type { NextParams } from '@/rpc/next/types'
import { challengingActions } from '@/rpc/next-safe-action'
import { ChallengeEditorPage } from '@/ui/challenging/widgets/pages/ChallengeEditor'

export const Page = async ({ params }: NextParams<'challengeSlug'>) => {
  const response = await challengingActions.accessChallengeEditorPage({
    challengeSlug: params.challengeSlug,
  })
  if (!response?.data) return

  return (
    <ChallengeEditorPage
      challengeDto={response.data.challenge}
      challengeCategoriesDto={response.data.categories}
    />
  )
}

export default Page
