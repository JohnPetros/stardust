'use client'

import { createContext, type ReactNode } from 'react'

import type { AudioContextValue } from './types'
import { useAudioProvider, useAudioContext } from './hooks'

type AudioContextProps = {
  children: ReactNode
}

export const AudioContext = createContext({} as AudioContextValue)

export function AudioProvider({ children }: AudioContextProps) {
  const { playAudio } = useAudioProvider()

  return (
    <AudioContext.Provider
      value={{
        playAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export { useAudioContext }
