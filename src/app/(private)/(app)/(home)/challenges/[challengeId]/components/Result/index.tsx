import { useEffect } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { TestCase } from './TestCase'

import { compareArrays } from '@/utils/functions'

import type { TestCase as TestCaseData } from '@/types/challenge'

export function Result() {
  const {
    state: { challenge, userOutput, results, tabHandler },
    dispatch,
  } = useChallengeContext()

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
      <div className="w-full min-h-screen bg-gray-800 p-6">
        <div className="space-y-6 ">
          {challenge.test_cases.map((testCase, index) => (
            <TestCase
              key={testCase.id}
              data={testCase}
              isCorrect={results[index]}
              userOuput={userOutput[index]}
            />
          ))}
        </div>
      </div>
    )
}
