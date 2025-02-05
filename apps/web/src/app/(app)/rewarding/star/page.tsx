import { notFound } from 'next/navigation'

import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'
import { COOKIES } from '@/constants'
import { cookieActions, rewardingActions } from '@/server/next-safe-action'

export default async function Page() {
  return 'oi'
  const rewardsPayloadCookie = await cookieActions.getCookie(
    COOKIES.keys.rewardingPayload,
  )
  if (!rewardsPayloadCookie?.data) return notFound()

  const rewardsPayloadDto = JSON.parse(rewardsPayloadCookie.data)
  const response = await rewardingActions.rewardForStarCompletion(rewardsPayloadDto)
  if (!response?.data) notFound()

  const { nextRoute, newLevel, newCoins, newXp, accuracyPercentage, secondsCount } =
    response.data

  return (
    <RewardingPage
      newLevel={newLevel}
      newCoins={newCoins}
      newXp={newXp}
      accuracyPercentage={accuracyPercentage}
      secondsCount={secondsCount}
      nextRoute={nextRoute}
    />
  )
}
