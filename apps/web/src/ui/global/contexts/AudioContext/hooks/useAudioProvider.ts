'use client'

import { useCallback } from 'react'
import type { AudioFile } from '../types'

export function useAudioProvider() {
  const playAudio = useCallback((audioFile: AudioFile) => {
    new Audio(`/audios/${audioFile}`).play()
  }, [])

  return {
    playAudio,
  }
}
