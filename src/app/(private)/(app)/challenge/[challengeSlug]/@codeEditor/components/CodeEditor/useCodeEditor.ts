'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ChallengeTestCase } from '@/@types/Challenge'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { ConsoleRef } from '@/global/components/Console'
import { EditorRef } from '@/global/components/Editor'
import { ROUTES, STORAGE } from '@/global/constants'
import { playAudio } from '@/global/helpers'
import { useCode } from '@/services/code'
import { useChallengeStore } from '@/stores/challengeStore'

export function useCodeEditor() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const layout = useChallengeStore((store) => store.state.panelsLayout)
  const userOutput = useChallengeStore((store) => store.state.userOutput)
  const setUserOutput = useChallengeStore(
    (store) => store.actions.setUserOutput
  )

  const { run, getInputCommands, addInput, addFunction, handleError } =
    useCode()

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

  const [codeEditorHeight, setCodeEditorHeight] = useState(0)

  function getErrorLine(line: number) {
    return line > 0 ? `</br>Linha: ${line}` : ''
  }

  function handleCodeError(error: string) {
    const { message, line } = handleError(error)

    const toastMessage = `${message}` + getErrorLine(line)

    toast.show(toastMessage, {
      type: 'error',
      seconds: 5,
    })
  }

  function formatCode(
    code: string,
    { input }: Pick<ChallengeTestCase, 'input'>
  ) {
    if (!input.length || !challenge) return code

    if (challenge.functionName) {
      return addFunction(challenge.functionName, input, code)
    }

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
      const formattedCode = formatCode(code, { input })

      const { output, result } = await run(
        formattedCode,
        Boolean(challenge?.functionName)
      )

      if (challenge?.functionName) {
        return result
      }

      return output
    } catch (error) {
      handleCodeError(String(error))
    }
  }

  async function handleRunCode(code: string) {
    if (!challenge) return

    const userOutput: string[] = []

    for (const testCase of challenge.testCases) {
      const output = await verifyTestCase(testCase, code)
      if (output) userOutput.push(output)
    }

    playAudio('running-code.wav')

    console.log({ userOutput })

    if (userOutput.length) {
      setUserOutput(userOutput)
      router.push(`${ROUTES.private.challenge}/${challenge?.slug}/result`)
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
