'use client'

import type { AudioFile } from '../types'

export function useAudioProvider() {
  function playAudio(audioFile: AudioFile) {
    new Audio(`/audios/${audioFile}`).play()
  }

  return {
    playAudio,
  }
}
