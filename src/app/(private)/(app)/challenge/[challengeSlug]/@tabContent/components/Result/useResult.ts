'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type {
  ChallengeTestCase,
  ChallengeTestCaseExpectedOutput,
  ChallengeTestCaseInput,
} from '@/@types/Challenge'
import {
  ChallengeRewardsPayload,
  StarChallengeRewardsPayload,
} from '@/@types/Rewards'
import { _setCookie } from '@/global/actions/_setCookie'
import { COOKIES, ROUTES, STORAGE } from '@/global/constants'
import { useBreakpoint } from '@/global/hooks/useBreakpoint'
import { useLocalStorage } from '@/global/hooks/useLocalStorage'
import { useCode } from '@/services/code'
import { useChallengeStore } from '@/stores/challengeStore'

export function useResult() {
  const {
    state: {
      challenge,
      userOutput,
      results,
      incorrectAnswersAmount,
      tabHandler,
    },
    actions: { incrementIncorrectAswersAmount, setResults, setIsEnd },
  } = useChallengeStore()

  const code = useCode()

  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [isAnswerVerified, setIsAnswerVerified] = useState(false)

  const secondsCounterStorage = useLocalStorage(STORAGE.keys.secondsCounter)

  const { md: isMobile } = useBreakpoint()
  const router = useRouter()

  async function showRewards() {
    if (!challenge) return

    const currentSeconds = Number(secondsCounterStorage.get())

    if (challenge?.starId) {
      const rewardsPayload: StarChallengeRewardsPayload = {
        'star-challenge': {
          seconds: currentSeconds,
          incorrectAnswers: incorrectAnswersAmount,
          challengeId: challenge?.id,
          difficulty: challenge?.difficulty,
          isCompleted: challenge?.isCompleted ?? false,
          starId: challenge?.starId,
        },
      }

      await _setCookie(
        COOKIES.keys.rewardsPayload,
        JSON.stringify(rewardsPayload)
      )
      localStorage.removeItem(STORAGE.keys.secondsCounter)
      router.push(ROUTES.private.rewards)
      return
    }

    const rewardsPayload: ChallengeRewardsPayload = {
      challenge: {
        seconds: currentSeconds,
        incorrectAnswers: incorrectAnswersAmount,
        challengeId: challenge?.id,
        difficulty: challenge?.difficulty,
        isCompleted: challenge?.isCompleted ?? false,
      },
    }

    await _setCookie(
      COOKIES.keys.rewardsPayload,
      JSON.stringify(rewardsPayload)
    )

    secondsCounterStorage.remove()

    router.push(ROUTES.private.rewards)
    return
  }

  function handleUserAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    const isAnswerCorrect =
      results.length && results.every((result) => result === true)

    if (isAnswerCorrect) {
      setIsAnswerCorrect(true)
      if (isAnswerVerified) {
        showRewards()
      }
      return
    }

    setIsAnswerCorrect(false)

    if (isAnswerVerified) {
      incrementIncorrectAswersAmount()

      if (isMobile) tabHandler?.showCodeTab()
    }
  }

  useEffect(() => {
    if (!challenge) return

    const { testCases } = challenge

    console.log({ userOutput })

    function verifyResult(testCase: ChallengeTestCase, index: number) {
      if (challenge?.functionName) {
        const isCorrect =
          userOutput[index as keyof ChallengeTestCaseExpectedOutput] ===
          testCase.expectedOutput
        return isCorrect
      }

      const output: number | string =
        userOutput[index as keyof ChallengeTestCaseExpectedOutput].toString()

      const expectedOutput = code.desformatOutput(testCase.expectedOutput)

      console.log({ output })
      console.log({ expectedOutput })

      const isCorrect = output === expectedOutput

      return isCorrect
    }

    if (userOutput.length === testCases.length) {
      tabHandler?.showResultTab()

      setResults(testCases.map(verifyResult))
    }
  }, [userOutput, challenge])

  useEffect(() => {
    if (userOutput?.length === challenge?.testCases.length && results?.length) {
      const isAnswerCorrect = results.every((result) => result === true)

      if (!isAnswerCorrect) {
        incrementIncorrectAswersAmount()
        return
      }

      setIsAnswerCorrect(true)
      setIsEnd(true)
    }
  }, [challenge, userOutput, results, incrementIncorrectAswersAmount, setIsEnd])

  return {
    challenge,
    userOutput,
    results,
    isAnswerVerified,
    isAnswerCorrect,
    handleUserAnswer,
  }
}
