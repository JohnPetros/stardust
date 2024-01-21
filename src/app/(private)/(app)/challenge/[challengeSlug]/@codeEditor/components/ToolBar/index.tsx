'use client'

import {
  ArrowClockwise,
  ArrowsOutSimple,
  Command,
  Gear,
} from '@phosphor-icons/react'
import { Button as ToolBarButton, Root } from '@radix-ui/react-toolbar'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { CodeEditorSettingsDialog } from '@/app/components/CodeEditorSettingsDialog'
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
        <ToolBarButton className="grid place-content-center">
          <ArrowClockwise className="text-xl text-green-500" weight="bold" />
        </ToolBarButton>
      </Alert>

      <ToolBarButton className="grid place-content-center">
        <ArrowsOutSimple className="text-xl text-green-500" weight="bold" />
      </ToolBarButton>

      <ShortcutsDialog>
        <ToolBarButton className="grid place-content-center">
          <Command className="text-xl text-green-500" weight="bold" />
        </ToolBarButton>
      </ShortcutsDialog>

      <CodeEditorSettingsDialog>
        <ToolBarButton className="grid place-content-center">
          <Gear className="text-xl text-green-500" weight="bold" />
        </ToolBarButton>
      </CodeEditorSettingsDialog>
    </Root>
  )
}
