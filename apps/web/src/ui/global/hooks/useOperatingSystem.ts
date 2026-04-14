'use client'

import { useMemo } from 'react'

type OperatingSystemInfo = {
  isMacOS: boolean
  primaryModifierKeyLabel: 'Ctrl' | 'Cmd'
  altModifierKeyLabel: 'Alt' | 'Option'
}

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string
  }
}

export function useOperatingSystem(): OperatingSystemInfo {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        isMacOS: false,
        primaryModifierKeyLabel: 'Ctrl',
        altModifierKeyLabel: 'Alt',
      }
    }

    const navigatorWithUserAgentData = navigator as NavigatorWithUserAgentData
    const platform =
      navigatorWithUserAgentData.userAgentData?.platform ??
      navigatorWithUserAgentData.platform
    const isMacOS = (platform ?? '').toLowerCase().includes('mac')

    return {
      isMacOS,
      primaryModifierKeyLabel: isMacOS ? 'Cmd' : 'Ctrl',
      altModifierKeyLabel: isMacOS ? 'Option' : 'Alt',
    }
  }, [])
}
