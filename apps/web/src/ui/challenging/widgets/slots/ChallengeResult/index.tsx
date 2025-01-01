'use client'

import { VerificationButton } from '@/ui/global/widgets/components/VerificationButton'
import { TestCase } from './TestCase'
import { useChallengeResultSlot } from './useChallengeResultSlot'

export function ChallengeResultSlot() {
  const { challenge, results, userAnswer, handleUserAnswer } = useChallengeResultSlot()

  console.log('results', results)

  if (challenge)
    return (
      <div className='relative h-full w-full scale-[1] bg-gray-800 blur-[1]'>
        <div className='h-auto space-y-6 p-6'>
          {challenge.testCases.map((testCase, index) => (
            <TestCase
              key={testCase.position.value}
              position={testCase.position.value}
              isLocked={testCase.isLocked.isTrue}
              isCorrect={results[index] ?? false}
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
