'use client'

import { type ReactNode, type RefObject, useRef } from 'react'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { Button } from '../Button'
import { AlertDialog } from '../AlertDialog'
import { GuidesDialog } from './GuidesDialog'
import { HotkeysDialog } from './HotkeysDialog'
import { CodeEditorSettingsDialog } from './CodeEditorSettingsDialog'
import { useCodeEditorToolbar } from './useCodeEditorToolbar'
import type { CodeEditorRef } from '../CodeEditor/types'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'

type CodeEditorToolbarProps = {
  children: ReactNode
  originalCode?: string
  codeEditorRef: RefObject<CodeEditorRef | null>
  onRunCode: () => void
}

export function CodeEditorToolbar({
  children,
  originalCode,
  codeEditorRef,
  onRunCode,
}: CodeEditorToolbarProps) {
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const guidesDialogButtonRef = useRef<HTMLButtonElement>(null)
  const { getIsAssistantEnabledSlice } = useChallengeStore()
  const { isAssistantEnabled, setIsAssistantEnabled } = getIsAssistantEnabledSlice()
  const { handleKeyDown, resetCode } = useCodeEditorToolbar({
    originalCode,
    codeEditorRef,
    runCodeButtonRef,
    guidesDialogButtonRef,
  })

  return (
    <div onKeyUp={handleKeyDown}>
      <div className='flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2'>
        <div className='flex items-center gap-4'>
          <Button
            ref={runCodeButtonRef}
            className='h-6 w-max px-3 text-xs'
            onClick={onRunCode}
          >
            Executar
          </Button>
        </div>

        <Toolbar.Container className='flex items-center gap-3'>
          <AlertDialog
            type='asking'
            title='Tem certeza que deseja voltar para o código inicial?'
            body={null}
            action={
              <Button
                tabIndex={0}
                autoFocus
                onClick={resetCode}
                className='bg-red-700 text-gray-100'
              >
                Voltar código
              </Button>
            }
            cancel={<Button className='bg-gray-500 text-gray-100'>Cancelar</Button>}
            shouldPlayAudio={false}
          >
            <Toolbar.Button label='Voltar para o código inicial' icon='reload' />
          </AlertDialog>

          <GuidesDialog>
            <Toolbar.Button ref={guidesDialogButtonRef} label='Guias' icon='code' />
          </GuidesDialog>

          <HotkeysDialog>
            <Toolbar.Button label='Comandos' icon='command' />
          </HotkeysDialog>

          <CodeEditorSettingsDialog>
            <Toolbar.Button label='Configurações' icon='gear' />
          </CodeEditorSettingsDialog>

          <Toolbar.Button
            label='Assistente de código'
            icon='ai'
            onClick={() => setIsAssistantEnabled(!isAssistantEnabled)}
          />
        </Toolbar.Container>
      </div>
      {children}
    </div>
  )
}
