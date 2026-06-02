import { useState } from 'react'

import { STORAGE } from '@/constants'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'

export function useSpeakerSettings() {
  const { get: getVolumeStorage, set: setVolumeStorage } = useLocalStorage<number>(
    STORAGE.keys.speakerVolume,
  )
  const { get: getRateStorage, set: setRateStorage } = useLocalStorage<number>(
    STORAGE.keys.speakerRate,
  )
  const { get: getAutoPlayStorage, set: setAutoPlayStorage } = useLocalStorage<boolean>(
    STORAGE.keys.speakerAutoPlay,
  )

  const [volume, setVolume] = useState(getVolumeStorage() ?? 1)
  const [rate, setRate] = useState(getRateStorage() ?? 1)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(Boolean(getAutoPlayStorage()))

  function handleVolumeChange(nextVolume: number) {
    setVolume(nextVolume)
    setVolumeStorage(nextVolume)
  }

  function handleRateChange(nextRate: number) {
    setRate(nextRate)
    setRateStorage(nextRate)
  }

  function handleAutoPlayToggle(isChecked: boolean) {
    setShouldAutoPlay(isChecked)
    setAutoPlayStorage(isChecked)
  }

  return {
    volume,
    rate,
    shouldAutoPlay,
    handleVolumeChange,
    handleRateChange,
    handleAutoPlayToggle,
  }
}
