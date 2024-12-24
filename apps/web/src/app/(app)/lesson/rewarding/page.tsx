import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'
import { COOKIES, ROUTES } from '@/constants'
import { redirect } from 'next/navigation'
import { NextApiClient } from '@/api/next/NextApiClient'
import { cookieActions } from '@/server/next-safe-action'

type RewardingResponse = {
  newLevel: number
  newCoins: number
  newXp: number
  time: string
  accuracyPercentage: string
  nextRoute: string
}

export default async function Rewarding() {
  const rewardsPayloadCookie = await cookieActions.getCookie(
    COOKIES.keys.rewardingPayload,
  )

  if (!rewardsPayloadCookie?.data) {
    return redirect(ROUTES.space)
  }

  const apiClient = NextApiClient()
  const rewardsPayloadDto = JSON.parse(rewardsPayloadCookie.data)

  const response = await apiClient.post<RewardingResponse>(
    ROUTES.api.profile.reward,
    rewardsPayloadDto,
  )

  if (response.isFailure) {
    return response.throwError()
  }

  return (
    <RewardingPage
      newLevel={response.body.newLevel}
      newCoins={response.body.newCoins}
      newXp={response.body.newXp}
      accuracyPercentage={response.body.accuracyPercentage}
      time={response.body.time}
      nextRoute={response.body.nextRoute}
    />
  )
}
