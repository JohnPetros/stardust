'use client'

import { createContext, ReactNode, RefObject, useRef } from 'react'
import { ArrowClockwise, Code, Command, Gear } from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { useCodeEditorToolbar } from './hooks/useCodeEditorToolbar'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorRef } from '@/app/components/CodeEditor'
import { CodeEditorSettingsDialog } from '@/app/components/CodeEditorSettingsDialog'
import { DocsDialog } from '@/app/components/DocsDialog'
import { ShortcutsDialog } from '@/app/components/ShortcutsDialog'
import { Tooltip } from '@/app/components/Tooltip'

type CodeEditorProviderProps = {
  children: ReactNode
  codeEditorRef: RefObject<CodeEditorRef>
  onRunCode: () => void
  onResetCode: () => void
  onChangeCode: (newCode: string) => void
}

export const CodeEditorToolbarContext = createContext(null)

export function CodeEditorToolbarProvider({
  children,
  codeEditorRef,
  onRunCode,
  onResetCode,
  onChangeCode,
}: CodeEditorProviderProps) {
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const docsDialogButtonRef = useRef<HTMLButtonElement>(null)

  const { handleKeyDown } = useCodeEditorToolbar({
    runCodeButtonRef,
    codeEditorRef,
    onChangeCode,
  })

  const toolbarStyles = 'grid place-content-center'
  const iconStyles = 'text-xl text-green-500'

  return (
    <CodeEditorToolbarContext.Provider value={null}>
      <div onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2">
          <div className="flex items-center gap-4">
            <Button
              buttonRef={runCodeButtonRef}
              className="h-6 w-max px-3 text-xs"
              onClick={onRunCode}
            >
              Executar
            </Button>
          </div>

          <Toolbar.Root className="flex items-center gap-3">
            <Alert
              type="asking"
              title="Tem certeza que deseja voltar para o código inicial?"
              body={null}
              action={
                <Button
                  tabIndex={0}
                  autoFocus
                  onClick={onResetCode}
                  className="bg-red-700 text-gray-100"
                >
                  Voltar código
                </Button>
              }
              cancel={
                <Button className="bg-gray-500 text-gray-100">Cancelar</Button>
              }
              canPlaySong={false}
            >
              <Toolbar.Button className={toolbarStyles}>
                <Tooltip
                  content="Voltar para o código inicial"
                  direction="bottom"
                >
                  <ArrowClockwise className={iconStyles} weight="bold" />
                </Tooltip>
              </Toolbar.Button>
            </Alert>

            <DocsDialog>
              <Toolbar.Button
                ref={docsDialogButtonRef}
                className={toolbarStyles}
              >
                <Tooltip content="Documentação" direction="bottom">
                  <Code className={iconStyles} weight="bold" />
                </Tooltip>
              </Toolbar.Button>
            </DocsDialog>

            <ShortcutsDialog>
              <Toolbar.Button className={toolbarStyles}>
                <Tooltip content="Comandos" direction="bottom">
                  <Command className={iconStyles} weight="bold" />
                </Tooltip>
              </Toolbar.Button>
            </ShortcutsDialog>

            <CodeEditorSettingsDialog>
              <Toolbar.Button className={toolbarStyles}>
                <Tooltip content="Configurações" direction="bottom">
                  <Gear className={iconStyles} weight="bold" />
                </Tooltip>
              </Toolbar.Button>
            </CodeEditorSettingsDialog>
          </Toolbar.Root>
        </div>
        {children}
      </div>
    </CodeEditorToolbarContext.Provider>
  )
}
