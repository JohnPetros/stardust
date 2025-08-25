'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { SpeakerContextValue } from './SpeakerContextValue'
import { useSpeakerContextProvider } from './useSpeakerContextProvider'

export const SpeakerContext = createContext({} as SpeakerContextValue)

export const SpeakerContextProvider = ({ children }: PropsWithChildren) => {
  const contextValue = useSpeakerContextProvider()

  return (
    <SpeakerContext.Provider value={contextValue}>{children}</SpeakerContext.Provider>
  )
}
