'use client'

import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'
import { AudioContext } from '..'

export function useAudioContext() {
  const context = useContext(AudioContext)

  if (!context) {
    throw new AppError('useAudioContext must be used inside AudioContext')
  }

  return context
}
