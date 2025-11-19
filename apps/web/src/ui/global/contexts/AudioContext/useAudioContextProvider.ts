import { useMemo, useState } from 'react'

import { COOKIES } from '@/constants'
import type { AudioContextValue } from './types'
import { useCookieActions } from '../../hooks/useCookieActions'

export function useAudioContextProvider(isDefaultAudioDisabled: boolean) {
  const { setCookie, deleteCookie } = useCookieActions()
  const [isAudioDisabled, setIsAudioDisabled] = useState(isDefaultAudioDisabled)

  const contextValue: AudioContextValue = useMemo(() => {
    function playAudio(audioFile: string) {
      if (isAudioDisabled) return
      new Audio(`/audios/${audioFile}`).play()
    }

    async function toggleAudioDisability() {
      if (isAudioDisabled) {
        await deleteCookie(COOKIES.isAudioDisabled.key)
        setIsAudioDisabled(true)
      } else {
        await setCookie({ key: COOKIES.isAudioDisabled.key, value: 'true' })
        setIsAudioDisabled(false)
      }
    }

    return {
      isAudioDisabled,
      playAudio,
      toggleAudioDisability,
    }
  }, [isAudioDisabled, setCookie, deleteCookie])

  return contextValue
}
