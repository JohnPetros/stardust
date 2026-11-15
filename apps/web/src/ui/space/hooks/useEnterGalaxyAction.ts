import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { Slug } from '@stardust/core/global/structures'
import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { useRestContext } from '@/ui/global/hooks/useRestContext'

import { GALAXIES_CACHE_KEY } from './useGalaxiesQuery'

export function useEnterGalaxyAction() {
  const { profileService } = useRestContext()
  const { mutate } = useSWRConfig()
  const [isEnteringGalaxy, setIsEnteringGalaxy] = useState(false)

  async function enterGalaxy(galaxySlug: string) {
    setIsEnteringGalaxy(true)

    try {
      const response = await profileService.enterGalaxy(Slug.create(galaxySlug))
      if (response.isFailure) response.throwError()

      await mutate(
        (key) => typeof key === 'string' && key.startsWith(GALAXIES_CACHE_KEY),
        (galaxies?: GalaxySummaryDto[]) =>
          galaxies?.map((galaxy) => ({
            ...galaxy,
            isCurrent: galaxy.slug === galaxySlug,
          })),
        { revalidate: true },
      )
    } finally {
      setIsEnteringGalaxy(false)
    }
  }

  return { enterGalaxy, isEnteringGalaxy }
}
