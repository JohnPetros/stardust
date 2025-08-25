import type { PropsWithChildren } from 'react'

import { useSpeakerContext } from '@/ui/global/hooks/useSpeakerContext'
import { SpeakerSettingsDialogView } from './SpeakerSettingsDialogView'

export function SpeakerSettingsDialog({ children }: PropsWithChildren) {
  const {
    rate,
    pitch,
    volume,
    isEnabled,
    handleRateChange,
    handlePitchChange,
    handleVolumeChange,
    handleEnableToggle,
  } = useSpeakerContext()

  return (
    <SpeakerSettingsDialogView
      rate={rate}
      pitch={pitch}
      volume={volume}
      isEnabled={isEnabled}
      onRateChange={handleRateChange}
      onPitchChange={handlePitchChange}
      onVolumeChange={handleVolumeChange}
      handleEnableToggle={handleEnableToggle}
    >
      {children}
    </SpeakerSettingsDialogView>
  )
}
