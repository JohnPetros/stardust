'use client'

import {
  ArrowClockwise,
  ArrowsOutSimple,
  Code,
  Command,
  Gear,
} from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorSettingsDialog } from '@/app/components/CodeEditorSettingsDialog'
import { DocsDialog } from '@/app/components/DocsDialog'
import { ShortcutsDialog } from '@/app/components/ShortcutsDialog'
import { Tooltip } from '@/app/components/Tooltip'

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
        cancel={<Button className="bg-gray-500 text-gray-100">Cancelar</Button>}
        canPlaySong={false}
      >
        <Toolbar.Button className={toolbarStyles}>
          <Tooltip content="Voltar para o código inicial" direction="bottom">
            <ArrowClockwise className={iconStyles} weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </Alert>

      <DocsDialog>
        <Toolbar.Button className={toolbarStyles}>
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
  )
}
