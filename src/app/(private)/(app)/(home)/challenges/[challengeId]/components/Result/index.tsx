import { useEffect } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { VerificationButton } from '@/app/(private)/(app)/lesson/components/Quiz/VerificationButton'
import { TestCase } from './TestCase'

import { compareArrays } from '@/utils/functions'

import type { TestCase as TestCaseData } from '@/types/challenge'

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
    dispatch,
  } = useChallengeContext()

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function setIsEnd(isEnd: boolean) {
    dispatch({ type: 'setIsEnd', payload: isEnd })
  }

  function handleUserAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    const isAnswerCorrect =
      results.length && results.every((result) => result === true)

    console.log(isAnswerCorrect)

    if (isAnswerCorrect) {
      setIsAnswerCorrect(true)
      if (isAnswerVerified) setIsEnd(true)
      return
    }

    setIsAnswerCorrect(false)

    if (isAnswerVerified) {
      tabHandler.showCodeTab()
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
      dispatch({ type: 'setResults', payload: test_cases.map(verifyResult) })
    }
  }, [userOutput])

  if (challenge)
    return (
      <div className="w-full h-full bg-gray-800">
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
