import { useEditor } from '@/hooks/useEditor'

import { Dialog, DialogTitle } from '@/app/components/Dialog'
import { RangeInput } from '@/app/components/RadioInput'
import { X } from '@phosphor-icons/react'

interface SettingsProps {
  isOpen: boolean
  onClose: VoidFunction
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { state, dispatch } = useEditor()

  function handleFontSizeRangeValueChange([value]: number[]) {
    dispatch({ type: 'setFontSize', payload: value })
  }

  function handleTabSizeRangeValueChange([value]: number[]) {
    dispatch({ type: 'setTabSize', payload: value })
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <header className="flex justify-between border-b p-3">
        <DialogTitle className="mx-auto font-semibold text-white text-xl w-full flex justify-between items-center">
          Configurações
          <button onClick={onClose}>
            <X className="text-xl" weight="bold" />
          </button>
        </DialogTitle>
      </header>
      <dl className="space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <dt className="text-gray-100">Tamanho da fonte (px):</dt>
          <dd>
            <RangeInput
              value={state.fontSize}
              min={12}
              max={20}
              step={2}
              onValueChange={handleFontSizeRangeValueChange}
            />
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-gray-100">Tamanho do tab (px):</dt>
          <dd>
            <RangeInput
              value={state.tabSize}
              min={2}
              max={4}
              step={1}
              onValueChange={handleTabSizeRangeValueChange}
            />
          </dd>
        </div>
      </dl>
    </Dialog>
  )
}
