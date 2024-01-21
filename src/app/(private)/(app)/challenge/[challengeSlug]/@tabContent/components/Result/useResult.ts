'use client'

import { useEffect } from 'react'

import type { TestCase as TestCaseData } from '@/@types/challenge'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useChallengeStore } from '@/stores/challengeStore'
import { compareArrays } from '@/utils/helpers'

export function useResult() {
  const {
    state: {
      challenge,
      userOutput,
      results,
      isAnswerCorrect,
      isAnswerVerified,
      tabHandler,
    },
    actions: {
      incrementIncorrectAswersAmount,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setResults,
      setIsEnd,
    },
  } = useChallengeStore()
  // const { md: isMobile } = useBreakpoint()

  function handleUserAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    const isAnswerCorrect =
      results.length && results.every((result) => result === true)

    if (isAnswerCorrect) {
      setIsAnswerCorrect(true)
      if (isAnswerVerified) setIsEnd(true)
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

  return {
    challenge,
    userOutput,
    results,
    isAnswerVerified,
    isAnswerCorrect,
    handleUserAnswer,
  }
}
