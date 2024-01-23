'use client'

import {
  ArrowClockwise,
  ArrowsOutSimple,
  Command,
  Gear,
} from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Tooltip } from '@/app/components/@Tooltip'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorSettingsDialog } from '@/app/components/CodeEditorSettingsDialog'
import { ShortcutsDialog } from '@/app/components/ShortcutsDialog'

type ToolBarProps = {
  onResetCode: () => void
}

export function CodeEditorToolbar({ onResetCode }: ToolBarProps) {
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
        <Toolbar.Button className="grid place-content-center">
          <Tooltip content="Voltar para o código inicial" direction="bottom">
            <ArrowClockwise className="text-xl text-green-500" weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </Alert>

      <Toolbar.Button className="grid place-content-center">
        <Tooltip content="Tela cheia" direction="bottom">
          <ArrowsOutSimple className="text-xl text-green-500" weight="bold" />
        </Tooltip>
      </Toolbar.Button>

      <ShortcutsDialog>
        <Toolbar.Button className="grid place-content-center">
          <Tooltip content="Comandos" direction="bottom">
            <Command className="text-xl text-green-500" weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </ShortcutsDialog>

      <CodeEditorSettingsDialog>
        <Toolbar.Button className="grid place-content-center">
          <Tooltip content="Configurações" direction="bottom">
            <Gear className="text-xl text-green-500" weight="bold" />
          </Tooltip>
        </Toolbar.Button>
      </CodeEditorSettingsDialog>
    </Toolbar.Root>
  )
}
