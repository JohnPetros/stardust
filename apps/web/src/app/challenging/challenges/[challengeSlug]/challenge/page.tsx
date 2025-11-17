import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import type { NextParams } from '@/rpc/next/types'
import { challengingActions, cookieActions } from '@/rpc/next-safe-action'
import { COOKIES } from '@/constants'
import { ChallengePage } from '@/ui/challenging/widgets/pages/Challenge'

const Page = async ({ params }: NextParams<'challengeSlug'>) => {
  const { challengeSlug } = await params
  const accessTokenCookie = await cookieActions.getCookie(COOKIES.accessToken.key)
  let challengeDto: ChallengeDto | null = null
  let userChallengeVote: string | null = null

  if (accessTokenCookie?.data) {
    const response = await challengingActions.accessAuthenticatedChallengePage({
      challengeSlug,
    })

    if (response?.data) {
      challengeDto = response.data.challengeDto
      userChallengeVote = response.data.userChallengeVote
    }
  } else {
    const response = await challengingActions.accessChallengePage({
      challengeSlug,
    })

    if (response?.data) {
      challengeDto = response.data.challengeDto
      userChallengeVote = response.data.userChallengeVote
    }
  }

  if (challengeDto && userChallengeVote)
    return (
      <ChallengePage challengeDto={challengeDto} userChallengeVote={userChallengeVote} />
    )
}

export default Page
