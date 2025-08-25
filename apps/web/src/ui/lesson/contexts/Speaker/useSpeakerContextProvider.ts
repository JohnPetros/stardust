import { useEffect, useMemo, useState } from 'react'

import { STORAGE } from '@/constants/storage'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import type { SpeakerContextValue } from './SpeakerContextValue'

export function useSpeakerContextProvider() {
  const [isEnabled, setIsEnabled] = useState(true)
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
  const [volume, setVolume] = useState(1)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)

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

  useEffect(() => {
    setIsEnabled(Boolean(getIsEnabledStorage()))
    setVolume(getVolumeStorage() ?? 1)
    setRate(getRateStorage() ?? 1)
    setPitch(getPitchStorage() ?? 1)
  }, [getIsEnabledStorage, getVolumeStorage, getRateStorage, getPitchStorage])

  return contextValue
}
