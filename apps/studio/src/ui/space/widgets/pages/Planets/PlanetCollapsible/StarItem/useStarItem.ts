import { type Id, Logical, Text } from '@stardust/core/global/structures'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { useState } from 'react'
import { ENV } from '@/constants'

type Params = {
  service: SpaceService
  challengingService: ChallengingService
  toastProvider: ToastProvider
  navigationProvider: { openExternal: (url: string) => void }
  starId: Id
  isStarChallenge: Logical
}

export function useStarItem({
  service,
  challengingService,
  toastProvider,
  navigationProvider,
  starId,
  isStarChallenge,
}: Params) {
  const [isChallenge, setIsChallenge] = useState<Logical>(isStarChallenge)

  async function handleStarNameChange(starName: string) {
    const response = await service.editStarName(starId, Text.create(starName))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
  }

  async function handleStarAvailabilityChange(isAvailable: boolean) {
    const response = await service.editStarAvailability(
      starId,
      Logical.create(isAvailable),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
  }

  async function handleStarTypeChange(isChallenge: boolean) {
    const isStarChallenge = Logical.create(isChallenge)
    const response = await service.editStarType(starId, isStarChallenge)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setIsChallenge((isChallenge) => isChallenge.invertValue())
  }

  async function handleChallengeClick() {
    const response = await challengingService.fetchChallengeByStarId(starId)

    if (response.isSuccessful) {
      navigationProvider.openExternal(
        `${ENV.webAppUrl}/challenging/challenge/${response.body.slug}`,
      )
      return
    }

    navigationProvider.openExternal(`${ENV.webAppUrl}/challenging/challenge`)
  }

  return {
    isChallenge,
    handleStarNameChange,
    handleStarAvailabilityChange,
    handleStarTypeChange,
    setIsChallenge,
    handleChallengeClick,
  }
}
