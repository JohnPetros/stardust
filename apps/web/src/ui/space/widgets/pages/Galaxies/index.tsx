'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useEnterGalaxyAction } from '@/ui/space/hooks/useEnterGalaxyAction'
import { useGalaxiesQuery } from '@/ui/space/hooks/useGalaxiesQuery'

import { GalaxiesPageView } from './GalaxiesPageView'
import { useGalaxiesPage } from './useGalaxiesPage'

export function GalaxiesPage() {
  const { galaxies, galaxiesError, isLoadingGalaxies, refetchGalaxies } =
    useGalaxiesQuery()
  const { enterGalaxy, isEnteringGalaxy } = useEnterGalaxyAction()
  const { user, refetchUser } = useAuthContext()
  const { showError } = useToastContext()
  const navigation = useNavigationProvider()
  const page = useGalaxiesPage({
    galaxies,
    galaxiesError,
    isLoadingGalaxies,
    refetchGalaxies,
    enterGalaxy,
    isEnteringGalaxy,
    currentGalaxyName: user?.currentGalaxy?.dto.entity?.name ?? null,
    refetchUser,
    showError,
    navigation,
  })

  return (
    <GalaxiesPageView
      backLabel={page.backLabel}
      galaxies={page.galaxies}
      isLoading={page.isLoading}
      hasError={page.hasError}
      pendingGalaxySlug={page.pendingGalaxySlug}
      onBack={page.handleBack}
      onRetry={page.handleRetry}
      onEnter={page.handleEnter}
    />
  )
}
