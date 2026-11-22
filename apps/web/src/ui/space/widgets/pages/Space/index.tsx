'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useSpaceContext } from '@/ui/space/hooks/useSpaceContext'

import { useSpacePage } from './useSpacePage'
import { SpacePageView } from './SpacePageView'

export function SpacePage() {
  const space = useSpaceContext()
  const { user } = useAuthContext()
  const { lg: isMobile } = useBreakpoint()
  const { view, handleFabClick, handleSheetClose } = useSpacePage({
    space,
    isFirstGalaxy: space.isFirstGalaxy,
    hasCompletedSpace: Boolean(user?.hasCompletedSpace.isTrue),
    isMobile,
  })

  return (
    <SpacePageView
      {...view}
      onFabClick={handleFabClick}
      onSheetClose={handleSheetClose}
    />
  )
}
