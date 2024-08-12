import { RewardingPage } from '@/ui/app/components/pages/Rewarding'
import { _getCookie } from '@/ui/global/actions'
import { COOKIES, ROUTES } from '@/ui/global/constants'
import { NextApiClient } from '@/infra/api/next/apiClient'
import { redirect } from 'next/navigation'

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
  const rewardsPayloadDTO = JSON.parse(rewardsPayloadCookie)

  const response = await apiClient.post<RewardingResponse>(
    ROUTES.server.reward,
    rewardsPayloadDTO,
  )

  if (response.isError) {
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
