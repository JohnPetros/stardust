'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { TestCase } from '@/@types/challenge'
import { CodeEditorRef } from '@/app/components/CodeEditor'
import { ConsoleRef } from '@/app/components/Console'
import { useToast } from '@/contexts/ToastContext'
import { execute } from '@/libs/delegua'
import { useChallengeStore } from '@/stores/challengeStore'
import { REGEX, ROUTES, STORAGE } from '@/utils/constants'
import { playAudio } from '@/utils/helpers'

const inputCommandRegex = REGEX.input

export function useEditor() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const layout = useChallengeStore((store) => store.state.layout)
  const userOutput = useChallengeStore((store) => store.state.userOutput)
  const setUserOutput = useChallengeStore(
    (store) => store.actions.setUserOutput
  )

  const toast = useToast()
  const router = useRouter()

  const userCode = useRef('')
  const previousUserCode = useRef('')
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const errorLine = useRef(0)

  const [codeEditorHeight, setCodeEditorHeight] = useState(0)

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

    const regex = new RegExp(inputCommandRegex, 'g')
    const matches = code.match(regex)

    if (!matches) {
      throw new Error('Não remova o comando Leia()!')
    }

    input.forEach(
      (value) =>
        (code = code.replace(
          inputCommandRegex,
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
    localStorage.setItem(STORAGE.challengeCode, value)
    console.log(userCode.current)
    console.log(value)
    previousUserCode.current = userCode.current
    userCode.current = value
  }

  useEffect(() => {
    if (!userCode.current && challenge) userCode.current = challenge.code
  }, [challenge])

  useEffect(() => {
    if (challenge && userOutput.length)
      router.push(`${ROUTES.private.challenge}/${challenge.slug}/result`)
  }, [challenge, userOutput, router])

  useEffect(() => {
    if (layout) {
      setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
    }
  }, [layout])

  return {
    userCode,
    previousUserCode,
    editorContainerRef,
    runCodeButtonRef,
    consoleRef,
    codeEditorRef,
    codeEditorHeight,
    initialCode:
      localStorage?.getItem(STORAGE.challengeCode) ?? challenge?.code,
    userOutput,
    resetCode,
    handleRunCode,
    handleCodeChange,
  }
}
