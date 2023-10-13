'use client'

import { KeyboardEvent, useRef, useState } from 'react'

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
import { Settings } from './Settings'
import * as ToolBar from '@radix-ui/react-toolbar'

import { execute } from '@/libs/delegua'

import type { TestCase } from '@/@types/challenge'
import { useChallengeStore } from '@/hooks/useChallengeStore'
import { playSound } from '@/utils/functions'

export function Code() {
  const {
    state: { challenge },
    action: { setUserOutput },
  } = useChallengeStore()

  const code = useRef(challenge?.code ?? '')
  const codeContainer = useRef<HTMLDivElement>(null)
  const errorLine = useRef(0)
  const toastRef = useRef<ToastRef>(null)
  const resetCodeModalRef = useRef<ModalRef>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const resetCodeButtonRef = useRef<HTMLButtonElement>(null)
  const dictionaryButtonRef = useRef<HTMLButtonElement>(null)
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null)
  const fullScreenButtonRef = useRef<HTMLButtonElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
  }

  function handleError(error: Error) {
    const { message } = error

    const toastMessage = message.includes('null')
      ? 'Código inválido'
      : `${message}` + getErrorLine()

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

    playSound('running-code.wav')

    if (userOutput.length) setUserOutput(userOutput)
  }

  function handleResetCode() {
    resetCodeModalRef.current?.open()
  }

  function handleShortcutsOpen() {
    setIsShortcutsOpen(true)
  }

  function handleSettingsOpen() {
    setIsSettingsOpen(true)
  }

  function handleResetCodeModalClose() {
    resetCodeModalRef.current?.close()
    resetCodeButtonRef.current?.focus()
  }

  function handleCodeChange(value: string) {
    code.current = value
  }

  function handleKeyDown({ shiftKey, key }: KeyboardEvent) {
    if (shiftKey && key.toLowerCase() === 'enter') {
      runCodeButtonRef.current?.click()
    }
  }

  const codeContainerHeight = codeContainer.current?.offsetHeight ?? 0

  if (challenge)
    return (
      <div ref={codeContainer} className="w-full" onKeyDown={handleKeyDown}>
        <Toast ref={toastRef} />
        <ToolBar.Root className="flex items-center justify-between bg-gray-700 py-2 px-3 rounded-t-md">
          <ToolBar.Button asChild>
            <Button
              buttonRef={runCodeButtonRef}
              className="h-6 px-3 text-xs w-max"
              onClick={() => handleRunCode(code.current)}
            >
              Executar
            </Button>
          </ToolBar.Button>

          <div className="flex items-center gap-3">
            <IconButton
              buttonRef={resetCodeButtonRef}
              icon={ArrowClockwise}
              onClick={handleResetCode}
            />
            <IconButton
              buttonRef={fullScreenButtonRef}
              icon={ArrowsOutSimple}
              onClick={() => {}}
            />
            <IconButton
              buttonRef={dictionaryButtonRef}
              icon={CodeIcon}
              onClick={handleShortcutsOpen}
            />
            <IconButton
              buttonRef={shortcutsButtonRef}
              icon={Command}
              onClick={handleShortcutsOpen}
            />
            <IconButton
              buttonRef={settingsButtonRef}
              icon={Gear}
              onClick={handleSettingsOpen}
            />
          </div>
        </ToolBar.Root>
        <CodeEditor
          ref={codeEditorRef}
          value={challenge.code}
          width="100%"
          height={codeContainerHeight - 40}
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

        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    )
}
