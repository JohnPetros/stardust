'use client'

import { useEffect, useState } from 'react'

import { Field } from './Field'
import { ArrowDown, ArrowUp, Check, Lock, X } from '@phosphor-icons/react'

import { twMerge } from 'tailwind-merge'

import type { TestCase as TestCaseData } from '@/types/challenge'

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
  }, [userOutput])

  return (
    <div
      className={twMerge(
        'rounded-md bg-gray-900 p-6 w-full',
        isLocked ? 'opacity-5' : 'opacity-1'
      )}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-6 h-6 grid place-content-center rounded-full bg-green-900">
            {isCorrect ? (
              <Check className="text-green-500" weight="bold" />
            ) : (
              <X className="text-red-700" weight="bold" />
            )}
          </span>
          <h4
            className={twMerge(
              'text-lg ml-3',
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
            <Lock className="text-gray-500 text-lg" weight="bold" />
          ) : (
            <>
              {isOpen ? (
                <ArrowUp className="text-gray-500 text-lg" weight="bold" />
              ) : (
                <ArrowDown className="text-gray-500 text-lg" weight="bold" />
              )}
            </>
          )}
        </button>
      </header>
      {isOpen && (
        <dl className="mt-4 space-y-4">
          <Field
            label="Entrada"
            value={
              input
                ? input
                    .map((value) => {
                      console.log(value)
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
          <Field label="Resultado esperado" value={expectedOutput.toString()} />
        </dl>
      )}
    </div>
  )
}
