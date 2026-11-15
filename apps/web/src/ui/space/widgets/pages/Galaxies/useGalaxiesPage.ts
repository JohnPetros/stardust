import { useRef, useState } from 'react'

import type { NavigationProvider } from '@stardust/core/global/interfaces'
import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { ROUTES } from '@/constants'

export type Params = {
  galaxies: GalaxySummaryDto[]
  galaxiesError: string
  isLoadingGalaxies: boolean
  refetchGalaxies: () => void
  enterGalaxy: (galaxySlug: string) => Promise<void>
  isEnteringGalaxy: boolean
  currentGalaxyName: string | null
  refetchUser: () => Promise<unknown>
  showError: (message: string) => void
  navigation: Pick<NavigationProvider, 'goTo'>
}

type EnteringParams = Pick<
  Params,
  'enterGalaxy' | 'isEnteringGalaxy' | 'refetchUser' | 'showError' | 'navigation'
>

function useGalaxyEntering({
  enterGalaxy,
  isEnteringGalaxy,
  refetchUser,
  showError,
  navigation,
}: EnteringParams) {
  const [pendingGalaxySlug, setPendingGalaxySlug] = useState<string | null>(null)
  const isEnteringRef = useRef(false)

  async function handleEnter(galaxy: GalaxySummaryDto) {
    if (galaxy.status !== 'published') return

    if (galaxy.isCurrent) {
      navigation.goTo(ROUTES.galaxy(galaxy.slug))
      return
    }

    if (isEnteringRef.current || isEnteringGalaxy) return

    isEnteringRef.current = true
    setPendingGalaxySlug(galaxy.slug)

    try {
      await enterGalaxy(galaxy.slug)
    } catch {
      showError(`Não foi possível entrar em ${galaxy.name}. Tente de novo.`)
      isEnteringRef.current = false
      setPendingGalaxySlug(null)
      return
    }

    await refetchUser().catch(() => undefined)
    navigation.goTo(ROUTES.galaxy(galaxy.slug))
  }

  return { pendingGalaxySlug, handleEnter }
}

export function useGalaxiesPage({
  galaxies,
  galaxiesError,
  isLoadingGalaxies,
  refetchGalaxies,
  enterGalaxy,
  isEnteringGalaxy,
  currentGalaxyName,
  refetchUser,
  showError,
  navigation,
}: Params) {
  const { pendingGalaxySlug, handleEnter } = useGalaxyEntering({
    enterGalaxy,
    isEnteringGalaxy,
    refetchUser,
    showError,
    navigation,
  })

  const backLabel = currentGalaxyName ? `Voltar para ${currentGalaxyName}` : 'Voltar'
  const hasError = Boolean(galaxiesError) && !isLoadingGalaxies

  function handleBack() {
    navigation.goTo(ROUTES.space)
  }

  function handleRetry() {
    refetchGalaxies()
  }

  return {
    galaxies,
    isLoading: isLoadingGalaxies,
    hasError,
    backLabel,
    pendingGalaxySlug,
    handleBack,
    handleRetry,
    handleEnter,
  }
}
