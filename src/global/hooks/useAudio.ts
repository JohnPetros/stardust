'use client'

import { useMemo } from 'react'
export type AudioFile =
  | 'asking.wav'
  | 'crying.wav'
  | 'denying.wav'
  | 'end.mp3'
  | 'star.wav'
  | 'success.wav'
  | 'switch.wav'
  | 'earning.wav'
  | 'fail.wav'
  | 'running-code.wav'

export function useAudio(audioFile: AudioFile | null) {
  const audio = useMemo(() => {
    if (!audioFile) return null

    const path = `/audios/${audioFile}`

    const audio = new Audio(path)
    return audio
  }, [audioFile])

  function play() {
    console.log(audio)
    audio?.play()
  }

  return {
    play,
  }
}
