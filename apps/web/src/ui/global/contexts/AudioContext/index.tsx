'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { AudioContextValue } from './types'
import { useAudioContextProvider } from './useAudioContextProvider'

type Props = {
  isDefaultAudioDisabled: boolean
}

export const AudioContext = createContext({} as AudioContextValue)

export const AudioContextProvider = ({
  children,
  isDefaultAudioDisabled,
}: PropsWithChildren<Props>) => {
  const contextValue = useAudioContextProvider(isDefaultAudioDisabled)

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>
}
