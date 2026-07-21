'use client'

import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'
import { twMerge } from 'tailwind-merge'

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
  isRunCodeLoading?: boolean
  onRunCode: () => void
  onOpenConsole?: () => void
  onKeyDown: (event: KeyboardEvent) => void
  onResetCodeButtonClick: () => void
  onAssistantEnabledChange: () => void
  customActions?: ReactNode
  shouldHideAssistantButton?: boolean
  dragHandle?: {
    attributes: DraggableAttributes
    listeners?: DraggableSyntheticListeners
    setRef: (element: HTMLDivElement | null) => void
  }
}

export const CodeEditorToolbarView = ({
  children,
  runCodeButtonRef,
  guidesDialogButtonRef,
  isAssistantAllowed,
  isRunCodeLoading = false,
  onAssistantEnabledChange,
  onResetCodeButtonClick,
  onRunCode,
  onOpenConsole,
  onKeyDown,
  customActions,
  shouldHideAssistantButton,
  dragHandle,
}: CodeEditorToolbarProps) => {
  const dragHandleProps = (() => {
    if (!dragHandle) return {}

    const { role, tabIndex, ...attributes } = dragHandle.attributes

    return {
      ref: dragHandle.setRef,
      role,
      tabIndex,
      'aria-label': 'Arrastar painel Editor',
      ...dragHandle.listeners,
      ...attributes,
    }
  })()

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: The toolbar wrapper captures editor shortcuts while children keep semantic controls.
    <div onKeyUp={onKeyDown}>
      <div
        {...dragHandleProps}
        className={twMerge(
          'flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2',
          dragHandle && 'cursor-grab active:cursor-grabbing',
        )}
        {...dragHandle?.listeners}
        {...dragHandle?.attributes}
      >
        <div className='flex items-center gap-4'>
          <Button
            ref={runCodeButtonRef}
            className='h-6 w-max px-3 text-xs'
            onClick={onRunCode}
            isLoading={isRunCodeLoading}
          >
            Executar
          </Button>
        </div>

        <Toolbar.Container className='flex items-center gap-3'>
          {customActions}

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

          {onOpenConsole && (
            <Toolbar.Button label='Console' icon='terminal' onClick={onOpenConsole} />
          )}

          <HotkeysDialog>
            <Toolbar.Button label='Comandos' icon='command' />
          </HotkeysDialog>

          <CodeEditorSettingsDialog>
            <Toolbar.Button label='Configurações' icon='gear' />
          </CodeEditorSettingsDialog>

          {isAssistantAllowed && !shouldHideAssistantButton && (
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
