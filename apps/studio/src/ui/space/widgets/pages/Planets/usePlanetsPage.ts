import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { UiProvider } from '@stardust/core/ui/interfaces'
import { Name, Image } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'

import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

type Params = {
  planetsDto: PlanetDto[]
  service: SpaceService
  toastProvider: ToastProvider
  uiProvider: UiProvider
}

export function usePlanetsPage({
  planetsDto,
  service,
  toastProvider,
  uiProvider,
}: Params) {
  async function handlePlanetCreate(
    planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>,
  ) {
    const response = await service.createPlanet(
      Name.create(planetDto.name),
      Image.create(planetDto.icon),
      Image.create(planetDto.image),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  async function handleDragEnd(planets: SortableItem<Planet>[]) {
    const response = await service.reorderPlanets(planets.map((planet) => planet.data.id))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      uiProvider.reload()
    }
  }

  return {
    planets: planetsDto.map((planet) => ({
      id: planet.id as string,
      data: Planet.create(planet),
    })),
    handlePlanetCreate,
    handleDragEnd,
  }
}
