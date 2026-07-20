import { useEffect, useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { UserAnswer } from '@stardust/core/global/structures'
import type {
  ChallengeRewardingPayload,
  StarChallengeRewardingPayload,
} from '@stardust/core/profile/types'

import { COOKIES, ROUTES, STORAGE } from '@/constants'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'

type Params = {
  alertDialogRef: React.RefObject<AlertDialogRef | null>
  challengingService?: ChallengingService
  isAccountAuthenticated: boolean
}

export function useChallengeResultSlot({
  alertDialogRef,
  challengingService,
  isAccountAuthenticated,
}: Params) {
  const {
    getChallengeSlice,
    getCraftsVisibilitySlice,
    getTabHandlerSlice,
    getResultsSlice,
    getCodeExecutionSlice,
  } = useChallengeStore()
  const { results } = getResultsSlice()
  const { challenge, setChallenge } = getChallengeSlice()
  const codeExecutionSlice = getCodeExecutionSlice?.() ?? {
    isCodeRunning: false,
    latestCodeExecution: null,
    acceptedCodeExecution: null,
    codeExecutionErrorsCount: challenge?.incorrectAnswersCount.value ?? 0,
    currentCode: '',
    setCodeExecutionErrorsCount: () => {},
  }
  const {
    isCodeRunning,
    latestCodeExecution,
    acceptedCodeExecution,
    codeExecutionErrorsCount,
    currentCode,
    setCodeExecutionErrorsCount,
  } = codeExecutionSlice
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setCookie } = useCookieActions()
  const [isLeavingPage, setIsLeavingPage] = useState(false)
  const [userAnswer, setUserAnswer] = useState<UserAnswer>(UserAnswer.create())
  const secondsCounterStorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const { md: isMobile } = useBreakpoint()
  const { user } = useAuthContext()
  const { goTo, currentRoute } = useNavigationProvider()
  const hasAcceptedExecutionForCurrentCode =
    isAccountAuthenticated && acceptedCodeExecution?.code.value === currentCode
  const latestExecutionForCurrentCode =
    isAccountAuthenticated && latestCodeExecution?.code.value === currentCode
      ? latestCodeExecution
      : null
  const displayedResults =
    latestExecutionForCurrentCode?.testResults.items.map(
      (testResult) => testResult.isCorrect,
    ) ?? results
  const isBlocked =
    isAccountAuthenticated &&
    !challenge?.isCompleted.isTrue &&
    (isCodeRunning || !hasAcceptedExecutionForCurrentCode)
  const blockedReason = isCodeRunning
    ? 'Aguarde a execução terminar.'
    : 'Execute o código com sucesso antes de verificar.'
  const userOutputs =
    latestExecutionForCurrentCode?.testResults.items.map(
      (testResult) => testResult.userOutput,
    ) ??
    challenge?.userOutputs.items ??
    []
  const isAnswered =
    (isAccountAuthenticated && Boolean(acceptedCodeExecution)) ||
    Boolean(challenge?.hasAnswer.isTrue)

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
      challengeId: challenge?.id.value,
    }

    await setCookie({
      key: COOKIES.keys.rewardingPayload,
      value: JSON.stringify(rewardingPayload),
    })
    leavePage(ROUTES.rewarding.challenge)
  }

  function handleUserAnswer() {
    if (!challenge) return

    if (challenge.isCompleted.and(challenge.isStarChallenge).isTrue) {
      showRewards()
      return
    }

    if (challenge.isCompleted.andNot(challenge.isStarChallenge).isTrue) {
      if (!isAccountAuthenticated) {
        alertDialogRef.current?.open()
        return
      }

      if (
        user?.hasCompletedChallenge(challenge.id).or(challenge.author.isEqualTo(user))
          .isTrue
      ) {
        leavePage(ROUTES.challenging.challenges.list)
      } else {
        showRewards()
      }
      return
    }

    const newUserAnswer = hasAcceptedExecutionForCurrentCode
      ? userAnswer.becomeVerified().becomeCorrect()
      : challenge.verifyUserAnswer(userAnswer)

    if (newUserAnswer.isCorrect.isTrue) {
      challenge.becomeCompleted()
      setChallenge(challenge)
      if (craftsVislibility) setCraftsVislibility(craftsVislibility.showAll())
    }

    if (newUserAnswer.isCorrect.isFalse && newUserAnswer.isVerified.isFalse && isMobile) {
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

  useEffect(() => {
    if (!challenge || !challengingService || !isAccountAuthenticated) return

    let isMounted = true
    const currentChallenge = challenge
    const service = challengingService

    async function fetchCodeExecutionErrorsCount() {
      const response = await service.fetchChallengeCodeExecutionErrorsCount(
        currentChallenge.id,
      )

      if (isMounted && response.isSuccessful) {
        setCodeExecutionErrorsCount(response.body.errorsCount)
      }
    }

    fetchCodeExecutionErrorsCount()

    return () => {
      isMounted = false
    }
  }, [challenge, challengingService, isAccountAuthenticated, setCodeExecutionErrorsCount])

  return {
    challenge,
    results: displayedResults,
    userOutputs,
    isAnswered,
    userAnswer,
    isLeavingPage,
    codeExecutionErrorsCount,
    isBlocked,
    blockedReason,
    handleUserAnswer,
  }
}
