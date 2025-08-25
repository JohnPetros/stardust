import type { PropsWithChildren } from 'react'

import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '../Dialog'
import { RangeInput } from '../RadioInput'
import { Switch } from '../Switch'

type Props = {
  isEnabled: boolean
  volume: number
  pitch: number
  rate: number
  onVolumeChange: (volume: number) => void
  onPitchChange: (pitch: number) => void
  onRateChange: (rate: number) => void
  handleEnableToggle: () => void
}

export const SpeakerSettingsDialogView = ({
  isEnabled,
  children,
  volume,
  pitch,
  rate,
  onVolumeChange,
  onPitchChange,
  onRateChange,
  handleEnableToggle,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Configurações de sintetizador de voz</DialogHeader>

        <div className='mt-6 space-y-6'>
          <Switch
            label={
              isEnabled ? 'Desativar sintetizador de voz' : 'Ativar sintetizador de voz'
            }
            defaultCheck={isEnabled}
            onCheck={handleEnableToggle}
            className='w-max px-3'
          />

          <div className='flex items-center justify-between'>
            <label htmlFor='pitch' className='text-gray-100'>
              Tom da voz:
            </label>
            <RangeInput
              id='pitch'
              value={pitch}
              min={0.1}
              max={2}
              step={0.1}
              onValueChange={onPitchChange}
            />
          </div>

          <div className='flex items-center justify-between'>
            <label htmlFor='rate' className='text-gray-100'>
              Velocidade da fala:
            </label>
            <RangeInput
              id='rate'
              value={rate}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={onRateChange}
            />
          </div>

          <div className='flex items-center justify-between'>
            <label htmlFor='volume' className='text-gray-100'>
              Volume:
            </label>
            <RangeInput
              id='volume'
              value={volume}
              min={0}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
            />
          </div>
        </div>
      </DialogContent>
      <DialogTrigger className='w-max'>{children}</DialogTrigger>
    </Dialog>
  )
}
