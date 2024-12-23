import { SupabaseServerClient } from '@/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthService, SupabaseChallengingService } from '@/api/supabase/services'

type ChallengeProps = {
  params: { challengeSlug: string }
}

export default async function Challenge({ params: { challengeSlug } }: ChallengeProps) {
  const supabase = SupabaseServerClient()
  const authService = SupabaseAuthService(supabase)
  const challengingService = SupabaseChallengingService(supabase)

  const { challenge, userVote } = await _handleChallengePage({
    challengeSlug,
    authService,
    challengesService,
    docsService,
  })

  return <ChallengeHeader challenge={challenge} userVote={userVote} />
}
