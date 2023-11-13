'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, Check, Lock, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Field } from './Field'

import type { TestCase as TestCaseData } from '@/@types/challenge'

const arrowAnimations: Variants = {
  down: {
    rotate: '0',
  },
  up: {
    rotate: '180deg',
  },
}

const contentAnimations: Variants = {
  up: {
    height: 0,
  },
  down: {
    height: 'auto',
  },
}

interface TestCaseProps {
  data: TestCaseData
  isCorrect: boolean
  userOutput: string
}

export function TestCase({
  data: { id, isLocked, input, expectedOutput },
  isCorrect,
  userOutput,
}: TestCaseProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleButtonClick() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (userOutput && !isLocked) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked])

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
              'ml-3 text-lg',
              isCorrect ? 'text-green-500' : 'text-red-700'
            )}
          >
            Teste de caso #{id}
          </h4>
        </div>

        <button
          className="grid place-content-center p-2"
          onClick={handleButtonClick}
          disabled={isLocked}
        >
          {isLocked ? (
            <Lock className="text-lg text-gray-500" weight="bold" />
          ) : (
            <motion.span
              variants={arrowAnimations}
              initial="down"
              animate={isOpen ? 'up' : ''}
              transition={{ type: 'tween', ease: 'linear' }}
            >
              <ArrowDown className="text-lg text-gray-500" weight="bold" />
            </motion.span>
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
                      .map((value) => {
                        return value.toString().replace(/^(['"])(.*)\1$/, '$2')
                      })
                      .join(',')
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
