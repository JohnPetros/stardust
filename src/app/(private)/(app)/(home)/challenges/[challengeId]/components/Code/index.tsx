'use client'

import { KeyboardEvent, useRef, useState } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Button } from '@/app/components/Button'
import { CodeEditor, CodeEditorRef } from '@/app/components/CodeEditor'
import { IconButton } from './IconButton'
import {
  ArrowClockwise,
  ArrowsOutSimple,
  Command,
  Code as CodeIcon,
  Gear,
} from '@phosphor-icons/react'
import { ModalRef, Modal } from '@/app/components/Modal'
import { ToastRef, Toast } from '@/app/components/Toast'
import { Shortcuts } from './Shortcuts'

import { execute } from '@/libs/delegua'

import type { TestCase } from '@/types/challenge'

export function Code() {
  const {
    state: { challenge },
    dispatch,
  } = useChallengeContext()
  const code = useRef(challenge?.code ?? '')
  const errorLine = useRef(0)
  const toastRef = useRef<ToastRef>(null)
  const resetCodeModalRef = useRef<ModalRef>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButton = useRef<HTMLButtonElement>(null)
  const resetCodeButton = useRef<HTMLButtonElement>(null)
  const dictionaryButton = useRef<HTMLButtonElement>(null)
  const shortcutsButton = useRef<HTMLButtonElement>(null)
  const fullScreenButton = useRef<HTMLButtonElement>(null)
  const settingsButton = useRef<HTMLButtonElement>(null)

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

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

  function resetCode() {
    resetCodeModalRef.current?.close()
    codeEditorRef.current?.reloadValue()
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

  function handleResetCode() {
    resetCodeModalRef.current?.open()
  }

  function handleShortcutsOpen() {
    setIsShortcutsOpen(true)
  }

  function handleResetCodeModalClose() {
    resetCodeModalRef.current?.close()
    resetCodeButton.current?.focus()
  }

  function handleCodeChange(value: string) {
    code.current = value
  }

  function handleKeyDown({ shiftKey, key }: KeyboardEvent) {
    if (shiftKey && key.toLowerCase() === 'enter') {
      console.log(shiftKey && key === 'Enter')
      runCodeButton.current?.click()
    }
  }

  if (challenge)
    return (
      <div className="w-full h-full" onKeyDown={handleKeyDown}>
        <Toast ref={toastRef} />
        <div className="flex items-center justify-between bg-gray-700 py-2 px-3">
          <Button
            buttonRef={runCodeButton}
            className="h-6 px-3 text-xs w-max"
            onClick={() => handleRunCode(code.current)}
          >
            Executar
          </Button>
          <ul className="flex items-center gap-3">
            <li>
              <IconButton
                buttonRef={resetCodeButton}
                icon={ArrowClockwise}
                onClick={handleResetCode}
              />
            </li>
            <li>
              <IconButton
                buttonRef={fullScreenButton}
                icon={ArrowsOutSimple}
                onClick={() => {}}
              />
            </li>
            <li>
              <IconButton
                buttonRef={shortcutsButton}
                icon={CodeIcon}
                onClick={handleShortcutsOpen}
              />
            </li>
            <li>
              <IconButton
                buttonRef={dictionaryButton}
                icon={Command}
                onClick={() => {}}
              />
            </li>
            <li>
              <IconButton
                buttonRef={settingsButton}
                icon={Gear}
                onClick={() => {}}
              />
            </li>
          </ul>
        </div>
        <CodeEditor
          ref={codeEditorRef}
          value={challenge.code}
          width="100%"
          height="100%"
          hasMinimap
          onChange={handleCodeChange}
        />

        <Modal
          ref={resetCodeModalRef}
          type={'asking'}
          title={'Tem certeza que deseja resetar o seu código?'}
          body={null}
          footer={
            <div className="grid grid-cols-2 items-center justify-center mt-3 gap-2 w-full">
              <Button tabIndex={0} autoFocus onClick={resetCode}>
                Resetar código
              </Button>
              <Button
                className="bg-red-700 text-gray-100"
                onClick={handleResetCodeModalClose}
              >
                Cancelar
              </Button>
            </div>
          }
          canPlaySong={false}
        />

        <Shortcuts
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      </div>
    )
}
