import { useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { NavigationProvider } from '@stardust/core/global/interfaces'
import type { Planet, Star } from '@stardust/core/space/entities'
import type { GalaxyTrail } from '@stardust/core/space/structures'

import { ROUTES } from '@/constants'

export type Params = {
  planets: Planet[]
  trail: GalaxyTrail | null
  selectedStarId: string | null
  challengingService: ChallengingService
  navigation: Pick<NavigationProvider, 'goTo'>
  showError: (message: string) => void
  playAudio: (audio: 'star.wav') => void
  restartStarAnimation: (starId: string) => void
}

export type StarDetails = {
  caption: string
  name: string
  description: string | null
  typeLabel: string
  isChallenge: boolean
  isCompleted: boolean
  stateLabel: string
  actionLabel: string
}

const CHALLENGE_ERROR_MESSAGE = 'Não foi possível abrir o desafio. Tente de novo.'

type Target = { star: Star; planet: Planet; isCompleted: boolean }

type Navigation = Pick<Params, 'challengingService' | 'navigation' | 'showError'>

function findAccessibleStar(
  planets: Planet[],
  trail: GalaxyTrail | null,
  starId: string | null,
): Target | null {
  if (!starId || !trail) return null

  for (const planet of planets) {
    const star = planet.stars.find((star) => star.id.value === starId)
    if (!star) continue

    const state = trail.getStarState(star.id)
    if (state.isAccessible.isFalse) return null

    return { star, planet, isCompleted: state.isCompleted.isTrue }
  }

  return null
}

function buildDetails({ star, planet, isCompleted }: Target): StarDetails {
  const isChallenge = star.isChallenge.isTrue

  return {
    caption: `Estrela ${star.number.value} · ${planet.name.value}`,
    name: star.name.value,
    description: star.description?.value ?? null,
    typeLabel: isChallenge ? 'Desafio de código' : 'História',
    isChallenge,
    isCompleted,
    stateLabel: isCompleted ? 'Concluída' : 'Disponível',
    actionLabel: `${isCompleted ? 'Revisar' : 'Começar'} ${isChallenge ? 'desafio' : 'história'}`,
  }
}

async function openChallenge(
  star: Star,
  { challengingService, navigation, showError }: Navigation,
) {
  try {
    const response = await challengingService.fetchChallengeByStarId(star.id)
    const slug = response.isFailure ? null : response.body.slug
    if (!slug) {
      showError(CHALLENGE_ERROR_MESSAGE)
      return
    }

    navigation.goTo(ROUTES.challenging.challenges.challenge(slug))
  } catch {
    showError(CHALLENGE_ERROR_MESSAGE)
  }
}

async function openStar(star: Star, dependencies: Navigation) {
  if (star.isChallenge.isTrue) {
    await openChallenge(star, dependencies)
    return
  }

  dependencies.navigation.goTo(ROUTES.lesson.star(star.slug.value))
}

export function useStarDetails(params: Params) {
  const { planets, trail, selectedStarId, playAudio, restartStarAnimation } = params
  const [isPending, setIsPending] = useState(false)
  const target = findAccessibleStar(planets, trail, selectedStarId)

  async function handleAction() {
    if (!target || isPending) return

    setIsPending(true)
    playAudio('star.wav')
    restartStarAnimation(target.star.id.value)

    try {
      await openStar(target.star, params)
    } finally {
      setIsPending(false)
    }
  }

  return { details: target ? buildDetails(target) : null, isPending, handleAction }
}
