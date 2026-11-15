import type { useGalaxiesPage } from './useGalaxiesPage'
import type { Props } from './GalaxiesPageView'

export function getGalaxiesPageViewProps(
  page: ReturnType<typeof useGalaxiesPage>,
): Props {
  return {
    backLabel: page.backLabel,
    galaxies: page.galaxies,
    isLoading: page.isLoading,
    hasError: page.hasError,
    pendingGalaxySlug: page.pendingGalaxySlug,
    onBack: page.handleBack,
    onRetry: page.handleRetry,
    onEnter: page.handleEnter,
  }
}
