import type { ReactNode } from 'react'

import * as Dialog from '../../Dialog'
import { RangeInput } from '../../RadioInput'
import { useCodeEditorSettingsDialog } from './useCodeEditorSettingsDialog'
import { Switch } from '../../Switch'

type CodeEditorSettingsProps = {
  children: ReactNode
}

export function CodeEditorSettingsDialog({ children }: CodeEditorSettingsProps) {
  const {
    fontSize,
    tabSize,
    isCodeCheckerEnabled,
    handleFontSizeRangeValueChange,
    handleTabSizeRangeValueChange,
    handleErrorDetectorToggle,
  } = useCodeEditorSettingsDialog()

  return (
    <Dialog.Container>
      <Dialog.Content>
        <Dialog.Header>Configurações</Dialog.Header>
        <div className='mt-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <label htmlFor='fontSize' className='text-gray-100'>
              Tamanho da fonte (px):
            </label>
            <RangeInput
              id='fontSize'
              value={fontSize}
              min={12}
              max={20}
              step={2}
              onValueChange={handleFontSizeRangeValueChange}
            />
          </div>
          <div className='flex items-center justify-between'>
            <label htmlFor='tabSize' className='text-gray-100'>
              Tamanho do tab:
            </label>
            <div>
              <RangeInput
                id='tabSize'
                value={tabSize}
                min={2}
                max={4}
                step={2}
                onValueChange={handleTabSizeRangeValueChange}
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <Switch
                label='Detector de erros'
                defaultCheck={isCodeCheckerEnabled}
                onCheck={handleErrorDetectorToggle}
              />
            </div>
          </div>
        </div>
      </Dialog.Content>

      <Dialog.Trigger>{children}</Dialog.Trigger>
    </Dialog.Container>
  )
}
