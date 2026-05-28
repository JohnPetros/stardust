import { SpeakerView } from './SpeakerView'
import { useSpeaker } from './useSpeaker'
import { useSpeakerSettings } from './useSpeakerSettings'
import { useStorageAudio } from '@/ui/global/hooks/useStorageAudio'

type Props = {
  fileName?: string
  isActive?: boolean
}

export const Speaker = ({ fileName, isActive = false }: Props) => {
  const { url } = useStorageAudio(fileName)
  const {
    volume,
    rate,
    shouldAutoPlay,
    handleVolumeChange,
    handleRateChange,
    handleAutoPlayToggle,
  } = useSpeakerSettings()

  if (!fileName || !url) return null

  const { audioRef, isPlaying, handleTogglePlay } = useSpeaker({
    url,
    volume,
    rate,
    shouldAutoPlay,
    isActive,
  })

  return (
    <SpeakerView
      url={url}
      audioRef={audioRef}
      isPlaying={isPlaying}
      onTogglePlay={handleTogglePlay}
      volume={volume}
      rate={rate}
      onVolumeChange={handleVolumeChange}
      onRateChange={handleRateChange}
      shouldAutoPlay={shouldAutoPlay}
      onAutoPlayToggle={handleAutoPlayToggle}
    />
  )
}
