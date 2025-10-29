import type { Planet } from '@stardust/core/space/entities'
import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'
import { PlanetCollapsibleView } from './PlanetCollapsibleView'
import { usePlanetCollapsible } from './usePlanetCollapsible'

type Props = {
  planet: Planet
}

export const PlanetCollapsible = ({ planet: defaultPlanet }: Props) => {
  const { spaceService } = useRest()
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
