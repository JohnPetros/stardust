import { notFound } from 'next/navigation'

import { COOKIES } from '@/constants'
import { cookieActions, rewardingActions } from '@/rpc/next-safe-action'
import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'

export default async function Page() {
  const rewardingPayloadCookie = await cookieActions.getCookie(
    COOKIES.keys.rewardingPayload,
  )
  if (!rewardingPayloadCookie?.data) return notFound()

  const rewardingPayload = JSON.parse(rewardingPayloadCookie.data)
  const response =
    await rewardingActions.accessRewardForChallengeCompletionPage(rewardingPayload)
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
