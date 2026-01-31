import type { Planet } from '@stardust/core/space/entities'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'
import { PlanetCollapsibleView } from './PlanetCollapsibleView'
import { usePlanetCollapsible } from './usePlanetCollapsible'

type Props = {
  planet: Planet
}

export const PlanetCollapsible = ({ planet: defaultPlanet }: Props) => {
  const { spaceService, storageService } = useRestContext()
  const toastProvider = useToastProvider()
  const uiProvider = useUiProvider()
  const {
    isOpen,
    planet,
    stars,
    handleOpenChange,
    handlePlanetChange,
    handlePlanetDelete,
    handleStarCreate,
    handleStarDelete,
    handleDragEnd,
  } = usePlanetCollapsible({
    service: spaceService,
    toastProvider,
    uiProvider,
    defaultPlanet,
    storageService,
  })

  return (
    <PlanetCollapsibleView
      planet={planet}
      stars={stars}
      isOpen={isOpen}
      onPlanetChange={handlePlanetChange}
      onOpenChange={handleOpenChange}
      onStarCreate={handleStarCreate}
      onStarDelete={handleStarDelete}
      onDragEnd={handleDragEnd}
      onPlanetDelete={handlePlanetDelete}
    />
  )
}
