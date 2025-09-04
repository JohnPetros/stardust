import { useMemo, useState } from 'react'

import { STORAGE } from '@/constants/storage'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import type { SpeakerContextValue } from './SpeakerContextValue'

export function useSpeakerContextProvider() {
  const {
    get: getIsEnabledStorage,
    set: setIsEnabledStorage,
    remove: removeIsEnabledStorage,
  } = useLocalStorage<boolean>(STORAGE.keys.speakerEnabled)
  const { get: getVolumeStorage, set: setVolumeStorage } = useLocalStorage<number>(
    STORAGE.keys.speakerVolume,
  )
  const { get: getRateStorage, set: setRateStorage } = useLocalStorage<number>(
    STORAGE.keys.speakerRate,
  )
  const { get: getPitchStorage, set: setPitchStorage } = useLocalStorage<number>(
    STORAGE.keys.speakerPitch,
  )
  const [isEnabled, setIsEnabled] = useState(Boolean(getIsEnabledStorage()))
  const [volume, setVolume] = useState(getVolumeStorage() ?? 1)
  const [rate, setRate] = useState(getRateStorage() ?? 1)
  const [pitch, setPitch] = useState(getPitchStorage() ?? 1)

  const contextValue: SpeakerContextValue = useMemo(() => {
    async function handleEnableToggle() {
      setIsEnabled((isEnabled) => !isEnabled)
      if (isEnabled) {
        removeIsEnabledStorage()
      } else {
        setIsEnabledStorage(true)
      }
    }

    async function handleVolumeChange(volume: number) {
      setVolume(volume)
      setVolumeStorage(volume)
    }

    async function handleRateChange(rate: number) {
      setRate(rate)
      setRateStorage(rate)
    }

    async function handlePitchChange(pitch: number) {
      setPitch(pitch)
      setPitchStorage(pitch)
    }

    return {
      isEnabled,
      volume,
      rate,
      pitch,
      handleEnableToggle,
      handleVolumeChange,
      handleRateChange,
      handlePitchChange,
    }
  }, [
    isEnabled,
    volume,
    rate,
    pitch,
    setVolumeStorage,
    setRateStorage,
    setPitchStorage,
    setIsEnabledStorage,
    removeIsEnabledStorage,
  ])

  return contextValue
}
