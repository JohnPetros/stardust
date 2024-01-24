'use client'

import {
  ArrowClockwise,
  ArrowsOutSimple,
  Code,
  Command,
  Gear,
} from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Tooltip } from '@/app/components/@Tooltip'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorSettingsDialog } from '@/app/components/CodeEditorSettingsDialog'
import { DictionaryDialog } from '@/app/components/DictionaryDialog'
import { ShortcutsDialog } from '@/app/components/ShortcutsDialog'

type ToolBarProps = {
  onResetCode: () => void
}

export function CodeEditorToolbar({ onResetCode }: ToolBarProps) {
  const toolbarStyles = 'grid place-content-center'
  const iconStyles = 'text-xl text-green-500'

  return (
    <Toolbar.Root className="flex items-center gap-3">
      <Alert
        type="asking"
        title={'Tem certeza que deseja voltar para o código inicial?'}
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
        cancel={<Button className="bg-gray-500 text-gray-100">Cancelar</Button>}
        canPlaySong={false}
      >
        <Toolbar.Button className={toolbarStyles}>
          <Tooltip content="Voltar para o código inicial" direction="bottom">
            <ArrowClockwise className={iconStyles} weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </Alert>

      <Toolbar.Button className={toolbarStyles}>
        <Tooltip content="Tela cheia" direction="bottom">
          <ArrowsOutSimple className={iconStyles} weight="bold" />
        </Tooltip>
      </Toolbar.Button>

      <DictionaryDialog>
        <Toolbar.Button className={toolbarStyles}>
          <Tooltip content="Dicionário" direction="bottom">
            <Code className={iconStyles} weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </DictionaryDialog>

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
  )
}
