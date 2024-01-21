'use client'

import { KeyboardEvent, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import type { TestCase } from '@/@types/challenge'
import { CodeEditorRef } from '@/app/components/CodeEditor'
import { ConsoleRef } from '@/app/components/Console'
import { useToast } from '@/contexts/ToastContext'
import { execute } from '@/libs/delegua'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'
import { playAudio } from '@/utils/helpers'

export function useEditor() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const userOutput = useChallengeStore((store) => store.state.userOutput)
  const setUserOutput = useChallengeStore(
    (store) => store.actions.setUserOutput
  )

  const toast = useToast()
  const router = useRouter()

  const userCode = useRef('')
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const errorLine = useRef(0)
  const codeEditorHeight = editorContainerRef.current?.offsetHeight ?? 0

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
  }

  function handleError(error: Error) {
    const { message } = error

    const toastMessage = message.includes('null')
      ? 'Código inválido'
      : `${message}` + getErrorLine()

    toast.show(toastMessage, {
      type: 'error',
      seconds: 5,
    })
  }

  function resetCode() {
    codeEditorRef.current?.reloadValue()
  }

  function formatCode(code: string, { input }: Pick<TestCase, 'input'>) {
    if (!input.length) return code

    console.log(code)

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
      const { erros } = await execute(formatedCode, (output) => {
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

    const userOutput: string[] = []

    for (const testCase of challenge.test_cases) {
      const output = await verifyTestCase(testCase, code)
      if (output) userOutput.push(output)
    }

    playAudio('running-code.wav')

    if (userOutput.length) {
      setUserOutput(userOutput)
    }
  }

  function handleCodeChange(value: string) {
    userCode.current = value
  }

  function handleKeyDown({ shiftKey, key }: KeyboardEvent) {
    if (shiftKey && key.toLowerCase() === 'enter') {
      runCodeButtonRef.current?.click()
    }
  }

  useEffect(() => {
    if (!userCode.current && challenge) userCode.current = challenge.code
  }, [challenge])

  useEffect(() => {
    if (challenge && userOutput.length)
      router.push(`${ROUTES.private.challenge}/${challenge.slug}/result`)
  }, [challenge, userOutput, router])

  return {
    userCode,
    editorContainerRef,
    runCodeButtonRef,
    consoleRef,
    codeEditorRef,
    codeEditorHeight,
    initialCode: challenge?.code,
    userOutput,
    resetCode,
    handleRunCode,
    handleCodeChange,
    handleKeyDown,
  }
}
