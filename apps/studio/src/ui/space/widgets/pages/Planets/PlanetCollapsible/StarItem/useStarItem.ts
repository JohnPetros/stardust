import { useEffect, useState } from 'react'

import { Id, Logical, Text } from '@stardust/core/global/structures'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ToastProvider, NavigationProvider } from '@stardust/core/global/interfaces'

import { ENV } from '@/constants'

type Params = {
  service: SpaceService
  challengingService: ChallengingService
  toastProvider: ToastProvider
  navigationProvider: NavigationProvider
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
  const [selectedChallengeId, setSelectedChallengeId] = useState('')
  const [selectedChallengeTitle, setSelectedChallengeTitle] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchSelectedChallengeByStar() {
      if (isStarChallenge.isFalse) {
        if (isMounted) setSelectedChallengeId('')
        if (isMounted) setSelectedChallengeTitle('')
        return
      }

      const response = await challengingService.fetchChallengeByStarId(starId)

      if (!isMounted) {
        return
      }

      if (response.isSuccessful) {
        setSelectedChallengeId(response.body.id ?? '')
        setSelectedChallengeTitle(response.body.title)
        return
      }

      setSelectedChallengeId('')
      setSelectedChallengeTitle('')
    }

    fetchSelectedChallengeByStar()

    return () => {
      isMounted = false
    }
  }, [challengingService, isStarChallenge, starId])

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

    setIsChallenge(isStarChallenge)

    if (!isChallenge) {
      const challengeResponse = await challengingService.fetchChallengeByStarId(starId)

      if (challengeResponse.isFailure || !challengeResponse.body.id) {
        return
      }

      const unlinkResponse = await challengingService.removeChallengeStar(
        Id.create(challengeResponse.body.id),
      )

      if (unlinkResponse.isFailure) {
        toastProvider.showError(unlinkResponse.errorMessage)
        return
      }

      setSelectedChallengeId('')
      setSelectedChallengeTitle('')
    }
  }

  async function handleChallengeLinking(challengeId: string) {
    const currentChallengeResponse =
      await challengingService.fetchChallengeByStarId(starId)

    if (
      currentChallengeResponse.isSuccessful &&
      currentChallengeResponse.body.id &&
      currentChallengeResponse.body.id !== challengeId
    ) {
      const unlinkResponse = await challengingService.removeChallengeStar(
        Id.create(currentChallengeResponse.body.id),
      )

      if (unlinkResponse.isFailure) {
        toastProvider.showError(unlinkResponse.errorMessage)
        return
      }
    }

    if (
      currentChallengeResponse.isSuccessful &&
      currentChallengeResponse.body.id === challengeId
    ) {
      setSelectedChallengeId(currentChallengeResponse.body.id)
      setSelectedChallengeTitle(currentChallengeResponse.body.title)
      toastProvider.showSuccess('Este desafio já está vinculado a esta estrela')
      return
    }

    const linkResponse = await challengingService.editChallengeStar(
      Id.create(challengeId),
      starId,
    )

    if (linkResponse.isFailure) {
      toastProvider.showError(linkResponse.errorMessage)
      return
    }

    setSelectedChallengeId(linkResponse.body.id ?? challengeId)
    setSelectedChallengeTitle(linkResponse.body.title)
    toastProvider.showSuccess('Desafio vinculado com sucesso')
  }

  async function handleChallengeUnlink() {
    if (!selectedChallengeId) {
      return
    }

    const response = await challengingService.removeChallengeStar(
      Id.create(selectedChallengeId),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setSelectedChallengeId('')
    setSelectedChallengeTitle('')
    toastProvider.showSuccess('Desafio desvinculado com sucesso')
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
    selectedChallengeId,
    selectedChallengeTitle,
    handleChallengeLinking,
    handleChallengeUnlink,
    handleChallengeClick,
  }
}
