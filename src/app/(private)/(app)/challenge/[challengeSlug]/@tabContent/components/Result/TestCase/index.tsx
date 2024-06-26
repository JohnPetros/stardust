'use client'

import { Check, LockSimple, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Field } from '../Field'

import { useTestCase } from './useTestCase'

import type {
  ChallengeTestCase,
  ChallengeTestCaseExpectedOutput,
} from '@/@types/Challenge'
import { AnimatedArrow } from '@/global/components/AnimatedArrow'
import { useCode } from '@/services/code'
import { useChallengeStore } from '@/stores/challengeStore'

const contentAnimations: Variants = {
  up: {
    height: 0,
  },
  down: {
    height: 'auto',
  },
}

type TestCaseProps = {
  index: number
  data: ChallengeTestCase
  isCorrect: boolean
  userOutput: ChallengeTestCaseExpectedOutput | null
}

export function TestCase({
  index,
  data: { isLocked, input, expectedOutput },
  isCorrect,
  userOutput,
}: TestCaseProps) {
  const { isOpen, handleButtonClick } = useTestCase(
    isLocked,
    isCorrect,
    userOutput
  )

  const shouldFormatResult = useChallengeStore((store) =>
    Boolean(store.state.challenge?.functionName)
  )

  console.log('TestCase', { userOutput })

  const code = useCode()

  return (
    <div
      className={twMerge(
        'w-full rounded-md bg-gray-900 p-6',
        isLocked && !isCorrect ? 'opacity-[0.7]' : 'opacity-1'
      )}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="grid h-6 w-6 place-content-center rounded-full bg-green-900">
            {isCorrect ? (
              <Check className="text-green-500" weight="bold" />
            ) : (
              <X className="text-red-700" weight="bold" />
            )}
          </span>
          <h4
            className={twMerge(
              'ml-3 text-base',
              isCorrect ? 'text-green-500' : 'text-red-700'
            )}
          >
            Teste de caso #{index}
          </h4>
        </div>

        <button
          className="grid place-content-center p-2"
          onClick={handleButtonClick}
          disabled={isLocked}
        >
          {isLocked ? (
            <LockSimple className="text-base text-gray-100" weight="bold" />
          ) : (
            <AnimatedArrow isUp={isOpen} />
          )}
        </button>
      </header>
      <AnimatePresence>
        {isOpen && (
          <motion.dl
            variants={contentAnimations}
            initial="up"
            animate={isOpen ? 'down' : ''}
            exit="up"
            className="mt-4 space-y-3 overflow-hidden"
          >
            <Field
              label="Entrada"
              value={
                input.length > 0
                  ? input
                      .map((input) => code.formatResult(JSON.stringify(input)))
                      .join(', ')
                  : 'sem entrada'
              }
            />
            <Field
              label="Seu resultado"
              value={
                userOutput
                  ? shouldFormatResult
                    ? code.formatResult(JSON.stringify(userOutput))
                    : code.formatOutput(userOutput.toString()).toString()
                  : 'Sem resultado'
              }
              isFromUser={true}
            />
            <Field
              label="Resultado esperado"
              value={code.formatResult(JSON.stringify(expectedOutput))}
            />
          </motion.dl>
        )}
      </AnimatePresence>
    </div>
  )
}
