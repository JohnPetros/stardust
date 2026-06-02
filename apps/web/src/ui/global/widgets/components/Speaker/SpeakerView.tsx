import type { RefObject } from 'react'

import { Icon } from '../Icon'
import * as Dialog from '../Dialog'
import { RangeInput } from '../RadioInput'
import { Switch } from '../Switch'

type Props = {
  url: string
  audioRef: RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  onTogglePlay: () => void
  volume: number
  rate: number
  onVolumeChange: (volume: number) => void
  onRateChange: (rate: number) => void
  shouldAutoPlay: boolean
  onAutoPlayToggle: (isChecked: boolean) => void
}

export const SpeakerView = ({
  url,
  audioRef,
  isPlaying,
  onTogglePlay,
  volume,
  rate,
  onVolumeChange,
  onRateChange,
  shouldAutoPlay,
  onAutoPlayToggle,
}: Props) => {
  return (
    <div className='flex items-center gap-1'>
      <audio ref={audioRef} src={url} preload='metadata'>
        <track kind='captions' />
      </audio>
      <button
        type='button'
        onClick={onTogglePlay}
        className='duration-700 hover:opacity-50'
        aria-label={isPlaying ? 'Pausar audio do bloco' : 'Reproduzir audio do bloco'}
      >
        {isPlaying ? <Icon name='pause' size={18} /> : <Icon name='start' size={18} />}
      </button>

      <Dialog.Container>
        <Dialog.Content>
          <Dialog.Header>Configuracoes de audio</Dialog.Header>

          <div className='mt-6 space-y-6'>
            <Switch
              label={
                shouldAutoPlay
                  ? 'Desativar reproducao automatica'
                  : 'Ativar reproducao automatica'
              }
              defaultCheck={shouldAutoPlay}
              onCheck={onAutoPlayToggle}
              className='w-max px-3'
            />

            <div className='flex items-center justify-between gap-8'>
              <label htmlFor='speaker-rate' className='text-gray-100'>
                Velocidade:
              </label>
              <RangeInput
                id='speaker-rate'
                value={rate}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={onRateChange}
              />
            </div>

            <div className='flex items-center justify-between gap-8'>
              <label htmlFor='speaker-volume' className='text-gray-100'>
                Volume:
              </label>
              <RangeInput
                id='speaker-volume'
                value={volume}
                min={0}
                max={1}
                step={0.1}
                onValueChange={onVolumeChange}
              />
            </div>
          </div>
        </Dialog.Content>

        <Dialog.Trigger className='w-max'>
          <button
            type='button'
            className='duration-700 hover:opacity-50'
            aria-label='Abrir configuracoes de audio'
          >
            <Icon name='speaker-on' size={18} />
          </button>
        </Dialog.Trigger>
      </Dialog.Container>
    </div>
  )
}
