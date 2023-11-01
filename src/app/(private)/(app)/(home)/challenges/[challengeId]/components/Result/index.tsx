import { useEffect } from 'react'
import { useChallengeStore } from '@/hooks/useChallengeStore'
import { useBreakpoint } from '@/hooks/useBreakpoint'

import { VerificationButton } from '@/app/(private)/(app)/lesson/components/Quiz/VerificationButton'
import { TestCase } from './TestCase'

import { compareArrays } from '@/utils/helpers'

import type { TestCase as TestCaseData } from '@/@types/challenge'

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
    action: {
      incrementIncorrectAswersAmount,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setResults,
      setIsEnd,
    },
  } = useChallengeStore()
  const { md } = useBreakpoint()

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

      if (md) tabHandler?.showCodeTab()
    }
  }

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

  useEffect(() => {
    if (!challenge) return

    const { test_cases } = challenge

    if (userOutput.length === test_cases.length) {
      tabHandler?.showResultTab()

      setResults(test_cases.map(verifyResult))
    }
  }, [userOutput])

  if (challenge)
    return (
      <div className="w-full h-full bg-gray-800 relative">
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
          isChallenge={true}
        />
      </div>
    )
}
