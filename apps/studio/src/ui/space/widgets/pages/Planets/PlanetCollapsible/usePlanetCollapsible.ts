import { useState } from 'react'

import type { ToastProvider } from '@stardust/core/global/interfaces'
import { Planet, Star } from '@stardust/core/space/entities'
import type { SpaceService } from '@stardust/core/space/interfaces'
import { Id } from '@stardust/core/global/structures'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'

type Params = {
  service: SpaceService
  toastProvider: ToastProvider
  defaultPlanet: Planet
}

export function usePlanetCollapsible({ service, toastProvider, defaultPlanet }: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [planet, setPlanet] = useState<Planet>(defaultPlanet)

  async function handleStarCreate() {
    const response = await service.createPlanetStar(planet.id, planet.lastStar)

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
    const starsIds = stars.map((star) => star.value.id)
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

  return {
    isOpen,
    planet,
    stars: planet.stars.map((star) => ({
      index: star.number.value,
      value: star,
    })),
    handleStarCreate,
    handleStarDelete,
    handleOpenChange,
    handleDragEnd,
  }
}
