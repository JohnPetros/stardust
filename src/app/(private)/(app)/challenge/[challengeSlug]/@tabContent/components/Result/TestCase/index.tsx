'use client'

import { Check, Lock, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Field } from '../Field'

import { useTestCase } from './useTestCase'

import type { TestCase as TestCaseData } from '@/@types/challenge'
import { AnimatedArrow } from '@/app/components/AnimatedArrow'

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
  data: TestCaseData
  isCorrect: boolean
  userOutput: string
}

export function TestCase({
  index,
  data: { isLocked, input, expectedOutput },
  isCorrect,
  userOutput,
}: TestCaseProps) {
  const { isOpen, formatOutput, handleButtonClick } = useTestCase(
    isLocked,
    userOutput
  )

  return (
    <div
      className={twMerge(
        'w-full rounded-md bg-gray-900 p-6',
        isLocked ? 'opacity-5' : 'opacity-1'
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
            <Lock className="text-base text-gray-500" weight="bold" />
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
                  ? input.map(formatOutput).join(', ')
                  : 'sem entrada'
              }
            />
            <Field
              label="Seu resultado"
              value={userOutput ?? 'Sem resultado'}
              isFromUser={true}
            />
            <Field
              label="Resultado esperado"
              value={expectedOutput.toString()}
            />
          </motion.dl>
        )}
      </AnimatePresence>
    </div>
  )
}
