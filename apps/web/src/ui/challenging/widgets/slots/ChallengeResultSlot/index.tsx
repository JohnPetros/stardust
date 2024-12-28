'use client'

import { VerificationButton } from '../../components/VerificationButton'
import { TestCase } from './TestCase'
import { useChallengeResultSlot } from './useChallengeResultSlot'

export function ChallengeResultSlot() {
  const { challenge, userAnswer, handleUserAnswer } = useChallengeResultSlot()

  if (challenge)
    return (
      <div className='relative h-full w-full scale-[1] bg-gray-800 blur-[1]'>
        <div className='h-auto space-y-6 p-6'>
          {challenge.testCases.map((testCase, index) => (
            <TestCase
              key={testCase.position.value}
              position={testCase.position.value}
              isLocked={testCase.isLocked.isTrue}
              isCorrect={challenge.results.getByIndex(index, false)}
              inputs={testCase.inputs}
              userOutput={challenge.userOutputs.getByIndex(index, undefined)}
              expectedOutput={testCase.expectedOutput}
            />
          ))}
        </div>
        <span className='block h-full w-full bg-gray-800' />
        <VerificationButton
          className='sticky top-0'
          isAnswered={challenge.hasAnswer.isTrue}
          isAnswerVerified={userAnswer.isVerified.isTrue}
          isAnswerCorrect={userAnswer.isCorrect.isTrue}
          onClick={handleUserAnswer}
        />
      </div>
    )
}
