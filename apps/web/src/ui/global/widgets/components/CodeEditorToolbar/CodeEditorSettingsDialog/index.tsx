import type { ReactNode } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../../Dialog'
import { RangeInput } from '../../RadioInput'
import { useCodeEditorSettingsDialog } from './useCodeEditorSettingsDialog'

type CodeEditorSettingsProps = {
  children: ReactNode
}

export function CodeEditorSettingsDialog({ children }: CodeEditorSettingsProps) {
  const {
    fontSize,
    tabSize,
    handleFontSizeRangeValueChange,
    handleTabSizeRangeValueChange,
  } = useCodeEditorSettingsDialog()

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Configurações</DialogHeader>
        <dl className='mt-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <dt className='text-gray-100'>Tamanho da fonte (px):</dt>
            <dd>
              <RangeInput
                value={fontSize}
                min={12}
                max={20}
                step={2}
                onValueChange={handleFontSizeRangeValueChange}
              />
            </dd>
          </div>
          <div className='flex items-center justify-between'>
            <dt className='text-gray-100'>Tamanho do tab:</dt>
            <dd>
              <RangeInput
                value={tabSize}
                min={2}
                max={4}
                step={2}
                onValueChange={handleTabSizeRangeValueChange}
              />
            </dd>
          </div>
        </dl>
      </DialogContent>

      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
