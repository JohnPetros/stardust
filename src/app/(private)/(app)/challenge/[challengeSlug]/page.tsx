import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseChallengesService,
} from '@/infra/api/supabase/services'

type ChallengeProps = {
  params: { challengeSlug: string }
}

export default async function Challenge({ params: { challengeSlug } }: ChallengeProps) {
  const supabase = SupabaseServerClient()
  const authService = SupabaseAuthService(supabase)
  const challengesService = SupabaseChallengesService(supabase)
  const docsService = SupabaseDocsService(supabase)

  const { challenge, userVote } = await _handleChallengePage({
    challengeSlug,
    authService,
    challengesService,
    docsService,
  })

  return <ChallengeHeader challenge={challenge} userVote={userVote} />
}
