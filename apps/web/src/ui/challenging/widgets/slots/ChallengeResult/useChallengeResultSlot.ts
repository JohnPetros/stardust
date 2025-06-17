import { useEffect, useState } from 'react'

import { UserAnswer } from '@stardust/core/global/structures'
import type {
  ChallengeRewardingPayload,
  StarChallengeRewardingPayload,
} from '@stardust/core/profile/types'

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
    getResultsSlice,
  } = useChallengeStore()
  const { results } = getResultsSlice()
  const { challenge, setChallenge } = getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setCookie } = useCookieActions()
  const [isLeavingPage, setIsLeavingPage] = useState(false)
  const [userAnswer, setUserAnswer] = useState<UserAnswer>(UserAnswer.create())
  const secondsCounterStorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const { md: isMobile } = useBreakpoint()
  const { user } = useAuthContext()
  const { goTo, currentRoute } = useRouter()

  function leavePage(route: string) {
    secondsCounterStorage.remove()
    goTo(route)
  }

  async function showRewards() {
    if (!challenge || !user) return
    setIsLeavingPage(true)
    const currentSeconds = Number(secondsCounterStorage.get())

    if (challenge.starId?.value) {
      const rewardingPayload: StarChallengeRewardingPayload = {
        secondsCount: currentSeconds,
        incorrectAnswersCount: challenge.incorrectAnswersCount.value,
        maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
        challengeId: challenge?.id.value,
        starId: challenge?.starId?.value,
      }

      await setCookie({
        key: COOKIES.keys.rewardingPayload,
        value: JSON.stringify(rewardingPayload),
      })
      leavePage(ROUTES.rewarding.starChallenge)
      return
    }

    const rewardingPayload: ChallengeRewardingPayload = {
      secondsCount: currentSeconds,
      incorrectAnswersCount: challenge.incorrectAnswersCount.value,
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      challengeId: challenge?.id.value,
    }

    await setCookie({
      key: COOKIES.keys.rewardingPayload,
      value: JSON.stringify(rewardingPayload),
    })
    leavePage(ROUTES.rewarding.challenge)
  }

  function handleUserAnswer() {
    if (!challenge || !user) return

    if (challenge.isCompleted.isTrue) {
      if (
        user.hasCompletedChallenge(challenge.id).or(challenge.author.isEqualTo(user))
          .isTrue
      )
        leavePage(ROUTES.challenging.challenges.list)
      else showRewards()
      return
    }

    const newUserAnswer = challenge.verifyUserAnswer(userAnswer)

    if (newUserAnswer.isCorrect.isTrue) {
      challenge.makeCompleted()
      setChallenge(challenge)
      if (craftsVislibility) setCraftsVislibility(craftsVislibility.showAll())
    }

    if (newUserAnswer.isCorrect.isFalse && newUserAnswer.isVerified.isTrue && isMobile) {
      tabHandler?.showCodeTab()
    }

    setUserAnswer(newUserAnswer)
  }

  useEffect(() => {
    if (!challenge) return

    if (
      currentRoute.endsWith('/result') &&
      userAnswer.isVerified.isFalse &&
      challenge.isCompleted.isTrue &&
      challenge.hasAnswer.isTrue &&
      !isLeavingPage
    ) {
      setUserAnswer(userAnswer.becomeCorrect().becomeVerified())
    }
  }, [challenge, userAnswer, isLeavingPage, currentRoute])

  return {
    challenge,
    results,
    userAnswer,
    isLeavingPage,
    handleUserAnswer,
  }
}
