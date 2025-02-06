'use client'

import { useCallback } from 'react'
import type { AudioFile } from '../types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useAudioProvider() {
  const { user } = useAuthContext()

  const playAudio = useCallback(
    (audioFile: AudioFile) => {
      if (!user) return
      // new Audio(`/audios/${audioFile}`).play()
    },
    [user],
  )

  return {
    playAudio,
  }
}
