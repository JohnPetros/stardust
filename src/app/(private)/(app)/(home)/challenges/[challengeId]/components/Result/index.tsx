import { useEffect } from 'react'

import { TestCase } from './TestCase'

import type { TestCase as TestCaseData } from '@/@types/challenge'
import { VerificationButton } from '@/app/(private)/(app)/lesson/components/Quiz/VerificationButton'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useChallengeStore } from '@/stores/challengeStore'
import { compareArrays } from '@/utils/helpers'

export function Result() {
  const {
    state: {
      challenge,
      userOutput,
      results,
      isAnswerVerified,
      isAnswerCorrect,
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
  const { md: isMobile } = useBreakpoint()

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

      if (isMobile) tabHandler?.showCodeTab()
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

  if (challenge)
    return (
      <div className="relative h-full w-full bg-gray-800">
        <div className="space-y-6 p-6">
          {challenge.test_cases.map((testCase, index) => (
            <TestCase
              key={testCase.id}
              data={testCase}
              isCorrect={results[index]}
              userOutput={userOutput[index]}
            />
          ))}
        </div>
        <VerificationButton
          answerHandler={handleUserAnswer}
          isAnswered={results.length > 0}
          isAnswerVerified={isAnswerVerified}
          isAnswerCorrect={isAnswerCorrect}
        />
      </div>
    )
}
