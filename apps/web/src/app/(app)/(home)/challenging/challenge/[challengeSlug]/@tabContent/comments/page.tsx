import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseForumService } from '@/api/supabase/services'
import type { NextParams } from '@/server/next/types'
import { ChallengeCommentsSlot } from '@/ui/challenging/widgets/slots/ChallengeComments'

export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
  const supabase = SupabaseServerClient()
  const forumService = SupabaseForumService(supabase)
  const response = await forumService.fetchChallengeTopic(
    params.challengeSlug,
    'challenge-feedback',
  )

  if (response.isSuccess) {
    return <ChallengeCommentsSlot topicDto={response.body} />
  }

  if (response.isFailure) {
    return <ChallengeCommentsSlot topicDto={{ category: 'challenge-feedback' }} />
  }
}
