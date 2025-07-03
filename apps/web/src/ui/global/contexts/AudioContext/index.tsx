'use client'

import { createContext, type ReactNode } from 'react'

import type { AudioContextValue } from './types'
import { useAudioContextProvider } from './useAudioContextProvider'

type AudioContextProps = {
  children: ReactNode
}

export const AudioContext = createContext({} as AudioContextValue)

export const AudioContextProvider = ({ children }: AudioContextProps) => {
  const { playAudio } = useAudioContextProvider()

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
