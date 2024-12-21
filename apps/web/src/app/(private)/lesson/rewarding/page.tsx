import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'
import { _getCookie } from '@/ui/global/actions'
import { COOKIES, ROUTES } from '@/constants'
import { redirect } from 'next/navigation'
import { NextApiClient } from '@/api/next/NextApiClient'

type RewardingResponse = {
  newLevel: number
  newCoins: number
  newXp: number
  time: string
  accuracyPercentage: string
  nextRoute: string
}

export default async function Rewarding() {
  const rewardsPayloadCookie = await _getCookie(COOKIES.keys.rewardingPayload)

  if (!rewardsPayloadCookie) {
    return redirect(ROUTES.private.app.home.space)
  }

  const apiClient = NextApiClient()
  const rewardsPayloadDto = JSON.parse(rewardsPayloadCookie)

  const response = await apiClient.post<RewardingResponse>(
    ROUTES.api.reward,
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
