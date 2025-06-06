import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'
import { COOKIES } from '@/constants'
import { notFound } from 'next/navigation'
import { cookieActions, rewardingActions } from '@/rpc/next-safe-action'

export default async function Page() {
  const rewardingPayloadCookie = await cookieActions.getCookie(
    COOKIES.keys.rewardingPayload,
  )
  if (!rewardingPayloadCookie?.data) return notFound()

  const rewardingPayload = JSON.parse(rewardingPayloadCookie.data)
  const response =
    await rewardingActions.accessRewardForStarChallengeCompletionPage(rewardingPayload)
  if (!response?.data) notFound()

  const {
    nextRoute,
    newLevel,
    newStreak,
    newWeekStatus,
    newCoins,
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
