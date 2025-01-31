'use client'

import { useState } from 'react'

import { UserAnswer } from '@stardust/core/global/structs'
import type {
  ChallengeRewardingPayload,
  StarChallengeRewardingPayload,
} from '@stardust/core/challenging/types'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'

export function useChallengeResultSlot() {
  const { getChallengeSlice, getTabHandlerSlice, getResults } = useChallengeStore()
  const { results } = getResults()
  const { challenge } = getChallengeSlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setCookie } = useCookieActions()
  const [userAnswer, setUserAnswer] = useState<UserAnswer>(UserAnswer.create())
  const secondsCounterStorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const { md: isMobile } = useBreakpoint()
  const { user } = useAuthContext()
  const router = useRouter()

  async function showRewards() {
    if (!challenge || !user) return

    const currentSeconds = Number(secondsCounterStorage.get())

    if (challenge.starId?.value) {
      const rewardsPayload: StarChallengeRewardingPayload = {
        secondsCount: currentSeconds,
        incorrectAnswersCount: challenge.incorrectAnswersCount.value,
        challengeId: challenge?.id,
        starId: challenge?.starId?.value,
      }

      await setCookie({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify(rewardsPayload),
      })
      localStorage.removeItem(STORAGE.keys.secondsCounter)
      router.goTo(ROUTES.rewarding.starChallenge)
      return
    }

    const rewardsPayload: ChallengeRewardingPayload = {
      secondsCount: currentSeconds,
      incorrectAnswersCount: challenge.incorrectAnswersCount.value,
      challengeId: challenge?.id,
    }

    await setCookie({
      key: COOKIES.keys.rewardingPayload,
      value: JSON.stringify(rewardsPayload),
    })

    secondsCounterStorage.remove()
    router.goTo(ROUTES.rewarding.challenge)
    return
  }

  function handleUserAnswer() {
    if (!challenge) return
    const isUserChallengeAuthor = challenge.author.id === user?.id
    const newUserAnswer = challenge.verifyUserAnswer(userAnswer)

    if (
      newUserAnswer.isCorrect.isTrue &&
      newUserAnswer.isVerified.isTrue &&
      !isUserChallengeAuthor
    ) {
      showRewards()
    }

    if (newUserAnswer.isCorrect.isFalse && newUserAnswer.isVerified.isTrue && isMobile) {
      tabHandler?.showCodeTab()
    }

    setUserAnswer(newUserAnswer)
  }

  return {
    challenge,
    results,
    userAnswer,
    handleUserAnswer,
  }
}
