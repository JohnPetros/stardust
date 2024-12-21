type ChallengeProps = {
  params: { challengeSlug: string }
}

export default async function Challenge({ params: { challengeSlug } }: ChallengeProps) {
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
