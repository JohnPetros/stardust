'use client'

import { useEffect, useState } from 'react'

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
  const {
    getChallengeSlice,
    getCraftsVisibilitySlice,
    getTabHandlerSlice,
    getResults,
    resetStore,
  } = useChallengeStore()
  const { results } = getResults()
  const { challenge, setChallenge } = getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setCookie } = useCookieActions()
  const [isSavingCookie, setIsSavingCookie] = useState(false)
  const [userAnswer, setUserAnswer] = useState<UserAnswer>(UserAnswer.create())
  const secondsCounterStorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const { md: isMobile } = useBreakpoint()
  const { user } = useAuthContext()
  const router = useRouter()

  function goToRewardingPage(routeSource: 'starChallenge' | 'challenge') {
    router.goTo(ROUTES.rewarding[routeSource])
    setTimeout(() => {
      resetStore()
      secondsCounterStorage.remove()
    }, 500)
  }

  async function showRewards() {
    if (!challenge || !user) return
    setIsSavingCookie(true)

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
      goToRewardingPage('starChallenge')
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
    goToRewardingPage('challenge')
    return
  }

  function handleUserAnswer() {
    if (!challenge) return

    if (challenge.isCompleted.isTrue) {
      showRewards()
      return
    }

    const isUserChallengeAuthor = challenge.authorId === user?.id
    const newUserAnswer = challenge.verifyUserAnswer(userAnswer)

    if (newUserAnswer.isCorrect.isTrue && !isUserChallengeAuthor) {
      setChallenge(challenge)
      setCraftsVislibility(craftsVislibility.showAll())
    }

    if (newUserAnswer.isCorrect.isFalse && newUserAnswer.isVerified.isTrue && isMobile) {
      tabHandler?.showCodeTab()
    }

    setUserAnswer(newUserAnswer)
  }

  useEffect(() => {
    if (
      router.currentRoute.endsWith('/result') &&
      userAnswer.isVerified.isFalse &&
      challenge?.isCompleted.isTrue &&
      challenge.hasAnswer.isTrue &&
      !isSavingCookie
    ) {
      setUserAnswer(userAnswer.makeCorrect().makeVerified())
    }
  }, [challenge, userAnswer, isSavingCookie, router.currentRoute])

  return {
    challenge,
    results,
    userAnswer,
    isSavingCookie,
    handleUserAnswer,
  }
}
