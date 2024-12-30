'use client'

import { useMemo } from 'react'
import type { AudioFile } from '../contexts/AudioContext/types'

export function useAudio(audioFile: AudioFile | null) {
  const audio = useMemo(() => {
    if (!audioFile) return null

    const path = `/audios/${audioFile}`

    const audio = new Audio(path)
    return audio
  }, [audioFile])

  function play() {
    audio?.play()
  }

  return {
    play,
  }
}
