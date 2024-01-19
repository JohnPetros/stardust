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

    return new Audio(audioFile)
  }, [audioFile])

  function play() {
    audio?.play()
  }

  return {
    play,
  }
}
