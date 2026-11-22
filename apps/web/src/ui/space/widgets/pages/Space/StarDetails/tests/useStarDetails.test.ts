import { act, renderHook } from '@testing-library/react'

import { RestResponse } from '@stardust/core/global/responses'
import { Id, IdsList } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'
import { GalaxyTrail } from '@stardust/core/space/structures'

import { ROUTES } from '@/constants'
import { type Params, useStarDetails } from '../useStarDetails'

describe('useStarDetails', () => {
  const story = StarsFaker.fakeDto({ number: 1, isChallenge: false, slug: 'variaveis' })
  const challenge = StarsFaker.fakeDto({ number: 2, isChallenge: true })
  const locked = StarsFaker.fakeDto({ number: 3, isChallenge: false })
  const planet = Planet.create(
    PlanetsFaker.fakeDto({
      name: 'Aurora',
      position: 1,
      stars: [story, challenge, locked],
    }),
  )
  const planets = [planet]

  let challengingService: { fetchChallengeByStarId: jest.Mock }
  let navigation: { goTo: jest.Mock }
  let showError: jest.Mock
  let playAudio: jest.Mock
  let restartStarAnimation: jest.Mock

  function makeTrail(completed: string[]) {
    return GalaxyTrail.create({
      planets,
      completedStarsIds: IdsList.create(completed),
      openedPlanetsIds: IdsList.create([planet.id.value]),
    })
  }

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useStarDetails({
        planets,
        trail: makeTrail([]),
        selectedStarId: story.id as string,
        challengingService: challengingService as never,
        navigation,
        showError,
        playAudio,
        restartStarAnimation,
        ...params,
      }),
    )

  beforeEach(() => {
    challengingService = { fetchChallengeByStarId: jest.fn() }
    navigation = { goTo: jest.fn() }
    showError = jest.fn()
    playAudio = jest.fn()
    restartStarAnimation = jest.fn()
  })

  it('should describe an available story star', () => {
    const { result } = Hook()

    expect(result.current.details).toEqual(
      expect.objectContaining({
        caption: 'Estrela 1 · Aurora',
        typeLabel: 'História',
        stateLabel: 'Disponível',
        actionLabel: 'Começar história',
        isCompleted: false,
      }),
    )
  })

  it('should describe a completed story star as review', () => {
    const { result } = Hook({ trail: makeTrail([story.id as string]) })

    expect(result.current.details).toEqual(
      expect.objectContaining({
        stateLabel: 'Concluída',
        actionLabel: 'Revisar história',
        isCompleted: true,
      }),
    )
  })

  it('should describe challenge stars by their state', () => {
    const available = Hook({
      selectedStarId: challenge.id as string,
      trail: makeTrail([story.id as string]),
    })
    const completed = Hook({
      selectedStarId: challenge.id as string,
      trail: makeTrail([story.id as string, challenge.id as string]),
    })

    expect(available.result.current.details?.actionLabel).toBe('Começar desafio')
    expect(available.result.current.details?.typeLabel).toBe('Desafio de código')
    expect(completed.result.current.details?.actionLabel).toBe('Revisar desafio')
  })

  it('should omit the description when the star has none', () => {
    const { result } = Hook()

    expect(result.current.details?.description).toBe(
      planet.stars[0].description?.value ?? null,
    )
  })

  it('should have no details for a locked star, an unknown star or without selection', () => {
    expect(
      Hook({ selectedStarId: locked.id as string }).result.current.details,
    ).toBeNull()
    expect(Hook({ selectedStarId: 'unknown' }).result.current.details).toBeNull()
    expect(Hook({ selectedStarId: null }).result.current.details).toBeNull()
    expect(Hook({ trail: null }).result.current.details).toBeNull()
  })

  it('should play the audio, restart the animation and navigate to the lesson', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.handleAction()
    })

    expect(playAudio).toHaveBeenCalledWith('star.wav')
    expect(restartStarAnimation).toHaveBeenCalledWith(story.id)
    expect(navigation.goTo).toHaveBeenCalledWith(ROUTES.lesson.star('variaveis'))
  })

  it('should navigate to the challenge page of a challenge star', async () => {
    challengingService.fetchChallengeByStarId.mockResolvedValue(
      new RestResponse({ body: { slug: 'decolar' } }),
    )
    const { result } = Hook({
      selectedStarId: challenge.id as string,
      trail: makeTrail([story.id as string]),
    })

    await act(async () => {
      await result.current.handleAction()
    })

    expect(challengingService.fetchChallengeByStarId).toHaveBeenCalledWith(
      Id.create(challenge.id as string),
    )
    expect(navigation.goTo).toHaveBeenCalledWith(
      ROUTES.challenging.challenges.challenge('decolar'),
    )
    expect(showError).not.toHaveBeenCalled()
  })

  it('should show an error without navigating when the challenge star has no challenge', async () => {
    challengingService.fetchChallengeByStarId.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'not found' }),
    )
    const { result } = Hook({
      selectedStarId: challenge.id as string,
      trail: makeTrail([story.id as string]),
    })

    await act(async () => {
      await result.current.handleAction()
    })

    expect(showError).toHaveBeenCalledWith(
      'Não foi possível abrir o desafio. Tente de novo.',
    )
    expect(navigation.goTo).not.toHaveBeenCalled()
  })

  it('should show an error without navigating when the challenge lookup throws', async () => {
    challengingService.fetchChallengeByStarId.mockRejectedValue(new Error('network'))
    const { result } = Hook({
      selectedStarId: challenge.id as string,
      trail: makeTrail([story.id as string]),
    })

    await act(async () => {
      await result.current.handleAction()
    })

    expect(showError).toHaveBeenCalledTimes(1)
    expect(navigation.goTo).not.toHaveBeenCalled()
  })
})
