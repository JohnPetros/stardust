import type { JSX } from 'react'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { COOKIES } from '@/constants'
import * as challengingActions from '@/rpc/next-safe-action/challengingActions'
import * as cookieActions from '@/rpc/next-safe-action/cookieActions'
import type { NextParams } from '@/rpc/next/types'
import { ChallengePage } from '@/ui/challenging/widgets/pages/Challenge'

export const ChallengePageContent = async ({
  params,
}: NextParams<'challengeSlug'>): Promise<JSX.Element | undefined> => {
  const { challengeSlug } = await params
  const accessTokenCookie = await cookieActions.getCookie(COOKIES.accessToken.key)
  let challengeDto: ChallengeDto | null = null
  let userChallengeVote: string | null = null
  let previousChallengeSlug: string | null = null
  let nextChallengeSlug: string | null = null

  if (accessTokenCookie?.data) {
    const response = await challengingActions.accessAuthenticatedChallengePage({
      challengeSlug,
    })

    if (response?.data) {
      challengeDto = response.data.challengeDto
      userChallengeVote = response.data.userChallengeVote
      previousChallengeSlug = response.data.previousChallengeSlug
      nextChallengeSlug = response.data.nextChallengeSlug
    }
  } else {
    const response = await challengingActions.accessChallengePage({
      challengeSlug,
    })

    if (response?.data) {
      challengeDto = response.data.challengeDto
      userChallengeVote = response.data.userChallengeVote
      previousChallengeSlug = response.data.previousChallengeSlug
      nextChallengeSlug = response.data.nextChallengeSlug
    }
  }

  if (challengeDto && userChallengeVote) {
    return (
      <ChallengePage
        challengeDto={challengeDto}
        userChallengeVote={userChallengeVote}
        previousChallengeSlug={previousChallengeSlug}
        nextChallengeSlug={nextChallengeSlug}
      />
    )
  }
}
