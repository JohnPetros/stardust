'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { TestCase as TestCaseData } from '@/@types/challenge'
import {
  ChallengeRewardsPayload,
  StarChallengeRewardsPayload,
} from '@/@types/rewards'
import { setCookie } from '@/app/server/actions/setCookie'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useChallengeStore } from '@/stores/challengeStore'
import { COOKIES, ROUTES, STORAGE } from '@/utils/constants'
import { compareArrays } from '@/utils/helpers'

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

  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [isAnswerVerified, setIsAnswerVerified] = useState(false)

  // const { md: isMobile } = useBreakpoint()
  const router = useRouter()

  async function showRewards() {
    if (!challenge) return

    const currentSeconds = Number(localStorage.getItem(STORAGE.secondsCounter))

    if (challenge?.star_id) {
      const rewardsPayload: StarChallengeRewardsPayload = {
        'star-challenge': {
          seconds: currentSeconds,
          incorrectAnswers: incorrectAnswersAmount,
          challengeId: challenge?.id,
          difficulty: challenge?.difficulty,
          isCompleted: challenge?.isCompleted ?? false,
          starId: challenge?.star_id,
        },
      }

      await setCookie(COOKIES.rewardsPayload, JSON.stringify(rewardsPayload))
      localStorage.removeItem(STORAGE.secondsCounter)
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

    await setCookie(COOKIES.rewardsPayload, JSON.stringify(rewardsPayload))
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

      // if (isMobile) tabHandler?.showCodeTab()
    }
  }

  useEffect(() => {
    if (!challenge) return

    const { test_cases } = challenge

    function verifyResult({ expectedOutput }: TestCaseData, index: number) {
      const userResult = userOutput[index]

      const isCorrect = compareArrays(
        Array.isArray(userResult) ? userResult : [userResult.toString().trim()],
        Array.isArray(expectedOutput)
          ? expectedOutput
          : [expectedOutput.toString().trim()]
      )

      return isCorrect
    }

    if (userOutput.length === test_cases.length) {
      tabHandler?.showResultTab()

      setResults(test_cases.map(verifyResult))
    }
  }, [userOutput, challenge, tabHandler, setResults])

  useEffect(() => {
    if (
      userOutput?.length === challenge?.test_cases.length &&
      results?.length
    ) {
      const isAnswerCorrect = results.every((result) => result === true)
      setIsAnswerCorrect(isAnswerCorrect)
      setIsEnd(true)
    }
  }, [challenge, userOutput, results, setIsEnd])

  return {
    challenge,
    userOutput,
    results,
    isAnswerVerified,
    isAnswerCorrect,
    handleUserAnswer,
  }
}
