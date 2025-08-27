import { SpeakerView } from './SpeakerView'
import { useSpeaker } from './useSpeaker'
import { useSpeakerContext } from '@/ui/global/hooks/useSpeakerContext'

type Props = {
  text: string
}

export const Speaker = ({ text }: Props) => {
  const speakerContext = useSpeakerContext()
  const { isSpeaking, handleStart, handlePause } = useSpeaker({
    text,
    isEnabled: speakerContext?.isEnabled,
    volume: speakerContext?.volume,
    rate: speakerContext?.rate,
    pitch: speakerContext?.pitch,
  })

  const isContextValid = Object.keys(speakerContext).length > 0

  if (isContextValid)
    return (
      <SpeakerView
        isEnabled={speakerContext.isEnabled}
        isSpeaking={isSpeaking}
        onStart={handleStart}
        onPause={handlePause}
      />
    )
}
