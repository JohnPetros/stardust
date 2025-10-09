import { VerificationButton } from '@/ui/global/widgets/components/VerificationButton'
import { TestCase } from './TestCase'
import type { UserAnswer } from '@stardust/core/global/structures'
import type { Challenge } from '@stardust/core/challenging/entities'

type Props = {
  challenge: Challenge
  results: boolean[]
  userAnswer: UserAnswer
  isLeavingPage: boolean
  handleUserAnswer: () => void
}

export const ChallengeResultSlotView = ({
  challenge,
  results,
  userAnswer,
  isLeavingPage,
  handleUserAnswer,
}: Props) => {
  return (
    <div className='relative h-full w-full scale-[1] bg-gray-800 blur-[1]'>
      <div className='h-auto space-y-6 p-6'>
        {challenge.testCases.map((testCase, index) => {
          return (
            <TestCase
              key={`${testCase.position.value}-${index}`}
              position={testCase.position.value}
              isLocked={testCase.isLocked.isTrue}
              isCorrect={results[index] ?? false}
              inputs={testCase.inputs}
              userOutput={challenge.userOutputs.getByIndex(index, null)}
              expectedOutput={testCase.expectedOutput}
            />
          )
        })}
      </div>
      <span className='block h-full w-full bg-gray-800' />
      <VerificationButton
        className='sticky top-0'
        isAnswered={challenge.hasAnswer.isTrue}
        isAnswerVerified={userAnswer.isVerified.isTrue}
        isAnswerCorrect={userAnswer.isCorrect.isTrue}
        isLoading={isLeavingPage}
        onClick={handleUserAnswer}
      />
    </div>
  )
}
