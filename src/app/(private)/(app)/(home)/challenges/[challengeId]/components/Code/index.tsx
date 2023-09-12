'use client'

import { useRef } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Button } from '@/app/components/Button'
import { CodeEditor } from '@/app/components/CodeEditor'
import { IconButton } from './IconButton'
import {
  ArrowClockwise,
  ArrowsOutSimple,
  Command,
  Code as CodeIcon,
  Gear,
} from '@phosphor-icons/react'

import { execute } from '@/libs/delegua'
import { TestCase } from '@/types/challenge'
import { ToastRef, Toast } from '@/app/components/Toast'

export function Code() {
  const {
    state: { challenge },
    dispatch,
  } = useChallengeContext()
  const code = useRef(challenge?.code ?? '')
  const errorLine = useRef(0)
  const toastRef = useRef<ToastRef>(null)

  function handleError(error: Error) {
    const { message } = error

    const toastMessage = message.includes('null')
      ? 'Código inválido'
      : `${message}</br>Linha: ${errorLine.current}`

    toastRef.current?.open({
      type: 'error',
      message: toastMessage,
    })
  }

  function formatCode(code: string, { input }: Pick<TestCase, 'input'>) {
    if (!input.length) return code

    const regex = /(leia\(\))/g
    const matches = code.match(regex)

    if (!matches) {
      throw new Error('Não remova o comando Leia()!')
    }

    input.forEach(
      (value) =>
        (code = code.replace(
          /(leia\(\))/,
          Array.isArray(value) ? `[${value}]` : value.toString()
        ))
    )

    return code
  }

  async function verifyTestCase(testCase: TestCase, code: string) {
    let userOutput = ''
    const { input } = testCase

    try {
      const formatedCode = formatCode(code, { input })
      const { erros, resultado } = await execute(formatedCode, (output) => {
        userOutput = output
      })

      if (erros.length) {
        const error = erros[0]
        errorLine.current = error.linha ?? 0
        if (error instanceof Error) throw error
        throw error.erroInterno
      }

      return userOutput
    } catch (error) {
      handleError(error as Error)
    }
  }

  async function handleRunCode(code: string) {
    if (!challenge) return

    let userOutput: string[] = []

    for (const testCase of challenge.test_cases) {
      const output = await verifyTestCase(testCase, code)
      if (output) userOutput.push(output)
    }

    if (userOutput.length)
      dispatch({ type: 'setUserOutput', payload: userOutput })
  }

  function handleCodeChange(value: string) {
    code.current = value
  }

  if (challenge)
    return (
      <div className="w-full h-screen">
        <Toast ref={toastRef} />
        <div className="flex items-center justify-between bg-gray-700 py-2 px-3">
          <Button
            className="h-6 px-3 text-xs w-max"
            onClick={() => handleRunCode(code.current)}
          >
            Executar
          </Button>
          <ul className="flex items-center gap-3">
            <li>
              <IconButton icon={ArrowClockwise} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={ArrowsOutSimple} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={Command} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={CodeIcon} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={Gear} onClick={() => {}} />
            </li>
          </ul>
        </div>
        <CodeEditor
          value={challenge.code}
          width="100%"
          height="100%"
          hasMinimap
          onChange={handleCodeChange}
        />
      </div>
    )
}
