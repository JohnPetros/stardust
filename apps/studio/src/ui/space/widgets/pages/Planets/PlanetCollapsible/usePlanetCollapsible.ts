import { useState } from 'react'

import { Id } from '@stardust/core/global/structures'
import { Planet, Star } from '@stardust/core/space/entities'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import type { UiProvider } from '@stardust/core/ui/interfaces'

type Params = {
  service: SpaceService
  toastProvider: ToastProvider
  uiProvider: UiProvider
  defaultPlanet: Planet
}

export function usePlanetCollapsible({
  service,
  toastProvider,
  uiProvider,
  defaultPlanet,
}: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [planet, setPlanet] = useState<Planet>(defaultPlanet)

  async function handlePlanetChange(planetDto: PlanetDto) {
    const planet = Planet.create(planetDto)
    const response = await service.updatePlanet(planet)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setPlanet(planet)
  }

  async function handleStarCreate() {
    const response = await service.createPlanetStar(planet.id)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    planet.stars.push(Star.create(response.body))

    setPlanet(Planet.create(planet.dto))
  }

  async function handleStarDelete(id: string) {
    const starId = Id.create(id)
    planet.removeStar(starId)
    const response = await service.deletePlanetStar(planet.id, starId)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setPlanet(Planet.create(planet.dto))
  }

  function handleOpenChange(isOpen: boolean) {
    setIsOpen(isOpen)
  }

  async function handleDragEnd(stars: SortableItem<Star>[]) {
    const starsIds = stars.map((star) => star.data.id)
    const response = await service.reorderPlanetStars(planet.id, starsIds)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setPlanet((planet) => {
      planet.reorderStars(starsIds)
      return Planet.create(planet.dto)
    })
  }

  async function handlePlanetDelete() {
    const response = await service.deletePlanet(planet.id)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      await uiProvider.reload()
    }

    setIsOpen(false)
  }

  return {
    isOpen,
    planet,
    stars: planet.stars.map((star) => ({
      id: star.id.value,
      data: star,
    })),
    handlePlanetChange,
    handleStarCreate,
    handleStarDelete,
    handlePlanetDelete,
    handleOpenChange,
    handleDragEnd,
  }
}
