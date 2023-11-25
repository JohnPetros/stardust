'use client'

import { KeyboardEvent, useRef } from 'react'
import {
  ArrowClockwise,
  ArrowsOutSimple,
  Code as CodeIcon,
  Command,
  Gear,
} from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'

import { IconButton } from './IconButton'
import { Settings } from './Settings'
import { Shortcuts } from './Shortcuts'

import type { TestCase } from '@/@types/challenge'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { Editor, EditorRef } from '@/app/components/Editor'
import { Toast, ToastRef } from '@/app/components/Toast'
import { execute } from '@/libs/delegua'
import { useChallengeStore } from '@/stores/challengeStore'
import { playSound } from '@/utils/helpers'

export function Code() {
  const {
    state: { challenge },
    actions: { setUserOutput },
  } = useChallengeStore()

  const code = useRef(challenge?.code ?? '')
  const codeContainer = useRef<HTMLDivElement>(null)
  const errorLine = useRef(0)
  const toastRef = useRef<ToastRef>(null)
  const editorRef = useRef<EditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)

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
    editorRef.current?.reloadValue()
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

    playSound('running-code.wav')

    if (userOutput.length) setUserOutput(userOutput)
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
        <ToolBar.Root className="flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2">
          <ToolBar.Button asChild>
            <Button
              buttonRef={runCodeButtonRef}
              className="h-6 w-max px-3 text-xs"
              onClick={() => handleRunCode(code.current)}
            >
              Executar
            </Button>
          </ToolBar.Button>

          <div className="flex items-center gap-3">
            <Alert
              type={'asking'}
              title={'Tem certeza que deseja resetar o seu código?'}
              body={null}
              action={
                <Button tabIndex={0} autoFocus onClick={resetCode}>
                  Resetar código
                </Button>
              }
              cancel={
                <Button className="bg-red-700 text-gray-100">Cancelar</Button>
              }
              canPlaySong={false}
            >
              <IconButton icon={ArrowClockwise} />
            </Alert>

            <IconButton icon={ArrowsOutSimple} />
            <Shortcuts>
              <IconButton icon={CodeIcon} />
            </Shortcuts>
            <IconButton icon={Command} />
            <Settings>
              <IconButton icon={Gear} />
            </Settings>
          </div>
        </ToolBar.Root>
        <Editor
          ref={editorRef}
          value={challenge.code}
          width="100%"
          height={codeContainerHeight - 40}
          hasMinimap
          onChange={handleCodeChange}
        />
      </div>
    )
}
