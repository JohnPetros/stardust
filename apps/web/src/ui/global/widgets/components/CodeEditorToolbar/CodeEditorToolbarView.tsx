'use client'

import type { KeyboardEvent, ReactNode, RefObject } from 'react'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { Button } from '../Button'
import { AlertDialog } from '../AlertDialog'
import { GuidesDialog } from './GuidesDialog'
import { HotkeysDialog } from './HotkeysDialog'
import { CodeEditorSettingsDialog } from './CodeEditorSettingsDialog'

type CodeEditorToolbarProps = {
  children: ReactNode
  originalCode?: string
  runCodeButtonRef: RefObject<HTMLButtonElement | null>
  guidesDialogButtonRef: RefObject<HTMLButtonElement | null>
  isAssistantAllowed: boolean
  onRunCode: () => void
  onKeyDown: (event: KeyboardEvent) => void
  onResetCodeButtonClick: () => void
  onAssistantEnabledChange: () => void
}

export const CodeEditorToolbarView = ({
  children,
  runCodeButtonRef,
  guidesDialogButtonRef,
  isAssistantAllowed,
  onAssistantEnabledChange,
  onResetCodeButtonClick,
  onRunCode,
  onKeyDown,
}: CodeEditorToolbarProps) => {
  return (
    <div onKeyUp={onKeyDown}>
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
                onClick={onResetCodeButtonClick}
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

          {isAssistantAllowed && (
            <Toolbar.Button
              label='Assistente de código'
              icon='ai'
              onClick={onAssistantEnabledChange}
            />
          )}
        </Toolbar.Container>
      </div>
      {children}
    </div>
  )
}
