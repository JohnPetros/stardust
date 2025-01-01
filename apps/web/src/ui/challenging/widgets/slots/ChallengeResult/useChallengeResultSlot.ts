'use client'

import { useEffect, useState } from 'react'

import type {
  ChallengeRewardingPayloadDto,
  StarChallengeRewardingPayloadDto,
} from '@stardust/core/challenging/dtos'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useBreakpoint, useLocalStorage, useRouter } from '@/ui/global/hooks'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { UserAnswer } from '@stardust/core/global/structs'

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
      const rewardsPayload: StarChallengeRewardingPayloadDto = {
        origin: 'star-challenge',
        secondsCount: currentSeconds,
        incorrectAnswersCount: challenge.incorrectAnswersCount.value,
        challengeId: challenge?.id,
        challengeDifficultyLevel: challenge?.difficulty.level,
        starId: challenge?.starId?.value,
      }

      await setCookie({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify(rewardsPayload),
      })
      localStorage.removeItem(STORAGE.keys.secondsCounter)
      router.goTo(ROUTES.rewarding)
      return
    }

    const rewardsPayload: ChallengeRewardingPayloadDto = {
      origin: 'challenge',
      secondsCount: currentSeconds,
      incorrectAnswersCount: challenge.incorrectAnswersCount.value,
      challengeId: challenge?.id,
      challengeDifficultyLevel: challenge?.difficulty.level,
    }

    await setCookie({
      key: COOKIES.keys.rewardingPayload,
      value: JSON.stringify(rewardsPayload),
    })

    secondsCounterStorage.remove()
    router.goTo(ROUTES.rewarding)
    return
  }

  function handleUserAnswer() {
    if (!challenge) return

    const newUserAnswer = challenge.verifyUserAnswer(userAnswer)

    // if (newUserAnswer.isCorrect.isTrue && newUserAnswer.isVerified.isTrue) {
    //   showRewards()
    // }

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
