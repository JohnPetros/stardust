import type { UserAnswer } from '@stardust/core/global/structures'
import type { Challenge } from '@stardust/core/challenging/entities'
import Link from 'next/link'

import { ROUTES } from '@/constants'
import { VerificationButton } from '@/ui/global/widgets/components/VerificationButton'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AccountRequirementAlertDialog } from '@/ui/global/widgets/components/AccountRequirementAlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { TestCase } from './TestCase'

type Props = {
  challenge: Challenge
  results: boolean[]
  userOutputs: unknown[]
  isAnswered: boolean
  userAnswer: UserAnswer
  isLeavingPage: boolean
  codeExecutionErrorsCount: number
  isBlocked: boolean
  blockedReason: string
  alertDialogRef: React.RefObject<AlertDialogRef | null>
  handleUserAnswer: () => void
}

export const ChallengeResultSlotView = ({
  challenge,
  results,
  userOutputs,
  isAnswered,
  userAnswer,
  isLeavingPage,
  codeExecutionErrorsCount,
  isBlocked,
  blockedReason,
  alertDialogRef,
  handleUserAnswer,
}: Props) => {
  return (
    <div className='relative h-full w-full scale-[1] bg-gray-800 blur-[1]'>
      <AccountRequirementAlertDialog
        ref={alertDialogRef}
        description='Antes de completar este belíssimo desafio, acesse primeiro a sua conta 😀'
      />
      <div className='h-auto space-y-6 p-6'>
        <div className='flex items-center justify-between gap-4'>
          <p className='text-gray-300 text-sm'>
            Erros de execução: <strong>{codeExecutionErrorsCount}</strong>
          </p>
          <Button
            asChild
            className='h-8 w-max gap-2 bg-gray-700 px-3 text-gray-100 text-xs hover:bg-gray-600 hover:brightness-100 md:hidden'
          >
            <Link
              href={ROUTES.challenging.challenges.challengeExecutions(
                challenge.slug.value,
              )}
            >
              <Icon name='history' size={15} />
              Execuções
            </Link>
          </Button>
        </div>
        {challenge.testCases.map((testCase, index) => {
          return (
            <TestCase
              key={`${testCase.position.value}-${index}`}
              position={testCase.position.value}
              isLocked={testCase.isLocked.isTrue}
              isCorrect={results[index] ?? false}
              inputs={testCase.inputs}
              userOutput={userOutputs[index] ?? null}
              expectedOutput={testCase.expectedOutput}
            />
          )
        })}
      </div>
      <span className='block h-full w-full bg-gray-800' />
      <VerificationButton
        className='sticky top-0'
        isAnswered={isAnswered}
        isBlocked={isBlocked}
        blockedReason={blockedReason}
        isAnswerVerified={userAnswer.isVerified.isTrue}
        isAnswerCorrect={userAnswer.isCorrect.isTrue}
        isLoading={isLeavingPage}
        onClick={handleUserAnswer}
      />
    </div>
  )
}
