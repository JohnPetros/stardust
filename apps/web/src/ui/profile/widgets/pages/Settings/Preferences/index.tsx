'use client'

import { PreferencesView } from './PreferencesView'
import { usePreferences } from './usePreferences'

export const Preferences = () => {
  const { isAudioDisabled, handleCanPlayAudioChange } = usePreferences()

  return (
    <PreferencesView
      isAudioDisabled={isAudioDisabled}
      handleCanPlayAudioChange={handleCanPlayAudioChange}
    />
  )
}
