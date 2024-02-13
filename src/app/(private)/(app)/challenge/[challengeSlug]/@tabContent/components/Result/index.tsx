'use client'

import { TestCase } from './TestCase'
import { useResult } from './useResult'

import { VerificationButton } from '@/app/(private)/(app)/lesson/components/Quiz/VerificationButton'

export function Result() {
  const {
    challenge,
    userOutput,
    results,
    isAnswerCorrect,
    isAnswerVerified,
    handleUserAnswer,
  } = useResult()

  if (challenge)
    return (
      <div className="relative h-full w-full scale-[1] bg-gray-800 blur-[1]">
        <div className="h-auto space-y-6 p-6">
          {challenge.testCases.map((testCase, index) => (
            <TestCase
              key={testCase.id}
              index={index + 1}
              data={testCase}
              isCorrect={results[index]}
              userOutput={userOutput[index]}
            />
          ))}
        </div>
        <span className="block h-full w-full bg-gray-800" />
        <VerificationButton
          className="sticky top-0"
          answerHandler={handleUserAnswer}
          isAnswered={results.length > 0}
          isAnswerVerified={isAnswerVerified}
          isAnswerCorrect={isAnswerCorrect}
        />
      </div>
    )
}
