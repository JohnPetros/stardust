import { _handleChallengePage } from './actions/_handleChallengePage'
import { ChallengeHeader } from './components/ChallengeHeader'

import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabaseChallengesController } from '@/services/api/supabase/controllers/SupabaseChallengesController'
import { SupabaseDocsController } from '@/services/api/supabase/controllers/SupabaseDocsController'

type ChallengePageProps = {
  params: { challengeSlug: string }
}

export default async function ChallengePage({
  params: { challengeSlug },
}: ChallengePageProps) {
  const supabase = SupabaseServerClient()
  const authController = SupabaseAuthController(supabase)
  const challengesController = SupabaseChallengesController(supabase)
  const docsController = SupabaseDocsController(supabase)

  const { challenge, userVote } = await _handleChallengePage({
    challengeSlug,
    authController,
    challengesController,
    docsController,
  })

  return <ChallengeHeader challenge={challenge} userVote={userVote} />
}
