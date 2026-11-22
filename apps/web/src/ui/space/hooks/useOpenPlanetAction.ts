import { useState } from 'react'

import { Id } from '@stardust/core/global/structures'

import { useRestContext } from '@/ui/global/hooks/useRestContext'

export function useOpenPlanetAction() {
  const { profileService } = useRestContext()
  const [openingPlanetId, setOpeningPlanetId] = useState<string | null>(null)

  async function openPlanet(planetId: string) {
    setOpeningPlanetId(planetId)

    try {
      const response = await profileService.openPlanet(Id.create(planetId))
      if (response.isFailure) response.throwError()
    } finally {
      setOpeningPlanetId(null)
    }
  }

  return { openPlanet, openingPlanetId }
}
