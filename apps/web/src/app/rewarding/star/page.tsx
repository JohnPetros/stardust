import { notFound } from 'next/navigation'

import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'
import { COOKIES } from '@/constants'
import { cookieActions, rewardingActions } from '@/rpc/next-safe-action'

export default async function Page() {
  const rewardsPayloadCookie = await cookieActions.getCookie(
    COOKIES.keys.rewardingPayload,
  )
  if (!rewardsPayloadCookie?.data) return notFound()

  const rewardsPayloadDto = JSON.parse(rewardsPayloadCookie.data)
  const response = await rewardingActions.rewardForStarCompletion(rewardsPayloadDto)
  if (!response?.data) notFound()

  const {
    nextRoute,
    newLevel,
    newCoins,
    newStreak,
    newWeekStatus,
    newXp,
    accuracyPercentage,
    secondsCount,
  } = response.data

  return (
    <RewardingPage
      newLevel={newLevel}
      newCoins={newCoins}
      newXp={newXp}
      newStreak={newStreak}
      newWeekStatus={newWeekStatus}
      accuracyPercentage={accuracyPercentage}
      secondsCount={secondsCount}
      nextRoute={nextRoute}
    />
  )
}
