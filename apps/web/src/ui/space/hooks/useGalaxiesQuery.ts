import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { useCache } from '@/ui/global/hooks/useCache'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

export const GALAXIES_CACHE_KEY = 'galaxies'

export function useGalaxiesQuery() {
  const { spaceService } = useRestContext()

  async function fetchGalaxies() {
    const response = await spaceService.fetchGalaxies()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, error, isLoading, isRefetching, refetch } = useCache<GalaxySummaryDto[]>({
    key: GALAXIES_CACHE_KEY,
    fetcher: fetchGalaxies,
  })

  function refetchGalaxies() {
    void refetch()
  }

  return {
    galaxies: data ?? [],
    galaxiesError: error ? String(error) : '',
    isLoadingGalaxies: isLoading || (isRefetching && !data),
    refetchGalaxies,
  }
}
