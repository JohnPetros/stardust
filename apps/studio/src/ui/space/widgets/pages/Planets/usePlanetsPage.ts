import type { ToastProvider } from '@stardust/core/global/interfaces'
import { Name, Image } from '@stardust/core/global/structures'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { UiProvider } from '@stardust/core/ui/interfaces'

type Params = {
  service: SpaceService
  toastProvider: ToastProvider
  uiProvider: UiProvider
}

export function usePlanetsPage({ service, toastProvider, uiProvider }: Params) {
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

  return {
    handlePlanetCreate,
  }
}
