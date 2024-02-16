'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ChallengeTestCase } from '@/@types/Challenge'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { ConsoleRef } from '@/global/components/Console'
import { EditorRef } from '@/global/components/Editor'
import { ROUTES, STORAGE } from '@/global/constants'
import { playAudio } from '@/global/helpers'
import { execute } from '@/libs/delegua'
import { useCode } from '@/services/code'
import { useChallengeStore } from '@/stores/challengeStore'

export function useCodeEditor() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const layout = useChallengeStore((store) => store.state.panelsLayout)
  const userOutput = useChallengeStore((store) => store.state.userOutput)
  const setUserOutput = useChallengeStore(
    (store) => store.actions.setUserOutput
  )

  const { run, getInputCommands, addInput } = useCode()

  const initialCode =
    typeof window !== 'undefined'
      ? localStorage?.getItem(STORAGE.keys.challengeCode) ??
        challenge?.code ??
        ''
      : ''

  const toast = useToastContext()
  const router = useRouter()

  const userCode = useRef('')
  const previousUserCode = useRef('')
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
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

  function handleResult(result: string) {}

  function formatCode(
    code: string,
    { input }: Pick<ChallengeTestCase, 'input'>
  ) {
    if (!input.length) return code

    const inputCommands = getInputCommands(code)

    if (!inputCommands || inputCommands.length !== input.length) {
      throw new Error('Não mexa em nenhum comando Leia()!')
    }

    const codeWithInput = addInput(input, code)

    return codeWithInput
  }

  async function verifyTestCase(testCase: ChallengeTestCase, code: string) {
    const { input } = testCase

    try {
      const formatedCode = formatCode(code, { input })
      console.log({ formatedCode })
      const { output, result } = await run(formatedCode)
      console.log({ output })

      if (challenge?.functionName) {
        handleResult(result)
        return
      }

      return output
    } catch (error) {
      handleError(error as Error)
    }
  }

  async function handleRunCode(code: string) {
    if (!challenge) return

    const userOutput: string[][] = []

    for (const testCase of challenge.testCases) {
      const output = await verifyTestCase(testCase, code)
      if (output) userOutput.push(output)
    }

    playAudio('running-code.wav')

    if (userOutput.length) {
      setUserOutput(userOutput)
      router.push(`${ROUTES.private.challenge}/${challenge.slug}/result`)
    }
  }

  function handleCodeChange(value: string) {
    localStorage.setItem(STORAGE.keys.challengeCode, value)
    previousUserCode.current = userCode.current
    userCode.current = value
  }

  const handleCodeEditorHeight = useCallback(() => {
    setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
  }, [])

  useEffect(() => {
    if (!userCode?.current && challenge) userCode.current = initialCode
  }, [challenge, initialCode])

  useEffect(() => {
    if (layout) {
      handleCodeEditorHeight()
    }
  }, [layout, handleCodeEditorHeight])

  useEffect(() => {
    window.addEventListener('resize', handleCodeEditorHeight)

    return () => {
      window.removeEventListener('resize', handleCodeEditorHeight)
    }
  }, [layout, handleCodeEditorHeight])

  return {
    userCode,
    previousUserCode,
    editorContainerRef,
    runCodeButtonRef,
    consoleRef,
    editorRef,
    codeEditorHeight,
    initialCode,
    userOutput,
    handleRunCode,
    handleCodeChange,
  }
}
