import { useEffect } from 'react'
import { useSpeech } from 'react-text-to-speech'

type Params = {
  text: string
  isEnabled: boolean
  volume: number
  rate: number
  pitch: number
}

export function useSpeaker({ text, isEnabled, volume, rate, pitch }: Params) {
  const { pause, start, isInQueue } = useSpeech({
    text,
    volume,
    rate,
    pitch,
    lang: 'pt-BR',
  })

  function handlePause() {
    pause()
  }

  function handleStart() {
    start()
  }

  useEffect(() => {
    if (isEnabled) {
      start()
    }
  }, [isEnabled])

  return {
    isSpeaking: isInQueue,
    handleStart,
    handlePause,
  }
}
