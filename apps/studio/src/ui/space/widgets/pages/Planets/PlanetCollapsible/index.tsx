import type { Planet } from '@stardust/core/space/entities'
import { PlanetCollapsibleView } from './PlanetCollapsibleView'
import { usePlanetCollapsible } from './usePlanetCollapsible'
import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'

type Props = {
  planet: Planet
}

export const PlanetCollapsible = ({ planet: defaultPlanet }: Props) => {
  const { spaceService } = useRest()
  const toastProvider = useToastProvider()
  const {
    isOpen,
    planet,
    stars,
    handleOpenChange,
    handleStarCreate,
    handleStarDelete,
    handleDragEnd,
  } = usePlanetCollapsible({
    service: spaceService,
    toastProvider,
    defaultPlanet,
  })

  return (
    <PlanetCollapsibleView
      planet={planet}
      stars={stars}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      onCreate={handleStarCreate}
      onDelete={handleStarDelete}
      onDragEnd={handleDragEnd}
    />
  )
}
