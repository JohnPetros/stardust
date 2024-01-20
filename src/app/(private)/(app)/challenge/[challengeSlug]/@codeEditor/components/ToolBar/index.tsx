'use client'

import {
  ArrowClockwise,
  ArrowsOutSimple,
  Code,
  Command,
  Gear,
} from '@phosphor-icons/react'
import { Root } from '@radix-ui/react-toolbar'

import { Tool } from './Tool'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorSettings } from '@/app/components/EditorSettingsDialog'
import { ShortcutsDialog } from '@/app/components/ShortcutsDialog'

type ToolBarProps = {
  resetCode: () => void
}

export function ToolBar({ resetCode }: ToolBarProps) {
  return (
    <Root className="flex items-center gap-3">
      <Alert
        type="asking"
        title={'Tem certeza que deseja resetar o seu código?'}
        body={null}
        action={
          <Button tabIndex={0} autoFocus onClick={resetCode}>
            Resetar código
          </Button>
        }
        cancel={<Button className="bg-red-700 text-gray-100">Cancelar</Button>}
        canPlaySong={false}
      >
        <Tool icon={ArrowClockwise} label="Resetar código" />
      </Alert>

      <Tool icon={ArrowsOutSimple} label="" />

      {/* <ShortcutsDialog>
        <Tool icon={Code} label="Ver atalhos do editor de código" />
      </ShortcutsDialog> */}

      <Tool icon={Command} label="Ver atalhos do editor de código" />

      <CodeEditorSettings>
        <Tool
          icon={Gear}
          label="Abrir menu de configurações do editor de código"
        />
      </CodeEditorSettings>
    </Root>
  )
}
