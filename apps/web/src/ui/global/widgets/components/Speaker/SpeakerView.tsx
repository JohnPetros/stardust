import { twMerge } from 'tailwind-merge'
import { Icon } from '../Icon'
import { SpeakerSettingsDialog } from '../SpeakerSettingsDialog'

type Props = {
  isEnabled: boolean
  isSpeaking: boolean
  onStart: () => void
  onPause: () => void
}

export const SpeakerView = ({ isEnabled, isSpeaking, onStart, onPause }: Props) => {
  return (
    <div className='flex items-center gap-1'>
      <button
        type='button'
        onClick={isEnabled ? onStart : onPause}
        disabled={!isEnabled}
        className={twMerge('hover:opacity-50 duration-700', !isEnabled && 'opacity-50')}
      >
        {isSpeaking ? <Icon name='pause' size={18} /> : <Icon name='start' size={18} />}
      </button>
      <SpeakerSettingsDialog>
        <button type='button' className='hover:opacity-50 duration-700'>
          {isEnabled ? (
            <Icon name='speaker-on' size={18} />
          ) : (
            <Icon name='speaker-off' size={18} />
          )}
        </button>
      </SpeakerSettingsDialog>
    </div>
  )
}
